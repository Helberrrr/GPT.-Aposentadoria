#!/usr/bin/env node
/**
 * Vitrine Autônoma — load tester STAGING LOCAL, somente GET
 *
 * NÃO pode ser apontado para Cloudflare, loja pública, Stripe nem PC porta 3000.
 * Exemplo PowerShell:
 *   $env:CONFIRM_STAGING="1"
 *   node scripts/stress-vitrine-staging.mjs --base http://127.0.0.1:3001 --vus 100 --requests 10
 *
 * 100 VUs x 10 GET = 1000 requests de leitura local; não são transações/pagamentos reais.
 */
import { performance } from 'node:perf_hooks';

function arg(name, fallback) {
  const i = process.argv.indexOf(name);
  return i === -1 ? fallback : process.argv[i + 1];
}
function fail(reason, code=2) {
  console.error(JSON.stringify({status:'BLOCKED',reason}));
  process.exit(code);
}

const base = arg('--base','http://127.0.0.1:3001');
const vus = Number(arg('--vus', '5'));
const perUser = Number(arg('--requests','10'));
const timeoutMs = Number(arg('--timeout-ms','8000'));
let url;

try { url = new URL(base); } catch { fail('Base URL inválida'); }
if (process.env.CONFIRM_STAGING !== '1')
  fail('Segurança: configure CONFIRM_STAGING=1 após confirmar que a loja é uma RÉPLICA local isolada');
if (url.protocol !== 'http:' ||
    !['127.0.0.1','localhost'].includes(url.hostname) ||
    !url.port || Number(url.port) < 1024 || Number(url.port) > 65535 ||
    url.port === '3000' || url.pathname !== '/' || url.search || url.hash ||
    url.username || url.password)
  fail('Alvo deve ser http://127.0.0.1:<porta-de-staging>/ ou localhost, nunca 3000, URL pública ou túnel');
if (!Number.isInteger(vus) || vus < 1 || vus > 100)
  fail('--vus deve ser inteiro de 1 a 100');
if (!Number.isInteger(perUser) || perUser < 1 || perUser > 30 || vus * perUser > 3000)
  fail('--requests deve ser inteiro de 1 a 30, total <= 3000');
if (!Number.isInteger(timeoutMs) || timeoutMs < 500 || timeoutMs > 20000)
  fail('--timeout-ms entre 500 e 20000');

const paths=['/saude', '/', '/p/hn-replay'];
const timings=[], errors=[], codes={}, statusByPath={};
const total = vus*perUser;
let done=0, firstFailure=false;
const started=performance.now();

async function getOnce(path) {
  const start=performance.now();
  let status=0, err=null;
  try {
    const response=await fetch(new URL(path,url), {
      method:'GET',redirect:'manual',signal:AbortSignal.timeout(timeoutMs),
      headers:{'accept':'text/html,application/json'}
    });
    status=response.status;
    // Consome corpo com limite controlado? app pages são pequenas; Web API stream descartado.
    await response.arrayBuffer();
    if (status!==200)err='HTTP '+status;
  } catch(e) {
    err=e?.name==='TimeoutError'?'TIMEOUT':String(e?.name||e).slice(0,80);
  }
  const duration=performance.now()-start;
  timings.push(duration);
  codes[status||'NETWORK']=(codes[status||'NETWORK']||0)+1;
  statusByPath[path] ??={ok:0,failed:0};
  if (err) {
    firstFailure=true;
    statusByPath[path].failed++;
    if(errors.length<20)errors.push({path,error:err,ms:Math.round(duration)});
  } else statusByPath[path].ok++;
  done++;
}
const workers=Array.from({length:vus},(_,worker)=> (async()=>{
  for(let n=0;n<perUser;n++){
    // Detecção de falhas cedo: parar novas requisições para preservar staging.
    if(firstFailure)break;
    const path=paths[(worker+n)%paths.length];
    await getOnce(path);
  }
})());

await Promise.all(workers);
const elapsedMs=Math.max(performance.now()-started,1);
const ordered=[...timings].sort((a,b)=>a-b);
const percentile=(p)=>ordered.length? Math.round(ordered[Math.max(0,Math.ceil(p*ordered.length)-1)]):null;
const result={
  status:errors.length===0 && done===total && percentile(0.95)<=2000?'PASS':'FAIL',
  mode:'LOOPBACK_STAGING_READ_ONLY',
  target:url.origin,
  virtual_users:vus,
  requests_per_user:perUser,
  planned_requests:total,
  completed_requests:done,
  stopped_early:done!==total,
  duration_ms:Math.round(elapsedMs),
  http_status:codes,
  by_path:statusByPath,
  error_count:Object.values(statusByPath).reduce((a,x)=>a+x.failed,0),
  latency_ms:{p50:percentile(0.5),p95:percentile(0.95),p99:percentile(0.99)},
  approximate_rps:Math.round(done*1000/elapsedMs*100)/100,
  errors,
  caveat:'Mede apenas GETs na réplica local. Não mede Stripe real, Cloudflare Tunnel público ou compras.'
};
console.log(JSON.stringify(result,null,2));
if(result.status!=='PASS')process.exitCode=1;

var express = require('express');
var router = express.Router();
const http = require("http");
const BPromise = require("bluebird").Promise;
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
async function testPerformance(func, pid) {
  const {performance} = require('perf_hooks');
  const startTime = performance.now();
  const res = await func(pid);
  const endTime = performance.now();
  const inSeconds = (endTime - startTime) / 1000;
  const rounded = Number(inSeconds).toFixed(3);
  console.log(`Total time: ${rounded}s for pid ${pid}`);
  return res;
}
/* GET home page. */
async function makeRequest(number) {
  await http.get("http://www.7timer.info/bin/astro.php?lon=113.17&lat=23.09&ac=0&lang=en&unit=metric&output=internal&tzshift=0");
  if (number === 1) {
    await sleep(10000);
  }
  return number;
}
router.get('/non-control-flow', async function(req, res, next) {
  const res1 = testPerformance(makeRequest, 1);
  const res2 = testPerformance(makeRequest, 2);
  const res3 = testPerformance(makeRequest, 3);
  const promises = [res1, res2, res3];
  for (let i= 0; i< promises.length; i++ ){
    const number = await promises[i];
    console.log('Number', number)
  }
  res.send('Done');
});

router.get('/control-flow', async function(req, res, next) {

  const pids = [1, 2, 3];
  BPromise.each(pids, async (pid) => {
    const res = await testPerformance(makeRequest, pid);
    console.log('Number', res)
  });
  res.send('Done');
});


/**
 * How
 * @type {Router}
 */
module.exports = router;

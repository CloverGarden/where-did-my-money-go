// Run: node recommend.test.js
const assert = require('assert');
const R = require('./recommend.js');
let n = 0;
function t(name, fn){ fn(); n++; console.log('ok  ' + name); }
const sum = function(a){ return a.reserve + a.savings + a.investment + a.buffer; };
const base = {amount:1000000, today:new Date(2026,9,14), nextIncomeDate:new Date(2026,9,25), weeklySpend:350000,
  upcomingBills:[{label:'Sarah', amount:80000}], everydayBalance:600000, emergencyBalance:250000, emergencyTarget:0, wantsInvestment:true};

t('nextDayOfMonth: later this month', function(){
  assert.deepStrictEqual(R.nextDayOfMonth(new Date(2026,9,14), 25), new Date(2026,9,25)); });
t('nextDayOfMonth: today is payday -> next month', function(){
  assert.deepStrictEqual(R.nextDayOfMonth(new Date(2026,9,25), 25), new Date(2026,10,25)); });
t('nextDayOfMonth: clamps 31 in short month', function(){
  assert.deepStrictEqual(R.nextDayOfMonth(new Date(2026,1,10), 31), new Date(2026,1,28)); });
t('nextDayOfMonth: rolls over the year', function(){
  assert.deepStrictEqual(R.nextDayOfMonth(new Date(2026,11,30), 5), new Date(2027,0,5)); });
t('nextDayOfMonth: invalid day -> null', function(){ assert.strictEqual(R.nextDayOfMonth(new Date(), 0), null); });

t('rejects zero / negative / NaN amounts', function(){
  [0, -5, NaN, 'abc'].forEach(function(a){ assert.strictEqual(R.recommend(Object.assign({}, base, {amount:a})).ok, false); }); });

t('normal case: allocations sum to amount, nothing negative', function(){
  const r = R.recommend(base); assert(r.ok);
  assert.strictEqual(sum(r.allocations), base.amount);
  Object.keys(r.allocations).forEach(function(k){ assert(r.allocations[k] >= 0, k); });
  assert.strictEqual(r.status, 'ok'); });

t('uses the user\'s own data: different spending -> different reserve', function(){
  const a = R.recommend(base), b = R.recommend(Object.assign({}, base, {weeklySpend:700000}));
  assert(b.allocations.reserve > a.allocations.reserve); });

t('emergency fund incomplete -> no investment, savings go to emergency', function(){
  const r = R.recommend(base);
  assert.strictEqual(r.allocations.investment, 0); assert.strictEqual(r.savingsTarget, 'emergency'); });

t('emergency fund full + room -> investment suggested, still sums', function(){
  const r = R.recommend(Object.assign({}, base, {emergencyBalance:5000000}));
  assert(r.allocations.investment > 0); assert.strictEqual(r.savingsTarget, 'main');
  assert.strictEqual(sum(r.allocations), base.amount); });

t('user opted out of investing -> investment is 0', function(){
  const r = R.recommend(Object.assign({}, base, {emergencyBalance:5000000, wantsInvestment:false}));
  assert.strictEqual(r.allocations.investment, 0); });

t('tight budget: keep everything available, never invest or save', function(){
  const r = R.recommend(Object.assign({}, base, {amount:200000, everydayBalance:0}));
  assert.strictEqual(r.status, 'tight'); assert.strictEqual(r.allocations.reserve, 200000);
  assert.strictEqual(r.allocations.savings + r.allocations.investment, 0); });

t('tight budget never recommends investing even if emergency fund is full', function(){
  const r = R.recommend(Object.assign({}, base, {amount:100000, everydayBalance:0, emergencyBalance:9e9}));
  assert.strictEqual(r.allocations.investment, 0); });

t('no history: flagged limited, explained, still valid', function(){
  const r = R.recommend(Object.assign({}, base, {weeklySpend:0}));
  assert(r.ok && r.limited && r.status === 'limited'); assert(r.limitedReasons.length >= 1);
  assert.strictEqual(sum(r.allocations), base.amount); });

t('manual daily budget overrides history and clears the limited flag', function(){
  const r = R.recommend(Object.assign({}, base, {weeklySpend:0, dailySpend:40000}));
  assert.strictEqual(r.limited, false); assert.strictEqual(r.assumptions.dailySpend, 40000); });

t('no income date: assumes 30 days and says so', function(){
  const r = R.recommend(Object.assign({}, base, {nextIncomeDate:null}));
  assert.strictEqual(r.assumptions.days, 30); assert(r.limited); });

t('income due tomorrow still counts at least 1 day', function(){
  const r = R.recommend(Object.assign({}, base, {nextIncomeDate:new Date(2026,9,14)}));
  assert.strictEqual(r.assumptions.days, 1); });

t('suggestions are rounded to the step (except the buffer remainder)', function(){
  const r = R.recommend(base);
  assert.strictEqual(r.allocations.savings % 5000, 0); assert.strictEqual(r.allocations.investment % 5000, 0); });

t('sum invariant holds across many random inputs', function(){
  for(let i = 0; i < 2000; i++){
    const inp = {amount:1 + Math.floor(Math.random() * 5e6), today:new Date(2026,9,14),
      nextIncomeDate:Math.random() < .8 ? new Date(2026,9,14 + 1 + Math.floor(Math.random() * 40)) : null,
      weeklySpend:Math.random() < .7 ? Math.floor(Math.random() * 1e6) : 0,
      dailySpend:Math.random() < .2 ? Math.floor(Math.random() * 100000) : 0,
      upcomingBills:Math.random() < .5 ? [{label:'x', amount:Math.floor(Math.random() * 3e5)}] : [],
      everydayBalance:Math.floor(Math.random() * 2e6), emergencyBalance:Math.floor(Math.random() * 3e6),
      wantsInvestment:Math.random() < .8};
    const r = R.recommend(inp); assert(r.ok);
    assert.strictEqual(sum(r.allocations), inp.amount);
    Object.keys(r.allocations).forEach(function(k){ assert(r.allocations[k] >= 0 && Number.isInteger(r.allocations[k]), k + ' ' + JSON.stringify(inp)); });
  } });

t('checkChoice: blocks negative and over-amount, warns on low reserve', function(){
  const plan = R.recommend(base);
  assert.strictEqual(R.checkChoice(1000000, -1, 0, plan).ok, false);
  assert.strictEqual(R.checkChoice(1000000, 900000, 200000, plan).ok, false);
  const c = R.checkChoice(1000000, 990000, 0, plan);
  assert(c.ok && c.warnings.length >= 1 && c.stays === 10000); });

t('checkChoice: suggested split has no warnings', function(){
  const plan = R.recommend(base), a = plan.allocations;
  const c = R.checkChoice(base.amount, a.savings, a.investment, plan);
  assert(c.ok); assert.strictEqual(c.warnings.length, 0); });

console.log('\n' + n + ' tests passed');
const demo = R.recommend(base);
console.log('\nDemo (Rp1.000.000 received, demo data):', demo.allocations, '\n- ' + demo.lines.join('\n- '));

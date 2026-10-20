/* Monthly Income and Expense Planning — prototype data in localStorage, same pattern as pockets.js.
   A PLANNED budget is kept completely separate from ACTUAL recorded spending (categoryTotals() in app.js);
   this screen only ever compares them, never edits real expenses. */
const PLAN_KEY = 'wdmmg_plan_v1';
const PLAN_CATEGORIES = ['Food', 'Transport', 'Campus', 'Shopping', 'Entertainment', 'Bills', 'Other'];
const PLAN_ESSENTIAL_DEFAULT = {Food: true, Transport: true, Campus: true, Bills: true, Shopping: false, Entertainment: false, Other: false};

function seedPlan(){
  const allowanceEl = document.getElementById('ms-allowance');
  const income = allowanceEl ? parseRp(allowanceEl.value) : 2000000;
  return {
    income: income,
    categories: PLAN_CATEGORIES.map(function(c){ return {name: c, planned: 0, essential: !!PLAN_ESSENTIAL_DEFAULT[c]}; }),
    savingsTarget: 0,
    investmentTarget: 0
  };
}
function loadPlan(){ try{ const s = JSON.parse(localStorage.getItem(PLAN_KEY)); if(s && Array.isArray(s.categories)) return s; }catch(e){} return null; }
function savePlanState(){ try{ localStorage.setItem(PLAN_KEY, JSON.stringify(planState)); }catch(e){} }
let planState = loadPlan(); // seeded lazily on first render, once app.js's DOM/formatRp are ready

function planCategory(name){ return planState.categories.find(function(c){ return c.name === name; }); }
function plannedTotal(essentialOnly){
  return planState.categories.filter(function(c){ return essentialOnly === undefined || c.essential === essentialOnly; })
    .reduce(function(s, c){ return s + (c.planned || 0); }, 0);
}
/* allocations always derivable from the same four numbers — nothing stored redundantly */
function planAllocation(){
  const essential = plannedTotal(true), flexible = plannedTotal(false);
  const savings = planState.savingsTarget || 0, investment = planState.investmentTarget || 0;
  const buffer = planState.income - essential - flexible - savings - investment;
  return {income: planState.income, essential: essential, flexible: flexible, savings: savings, investment: investment, buffer: buffer};
}

function renderPlanScreen(){
  if(!planState) planState = seedPlan();
  document.getElementById('mp-income').value = formatRp(planState.income);
  document.getElementById('mp-savings-target').value = formatRp(planState.savingsTarget);
  document.getElementById('mp-invest-target').value = formatRp(planState.investmentTarget);

  const actual = typeof categoryTotals === 'function' ? categoryTotals() : {};
  document.getElementById('mp-categories').innerHTML = planState.categories.map(function(c){
    const spent = actual[c.name] || 0;
    const over = c.planned > 0 && spent > c.planned;
    return '<div class="card outline">'
      + '<div class="row" style="margin-bottom:8px;"><span style="font-size:13px;font-weight:500;">' + c.name + '</span>'
      + '<button class="pill" style="border:1.5px solid ' + (c.essential ? 'var(--blue)' : 'var(--border)') + ';background:' + (c.essential ? 'var(--blue-bg)' : 'var(--surface)') + ';color:' + (c.essential ? 'var(--blue-dark)' : 'var(--text-secondary)') + ';cursor:pointer;" onclick="togglePlanEssential(\'' + c.name + '\')">' + (c.essential ? 'Essential' : 'Flexible') + '</button></div>'
      + '<input class="input rp-input" style="height:36px;margin-bottom:8px;" value="' + formatRp(c.planned) + '" onchange="updatePlanCategory(\'' + c.name + '\', this.value)">'
      + '<p style="font-size:11px;color:' + (over ? 'var(--coral-dark)' : 'var(--text-secondary)') + ';margin:0;">Actual so far: ' + formatRp(spent) + (over ? ' — over plan' : (c.planned > 0 ? ' of ' + formatRp(c.planned) + ' planned' : '')) + '</p>'
      + '</div>';
  }).join('');

  const a = planAllocation();
  const rows = [
    ['Essential expenses', a.essential, 'text'],
    ['Flexible spending', a.flexible, 'text'],
    ['Savings target', a.savings, 'text'],
    ['Investment contribution', a.investment, 'text']
  ];
  document.getElementById('mp-breakdown').innerHTML = rows.map(function(r){
    return '<div class="row" style="margin-bottom:8px;"><span style="font-size:13px;">' + r[0] + '</span><span style="font-size:13px;font-weight:500;">' + formatRp(r[1]) + '</span></div>';
  }).join('') + '<div class="divider"></div>'
    + '<div class="row"><span style="font-size:13px;font-weight:500;">' + (a.buffer < 0 ? 'Over budget by' : 'Unallocated buffer') + '</span>'
    + '<span style="font-size:13px;font-weight:600;color:' + (a.buffer < 0 ? 'var(--coral-dark)' : 'var(--teal-dark)') + ';">' + formatRp(Math.abs(a.buffer)) + '</span></div>';

  const warn = document.getElementById('mp-warning');
  if(a.buffer < 0){
    warn.style.display = 'block';
    warn.textContent = 'Your planned expenses, savings, and investment add up to more than your income. Consider lowering a flexible category or your savings target.';
  } else {
    warn.style.display = 'none';
  }
}

function updatePlanIncome(val){ planState.income = parseRp(val); savePlanState(); renderPlanScreen(); }
function updatePlanSavingsTarget(val){ planState.savingsTarget = parseRp(val); savePlanState(); renderPlanScreen(); }
function updatePlanInvestTarget(val){ planState.investmentTarget = parseRp(val); savePlanState(); renderPlanScreen(); }
function updatePlanCategory(name, val){ const c = planCategory(name); if(c){ c.planned = parseRp(val); savePlanState(); renderPlanScreen(); } }
function togglePlanEssential(name){ const c = planCategory(name); if(c){ c.essential = !c.essential; savePlanState(); renderPlanScreen(); } }

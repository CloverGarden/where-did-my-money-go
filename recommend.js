/* Savings recommendation: PURE logic, no DOM, no globals. Inputs in, plan + explanation out.
   Works in the browser (window.Recommend) and in Node (module.exports) so it can be unit tested.
   These are suggestions from the user's own numbers, not financial advice. */
(function(root){
  const DEFAULTS = {
    step: 5000,                 // round suggestions to friendly Rupiah amounts
    bufferPct: 0.10,            // extra cushion on top of estimated need
    savingsShare: 0.80,         // share of what's left after the everyday reserve (when not investing)
    savingsShareInvesting: 0.55,
    investShare: 0.25,          // share of what's left, only when investing is suggested
    minAction: 10000,           // don't suggest tiny moves below this
    emergencyDays: 30,          // default emergency target = this many days of spending
    investMinEmergencyPct: 1.0, // emergency fund must be this full before investing is suggested
    fallbackDays: 30,           // used when the next income date is unknown
    maxDays: 62
  };

  function roundDown(n, step){ return Math.max(0, Math.floor(n / step) * step); }
  function roundUp(n, step){ return Math.max(0, Math.ceil(n / step) * step); }
  function dayMs(d){ return Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()); }
  function fmt(n){ return 'Rp' + Math.round(n).toLocaleString('id-ID'); }

  /* Next occurrence of day-of-month `dom` strictly AFTER today (income arriving today is already in the balance). */
  function nextDayOfMonth(today, dom){
    dom = Math.floor(dom);
    if(!(dom >= 1 && dom <= 31)) return null;
    function inMonth(y, m){ return new Date(y, m, Math.min(dom, new Date(y, m + 1, 0).getDate())); }
    let c = inMonth(today.getFullYear(), today.getMonth());
    if(dayMs(c) <= dayMs(today)) c = inMonth(today.getFullYear(), today.getMonth() + 1);
    return c;
  }
  function daysBetween(a, b){ return Math.round((dayMs(b) - dayMs(a)) / 86400000); }

  /* inputs:
       amount            new money received (integer Rp, > 0)
       today             Date
       nextIncomeDate    Date | null
       dailySpend        manual daily budget (Rp); overrides history if > 0
       weeklySpend       last 7 days of spending (Rp), 0/null if unknown
       upcomingBills     [{label, amount}] obligations before next income
       everydayBalance   money already in the pocket used for everyday spending
       emergencyBalance, emergencyTarget (0/null: derived from spending)
       wantsInvestment   boolean (default true)
     returns {ok, allocations:{reserve,savings,investment,buffer}, savingsTarget, status, limited,
              limitedReasons, assumptions, lines}
     allocations always sum to exactly `amount`. */
  function recommend(inp, cfgOverride){
    const cfg = Object.assign({}, DEFAULTS, cfgOverride || {});
    const amount = Math.round(Number(inp.amount));
    if(!(amount > 0)) return {ok:false, error:'Enter an amount first'};

    const limitedReasons = [];

    // days until next income
    let days;
    if(inp.nextIncomeDate){ days = Math.min(cfg.maxDays, Math.max(1, daysBetween(inp.today, inp.nextIncomeDate))); }
    else { days = cfg.fallbackDays; limitedReasons.push('No next income date is set, so I assumed ' + cfg.fallbackDays + ' days.'); }

    // spending estimate: manual budget > last 7 days > rough fallback
    let dailySpend = 0, spendSource = '';
    if(inp.dailySpend > 0){ dailySpend = inp.dailySpend; spendSource = 'your daily budget'; }
    else if(inp.weeklySpend > 0){ dailySpend = inp.weeklySpend / 7; spendSource = 'your last 7 days of spending'; }
    else {
      limitedReasons.push('There isn\'t enough spending history yet, so everyday spending is a rough guess. You can enter your own daily budget.');
      dailySpend = Math.round(amount * 0.6 / days);
      spendSource = 'a rough guess (60% of this amount spread over the period)';
    }

    const bills = (inp.upcomingBills || []).filter(function(b){ return b.amount > 0; });
    const billsTotal = bills.reduce(function(s, b){ return s + b.amount; }, 0);

    const spendNeed = Math.round(dailySpend * days);
    const cushion = Math.round((spendNeed + billsTotal) * cfg.bufferPct);
    const totalNeed = spendNeed + billsTotal + cushion;
    const alreadyCovered = Math.max(0, Math.round(inp.everydayBalance || 0));
    const reserveNeeded = Math.max(0, totalNeed - alreadyCovered);

    // 1) everyday reserve first
    const tight = reserveNeeded >= amount;               // new money doesn't even cover the gap
    const reserve = tight ? amount : Math.min(amount, roundUp(reserveNeeded, cfg.step));
    const rest = amount - reserve;

    // 2) emergency fund before investing
    const emergencyTarget = inp.emergencyTarget > 0 ? inp.emergencyTarget : Math.round(dailySpend * cfg.emergencyDays);
    const emergencyBalance = Math.max(0, inp.emergencyBalance || 0);
    const emergencyGap = Math.max(0, emergencyTarget - emergencyBalance);
    const emergencyPct = emergencyTarget > 0 ? emergencyBalance / emergencyTarget : 1;
    const canInvest = !tight && inp.wantsInvestment !== false && emergencyPct >= cfg.investMinEmergencyPct && rest >= cfg.minAction * 2;

    let savings = 0, investment = 0;
    if(!tight){
      investment = canInvest ? roundDown(rest * cfg.investShare, cfg.step) : 0;
      if(investment < cfg.minAction) investment = 0;
      savings = roundDown(rest * (investment > 0 ? cfg.savingsShareInvesting : cfg.savingsShare), cfg.step);
      if(savings < cfg.minAction) savings = 0;
    }
    const leftover = amount - reserve - savings - investment;   // unallocated buffer, always >= 0
    const savingsTarget = emergencyGap > 0 ? 'emergency' : 'main';

    // explanation: every number shown to the user is accounted for
    const lines = [];
    lines.push('Until your next income (' + days + ' day' + (days === 1 ? '' : 's') + '), I estimate you\'ll need about ' + fmt(spendNeed) + ' for everyday spending, based on ' + spendSource + '.');
    if(billsTotal > 0) lines.push('Upcoming bills and debts you owe add ' + fmt(billsTotal) + '.');
    lines.push('I added a ' + Math.round(cfg.bufferPct * 100) + '% cushion (' + fmt(cushion) + '), so the total is ' + fmt(totalNeed) + '.');
    if(alreadyCovered > 0) lines.push('You already have ' + fmt(alreadyCovered) + ' available for everyday use, so ' + (reserveNeeded > 0 ? 'about ' + fmt(reserveNeeded) + ' more needs to stay available.' : 'nothing more is needed for now.'));
    if(tight){
      lines.push('This amount only just covers your estimated needs, so I suggest keeping all of it available rather than saving or investing right now.');
    } else {
      if(savings > 0) lines.push(emergencyGap > 0
        ? 'Your emergency fund is at ' + Math.round(emergencyPct * 100) + '% of its ' + fmt(emergencyTarget) + ' target, so suggested savings go there first.'
        : 'Your emergency fund is fully funded, so suggested savings can go to the pocket you choose.');
      if(investment > 0) lines.push('Your emergency fund is full and essentials are covered, so you could consider investing a small part. Returns are never guaranteed.');
      else if(inp.wantsInvestment !== false) lines.push('I\'m not suggesting an investment yet. ' + (emergencyPct < cfg.investMinEmergencyPct ? 'Building your emergency fund first keeps you safer.' : 'There isn\'t much left over after essentials.'));
    }
    lines.push('These are suggestions from your own numbers, not financial advice. You choose what to do.');

    const status = tight ? 'tight' : (limitedReasons.length ? 'limited' : 'ok');
    return {ok:true, allocations:{reserve:reserve, savings:savings, investment:investment, buffer:leftover},
      savingsTarget:savingsTarget, status:status, limited:limitedReasons.length > 0, limitedReasons:limitedReasons,
      assumptions:{days:days, dailySpend:Math.round(dailySpend), spendNeed:spendNeed, billsTotal:billsTotal, cushion:cushion, totalNeed:totalNeed,
        alreadyCovered:alreadyCovered, reserveNeeded:reserveNeeded, emergencyTarget:emergencyTarget, emergencyGap:emergencyGap, canInvest:canInvest},
      lines:lines};
  }

  /* Validates what the user typed over the suggestion. "Stays available" = amount - savings - investment.
     Only blocks the impossible (negative, or more than received); everything else is a soft warning. */
  function checkChoice(amount, savings, investment, plan){
    savings = Math.round(savings || 0); investment = Math.round(investment || 0);
    if(savings < 0 || investment < 0) return {ok:false, error:'Amounts can\'t be negative'};
    if(savings + investment > amount) return {ok:false, error:'That\'s more than the amount received'};
    const stays = amount - savings - investment, warnings = [];
    if(plan && plan.ok){
      const need = plan.assumptions.reserveNeeded;
      if(stays < need) warnings.push('This keeps only ' + fmt(stays) + ' of this money available. I estimate you\'ll still need about ' + fmt(need) + ' more before your next income.');
      if(investment > 0 && !plan.assumptions.canInvest) warnings.push('Your emergency fund or everyday needs may not be fully covered yet. Investing is your call, but consider waiting.');
    }
    return {ok:true, stays:stays, warnings:warnings};
  }

  const api = {recommend:recommend, checkChoice:checkChoice, nextDayOfMonth:nextDayOfMonth, daysBetween:daysBetween, DEFAULTS:DEFAULTS};
  if(typeof module !== 'undefined' && module.exports) module.exports = api; else root.Recommend = api;
})(typeof window !== 'undefined' ? window : this);

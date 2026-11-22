const ICONS = {
  home: '<path d="M4 11 12 4l8 7"/><path d="M6 10v9h5v-5h2v5h5v-9"/>',
  chart: '<path d="M4 20V10"/><path d="M11 20V4"/><path d="M18 20v-7"/>',
  users: '<circle cx="9" cy="8" r="3"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="9" r="2.4"/><path d="M15 20c0-2.6 1.9-4.7 4.3-5"/>',
  user: '<circle cx="12" cy="8" r="3.4"/><path d="M5 20c0-3.9 3.1-7 7-7s7 3.1 7 7"/>',
  plus: '<path d="M12 5v14"/><path d="M5 12h14"/>',
  x: '<path d="M6 6l12 12"/><path d="M18 6l-12 12"/>',
  wallet: '<rect x="3" y="7" width="18" height="12" rx="2"/><path d="M3 10h18"/><circle cx="17" cy="14" r="1.2" fill="currentColor" stroke="none"/>',
  coins: '<circle cx="9" cy="9" r="5.5"/><path d="M14.5 10.5a5.5 5.5 0 1 1 0 7.8"/><circle cx="9" cy="9" r="1" fill="currentColor" stroke="none"/>',
  addcircle: '<circle cx="12" cy="12" r="8.5"/><path d="M12 8v8"/><path d="M8 12h8"/>',
  swap: '<path d="M5 8h13"/><path d="M14 4l4 4-4 4"/><path d="M19 16H6"/><path d="M10 12l-4 4 4 4"/>',
  up: '<path d="M12 19V5"/><path d="M6 11l6-6 6 6"/>',
  down: '<path d="M12 5v14"/><path d="M6 13l6 6 6-6"/>',
  food: '<path d="M6 4v5a2 2 0 0 0 4 0V4"/><path d="M8 11v9"/><path d="M17 20V4c-2.2 1.4-3.2 4-3.2 7H17"/>',
  bus: '<rect x="5" y="4" width="14" height="13" rx="3"/><path d="M5 11h14"/><circle cx="9" cy="14.2" r=".9" fill="currentColor" stroke="none"/><circle cx="15" cy="14.2" r=".9" fill="currentColor" stroke="none"/><path d="M7.5 17v2.5"/><path d="M16.5 17v2.5"/>',
  cap: '<path d="M3 9.5 12 5l9 4.5-9 4.5-9-4.5z"/><path d="M7 12v4c0 1.6 2.2 3 5 3s5-1.4 5-3v-4"/>',
  bag: '<path d="M5 8h14l-1 12H6L5 8z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>',
  play: '<rect x="4" y="5" width="16" height="14" rx="3.5"/><path d="M10.2 9.6v4.8l4.2-2.4-4.2-2.4z"/>',
  receipt: '<path d="M6 3.5h12V21l-3-2-3 2-3-2-3 2V3.5z"/><path d="M9.5 8.5h5"/><path d="M9.5 12h5"/>',
  dots: '<circle cx="6.5" cy="12" r="1.4" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/><circle cx="17.5" cy="12" r="1.4" fill="currentColor" stroke="none"/>'
};
function icon(name){
  return '<svg class="icon" viewBox="0 0 24 24">'+ICONS[name]+'</svg>';
}
// inject icons into bottom nav / fab placeholders written as ${icon(...)}
document.body.innerHTML = document.body.innerHTML.replace(/\$\{icon\('(\w+)'\)\}/g, function(_, n){ return icon(n); });

function mascotSVG(expression, size, opts){
  size = size || 64; opts = opts || {};
  const palettes = {
    happy:{body:'#49D9AE', face:'#0E5E48'},
    worried:{body:'#F6C766', face:'#7A5205'},
    critical:{body:'#FF9E76', face:'#8A3E1E'},
    sleepy:{body:'#8FA6FF', face:'#22306B'},
    excited:{body:'#FF8FC0', face:'#7A1846'},
    shocked:{body:'#FFD866', face:'#6B4B02'}
  };
  const p = palettes[expression] || palettes.happy;
  const body = opts.color || p.body;
  let eyes = '<circle cx="23" cy="36" r="3.4" fill="'+p.face+'"/><circle cx="37" cy="36" r="3.4" fill="'+p.face+'"/>';
  let mouth = '<path d="M23 40 Q32 47 41 40" stroke="'+p.face+'" stroke-width="3" fill="none" stroke-linecap="round"/>';
  if(expression==='worried') mouth = '<path d="M23 42 Q32 37 41 42" stroke="'+p.face+'" stroke-width="3" fill="none" stroke-linecap="round"/>';
  if(expression==='critical') mouth = '<ellipse cx="32" cy="41" rx="6" ry="4" fill="'+p.face+'"/>';
  if(expression==='sleepy'){ eyes='<path d="M19 36h8" stroke="'+p.face+'" stroke-width="3" stroke-linecap="round"/><path d="M33 36h8" stroke="'+p.face+'" stroke-width="3" stroke-linecap="round"/>'; mouth='<path d="M27 41 Q32 43 37 41" stroke="'+p.face+'" stroke-width="3" fill="none" stroke-linecap="round"/>'; }
  if(expression==='excited') mouth='<ellipse cx="32" cy="41" rx="7" ry="6" fill="'+p.face+'"/>';
  if(expression==='shocked'){ eyes='<circle cx="23" cy="36" r="4.2" fill="'+p.face+'"/><circle cx="37" cy="36" r="4.2" fill="'+p.face+'"/>'; mouth='<ellipse cx="32" cy="42" rx="5" ry="7" fill="'+p.face+'"/>'; }
  let accessory = '';
  if(opts.accessory==='Sunglasses') accessory='<rect x="17" y="31" width="30" height="8" rx="4" fill="#161A22"/>';
  if(opts.accessory==='Cap') accessory='<path d="M14 20 Q32 6 50 20 L50 24 L14 24 Z" fill="'+p.face+'"/>';
  if(opts.accessory==='Headphones') accessory='<path d="M14 30 Q14 14 32 14 Q50 14 50 30" stroke="'+p.face+'" stroke-width="3" fill="none"/><rect x="10" y="28" width="7" height="12" rx="3" fill="'+p.face+'"/><rect x="47" y="28" width="7" height="12" rx="3" fill="'+p.face+'"/>';
  if(opts.accessory==='Backpack') accessory='<rect x="1" y="26" width="8" height="20" rx="3" fill="'+p.face+'"/>';
  return '<svg viewBox="0 0 64 64" width="'+size+'" height="'+size+'">'+
    '<rect x="4" y="16" width="56" height="40" rx="12" fill="'+body+'"/>'+
    '<rect x="4" y="16" width="56" height="10" rx="6" fill="'+body+'" opacity="0.6"/>'+
    '<circle cx="46" cy="34" r="4" fill="#fff" opacity="0.85"/>'+
    eyes + mouth + accessory +
    '</svg>';
}
let mascotCustom = {expression:'happy', accessory:'Sunglasses', color:null};
const OUTFIT_COLORS = {Casual:null, Student:'#5B9BFF', Business:'#F6C766', Vacation:'#FF9E76'};
function renderMascotCustom(){
  const el = document.getElementById('mascot-custom');
  el.innerHTML = mascotSVG(mascotCustom.expression, el.getBoundingClientRect().width || 88, {color:mascotCustom.color, accessory:mascotCustom.accessory});
}
function selectCustom(group, el, value){
  Array.prototype.forEach.call(el.parentElement.querySelectorAll('.chip'), function(c){ c.classList.remove('selected'); });
  el.classList.add('selected');
  if(group==='outfit') mascotCustom.color = OUTFIT_COLORS[value];
  if(group==='accessory') mascotCustom.accessory = value;
  if(group==='expression') mascotCustom.expression = value.toLowerCase();
  renderMascotCustom();
}
['mascot-splash','mascot-login','mascot-balance','mascot-onb1','mascot-onb3','mascot-afford'].forEach(function(id){
  const el = document.getElementById(id);
  if(el){
    const state = id==='mascot-afford' ? 'worried' : 'happy';
    el.innerHTML = mascotSVG(state, el.getBoundingClientRect().width || 64);
    el.classList.add(state === 'worried' ? 'mascot-wobble' : 'mascot-bounce');
  }
});
renderMascotCustom();

function parseRp(s){ return parseInt(String(s).replace(/[^\d]/g,''),10) || 0; }
function formatRp(n){ return 'Rp' + Math.round(n).toLocaleString('id-ID'); }
function formatRpInput(el){
  const digits = el.value.replace(/[^\d]/g,'');
  el.value = digits ? formatRp(parseInt(digits,10)) : '';
}

/* ---- Home money: now DERIVED from real data (option B — pockets stay separate) ----
   - Available balance   = total across all pockets (totalSavings() in pockets.js)
   - Spent this month    = sum of the recorded expenses
   - Safe-to-spend today = (allowance - spent this month) spread over days left to next allowance
   Spending never moves a pocket here; it only drives the spent / safe-to-spend figures.
   All three recompute on every expense add/edit/delete and every pocket change. */
let safeToSpendToday = 0;

/* monthly allowance from Money Settings (falls back to the demo default) */
function monthlyAllowance(){
  const el = document.getElementById('ms-allowance');
  const v = el ? parseRp(el.value) : 0;
  return v > 0 ? v : 2000000;
}
/* days remaining until the next allowance date set in Money Settings; safe fallback of 20 */
function daysUntilAllowance(){
  const el = document.getElementById('ms-allowance-date');
  const dom = el ? parseInt((el.value.match(/\d+/) || [])[0], 10) : NaN;
  if(isNaN(dom) || typeof Recommend === 'undefined') return 20;
  const today = new Date(), next = Recommend.nextDayOfMonth(today, dom);
  return next ? Math.max(1, Recommend.daysBetween(today, next)) : 20;
}
/* real money available = everything currently held across pockets */
function availableBalanceNow(){
  return typeof totalSavings === 'function' ? totalSavings() : 0;
}
/* real spending this month = sum of recorded expenses */
function spentThisMonthNow(){
  return expenses.reduce(function(s, e){ return s + parseRp(e.amount); }, 0);
}
/* Net money spent from the Main Pocket since midnight today, read from the pocket ledger
   (expense entries minus any refunds). This is the same money that left Main, so it can never
   drift from the balance. Never negative. */
function dayStartTs(){ const n = new Date(); return new Date(n.getFullYear(), n.getMonth(), n.getDate()).getTime(); }
function spentTodayNow(){
  if(typeof pocketState === 'undefined') return 0;
  const start = dayStartTs();
  const net = pocketState.ledger.reduce(function(s, l){
    const isExpense = l.pocketId === MAIN_POCKET_ID && (l.kind === 'expense' || l.kind === 'expense_reversed');
    return (isExpense && l.ts && l.ts >= start) ? s - l.amount : s;
  }, 0);
  return Math.max(0, net);
}

/* Daily limit = what the Main Pocket held this morning ÷ days until the next allowance.
   "This morning" = balance now + what was spent today, so spending today lowers what's LEFT today
   but not the limit itself. Adding money to Main (or moving money out) changes the limit right away. */
function safeToSpendBaseNow(){
  const morning = Math.max(0, pocketBalance(MAIN_POCKET_ID) + spentTodayNow());
  return Math.round(morning / daysUntilAllowance());
}
/* What's still safe to spend for the rest of TODAY: the daily limit minus what you've already
   spent today, floored at 0. */
function safeToSpendTodayNow(){
  return Math.max(0, safeToSpendBaseNow() - spentTodayNow());
}

/* An expense draws its money out of the Main Pocket (id 1), written as a ledger entry so
   the balance (totalSavings()) drops by exactly the expense. Other pockets are untouched.
   Deleting/editing an expense reverses the entry, so money returns to Main. The Main Pocket
   can go negative in this prototype — that's a real signal you've spent past your everyday money. */
const MAIN_POCKET_ID = 1;
function applyExpenseEffect(amount, note){
  amount = Math.round(amount);
  if(!(amount > 0) || typeof addLedger !== 'function') return;
  addLedger(MAIN_POCKET_ID, 'expense', -amount, note || 'Expense');
  savePockets();
}
function reverseExpenseEffect(amount, note){
  amount = Math.round(amount);
  if(!(amount > 0) || typeof addLedger !== 'function') return;
  addLedger(MAIN_POCKET_ID, 'expense_reversed', amount, note || 'Expense removed');
  savePockets();
}

/* ---- Month-over-month change for the balance banner ----
   Last month's balance = every ledger entry stamped before this month began. Entries created
   before timestamps existed have no `ts`, so until a full earlier month exists we say
   "First month tracked" instead of inventing a percentage. */
function monthStartTs(){ const n = new Date(); return new Date(n.getFullYear(), n.getMonth(), 1).getTime(); }
/* `ids` = which pockets to count (null = all of them) */
function lastMonthBalance(ids){
  if(typeof pocketState === 'undefined') return 0;
  const start = monthStartTs();
  return pocketState.ledger.reduce(function(s, l){
    const inScope = !ids || ids.indexOf(l.pocketId) !== -1;
    return (inScope && l.ts && l.ts < start) ? s + l.amount : s;
  }, 0);
}
/* Neutral styling for up and down alike: a bigger balance isn't automatically "better" (it may mean less spent
   or less saved elsewhere), so no green/red judgement here. */
function renderMonthChange(current, ids){
  const el = document.getElementById('home-mom');
  if(!el) return;
  const prev = lastMonthBalance(ids);
  if(!(prev > 0)){ el.textContent = 'First month tracked'; return; }
  const change = Math.round((current - prev) / prev * 100);
  if(change === 0){ el.textContent = 'No change from last month'; return; }
  el.innerHTML = icon(change > 0 ? 'up' : 'down') + (change > 0 ? '+' : '') + change + '% from last month';
}

/* ---- Balance banner view: all pockets, Main Pocket only, or one chosen pocket ----
   Only changes what the banner SHOWS. Safe-to-spend, "Can I afford it?" and the mood keep using
   the real Main Pocket / total, so switching the view can never change a budget. */
let balanceView = {mode:'all', pocketId:null};
let balancePickerOpen = false;

function balanceViewData(){
  if(balanceView.mode === 'main'){
    return {label:'Main Pocket balance', amount:pocketBalance(MAIN_POCKET_ID), ids:[MAIN_POCKET_ID]};
  }
  if(balanceView.mode === 'pocket'){
    const p = getPocket(balanceView.pocketId);
    if(p && !p.archived) return {label:p.name + ' balance', amount:pocketBalance(p.id), ids:[p.id], pocket:p};
    balanceView = {mode:'all', pocketId:null};   // that pocket was archived: fall back to everything
  }
  return {label:'Total balance', amount:availableBalanceNow(), ids:null};
}
function setBalanceScope(mode){
  balanceView = {mode:mode, pocketId:null};
  balancePickerOpen = false;
  renderBalanceBanner();
}
function toggleBalancePicker(){
  balancePickerOpen = !balancePickerOpen;
  renderBalanceBanner();
}
function chooseBalancePocket(id){
  balanceView = {mode:'pocket', pocketId:id};
  balancePickerOpen = false;
  renderBalanceBanner();
}
function renderBalanceBanner(){
  const v = balanceViewData();
  const total = availableBalanceNow();
  document.getElementById('bb-label').textContent = v.label;
  animateValue(document.getElementById('home-balance-amount'), v.amount);

  // chip: one pocket -> its share of the overall balance; otherwise the change from last month
  if(v.pocket){
    const chip = document.getElementById('home-mom');
    chip.textContent = total > 0 ? Math.round(v.amount / total * 100) + '% of your total balance' : 'Share of total not available';
  } else {
    renderMonthChange(v.amount, v.ids);
  }

  document.getElementById('bb-btn-all').classList.toggle('active', balanceView.mode === 'all');
  document.getElementById('bb-btn-main').classList.toggle('active', balanceView.mode === 'main');
  const pick = document.getElementById('bb-btn-pick');
  pick.classList.toggle('active', balanceView.mode === 'pocket');
  pick.innerHTML = (v.pocket ? esc(v.pocket.name) : 'Pick a pocket') + ' &#9662;';

  const picker = document.getElementById('bb-picker');
  picker.style.display = balancePickerOpen ? 'block' : 'none';
  if(balancePickerOpen){
    picker.innerHTML = activePockets().map(function(p){
      const on = balanceView.mode === 'pocket' && balanceView.pocketId === p.id;
      return '<button class="bb-pick-row' + (on ? ' active' : '') + '" onclick="chooseBalancePocket(' + p.id + ')">'
        + '<span>' + POCKET_CATS[p.category] + ' ' + esc(p.name) + '</span><span>' + formatRp(pocketBalance(p.id)) + '</span></button>';
    }).join('');
  }
}

function refreshHomeMoney(){
  const spentThisMonth = spentThisMonthNow();
  const spentToday = spentTodayNow();
  const dailyTarget = safeToSpendBaseNow();
  safeToSpendToday = safeToSpendTodayNow();   // daily target minus what was already spent today
  renderBalanceBanner();
  animateValue(document.getElementById('home-sts-amount'), safeToSpendToday);
  document.getElementById('home-spent-month').textContent = formatRp(spentThisMonth);
  const setText = function(id, v){ const el = document.getElementById(id); if(el) el.textContent = v; };
  setText('home-spent-today', formatRp(spentToday));
  setText('home-daily-limit', formatRp(dailyTarget));
  setText('home-days-left', daysUntilAllowance());
  setText('home-date', new Date().toLocaleDateString('en-US', {month:'short', day:'numeric'}));

  // The remaining amount is the headline; the bar and pill show how much of today's limit is USED.
  const pctLeft = dailyTarget > 0 ? Math.max(0, Math.min(100, Math.round(safeToSpendToday / dailyTarget * 100))) : 0;
  const pctUsed = 100 - pctLeft;
  const bar = document.getElementById('home-sts-bar');
  bar.style.transition = 'none';
  bar.style.width = '0%';
  requestAnimationFrame(function(){
    requestAnimationFrame(function(){
      bar.style.transition = '';
      bar.style.width = pctUsed + '%';
    });
  });
  let barColor, textColor, bg;
  if(pctLeft > 40){ barColor = 'var(--teal)'; textColor = 'var(--teal-dark)'; bg = 'var(--teal-bg)'; }
  else if(pctLeft > 10){ barColor = 'var(--amber)'; textColor = 'var(--amber-dark)'; bg = 'var(--amber-bg)'; }
  else { barColor = 'var(--coral)'; textColor = 'var(--coral-dark)'; bg = 'var(--coral-bg)'; }
  // friendly, non-judgmental wording as the limit gets close or is passed
  const overBy = Math.max(0, spentToday - dailyTarget);
  let msg;
  if(dailyTarget <= 0) msg = "This month's allowance is used up. Hold off on wants where you can.";
  else if(overBy > 0) msg = "A little past today's budget (" + formatRp(overBy) + "). Tomorrow's budget will adjust.";
  else if(pctLeft > 40) msg = "You're on track";
  else if(pctLeft > 10) msg = "Getting close to today's limit. Easy does it.";
  else msg = "Almost at today's limit. A small pause on wants could help.";
  bar.style.background = barColor;
  document.getElementById('home-sts-card').style.background = bg;
  document.getElementById('home-sts-label').style.color = textColor;
  document.getElementById('home-sts-amount').style.color = textColor;
  document.getElementById('home-sts-status').style.color = textColor;
  document.getElementById('home-sts-status').textContent = msg;
  const pill = document.getElementById('home-sts-pill');
  pill.textContent = pctUsed + '% used';
  pill.style.color = textColor;
  renderHomeMascot(pctLeft);
}

/* Quick action: add money from Home, and come back to Home with the back arrow */
function homeAddMoney(){ openAddMoney(); raBack = 'home'; }

/* Mood Wallet reacts ONLY to today's safe-to-spend position (the % of the daily target left).
   Always the plain default mascot — no outfit colour, no accessory. */
function homeMood(pct){
  if(pct > 40) return {expr:'happy',    title:'Your wallet is feeling great!',  sub:"You're doing well. Keep it up."};
  if(pct > 10) return {expr:'worried',  title:'Your wallet is getting nervous', sub:"You've used most of today's budget. Ease off a little."};
  return             {expr:'critical', title:'Your wallet is stressed',        sub:"Little left to spend safely today. Try to hold off on wants."};
}
function renderHomeMascot(pct){
  const el = document.getElementById('mascot-home');
  if(!el) return;
  const mood = homeMood(pct);
  el.innerHTML = mascotSVG(mood.expr, el.getBoundingClientRect().width || 64);  // default mascot, no opts
  el.classList.remove('mascot-bounce', 'mascot-wobble');
  el.classList.add(mood.expr === 'happy' ? 'mascot-bounce' : 'mascot-wobble');
  const t = document.getElementById('mascot-home-title'), s = document.getElementById('mascot-home-sub');
  if(t) t.textContent = mood.title;
  if(s) s.textContent = mood.sub;
  // little meter + hint so the card says WHY, and invites a tap
  const th = moodTheme(mood.expr);
  const fill = document.getElementById('mood-mini-fill'), meta = document.getElementById('mood-home-meta');
  if(fill){ fill.style.width = pct + '%'; fill.style.background = th.bar; }
  if(meta) meta.textContent = pct + '% of today\'s budget left \u00b7 tap to see why';
}

/* ---------- Mood Wallet screen ---------- */
function moodTheme(expr){
  if(expr === 'happy') return {bg:'var(--teal-bg)',  fg:'var(--teal-dark)',  bar:'var(--teal)'};
  if(expr === 'worried') return {bg:'var(--amber-bg)', fg:'var(--amber-dark)', bar:'var(--amber)'};
  return {bg:'var(--coral-bg)', fg:'var(--coral-dark)', bar:'var(--coral)'};
}
function moodWord(expr){ return expr === 'happy' ? 'Great' : (expr === 'worried' ? 'Nervous' : 'Stressed'); }
function moodSnapshot(){
  const limit = safeToSpendBaseNow(), spent = spentTodayNow(), left = safeToSpendTodayNow();
  const pctLeft = limit > 0 ? Math.max(0, Math.min(100, Math.round(left / limit * 100))) : 0;
  return {limit:limit, spent:spent, left:left, pctLeft:pctLeft, days:daysUntilAllowance(), main:pocketBalance(MAIN_POCKET_ID)};
}
const MOOD_LINES = {
  happy:    ['Thanks! I feel rich today.', 'Your budget is looking healthy.', 'Keep it up, we are doing great.', 'Maybe a little saving today?'],
  worried:  ['Hmm, careful with the next one.', 'I am keeping an eye on the budget.', 'A cheaper option would help me relax.', 'Needs first, wants later?'],
  critical: ['Ouch, that was a lot today.', 'Let us pause the wants for now.', 'Tomorrow\'s budget will adjust.', 'Deep breath. We can recover.']
};
let moodTapCount = 0;
function moodTip(s){
  if(s.limit <= 0) return 'There is no spare money in your Main Pocket for daily spending right now. Adding money to Main, or waiting for your next allowance, opens up a daily limit.';
  const start = dayStartTs();
  const today = expenses.filter(function(e){ return e.ts && e.ts >= start; });
  if(!today.length) return 'Nothing logged yet today, so all ' + formatRp(s.left) + ' is still free. If a big purchase is coming, checking it with "Can I afford it?" first keeps the day calm.';
  const byCat = {};
  let total = 0, wants = 0;
  today.forEach(function(e){
    const a = parseRp(e.amount); total += a; byCat[e.category] = (byCat[e.category] || 0) + a;
    if(e.type === 'Want') wants += a;
  });
  const top = Object.keys(byCat).sort(function(a, b){ return byCat[b] - byCat[a]; })[0];
  const wantPct = total > 0 ? Math.round(wants / total * 100) : 0;
  let tip = 'Most of today\'s spending went to ' + top + ' (' + formatRp(byCat[top]) + ', ' + Math.round(byCat[top] / total * 100) + '% of ' + formatRp(total) + ').';
  if(wantPct >= 60 && s.pctLeft <= 40) tip += ' Wants are ' + wantPct + '% of it. Holding off on one would give your budget room back.';
  else if(s.pctLeft > 40) tip += ' You are doing fine: ' + s.pctLeft + '% of today\'s budget is still free.';
  else tip += ' Needs come first. A small pause on wants will help.';
  return tip;
}
function renderMoodScreen(){
  const s = moodSnapshot(), mood = homeMood(s.pctLeft), th = moodTheme(mood.expr);
  const hero = document.getElementById('mood-hero');
  hero.style.background = th.bg;
  ['mood-title', 'mood-sub', 'mood-bubble'].forEach(function(id){ document.getElementById(id).style.color = th.fg; });
  const m = document.getElementById('mood-mascot');
  m.innerHTML = mascotSVG(mood.expr, 120);
  m.classList.remove('mascot-bounce', 'mascot-wobble', 'pet');
  m.classList.add(mood.expr === 'happy' ? 'mascot-bounce' : 'mascot-wobble');
  document.getElementById('mood-title').textContent = mood.title;
  document.getElementById('mood-sub').textContent = mood.sub;
  document.getElementById('mood-bubble').textContent = 'Tap me!';
  document.getElementById('mood-pct').textContent = s.pctLeft + '%';
  document.getElementById('mood-pct').style.color = th.fg;
  document.getElementById('mood-marker').style.left = s.pctLeft + '%';
  document.getElementById('mood-main').textContent = formatRp(s.main);
  document.getElementById('mood-days').textContent = s.days + (s.days === 1 ? ' day' : ' days');
  document.getElementById('mood-limit').textContent = formatRp(s.limit);
  document.getElementById('mood-spent').textContent = formatRp(s.spent);
  document.getElementById('mood-left').textContent = formatRp(s.left);
  document.getElementById('mood-left').style.color = th.fg;
  document.getElementById('mood-tip').textContent = moodTip(s);
  const slider = document.getElementById('mood-whatif');
  const max = Math.max(50000, Math.ceil(Math.max(s.left, s.limit) * 1.5 / 10000) * 10000);
  slider.max = max; slider.value = 0;
  document.getElementById('mood-whatif-max').textContent = formatRp(max);
  renderMoodWhatIf();
}
/* tap the mascot: it reacts with a pop, a brief excited face, and a line that fits today's mood */
function petMascot(){
  const s = moodSnapshot(), mood = homeMood(s.pctLeft);
  const lines = MOOD_LINES[mood.expr];
  document.getElementById('mood-bubble').textContent = lines[moodTapCount++ % lines.length];
  const m = document.getElementById('mood-mascot');
  m.innerHTML = mascotSVG('excited', 120);
  m.classList.remove('pet'); void m.offsetWidth; m.classList.add('pet');
  setTimeout(function(){ m.innerHTML = mascotSVG(mood.expr, 120); m.classList.remove('pet'); }, 650);
}
/* "What if I spend X more today?" -- shows the mood that would follow. Nothing is recorded. */
function renderMoodWhatIf(){
  const s = moodSnapshot(), x = +document.getElementById('mood-whatif').value;
  const leftAfter = Math.max(0, s.left - x);
  const pct = s.limit > 0 ? Math.round(leftAfter / s.limit * 100) : 0;
  const mood = homeMood(pct);
  document.getElementById('mood-whatif-amount').textContent = formatRp(x);
  document.getElementById('mood-whatif-mascot').innerHTML = mascotSVG(mood.expr, 46);
  document.getElementById('mood-whatif-result').textContent = 'Left today: ' + formatRp(leftAfter) + ' \u00b7 ' + moodWord(mood.expr)
    + (x > s.left ? ' (over by ' + formatRp(x - s.left) + ')' : '');
}

let expenses = [
  {note:'Coffee & hangout', amount:'Rp45.000', category:'Entertainment', type:'Want', payment:'E-wallet', date:'Sep 15, 3:20 PM', counted:false},
  {note:'Bus ticket', amount:'Rp8.000', category:'Transport', type:'Need', payment:'Cash', date:'Sep 14, 8:05 AM', counted:false}
];
let quickAdd = {category:'Entertainment', type:'Want', payment:'E-wallet'};
let currentExpenseIndex = null;
let expenseBack = 'home';          // where the Expense details back arrow returns to
let expenseFilter = 'All';         // category filter on the All expenses screen
let editingIndex = null;

function selectChip(el){
  const group = el.dataset.group, value = el.dataset.value;
  quickAdd[group] = value;
  document.querySelectorAll('[data-group="'+group+'"]').forEach(function(c){ c.classList.remove('selected'); });
  el.classList.add('selected');
}
function setChipSelection(group, value){
  document.querySelectorAll('[data-group="'+group+'"]').forEach(function(el){
    el.classList.toggle('selected', el.dataset.value === value);
  });
}

function openQuickAdd(){
  editingIndex = null;
  document.getElementById('qa-amount').value = '';
  document.getElementById('qa-note').value = '';
  quickAdd = {category:'Food', type:'Need', payment:'Cash'};
  setChipSelection('category','Food');
  setChipSelection('type','Need');
  setChipSelection('payment','Cash');
  show('quick-add');
}

/* One icon + colour per category, so the list can be scanned at a glance */
const CATEGORY_STYLE = {
  Food:          {icon:'food',    color:'var(--amber-dark)', bg:'var(--amber-bg)'},
  Transport:     {icon:'bus',     color:'var(--blue-dark)',  bg:'var(--blue-bg)'},
  Campus:        {icon:'cap',     color:'var(--teal-dark)',  bg:'var(--teal-bg)'},
  Shopping:      {icon:'bag',     color:'var(--coral-dark)', bg:'var(--coral-bg)'},
  Entertainment: {icon:'play',    color:'#FFB3D6',           bg:'#3B1B2D'},
  Bills:         {icon:'receipt', color:'#C9BEFF',           bg:'#26204A'},
  Other:         {icon:'dots',    color:'var(--text-secondary)', bg:'var(--surface-2)'}
};
function categoryStyle(c){ return CATEGORY_STYLE[c] || CATEGORY_STYLE.Other; }
/* "Today · 3:20 PM" / "Yesterday · 8:15 AM" / "Sep 14 · 8:05 AM"; older rows without a timestamp show their saved text */
function friendlyDate(e){
  if(!e.ts) return e.date || '';
  const d = new Date(e.ts), n = new Date();
  const time = d.toLocaleTimeString([], {hour:'numeric', minute:'2-digit'});
  const days = Math.round((new Date(n.getFullYear(), n.getMonth(), n.getDate()) - new Date(d.getFullYear(), d.getMonth(), d.getDate())) / 86400000);
  if(days === 0) return 'Today \u00b7 ' + time;
  if(days === 1) return 'Yesterday \u00b7 ' + time;
  return d.toLocaleDateString('en-US', {month:'short', day:'numeric'}) + ' \u00b7 ' + time;
}

/* time part only, for rows already grouped under a day heading */
function friendlyTime(e){
  if(e.ts) return new Date(e.ts).toLocaleTimeString([], {hour:'numeric', minute:'2-digit'});
  const d = String(e.date || ''), k = d.indexOf(',');
  return k >= 0 ? d.slice(k + 1).trim() : d;
}
/* "Today" / "Yesterday" / "Nov 20" heading for the All expenses list */
function dayLabel(e){
  if(!e.ts){ const d = String(e.date || 'Earlier'), k = d.indexOf(','); return k >= 0 ? d.slice(0, k) : d; }
  const d = new Date(e.ts), n = new Date();
  const days = Math.round((new Date(n.getFullYear(), n.getMonth(), n.getDate()) - new Date(d.getFullYear(), d.getMonth(), d.getDate())) / 86400000);
  if(days === 0) return 'Today';
  if(days === 1) return 'Yesterday';
  return d.toLocaleDateString('en-US', {month:'short', day:'numeric'});
}

/* One expense row, used by Home and by All expenses: icon, name, Need/Want tag, category, payment, amount, when */
function expenseRowHTML(e, i, from, timeOnly){
  const s = categoryStyle(e.category);
  const tag = e.type ? '<span class="tag ' + (e.type === 'Need' ? 'need' : 'want') + '">' + esc(e.type) + '</span>' : '';
  return '<div class="card outline exp-row" onclick="openExpense(' + i + ',\'' + from + '\')">'
    + '<span class="exp-ico" style="background:' + s.bg + ';color:' + s.color + ';">' + icon(s.icon) + '</span>'
    + '<div class="exp-meta"><p class="exp-name">' + esc(e.note) + '</p>'
    + '<p class="exp-sub">' + tag + esc(e.category) + (e.payment ? ' \u00b7 ' + esc(e.payment) : '') + '</p></div>'
    + '<div class="exp-right"><span class="exp-amt">' + esc(e.amount) + '</span>'
    + '<span class="exp-when">' + esc(timeOnly ? friendlyTime(e) : friendlyDate(e)) + '</span></div></div>';
}

function renderHomeRecent(){
  const list = document.getElementById('home-recent-list');
  list.innerHTML = expenses.slice(0, 5).map(function(e, i){ return expenseRowHTML(e, i, 'home', false); }).join('')
    || '<div class="card outline"><p style="font-size:13px;color:var(--text-secondary);margin:0;">No expenses yet. Add your first one.</p></div>';
  // one-line summary of what was logged today
  const start = dayStartTs();
  const today = expenses.filter(function(e){ return e.ts && e.ts >= start; });
  const sub = document.getElementById('home-recent-sub');
  if(sub) sub.textContent = today.length
    ? 'Logged today: ' + today.length + (today.length === 1 ? ' expense' : ' expenses') + ' \u00b7 ' + formatRp(today.reduce(function(s, e){ return s + parseRp(e.amount); }, 0))
    : 'Nothing logged today yet.';
}

/* ---- All expenses screen: filter by category, grouped by day, with Need/Want totals ---- */
function setExpenseFilter(cat){ expenseFilter = cat; renderAllExpenses(); }
function renderAllExpenses(){
  const cats = expenses.reduce(function(a, e){ if(a.indexOf(e.category) === -1) a.push(e.category); return a; }, []);
  if(expenseFilter !== 'All' && cats.indexOf(expenseFilter) === -1) expenseFilter = 'All';
  document.getElementById('ex-filters').innerHTML = ['All'].concat(cats).map(function(c){
    return '<button class="f-chip' + (c === expenseFilter ? ' selected' : '') + '" data-cat="' + esc(c) + '" onclick="setExpenseFilter(this.dataset.cat)">' + esc(c) + '</button>';
  }).join('');

  const rows = expenses.map(function(e, i){ return {e:e, i:i}; })
    .filter(function(x){ return expenseFilter === 'All' || x.e.category === expenseFilter; });
  const sum = function(list){ return list.reduce(function(s, x){ return s + parseRp(x.e.amount); }, 0); };
  const need = sum(rows.filter(function(x){ return x.e.type === 'Need'; }));
  const want = sum(rows.filter(function(x){ return x.e.type === 'Want'; }));
  document.getElementById('ex-sum-label').textContent = rows.length + (rows.length === 1 ? ' expense' : ' expenses') + (expenseFilter === 'All' ? '' : ' in ' + expenseFilter);
  document.getElementById('ex-sum-amount').textContent = formatRp(sum(rows));
  document.getElementById('ex-sum-split').textContent = rows.length ? 'Need ' + formatRp(need) + ' \u00b7 Want ' + formatRp(want) : '';

  const groups = [];
  rows.forEach(function(x){
    const label = dayLabel(x.e);
    let g = groups.find(function(g){ return g.label === label; });
    if(!g){ g = {label:label, items:[]}; groups.push(g); }
    g.items.push(x);
  });
  document.getElementById('ex-list').innerHTML = groups.map(function(g){
    return '<div class="day-head"><span>' + esc(g.label) + '</span><span>' + formatRp(sum(g.items)) + '</span></div>'
      + g.items.map(function(x){ return expenseRowHTML(x.e, x.i, 'expenses', true); }).join('');
  }).join('') || '<div class="card outline"><p style="font-size:13px;color:var(--text-secondary);margin:0;">No expenses here yet.</p></div>';
}

function openExpense(i, from){
  currentExpenseIndex = i;
  expenseBack = from || 'home';
  fillExpenseDetail(expenses[i]);
  show('expense-detail');
}

function fillExpenseDetail(e){
  document.getElementById('ed-amount').textContent = e.amount;
  document.getElementById('ed-note').textContent = e.note;
  document.getElementById('ed-category').textContent = e.category;
  const typeEl = document.getElementById('ed-type');
  typeEl.textContent = e.type;
  typeEl.style.background = e.type === 'Need' ? 'var(--teal-bg)' : 'var(--amber-bg)';
  typeEl.style.color = e.type === 'Need' ? 'var(--teal-dark)' : 'var(--amber-dark)';
  document.getElementById('ed-payment').textContent = e.payment;
  document.getElementById('ed-date').textContent = e.date;
}

function editExpense(){
  if(currentExpenseIndex === null) return;
  editingIndex = currentExpenseIndex;
  const e = expenses[editingIndex];
  document.getElementById('qa-amount').value = e.amount;
  document.getElementById('qa-note').value = e.note;
  quickAdd = {category:e.category, type:e.type, payment:e.payment};
  setChipSelection('category', e.category);
  setChipSelection('type', e.type);
  setChipSelection('payment', e.payment);
  show('quick-add');
}

function deleteExpense(){
  if(currentExpenseIndex === null) return;
  const e = expenses[currentExpenseIndex];
  if(e.counted) reverseExpenseEffect(parseRp(e.amount), 'Removed: ' + e.note);
  expenses.splice(currentExpenseIndex, 1);
  currentExpenseIndex = null;
  renderHomeRecent();
  refreshHomeMoney();
  showToast('Expense deleted');
  show(expenseBack);
  if(backendAvailable && e.id){
    apiCall('DELETE', '/expenses/' + e.id).catch(function(){});
  }
}

function saveExpense(){
  const amountEl = document.getElementById('qa-amount');
  const amount = amountEl.value.trim();
  if(!amount || !/\d/.test(amount)){
    amountEl.classList.remove('shake-error');
    void amountEl.offsetWidth;
    amountEl.classList.add('shake-error');
    showToast('Enter an amount first');
    return;
  }
  const note = document.getElementById('qa-note').value.trim() || 'Untitled expense';
  const entry = {
    note: note,
    amount: amount,
    category: quickAdd.category,
    type: quickAdd.type,
    payment: quickAdd.payment,
    date: editingIndex !== null ? expenses[editingIndex].date : new Date().toLocaleString(),
    ts: editingIndex !== null ? (expenses[editingIndex].ts || Date.now()) : Date.now(),
    counted: true
  };
  if(editingIndex !== null){
    const old = expenses[editingIndex];
    entry.id = old.id;
    if(old.counted) reverseExpenseEffect(parseRp(old.amount), 'Edited: ' + old.note);
    applyExpenseEffect(parseRp(entry.amount), entry.note);
    expenses[editingIndex] = entry;
    currentExpenseIndex = editingIndex;
    editingIndex = null;
    showToast('Expense updated');
    if(backendAvailable && entry.id){
      apiCall('PUT', '/expenses/' + entry.id, {note:entry.note, amount:parseRp(entry.amount), category:entry.category, type:entry.type, payment:entry.payment}).catch(function(){});
    }
  } else {
    applyExpenseEffect(parseRp(entry.amount), entry.note);
    expenses.unshift(entry);
    currentExpenseIndex = 0;
    showToast('Expense saved');
    if(backendAvailable){
      apiCall('POST', '/expenses', {note:entry.note, amount:parseRp(entry.amount), category:entry.category, type:entry.type, payment:entry.payment})
        .then(function(res){ entry.id = res.expense.id; })
        .catch(function(){});
    }
  }
  renderHomeRecent();
  refreshHomeMoney();
  fillExpenseDetail(entry);
  show('expense-detail');
}

function exportCSV(){
  const header = ['Note','Amount','Category','Type','Payment','Date'];
  const rows = expenses.map(function(e){
    return [e.note, e.amount, e.category, e.type, e.payment, e.date].map(function(v){
      return '"' + String(v).replace(/"/g,'""') + '"';
    }).join(',');
  });
  const csv = header.join(',') + '\n' + rows.join('\n');
  const blob = new Blob([csv], {type:'text/csv;charset=utf-8;'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'expenses.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('expenses.csv downloaded');
}

/* ---------- Can I afford it? ----------
   Reads real numbers: today's safe-to-spend, the Main Pocket (where expenses come from), and days to the next
   allowance. Checking never moves money; only "I bought it" (after the usual Save) or "Save for this" does. */
let affordType = 'Want';
function openAfford(){
  document.getElementById('afford-item').value = '';
  document.getElementById('afford-price').value = '';
  affordType = 'Want';
  setAffordChips();
  show('afford');
}
function setAffordChips(){
  ['Need', 'Want'].forEach(function(t){
    document.getElementById('afford-type-' + t).classList.toggle('selected', affordType === t);
  });
}
function setAffordType(t){ affordType = t; setAffordChips(); checkAfford(); }

function checkAfford(){
  const price = parseRp(document.getElementById('afford-price').value);
  const item = document.getElementById('afford-item').value.trim();
  const hint = document.getElementById('afford-hint'), body = document.getElementById('afford-body');
  if(!(price > 0)){ hint.style.display = 'block'; body.style.display = 'none'; return; }
  hint.style.display = 'none'; body.style.display = 'block';

  const main = pocketBalance(MAIN_POCKET_ID), total = availableBalanceNow();
  const safe = safeToSpendTodayNow(), limit = safeToSpendBaseNow(), days = daysUntilAllowance();
  const label = item || 'this';
  let bg, fg, expr, tier, title, msg;
  if(price <= safe){
    tier = 'yes'; bg = 'var(--teal-bg)'; fg = 'var(--teal-dark)'; expr = 'happy';
    title = 'Yes, you can afford it';
    msg = 'It fits in today\'s safe-to-spend. You would still have ' + formatRp(safe - price) + ' left today.';
  } else if(price <= main){
    tier = 'stretch'; bg = 'var(--amber-bg)'; fg = 'var(--amber-dark)'; expr = 'worried';
    title = 'Yes, but it\'s a stretch';
    const u = limit > 0 ? Math.round(price / limit * 10) / 10 : 0;
    msg = 'It is more than today\'s safe-to-spend. '
      + (u > 0 ? 'It uses about ' + u + (u === 1 ? ' day' : ' days') + ' of budget. ' : 'It uses the budget you have set aside. ')
      + 'Your Main Pocket would drop to ' + formatRp(main - price) + '.';
  } else {
    tier = 'no'; bg = 'var(--coral-bg)'; fg = 'var(--coral-dark)'; expr = 'critical';
    title = 'Not yet';
    msg = 'It is more than your Main Pocket holds (' + formatRp(main) + '). You are ' + formatRp(price - main) + ' short.';
  }

  // gentle nudges, never scolding
  let nudge = '';
  if(tier === 'no' && total >= price) nudge = 'You do have enough across all your pockets. Moving money into the Main Pocket (Transfer) would cover it.';
  else if(tier === 'no' && affordType === 'Need') nudge = 'Since it is a need, a cheaper option or a smaller size may be worth a look.';
  else if(affordType === 'Want' && main > 0 && price / main >= 0.5) nudge = 'This is a want and takes ' + Math.round(price / main * 100) + '% of your Main Pocket. Sleeping on it for a day can help you decide.';

  const result = document.getElementById('afford-result');
  result.style.background = bg;
  const setC = function(id, text){ const el = document.getElementById(id); el.style.color = fg; if(text !== undefined) el.textContent = text; return el; };
  setC('afford-verdict', title);
  setC('afford-sub', msg);
  const nudgeEl = setC('afford-nudge', nudge);
  nudgeEl.style.display = nudge ? 'block' : 'none';
  document.getElementById('mascot-afford-result').innerHTML = mascotSVG(expr, 56);

  // what changes if you buy it
  const arrow = function(a, b, negBad){
    return formatRp(a) + ' <em>&rarr;</em> <strong' + (negBad && b < 0 ? ' class="af-neg"' : '') + '>' + formatRp(b) + '</strong>';
  };
  let rows = '<div class="af-row"><span class="af-k">' + esc(label === 'this' ? 'Main Pocket' : 'Main Pocket after ' + label) + '</span><span class="af-v">' + arrow(main, main - price, true) + '</span></div>'
    + '<div class="af-row"><span class="af-k">Safe to spend today</span><span class="af-v">' + arrow(safe, Math.max(0, safe - price), false) + '</span></div>';
  if(days > 1){
    const n = days - 1;
    rows += '<div class="af-row"><span class="af-k">Daily limit, next ' + (n === 1 ? 'day' : n + ' days') + '</span><span class="af-v">'
      + arrow(Math.round(Math.max(0, main) / n), Math.round(Math.max(0, main - price) / n), false) + '</span></div>';
  }
  document.getElementById('afford-after').innerHTML = rows;

  // save-up plan when it doesn't fit yet
  const plan = document.getElementById('afford-plan');
  if(tier === 'no'){
    const short = price - main;
    const weekly = parseRp((document.getElementById('ms-weekly-target') || {}).value);
    const perWeek4 = Math.ceil(short / 4 / 1000) * 1000;
    let html = '<p style="font-size:13px;font-weight:600;color:var(--blue-dark);margin:0 0 6px;">Save-up plan</p>';
    html += weekly > 0
      ? '<p style="font-size:12px;color:var(--blue-dark);margin:0 0 6px;">At your weekly savings target of ' + formatRp(weekly) + ', it takes about ' + Math.ceil(short / weekly) + (Math.ceil(short / weekly) === 1 ? ' week' : ' weeks') + ' to cover the ' + formatRp(short) + ' you are short.</p>'
      : '<p style="font-size:12px;color:var(--blue-dark);margin:0 0 6px;">Set a weekly savings target in Money settings to get an estimate.</p>';
    html += '<p style="font-size:12px;color:var(--blue-dark);margin:0;">Or put aside about ' + formatRp(perWeek4) + ' a week to get there in 4 weeks.</p>';
    plan.innerHTML = html; plan.style.display = 'block';
  } else {
    plan.style.display = 'none';
  }
}

/* "I bought it": open the normal Add expense sheet with everything filled in. Nothing is saved until the user presses Save. */
function affordBought(){
  const price = parseRp(document.getElementById('afford-price').value);
  if(!(price > 0)) return;
  const item = document.getElementById('afford-item').value.trim();
  openQuickAdd();
  document.getElementById('qa-amount').value = formatRp(price);
  document.getElementById('qa-note').value = item;
  quickAdd.type = affordType; setChipSelection('type', affordType);
  quickAdd.category = 'Shopping'; setChipSelection('category', 'Shopping');
}

/* "Save for this": make a pocket with the price as its target. No money moves. Follows the Free plan pocket limit. */
function affordSave(){
  const price = parseRp(document.getElementById('afford-price').value);
  const item = document.getElementById('afford-item').value.trim();
  if(!(price > 0)) return;
  if(!item){ showToast('Add a name for what you want to buy'); document.getElementById('afford-item').focus(); return; }
  const r = createPocket({name:item, desc:'Saving up for ' + item, category:'Savings', target:price, targetDate:''});
  if(!r.ok){
    if(r.premium){ requirePremium('more than ' + FREE_CUSTOM_LIMIT + ' custom pockets'); } else { showToast(r.error); }
    return;
  }
  showToast('Pocket "' + item + '" created with a target of ' + formatRp(price));
  show('pockets');
}

let debts = [
  {person:'Rafi', reason:'Lunch', amount:35000, direction:'owed_to_you', status:'waiting', date:'Sep 12'},
  {person:'Sarah', reason:'Groceries', amount:80000, direction:'you_owe', status:'not paid', date:'Sep 10'}
];
let currentDebtIndex = null;
let reminderTone = 'friendly';

function renderDebts(){
  const owed = [], youOwe = [];
  debts.forEach(function(d, i){ (d.direction === 'owed_to_you' ? owed : youOwe).push(i); });
  const owedList = document.getElementById('debts-owed-list');
  const oweList = document.getElementById('debts-you-owe-list');
  owedList.innerHTML = owed.length ? owed.map(function(i){
    const d = debts[i];
    return '<div class="card outline" style="cursor:pointer;" onclick="openDebt('+i+')"><div class="row"><div><p style="font-size:13px;font-weight:500;margin:0;">'+d.person+' &middot; '+d.reason+'</p><p style="font-size:12px;color:var(--text-secondary);margin:2px 0 0;">'+formatRp(d.amount)+' &middot; '+d.status+'</p></div><button class="btn small" onclick="event.stopPropagation();openReminder('+i+')">Remind</button></div></div>';
  }).join('') : '<div class="card outline"><p style="font-size:13px;color:var(--text-secondary);margin:0;">No one owes you money.</p></div>';
  oweList.innerHTML = youOwe.length ? youOwe.map(function(i){
    const d = debts[i];
    return '<div class="card outline"><div class="row"><div><p style="font-size:13px;font-weight:500;margin:0;">'+d.person+' &middot; '+d.reason+'</p><p style="font-size:12px;color:var(--text-secondary);margin:2px 0 0;">'+formatRp(d.amount)+' &middot; '+d.status+'</p></div><button class="btn small" onclick="markPaid('+i+')">Mark paid</button></div></div>';
  }).join('') : '<div class="card outline"><p style="font-size:13px;color:var(--text-secondary);margin:0;">You don\'t owe anyone right now.</p></div>';

  const owedTotal = owed.reduce(function(s, i){ return s + debts[i].amount; }, 0);
  const oweTotal = youOwe.reduce(function(s, i){ return s + debts[i].amount; }, 0);
  const net = owedTotal - oweTotal;
  const netCard = document.getElementById('split-net-card');
  const netLabel = document.getElementById('split-net-label');
  const netAmount = document.getElementById('split-net-amount');
  if(net > 0){
    netCard.style.background = 'var(--teal-bg)';
    netLabel.style.color = 'var(--teal-dark)';
    netAmount.style.color = 'var(--teal-dark)';
    netLabel.textContent = "You're owed overall";
    netAmount.textContent = formatRp(net);
  } else if(net < 0){
    netCard.style.background = 'var(--coral-bg)';
    netLabel.style.color = 'var(--coral-dark)';
    netAmount.style.color = 'var(--coral-dark)';
    netLabel.textContent = 'You owe overall';
    netAmount.textContent = formatRp(-net);
  } else {
    netCard.style.background = 'var(--surface-2)';
    netLabel.style.color = 'var(--text-secondary)';
    netAmount.style.color = 'var(--text)';
    netLabel.textContent = 'All settled up';
    netAmount.textContent = 'Rp0';
  }
}
function settleAll(){
  const before = debts.length;
  debts = debts.filter(function(d){ return d.direction !== 'you_owe'; });
  renderDebts();
  showToast(before === debts.length ? 'Nothing to settle' : 'All settled up');
  if(backendAvailable){
    apiCall('POST', '/debts/settle-all').catch(function(){});
  }
}
function markPaid(i){
  const d = debts[i];
  debts.splice(i, 1);
  renderDebts();
  showToast('Marked as paid');
  if(backendAvailable && d.id){
    apiCall('PUT', '/debts/' + d.id + '/pay').catch(function(){});
  }
}
function openDebt(i){
  currentDebtIndex = i;
  const d = debts[i];
  document.getElementById('dd-person').textContent = d.person + ' owes you';
  document.getElementById('dd-amount').textContent = formatRp(d.amount);
  document.getElementById('dd-reason').textContent = d.reason;
  document.getElementById('dd-date').textContent = d.date;
  document.getElementById('dd-status').textContent = d.status;
  show('debt-detail');
}
function openReminder(i){
  currentDebtIndex = i;
  const d = debts[i];
  const amt = formatRp(d.amount);
  document.getElementById('rem-person').textContent = 'Choose a tone for ' + d.person;
  document.getElementById('rem-friendly-msg').textContent = 'Hey! Just a small reminder about the ' + amt + ' from ' + d.reason.toLowerCase() + '.';
  document.getElementById('rem-casual-msg').textContent = "Hey, don't forget the " + amt + ' from ' + d.reason.toLowerCase() + ' ya!';
  document.getElementById('rem-direct-msg').textContent = 'Reminder: ' + amt + ' for ' + d.reason.toLowerCase() + ' is still pending.';
  setToneSelection('friendly');
  show('reminder');
}
function setToneSelection(tone){
  reminderTone = tone;
  ['friendly','casual','direct'].forEach(function(t){
    const card = document.getElementById('rem-card-' + t);
    card.style.borderColor = t === tone ? 'var(--blue)' : 'var(--border)';
    card.style.background = t === tone ? 'var(--blue-bg)' : 'var(--surface)';
  });
}
function sendReminder(){
  if(currentDebtIndex === null) return;
  const msg = document.getElementById('rem-' + reminderTone + '-msg').textContent;
  showToast('Sent: "' + msg + '"');
  show('split');
}

let splitMethod = 'equal';
function setSplitMethod(el, method){
  splitMethod = method;
  Array.prototype.forEach.call(el.parentElement.children, function(c){ c.classList.remove('selected'); });
  el.classList.add('selected');
  renderSplitAmounts();
}
function toggleParticipant(el){
  if(el.dataset.fixed === 'true') return;
  el.classList.toggle('selected');
  renderSplitAmounts();
}
function renderSplitAmounts(){
  const container = document.getElementById('sc-custom-amounts');
  if(splitMethod === 'equal'){
    container.style.display = 'none';
    container.innerHTML = '';
    updateSplitPreview();
    return;
  }
  container.style.display = 'block';
  const total = parseRp(document.getElementById('sc-total').value);
  const chips = document.querySelectorAll('#sc-participants .chip.selected');
  const others = Array.prototype.filter.call(chips, function(c){ return c.dataset.value !== 'Gianna'; });
  const evenShare = Math.round(total / (chips.length || 1));
  container.innerHTML = others.map(function(c){
    return '<div class="row" style="margin-bottom:8px;"><span style="font-size:13px;">' + c.dataset.value + ' owes</span><input class="input rp-input" data-person="' + c.dataset.value + '" style="width:140px;height:34px;text-align:right;" value="' + formatRp(evenShare) + '" oninput="formatRpInput(this);updateSplitPreview();"></div>';
  }).join('') || '<p style="font-size:12px;color:var(--text-secondary);margin:0 0 8px;">Add participants other than yourself to split custom amounts.</p>';
  updateSplitPreview();
}
function updateSplitPreview(){
  const total = parseRp(document.getElementById('sc-total').value);
  const preview = document.getElementById('sc-preview');
  if(splitMethod === 'equal'){
    const count = document.querySelectorAll('#sc-participants .chip.selected').length || 1;
    preview.innerHTML = '<div class="row"><span style="font-size:13px;">Gianna paid, split equally</span><span style="font-size:13px;font-weight:500;">' + formatRp(total / count) + ' each</span></div>';
  } else {
    const inputs = document.querySelectorAll('#sc-custom-amounts input');
    const allocated = Array.prototype.reduce.call(inputs, function(s, el){ return s + parseRp(el.value); }, 0);
    const remaining = total - allocated;
    preview.innerHTML = '<div class="row"><span style="font-size:13px;">Allocated</span><span style="font-size:13px;font-weight:500;">' + formatRp(allocated) + ' of ' + formatRp(total) + '</span></div>' +
      '<p style="font-size:11px;color:' + (remaining < 0 ? 'var(--coral-dark)' : 'var(--text-secondary)') + ';margin:6px 0 0;">' + (remaining < 0 ? ('Over-allocated by ' + formatRp(-remaining)) : (remaining === 0 ? 'Fully allocated' : (formatRp(remaining) + ' left for Gianna'))) + '</p>';
  }
}
function buildParticipantAmounts(){
  const total = parseRp(document.getElementById('sc-total').value);
  const chips = document.querySelectorAll('#sc-participants .chip.selected');
  if(splitMethod === 'equal'){
    const count = chips.length || 1;
    const each = total / count;
    return Array.prototype.filter.call(chips, function(c){ return c.dataset.value !== 'Gianna'; })
      .map(function(c){ return {name:c.dataset.value, amount:each}; });
  }
  const inputs = document.querySelectorAll('#sc-custom-amounts input');
  return Array.prototype.map.call(inputs, function(el){ return {name:el.dataset.person, amount:parseRp(el.value)}; })
    .filter(function(p){ return p.amount > 0; });
}
async function saveSplit(){
  const title = document.getElementById('sc-title').value.trim() || 'Split bill';
  const total = parseRp(document.getElementById('sc-total').value);
  const participants = buildParticipantAmounts();
  let created = null;
  if(backendAvailable){
    try{
      const res = await apiCall('POST', '/debts/split', {title:title, total:total, method:'custom', participants:participants});
      created = res.created;
    } catch(err){
      created = null;
    }
  }
  if(created){
    created.forEach(function(d){ debts.push(d); });
  } else {
    participants.forEach(function(p){
      debts.push({person:p.name, reason:title, amount:p.amount, direction:'owed_to_you', status:'waiting', date:new Date().toLocaleDateString()});
    });
  }
  renderDebts();
  showToast('Split saved');
  show('split');
}

let goals = [
  {name:'New headphones', target:1500000, saved:900000},
  {name:'Holiday', target:2000000, saved:500000}
];
let currentGoalIndex = null;
function renderGoals(){
  document.getElementById('goals-list').innerHTML = goals.map(function(g, i){
    const pct = Math.min(100, Math.round(g.saved / g.target * 100));
    return '<div class="card outline" style="cursor:pointer;" onclick="openGoal('+i+')">'+
      '<div class="row" style="margin-bottom:8px;"><span style="font-size:13px;font-weight:500;">'+g.name+'</span><span style="font-size:12px;color:var(--text-secondary);">'+pct+'%</span></div>'+
      '<div class="progress"><div style="width:'+pct+'%;background:var(--blue);"></div></div>'+
      '<p style="font-size:12px;color:var(--text-secondary);margin:8px 0 0;">'+formatRp(g.saved)+' of '+formatRp(g.target)+'</p></div>';
  }).join('');
}
function openGoal(i){
  currentGoalIndex = i;
  const g = goals[i];
  const pct = Math.min(100, Math.round(g.saved / g.target * 100));
  document.getElementById('gd-title').textContent = g.name;
  document.getElementById('gd-saved').textContent = formatRp(g.saved);
  document.getElementById('gd-target').textContent = 'of ' + formatRp(g.target) + ' target';
  document.getElementById('gd-bar').setAttribute('data-w', pct + '%');
  document.getElementById('gd-bar').style.width = pct + '%';
  const remaining = Math.max(0, g.target - g.saved);
  document.getElementById('gd-note').textContent = remaining > 0
    ? ('You need about ' + formatRp(Math.ceil(remaining / 10 / 1000) * 1000) + '/week to reach this goal in ten weeks.')
    : 'Goal reached!';
  show('goal-detail');
}
function addGoal(){
  const name = prompt('Goal name?');
  if(!name) return;
  const target = parseRp(prompt('Target amount? (e.g. 1.000.000)') || '0');
  if(!target){ showToast('Enter a valid target'); return; }
  const goal = {name:name, target:target, saved:0};
  goals.push(goal);
  renderGoals();
  showToast('Goal added');
  show('goals');
  if(backendAvailable){
    apiCall('POST', '/goals', {name:name, target:target}).then(function(res){ goal.id = res.goal.id; }).catch(function(){});
  }
}
function addToGoal(){
  if(currentGoalIndex === null) return;
  const amount = parseRp(prompt('Add how much?') || '0');
  if(!amount) return;
  const g = goals[currentGoalIndex];
  g.saved = Math.min(g.target, g.saved + amount);
  renderGoals();
  openGoal(currentGoalIndex);
  showToast('Added to goal');
  if(backendAvailable && g.id){
    apiCall('PUT', '/goals/' + g.id + '/contribute', {amount:amount}).catch(function(){});
  }
}

function updateAllowance(){
  const val = document.getElementById('ms-allowance').value.trim();
  showToast('Allowance updated');
  if(backendAvailable){
    apiCall('PUT', '/settings', {monthlyAllowance: parseRp(val)}).catch(function(){});
  }
}
function saveSetting(label){
  showToast(label + ' updated');
  if(backendAvailable && label === 'Savings target'){
    apiCall('PUT', '/settings', {weeklyTarget: parseRp(document.getElementById('ms-weekly-target').value)}).catch(function(){});
  }
}
function toggleNotif(card){
  const pill = card.querySelector('.pill');
  const on = pill.getAttribute('data-on') === 'true';
  pill.setAttribute('data-on', on ? 'false' : 'true');
  pill.textContent = on ? 'Off' : 'On';
  pill.style.background = on ? 'var(--surface-2)' : 'var(--blue-bg)';
  pill.style.color = on ? 'var(--text-muted)' : 'var(--blue-dark)';
}
/* Demo auth — NOT real authentication. No password is checked, no account exists on any
   server; we only remember a display name in localStorage so the app knows "someone is
   signed in" across reloads. Same storage pattern as pockets.js / planning.js. */
const AUTH_KEY = 'wdmmg_demo_user';
function loadDemoUser(){
  try{
    const u = localStorage.getItem(AUTH_KEY) || null;
    if(u === 'Kevin'){ localStorage.setItem(AUTH_KEY, 'Gianna'); return 'Gianna'; }   // old default name -> new default
    return u;
  }catch(e){ return null; }
}
let demoUser = loadDemoUser();

function nameFromLogin(raw){
  const v = String(raw || '').trim();
  if(!v) return 'Gianna';
  const local = v.split('@')[0];
  return local.charAt(0).toUpperCase() + local.slice(1);
}
function applyUserName(name){
  const greeting = document.getElementById('home-greeting');
  if(greeting) greeting.textContent = 'Hi, ' + name;
  const pName = document.getElementById('profile-name');
  if(pName) pName.textContent = name;
  const avatar = document.getElementById('profile-avatar');
  if(avatar) avatar.textContent = name.charAt(0).toUpperCase();
}
function demoLogin(forcedName){
  const name = forcedName || nameFromLogin(document.getElementById('login-email').value);
  demoUser = name;
  try{ localStorage.setItem(AUTH_KEY, name); }catch(e){}
  applyUserName(name);
  show('home');
  showToast('Signed in as ' + name + ' (demo — no real account)');
}
function demoSignup(){
  const typed = document.getElementById('signup-name').value.trim();
  const name = typed ? (typed.charAt(0).toUpperCase() + typed.slice(1)) : nameFromLogin(document.getElementById('signup-email').value);
  demoUser = name;
  try{ localStorage.setItem(AUTH_KEY, name); }catch(e){}
  applyUserName(name);
  show('onb-welcome');
  showToast('Account created for ' + name + ' (demo — nothing stored on a server)');
}
function demoLogout(){
  if(!confirm('Sign out? This is a demo, so your recorded data stays on this device — you can sign back in anytime.')) return;
  demoUser = null;
  try{ localStorage.removeItem(AUTH_KEY); }catch(e){}
  const pw = document.getElementById('login-password');
  if(pw) pw.value = 'demo';
  show('login');
  showToast('Signed out');
}

/* Premium state persists in localStorage, same prototype pattern as pockets/plan/login,
   so a page reload no longer silently drops the user back to Free. Still just a boolean —
   nothing is billed. */
const PREMIUM_KEY = 'wdmmg_premium';
function loadPremium(){
  try{ const s = JSON.parse(localStorage.getItem(PREMIUM_KEY)); if(s) return s; }catch(e){}
  return {active:false, cancelled:false};
}
function savePremium(){
  try{ localStorage.setItem(PREMIUM_KEY, JSON.stringify({active:premiumActive, cancelled:premiumCancelled})); }catch(e){}
}
let _prem = loadPremium();
let premiumActive = _prem.active;
let premiumCancelled = _prem.cancelled;
function activatePremium(){
  premiumActive = true;
  premiumCancelled = false;
  savePremium();
  showToast('Premium activated. Nothing was actually charged — this is a prototype.');
  renderPremiumScreen();
  renderProfileSubscription();
}
function cancelPremium(){
  if(!confirm('Cancel Premium? Your records stay exactly as they are — you\'ll just go back to the Free plan limits.')) return;
  premiumActive = false;
  premiumCancelled = true;
  savePremium();
  showToast('Premium cancelled. Your data is untouched.');
  renderPremiumScreen();
  renderProfileSubscription();
}
function renderPremiumScreen(){
  const card = document.getElementById('prem-status');
  const cta = document.getElementById('prem-cta');
  const cancelBtn = document.getElementById('prem-cancel');
  if(!card) return;
  if(premiumActive){
    card.style.background = 'var(--teal-bg)';
    card.innerHTML = '<p class="heading" style="font-size:16px;color:var(--teal-dark);">Premium active</p>'
      + '<p style="font-size:12px;color:var(--teal-dark);margin:6px 0 0;">Rp15.000/month (prototype — nothing is actually billed). Unlimited pockets and PDF reports are unlocked.</p>';
    cta.style.display = 'none';
    cancelBtn.style.display = 'flex';
  } else {
    card.style.background = 'var(--blue-bg)';
    card.innerHTML = '<p class="heading" style="font-size:16px;color:var(--blue-dark);">' + (premiumCancelled ? 'Back on the Free plan' : "You're on the Free plan") + '</p>'
      + '<p style="font-size:12px;color:var(--blue-dark);margin:6px 0 0;">' + (premiumCancelled ? 'Your records and history are untouched. Upgrade anytime to unlock Premium again.' : 'Upgrade anytime for unlimited pockets and PDF reports.') + '</p>';
    cta.style.display = 'flex';
    cancelBtn.style.display = 'none';
  }
}
function renderProfileSubscription(){
  const btn = document.getElementById('profile-premium-btn');
  if(!btn) return;
  btn.innerHTML = premiumActive
    ? 'Manage premium <span class="pill" style="background:var(--teal-bg);color:var(--teal-dark);">Active</span>'
    : 'Student premium';
}
/* Gate for any premium-only feature: shows why, sends the user to the comparison screen, never silently fails. */
function requirePremium(featureLabel){
  if(isPremium()) return true;
  showToast('Premium feature: ' + featureLabel + '. See Premium to unlock it.');
  show('premium');
  return false;
}
function openPdfReport(){
  if(!requirePremium('PDF reports')) return;
  show('pdf');
}

const CATEGORY_COLORS = {Food:'var(--teal)', Transport:'var(--blue)', Campus:'var(--amber)', Shopping:'var(--coral)', Entertainment:'var(--coral)', Bills:'var(--blue)', Other:'var(--text-muted)'};
let lastWeekTotal = 350000;

function categoryTotals(){
  const totals = {};
  expenses.forEach(function(e){ totals[e.category] = (totals[e.category] || 0) + parseRp(e.amount); });
  return totals;
}

function renderAnalytics(){
  const totals = categoryTotals();
  const cats = Object.keys(totals);
  const total = cats.reduce(function(s, c){ return s + totals[c]; }, 0);
  document.getElementById('an-total').textContent = formatRp(total);
  document.getElementById('an-avg').textContent = 'Avg ' + formatRp(total / 7) + '/day this week';
  const max = Math.max.apply(null, cats.map(function(c){ return totals[c]; })) || 1;
  document.getElementById('an-bars').innerHTML = cats.map(function(c){
    const h = Math.round(totals[c] / max * 66) + 10;
    return '<div style="height:' + h + 'px;border-radius:10px;background:' + (CATEGORY_COLORS[c] || 'var(--blue)') + ';"></div>';
  }).join('');
  document.getElementById('an-legend').innerHTML = cats.map(function(c){
    return '<span style="display:flex;align-items:center;gap:5px;font-size:11px;color:var(--text-secondary);"><span style="width:8px;height:8px;border-radius:50%;background:' + (CATEGORY_COLORS[c] || 'var(--blue)') + ';display:inline-block;"></span>' + c + ' &middot; ' + formatRp(totals[c]) + '</span>';
  }).join('');

  const wantTotal = expenses.filter(function(e){ return e.type === 'Want'; }).reduce(function(s, e){ return s + parseRp(e.amount); }, 0);
  const needTotal = Math.max(0, total - wantTotal);
  const wantPct = total ? Math.round(wantTotal / total * 100) : 0;
  const needPct = 100 - wantPct;
  document.getElementById('an-needwant-bar').innerHTML =
    '<div style="width:' + needPct + '%;background:var(--teal);"></div><div style="width:' + wantPct + '%;background:var(--amber);"></div>';
  document.getElementById('an-need-label').textContent = 'Need ' + needPct + '% \u00b7 ' + formatRp(needTotal);
  document.getElementById('an-want-label').textContent = 'Want ' + wantPct + '% \u00b7 ' + formatRp(wantTotal);

  const top3 = expenses.slice().sort(function(a, b){ return parseRp(b.amount) - parseRp(a.amount); }).slice(0, 3);
  document.getElementById('an-top-list').innerHTML = top3.length ? top3.map(function(e){
    const pct = total ? Math.round(parseRp(e.amount) / total * 100) : 0;
    return '<div class="card outline"><div class="row"><span style="font-size:13px;">' + e.note + '</span><span style="font-size:13px;font-weight:500;">' + e.amount + '</span></div><p style="font-size:11px;color:var(--text-secondary);margin:4px 0 0;">' + pct + "% of this week's spending</p></div>";
  }).join('') : '<div class="card outline"><p style="font-size:13px;color:var(--text-secondary);margin:0;">No expenses yet.</p></div>';

  const diff = total - lastWeekTotal;
  document.getElementById('an-compare').textContent = diff >= 0
    ? ('You spent ' + formatRp(diff) + ' more than last week.')
    : ('You spent ' + formatRp(-diff) + ' less than last week.');
}

function renderWeeklyDetail(){
  const totals = categoryTotals();
  const cats = Object.keys(totals);
  const total = cats.reduce(function(s, c){ return s + totals[c]; }, 0);
  document.getElementById('wd-total').textContent = formatRp(total) + ' total';
  document.getElementById('wd-list').innerHTML = cats.length ? cats.map(function(c){
    const pct = total ? Math.round(totals[c] / total * 100) : 0;
    return '<div class="card outline"><div class="row"><span style="font-size:13px;">' + c + '</span><span style="font-size:13px;font-weight:500;">' + formatRp(totals[c]) + '</span></div><p style="font-size:11px;color:var(--text-secondary);margin:4px 0 0;">' + pct + '% of total</p></div>';
  }).join('') : '<div class="card outline"><p style="font-size:13px;color:var(--text-secondary);margin:0;">No expenses recorded yet.</p></div>';
  const wantTotal = expenses.filter(function(e){ return e.type === 'Want'; }).reduce(function(s, e){ return s + parseRp(e.amount); }, 0);
  const pct = total ? Math.round(wantTotal / total * 100) : 0;
  document.getElementById('wd-insight').textContent = "You've spent " + pct + "% of your spending on wants this week.";
}

let streakPoints = 350;
let rewards = [
  {name:'Wallet sunglasses', cost:150, redeemed:false},
  {name:'Dashboard theme', cost:200, redeemed:false}
];
function renderRewards(){
  document.getElementById('streak-points-label').textContent = streakPoints + ' pts available';
  document.getElementById('streak-rewards-list').innerHTML = rewards.map(function(r, i){
    const label = r.redeemed ? 'Redeemed' : (r.cost + ' pts');
    return '<div class="card outline"><div class="row"><span style="font-size:13px;">' + r.name + '</span><button class="btn small' + (r.redeemed ? '' : ' primary') + '" style="width:auto;" onclick="redeemReward(' + i + ')"' + (r.redeemed ? ' disabled' : '') + '>' + label + '</button></div></div>';
  }).join('');
  document.getElementById('profile-points').textContent = streakPoints;
}
function redeemReward(i){
  const r = rewards[i];
  if(r.redeemed){ showToast('Already redeemed'); return; }
  if(streakPoints < r.cost){ showToast('Not enough points'); return; }
  streakPoints -= r.cost;
  r.redeemed = true;
  renderRewards();
  showToast('Redeemed: ' + r.name);
  if(backendAvailable && r.id){
    apiCall('POST', '/rewards/' + r.id + '/redeem').catch(function(){});
  }
}

function showToast(msg){
  const phone = document.querySelector('.phone');
  const existing = phone.querySelector('.toast');
  if(existing) existing.remove();
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  phone.appendChild(t);
  setTimeout(function(){
    t.classList.add('hide');
    setTimeout(function(){ t.remove(); }, 200);
  }, 2000);
}

function animateProgressBars(scope){
  scope.querySelectorAll('.progress > div').forEach(function(bar){
    let target = bar.getAttribute('data-w');
    if(!target){
      target = bar.style.width || '0%';
      bar.setAttribute('data-w', target);
    }
    bar.style.transition = 'none';
    bar.style.width = '0%';
    requestAnimationFrame(function(){
      requestAnimationFrame(function(){
        bar.style.transition = '';
        bar.style.width = target;
      });
    });
  });
}

function animateValue(el, targetNum){
  const duration = 500;
  const start = performance.now();
  function step(now){
    const progress = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = formatRp(targetNum * eased);
    if(progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function show(name){
  document.querySelectorAll('.screen').forEach(function(s){ s.classList.remove('visible'); });
  const target = document.getElementById('s-' + name);
  target.classList.add('visible');
  animateProgressBars(target);
  if(name === 'home') refreshHomeMoney();
  if(name === 'afford') checkAfford();
  if(name === 'mood') renderMoodScreen();
  if(name === 'expenses') renderAllExpenses();
  if(name === 'split-create') renderSplitAmounts();
  if(name === 'analytics') renderAnalytics();
  if(name === 'weekly-detail') renderWeeklyDetail();
  if(typeof renderPocketScreen === 'function') renderPocketScreen(name);
  if(name === 'investment-options' && typeof renderInvestmentOptions === 'function') renderInvestmentOptions();
  if(name === 'monthly-plan' && typeof renderPlanScreen === 'function') renderPlanScreen();
  if(name === 'premium') renderPremiumScreen();
  if(name === 'profile') renderProfileSubscription();
  window.scrollTo(0, 0);
}
const API_BASE = 'http://localhost:4000/api';
let backendAvailable = false;

async function apiCall(method, path, body){
  const res = await fetch(API_BASE + path, {
    method: method,
    headers: body !== undefined ? {'Content-Type':'application/json'} : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined
  });
  if(!res.ok){
    const err = await res.json().catch(function(){ return {error:'Request failed'}; });
    throw new Error(err.error || 'Request failed');
  }
  return res.json();
}

async function bootstrapFromBackend(){
  try{
    const state = await apiCall('GET', '/state');
    backendAvailable = true;
    expenses = state.expenses.map(function(e){
      return {id:e.id, note:e.note, amount:formatRp(e.amount), category:e.category, type:e.type, payment:e.payment, date:e.date, counted:e.counted};
    });
    debts = state.debts.map(function(d){ return Object.assign({}, d); });
    goals = state.goals.map(function(g){ return Object.assign({}, g); });
    rewards = state.rewards.map(function(r){ return Object.assign({}, r); });
    // Home balance / spent / safe-to-spend are now DERIVED from pockets + expenses
    // (option B), so the old scalar settings from the backend are no longer read here.
    streakPoints = state.settings.streakPoints;
    lastWeekTotal = state.settings.lastWeekTotal;
  } catch(err){
    backendAvailable = false;
    console.info('Backend not reachable — running on local demo data.');
  }
}

async function initApp(){
  await bootstrapFromBackend();
  document.querySelectorAll('.rp-input').forEach(function(el){
    el.addEventListener('input', function(){ formatRpInput(el); });
  });
  renderHomeRecent();
  renderDebts();
  renderGoals();
  renderRewards();
  if(demoUser) applyUserName(demoUser);
  show('splash');
  setTimeout(function(){ show(demoUser ? 'home' : 'login'); }, 1000);
}
initApp();
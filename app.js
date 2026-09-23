const ICONS = {
  home: '<path d="M4 11 12 4l8 7"/><path d="M6 10v9h5v-5h2v5h5v-9"/>',
  chart: '<path d="M4 20V10"/><path d="M11 20V4"/><path d="M18 20v-7"/>',
  users: '<circle cx="9" cy="8" r="3"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="9" r="2.4"/><path d="M15 20c0-2.6 1.9-4.7 4.3-5"/>',
  user: '<circle cx="12" cy="8" r="3.4"/><path d="M5 20c0-3.9 3.1-7 7-7s7 3.1 7 7"/>',
  plus: '<path d="M12 5v14"/><path d="M5 12h14"/>',
  x: '<path d="M6 6l12 12"/><path d="M18 6l-12 12"/>'
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
['mascot-splash','mascot-onb1','mascot-onb3','mascot-home','mascot-afford'].forEach(function(id){
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

let availableBalance = 1250000;
let safeToSpendBase = 62500;
let spentToday = 0;
let spentThisMonth = 750000;
let safeToSpendToday = safeToSpendBase;

function applyExpenseEffect(amount){
  availableBalance -= amount;
  spentToday += amount;
  spentThisMonth += amount;
}
function reverseExpenseEffect(amount){
  availableBalance += amount;
  spentToday = Math.max(0, spentToday - amount);
  spentThisMonth = Math.max(0, spentThisMonth - amount);
}
function refreshHomeMoney(){
  safeToSpendToday = Math.max(0, safeToSpendBase - spentToday);
  animateValue(document.getElementById('home-balance-amount'), availableBalance);
  animateValue(document.getElementById('home-sts-amount'), safeToSpendToday);
  document.getElementById('home-spent-month').textContent = formatRp(spentThisMonth);
  const pct = safeToSpendBase > 0 ? Math.max(0, Math.min(100, Math.round(safeToSpendToday / safeToSpendBase * 100))) : 0;
  const bar = document.getElementById('home-sts-bar');
  bar.style.transition = 'none';
  bar.style.width = '0%';
  requestAnimationFrame(function(){
    requestAnimationFrame(function(){
      bar.style.transition = '';
      bar.style.width = pct + '%';
    });
  });
  let barColor, textColor, bg, msg;
  if(pct > 40){ barColor = 'var(--teal)'; textColor = 'var(--teal-dark)'; bg = 'var(--teal-bg)'; msg = "You're on track"; }
  else if(pct > 10){ barColor = 'var(--amber)'; textColor = 'var(--amber-dark)'; bg = 'var(--amber-bg)'; msg = 'Take it easy today'; }
  else { barColor = 'var(--coral)'; textColor = 'var(--coral-dark)'; bg = 'var(--coral-bg)'; msg = 'Better save today'; }
  bar.style.background = barColor;
  document.getElementById('home-sts-card').style.background = bg;
  document.getElementById('home-sts-label').style.color = textColor;
  document.getElementById('home-sts-amount').style.color = textColor;
  document.getElementById('home-sts-status').style.color = textColor;
  document.getElementById('home-sts-status').textContent = msg;
}

let expenses = [
  {note:'Coffee & hangout', amount:'Rp45.000', category:'Entertainment', type:'Want', payment:'E-wallet', date:'Sep 15, 3:20 PM', counted:false},
  {note:'Bus ticket', amount:'Rp8.000', category:'Transport', type:'Need', payment:'Cash', date:'Sep 14, 8:05 AM', counted:false}
];
let quickAdd = {category:'Entertainment', type:'Want', payment:'E-wallet'};
let currentExpenseIndex = null;
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

function renderHomeRecent(){
  const list = document.getElementById('home-recent-list');
  list.innerHTML = expenses.slice(0,4).map(function(e, i){
    return '<div class="card outline" style="cursor:pointer;" onclick="openExpense('+i+')"><div class="row"><span style="font-size:13px;">'+e.note+'</span><span style="font-size:13px;font-weight:500;">'+e.amount+'</span></div></div>';
  }).join('') || '<div class="card outline"><p style="font-size:13px;color:var(--text-secondary);margin:0;">No expenses yet. Add your first one.</p></div>';
}

function openExpense(i){
  currentExpenseIndex = i;
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
  if(e.counted) reverseExpenseEffect(parseRp(e.amount));
  expenses.splice(currentExpenseIndex, 1);
  currentExpenseIndex = null;
  renderHomeRecent();
  refreshHomeMoney();
  showToast('Expense deleted');
  show('home');
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
    counted: true
  };
  if(editingIndex !== null){
    const old = expenses[editingIndex];
    if(old.counted) reverseExpenseEffect(parseRp(old.amount));
    applyExpenseEffect(parseRp(entry.amount));
    expenses[editingIndex] = entry;
    currentExpenseIndex = editingIndex;
    editingIndex = null;
    showToast('Expense updated');
  } else {
    applyExpenseEffect(parseRp(entry.amount));
    expenses.unshift(entry);
    currentExpenseIndex = 0;
    showToast('Expense saved');
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

function checkAfford(){
  const price = parseRp(document.getElementById('afford-price').value);
  const result = document.getElementById('afford-result');
  const verdict = document.getElementById('afford-verdict');
  const sub = document.getElementById('afford-sub');
  const mascotEl = document.getElementById('mascot-afford');
  let bg, fg, expr, title, msg;
  if(price <= safeToSpendToday * 2){
    bg = 'var(--teal-bg)'; fg = 'var(--teal-dark)'; expr = 'happy';
    title = 'Yes, you can afford it'; msg = "You'll still be within your planned budget.";
  } else if(price <= availableBalance * 0.3){
    bg = 'var(--amber-bg)'; fg = 'var(--amber-dark)'; expr = 'worried';
    title = 'You can, but it may affect your budget'; msg = 'This would use a big chunk of your remaining balance.';
  } else {
    bg = 'var(--coral-bg)'; fg = 'var(--coral-dark)'; expr = 'critical';
    title = 'Maybe wait for now'; msg = 'Buying this would put you below your safe spending plan.';
  }
  result.style.background = bg;
  verdict.style.color = fg;
  sub.style.color = fg;
  verdict.textContent = title;
  sub.textContent = msg;
  mascotEl.innerHTML = mascotSVG(expr, 40);
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
}
function markPaid(i){
  debts.splice(i, 1);
  renderDebts();
  showToast('Marked as paid');
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
  const others = Array.prototype.filter.call(chips, function(c){ return c.dataset.value !== 'Kevin'; });
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
    preview.innerHTML = '<div class="row"><span style="font-size:13px;">Kevin paid, split equally</span><span style="font-size:13px;font-weight:500;">' + formatRp(total / count) + ' each</span></div>';
  } else {
    const inputs = document.querySelectorAll('#sc-custom-amounts input');
    const allocated = Array.prototype.reduce.call(inputs, function(s, el){ return s + parseRp(el.value); }, 0);
    const remaining = total - allocated;
    preview.innerHTML = '<div class="row"><span style="font-size:13px;">Allocated</span><span style="font-size:13px;font-weight:500;">' + formatRp(allocated) + ' of ' + formatRp(total) + '</span></div>' +
      '<p style="font-size:11px;color:' + (remaining < 0 ? 'var(--coral-dark)' : 'var(--text-secondary)') + ';margin:6px 0 0;">' + (remaining < 0 ? ('Over-allocated by ' + formatRp(-remaining)) : (remaining === 0 ? 'Fully allocated' : (formatRp(remaining) + ' left for Kevin'))) + '</p>';
  }
}
function saveSplit(){
  const title = document.getElementById('sc-title').value.trim() || 'Split bill';
  const total = parseRp(document.getElementById('sc-total').value);
  const chips = document.querySelectorAll('#sc-participants .chip.selected');
  if(splitMethod === 'equal'){
    const count = chips.length || 1;
    const each = total / count;
    Array.prototype.forEach.call(chips, function(c){
      if(c.dataset.value !== 'Kevin'){
        debts.push({person:c.dataset.value, reason:title, amount:each, direction:'owed_to_you', status:'waiting', date:new Date().toLocaleDateString()});
      }
    });
  } else {
    const inputs = document.querySelectorAll('#sc-custom-amounts input');
    Array.prototype.forEach.call(inputs, function(el){
      const amount = parseRp(el.value);
      if(amount > 0){
        debts.push({person:el.dataset.person, reason:title, amount:amount, direction:'owed_to_you', status:'waiting', date:new Date().toLocaleDateString()});
      }
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
  goals.push({name:name, target:target, saved:0});
  renderGoals();
  showToast('Goal added');
  show('goals');
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
}

function updateAllowance(){
  const val = document.getElementById('ms-allowance').value.trim();
  document.getElementById('home-allowance').textContent = val;
  showToast('Allowance updated');
}
function saveSetting(label){
  showToast(label + ' updated');
}
function toggleNotif(card){
  const pill = card.querySelector('.pill');
  const on = pill.getAttribute('data-on') === 'true';
  pill.setAttribute('data-on', on ? 'false' : 'true');
  pill.textContent = on ? 'Off' : 'On';
  pill.style.background = on ? 'var(--surface-2)' : 'var(--blue-bg)';
  pill.style.color = on ? 'var(--text-muted)' : 'var(--blue-dark)';
}
let premiumActive = false;
function activatePremium(){
  premiumActive = true;
  document.getElementById('premium-btn').textContent = 'Premium active';
  showToast('Premium activated');
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
}

function showToast(msg){
  const phone = document.querySelector('.phone');
  const existing = phone.querySelector('.toast');
  if(existing) existing.remove();
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  phone.appendChild(t);
  setTimeout(function(){ t.remove(); }, 2200);
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
  if(name === 'split-create') renderSplitAmounts();
  if(name === 'analytics') renderAnalytics();
  if(name === 'weekly-detail') renderWeeklyDetail();
  window.scrollTo(0, 0);
}
document.querySelectorAll('.rp-input').forEach(function(el){
  el.addEventListener('input', function(){ formatRpInput(el); });
});
renderHomeRecent();
renderDebts();
renderGoals();
renderRewards();
show('splash');
setTimeout(function(){ show('home'); }, 1000);
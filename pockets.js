/* Digital Pockets — prototype data lives in localStorage (demo only, not a bank account).
   Balances are DERIVED from a ledger; transfers are written as paired entries,
   so money can never be created or destroyed by a transfer. */
const POCKET_KEY = 'wdmmg_pockets_v1';
const POCKET_CATS = {Savings:'🐷', Bills:'🧾', Travel:'✈️', Education:'🎓', Emergency:'🛟', Investment:'📈'};
const FREE_CUSTOM_LIMIT = 2;           // configurable: custom pockets allowed on Free
let pocketState = loadPockets();
let currentPocketId = null, newPocketCat = 'Savings';

/* ---------- logic (no DOM) ---------- */
function seedPockets(){
  const d = new Date().toLocaleString(), mk = function(id, name, desc, cat){ return {id:id, name:name, desc:desc, category:cat, target:0, targetDate:'', archived:false, builtin:true}; };
  return {nextId:10,
    pockets:[mk(1,'Main Pocket','Everyday money and general savings','Savings'), mk(2,'Investment Pocket','Money you plan to invest','Investment'), mk(3,'Emergency Fund','Reserved for unexpected expenses','Emergency')],
    ledger:[{id:1,pocketId:1,kind:'deposit',amount:600000,note:'Starting balance (demo data)',date:d,pairId:null},
            {id:2,pocketId:3,kind:'deposit',amount:250000,note:'Starting balance (demo data)',date:d,pairId:null}]};
}
function loadPockets(){ try{ const s = JSON.parse(localStorage.getItem(POCKET_KEY)); if(s && s.pockets) return s; }catch(e){} return seedPockets(); }
function savePockets(){ try{ localStorage.setItem(POCKET_KEY, JSON.stringify(pocketState)); }catch(e){} }
function esc(s){ return String(s).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
function getPocket(id){ return pocketState.pockets.find(function(p){ return p.id === id; }); }
function activePockets(){ return pocketState.pockets.filter(function(p){ return !p.archived; }); }
function pocketBalance(id){ return pocketState.ledger.reduce(function(s,l){ return l.pocketId === id ? s + l.amount : s; }, 0); }
function totalSavings(){ return pocketState.pockets.reduce(function(s,p){ return s + pocketBalance(p.id); }, 0); }
function customCount(){ return activePockets().filter(function(p){ return !p.builtin; }).length; }
function isPremium(){ return typeof premiumActive !== 'undefined' && premiumActive; }
function addLedger(pocketId, kind, amount, note, pairId){
  pocketState.ledger.push({id:pocketState.nextId++, pocketId:pocketId, kind:kind, amount:amount, note:note, date:new Date().toLocaleString(), pairId:pairId || null});
}
function depositMoney(id, amount, note){
  amount = Math.round(amount);
  if(!(amount > 0)) return {ok:false, error:'Enter a valid amount'};
  const p = getPocket(id); if(!p || p.archived) return {ok:false, error:'That pocket isn\'t available'};
  addLedger(id, 'deposit', amount, note || 'Added money'); savePockets(); return {ok:true};
}
function transferMoney(fromId, toId, amount, note){
  amount = Math.round(amount);
  if(!(amount > 0)) return {ok:false, error:'Enter an amount first'};
  if(fromId === toId) return {ok:false, error:'Choose two different pockets'};
  const a = getPocket(fromId), b = getPocket(toId);
  if(!a || a.archived || !b || b.archived) return {ok:false, error:'That pocket isn\'t available'};
  if(amount > pocketBalance(fromId)) return {ok:false, error:'Not enough in that pocket'};
  const pair = pocketState.nextId++;
  addLedger(fromId, 'transfer_out', -amount, note || 'Transfer', pair);
  addLedger(toId, 'transfer_in', amount, note || 'Transfer', pair);
  savePockets(); return {ok:true};
}
/* Income + optional allocation, all-or-nothing: everything is validated BEFORE any ledger entry is written.
   Money lands in receiveId, then optional paired transfers move the chosen savings/investment amounts out.
   Nothing here runs unless the user confirmed in the UI. */
function recordIncome(f){
  const amount = Math.round(f.amount || 0), sav = Math.round(f.savings || 0), inv = Math.round(f.investment || 0);
  if(!(amount > 0)) return {ok:false, error:'Enter an amount first'};
  if(sav < 0 || inv < 0 || sav + inv > amount) return {ok:false, error:'That\'s more than the amount received'};
  const usable = function(id){ const p = getPocket(id); return !!p && !p.archived; };
  if(!usable(f.receiveId) || (sav > 0 && !usable(f.savingsId)) || (inv > 0 && !usable(f.investId))) return {ok:false, error:'That pocket isn\'t available'};
  depositMoney(f.receiveId, amount, f.note || 'Income received');
  if(sav > 0 && f.savingsId !== f.receiveId) transferMoney(f.receiveId, f.savingsId, sav, 'Suggested savings');
  if(inv > 0 && f.investId !== f.receiveId) transferMoney(f.receiveId, f.investId, inv, 'Investment allocation');
  return {ok:true};
}
function createPocket(f){
  if(!f.name) return {ok:false, error:'Give your pocket a name'};
  if(customCount() >= FREE_CUSTOM_LIMIT && !isPremium()) return {ok:false, premium:true, error:'Free plan: ' + FREE_CUSTOM_LIMIT + ' custom pockets'};
  const p = {id:pocketState.nextId++, name:f.name, desc:f.desc, category:f.category, target:f.target || 0, targetDate:f.targetDate || '', archived:false, builtin:false};
  pocketState.pockets.push(p); savePockets(); return {ok:true, pocket:p};
}
function archivePocket(id){            // sweeps any balance into Main Pocket first, so nothing disappears
  const p = getPocket(id); if(!p || p.builtin) return {ok:false, error:'Default pockets can\'t be archived'};
  const bal = pocketBalance(id);
  if(bal > 0) transferMoney(id, 1, bal, 'Moved from archived "' + p.name + '"');
  p.archived = true; savePockets(); return {ok:true, moved:bal};
}

/* ---------- UI ---------- */
function renderPocketScreen(name){
  if(name === 'pockets') renderPockets();
  if(name === 'pocket-detail') renderPocketDetail();
  if(name === 'savings') renderSavings();
}
function pocketCard(p){
  const bal = pocketBalance(p.id), pct = p.target > 0 ? Math.min(100, Math.round(bal / p.target * 100)) : null;
  return '<div class="card outline" style="cursor:pointer;" onclick="openPocket(' + p.id + ')"><div class="row"><span style="font-size:13px;font-weight:500;">' + POCKET_CATS[p.category] + ' ' + esc(p.name) + '</span><span style="font-size:13px;font-weight:500;">' + formatRp(bal) + '</span></div>' +
    (pct === null ? '<p style="font-size:11px;color:var(--text-muted);margin:6px 0 0;">No target set</p>'
      : '<div class="progress" style="margin-top:8px;"><div style="width:' + pct + '%;background:var(--teal);"></div></div><p style="font-size:11px;color:var(--text-secondary);margin:6px 0 0;">' + pct + '% of ' + formatRp(p.target) + (p.targetDate ? ' &middot; by ' + esc(p.targetDate) : '') + '</p>') + '</div>';
}
function renderPockets(){
  document.getElementById('pk-total').textContent = formatRp(totalSavings());
  document.getElementById('pk-list').innerHTML = activePockets().map(pocketCard).join('');
  document.getElementById('pk-limit').textContent = isPremium() ? 'Premium: unlimited custom pockets' : customCount() + ' of ' + FREE_CUSTOM_LIMIT + ' free custom pockets used';
}
function openPocket(id){ currentPocketId = id; show('pocket-detail'); }
function ledgerRow(l){
  const pos = l.amount >= 0;
  return '<div class="card outline"><div class="row"><div><p style="font-size:13px;margin:0;">' + esc(l.note) + '</p><p style="font-size:11px;color:var(--text-secondary);margin:2px 0 0;">' + esc(l.date) + '</p></div><span style="font-size:13px;font-weight:500;color:' + (pos ? 'var(--teal-dark)' : 'var(--coral-dark)') + ';">' + (pos ? '+' : '-') + formatRp(Math.abs(l.amount)) + '</span></div></div>';
}
function renderPocketDetail(){
  const p = getPocket(currentPocketId); if(!p) return show('pockets');
  const bal = pocketBalance(p.id), pct = p.target > 0 ? Math.min(100, Math.round(bal / p.target * 100)) : 0;
  document.getElementById('pd-title').textContent = p.name;
  document.getElementById('pd-balance').textContent = formatRp(bal);
  document.getElementById('pd-desc').textContent = p.desc || POCKET_CATS[p.category] + ' ' + p.category;
  document.getElementById('pd-target-wrap').style.display = p.target > 0 ? 'block' : 'none';
  document.getElementById('pd-bar').style.width = pct + '%';
  document.getElementById('pd-target').textContent = pct + '% of ' + formatRp(p.target) + (p.targetDate ? ' · by ' + p.targetDate : '');
  document.getElementById('pd-archive').style.display = p.builtin ? 'none' : 'flex';
  const rows = pocketState.ledger.filter(function(l){ return l.pocketId === p.id; }).reverse();
  document.getElementById('pd-history').innerHTML = rows.length ? rows.map(ledgerRow).join('') : '<div class="card outline"><p style="font-size:13px;color:var(--text-secondary);margin:0;">No activity yet. Add money or move some in from another pocket.</p></div>';
}
function addMoneyToPocket(){ openAddMoney(currentPocketId); }   // screen + recommendation live in recommend-ui.js
function archiveCurrentPocket(){
  const p = getPocket(currentPocketId);
  if(!confirm('Archive "' + p.name + '"? Any balance moves to Main Pocket.')) return;
  const r = archivePocket(p.id); showToast(r.ok ? 'Pocket archived' : r.error); show('pockets');
}
function openPocketCreate(){
  if(customCount() >= FREE_CUSTOM_LIMIT && !isPremium() && !requirePremium('more than ' + FREE_CUSTOM_LIMIT + ' custom pockets')) return;
  ['pc-name','pc-desc','pc-target','pc-date'].forEach(function(i){ document.getElementById(i).value = ''; });
  pickPocketCat(document.querySelector('#pc-cats .chip'));
  show('pocket-create');
}
function pickPocketCat(el){
  newPocketCat = el.dataset.value;
  Array.prototype.forEach.call(el.parentElement.children, function(c){ c.classList.toggle('selected', c === el); });
}
function saveNewPocket(){
  const r = createPocket({name:document.getElementById('pc-name').value.trim(), desc:document.getElementById('pc-desc').value.trim(), category:newPocketCat,
    target:parseRp(document.getElementById('pc-target').value), targetDate:document.getElementById('pc-date').value});
  if(!r.ok){ showToast(r.error); return r.premium ? show('premium') : null; }
  showToast('Pocket created'); show('pockets');
}
function openTransfer(fromId){
  const opts = activePockets().map(function(p){ return '<option value="' + p.id + '">' + esc(p.name) + ' (' + formatRp(pocketBalance(p.id)) + ')</option>'; }).join('');
  const f = document.getElementById('tr-from'), t = document.getElementById('tr-to');
  f.innerHTML = opts; t.innerHTML = opts;
  f.value = fromId || 1; t.value = f.value === '1' ? '2' : '1';
  document.getElementById('tr-amount').value = '';
  updateTransferPreview(); show('transfer');
}
function updateTransferPreview(){
  const from = +document.getElementById('tr-from').value, to = +document.getElementById('tr-to').value, amt = parseRp(document.getElementById('tr-amount').value);
  const a = getPocket(from), b = getPocket(to); if(!a || !b) return;
  const short = amt > pocketBalance(from);
  document.getElementById('tr-preview').innerHTML = from === to ? '<p style="font-size:12px;color:var(--text-secondary);margin:0;">Pick two different pockets.</p>' :
    '<div class="row" style="margin-bottom:6px;"><span style="font-size:13px;">' + esc(a.name) + '</span><span style="font-size:13px;">' + formatRp(pocketBalance(from)) + ' &rarr; <strong>' + formatRp(pocketBalance(from) - amt) + '</strong></span></div>' +
    '<div class="row"><span style="font-size:13px;">' + esc(b.name) + '</span><span style="font-size:13px;">' + formatRp(pocketBalance(to)) + ' &rarr; <strong>' + formatRp(pocketBalance(to) + amt) + '</strong></span></div>' +
    (short ? '<p style="font-size:11px;color:var(--coral-dark);margin:8px 0 0;">That&#39;s more than this pocket holds. Try a smaller amount.</p>' : '');
}
function confirmTransfer(){
  const r = transferMoney(+document.getElementById('tr-from').value, +document.getElementById('tr-to').value, parseRp(document.getElementById('tr-amount').value));
  showToast(r.ok ? 'Transfer recorded' : r.error); if(r.ok) show('pockets');
}
function renderSavings(){
  document.getElementById('sv-total').textContent = formatRp(totalSavings());
  document.getElementById('sv-pockets').innerHTML = activePockets().map(pocketCard).join('');
  document.getElementById('sv-goals').innerHTML = (typeof goals !== 'undefined' && goals.length) ? goals.map(function(g){
    const pct = Math.min(100, Math.round(g.saved / g.target * 100));
    return '<div class="card outline"><div class="row"><span style="font-size:13px;">' + esc(g.name) + '</span><span style="font-size:12px;color:var(--text-secondary);">' + pct + '%</span></div><div class="progress" style="margin-top:8px;"><div style="width:' + pct + '%;background:var(--blue);"></div></div></div>';
  }).join('') : '<div class="card outline"><p style="font-size:13px;color:var(--text-secondary);margin:0;">No savings goals yet. Add one from Profile.</p></div>';
  const recent = pocketState.ledger.filter(function(l){ return l.kind !== 'transfer_in'; }).slice(-5).reverse();
  document.getElementById('sv-recent').innerHTML = recent.length ? recent.map(function(l){
    if(l.kind === 'deposit') return ledgerRow({note:'Deposit to ' + getPocket(l.pocketId).name, date:l.date, amount:l.amount});
    const to = pocketState.ledger.find(function(x){ return x.pairId === l.pairId && x.kind === 'transfer_in'; });
    return ledgerRow({note:getPocket(l.pocketId).name + ' → ' + getPocket(to.pocketId).name, date:l.date, amount:to.amount});
  }).join('') : '<div class="card outline"><p style="font-size:13px;color:var(--text-secondary);margin:0;">Nothing yet. Your deposits and transfers will show up here.</p></div>';
}

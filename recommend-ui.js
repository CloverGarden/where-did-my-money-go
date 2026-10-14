/* Add-money screen + recommendation card (DOM only). All the maths lives in recommend.js.
   Nothing moves until the user presses Confirm. Prototype: records balances inside the app only. */
let raBack = 'pockets', raPlan = null, raAmount = 0, raToMain = true, raDestTouched = false;

function raEl(id){ return document.getElementById(id); }

/* Collect the user's own numbers from the app. Globals (debts, lastWeekTotal) come from app.js. */
function raGather(amount){
  const dateEl = raEl('ms-allowance-date');
  const dom = dateEl ? parseInt((dateEl.value.match(/\d+/) || [])[0], 10) : NaN;
  const today = new Date(), emergency = getPocket(3);
  return {
    amount: amount, today: today,
    nextIncomeDate: isNaN(dom) ? null : Recommend.nextDayOfMonth(today, dom),
    dailySpend: parseRp(raEl('ra-daily').value),
    weeklySpend: typeof lastWeekTotal !== 'undefined' ? lastWeekTotal : 0,
    upcomingBills: (typeof debts !== 'undefined' ? debts : []).filter(function(d){ return d.direction === 'you_owe'; })
      .map(function(d){ return {label:d.person, amount:Number(d.amount) || 0}; }),
    everydayBalance: pocketBalance(1),
    emergencyBalance: emergency && !emergency.archived ? pocketBalance(3) : 0,
    emergencyTarget: emergency && emergency.target > 0 ? emergency.target : 0,
    wantsInvestment: raEl('ra-invest-opt').checked
  };
}

function raPocketOptions(withBalance){
  return activePockets().map(function(p){ return '<option value="' + p.id + '">' + esc(p.name) + (withBalance ? ' (' + formatRp(pocketBalance(p.id)) + ')' : '') + '</option>'; }).join('');
}

function openAddMoney(pocketId){
  raBack = pocketId ? 'pocket-detail' : 'pockets';
  raEl('ra-amount').value = ''; raEl('ra-daily').value = ''; raEl('ra-invest-opt').checked = true;
  raEl('ra-recv').innerHTML = raPocketOptions(true);
  ['ra-savings-to', 'ra-invest-to'].forEach(function(id){ raEl(id).innerHTML = raPocketOptions(false); });
  raEl('ra-recv').value = String(pocketId || 1);
  raDestTouched = false; raPlan = null; raAmount = 0;
  raRefresh(); show('add-money');
}

function raDestChanged(){ raDestTouched = true; raUpdatePreview(); }

/* Recompute the suggestion (amount, assumptions or receiving pocket changed). Resets the editable fields. */
function raRefresh(){
  const amount = parseRp(raEl('ra-amount').value), recvId = +raEl('ra-recv').value;
  raAmount = amount; raToMain = recvId === 1; raPlan = null;
  raEl('ra-hint').style.display = amount > 0 ? 'none' : 'block';
  raEl('ra-body').style.display = amount > 0 ? 'block' : 'none';
  if(!(amount > 0)) return;
  raEl('ra-suggest').style.display = raToMain ? 'block' : 'none';
  raEl('ra-direct').style.display = raToMain ? 'none' : 'block';
  raEl('ra-skip').style.display = raToMain ? 'flex' : 'none';
  raEl('ra-confirm').textContent = raToMain ? 'Confirm' : 'Add money';

  if(raToMain){
    raPlan = Recommend.recommend(raGather(amount));
    const a = raPlan.allocations;
    raEl('ra-sum-received').textContent = formatRp(amount);
    raEl('ra-sum-reserve').textContent = formatRp(a.reserve);
    raEl('ra-sum-savings').textContent = formatRp(a.savings);
    raEl('ra-sum-invest').textContent = formatRp(a.investment);
    raEl('ra-sum-buffer').textContent = formatRp(a.buffer);
    raEl('ra-savings').value = formatRp(a.savings);
    raEl('ra-invest').value = formatRp(a.investment);
    if(!raDestTouched){
      raEl('ra-savings-to').value = String(raPlan.savingsTarget === 'emergency' && getPocket(3) && !getPocket(3).archived ? 3 : 1);
      raEl('ra-invest-to').value = String(getPocket(2) && !getPocket(2).archived ? 2 : 1);
    }
    const note = raEl('ra-note');
    if(raPlan.status === 'tight'){ note.style.display = 'block'; note.style.background = 'var(--amber-bg)'; note.style.color = 'var(--amber-dark)'; note.textContent = 'This covers your estimated needs but not much more, so keeping it all available is the safest choice right now.'; }
    else if(raPlan.limited){ note.style.display = 'block'; note.style.background = 'var(--blue-bg)'; note.style.color = 'var(--blue-dark)'; note.textContent = 'Limited estimate. ' + raPlan.limitedReasons.join(' '); }
    else note.style.display = 'none';
    raEl('ra-lines').innerHTML = raPlan.lines.map(function(l){ return '<li style="margin-bottom:6px;">' + esc(l) + '</li>'; }).join('');
  }
  raUpdatePreview();
}

/* Preview the effect of the user's current choice. Only touches the preview, never the editable fields. */
function raUpdatePreview(){
  if(!(raAmount > 0)) return;
  const recvId = +raEl('ra-recv').value;
  const sav = raToMain ? parseRp(raEl('ra-savings').value) : 0, inv = raToMain ? parseRp(raEl('ra-invest').value) : 0;
  const savTo = +raEl('ra-savings-to').value, invTo = +raEl('ra-invest-to').value;
  const chk = raToMain ? Recommend.checkChoice(raAmount, sav, inv, raPlan) : {ok:true, stays:raAmount, warnings:[]};

  const delta = {}; delta[recvId] = raAmount;
  if(chk.ok){
    if(sav > 0){ delta[recvId] -= sav; delta[savTo] = (delta[savTo] || 0) + sav; }
    if(inv > 0){ delta[recvId] -= inv; delta[invTo] = (delta[invTo] || 0) + inv; }
  }
  raEl('ra-preview').innerHTML = chk.ok ? Object.keys(delta).filter(function(id){ return delta[id] !== 0; }).map(function(id){
    const p = getPocket(+id), before = pocketBalance(+id);
    return '<div class="row" style="margin-bottom:6px;"><span style="font-size:13px;">' + esc(p.name) + '</span><span style="font-size:13px;">' + formatRp(before) + ' &rarr; <strong>' + formatRp(before + delta[id]) + '</strong></span></div>';
  }).join('') : '';
  const warn = raEl('ra-warn');
  if(!chk.ok){ warn.style.display = 'block'; warn.style.color = 'var(--coral-dark)'; warn.innerHTML = esc(chk.error); }
  else if(chk.warnings.length){ warn.style.display = 'block'; warn.style.color = 'var(--amber-dark)'; warn.innerHTML = chk.warnings.map(esc).join('<br>'); }
  else warn.style.display = 'none';
  raEl('ra-confirm').disabled = !chk.ok;
}

function raUseSuggestion(){ raDestTouched = false; raRefresh(); showToast('Back to the suggestion'); }

/* skip = true: add the money to the receiving pocket only, with no allocation. */
function raConfirm(skip){
  const useAlloc = raToMain && !skip;
  const r = recordIncome({
    amount: raAmount, receiveId: +raEl('ra-recv').value, note: 'Income received',
    savings: useAlloc ? parseRp(raEl('ra-savings').value) : 0, savingsId: +raEl('ra-savings-to').value,
    investment: useAlloc ? parseRp(raEl('ra-invest').value) : 0, investId: +raEl('ra-invest-to').value
  });
  showToast(r.ok ? (useAlloc ? 'Added and allocated. Recorded in the app only' : 'Added. Recorded in the app only (no real bank transfer)') : r.error);
  if(r.ok) show('pockets');
}

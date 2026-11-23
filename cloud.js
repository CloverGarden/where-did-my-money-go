/* Phase 2: save each person's money data online (Supabase).
   What is saved: allowance settings, pockets, ledger, savings goals, expenses.
   How it works:
   - The app keeps working from memory, as before. Every change is also sent to Supabase (after a short pause),
     as ONE snapshot through the save_money_snapshot function, so it all saves or none of it does.
   - After sign-in the snapshot is loaded back (load_money_snapshot) and replaces what is on this device.
   - Nothing is sent until the online copy has been loaded (or found empty), so stale device data can never
     overwrite the online copy.
   - Only runs with real login. In demo mode nothing leaves the device.
   Needs supabase/02_money_data.sql to have been run. */
const CLOUD_OWNER_KEY = 'wdmmg_data_owner';   // id of the person whose data is cached on this device
let cloudUserId = null, cloudReady = false, cloudTimer = null, cloudLast = '', cloudBusy = false, cloudDirty = false, cloudWarned = false;

function cloudOn(){
  try{ return AUTH_REAL && !!cloudUserId; }catch(e){ return false; }
}

/* everything worth saving, in the shape the database functions expect */
function cloudSnapshot(){
  const st = readSettings();
  return {
    settings: {
      allowance_monthly: parseRp(st.allowance), allowance_schedule: st.schedule || 'Monthly',
      next_allowance_date: parseIso(st.date) ? st.date : null, weekly_target: parseRp(st.weekly),
      onboarded: !needsOnboarding, pocket_next_id: pocketState.nextId
    },
    pockets: pocketState.pockets.map(function(p){
      return {id:p.id, name:p.name, description:p.desc || '', category:p.category || 'Savings', target:p.target || 0,
              target_date:p.targetDate || '', archived:!!p.archived, builtin:!!p.builtin};
    }),
    ledger: pocketState.ledger.map(function(l){
      return {id:l.id, pocket_id:l.pocketId, kind:l.kind, amount:Math.round(l.amount), note:l.note || '',
              ts:l.ts || null, date_text:l.date || '', pair_id:l.pairId || null};
    }),
    goals: goals.map(function(g, i){
      return {id:i + 1, position:i, name:g.name, target:Math.round(g.target), saved:Math.round(g.saved || 0)};
    }),
    expenses: expenses.map(function(e, i){
      return {id:i + 1, position:i, note:e.note || '', amount:parseRp(e.amount), category:e.category || 'Other', type:e.type || '',
              payment:e.payment || '', ts:e.ts || null, date_text:e.date || '', counted:e.counted !== false};
    })
  };
}

/* replace what is on this device with the online copy */
function cloudApply(snap){
  const s = snap.settings || {};
  const pockets = (snap.pockets || []).map(function(p){
    return {id:+p.id, name:p.name, desc:p.description || '', category:p.category, target:+p.target || 0,
            targetDate:p.target_date || '', archived:!!p.archived, builtin:!!p.builtin};
  });
  const ledger = (snap.ledger || []).map(function(l){
    return {id:+l.id, pocketId:+l.pocket_id, kind:l.kind, amount:+l.amount, note:l.note || '', date:l.date_text || '',
            ts:l.ts == null ? null : +l.ts, pairId:l.pair_id == null ? null : +l.pair_id};
  });
  if(!pockets.length){ pocketState = freshPockets(); }
  else {
    const maxId = Math.max.apply(null, pockets.map(function(p){ return p.id; }).concat(ledger.map(function(l){ return l.id; })));
    pocketState = {nextId:Math.max(+s.pocket_next_id || 10, maxId + 1), pockets:pockets, ledger:ledger};
  }
  goals = (snap.goals || []).map(function(g){ return {name:g.name, target:+g.target, saved:+g.saved || 0}; });
  expenses = (snap.expenses || []).map(function(e){
    const x = {note:e.note, amount:formatRp(+e.amount), category:e.category, type:e.type, payment:e.payment, date:e.date_text || '', counted:e.counted !== false};
    if(e.ts != null) x.ts = +e.ts;
    return x;
  });
  homeGoalIndex = 0;
  applySettings({
    allowance: +s.allowance_monthly > 0 ? formatRp(+s.allowance_monthly) : '', date: s.next_allowance_date || '',
    schedule: s.allowance_schedule || 'Monthly', weekly: +s.weekly_target > 0 ? formatRp(+s.weekly_target) : ''
  });
  needsOnboarding = s.onboarded === false;
  savePockets(); persistData();          // device copy (cloudReady is still false here, so nothing is sent back)
}

/* after sign-in: load the online copy. Returns true when online saving is on. */
async function cloudLoad(user){
  cloudUserId = user.id; cloudReady = false; cloudLast = '';
  let res;
  try{ res = await sb.rpc('load_money_snapshot'); }catch(e){ res = {error:e}; }
  if(res.error){
    console.warn('Could not load online data', res.error);
    showToast('Could not reach your online data. Working offline: changes will not be saved online until you sign in again.');
    return false;
  }
  const snap = res.data;
  let owner = null;
  try{ owner = localStorage.getItem(CLOUD_OWNER_KEY); }catch(e){}
  if(snap && snap.exists){
    cloudApply(snap);                                   // online copy wins
  } else if(owner && owner !== user.id){
    resetForNewUser();                                  // the data on this device belongs to someone else: start empty
  }                                                     // else: first time online for this device's data, upload it as it is
  try{ localStorage.setItem(CLOUD_OWNER_KEY, user.id); }catch(e){}
  cloudReady = true;
  cloudLast = (snap && snap.exists) ? JSON.stringify(cloudSnapshot()) : '';
  await cloudPush();
  return true;
}

/* ask for a save soon (waits a moment, so a burst of changes is one save) */
function cloudQueue(){
  if(!cloudOn() || !cloudReady) return;
  clearTimeout(cloudTimer);
  cloudTimer = setTimeout(cloudPush, 800);
}
async function cloudPush(){
  if(!cloudOn() || !cloudReady) return true;
  if(cloudBusy){ cloudDirty = true; return false; }
  const snap = cloudSnapshot(), json = JSON.stringify(snap);
  if(json === cloudLast) return true;
  cloudBusy = true;
  let res;
  try{ res = await sb.rpc('save_money_snapshot', {snap:snap}); }catch(e){ res = {error:e}; }
  cloudBusy = false;
  if(res.error){
    console.warn('Online save failed', res.error);
    if(!cloudWarned){ cloudWarned = true; showToast('Could not save online. Your changes are kept here and we will try again.'); }
    clearTimeout(cloudTimer); cloudTimer = setTimeout(cloudPush, 15000);
    return false;
  }
  cloudLast = json; cloudWarned = false;
  if(cloudDirty){ cloudDirty = false; cloudQueue(); }
  return true;
}
/* save right now (used before signing out) */
function cloudFlush(){ clearTimeout(cloudTimer); return cloudPush(); }
function cloudSignedOut(){ cloudUserId = null; cloudReady = false; clearTimeout(cloudTimer); }

window.addEventListener('online', function(){ cloudQueue(); });
window.addEventListener('pagehide', function(){ if(cloudOn() && cloudReady) cloudPush(); });

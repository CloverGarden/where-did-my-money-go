/* Phase 3: find people and follow each other (Supabase).
   Search, follow and unfollow all go through the database (see supabase/03_social.sql).
   Only a person's display name and @username are ever shown to others.
   Needs real login. In demo mode the screen explains that and does nothing. */
let peopleTabName = 'find', peopleMap = {}, peopleSeq = 0, peopleTimer = null, peopleMe = null;

/* picture link: one file per person in the public "avatars" bucket; the version changes on every upload so old copies are not cached */
function avatarUrl(uid, version){ return String(SUPABASE_URL).replace(/\/+$/, '') + '/storage/v1/object/public/avatars/' + uid + '/avatar.jpg?v=' + version; }
function maskName(s){ s = String(s || ''); return s ? s.charAt(0) + '***' + s.slice(-1) : s; }
function peopleUid(){ try{ return AUTH_REAL ? cloudUserId : null; }catch(e){ return null; } }
function peopleErrText(err){
  const m = String((err && err.message) || '').toLowerCase();
  if(m.indexOf('search_people') !== -1 || m.indexOf('list_people') !== -1 || m.indexOf('does not exist') !== -1 || m.indexOf('schema cache') !== -1 || m.indexOf('username') !== -1)
    return 'People search is not set up yet. Run supabase/03_social.sql in Supabase first.';
  if(m.indexOf('fetch') !== -1 || m.indexOf('network') !== -1) return 'Cannot reach the server. Please check your internet.';
  return 'Something went wrong. Please try again.';
}

function openPeople(){
  if(typeof AUTH_REAL === 'undefined' || !AUTH_REAL){ showToast('Sign in with a real account to find people.'); return; }
  show('people');
}
function peopleOnShow(){
  peopleLoadMe();
  peopleTab(peopleTabName);
}

/* ---- my username + "let others find me" ---- */
async function peopleLoadMe(){
  const uid = peopleUid(); if(!uid) return;
  let res; try{ res = await sb.from('profiles').select('username, username_custom, discoverable').eq('id', uid).maybeSingle(); }catch(e){ res = {error:e}; }
  if(res.error || !res.data){ document.getElementById('pp-myname').textContent = res.error ? 'Not available' : '@...'; if(res.error) showToast(peopleErrText(res.error)); return; }
  peopleMe = res.data;
  document.getElementById('pp-myname').textContent = '@' + (res.data.username || '...');
  peopleNameHint();
  document.getElementById('pp-discoverable').checked = res.data.discoverable !== false;
}
/* a username made from the email is shown to others as a***n: tell the person, and how to fix it */
function peopleNameHint(){
  const el = document.getElementById('pp-name-hint');
  if(peopleMe && peopleMe.username && peopleMe.username_custom === false){
    el.textContent = 'This name was made from your email. Other people see it as @' + maskName(peopleMe.username) + '. Choose your own to show it in full.';
    el.style.display = 'block';
  } else el.style.display = 'none';
}
function peopleEditName(){
  document.getElementById('pp-name-input').value = (peopleMe && peopleMe.username) || '';
  peopleNameError('');
  document.getElementById('pp-edit').style.display = 'block';
  document.getElementById('pp-edit-btn').style.display = 'none';
}
function peopleCancelName(){
  document.getElementById('pp-edit').style.display = 'none';
  document.getElementById('pp-edit-btn').style.display = '';
}
function peopleNameError(msg){ const el = document.getElementById('pp-name-error'); el.textContent = msg; el.style.display = msg ? 'block' : 'none'; }
async function peopleSaveName(){
  const v = document.getElementById('pp-name-input').value.trim().replace(/^@/, '').toLowerCase();
  if(!/^[a-z0-9_]{3,20}$/.test(v)){ peopleNameError('Use 3 to 20 letters, numbers or _.'); return; }
  let res; try{ res = await sb.rpc('set_my_username', {new_name:v}); }catch(e){ res = {error:e}; }
  if(res.error){ peopleNameError(peopleErrText(res.error)); return; }
  if(!res.data || !res.data.ok){ peopleNameError((res.data && res.data.error) || 'Could not save.'); return; }
  peopleMe = Object.assign(peopleMe || {}, {username:res.data.username, username_custom:true});
  peopleNameHint();
  document.getElementById('pp-myname').textContent = '@' + res.data.username;
  peopleCancelName();
  showToast('Username saved');
}
async function peopleSetDiscoverable(on){
  const uid = peopleUid(); if(!uid) return;
  let res; try{ res = await sb.from('profiles').update({discoverable:on}).eq('id', uid); }catch(e){ res = {error:e}; }
  if(res.error){ showToast('Could not save that. Please try again.'); document.getElementById('pp-discoverable').checked = !on; return; }
  showToast(on ? 'People can find you now' : 'You are hidden from search');
}

/* ---- tabs ---- */
function peopleTab(name){
  peopleTabName = name;
  ['find', 'following', 'followers'].forEach(function(t){
    document.getElementById('pp-tab-' + t).classList.toggle('selected', t === name);
  });
  document.getElementById('pp-find').style.display = name === 'find' ? 'block' : 'none';
  document.getElementById('pp-list').style.display = name === 'find' ? 'none' : 'block';
  if(name === 'find') peopleSearchNow();
  else peopleLoadList(name);
}

/* ---- rows ---- */
/* ---- founding team badge ----
   The badge comes from the team_roles table in the database (only the app owner can edit it), never from a name
   someone types. The colour theme is checked against a fixed list before it is used as a class. */
const TEAM_THEMES = ['gold', 'blue_gold', 'purple_gold'];
function teamTheme(p){ return (p && p.team_short) ? (TEAM_THEMES.indexOf(p.team_theme) !== -1 ? p.team_theme : 'gold') : ''; }
function teamPill(p){
  const th = teamTheme(p); if(!th) return '';
  return '<span class="team-pill team-' + th + '" title="' + esc((p.team_title || '') + ' \u00b7 Founding team') + '">' + icon('star') + esc(p.team_short) + '</span>';
}
/* Picture behind a founder's profile card. Chosen from the title the DATABASE returns (team_roles), so only the real
   CEO can ever get it. Add more founders here later: one line each. */
function teamBannerClass(p){
  if(!teamTheme(p)) return '';
  if(p.team_short === 'CEO') return ' has-banner banner-ceo';
  if(p.team_short === 'CTO') return ' has-banner banner-cto';
  return '';
}

function personRow(p){
  peopleMap[p.id] = p;
  const name = p.display_name || p.username || 'Someone';
  const th = teamTheme(p), id = esc(p.id);
  const tag = p.i_follow && p.follows_me ? '<span class="tag need">Friends</span>' : (p.follows_me ? '<span class="tag want">Follows you</span>' : '');
  const label = p.i_follow ? 'Following' : (p.follows_me ? 'Follow back' : 'Follow');
  const cls = 'avatar-sm' + (p.avatar_version ? ' has-img' : '') + (th ? ' has-team team-' + th : '');
  const sty = p.avatar_version ? ' style="background-image:url(\'' + esc(avatarUrl(p.id, p.avatar_version)) + '\')"' : '';
  return '<div class="card outline person-row' + (th ? ' person-team team-' + th : '') + teamBannerClass(p) + '" id="pr-' + id + '">'
    + '<span class="' + cls + '"' + sty + ' onclick="openPerson(\'' + id + '\')">' + esc(name.charAt(0).toUpperCase()) + '</span>'
    + '<div class="person-meta" onclick="openPerson(\'' + id + '\')"><div class="person-line"><p class="person-name">' + esc(name) + '</p>' + teamPill(p) + '</div>'
    + '<p class="person-sub">@' + esc(p.username || '') + tag + '</p></div>'
    + '<button class="follow-btn' + (p.i_follow ? ' on' : '') + '" onclick="peopleToggle(\'' + id + '\')">' + label + '</button></div>';
}
function peopleNote(text){ return '<div class="card outline"><p style="font-size:13px;color:var(--text-secondary);margin:0;">' + esc(text) + '</p></div>'; }

/* ---- search ---- */
function peopleSearchSoon(){ clearTimeout(peopleTimer); peopleTimer = setTimeout(peopleSearchNow, 350); }
async function peopleSearchNow(){
  const box = document.getElementById('pp-results');
  const q = document.getElementById('pp-search').value.trim().replace(/^@/, '');
  if(q.length < 2){ box.innerHTML = peopleNote('Type at least 2 letters of a name or @username.'); return; }
  const seq = ++peopleSeq;
  box.innerHTML = peopleNote('Searching...');
  let res; try{ res = await sb.rpc('search_people', {q:q}); }catch(e){ res = {error:e}; }
  if(seq !== peopleSeq) return;                         // a newer search started: ignore this answer
  if(res.error){ box.innerHTML = peopleNote(peopleErrText(res.error)); return; }
  const rows = res.data || [];
  box.innerHTML = rows.length ? rows.map(personRow).join('') : peopleNote('No one found. Check the spelling, or ask them for their @username.');
}

/* ---- following / followers ---- */
async function peopleLoadList(kind){
  const box = document.getElementById('pp-list');
  box.innerHTML = peopleNote('Loading...');
  let res; try{ res = await sb.rpc('list_people', {kind:kind}); }catch(e){ res = {error:e}; }
  if(peopleTabName !== kind) return;
  if(res.error){ box.innerHTML = peopleNote(peopleErrText(res.error)); return; }
  const rows = res.data || [];
  document.getElementById('pp-tab-' + kind).textContent = (kind === 'following' ? 'Following' : 'Followers') + (rows.length ? ' (' + rows.length + ')' : '');
  box.innerHTML = rows.length ? rows.map(personRow).join('')
    : peopleNote(kind === 'following' ? 'You are not following anyone yet. Use Find to search.' : 'No followers yet. Share your @username.');
}

/* ---- follow / unfollow ---- */
function peopleToggle(id){
  const p = peopleMap[id]; if(!p) return;
  if(p.i_follow){
    askConfirm({
      title: 'Unfollow ' + (p.display_name || 'this person') + '?',
      message: 'You can follow them again any time.',
      confirmText: 'Unfollow', cancelText: 'Keep following', tone: 'warn', icon: 'users'
    }, function(){ peopleSetFollow(p, false); });
  } else {
    peopleSetFollow(p, true);
  }
}
async function peopleSetFollow(p, follow){
  const uid = peopleUid(); if(!uid) return;
  const row = document.getElementById('pr-' + p.id), btn = row ? row.querySelector('.follow-btn') : null;
  const pbtn = currentScreen === 'person' ? document.getElementById('person-follow') : null;
  if(btn) btn.disabled = true;
  if(pbtn) pbtn.disabled = true;
  let res;
  try{
    res = follow ? await sb.from('follows').insert({follower_id:uid, followee_id:p.id})
                 : await sb.from('follows').delete().eq('follower_id', uid).eq('followee_id', p.id);
  }catch(e){ res = {error:e}; }
  if(res.error && !(follow && res.error.code === '23505')){   // 23505 = already following, which is fine
    if(btn) btn.disabled = false;
    if(pbtn) pbtn.disabled = false;
    showToast('Could not update that. Please try again.');
    return;
  }
  p.i_follow = follow;
  if(currentScreen === 'person') personPaint(p);
  showToast(follow ? 'Following ' + (p.display_name || '') : 'Unfollowed');
  if(row){
    if(peopleTabName === 'following' && !follow) row.remove();           // it leaves the Following list
    else row.outerHTML = personRow(p);
  }
}

/* ---------------- Edit profile: picture + display name ----------------
   The picture is cropped to a square, shrunk to 320 px and saved as one file per person in the "avatars"
   storage bucket (supabase/04_profile.sql). profiles.avatar_version holds the upload time. */
let profileMe = null, epNameDirty = false;

function openEditProfile(){
  if(typeof AUTH_REAL === 'undefined' || !AUTH_REAL){ showToast('Sign in with a real account to edit your profile.'); return; }
  epNameDirty = false;
  const inp = document.getElementById('ep-name');
  if(!inp.dataset.bound){ inp.addEventListener('input', function(){ epNameDirty = true; epMsg('ep-name-msg', ''); }); inp.dataset.bound = '1'; }
  show('edit-profile');
}
function epMsg(id, text){ const el = document.getElementById(id); if(el){ el.textContent = text || ''; el.style.display = text ? 'block' : 'none'; } }
function setAvatarEl(el, uid, version, initial){
  if(!el) return;
  if(version){
    el.style.backgroundImage = 'url("' + avatarUrl(uid, version) + '")';
    el.style.backgroundSize = 'cover'; el.style.backgroundPosition = 'center';
    el.textContent = ''; el.dataset.photo = '1';
  } else {
    el.style.backgroundImage = ''; el.textContent = initial || ''; delete el.dataset.photo;
  }
}
/* read my own profile and update the Profile screen and the Edit profile screen */
async function profileRefresh(){
  const uid = peopleUid();
  if(!uid){                                           // demo mode: no online profile, so no username or counts
    const un0 = document.getElementById('profile-username'); if(un0) un0.textContent = 'Demo account';
    profileTeamRole = null; applyOwnTeam();
    return;
  }
  let res; try{ res = await sb.from('profiles').select('display_name, avatar_version, username, username_custom').eq('id', uid).maybeSingle(); }catch(e){ res = {error:e}; }
  if(res.error || !res.data) return;
  profileMe = res.data;
  const name = res.data.display_name || demoUser || 'Friend', initial = name.charAt(0).toUpperCase();
  if(name !== demoUser){ demoUser = name; applyUserName(name); }
  const un = document.getElementById('profile-username');
  if(un) un.textContent = '@' + (res.data.username || '...');
  if(currentScreen === 'profile'){ profileCounts(uid); profileTeam(uid); }
  setAvatarEl(document.getElementById('profile-avatar'), uid, res.data.avatar_version, initial);
  if(currentScreen === 'edit-profile'){
    setAvatarEl(document.getElementById('ep-avatar'), uid, res.data.avatar_version, initial);
    document.getElementById('ep-remove-btn').style.display = res.data.avatar_version ? '' : 'none';
    const inp = document.getElementById('ep-name');
    if(!epNameDirty) inp.value = name;
    const u = res.data.username || '...';
    document.getElementById('ep-username').textContent = '@' + u + (res.data.username_custom === false ? '  (made from your email, shown to others as @' + maskName(u) + ')' : '');
  }
}

/* real follower / following counts for the profile banner; hidden if they cannot be read (never made up) */
async function profileCounts(uid){
  const box = document.getElementById('pf-stats'); if(!box) return;
  let a, b;
  try{
    a = await sb.from('follows').select('*', {count:'exact', head:true}).eq('followee_id', uid);
    b = await sb.from('follows').select('*', {count:'exact', head:true}).eq('follower_id', uid);
  }catch(e){ box.style.display = 'none'; return; }
  if(a.error || b.error || a.count == null || b.count == null){ box.style.display = 'none'; return; }
  document.getElementById('pf-followers').textContent = a.count;
  document.getElementById('pf-following').textContent = b.count;
  box.style.display = 'flex';
}
function openPeopleTab(tab){
  if(typeof AUTH_REAL === 'undefined' || !AUTH_REAL){ showToast('Sign in with a real account to find people.'); return; }
  peopleTabName = tab;
  show('people');
}

/* crop to a square and shrink, so every picture is small and the same shape */
function squarePhoto(file, size){
  return new Promise(function(resolve, reject){
    const url = URL.createObjectURL(file), img = new Image();
    img.onload = function(){
      const s = Math.min(img.width, img.height), sx = (img.width - s) / 2, sy = (img.height - s) / 2;
      const c = document.createElement('canvas'); c.width = c.height = size;
      const ctx = c.getContext('2d'); ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, size, size);
      ctx.drawImage(img, sx, sy, s, s, 0, 0, size, size);
      URL.revokeObjectURL(url);
      c.toBlob(function(b){ b ? resolve(b) : reject(new Error('blob')); }, 'image/jpeg', 0.85);
    };
    img.onerror = function(){ URL.revokeObjectURL(url); reject(new Error('image')); };
    img.src = url;
  });
}
function profilePhotoError(err){
  const m = String((err && err.message) || '').toLowerCase();
  if(m.indexOf('bucket') !== -1 || m.indexOf('not found') !== -1 || m.indexOf('avatar_version') !== -1) return 'Photos are not set up yet. Run supabase/04_profile.sql in Supabase first.';
  if(m.indexOf('row-level') !== -1 || m.indexOf('policy') !== -1 || m.indexOf('unauthorized') !== -1) return 'You are not allowed to save that picture. Please sign in again.';
  if(m.indexOf('fetch') !== -1 || m.indexOf('network') !== -1) return 'Cannot reach the server. Please check your internet.';
  return 'Could not save the picture. Please try again.';
}
async function profilePickPhoto(input){
  const file = input.files && input.files[0];
  input.value = '';                                   // so picking the same file again still works
  if(!file) return;
  epMsg('ep-photo-msg', '');
  if(!/^image\/(jpeg|png|webp)$/.test(file.type)){ epMsg('ep-photo-msg', 'Choose a JPG, PNG or WebP picture.'); return; }
  if(file.size > 10 * 1024 * 1024){ epMsg('ep-photo-msg', 'That picture is too big. Choose one under 10 MB.'); return; }
  const uid = peopleUid(); if(!uid) return;
  const btn = document.getElementById('ep-photo-btn'); btn.disabled = true; btn.textContent = 'Uploading...';
  try{
    const blob = await squarePhoto(file, 320);
    const up = await sb.storage.from('avatars').upload(uid + '/avatar.jpg', blob, {upsert:true, contentType:'image/jpeg', cacheControl:'3600'});
    if(up.error) throw up.error;
    const upd = await sb.from('profiles').update({avatar_version:Date.now()}).eq('id', uid);
    if(upd.error) throw upd.error;
    showToast('Photo saved');
    await profileRefresh();
  }catch(e){
    epMsg('ep-photo-msg', (e && e.message === 'image') ? 'Could not read that picture.' : profilePhotoError(e));
  }
  btn.disabled = false; btn.textContent = 'Change photo';
}
async function profileRemovePhoto(){
  const uid = peopleUid(); if(!uid) return;
  epMsg('ep-photo-msg', '');
  askConfirm({
    title: 'Remove your photo?', message: 'Your initial will show instead. You can add a new photo any time.',
    confirmText: 'Remove', cancelText: 'Keep photo', tone: 'warn', icon: 'alert'
  }, async function(){
    try{
      const upd = await sb.from('profiles').update({avatar_version:null}).eq('id', uid);
      if(upd.error) throw upd.error;
      await sb.storage.from('avatars').remove([uid + '/avatar.jpg']);   // best effort: the picture is already hidden
      showToast('Photo removed');
      await profileRefresh();
    }catch(e){ epMsg('ep-photo-msg', profilePhotoError(e)); }
  });
}
function profileCancel(){
  epNameDirty = false; epMsg('ep-name-msg', ''); epMsg('ep-photo-msg', '');
  goBack('profile');                                  // nothing was saved, so the name box is simply dropped
}
async function profileSaveName(){
  const v = document.getElementById('ep-name').value.trim().replace(/\s+/g, ' ');
  if(!v){ epMsg('ep-name-msg', 'Enter a name.'); return; }
  if(v.length > 40){ epMsg('ep-name-msg', 'Use 40 characters or fewer.'); return; }
  const btn = document.getElementById('ep-save-btn'); btn.disabled = true;
  let res; try{ res = await sb.rpc('set_my_display_name', {new_name:v}); }catch(e){ res = {error:e}; }
  btn.disabled = false;
  if(res.error){ epMsg('ep-name-msg', peopleErrText(res.error)); return; }
  if(!res.data || !res.data.ok){ epMsg('ep-name-msg', (res.data && res.data.error) || 'Could not save.'); return; }
  epNameDirty = false; epMsg('ep-name-msg', '');
  demoUser = res.data.display_name; applyUserName(demoUser);
  showToast('Name saved');
  profileRefresh();
}

/* ---------------- Founding team badge on my own profile ---------------- */
let profileTeamRole = null;
function applyOwnTeam(){
  const th = teamTheme(profileTeamRole || {});
  const banner = document.getElementById('pf-banner'), av = document.getElementById('profile-avatar');
  if(banner) banner.className = 'pf-banner' + (th ? ' has-team team-' + th : '') + (th ? teamBannerClass(profileTeamRole) : '');
  if(av) av.className = 'pf-avatar' + (th ? ' has-team team-' + th : '');
  const pill = document.getElementById('profile-team-pill'); if(pill) pill.innerHTML = th ? teamPill(profileTeamRole) : '';
  const tm = document.getElementById('profile-team');
  if(tm){
    if(th){ tm.innerHTML = '<b>' + esc(profileTeamRole.team_title) + '</b> \u00b7 Founding team'; tm.style.display = 'block'; }
    else tm.style.display = 'none';
  }
}
async function profileTeam(uid){
  let res; try{ res = await sb.from('team_roles').select('title, short_title, theme').eq('user_id', uid).maybeSingle(); }catch(e){ res = {error:e}; }
  if(res.error){ profileTeamRole = null; applyOwnTeam(); return; }      // table not created yet: no badge
  profileTeamRole = res.data ? {team_title:res.data.title, team_short:res.data.short_title, team_theme:res.data.theme} : null;
  applyOwnTeam();
}

/* ---------------- Visit someone's profile ---------------- */
let personId = null;
function personPaint(p){
  personId = p.id;
  const th = teamTheme(p), name = p.display_name || p.username || 'Someone';
  document.getElementById('person-card').className = 'pf-banner' + (th ? ' has-team team-' + th : '') + teamBannerClass(p);
  const av = document.getElementById('person-avatar');
  av.className = 'pf-avatar' + (th ? ' has-team team-' + th : '');
  setAvatarEl(av, p.id, p.avatar_version, name.charAt(0).toUpperCase());
  document.getElementById('person-name').textContent = name;
  document.getElementById('person-pill').innerHTML = teamPill(p);
  document.getElementById('person-user').textContent = '@' + (p.username || '');
  const tm = document.getElementById('person-team');
  if(th){ tm.innerHTML = '<b>' + esc(p.team_title || '') + '</b> \u00b7 Founding team'; tm.style.display = 'block'; } else tm.style.display = 'none';
  const stats = document.getElementById('person-stats');
  if(p.followers_count != null && p.following_count != null){
    document.getElementById('person-followers').textContent = p.followers_count;
    document.getElementById('person-following').textContent = p.following_count;
    stats.style.display = 'flex';
  } else stats.style.display = 'none';
  const btn = document.getElementById('person-follow');
  btn.disabled = false;
  btn.className = 'follow-btn person-follow' + (p.i_follow ? ' on' : '');
  btn.textContent = p.i_follow ? 'Following' : (p.follows_me ? 'Follow back' : 'Follow');
}
async function openPerson(id){
  const p = peopleMap[id]; if(!p) return;
  epMsg('person-msg', '');
  show('person');
  personPaint(p);
  let res; try{ res = await sb.rpc('get_person', {target:id}); }catch(e){ res = {error:e}; }
  if(personId !== id || currentScreen !== 'person') return;           // the person left this page meanwhile
  if(res.error){ epMsg('person-msg', peopleErrText(res.error)); return; }
  if(!res.data || !res.data.length){ epMsg('person-msg', 'This profile is not available.'); return; }
  Object.assign(p, res.data[0]);
  personPaint(p);
}
function personFollowTap(){ if(personId) peopleToggle(personId); }

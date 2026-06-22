let db = { technicians: [], leads: [], publishers: [] };
let map, layers = [];
const $ = (id) => document.getElementById(id);

async function api(path, options={}) {
  const res = await fetch(path, { headers: { 'Content-Type': 'application/json' }, ...options });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
async function load(){ db = await api('/api/data'); renderAll(); }
function fmtDate(d){ if(!d) return '—'; const parts = d.split('-'); return parts.length===3 ? `${parts[1]}/${parts[2]}/${parts[0]}` : d; }
function techName(id){ return db.technicians.find(t=>t.id===id)?.company || '—'; }

function initNav(){
  document.querySelectorAll('.nav').forEach(btn => btn.addEventListener('click', () => {
    document.querySelectorAll('.nav').forEach(b=>b.classList.remove('active'));
    document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
    btn.classList.add('active'); $(btn.dataset.view).classList.add('active');
    $('pageTitle').textContent = btn.textContent;
    setTimeout(()=>map?.invalidateSize(), 150);
  }));
}
function initMap(){
  map = L.map('map').setView([39.98,-75.16], 8);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; OpenStreetMap' }).addTo(map);
}
function clearLayers(){ layers.forEach(l=>map.removeLayer(l)); layers=[]; }
function renderMap(techs){
  if(!map) return; clearLayers();
  techs.forEach(t=>{
    if(t.coverage?.length){
      const poly = L.polygon(t.coverage, { weight:2, fillOpacity:.14 }).addTo(map).bindPopup(`<b>${t.company}</b><br>${t.city}, ${t.state}<br>ZIPs: ${(t.zips||[]).join(', ')}`);
      layers.push(poly);
    }
    if(t.coverage?.[0]) layers.push(L.marker(t.coverage[0]).addTo(map).bindPopup(`<b>${t.company}</b><br>${t.categories.join(', ')}`));
  });
  if(layers.length){ const group = L.featureGroup(layers); map.fitBounds(group.getBounds().pad(.2)); }
}
function filteredTechs(){
  const q = $('searchZip').value.toLowerCase().trim(); const cat = $('searchCategory').value;
  return db.technicians.filter(t => {
    const text = `${t.company} ${t.city} ${t.state} ${(t.zips||[]).join(' ')}`.toLowerCase();
    return (!q || text.includes(q)) && (!cat || (t.categories||[]).includes(cat));
  });
}
function renderTechResults(){
  const techs = filteredTechs(); renderMap(techs);
  $('techResults').innerHTML = techs.map(t=>`
    <div class="item">
      <h3>${t.company}</h3>
      <div class="muted">${t.contact || ''} • ${t.city || ''}, ${t.state || ''}</div>
      <div class="meta"><span class="tag blue">★ ${t.rating}</span><span class="tag green">${t.jobsCompleted} jobs</span><span class="tag">${t.responseTime}</span>${t.emergency?'<span class="tag orange">Emergency</span>':''}</div>
      <div class="muted"><b>Categories:</b> ${(t.categories||[]).join(', ')}</div>
      <div class="muted"><b>ZIPs:</b> ${(t.zips||[]).join(', ')}</div>
      <div class="muted">${t.description || ''}</div>
      <div class="actions"><button class="smallbtn" onclick="quickSend('${t.id}')">Send Latest Lead</button></div>
    </div>`).join('') || '<div class="muted">No matching technicians yet.</div>';
}
async function quickSend(techId){
  const lead = db.leads[0]; if(!lead) return alert('Create a lead first.');
  await api(`/api/leads/${lead.id}/send`, { method:'POST', body:JSON.stringify({ techIds:[techId] }) });
  await load(); alert(`Lead sent to ${techName(techId)}`);
}
function renderPublisherLeads(){
  $('publisherLeads').innerHTML = db.leads.map(l=>`
    <div class="item"><h3>${l.jobType} <span class="tag ${l.status==='Accepted'?'green':l.status==='Sent'?'blue':'orange'}">${l.status}</span></h3>
      <div class="meta"><span class="tag">${l.service}</span><span class="tag blue">ZIP ${l.zip}</span><span class="tag">${fmtDate(l.scheduledDate)}</span><span class="tag">${l.scheduledTime}</span></div>
      <div class="muted"><b>Area:</b> ${l.city}, ${l.state}</div>
      <div class="muted"><b>Sent to:</b> ${(l.sentTo||[]).map(techName).join(', ') || 'Not sent yet'}</div>
      <div class="muted"><b>Accepted by:</b> ${techName(l.acceptedBy)}</div>
      <div class="actions">${db.technicians.map(t=>`<button class="smallbtn secondary" onclick="sendLead('${l.id}','${t.id}')">Send to ${t.company.split(' ')[0]}</button>`).join('')}</div>
    </div>`).join('');
}
async function sendLead(leadId, techId){ await api(`/api/leads/${leadId}/send`, { method:'POST', body:JSON.stringify({techIds:[techId]}) }); await load(); }
function renderTechSelect(){
  $('techSelect').innerHTML = db.technicians.map(t=>`<option value="${t.id}">${t.company}</option>`).join('');
  $('techSelect').onchange = renderTechnicianDashboard;
}
function leadCard(l, techId){
  const accepted = l.acceptedBy === techId;
  return `<div class="item"><h3>${l.jobType} <span class="tag ${l.urgency==='Emergency'?'red':'orange'}">${l.urgency}</span></h3>
    <div class="meta"><span class="tag">${l.service}</span><span class="tag blue">ZIP ${l.zip}</span><span class="tag">${fmtDate(l.scheduledDate)}</span><span class="tag">${l.scheduledTime}</span></div>
    <div class="muted"><b>Location:</b> ${l.city}, ${l.state}</div>
    <div class="muted"><b>Notes:</b> ${l.notes || '—'}</div>
    ${accepted ? `<div class="hiddenDetails"><b>Customer unlocked</b><br>${l.customerName}<br>${l.customerPhone}<br>${l.customerAddress}</div>` : `<div class="hiddenDetails">Customer name, phone, and full address are hidden until accepted.</div>`}
    <div class="actions">${!accepted && l.status !== 'Accepted' ? `<button class="smallbtn success" onclick="acceptLead('${l.id}','${techId}')">Accept Lead</button><button class="smallbtn danger" onclick="declineLead('${l.id}','${techId}')">Decline</button>` : ''}</div>
  </div>`;
}
function renderTechnicianDashboard(){
  const techId = $('techSelect').value || db.technicians[0]?.id;
  const inbox = db.leads.filter(l=>(l.sentTo||[]).includes(techId) && l.acceptedBy !== techId);
  const accepted = db.leads.filter(l=>l.acceptedBy===techId);
  $('leadInbox').innerHTML = inbox.map(l=>leadCard(l, techId)).join('') || '<div class="muted">No new leads for this technician.</div>';
  $('acceptedJobs').innerHTML = accepted.map(l=>leadCard(l, techId)).join('') || '<div class="muted">No accepted jobs yet.</div>';
}
async function acceptLead(id, techId){ await api(`/api/leads/${id}/accept`, { method:'POST', body:JSON.stringify({techId}) }); await load(); }
async function declineLead(id, techId){ await api(`/api/leads/${id}/decline`, { method:'POST', body:JSON.stringify({techId}) }); await load(); }
function renderAdmin(){
  const accepted = db.leads.filter(l=>l.status==='Accepted').length;
  $('stats').innerHTML = `<div class="stat"><b>${db.technicians.length}</b><span>Technicians</span></div><div class="stat"><b>${db.leads.length}</b><span>Total Leads</span></div><div class="stat"><b>${accepted}</b><span>Accepted Leads</span></div><div class="stat"><b>${db.publishers.length}</b><span>Publishers</span></div>`;
  $('adminActivity').innerHTML = db.leads.map(l=>`<div class="item"><h3>${l.service} — ${l.jobType}</h3><div class="muted">${l.city}, ${l.state} ${l.zip} • Scheduled ${fmtDate(l.scheduledDate)} ${l.scheduledTime}</div><div class="meta"><span class="tag">${l.status}</span><span class="tag blue">${(l.sentTo||[]).length} techs notified</span></div></div>`).join('');
}
function renderAll(){ renderTechSelect(); renderTechResults(); renderPublisherLeads(); renderTechnicianDashboard(); renderAdmin(); }
function initForms(){
  $('searchZip').addEventListener('input', renderTechResults); $('searchCategory').addEventListener('change', renderTechResults);
  $('leadForm').addEventListener('submit', async e=>{ e.preventDefault(); const data=Object.fromEntries(new FormData(e.target)); await api('/api/leads',{method:'POST', body:JSON.stringify(data)}); e.target.reset(); await load(); });
  $('techForm').addEventListener('submit', async e=>{ e.preventDefault(); const data=Object.fromEntries(new FormData(e.target)); data.emergency=true; await api('/api/technicians',{method:'POST', body:JSON.stringify(data)}); e.target.reset(); await load(); });
}
window.addEventListener('load', async()=>{ initNav(); initMap(); initForms(); await load(); });

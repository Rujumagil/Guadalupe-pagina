import { metaCampaignsPage } from "./meta-analytics.js";
import { API_URL, PUBLISHABLE_KEY, WORKSPACE_ID, COMPAS_ONE_URL } from "./config.js";

/**
 * Portal independiente de Guadalupe. Autenticación Supabase Auth y datos
 * del mismo PostgreSQL de Compás One bajo RLS del workspace de Guadalupe.
 * Únicamente se emplea la clave pública; no se incluye ninguna clave privilegiada.
 */
const $ = (selector) => document.querySelector(selector);
const html = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
}[c]));
const urlParam = (value) => encodeURIComponent(String(value));
const nowISO = () => new Date().toISOString();
const fmt = (n) => n == null ? "—" : (typeof n === "string" && !Number.isFinite(Number(n)) ? n : new Intl.NumberFormat("es-MX").format(Number(n)));
const niceDate = (input) => {
  if (!input) return "Por definir";
  const d = new Date(input);
  if (Number.isNaN(d.valueOf())) return "Por definir";
  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "medium", timeStyle: "short", timeZone: "America/Mexico_City",
  }).format(d);
};
const stages = [
  ["lead", "Nuevo"], ["contacted", "Contactado"], ["qualifying", "En evaluación"],
  ["qualified", "Calificado"], ["appointment", "Cita"], ["proposal", "Propuesta"],
  ["negotiation", "Negociación"], ["customer", "Cliente"], ["lost", "No convertido"],
];
const bookingStatus = {
  requested: "Por confirmar", confirmed: "Confirmada", completed: "Atendida",
  cancelled: "Cancelada", no_show: "No asistió",
};
const sessionKey = "guadalupe-compas-session-v1";
const state = {
  session: null, user: null, role: null, page: "inicio",
  contacts: [], conversations: [], appointments: [], surveys: [],
  traffic: [], sources: [], devices: [], cloudflare: null, agent: null, paymentConnection: null,
  selectedConversation: null, messages: [], warnings: [], rights: null,
  monthOffset: 0, search: "", commercialDrafts: [], draftsError: false,
};

function stateMessage(message, type="notice") {
  const node = document.createElement("div");
  node.className = "notice" + (type === "error" ? " error" : type === "success" ? " success" : "");
  node.textContent = message;
  const view = $("#view");
  if (view) view.prepend(node);
  setTimeout(() => node.remove(), 7000);
}

function restore() {
  try { state.session = JSON.parse(sessionStorage.getItem(sessionKey) || "null"); }
  catch { state.session = null; }
}
function persist() {
  if (state.session) sessionStorage.setItem(sessionKey, JSON.stringify(state.session));
  else sessionStorage.removeItem(sessionKey);
}
async function authFetch(path, method = "GET", body = undefined) {
  const headers = { apikey: PUBLISHABLE_KEY };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (state.session?.access_token) headers.Authorization = "Bearer " + state.session.access_token;
  const response = await fetch(API_URL + "/auth/v1/" + path, {
    method, headers, body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error_description || data.msg || data.message || "Error de autenticación.");
  return data;
}
async function token() {
  if (!state.session?.access_token) throw new Error("Debes iniciar sesión.");
  const expires = Number(state.session.expires_at || 0) * 1000;
  if (expires > Date.now() + 60_000) return state.session.access_token;
  if (!state.session.refresh_token) throw new Error("Tu sesión ha terminado. Inicia sesión nuevamente.");
  const refreshed = await authFetch("token?grant_type=refresh_token", "POST", {
    refresh_token: state.session.refresh_token,
  });
  state.session = refreshed;
  persist();
  return refreshed.access_token;
}
async function db(table, options={}) {
  const bearer = await token();
  const query = options.query ? "?" + options.query : "";
  const headers = {
    apikey: PUBLISHABLE_KEY, Authorization: "Bearer " + bearer,
    Accept: "application/json", "Content-Type": "application/json",
  };
  if (options.prefer) headers.Prefer = options.prefer;
  const response = await fetch(API_URL + "/rest/v1/" + table + query, {
    method: options.method || "GET",
    headers, cache: "no-store",
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });
  const raw = await response.text();
  let result = raw ? JSON.parse(raw) : null;
  if (!response.ok) {
    const message = result?.message || result?.details || "No fue posible guardar los datos.";
    throw new Error(message);
  }
  return result;
}
function workspaceQuery(columns, more="") {
  return "select=" + urlParam(columns) + "&workspace_id=eq." + WORKSPACE_ID + (more ? "&" + more : "");
}
async function verifyMember() {
  const user = await authFetch("user");
  state.user = user;
  const members = await db("workspace_members", {
    query: "select=role&workspace_id=eq." + WORKSPACE_ID + "&user_id=eq." + urlParam(user.id) + "&status=eq.active&limit=1",
  });
  if (!members?.length || !["owner","admin","manager","agent"].includes(members[0].role)) {
    throw new Error("Esta cuenta no está autorizada para administrar el CRM de Guadalupe.");
  }
  state.role = members[0].role;
  try { state.rights = await db("rpc/get_workspace_access", {
    method:"POST", body: { target_workspace_id: WORKSPACE_ID },
  }); } catch { state.rights = null; }
}
function needsActivation() {
  return state.rights && (state.rights.access_enabled === false ||
    (state.rights.plan?.features?.crm === false));
}

async function load() {
  state.warnings = [];
  const qs = [
    ["contacts", "contacts", workspaceQuery("id,display_name,email,phone,company_name,stage,status,created_at", "order=created_at.desc&limit=200")],
    ["conversations", "conversations", workspaceQuery("id,contact_id,channel,status,unread_count,last_message_preview,last_message_at,subject", "order=last_message_at.desc.nullslast&limit=100")],
    ["appointments", "appointments", workspaceQuery("id,contact_id,title,status,source,start_at,end_at,requested_time_text,created_at", "order=created_at.desc&limit=200")],
    ["surveys", "guadalupe_survey_responses", workspaceQuery("id,contact_id,areas,support,desired_start,information_interest,submitted_name,submitted_contact,consent,created_at", "order=created_at.desc&limit=200")],
    ["traffic", "workspace_cloudflare_daily_metrics", workspaceQuery("metric_date,visits,pageviews", "order=metric_date.asc&limit=60")],
    ["sources", "workspace_cloudflare_dimension_metrics", workspaceQuery("dimension_value,visits", "dimension=eq.referrer&order=visits.desc&limit=5")],
    ["devices", "workspace_cloudflare_dimension_metrics", workspaceQuery("dimension_value,visits", "dimension=eq.device&order=visits.desc&limit=5")],
    ["cloudflare", "workspace_cloudflare_connections", workspaceQuery("status,hostname,last_synced_at", "limit=1")],
    ["agent", "ai_agent_profiles", workspaceQuery("enabled,agent_name,operating_mode", "limit=1")],
    ["paymentConnection", "workspace_payment_connections", workspaceQuery("status,charges_enabled,payouts_enabled,livemode,business_name,last_synced_at", "provider=eq.stripe&limit=1")],
  ];
  const outcomes = await Promise.allSettled(qs.map(item=>db(item[1], {query:item[2]})));
  outcomes.forEach((outcome, i) => {
    const key = qs[i][0];
    if (outcome.status === "fulfilled") {
      state[key] = ["cloudflare","agent","paymentConnection"].includes(key) ? (outcome.value?.[0] || null) : (outcome.value || []);
    } else {
      state[key] = ["cloudflare","agent","paymentConnection"].includes(key) ? null : [];
      state.warnings.push(qs[i][1] + ": no disponible");
    }
  });
  await loadCommercialDrafts();
}
function nav(page) {
  state.page = page;
  document.querySelectorAll("[data-page]").forEach(el=>{
    el.classList.toggle("active", el.dataset.page === page);
  });
  render();
}
function heading(title,description,actions="") {
  return '<div class="headline"><div><span class="eyebrow">GUADALUPE · CENTRO DE GESTIÓN</span>'+
    "<h1>"+html(title)+"</h1><p>"+html(description)+"</p></div>"+actions+"</div>";
}
function stat(title,value,note) {
  return '<div class="stat"><span>'+html(title)+'</span><strong>'+fmt(value)+'</strong><small>'+html(note)+'</small></div>';
}
function panel(title,content,extra="") {
  return '<section class="panel"><div class="panel-head"><h2>'+html(title)+'</h2>'+extra+'</div>'+content+'</section>';
}

function commercialOverview(){
  const unavailable=table=>state.warnings.some(w=>w.startsWith(table+":"));
  const leads=state.contacts.filter(c=>c.stage==="lead").sort((a,b)=>new Date(a.created_at)-new Date(b.created_at));
  const inbox=state.conversations.filter(c=>Number(c.unread_count)>0).sort((a,b)=>new Date(a.last_message_at||0)-new Date(b.last_message_at||0));
  const reservations=state.appointments.filter(a=>a.status==="requested");
  const names=new Map(state.contacts.map(c=>[c.id,c.display_name]));
  const queue=(title,count,description,target,missing)=>'<button type="button" class="follow-card" data-action="goto" data-target="'+target+'"><span>'+html(title)+'</span><strong>'+ (missing?"—":fmt(count))+'</strong><small>'+html(missing?"Datos no disponibles":description)+'</small><span class="follow-link">Revisar →</span></button>';
  const leadRows=leads.slice(0,5).map(c=>'<div class="follow-row"><div><strong>'+html(c.display_name||"Contacto")+'</strong><small>Registrado: '+html(niceDate(c.created_at))+'</small></div><button class="btn light" data-action="find-contact" data-name="'+html(c.display_name||"")+'">Ver CRM</button></div>').join("");
  const messageRows=inbox.slice(0,5).map(c=>'<div class="follow-row"><div><strong>'+html(names.get(c.contact_id)||c.subject||"Conversación")+'</strong><small>'+html(c.channel||"Canal no indicado")+' · '+html(c.unread_count)+' sin leer</small><small>'+html((c.last_message_preview||"Sin vista previa").slice(0,100))+'</small></div><button class="btn light" data-action="open-conversation" data-id="'+html(c.id)+'">Abrir</button></div>').join("");
  const agentStatus=unavailable("ai_agent_profiles")?"Estado no disponible":state.agent?(state.agent.enabled?"Activo":"Desactivado"):"Sin perfil disponible";
  const agentName=state.agent?.agent_name||"Agente de atención";
  return '<section class="panel follow-panel"><div class="panel-head"><div><span class="eyebrow">SEGUIMIENTO COMERCIAL</span><h2>Prioridades de atención</h2></div><button class="btn outline" data-action="refresh-dashboard">Actualizar</button></div><p class="text-muted">Revisa primero los registros pendientes. Los conteos corresponden a los datos cargados.</p><div class="follow-grid">'+queue("Prospectos nuevos",leads.length,"Etapa Nuevo","clientes",unavailable("contacts"))+queue("Conversaciones sin leer",inbox.length,"Revisar bandeja","mensajes",unavailable("conversations"))+queue("Reservas pendientes",reservations.length,"Confirmar horarios","reservas",unavailable("appointments"))+'</div><div class="follow-agent"><div><strong>'+html(agentName)+'</strong><small>'+html(agentStatus)+' · Bandeja general del equipo; no distingue respuestas del agente.</small></div><button class="btn light" data-action="goto" data-target="agentes">Ver agentes</button></div></section>'+
  '<div class="grid-two follow-lists">'+panel("Prospectos por revisar",unavailable("contacts")?'<div class="empty">Datos no disponibles.</div>':leadRows||'<div class="empty">No hay prospectos en etapa Nuevo.</div>','<button class="btn light" data-action="goto" data-target="clientes">Ver CRM</button>')+panel("Conversaciones pendientes",unavailable("conversations")?'<div class="empty">Datos no disponibles.</div>':messageRows||'<div class="empty">No hay conversaciones sin leer.</div>','<button class="btn light" data-action="goto" data-target="mensajes">Ver bandeja</button>')+'</div>';
}



/* Reference catalog only: historical prices are not checkout prices. */
const migrationCatalog = [
  ["Audiolibro Cuentos para Sanar",150,"Pago único","Biblioteca de audio pendiente"],
  ["Cuentos para Sanar",150,"Pago único","Libro pendiente"],
  ["Comunidad IXCHEL",650,"Mensual","Renovación y vencimiento pendientes"],
  ["Libro La Mujer del Faro",250,"Pago único","Libro pendiente"],
  ["Taller La Mujer del Faro · Grupo 1",1199,"Pago único","Curso en borrador"],
  ["Taller La Mujer del Faro · Grupo 2",1499,"Pago único","Curso en borrador"],
  ["Taller La Mujer del Faro · Grupo 3",1799,"Pago único","Curso en borrador"],
  ["Relato de Legado",3000,"Pago único","Validar derechos del paquete 1"],
  ["Mi Libro de Legado",6800,"Pago único","Validar derechos del paquete 2"],
  ["Webinar La Mujer del Faro",450,"Pago único","Oferta histórica desactivada"]
];
function catalogPageSection(){
  const rows=migrationCatalog.map(([name,price,mode,blocker])=>'<tr><td><strong>'+html(name)+'</strong></td><td>'+html(new Intl.NumberFormat("es-MX",{style:"currency",currency:"MXN",currencyDisplay:"code"}).format(price))+'</td><td>'+html(mode)+'</td><td><span class="pill">Por validar</span><br><small>'+html(blocker)+'</small></td></tr>').join("");
  return '<section class="panel catalog-panel"><div class="panel-head"><div><span class="eyebrow">CATÁLOGO COMERCIAL</span><h2>Productos y precios</h2></div><span class="pill">10 referencias históricas</span></div><p class="text-muted">Inventario de ETERNI recuperado el 26 de noviembre de 2026. Los precios son referencias históricas, no ofertas vigentes. Este catálogo es de solo lectura y no genera enlaces de pago.</p><div class="table-wrap"><table><thead><tr><th>Producto</th><th>Precio histórico</th><th>Modalidad</th><th>Disponibilidad</th></tr></thead><tbody>'+rows+'</tbody></table></div></section>';
}


const canManageDrafts=()=>["owner","admin"].includes(state.role);
const moneyDraft=(n,currency)=>new Intl.NumberFormat("es-MX",{style:"currency",currency,currencyDisplay:"code"}).format(Number(n)/100);
async function loadCommercialDrafts(){
  state.commercialDrafts=[];state.draftsError=false;
  if(!canManageDrafts())return;
  try{state.commercialDrafts=await db("ggp_commercial_drafts",{query:workspaceQuery("id,name,currency,regular_minor,total_minor,deposit_minor,mode,starts_on,ends_on,delivery,status","order=created_at.desc&limit=200")});}
  catch{state.draftsError=true;}
}
function draftSection(){
  if(!canManageDrafts())return "";
  const rows=state.commercialDrafts.map(d=>'<tr><td><strong>'+html(d.name)+'</strong><br><small>'+html(d.starts_on||"Sin inicio")+' · '+html(d.ends_on||"Sin vencimiento")+'</small></td><td>'+html(moneyDraft(d.regular_minor,d.currency))+'</td><td>'+html(moneyDraft(d.total_minor,d.currency))+'</td><td>'+html(d.mode==="deposit"?moneyDraft(d.deposit_minor,d.currency):d.mode==="monthly"?"Mensual":"Completo")+'</td><td>'+html(moneyDraft(d.total_minor-d.deposit_minor,d.currency))+'</td><td>'+html(d.status==="archived"?"Archivado":"Borrador")+'</td><td><button class="btn light" data-action="edit-draft" data-id="'+html(d.id)+'">Editar</button></td></tr>').join("");
  return '<section class="panel catalog-panel"><div class="panel-head"><h2>Mis ofertas comerciales</h2><button class="btn primary" data-action="new-draft">+ Nueva oferta</button></div><p class="text-muted">Borradores privados: no publican precios ni crean cobros en Stripe. El saldo mostrado es el importe restante después del anticipo; en pago completo o mensual representa el total.</p>'+(state.draftsError?'<div class="notice error">No fue posible consultar las ofertas.</div>':rows?'<div class="table-wrap"><table><thead><tr><th>Producto</th><th>Habitual</th><th>Total</th><th>Modalidad / anticipo</th><th>Saldo / total</th><th>Estado</th><th>Acción</th></tr></thead><tbody>'+rows+'</tbody></table></div>':'<div class="empty">Aún no hay ofertas preparadas.</div>')+'</section>';
}
function editCommercialDraft(id){
  if(!canManageDrafts())return;
  const d=id?state.commercialDrafts.find(x=>x.id===id):null;
  if(id&&!d)return;
  const make=(label,name,type,value,options)=>{const f=field(label,name,type,false,options);const el=f.querySelector("input,select,textarea");el.value=value??"";if(type==="number"){el.min="0";el.step="0.01";}return f;};
  const fields=[make("Producto o servicio","name","text",d?.name),make("Moneda","currency","select",d?.currency||"MXN",[["MXN","MXN"],["USD","USD"]]),make("Precio habitual","regular","number",d?d.regular_minor/100:""),make("Precio final / mensual","total","number",d?d.total_minor/100:""),make("Modalidad","mode","select",d?.mode||"full",[["full","Pago completo"],["deposit","Anticipo"],["monthly","Mensual"]]),make("Anticipo (0 si no aplica)","deposit","number",d?d.deposit_minor/100:0),make("Inicio de promoción","starts","date",d?.starts_on),make("Fin de promoción","ends","date",d?.ends_on),make("Entrega o acceso previsto","delivery","textarea",d?.delivery),make("Estado","status","select",d?.status||"draft",[["draft","Borrador"],["archived","Archivado"]])];
  dialog(d?"Editar oferta":"Nueva oferta",fields,async data=>{
    const cents=k=>{const v=String(data.get(k)||"").trim();if(!/^\d+(\.\d{1,2})?$/.test(v))throw Error("Introduce importes válidos con hasta dos decimales.");return Math.round(Number(v)*100);};
    const body={name:String(data.get("name")||"").trim(),currency:String(data.get("currency")),regular_minor:cents("regular"),total_minor:cents("total"),deposit_minor:cents("deposit"),mode:String(data.get("mode")),starts_on:data.get("starts")||null,ends_on:data.get("ends")||null,delivery:String(data.get("delivery")||"").trim(),status:String(data.get("status"))};
    if(body.name.length<2||body.total_minor<=0||body.total_minor>body.regular_minor||body.deposit_minor>=body.total_minor||(body.mode==="deposit"?body.deposit_minor<=0:body.deposit_minor!==0))throw Error("Revisa el nombre, precio final y anticipo.");
    if(body.starts_on&&body.ends_on&&body.starts_on>body.ends_on)throw Error("La fecha final debe ser posterior o igual a la inicial.");
    const saved=await db("ggp_commercial_drafts",{method:d?"PATCH":"POST",query:d?"id=eq."+urlParam(d.id)+"&workspace_id=eq."+WORKSPACE_ID:"select=id",prefer:"return=representation",body:d?body:{...body,workspace_id:WORKSPACE_ID}});
    if(!saved?.length)throw Error("No se guardó la oferta. Revisa tus permisos.");
  });
}


function stripeConnectionInstructions(){
  if(!["owner","admin"].includes(state.role))return '<p class="small">Solo el propietario o administrador puede autorizar la cuenta Stripe.</p>';
  return '<div class="stripe-connect-card"><div class="stripe-connect-brand"><span class="stripe-mark" aria-hidden="true">S</span><div><strong>Stripe Connect</strong><small>Autorización segura del titular</small></div></div><p>Conecta tu cuenta existente desde la administración de pagos de Compás One. No compartas contraseñas ni claves privadas.</p><a class="btn primary" target="_blank" rel="noopener noreferrer" href="'+html(COMPAS_ONE_URL)+'/integrations/payments">Conectar mi cuenta Stripe ↗</a><ol><li>Inicia sesión con tu cuenta autorizada de Compás One.</li><li>Comprueba que el espacio activo sea Guadalupe Gómez Pezuela.</li><li>Selecciona Conectar mi cuenta Stripe y autoriza en Stripe.</li><li>Regresa a este panel y pulsa Actualizar.</li></ol><div class="notice">Si la cuenta sigue vinculada a ETERNI, solicita revisión de la asociación antes de continuar. No desconectes la cuenta anterior ni crees otra.</div></div>';
}

function paymentsPage(){
  const failed=state.warnings.some(w=>w.startsWith("workspace_payment_connections:"));
  const p=state.paymentConnection;
  const ready=p?.status==="connected"&&p.charges_enabled&&p.livemode;
  const status=failed?"No disponible":!p?"Sin conexión":ready?"Conexión registrada en producción":"Requiere revisión";
  const row=(label,value)=>'<div class="split-row"><span>'+html(label)+'</span><strong>'+html(value)+'</strong></div>';
  const details=row("Estado",status)+row("Titular",p?.business_name||"Por verificar")+row("Cobros",p?p.charges_enabled?"Habilitados":"No habilitados":"—")+row("Depósitos",p?p.payouts_enabled?"Habilitados":"No habilitados":"—")+row("Modo",p?p.livemode?"Producción":"Pruebas":"—")+row("Última sincronización",p?.last_synced_at?niceDate(p.last_synced_at):"Sin sincronizar");
  return heading("Finanzas y pagos","Administra la conexión comercial de Guadalupe y consulta su estado.",'<button class="btn outline" data-action="refresh-dashboard">Actualizar</button>')+
    '<section class="stat-grid">'+stat("Ingresos del mes","—","Pendiente de integración")+stat("Pagos confirmados","—","Pendiente de integración")+stat("Pagos pendientes","—","Pendiente de integración")+stat("Suscripciones activas","—","Pendiente de integración")+'</section>'+
    '<div class="grid-two">'+panel("Conexión Stripe",details+'<p class="small">Estado almacenado en Compás One. La autorización y la sincronización con Stripe se gestionan en el servidor.</p>'+stripeConnectionInstructions())+
    panel("Preparación de la migración",'<div class="notice">No se habilitarán cobros nuevos hasta validar la cuenta comercial, el catálogo y el destino de las compras.</div><div class="split-row"><span>Productos y precios</span><strong>Por validar</strong></div><div class="split-row"><span>Confirmación de pagos</span><strong>Por validar</strong></div><div class="split-row"><span>Acceso a Academia Nicté Ha</span><strong>Por validar</strong></div>')+'</div>'+
    draftSection()+catalogPageSection()+panel("Historial de ventas",'<div class="empty">La consulta de transacciones y suscripciones requiere una integración de servidor autorizada para este workspace. No se muestran importes estimados ni transacciones de ETERNI.</div>');
}

function summary() {
  const newLeads=state.contacts.filter(c=> new Date(c.created_at).getTime() > Date.now()-30*86400000).length;
  const unread=state.conversations.reduce((s,c)=>s+Number(c.unread_count||0),0);
  const pending=state.appointments.filter(a=>a.status==="requested").length;
  const trafficReady=state.cloudflare?.status==="connected" && state.traffic.length>0;
  const visits=trafficReady ? state.traffic.filter(a=>new Date(a.metric_date).getTime()>Date.now()-30*86400000).reduce((s,a)=>s+Number(a.visits||0),0):null;
  let warning = "";
  if(needsActivation()) warning='<div class="notice">El espacio ya existe, pero su plan y permisos operativos aún requieren activación desde Compás One. Algunas tablas pueden mostrarse vacías.</div>';
  if(state.warnings.length) warning+='<div class="notice">Algunas áreas no respondieron: '+html(state.warnings.join(", "))+'. Revisa los permisos del workspace.</div>';
  const next = state.appointments.filter(a=>a.status==="confirmed"&&a.start_at&&new Date(a.start_at)>new Date())
    .sort((a,b)=>new Date(a.start_at)-new Date(b.start_at)).slice(0,5);
  const bookings=next.length ? '<div class="table-wrap"><table><thead><tr><th>Sesión</th><th>Fecha</th></tr></thead><tbody>'+next.map(a=>'<tr><td>'+html(a.title)+'</td><td>'+html(niceDate(a.start_at))+'</td></tr>').join("")+'</tbody></table></div>' :
    '<div class="empty">Todavía no hay sesiones confirmadas.</div>';
  return heading("Mi negocio, bajo control","El espacio privado donde administras tu relación con los clientes.")+warning+
    '<section class="stat-grid">'+stat("Contactos",state.contacts.length,"CRM de Guadalupe")+stat("Prospectos recientes",newLeads,"Últimos 30 días")+stat("Mensajes pendientes",unread,"Por revisar")+stat("Reservas por confirmar",pending,"Solicitudes")+'</section>'+commercialOverview()+
    '<div class="grid-two">'+panel("Próximas sesiones",bookings,'<button class="btn light" data-action="goto" data-target="reservas">Ver reservas</button>')+
    panel("Acciones rápidas",'<div class="action-grid"><button class="action" data-action="new-contact"><strong>+ Cliente</strong><small>Registrar contacto</small></button><button class="action" data-action="new-booking"><strong>+ Reserva</strong><small>Solicitar sesión</small></button><button class="action" data-action="goto" data-target="mensajes"><strong>Mensajes</strong><small>Revisar conversaciones</small></button></div>')+'</div>'+
    panel("Tráfico web",trafficReady?'<div class="stat-grid">'+stat("Visitas",visits,"Últimos 30 días")+stat("Páginas vistas",state.traffic.reduce((s,a)=>s+Number(a.pageviews||0),0),"Cloudflare")+'</div><button class="btn outline" data-action="goto" data-target="trafico">Ver evolución del tráfico →</button>':
     '<div class="empty">Métricas pendientes. Conecta el sitio de Guadalupe a Cloudflare desde Compás One para comenzar a ver datos reales.</div>');
}
function contactsPage() {
  const visible=state.contacts.filter(c=>[c.display_name,c.email,c.phone,c.company_name].join(" ").toLowerCase().includes(state.search.toLowerCase()));
  const rows=visible.map(c=>'<tr><td><strong>'+html(c.display_name)+'</strong><br><small>'+html(c.company_name||"Particular")+'</small></td><td>'+html(c.email||"—")+'<br><small>'+html(c.phone||"")+'</small></td><td><select aria-label="Etapa de '+html(c.display_name)+'" data-stage="'+html(c.id)+'">'+stages.map(([v,t])=>'<option value="'+v+'"'+(c.stage===v?" selected":"")+'>'+t+'</option>').join("")+'</select></td><td>'+html(niceDate(c.created_at))+'</td></tr>').join("");
  return heading("Mi CRM","Personas interesadas en las sesiones y servicios de Guadalupe.",'<button class="btn primary" data-action="new-contact">+ Nuevo contacto</button>')+
    panel("Contactos registrados",'<div class="row-tools"><input type="search" id="crmSearch" placeholder="Buscar por nombre, correo o teléfono" value="'+html(state.search)+'"><span class="text-muted">'+visible.length+' registros</span></div>'+
    (rows?'<div class="table-wrap"><table><thead><tr><th>Nombre</th><th>Contacto</th><th>Etapa</th><th>Registro</th></tr></thead><tbody>'+rows+'</tbody></table></div>':'<div class="empty">No hay contactos que coincidan con tu búsqueda.</div>'));
}
function landingPage() {

  const surveys = state.surveys || [];
  const surveyRows = surveys.map(s => {
    const contact = state.contacts.find(c => c.id === s.contact_id);
    const display = s.submitted_name || contact?.display_name || "Participante anónimo";
    const detail = s.areas?.join(", ") || "Sin áreas";
    const supports = s.support?.join(", ") || "Sin preferencia";
    return '<tr><td><strong>'+html(display)+'</strong><br><small>'+html(s.submitted_contact || "Sin contacto")+'</small></td>'+
      '<td>'+html(detail)+'</td><td>'+html(supports)+'</td><td>'+html(s.desired_start || "No indicado")+'</td>'+
      '<td>'+html(s.information_interest || "No indicado")+'<br><small>'+(s.consent ? "Autorizó contacto" : "Sin autorización de contacto")+'</small></td>'+
      '<td>'+html(niceDate(s.created_at))+'</td></tr>';
  }).join("");
  const surveySection = panel("Encuestas de diagnóstico",
    surveys.length ? '<div class="table-wrap"><table><thead><tr><th>Participante</th><th>Áreas de interés</th><th>Apoyo solicitado</th><th>Momento</th><th>Información</th><th>Fecha</th></tr></thead><tbody>'+surveyRows+'</tbody></table></div>'
    : '<div class="empty">Todavía no hay respuestas de la encuesta de diagnóstico.</div>');
  // Esta vista utiliza las solicitudes del CRM que ya existen, sin crear una base paralela.
  // La atribución exacta a campañas requiere que el endpoint público registre source explícitamente.
  const matches = state.appointments.filter(a =>
    /landing[_-]?coaching[_-]?personal/i.test(a.source || "") ||
    (/coaching personal|sesión personal|sesion personal/i.test(a.title || "") && a.source !== "manual")
  );
  const contacts = new Map(state.contacts.map(c => [c.id,c]));
  const pending = matches.filter(a => a.status === "requested").length;
  const confirmed = matches.filter(a => a.status === "confirmed").length;
  const rows = matches.map(a => {
    const c = contacts.get(a.contact_id);
    const stage = c?.stage || "lead";
    return '<tr><td><strong>'+html(c?.display_name || "Contacto no disponible")+'</strong><br><small>'+html(c?.email || "Sin correo")+'</small><br><small>'+html(c?.phone || "Sin teléfono")+'</small></td>'+
      '<td>'+html(a.title || "Coaching personal")+'<br><small>'+html(a.source || "Origen no identificado")+'</small></td>'+
      '<td><span class="pill">'+html(bookingStatus[a.status] || a.status)+'</span><br><small>'+html(stages.find(s => s[0] === stage)?.[1] || stage)+'</small></td>'+
      '<td>'+html(niceDate(a.created_at))+'<br><small>'+html(a.requested_time_text || "")+'</small></td>'+
      '<td><button class="btn light" type="button" data-action="goto" data-target="reservas">Ver reserva</button></td></tr>';
  }).join("");
  return heading("Leads · Coaching personal","Solicitudes de coaching personal recibidas mediante el sistema de citas de Guadalupe.",
    '<a class="btn outline" href="/coaching-personal/" target="_blank" rel="noopener noreferrer">Ver landing ↗</a>')+
    '<section class="stat-grid">'+stat("Solicitudes relacionadas",matches.length,"Coaching personal")+stat("Por confirmar",pending,"Seguimiento pendiente")+stat("Confirmadas",confirmed,"Sesiones agendadas")+stat("Contactos identificados",new Set(matches.map(a=>a.contact_id).filter(id=>contacts.has(id))).size,"Cruce con CRM")+'</section>'+
    '<div class="notice">Esta vista identifica solicitudes de coaching personal registradas en Reservas. Para distinguir con certeza los contactos captados exclusivamente por la landing, la API pública debe guardar un origen específico. Las solicitudes sin cita aún no se capturan por este formulario.</div>'+
    surveySection + panel("Prospectos y solicitudes", rows
      ? '<div class="table-wrap"><table><thead><tr><th>Prospecto</th><th>Servicio / origen</th><th>Estado</th><th>Recibido</th><th>Acción</th></tr></thead><tbody>'+rows+'</tbody></table></div>'
      : '<div class="empty">Aún no hay solicitudes de coaching personal identificables. Comprueba la publicación de la landing y su conexión con el CRM.</div>');
}
function messagesPage() {
  const left=state.conversations.map(c=>'<button type="button" class="message-item'+(state.selectedConversation===c.id?' selected':'')+'" data-conversation="'+html(c.id)+'"><strong>'+html(c.subject||"Conversación "+c.channel)+'</strong><small>'+html((c.last_message_preview||"Sin vista previa").slice(0,85))+'</small><small>'+html(niceDate(c.last_message_at))+' · '+html(c.unread_count||0)+' sin leer</small></button>').join("");
  const right=state.selectedConversation
    ? '<div class="message-thread">'+(state.messages.length?state.messages.map(m=>'<div class="bubble'+(m.direction==="outgoing"?' outgoing':'')+'">'+html(m.body||"Mensaje multimedia")+'<small>'+html(niceDate(m.sent_at||m.created_at))+'</small></div>').join(""):'<div class="empty">No se encontraron mensajes.</div>')+'</div><div class="row-tools"><span class="small">Las respuestas por canales externos se envían de forma segura desde Compás One.</span><a class="btn outline" target="_blank" rel="noopener noreferrer" href="'+COMPAS_ONE_URL+'/chat/'+urlParam(state.selectedConversation)+'">Responder desde Compás One ↗</a></div>'
    : '<div class="empty">Selecciona una conversación para ver su historial.</div>';
  return heading("Mis mensajes","Consulta las conversaciones de Guadalupe sin mezclar las de ETERNI.")+
    panel("Bandeja de entrada",'<div class="message-layout"><div class="message-list">'+(left||'<div class="empty">No hay conversaciones disponibles.</div>')+'</div><div>'+right+'</div></div>');
}
function bookingsPage(){
  const map=new Map(state.contacts.map(c=>[c.id,c.display_name]));
  const rows=state.appointments.map(a=>'<tr><td><strong>'+html(map.get(a.contact_id)||"Contacto")+'</strong><br><small>'+html(a.title)+'</small></td><td>'+html(bookingStatus[a.status]||a.status)+'</td><td>'+html(niceDate(a.start_at))+'<br><small>'+html(a.requested_time_text||"")+'</small></td><td>'+(a.status==="requested" ? '<button class="btn light" data-action="confirm-booking" data-booking="'+html(a.id)+'">Confirmar</button>':'—')+'</td></tr>').join("");
  return heading("Reservas","Controla solicitudes de sesiones y horarios confirmados.",'<button class="btn primary" data-action="new-booking">+ Solicitar reserva</button>')+
    panel("Todas las reservas",rows?'<div class="table-wrap"><table><thead><tr><th>Sesión</th><th>Estado</th><th>Horario</th><th>Acción</th></tr></thead><tbody>'+rows+'</tbody></table></div>':
    '<div class="empty">Aún no hay reservas. Puedes registrar una solicitud para un contacto del CRM.</div>');
}
function calendarPage(){
  const reference=new Date(), base=new Date(reference.getFullYear(),reference.getMonth()+state.monthOffset,1);
  const year=base.getFullYear(),month=base.getMonth(),start=(base.getDay()+6)%7;
  const days=new Date(year,month+1,0).getDate();
  const monthLabel=new Intl.DateTimeFormat("es-MX",{month:"long",year:"numeric"}).format(base);
  const slots=['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'].map(x=>'<div class="text-muted" style="text-align:center;font-weight:800;font-size:11px">'+x+'</div>');
  for(let i=0;i<start;i++)slots.push('<div class="cal-day empty-day"></div>');
  for(let d=1;d<=days;d++){
    const day=String(year)+"-"+String(month+1).padStart(2,"0")+"-"+String(d).padStart(2,"0");
    const matching=state.appointments.filter(a=>a.start_at&&new Intl.DateTimeFormat('en-CA',{timeZone:'America/Mexico_City',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(a.start_at))===day&&a.status==="confirmed");
    slots.push('<div class="cal-day'+(day===new Intl.DateTimeFormat('en-CA',{timeZone:'America/Mexico_City',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date())?' today':'')+'"><strong>'+d+'</strong>'+matching.map(a=>'<span class="cal-booking">'+html(a.title)+'</span>').join('')+'</div>');
  }
  return heading("Calendario","Consulta tus sesiones confirmadas y las fechas disponibles.")+
    panel("Mi agenda",'<div class="calendar-heading"><button class="btn light" data-action="prev-month">← Anterior</button><h2>'+html(monthLabel)+'</h2><button class="btn light" data-action="next-month">Siguiente →</button></div><div class="calendar-wrap">'+slots.join('')+'</div><p class="small" style="margin-top:16px">Las reservas sin confirmar no bloquean el calendario. Confírmalas desde Reservas.</p>');
}
function trafficPage(){
  const connected=state.cloudflare?.status==="connected";
  const latest=state.traffic.filter(row=>new Date(row.metric_date).getTime()>Date.now()-30*86400000);
  const max=Math.max(1,...latest.map(d=>Number(d.visits||0)));
  const visits=latest.reduce((s,x)=>s+Number(x.visits||0),0);
  const views=latest.reduce((s,x)=>s+Number(x.pageviews||0),0);
  const bars=latest.map(row=>'<div class="bar-col" title="'+html(row.metric_date+': '+row.visits+' visitas')+'"><div class="bar" style="height:'+Math.max(1,Math.min(100,Number(row.visits||0)*100/max))+'%"></div></div>').join('');
  const breakdown=(rows)=>rows.length?rows.map(r=>'<div class="split-row"><span>'+html(r.dimension_value)+'</span><strong>'+fmt(Number(r.visits||0))+'</strong></div>').join(''):'<p class="text-muted">Sin datos.</p>';
  return heading("Tráfico web","Visitas y comportamiento del sitio, conectados por Compás One.")+
    (!connected?'<div class="notice">Cloudflare Web Analytics todavía no está vinculado al espacio exclusivo de Guadalupe. Es necesario conectarlo desde Compás One.</div>':'')+
    '<section class="stat-grid">'+stat("Visitas",connected&&latest.length?visits:null,"30 días")+stat("Páginas vistas",connected&&latest.length?views:null,"30 días")+stat("Fuentes disponibles",state.sources.length,"Referencias de Cloudflare")+stat("Última actualización",state.cloudflare?.last_synced_at?niceDate(state.cloudflare.last_synced_at):"—","Sincronización")+'</section>'+
    panel("Visitas por día",latest.length?'<div class="bars">'+bars+'</div>':'<div class="empty">El gráfico se habilitará al contar con visitas sincronizadas.</div>')+
    '<div class="grid-two" style="margin-top:20px">'+panel("Fuentes de visitas",breakdown(state.sources))+panel("Dispositivos",breakdown(state.devices))+'</div>';
}
function agentsPage(){
  const configured=!!state.agent;
  return heading("Mis agentes","Atención comercial, organizada desde el ecosistema Compás Fly.")+
    panel("Compás Fly Front",'<div class="notice">'+(configured?(state.agent.enabled?"Agente habilitado.":"Perfil de agente preparado, pero pendiente de habilitar."):"No hay un perfil disponible aún.")+'</div><p class="text-muted">El agente puede atender preguntas comerciales, registrar la intención de contratación y escalar solicitudes. No debe recopilar información confidencial del proceso de coaching.</p><a class="btn primary" href="'+COMPAS_ONE_URL+'/ai" target="_blank" rel="noopener noreferrer">Gestionar agente en Compás One ↗</a>')+
    '<p class="small" style="margin-top:20px">La configuración de agentes, mensajes salientes e integraciones se realiza en la plataforma central para mantener permisos, límites y trazabilidad.</p>';
}
function render(){
  const pages={inicio:summary,clientes:contactsPage,landing:landingPage,mensajes:messagesPage,reservas:bookingsPage,calendario:calendarPage,trafico:trafficPage,agentes:agentsPage,pagos:paymentsPage};
  if(state.page==="meta"){
    $("#view").replaceChildren(metaCampaignsPage({heading,panel,workspaceId:WORKSPACE_ID,db,appointments:state.appointments,contacts:state.contacts}));
  } else {
    $("#view").innerHTML=(pages[state.page]||summary)();
  }
  $("#syncState").textContent=state.warnings.length?"Conexión parcial":"Conectado";
}
function dialog(title,fields,onSubmit){
  const backdrop=document.createElement("div");
  backdrop.className="dialog";
  const inner=document.createElement("div");
  inner.className="dialog-inner";
  const h=document.createElement("h2");h.textContent=title;
  const form=document.createElement("form");form.append(...fields);
  const buttons=document.createElement("div");buttons.className="dialog-buttons";
  const cancel=document.createElement("button");cancel.type="button";cancel.className="btn light";cancel.textContent="Cancelar";
  cancel.addEventListener("click",()=>backdrop.remove());
  const save=document.createElement("button");save.type="submit";save.className="btn primary";save.textContent="Guardar";
  buttons.append(cancel,save);form.append(buttons);
  form.addEventListener("submit",async e=>{
    e.preventDefault();save.disabled=true;
    try{await onSubmit(new FormData(form));backdrop.remove();await load();render();stateMessage("Guardado correctamente.","success");}
    catch(error){save.disabled=false;const warning=document.createElement("p");warning.className="notice error";warning.textContent=error.message;form.prepend(warning);}
  });
  inner.append(h,form);backdrop.append(inner);
  backdrop.addEventListener("click",e=>{if(e.target===backdrop)backdrop.remove()});
  document.body.append(backdrop);
}
function field(label,name,type="text",required=false,options=null){
  const holder=document.createElement("label");holder.textContent=label;
  let input;
  if(options){
    input=document.createElement("select");
    for(const [value,name] of options){const opt=document.createElement("option");opt.value=value;opt.textContent=name;input.append(opt);}
  } else {input=document.createElement(type==="textarea"?"textarea":"input");if(type!=="textarea")input.type=type;}
  input.name=name;input.required=required;holder.append(input);
  return holder;
}
function newContact(){
  dialog("Nuevo contacto",[
    field("Nombre completo","name","text",true),
    field("Correo electrónico","email","email"),
    field("Teléfono","phone","tel"),
    field("Empresa (opcional)","company","text"),
  ],async data=>{
    await db("contacts",{method:"POST",query:"select=id",prefer:"return=representation",body:{
      workspace_id:WORKSPACE_ID,display_name:String(data.get("name")).trim().slice(0,140),
      email:String(data.get("email")||"").trim()||null,
      phone:String(data.get("phone")||"").trim()||null,
      company_name:String(data.get("company")||"").trim()||null,
      source:"portal_guadalupe",stage:"lead",status:"lead",
    }});
  });
}
function newBooking(){
  if(!state.contacts.length){stateMessage("Primero registra un contacto en el CRM.","error");return;}
  const options=state.contacts.map(c=>[c.id,c.display_name]);
  dialog("Solicitar reserva",[
    field("Contacto","contact","select",true,options),
    field("Motivo de la sesión","title","text",true),
    field("Fecha u horario preferido","preferred","text",true),
  ],async data=>{
    await db("appointments",{method:"POST",query:"select=id",prefer:"return=representation",body:{
      workspace_id:WORKSPACE_ID,contact_id:String(data.get("contact")),title:String(data.get("title")).trim(),
      requested_time_text:String(data.get("preferred")).trim(),
      status:"requested",source:"manual",timezone:"America/Mexico_City",
    }});
  });
}
function confirmBooking(id) {
  // El campo datetime-local se interpreta explícitamente en zona horaria CDMX,
  // que permanece UTC−06:00 en 2026. Evitamos usar el huso del navegador.
  const dateField=field("Fecha y hora de inicio (Ciudad de México)","start","datetime-local",true);
  const duration=field("Duración en minutos","minutes","number",true);
  duration.querySelector("input").min="15";
  duration.querySelector("input").value="60";
  dialog("Confirmar sesión", [dateField,duration],async data=>{
    const local=String(data.get("start"));
    if(!/^\d{4}-\d\d-\d\dT\d\d:\d\d$/.test(local))throw new Error("Introduce fecha y hora válidas.");
    const start=new Date(local+":00-06:00");
    if(!Number.isFinite(start.valueOf())||start.getTime()<Date.now())throw new Error("Selecciona una fecha futura.");
    const minutes=Number(data.get("minutes"));
    if(minutes<15||minutes>480)throw new Error("Duración no válida.");
    const end=new Date(start.getTime()+minutes*60000);
    const overlapping=state.appointments.some(a=>a.id!==id&&a.status==="confirmed"&&a.start_at&&a.end_at&&
      start<new Date(a.end_at)&&end>new Date(a.start_at));
    if(overlapping)throw new Error("Ya existe una sesión confirmada en ese intervalo.");
    await db("appointments",{method:"PATCH",query:"id=eq."+urlParam(id)+"&workspace_id=eq."+WORKSPACE_ID,
      prefer:"return=minimal",body:{status:"confirmed",start_at:start.toISOString(),end_at:end.toISOString()}});
  });
}
async function selectConversation(id){
  state.selectedConversation=id;state.messages=[];render();
  try{state.messages=await db("conversation_messages",{
    query:workspaceQuery("id,body,direction,created_at,sent_at",
      "conversation_id=eq."+urlParam(id)+"&order=created_at.asc&limit=100"),
  });}catch(e){stateMessage(e.message,"error")}render();
}
function logout(){
  // Eliminamos credenciales locales incluso cuando el servidor no responde.
  state.session=null;state.user=null;persist();
  $("#portal").hidden=true;$("#login").hidden=false;
  state.contacts=[];state.messages=[];state.appointments=[];state.commercialDrafts=[];state.role=null;
  $("#loginForm").reset();
}
async function enter(){
  await verifyMember();
  await load();
  $("#login").hidden=true;$("#portal").hidden=false;nav("inicio");
}
async function start(){
  if(!API_URL || !PUBLISHABLE_KEY || !WORKSPACE_ID){
    $("#loginError").hidden=false;
    $("#loginError").textContent="La conexión con Compás One no está configurada. Contacta al administrador.";
    $("#loginForm button[type=submit]").disabled=true;return;
  }
  restore();
  if(!state.session)return;
  try{await token();await enter();}
  catch(error){logout();$("#loginError").hidden=false;$("#loginError").textContent=error.message;}
}
$("#loginForm").addEventListener("submit",async e=>{
  e.preventDefault();const button=e.currentTarget.querySelector("button[type=submit]");
  button.disabled=true;$("#loginError").hidden=true;
  try{
    const data=new FormData(e.currentTarget);
    const tokens=await authFetch("token?grant_type=password","POST",{
      email:String(data.get("email")),password:String(data.get("password")),
    });
    state.session=tokens;persist();await enter();
  }catch(error){logout();$("#loginError").hidden=false;$("#loginError").textContent=error.message;}
  finally{button.disabled=false;}
});
$("#logout").addEventListener("click",async()=>{try{await authFetch("logout","POST")}catch{}logout()});
document.querySelectorAll("[data-page]").forEach(el=>el.addEventListener("click",()=>nav(el.dataset.page)));
$("#view").addEventListener("click",e=>{
  const conversation=e.target.closest("[data-conversation]");
  if(conversation){selectConversation(conversation.dataset.conversation);return;}
  const el=e.target.closest("[data-action]");
  if(!el)return;
  const action=el.dataset.action;
  if(action==="goto"){if(el.dataset.target==="clientes")state.search="";nav(el.dataset.target);}
  if(action==="find-contact"){state.search=el.dataset.name||"";nav("clientes");}
  if(action==="open-conversation"){nav("mensajes");selectConversation(el.dataset.id);}
  if(action==="refresh-dashboard"){el.disabled=true;load().then(()=>render()).catch(error=>{el.disabled=false;stateMessage(error.message,"error");});}
  if(action==="new-draft")editCommercialDraft();
  if(action==="edit-draft")editCommercialDraft(el.dataset.id);
  if(action==="new-contact")newContact();
  if(action==="new-booking")newBooking();
  if(action==="confirm-booking")confirmBooking(el.dataset.booking);
  if(action==="prev-month"){state.monthOffset--;render();}
  if(action==="next-month"){state.monthOffset++;render();}
});
$("#view").addEventListener("input",e=>{
  if(e.target?.id!=="crmSearch")return;
  const location=e.target.selectionStart;
  state.search=e.target.value;render();
  const search=$("#crmSearch");if(search){search.focus();search.setSelectionRange(location,location);}
});
$("#view").addEventListener("change",async e=>{
  if(!e.target.dataset.stage)return;
  const stage=e.target.value,id=e.target.dataset.stage;
  if(!stages.some(s=>s[0]===stage))return;
  e.target.disabled=true;
  try{await db("contacts",{method:"PATCH",query:"id=eq."+urlParam(id)+"&workspace_id=eq."+WORKSPACE_ID,
    prefer:"return=minimal",body:{stage,status:stage==="customer"?"customer":stage==="lost"?"inactive":stage==="lead"?"lead":"prospect"}});
    await load();render();stateMessage("Etapa actualizada.","success");}
  catch(error){stateMessage(error.message,"error");e.target.disabled=false;}
});
start();

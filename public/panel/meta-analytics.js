// Indicadores de Meta: exclusivamente datos del workspace autenticado, nunca cifras simuladas.
// La sincronización de Graph API se realiza en servidor; no guardar tokens de Meta aquí.
const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const number = value => value == null ? "—" : new Intl.NumberFormat("es-MX",{maximumFractionDigits:2}).format(value);
const money = value => value == null ? "—" : new Intl.NumberFormat("es-MX",{style:"currency",currency:"MXN"}).format(value);
const percent = value => value == null ? "—" : number(value)+"%";
const card = (label,value,detail) => '<div class="stat"><span>'+escapeHtml(label)+'</span><strong>'+escapeHtml(value)+'</strong><small>'+escapeHtml(detail)+'</small></div>';
const sum = (rows,key) => rows.reduce((total,row)=>total+Number(row[key]||0),0);
const divide = (a,b,multiplier=1) => b>0 ? a*multiplier/b : null;
export function metaCampaignsPage({heading,panel,workspaceId,db,appointments,contacts}) {
  const container=document.createElement("div");
  container.innerHTML=heading("Meta y campañas","Facebook, Instagram y resultados comerciales de las campañas de Guadalupe.")+
    '<div id="metaStatus" class="notice">Consultando la conexión con Meta…</div>'+
    '<section id="metaMetrics" class="stat-grid"></section>'+
    '<div id="metaCampaignTables"></div>';
  const status=container.querySelector("#metaStatus");
  const metrics=container.querySelector("#metaMetrics");
  const tables=container.querySelector("#metaCampaignTables");
  const params="workspace_id=eq."+encodeURIComponent(workspaceId);
  const load=async()=>{
    // Las tablas deben crearse en Compás One con RLS por workspace y sincronización del servidor.
    const [accountsResult,campaignsResult] = await Promise.allSettled([
      db("workspace_meta_ad_accounts",{query:"select=account_name,account_id,status,last_synced_at,currency&"+params+"&limit=20"}),
      db("workspace_meta_campaign_daily_metrics",{query:"select=campaign_id,campaign_name,metric_date,spend,impressions,reach,clicks,link_clicks,leads,messaging_conversations,landing_page_views,purchases,revenue&"+params+"&order=metric_date.desc&limit=3000"})
    ]);
    if(accountsResult.status==="rejected"||campaignsResult.status==="rejected"){
      status.textContent="Integración pendiente: falta conectar Meta Ads con Compás One y habilitar la sincronización segura de datos de este espacio. No se muestran métricas estimadas.";
      metrics.innerHTML=card("Inversión","—","Sin conexión")+card("Alcance","—","Sin conexión")+card("Conversaciones","—","Sin conexión")+card("Costo por prospecto","—","Sin conexión");
      tables.innerHTML=panel("Activación de Meta",'<p>Conecta los activos autorizados de Facebook, Instagram y la cuenta publicitaria de Guadalupe. El acceso debe hacerse desde el servidor mediante Meta Login, con permisos aprobados, tokens seguros y RLS.</p><p class="small">Permisos recomendados, según las funciones autorizadas: ads_read, pages_show_list, pages_read_engagement e instagram_basic; mensajería requiere permisos y revisión adicionales.</p>');
      return;
    }
    const accounts=accountsResult.value||[];
    const rows=(campaignsResult.value||[]).filter(row=>/^\d{4}-\d{2}-\d{2}$/.test(row.metric_date||""));
    if(!accounts.length){
      status.textContent="Aún no hay cuentas publicitarias vinculadas al espacio de Guadalupe. Conecta los activos desde la configuración de integraciones de Compás One.";
    }else{
      const last=accounts.map(a=>a.last_synced_at).filter(Boolean).sort().at(-1);
      status.textContent="Cuentas autorizadas: "+accounts.length+(last?" · Última sincronización: "+new Date(last).toLocaleString("es-MX"):" · Sin primera sincronización");
    }
    const recent=rows.filter(r=>new Date(r.metric_date+"T12:00:00Z").getTime()>=Date.now()-30*86400000);
    if(!recent.length){
      metrics.innerHTML=card("Inversión","—","Sin datos de 30 días")+card("Alcance","—","Sin datos")+card("Conversaciones","—","Sin datos")+card("Costo por prospecto","—","Sin datos");
      tables.innerHTML=panel("Campañas",'<div class="empty">No hay métricas sincronizadas para los últimos 30 días.</div>');
      return;
    }
    const investment=sum(recent,"spend"), impressions=sum(recent,"impressions"), clicks=sum(recent,"clicks"), leads=sum(recent,"leads"), conversations=sum(recent,"messaging_conversations");
    // Alcance de audiencias no se suma entre días/campañas (usuarios duplicados).
    metrics.innerHTML=card("Inversión",money(investment),"Últimos 30 días")+
      card("Impresiones",number(impressions),"No equivale a personas únicas")+
      card("Clics",number(clicks),"CTR: "+percent(divide(clicks,impressions,100)))+
      card("Conversaciones",number(conversations),"Costo: "+money(divide(investment,conversations)))+
      card("Prospectos de Meta",number(leads),"CPL: "+money(divide(investment,leads)))+
      card("Vistas de landing",number(sum(recent,"landing_page_views")),"Reportadas por Meta");
    const map=new Map();
    for(const r of recent){
      const id=String(r.campaign_id||"");if(!id)continue;
      if(!map.has(id))map.set(id,{name:r.campaign_name||id,spend:0,impressions:0,clicks:0,leads:0,messaging_conversations:0});
      const v=map.get(id);for(const key of ["spend","impressions","clicks","leads","messaging_conversations"])v[key]+=Number(r[key]||0);
    }
    const trs=[...map.values()].sort((a,b)=>b.spend-a.spend).map(r=>'<tr><td><strong>'+escapeHtml(r.name)+'</strong></td><td>'+money(r.spend)+'</td><td>'+number(r.impressions)+'</td><td>'+number(r.clicks)+'</td><td>'+number(r.messaging_conversations)+'</td><td>'+number(r.leads)+'</td><td>'+money(divide(r.spend,r.leads))+'</td></tr>').join("");
    tables.innerHTML=panel("Resultados por campaña · últimos 30 días",trs?'<div class="table-wrap"><table><thead><tr><th>Campaña</th><th>Inversión</th><th>Impresiones</th><th>Clics</th><th>Conversaciones</th><th>Leads</th><th>CPL</th></tr></thead><tbody>'+trs+'</tbody></table></div>':'<div class="empty">Sin campañas en el período.</div>')+
      panel("Conversión y atribución",'<p class="small">Los prospectos y conversaciones anteriores proceden de Meta Ads. Los contactos y reservas del CRM deben guardar identificador de campaña o parámetros UTM para atribuir correctamente ventas e inscripciones. No se atribuyen automáticamente las '+number(contacts.length)+' fichas de contactos ni las '+number(appointments.length)+' reservas existentes.</p><p class="small">El alcance único debe consultarse por período directamente en Meta Insights; sumar el alcance diario daría un valor engañoso. El ROI/ROAS solo se mostrará cuando existan ingresos atribuibles y conciliados.</p>');
  };
  load().catch(()=>{status.textContent="No fue posible consultar Meta en este momento. Intenta actualizar el panel.";});
  return container;
}

// Read-only analytics from the existing Compás One workspace. No Meta credentials in browser.
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const num=v=>v==null?"—":new Intl.NumberFormat("es-MX",{maximumFractionDigits:2}).format(v);
const money=(v,c)=>v==null?"—":new Intl.NumberFormat("es-MX",{style:"currency",currency:c}).format(v);
const sum=(rows,k)=>rows.reduce((a,r)=>a+Number(r[k]||0),0);
const ratio=(a,b)=>b>0?a/b:null;
const card=(l,v,n="")=>'<div class="stat"><span>'+esc(l)+'</span><strong>'+esc(v)+'</strong><small>'+esc(n)+'</small></div>';
const grid=s=>'<section class="stat-grid">'+s+'</section>';
const notice=s=>'<div class="notice">'+esc(s)+'</div>';
const date=v=>v?new Date(v).toLocaleString("es-MX",{timeZone:"America/Mexico_City"}):"Sin sincronizar";
const zero=new Set(["BIF","CLP","DJF","GNF","ISK","JPY","KMF","KRW","PYG","RWF","UGX","VND","VUV","XAF","XOF","XPF"]);
const major=(n,c)=>n/(zero.has(c)?1:100);
export function metaCampaignsPage({heading,panel,workspaceId,db}){
 const root=document.createElement("div");
 root.innerHTML=heading("Meta y campañas","Publicidad pagada y crecimiento orgánico de Facebook e Instagram.")+
 '<div class="notice">Consultando indicadores de Compás One…</div><div data-assigned></div><div data-ads></div><div data-organic></div>';
 const status=root.querySelector(".notice"),ads=root.querySelector("[data-ads]"),organic=root.querySelector("[data-organic]");
 const scope="&workspace_id=eq."+encodeURIComponent(workspaceId);
 const get=(t,cols,extra="")=>db(t,{query:"select="+encodeURIComponent(cols)+scope+extra});
 const since=new Date(Date.now()-29*86400000).toISOString().slice(0,10);
 const until=new Date().toISOString().slice(0,10);
 const link=(path,label)=>'<a class="btn outline" target="_blank" rel="noopener noreferrer" href="https://app.proyectocompas.app/integrations/'+path+'">'+label+'</a>';
 const fetchPages=async(t,cols,extra,order)=>{
  let result=[];
  for(let offset=0;offset<10000;offset+=500){
   const page=await get(t,cols,extra+"&order="+order+"&limit=500&offset="+offset);
   result.push(...page);if(page.length<500)return result;
  }
  throw new Error("Demasiados registros; se requiere agregación en servidor.");
 };
 async function assigned(){
  const target=root.querySelector("[data-assigned]");
  const rows=await fetchPages("evolution_meta_assigned_metrics","external_campaign_id,campaign_name,period_start,period_end,currency,spend,impressions,clicks,synced_at","","external_campaign_id.asc");
  if(!rows.length){target.innerHTML=panel("Campañas gestionadas por Compás Evolution",notice("Todavía no hay estadísticas sincronizadas de campañas asignadas a Guadalupe. La asignación y sincronización se gestionan desde Compás Evolution."));return;}
  const groups=new Map();
  for(const r of rows){const key=JSON.stringify([r.currency,r.period_start,r.period_end]);if(!groups.has(key))groups.set(key,[]);groups.get(key).push(r);}
  let body='<p class="small">Solo campañas asignadas a este espacio. Las cifras de la cuenta central no se incluyen. Períodos y monedas distintos no se suman.</p>';
  for(const rs of groups.values()){
   const {currency,period_start,period_end}=rs[0];
   const total=k=>rs.every(r=>r[k]!=null)?sum(rs,k):null;
   const spend=total("spend"),impressions=total("impressions"),clicks=total("clicks");
   const displayMoney=v=>currency&&/^[A-Z]{3}$/.test(currency)?money(v,currency):num(v);
   body+='<h3>'+esc(period_start)+' a '+esc(period_end)+' · '+esc(currency||"Moneda no disponible")+'</h3>'+grid(card("Inversión",displayMoney(spend))+card("Impresiones",num(impressions))+card("Clics",num(clicks))+card("CTR",num(clicks!=null&&impressions>0?100*clicks/impressions:null)+(clicks!=null&&impressions>0?"%":"")))+
   '<div class="table-wrap"><table><thead><tr><th>Campaña</th><th>Inversión</th><th>Impresiones</th><th>Clics</th><th>Última sincronización</th></tr></thead><tbody>'+rs.map(r=>'<tr><td>'+esc(r.campaign_name)+'</td><td>'+esc(displayMoney(r.spend))+'</td><td>'+num(r.impressions)+'</td><td>'+num(r.clicks)+'</td><td>'+esc(date(r.synced_at))+'</td></tr>').join("")+'</tbody></table></div>';
  }
  target.innerHTML=panel("Campañas gestionadas por Compás Evolution",body+'<p class="small">Los datos son la última lectura guardada, no una consulta en vivo. Conversaciones, prospectos y ventas atribuidas aún no están disponibles en esta fuente.</p>');
 }
 async function paid(){
  const [connections,campaigns,rows]=await Promise.all([
   get("meta_ad_connections","id,ad_account_id,account_name,currency,status,last_synced_at"),
   fetchPages("meta_ad_campaigns","id,connection_id,external_campaign_id,name,effective_status","","id.asc"),
   fetchPages("meta_ad_insights_daily","id,connection_id,campaign_id,external_entity_id,insight_date,currency,spend_minor,impressions,clicks,link_clicks,leads,purchases,purchase_value_minor,raw_actions","&insight_level=eq.campaign&insight_date=gte."+since+"&insight_date=lte."+until,"id.asc")
  ]);
  const connected=connections.filter(c=>c.status==="connected");
  const active=new Set(connected.map(c=>c.id));
  const recent=rows.filter(r=>active.has(r.connection_id));
  const intro=connected.length?connected.map(c=>esc(c.account_name||c.ad_account_id)+" · "+esc(date(c.last_synced_at))).join("<br>"):"No hay una cuenta publicitaria conectada.";
  let body='<p>'+intro+'</p>'+link("meta-ads","Gestionar Meta Ads");
  if(!recent.length){ads.innerHTML=panel("Publicidad pagada",body+notice("Sin indicadores sincronizados en el período."));return;}
  const names=new Map(campaigns.map(c=>[c.id,c]));
  const action=(r,key)=>{const a=r.raw_actions?.actions;return Array.isArray(a)?Number(a.find(x=>x.action_type===key)?.value||0):null;};
  const actionSum=(rs,key)=>rs.every(r=>Array.isArray(r.raw_actions?.actions))?rs.reduce((s,r)=>s+action(r,key),0):null;
  for(const currency of [...new Set(recent.map(r=>r.currency))]){
   const rs=recent.filter(r=>r.currency===currency),spend=major(sum(rs,"spend_minor"),currency),leads=sum(rs,"leads"),clicks=sum(rs,"clicks"),impressions=sum(rs,"impressions");
   const chats=actionSum(rs,"onsite_conversion.messaging_conversation_started_7d"),views=actionSum(rs,"landing_page_view");
   body+='<h3>'+esc(currency)+' · '+esc(since)+' a '+esc(until)+'</h3>'+grid(
    card("Inversión",money(spend,currency))+card("Impresiones",num(impressions))+card("Clics",num(clicks),"CTR: "+(impressions?num(clicks/impressions*100)+"%":"—"))+
    card("Prospectos Meta",num(leads),"CPL: "+money(ratio(spend,leads),currency))+card("Conversaciones iniciadas",num(chats),"Costo: "+money(ratio(spend,chats),currency))+
    card("Vistas de landing",num(views))+card("Compras reportadas por Meta",num(sum(rs,"purchases")))+card("Valor de compras Meta",money(major(sum(rs,"purchase_value_minor"),currency),currency),"No equivale a ingresos conciliados"));
   const groups=new Map();
   for(const r of rs){const k=r.connection_id+":"+r.external_entity_id;if(!groups.has(k))groups.set(k,[]);groups.get(k).push(r);}
   const trs=[...groups.values()].sort((a,b)=>sum(b,"spend_minor")-sum(a,"spend_minor")).map(g=>{
    const c=names.get(g[0].campaign_id),s=major(sum(g,"spend_minor"),currency),l=sum(g,"leads"),m=actionSum(g,"onsite_conversion.messaging_conversation_started_7d");
    return '<tr><td>'+esc(c?.name||g[0].external_entity_id)+'<br><small>'+esc(c?.effective_status||"")+'</small></td><td>'+esc(money(s,currency))+'</td><td>'+num(sum(g,"clicks"))+'</td><td>'+num(m)+'</td><td>'+num(l)+'</td><td>'+esc(money(ratio(s,l),currency))+'</td></tr>';
   }).join("");
   body+='<div class="table-wrap"><table><thead><tr><th>Campaña</th><th>Inversión</th><th>Clics</th><th>Conversaciones</th><th>Leads</th><th>CPL</th></tr></thead><tbody>'+trs+'</tbody></table></div>';
  }
  ads.innerHTML=panel("Publicidad pagada",body+'<p class="small">El alcance único no se suma entre campañas o días. La atribución de ventas del CRM requiere registrar el origen de cada contacto.</p>');
 }
 async function social(){
  const [cs,ss]=await Promise.all([
   get("meta_organic_connections","id,page_name,page_id,instagram_username,instagram_user_id,status,last_synced_at"),
   get("meta_organic_insights_summary","connection_id,period_start,period_end,facebook_followers,facebook_media_views,facebook_unique_media_viewers,facebook_post_engagements,facebook_profile_views,facebook_new_follows,instagram_followers,instagram_media_count,instagram_views,instagram_reach,instagram_accounts_engaged,instagram_total_interactions,instagram_likes,instagram_comments,instagram_saves,instagram_shares")
  ]);
  const c=cs.find(x=>x.status==="connected"),s=c?ss.find(x=>x.connection_id===c.id):null;
  const intro='<p>'+esc(c?c.page_name||c.page_id:"Página no conectada")+' · '+esc(date(c?.last_synced_at))+'</p>'+link("meta-organic","Gestionar Facebook e Instagram");
  const cards=(fields,enabled)=>grid(fields.map(([l,k,n])=>card(l,num(enabled?s?.[k]:null),n||"")).join(""));
  organic.innerHTML=panel("Facebook orgánico",intro+(s?'<p class="small">Período: '+esc(s.period_start)+' a '+esc(s.period_end)+'</p>':notice("Sin métricas sincronizadas."))+cards([
   ["Seguidores","facebook_followers"],["Vistas","facebook_media_views"],["Alcance","facebook_unique_media_viewers","Ventana de 28 días"],["Interacciones","facebook_post_engagements"],["Visitas al perfil","facebook_profile_views"],["Nuevos seguidores","facebook_new_follows"]],!!s))+
   panel("Instagram orgánico",'<p>'+esc(c?.instagram_username?"@"+c.instagram_username:"Cuenta profesional no detectada")+'</p>'+cards([
   ["Seguidores","instagram_followers"],["Publicaciones","instagram_media_count"],["Vistas","instagram_views"],["Alcance","instagram_reach"],["Cuentas que interactuaron","instagram_accounts_engaged"],["Interacciones","instagram_total_interactions"],["Me gusta","instagram_likes"],["Comentarios","instagram_comments"],["Guardados","instagram_saves"],["Compartidos","instagram_shares"]],!!s&&!!c?.instagram_user_id));
 }
 Promise.allSettled([paid(),social(),assigned()]).then(([a,b,d])=>{
  if(d.status==="rejected")root.querySelector("[data-assigned]").innerHTML=panel("Campañas gestionadas por Compás Evolution",notice("No fue posible consultar las campañas asignadas. Revisa los permisos con el administrador."));
  if(a.status==="rejected")ads.innerHTML=panel("Publicidad pagada",notice("No fue posible consultar los datos de Meta Ads. Revisa permisos y conexión.")+link("meta-ads","Gestionar Meta Ads"));
  if(b.status==="rejected")organic.innerHTML=panel("Redes sociales",notice("No fue posible consultar los indicadores orgánicos.")+link("meta-organic","Gestionar redes"));
  status.textContent=a.status==="fulfilled"&&b.status==="fulfilled"&&d.status==="fulfilled"?"Consulta completada · datos del espacio de Guadalupe":"Consulta parcial · revisa las conexiones y permisos";
 });
 return root;
}

'use strict';

const $ = id => document.getElementById(id);
const iconPaths = {
  route:'<circle cx="5" cy="6" r="2"/><circle cx="19" cy="18" r="2"/><path d="M7 6h8a4 4 0 0 1 0 8H9a4 4 0 0 0 0 8h7"/>',
  people:'<circle cx="12" cy="7" r="3"/><path d="M6 21v-3a6 6 0 0 1 12 0v3M3 10a3 3 0 0 0 0 6m18-6a3 3 0 0 1 0 6M2 21v-2m20 2v-2"/>',
  phone:'<rect x="6" y="2" width="12" height="20" rx="2"/><path d="M10 5h4m-3 14h2"/>',
  back:'<path d="M20 12H4m6-6-6 6 6 6"/>',
  cube:'<path d="m12 2 9 5v10l-9 5-9-5V7l9-5Zm0 0v10m0 10V12m-9-5 9 5 9-5"/>',
  accessibility:'<circle cx="12" cy="4" r="2"/><path d="M4 9h16m-8 0v6m0 0-5 7m5-7 5 7"/>',
  spark:'<path d="m12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5L12 2Z"/>',
  pin:'<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
  'pin-plus':'<path d="M17 17c-2 3-5 5-5 5S4 16 4 10a8 8 0 0 1 11-7"/><circle cx="12" cy="10" r="2.5"/><path d="M19 2v6m-3-3h6"/>',
  navigation:'<path d="m21 3-7 18-3-8-8-3L21 3Z"/>',
  locate:'<circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/><path d="M12 1v4m0 14v4M1 12h4m14 0h4"/>',
  recycle:'<path d="m8 5 4-3 5 8m-5-8-2 7M20 11l2 5-10 1m10-1-5-4M9 20l-6-1 4-9m-4 9 6-2"/>',
  heart:'<path d="M20 5a5 5 0 0 0-8 1 5 5 0 0 0-8-1c-6 6 8 16 8 16S26 11 20 5Z"/>',
  camera:'<rect x="3" y="6" width="18" height="15" rx="2"/><path d="m8 6 2-3h4l2 3"/><circle cx="12" cy="13" r="4"/>',
  volume:'<path d="m11 4-6 5H2v6h3l6 5V4Zm4 4a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/>',
  warning:'<path d="m12 3 10 18H2L12 3Z"/><path d="M12 9v5m0 3v1"/>'
};
function hydrateIcons(root = document) {
  root.querySelectorAll('[data-icon]').forEach(el => { el.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${iconPaths[el.dataset.icon] || iconPaths.pin}</svg>`; });
}
hydrateIcons();

const routes = {
  regular:{name:'Superficie más regular',distance:'780 m',time:'16 min',note:'Menos irregularidades registradas. Un tramo requiere atención.',description:'Esta alternativa da prioridad a una superficie más regular y evita el acceso con una rampa reportada como bloqueada. Incluye un sector con irregularidades leves registradas.',slope:'3,2 %',review:'17 oct. · ejemplo',source:'Caminante + revisión',unknown:'Un tramo pendiente de nueva revisión',path:'M328 369V448H712V287'},
  short:{name:'Menor distancia',distance:'590 m',time:'12 min',note:'Incluye una rampa reportada como bloqueada. Requiere revisar el aviso.',description:'Es la alternativa más corta del ejemplo, pero tiene un aviso ciudadano de rampa bloqueada. Ese reporte aún necesita revisión; la distancia no indica que el paso sea adecuado para vos.',slope:'5,1 %',review:'15 oct. · ejemplo',source:'Relevamiento + aviso',unknown:'Aviso de rampa pendiente de verificación',path:'M328 369V287H712'},
  reviewed:{name:'Información más reciente',distance:'940 m',time:'19 min',note:'Recorrido más largo, con una revisión más reciente en el ejemplo.',description:'Prioriza tramos con información revisada más recientemente. Recorre una distancia mayor y permite comparar la vigencia de los datos antes de elegir.',slope:'2,8 %',review:'17 oct. · ejemplo',source:'Revisión de Caminante',unknown:'La revisión no garantiza ausencia de cambios',path:'M328 369V125H712V287'}
};
const state = {route:'regular',recommended:'regular',preferences:{steps:true,regular:true,recent:false,voice:false},screen:'routes',zoom:1,step:0,navigating:false,obstacle:'ramp',confirmations:new Map(),reports:[],diagnosticTimer:null,photoURL:null,toastTimer:null};
const obstacles = {
  ramp:{title:'Rampa reportada como bloqueada',type:'Aviso ciudadano',status:'Pendiente de revisión',source:'Aporte de una familia · ejemplo',date:'16 oct. · 17:40 · simulado',description:'Un aporte informa una obstrucción en el acceso a la rampa. Se requiere una revisión para confirmar su estado y ubicar el paso disponible.',measure:'Sin medición publicada',pending:true},
  surface:{title:'Superficie irregular',type:'Registro de relevamiento',status:'Revisado · ejemplo',source:'Equipo Caminito con Caminante',date:'17 oct. · 09:20 · simulado',description:'El ejemplo reúne un registro de vibración y una observación del operador. La clasificación describe la superficie; su dificultad depende de cada persona y su equipo.',measure:'Irregularidad leve · dato ficticio',pending:false},
  crossing:{title:'Cruce registrado',type:'Registro de relevamiento',status:'Revisado · ejemplo',source:'Equipo Caminito con Caminante',date:'17 oct. · 09:05 · simulado',description:'Se registró la continuidad del cruce y su acceso en este escenario. La revisión tiene fecha y puede requerir actualización si aparecen cambios.',measure:'Pendiente ilustrativa: 3,2 %',pending:false}
};
const escapeHTML = value => String(value).replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
function toast(message) { clearTimeout(state.toastTimer); $('toast').textContent=message; $('toast').hidden=false; state.toastTimer=setTimeout(()=>{$('toast').hidden=true;},5000); }
function openDialog(id) {
  document.querySelectorAll('dialog[open]').forEach(dialog=>dialog.close());
  $(id).showModal();
}
document.querySelectorAll('[data-close]').forEach(button=>button.addEventListener('click',()=>button.closest('dialog').close()));
document.querySelectorAll('dialog').forEach(dialog=>dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}}));

function showScreen(screen, updateHash = true) {
  if(!['routes','community','equipment'].includes(screen))screen='routes';
  state.screen=screen;
  document.querySelectorAll('.screen').forEach(el=>{el.hidden=el.id!==`screen-${screen}`;});
  document.querySelectorAll('.main-nav [data-screen]').forEach(button=>{const active=button.dataset.screen===screen;button.classList.toggle('active',active);if(active)button.setAttribute('aria-current','page');else button.removeAttribute('aria-current');});
  $('breadcrumb').textContent={routes:'Mi recorrido',community:'Comunidad',equipment:'Segunda vida'}[screen];
  document.title=`${$('breadcrumb').textContent} · Prototipo — Caminito`;
  if(updateHash)history.replaceState(null,'',`#${screen}`);
  if(screen==='community')renderCommunity();
}
document.querySelectorAll('[data-screen]').forEach(button=>button.addEventListener('click',()=>{showScreen(button.dataset.screen);window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}));
window.addEventListener('hashchange',()=>showScreen(location.hash.slice(1),false));

function renderRoutes() {
  $('route-cards').innerHTML=Object.entries(routes).map(([id,route])=>`<button class="route-card ${state.route===id?'selected':''}" data-route="${id}" aria-pressed="${state.route===id}">${state.recommended===id?'<span class="recommended">SEGÚN TUS PREFERENCIAS</span>':''}<div class="route-card-heading"><span class="route-radio" aria-hidden="true"></span><strong>${route.name}</strong></div><div class="route-meta"><span>${route.distance}</span><span>${route.time} de ejemplo</span></div><p class="${id==='short'?'route-warning':''}">${route.note}</p></button>`).join('');
  $('route-cards').querySelectorAll('[data-route]').forEach(button=>button.addEventListener('click',()=>selectRoute(button.dataset.route)));
  const r=routes[state.route];
  $('map-route-name').textContent=r.name;$('map-route-distance').textContent=r.distance;
  for(const id of Object.keys(routes)){
    const path=$(`path-${id}`);const selected=id===state.route;
    path.setAttribute('stroke',selected?'#3d6955':id==='short'?'#c79679':'#9ca99a');
    path.setAttribute('stroke-width',selected?'8':'4');path.setAttribute('stroke-dasharray',selected?'':'8 9');
    path.setAttribute('opacity',selected?'1':'.55');
    if(selected)path.parentElement.append(path);
  }
  $('route-context').innerHTML=`<div><span class="eyebrow">¿POR QUÉ ESTA ALTERNATIVA?</span><h2>${r.name}</h2><p>${r.description}</p></div><div class="context-facts"><div class="context-fact"><span>Pendiente máxima del ejemplo</span><strong>${r.slope}</strong></div><div class="context-fact"><span>Última revisión simulada</span><strong>${r.review}</strong></div><div class="context-fact"><span>Origen</span><strong>${r.source}</strong></div><div class="context-fact"><span>Para tener en cuenta</span><strong>${state.route==='short'?'Aviso pendiente':'Revisar condiciones'}</strong></div></div><p class="context-footnote">${r.unknown}. Distancias, tiempos y pendientes ficticios. Las condiciones se explican; no se certifica que una ruta sea apta para todas las personas.</p>`;
}
function selectRoute(id){if(state.navigating)endJourney();state.route=id;renderRoutes();}
function applyPreferences() {
  const p=state.preferences;
  state.recommended=p.recent?'reviewed':p.regular||p.steps?'regular':'short';
  const labels=[];if(p.steps)labels.push('Evitar escalones');if(p.regular)labels.push('Menos irregularidades');if(p.recent)labels.push('Datos revisados');if(p.voice)labels.push('Indicaciones habladas');
  $('preference-summary').innerHTML=(labels.length?labels:['Sin prioridades adicionales']).map(label=>`<span>${label}</span>`).join('');
  selectRoute(state.recommended);
}
$('journey-form').addEventListener('submit',event=>{event.preventDefault();applyPreferences();const destination=$('destination').selectedOptions[0].textContent;toast(`Alternativas del escenario actualizadas hacia ${destination}. Son recorridos simulados.`);});
$('preferences-open').addEventListener('click',()=>openDialog('preferences-dialog'));
$('preferences-form').addEventListener('submit',event=>{event.preventDefault();state.preferences={steps:$('avoid-steps').checked,regular:$('regular-surface').checked,recent:$('recent-data').checked,voice:$('voice-guidance').checked};applyPreferences();$('preferences-dialog').close();toast('Preferencias aplicadas al escenario de ejemplo.');});
$('mobility').addEventListener('change',()=>{if($('mobility').value==='vision'){$('voice-guidance').checked=true;state.preferences.voice=true;applyPreferences();}toast('Podés ajustar las preferencias para este viaje en Personalizar.');});
$('accessibility').addEventListener('click',()=>{const enabled=document.body.classList.toggle('high-contrast');$('accessibility').setAttribute('aria-pressed',String(enabled));$('accessibility').setAttribute('aria-label',enabled?'Desactivar vista de alto contraste y texto grande':'Activar vista de alto contraste y texto grande');});

function updateZoom(){const w=900/state.zoom,h=570/state.zoom;$('city-map').setAttribute('viewBox',`${450-w/2} ${285-h/2} ${w} ${h}`);$('zoom-in').disabled=state.zoom>=1.8;$('zoom-out').disabled=state.zoom<=1;}
$('zoom-in').addEventListener('click',()=>{state.zoom=Math.min(1.8,state.zoom+.2);updateZoom();});
$('zoom-out').addEventListener('click',()=>{state.zoom=Math.max(1,state.zoom-.2);updateZoom();});
$('zoom-reset').addEventListener('click',()=>{state.zoom=1;updateZoom();});
$('toggle-obstacles').addEventListener('click',()=>{const enabled=$('toggle-obstacles').getAttribute('aria-pressed')!=='true';$('toggle-obstacles').setAttribute('aria-pressed',String(enabled));$('obstacle-markers').toggleAttribute('hidden',!enabled);});
$('toggle-quality').addEventListener('click',()=>{const enabled=$('toggle-quality').getAttribute('aria-pressed')!=='true';$('toggle-quality').setAttribute('aria-pressed',String(enabled));$('map-quality').toggleAttribute('hidden',!enabled);});
function openObstacle(id){
  state.obstacle=id;const item=obstacles[id];if(!item)return;
  $('obstacle-title').textContent=item.title;
  $('obstacle-detail').innerHTML=`<span class="evidence-tag ${item.pending?'pending':''}">${item.status}</span><p class="obstacle-description">${escapeHTML(item.description)}</p><div class="obstacle-placeholder">Registro ilustrativo · sin fotografía de campo</div><div class="evidence-grid"><div><span>Origen del dato</span><strong>${escapeHTML(item.source)}</strong></div><div><span>Fecha</span><strong>${item.date}</strong></div><div><span>Tipo</span><strong>${item.type}</strong></div><div><span>Medición</span><strong>${item.measure}</strong></div></div><div class="dialog-note">Confirmar que un obstáculo sigue allí agrega un aporte. No convierte automáticamente un aviso en una medición verificada.</div>`;
  $('confirm-obstacle').disabled=state.confirmations.has(id);$('confirm-obstacle').textContent=state.confirmations.has(id)?'Ya aportaste en esta demo':'Sigue igual · simular aporte';
  openDialog('obstacle-dialog');
}
document.querySelectorAll('[data-obstacle]').forEach(marker=>{marker.addEventListener('click',()=>openObstacle(marker.dataset.obstacle));marker.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();openObstacle(marker.dataset.obstacle);}});});
$('confirm-obstacle').addEventListener('click',()=>{state.confirmations.set(state.obstacle,true);$('obstacle-dialog').close();renderCommunity();toast('Aporte agregado a esta demo. El estado de revisión se conserva.');});

function openReport(){openDialog('report-dialog');}
document.querySelectorAll('.report-trigger').forEach(button=>button.addEventListener('click',openReport));
$('report-photo').addEventListener('change',()=>{if(state.photoURL)URL.revokeObjectURL(state.photoURL);const file=$('report-photo').files[0];$('photo-preview').hidden=true;if(file&&file.type.startsWith('image/')){state.photoURL=URL.createObjectURL(file);$('photo-preview').src=state.photoURL;$('photo-preview').hidden=false;}});
$('report-form').addEventListener('submit',event=>{
  event.preventDefault();const type=$('report-type').value;const description=$('report-text').value.trim()||'Aviso creado durante la demostración del prototipo.';
  const report={id:`local-${state.reports.length+1}`,title:type,description,location:$('report-location').value};state.reports.unshift(report);
  obstacles[report.id]={title:type,type:'Aviso de esta demo',status:'Pendiente de revisión',source:'Tu aporte simulado',date:'Ahora · sesión de ejemplo',description,measure:'Sin medición publicada',pending:true};
  $('new-report-marker').dataset.obstacle=report.id;
  $('new-report-marker').removeAttribute('hidden');$('obstacle-markers').removeAttribute('hidden');$('toggle-obstacles').setAttribute('aria-pressed','true');
  $('report-dialog').close();$('report-form').reset();$('photo-preview').hidden=true;if(state.photoURL){URL.revokeObjectURL(state.photoURL);state.photoURL=null;}
  renderCommunity();toast('Aviso agregado al mapa de ejemplo. No se publicó ni se envió; se borra al recargar.');
});
function renderCommunity(){
  const samples=[
    {id:'ramp',title:'Una rampa necesita revisión',description:'Una familia avisó que hay una obstrucción. Los aportes ayudan a decidir qué volver a relevar.',location:'Cruce del escenario ilustrativo',tag:'Aviso pendiente',pending:true,icon:'warning'},
    {id:'surface',title:'Una vereda, con más contexto',description:'El equipo agregó un registro de movimiento y la observación del operador. Se muestra su origen y revisión.',location:'Tramo este · ejemplo',tag:'Registro revisado · simulado',pending:false,icon:'route'},
    {id:'crossing',title:'Volver para comprobar un cambio',description:'Una visita de seguimiento permite contrastar el registro anterior con las condiciones observadas.',location:'Cruce junto a la plaza · ejemplo',tag:'Seguimiento de ejemplo',pending:false,icon:'pin'}
  ];
  const locals=state.reports.map(r=>({...r,tag:'Tu aviso · pendiente',pending:true,icon:'pin-plus'}));
  $('community-reports').innerHTML=[...locals,...samples].map(r=>`<article class="report-item"><div class="report-item-top"><span data-icon="${r.icon}"></span><div><h3>${escapeHTML(r.title)}</h3><small>${escapeHTML(r.location)} · datos simulados</small></div></div><p>${escapeHTML(r.description)}</p><div class="report-item-bottom"><span class="evidence-tag ${r.pending?'pending':''}">${r.tag}${state.confirmations.has(r.id)?' · con tu aporte':''}</span><button class="text-button" data-report-detail="${r.id}">Ver origen y detalle ↗</button></div></article>`).join('');
  hydrateIcons($('community-reports'));$('community-reports').querySelectorAll('[data-report-detail]').forEach(button=>button.addEventListener('click',()=>openObstacle(button.dataset.reportDetail)));
}

function navigationSteps(){
  const r=routes[state.route];const destination=$('destination').selectedOptions[0].textContent;
  return [
    {title:'Conocé el recorrido antes de salir.',description:`Elegiste ${r.name.toLowerCase()}. Distancia de ejemplo: ${r.distance}. Podés avanzar por los tramos de esta simulación.`,position:[328,369]},
    {title:'Un cruce, con información.',description:state.route==='short'?'En el próximo cruce del ejemplo hay un aviso de rampa bloqueada pendiente de revisión.':'El siguiente cruce tiene un registro revisado en el ejemplo. Los cambios posteriores pueden modificar sus condiciones.',position:state.route==='short'?[328,287]:state.route==='reviewed'?[328,125]:[328,448]},
    {title:'Anticipar una complicación.',description:state.route==='short'?'El aviso ciudadano no confirma que exista un paso disponible. Podés volver y comparar otra alternativa.':'Hay una irregularidad registrada en un tramo del ejemplo. Este aviso proviene del mapa: no detecta obstáculos nuevos en tiempo real.',position:state.route==='reviewed'?[712,125]:state.route==='short'?[535,287]:[712,380]},
    {title:'Llegaste al final del ejemplo.',description:`Destino seleccionado: ${destination}. La orientación real tendría que incluir la entrada y la continuidad del paso. ¿Querés aportar algo al mapa?`,position:[712,287]}
  ];
}
function renderNavigation(){
  const steps=navigationSteps(),step=steps[state.step];$('navigation-title').textContent=step.title;$('navigation-description').textContent=step.description;
  $('navigation-progress').innerHTML=steps.map((_,i)=>`<span class="${i<=state.step?'done':''}"></span>`).join('');
  $('next-step').textContent=state.step===steps.length-1?'Finalizar ejemplo ✓':'Siguiente tramo →';
  $('journey-position').setAttribute('transform',`translate(${step.position[0]-328} ${step.position[1]-369})`);
  if(state.preferences.voice)speak(`${step.title} ${step.description}`);
}
function speak(text){if(!('speechSynthesis' in window)||!('SpeechSynthesisUtterance' in window)){toast('Este navegador no ofrece lectura de voz. La indicación está disponible en pantalla.');return;}window.speechSynthesis.cancel();const utterance=new SpeechSynthesisUtterance(text);utterance.lang='es-AR';utterance.rate=.95;window.speechSynthesis.speak(utterance);}
function endJourney(){state.navigating=false;$('navigation-card').hidden=true;$('journey-position').setAttribute('hidden','');$('start-journey').disabled=false;if('speechSynthesis' in window)window.speechSynthesis.cancel();}
$('start-journey').addEventListener('click',()=>{state.navigating=true;state.step=0;$('navigation-card').hidden=false;$('journey-position').removeAttribute('hidden');renderNavigation();$('navigation-card').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'center'});});
$('end-journey').addEventListener('click',endJourney);
$('next-step').addEventListener('click',()=>{if(state.step<3){state.step++;renderNavigation();}else{endJourney();toast('Recorrido de ejemplo finalizado. Podés probar otra alternativa o aportar un aviso.');}});
$('listen-step').addEventListener('click',()=>speak(`${$('navigation-title').textContent} ${$('navigation-description').textContent}`));

const phones={
  complete:{name:'Equipo de ejemplo A',detail:'Perfil completo · funcionamiento supuesto',sensors:[['Acelerómetro','Disponible'],['Giroscopio','Disponible'],['Cámara y ubicación','Disponibles'],['Carga y batería','Requieren revisión física']],title:'Candidato a registro completo',text:'Podría incorporarse a Caminante o a un kit. Antes necesita ensayos de estabilidad, calibración y validación del montaje. Esta simulación no certifica el equipo.'},
  basic:{name:'Equipo de ejemplo B',detail:'Perfil básico · sin giroscopio',sensors:[['Acelerómetro','Disponible'],['Giroscopio','No disponible'],['Cámara y ubicación','Disponibles'],['Pantalla y audio','Disponibles']],title:'Hay otras formas de aportar',text:'Podría servir para consulta, avisos o imágenes; se evaluaría un registro básico con acelerómetro. No se le asignan automáticamente las mismas mediciones que a un equipo completo.'},
  review:{name:'Equipo de ejemplo C',detail:'Estado por revisar · no iniciar pruebas',sensors:[['Estado físico','Revisión necesaria'],['Batería y carga','Sin evaluar'],['Sensores','Sin comprobar'],['Destino del equipo','Pendiente']],title:'Primero, una revisión del equipo',text:'Un punto de recepción evaluaría daños y batería antes de conectar. Según el diagnóstico se consideraría reparación, otro uso o recuperación responsable.'}
};
$('run-diagnostic').addEventListener('click',()=>{
  clearTimeout(state.diagnosticTimer);const scenario=$('phone-scenario').value,button=$('run-diagnostic');button.disabled=true;button.textContent='Preparando resultado de ejemplo…';
  state.diagnosticTimer=setTimeout(()=>{const p=phones[scenario];$('diagnostic-result').innerHTML=`<div class="diagnostic-equipment-name"><span data-icon="phone"></span><div><h3>${p.name}</h3><p>${p.detail}</p></div></div>${p.sensors.map(([name,status])=>`<div class="sensor-row"><span>${name}</span><span class="sensor-status ${status.includes('No ')||status.includes('Sin ')||status.includes('Revisión')?'absent':''}">${status}</span></div>`).join('')}<div class="diagnostic-recommendation ${scenario==='review'?'review':''}"><strong>${p.title}</strong><p>${p.text}</p></div><button class="text-button" id="diagnostic-next">Conocer preparación y préstamo ↗</button>`;hydrateIcons($('diagnostic-result'));$('diagnostic-next').addEventListener('click',()=>openDialog('donation-dialog'));button.disabled=false;button.innerHTML='<span data-icon="spark"></span> Volver a simular';hydrateIcons(button);},750);
});
$('donation-open').addEventListener('click',()=>openDialog('donation-dialog'));

$('assistant-open').addEventListener('click',()=>openDialog('assistant-dialog'));
function ask(question){
  const clean=question.trim();if(!clean)return;const user=document.createElement('div');user.className='chat-message user';user.textContent=clean;$('chat-messages').append(user);
  const q=clean.toLocaleLowerCase('es');let answer;
  if(q.includes('escal')||q.includes('rampa'))answer='Podés activar “Evitar escalones” en Personalizar. En este escenario se recomienda una alternativa más regular. Una rampa bloqueada se muestra como un aviso pendiente; su estado requiere revisión.';
  else if(q.includes('falt')||q.includes('dato')||q.includes('confia'))answer=`En la alternativa elegida: ${routes[state.route].unknown.toLowerCase()}. Podés activar “Calidad de datos” en el mapa y abrir cada punto para ver origen, fecha y estado. Toda esta información es ficticia en la demo.`;
  else if(q.includes('celu')||q.includes('kit')||q.includes('sensor'))answer='En Segunda vida podés probar tres diagnósticos de ejemplo. El equipo técnico asignaría una función según el estado del celular y validaría su montaje. Consultar Caminito no exige kit ni sensores.';
  else if(q.includes('voz')||q.includes('ciega')||q.includes('visión'))answer='El recorrido de ejemplo incluye una opción para escuchar cada indicación y una vista de alto contraste. Describe información registrada; no detecta obstáculos nuevos ni indica que sea seguro cruzar.';
  else if(q.includes('repar')||q.includes('municip'))answer='El modelo propone que los registros fechados orienten inspecciones y prioridades de mantenimiento. No hay reclamos ni comunicaciones reales con el municipio desde esta demo.';
  else answer=`La alternativa “${routes[state.route].name}” ${state.route==='regular'?'prioriza superficies más regulares':state.route==='short'?'reduce la distancia, pero contiene un aviso pendiente':'prioriza información revisada más recientemente'}. Podés comparar sus condiciones y cambiar tus preferencias. Es un escenario simulado, no una recomendación para circular por la ciudad.`;
  const bot=document.createElement('div');bot.className='chat-message bot';bot.textContent=answer;$('chat-messages').append(bot);$('chat-messages').scrollTop=$('chat-messages').scrollHeight;
}
$('chat-form').addEventListener('submit',event=>{event.preventDefault();ask($('chat-input').value);$('chat-input').value='';});
document.querySelectorAll('[data-question]').forEach(button=>button.addEventListener('click',()=>ask(button.dataset.question)));
showScreen(location.hash.slice(1),false);renderRoutes();renderCommunity();updateZoom();

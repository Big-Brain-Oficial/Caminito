import * as THREE from 'three';
import { OrbitControls } from './vendor/OrbitControls.js';

const $ = id => document.getElementById(id);
const icons = {
  car:'<path d="M6 20 19 17 12 10 6 20Zm0 0 12-2M12 10l-2-7m-3 1 6-2m-3 3 5 2"/><circle cx="5" cy="20" r="3"/><circle cx="19" cy="18" r="2.5"/><circle cx="13" cy="10" r="2"/>',
  case:'<rect x="6" y="2" width="13" height="21" rx="2"/><path d="M8 5h9v14H8zM11 21h3M19 10h3v7h-3"/>',
  battery:'<rect x="3" y="5" width="20" height="15" rx="2"/><path d="M8 5v15m10-15v15m-5-10-3 5h4l-2 4M9 2h7"/>',
  fullscreen:'<path d="M2 6V2h4m4 0h4v4m0 4v4h-4m-4 0H2v-4"/>',
  rotate:'<path d="M13 5a5 5 0 1 0 0 6M13 1v4H9"/>',
  reset:'<path d="M3 5a5 5 0 1 1-1 5M3 1v4h4"/>'
};
const svg = name => `<svg viewBox="0 0 ${['car','case','battery'].includes(name)?26:16} ${['car','case','battery'].includes(name)?26:16}" aria-hidden="true">${icons[name]}</svg>`;
const models = {
  carrito: {
    title:'Caminante',short:'Caminante',category:'Movilidad · Relevamiento',icon:'car',number:'01',code:'CM–001',
    subtitle:'Tres puntos de apoyo para observar y registrar el estado de las veredas.',
    dimensions:[['Largo del chasis','640','mm','Bastidor triangular'],['Ancho del chasis','400','mm','Medida máxima'],['Ruedas principales','200','mm','Diámetro de referencia']],
    overviewTitle:'Un recorrido que también genera información.',
    overview:'El carrito reúne una base triangular rígida, tres apoyos y equipos reutilizados. Los celulares de la base registran movimiento; las cámaras superiores aportan contexto visual. Este modelo conserva las medidas originales del proyecto.',
    features:['3 celulares de sensores','2 cámaras superiores','Batería central'],
    specs:[['Chasis','640 × 400 × 18 mm'],['Eje principal','Ø 12 × 590 mm'],['Ruedas principales','2 × Ø 200 × 50 mm'],['Rueda trasera','Ø 125 × 32 mm'],['Separación entre centros','500 mm'],['Eje a pivote trasero','550 mm'],['Mástil provisional','Ø 28,6 × 820 mm'],['Barra superior','420 mm']],
    materialTitle:'Estructura conceptual',material:'El espesor de 18 mm viene de la placa de fenólico original. El material y la sección del bastidor definitivo siguen pendientes.',
    pending:'Faltan el manillar tipo asa, el mecanismo telescópico y la caja electrónica. La versión de ruedas de 320 mm aún no está aplicada.',
    cad:'CarroVeredas.FCStd',cadLabel:'Proyecto editable del carrito',obj:'carrito-obj.zip'
  },
  carcasa: {
    title:'Kit',short:'Kit',category:'Soporte · Navegación',icon:'case',number:'02',code:'CM–002',
    subtitle:'Pantalla accesible, apoyos ajustables y montaje orientable sobre un tubo.',
    dimensions:[['Ancho exterior','100','mm','Carcasa de referencia'],['Largo exterior','208','mm','Con espacio para carga'],['Tubos compatibles','19–22','mm','Con suplementos']],
    overviewTitle:'El teléfono, protegido y al alcance.',
    overview:'Una carcasa abierta sobre la pantalla reúne apoyos interiores ajustables, un marco frontal desmontable y paso para el cable de carga. La rótula permite orientar la pantalla. El suplemento de la abrazadera adapta el montaje al diámetro del tubo.',
    features:['Montaje orientable','Paso de carga','Marco desmontable'],
    specs:[['Medida exterior','100 × 208 × 23 mm'],['Espesor de pared','3 mm'],['Celular de referencia','75 × 160 × 9 mm'],['Ancho objetivo del celular','65–85 mm'],['Largo objetivo del celular','140–180 mm'],['Espesor objetivo','7–14 mm'],['Tubo de referencia','Ø 19 mm'],['Abrazadera sin suplemento','Para tubo Ø 22 mm']],
    materialTitle:'Montaje modular',material:'El teléfono y el tubo son referencias de tamaño. El rango de ajuste es un objetivo de diseño; requiere comprobar cada equipo y detallar las guías.',
    pending:'Falta definir cierres, bloqueo de mordazas, apriete de la rótula y material de fabricación. No es una carcasa estanca.',
    cad:'PrototipoCarcasasCelulares.FCStd',cadLabel:'Proyecto de carcasa + portapowerbank',obj:'carcasa-obj.zip'
  },
  powerbank: {
    title:'Batería',short:'Batería',category:'Energía · Accesorios',icon:'battery',number:'03',code:'CM–003',
    subtitle:'Un módulo de energía separado, desmontable y sujeto al bastidor.',
    dimensions:[['Ancho exterior','86','mm','Portabatería'],['Largo exterior','162','mm','Cuerpo del soporte'],['Alto exterior','33','mm','Sin abrazadera']],
    overviewTitle:'Energía independiente de la carcasa.',
    overview:'La batería tiene un soporte propio para que pueda reemplazarse sin rehacer la carcasa del teléfono. Dos retenes superiores mantienen el volumen de referencia en su alojamiento y una abertura deja salir el cable de alimentación.',
    features:['Módulo independiente','Dos retenes','Abrazadera para tubo'],
    specs:[['Soporte exterior','86 × 162 × 33 mm'],['Espacio interior','80 × 156 × 30 mm'],['Batería de referencia','75 × 150 × 25 mm'],['Espesor de pared','3 mm'],['Retenes superiores','2 × 86 × 12 × 3 mm'],['Salida de cable','46 × 24 mm'],['Montaje en tubo','Ø 19–22 mm'],['Autonomía deseada','24 horas · por validar']],
    materialTitle:'Volumen de referencia',material:'El powerbank mostrado representa espacio físico; no corresponde a una capacidad ni a un producto comercial elegido.',
    pending:'Hay que medir el consumo real del teléfono y elegir la batería. Las 24 horas son un objetivo, no una autonomía garantizada.',
    cad:'PrototipoCarcasasCelulares.FCStd',cadLabel:'Proyecto de carcasa + portapowerbank',obj:'powerbank-obj.zip'
  }
};
let currentKey = null, meshes = [], payload = null, selected = null, requestNumber = 0;
let scene, camera, renderer, controls, group, grid, floor, size = 1, fitTarget;
let exploded = false, wireframe = false, rotating = false;
const cache = new Map();

for (const [key,m] of Object.entries(models)) {
  const button = document.createElement('button'); button.className = 'model-link'; button.dataset.model = key;
  button.innerHTML = `<span class="nav-model-icon">${svg(m.icon)}</span><span><strong>${m.short}</strong><small>${m.category}</small></span><span class="nav-arrow">↗</span>`;
  button.onclick = () => { location.hash = key; };
  $('catalog').append(button);
}
for (const id of ['fullscreen','rotate','reset']) $(id).innerHTML = svg(id);

function initViewer() {
  THREE.Object3D.DEFAULT_UP.set(0,0,1);
  scene = new THREE.Scene();
  renderer = new THREE.WebGLRenderer({canvas:$('scene'),antialias:true,alpha:true});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.35;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  camera = new THREE.PerspectiveCamera(34,1,0.001,100);
  controls = new OrbitControls(camera,renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.075;
  controls.maxPolarAngle = Math.PI*0.85;
  controls.autoRotateSpeed = 0.7;
  scene.add(new THREE.HemisphereLight(0xffffff,0x9fa592,2.8));
  const key = new THREE.DirectionalLight(0xffffff,3.3);
  key.position.set(2,-3,5); key.castShadow=true;
  key.shadow.mapSize.set(2048,2048);
  key.shadow.camera.left=-3;key.shadow.camera.right=3;key.shadow.camera.top=3;key.shadow.camera.bottom=-3;
  key.shadow.normalBias=.002;scene.add(key);
  const fill = new THREE.DirectionalLight(0xe0ebff,1.8);fill.position.set(-3,2,2);scene.add(fill);
  floor = new THREE.Mesh(new THREE.PlaneGeometry(20,20),new THREE.ShadowMaterial({opacity:.12}));
  floor.receiveShadow=true;floor.position.z=-.002;scene.add(floor);
  grid = new THREE.GridHelper(10,100,0xd8ded1,0xe2e7dc);
  grid.rotation.x=Math.PI/2;grid.position.z=-.003;
  grid.material.transparent=true;grid.material.opacity=.4;scene.add(grid);
  new ResizeObserver(resize).observe($('canvas-area'));
  let down;
  $('scene').addEventListener('pointerdown',e=>down={x:e.clientX,y:e.clientY});
  $('scene').addEventListener('pointerup',e=>{
    if(!down||Math.hypot(e.clientX-down.x,e.clientY-down.y)>5)return;
    const rect=$('scene').getBoundingClientRect();
    const point=new THREE.Vector2((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);
    const ray=new THREE.Raycaster();ray.setFromCamera(point,camera);
    const hits=ray.intersectObjects(meshes.filter(m=>m.visible),false);
    selectPart(hits[0]?.object??null);
  });
  const clock=new THREE.Clock();
  renderer.setAnimationLoop(()=>{
    const dt=Math.min(clock.getDelta(),.05);
    for(const mesh of meshes){
      const to=mesh.userData.destination;
      mesh.position.lerp(to,1-Math.exp(-dt*9));
    }
    controls.update();renderer.render(scene,camera);
  });
}
function resize(){if(!renderer)return;const {width,height}=$('canvas-area').getBoundingClientRect();if(!width||!height)return;renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();}
function clearModel(){
  if(group){scene.remove(group);group.traverse(o=>{o.geometry?.dispose();if(o.material)o.material.dispose();});}
  meshes=[];selected=null;group=new THREE.Group();scene.add(group);
}
function buildModel(data){
  clearModel();
  for(const part of data.parts){
    const geometry=new THREE.BufferGeometry();
    geometry.setAttribute('position',new THREE.Float32BufferAttribute(part.positions,3));
    geometry.setIndex(part.indices);geometry.computeVertexNormals();geometry.computeBoundingBox();
    const color=new THREE.Color(...part.color);
    const material=new THREE.MeshStandardMaterial({color,roughness:.65,metalness:part.id.match(/Eje|Cubo|Tornillo|Metal|Cabeza|Tubo|Separador/)? .35:.06,transparent:part.opacity<1,opacity:part.opacity,side:THREE.DoubleSide});
    const mesh=new THREE.Mesh(geometry,material);mesh.name=part.label;
    mesh.castShadow=!part.reference;mesh.receiveShadow=true;
    mesh.userData={part,baseColor:color.clone(),destination:new THREE.Vector3(),explosion:new THREE.Vector3()};
    group.add(mesh);meshes.push(mesh);
    const edgeMaterial=new THREE.LineBasicMaterial({color:0x3d493d,transparent:true,opacity:.16});
    const edge=new THREE.LineSegments(new THREE.EdgesGeometry(geometry,35),edgeMaterial);mesh.add(edge);
  }
  const box=new THREE.Box3().setFromObject(group), center=box.getCenter(new THREE.Vector3()), dimensions=box.getSize(new THREE.Vector3());
  group.position.set(-center.x,-center.y,-box.min.z);
  size=Math.max(dimensions.x,dimensions.y,dimensions.z);
  fitTarget=new THREE.Vector3(0,0,dimensions.z/2);
  for(const mesh of meshes){
    const c=mesh.geometry.boundingBox.getCenter(new THREE.Vector3()).sub(center);
    if(c.length()<size*.1)c.z=size*.1;
    mesh.userData.explosion.copy(c.normalize().multiplyScalar(size*.22));
  }
  controls.minDistance=size*.25;controls.maxDistance=size*8;
  camera.near=size/1000;camera.far=size*100;camera.updateProjectionMatrix();
  grid.scale.setScalar(size*.8);floor.scale.setScalar(size);
  $('view').value='iso';resetView();
  exploded=false;wireframe=false;rotating=false;controls.autoRotate=false;
  $('explode').setAttribute('aria-pressed','false');$('explode').classList.remove('active');
  $('wire').setAttribute('aria-pressed','false');$('wire').classList.remove('active');
  $('solid').setAttribute('aria-pressed','true');$('solid').classList.add('active');
  $('rotate').setAttribute('aria-pressed','false');
  renderParts();resize();
}
function resetView(){
  if(!controls||!fitTarget)return;
  let direction;
  switch($('view').value){
    case 'front':direction=new THREE.Vector3(0,-1,.04);break;
    case 'side':direction=new THREE.Vector3(1,0,.04);break;
    case 'top':direction=new THREE.Vector3(0,-.001,1);break;
    default:direction=currentKey==='carrito'?new THREE.Vector3(1.3,-1.8,1.05):new THREE.Vector3(1,-1.25,1.8);
  }
  controls.target.copy(fitTarget);
  const aspect=camera.aspect||1;
  const distance=size/(2*Math.tan(THREE.MathUtils.degToRad(camera.fov/2)))*1.35/Math.min(1,aspect);
  camera.position.copy(fitTarget).add(direction.normalize().multiplyScalar(distance));controls.update();
}
function friendly(part){
  const known={ApoyoSensorTrasero:'Bastidor triangular y plataformas',RuedaIzquierda:'Rueda principal izquierda',RuedaDerecha:'Rueda principal derecha',CelularSensores:'Sensor delantero derecho',CelularSensorIzquierdo:'Sensor delantero izquierdo',CelularSensorTrasero:'Sensor trasero',PowerbankProvisional:'Powerbank central',Manillar:'Barra superior',MastilProvisional:'Mástil provisional'};
  return known[part.id]??part.label.replace(/^Navegacion/,'').replace(/^Bateria/,'').replace(/([a-záéíóú])([A-Z])/g,'$1 $2').replace(/(\D)(\d)/g,'$1 $2').trim();
}
function selectPart(mesh){
  for(const m of meshes){m.material.color.copy(m.userData.baseColor);m.material.emissive.set(0x000000);}
  selected=mesh;
  $('selected-part').hidden=!mesh;
  if(mesh){mesh.material.emissive.set(0x4a2e0a);mesh.material.color.lerp(new THREE.Color(0xf4b875),.3);$('selected-name').textContent=friendly(mesh.userData.part);}
  renderParts();
}
function renderParts(){
  const query=$('part-search').value.toLocaleLowerCase('es');
  const list=$('parts-list');list.replaceChildren();
  const found=meshes.filter(m=>friendly(m.userData.part).toLocaleLowerCase('es').includes(query));
  $('no-parts').hidden=found.length>0;
  for(const mesh of found){
    const row=document.createElement('div');row.className='part-row'+(selected===mesh?' selected':'')+(!mesh.visible?' off':'');
    const b=document.createElement('button');b.className='part-select';
    const swatch=document.createElement('span');swatch.className='swatch';swatch.style.background='#'+mesh.userData.baseColor.getHexString();
    const name=document.createElement('span');name.textContent=friendly(mesh.userData.part);b.append(swatch,name);
    b.onclick=()=>{mesh.visible=true;selectPart(mesh);};
    const eye=document.createElement('button');eye.className='part-toggle';eye.textContent=mesh.visible?'◉':'○';
    eye.setAttribute('aria-label',(mesh.visible?'Ocultar ':'Mostrar ')+name.textContent);eye.setAttribute('aria-pressed',String(mesh.visible));
    eye.onclick=()=>{mesh.visible=!mesh.visible;if(selected===mesh&&!mesh.visible)selectPart(null);renderParts();};
    row.append(b,eye);list.append(row);
  }
}
function setTab(name){
  for(const button of document.querySelectorAll('[data-tab]')){
    const active=button.dataset.tab===name;button.setAttribute('aria-selected',String(active));button.tabIndex=active?0:-1;
    $('tab-'+button.dataset.tab).hidden=!active;
  }
}
for(const button of document.querySelectorAll('[data-tab]')){
  button.onclick=()=>setTab(button.dataset.tab);
  button.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight'].includes(e.key))return;e.preventDefault();const tabs=[...document.querySelectorAll('[data-tab]')];const next=tabs[(tabs.indexOf(button)+(e.key==='ArrowRight'?1:2))%3];setTab(next.dataset.tab);next.focus();});
}
function fillInformation(key){
  const m=models[key];
  $('title').textContent=m.title;$('subtitle').textContent=m.subtitle;$('model-number').textContent=m.number;$('model-code').textContent=m.code;
  document.title=m.title+' — Caminito';
  for(const button of document.querySelectorAll('[data-model]')){const active=button.dataset.model===key;button.classList.toggle('active',active);if(active)button.setAttribute('aria-current','page');else button.removeAttribute('aria-current');}
  $('dimensions').innerHTML=m.dimensions.map(([label,value,unit,note])=>`<div class="dimension-card"><span>${label}</span><strong>${value}</strong><small>${unit}</small><p>${note}</p></div>`).join('');
  $('overview-title').textContent=m.overviewTitle;$('overview-text').textContent=m.overview;
  $('features').innerHTML=m.features.map(f=>`<span>${f}</span>`).join('');
  $('specs').innerHTML=m.specs.map(([label,value])=>`<div class="spec-row"><dt>${label}</dt><dd>${value}</dd></div>`).join('');
  $('material-note').innerHTML=`<strong>${m.materialTitle}</strong>${m.material}`;$('pending').textContent=m.pending;
  $('main-download').href='./downloads/'+m.cad;
  $('downloads').innerHTML=`<a class="file-link" href="./downloads/${m.cad}" download><span class="file-ext">CAD</span><div><strong>FreeCAD editable</strong><small>${m.cadLabel}</small></div><span>↓</span></a><a class="file-link" href="./downloads/${m.obj}" download><span class="file-ext">OBJ</span><div><strong>Modelo para Blender</strong><small>ZIP · geometría + materiales · metros</small></div><span>↓</span></a>`;
}
async function loadModel(key){
  if(!models[key])key='carrito';
  currentKey=key;const request=++requestNumber;fillInformation(key);setTab('info');
  $('part-search').value='';$('selected-part').hidden=true;$('viewer-error').hidden=true;$('loading').hidden=false;
  $('part-count').textContent='Cargando…';$('parts-total').textContent='';
  try{
    let data=cache.get(key);
    if(!data){const response=await fetch(`./models/${key}.json`);if(!response.ok)throw new Error('No se encontró el archivo del modelo.');data=await response.json();cache.set(key,data);}
    if(request!==requestNumber)return;
    payload=data;$('part-count').textContent=data.parts.length+' piezas';$('parts-total').textContent=data.parts.length;
    if(!renderer)throw new Error('Tu navegador no pudo iniciar WebGL. Probá habilitar la aceleración gráfica o usar otro navegador. Las medidas y descargas siguen disponibles.');
    buildModel(data);
  }catch(error){if(request!==requestNumber)return;$('error-text').textContent=error.message;$('viewer-error').hidden=false;}
  finally{if(request===requestNumber)$('loading').hidden=true;}
}
$('solid').onclick=()=>setWire(false);$('wire').onclick=()=>setWire(true);
function setWire(value){wireframe=value;for(const mesh of meshes)mesh.material.wireframe=value;$('solid').classList.toggle('active',!value);$('wire').classList.toggle('active',value);$('solid').setAttribute('aria-pressed',String(!value));$('wire').setAttribute('aria-pressed',String(value));}
$('explode').onclick=()=>{exploded=!exploded;for(const mesh of meshes)mesh.userData.destination.copy(exploded?mesh.userData.explosion:new THREE.Vector3());$('explode').classList.toggle('active',exploded);$('explode').setAttribute('aria-pressed',String(exploded));};
$('rotate').onclick=()=>{rotating=!rotating;if(controls)controls.autoRotate=rotating;$('rotate').setAttribute('aria-pressed',String(rotating));};
$('reset').onclick=()=>{for(const mesh of meshes){mesh.visible=true;mesh.userData.destination.set(0,0,0);}exploded=false;$('explode').classList.remove('active');$('explode').setAttribute('aria-pressed','false');rotating=false;if(controls)controls.autoRotate=false;$('rotate').setAttribute('aria-pressed','false');setWire(false);selectPart(null);resetView();};
$('view').onchange=resetView;
$('fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await $('viewer-card').requestFullscreen();}catch{ $('fullscreen').title='Pantalla completa no disponible en este navegador'; }};
$('clear-selection').onclick=()=>selectPart(null);$('part-search').oninput=renderParts;
$('show-all').onclick=()=>{for(const mesh of meshes)mesh.visible=true;renderParts();};
$('retry').onclick=()=>{if(!renderer)try{initViewer();}catch{}loadModel(currentKey);};
window.addEventListener('hashchange',()=>loadModel(location.hash.slice(1)));
try{initViewer();}catch(error){console.warn('Visor 3D:',error);}
loadModel(location.hash.slice(1)||'carrito');

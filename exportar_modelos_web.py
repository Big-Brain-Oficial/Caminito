"""Exporta triangulos, colores y nombres de las piezas visibles de FreeCAD."""
import FreeCAD as App
import MeshPart
import os,json

out='/home/lucas/Documentos/ChatGPT/reutilisacion/catalogo-cad/dist/models'
os.makedirs(out,exist_ok=True)
car=App.getDocument('CarroVeredas')
cases=next(d for d in App.listDocuments().values() if d.getObject('Navegacion') and d.getObject('ModuloBateria'))

def export(doc,filename,group=None):
    candidates=group.Group if group else doc.Objects
    pieces=[]
    for obj in candidates:
        if not hasattr(obj,'Shape') or obj.TypeId=='PartDesign::Body':continue
        if obj.Shape.isNull() or not obj.Shape.Solids:continue
        if not obj.ViewObject.Visibility or not hasattr(obj.ViewObject,'ShapeColor'):continue
        if any(p.TypeId=='PartDesign::Body' and not p.ViewObject.Visibility for p in obj.InList):continue
        mesh=MeshPart.meshFromShape(Shape=obj.Shape,LinearDeflection=0.12,AngularDeflection=0.12,Relative=False)
        vertices,triangles=mesh.Topology
        color=list(obj.ViewObject.ShapeColor)[:3]
        pieces.append({'id':obj.Name,'label':obj.Label,
                       'positions':[round(c/1000,7) for v in vertices for c in (v.x,v.y,v.z)],
                       'indices':[n for tri in triangles for n in tri],
                       'color':color,'reference':'Referencia' in obj.Name,
                       'opacity':max(0.25,1-obj.ViewObject.Transparency/100)})
    assert pieces,filename
    payload={'units':'m','source':doc.Label,'parts':pieces}
    with open(os.path.join(out,filename),'w') as f:json.dump(payload,f,separators=(',',':'))
    print(filename,len(pieces),'piezas')

export(car,'carrito.json')
export(cases,'carcasa.json',cases.Navegacion)
export(cases,'powerbank.json',cases.ModuloBateria)

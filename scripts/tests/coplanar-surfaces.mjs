/** Detect overlapping front faces in real scene geometry; shared edges and internal joins are harmless. */
export function coplanarOverlaps(root){
  const planes=new Map();
  root.updateMatrixWorld(true);
  root.traverse(mesh=>{
    if(!mesh.isMesh)return;
    const geometry=mesh.geometry,index=geometry.index,position=geometry.attributes.position;
    for(let i=0;i<(index?.count??position.count);i+=3){
      const vertices=[0,1,2].map(k=>{
        const j=index?index.getX(i+k):i+k;
        return mesh.position.clone().set(position.getX(j),position.getY(j),position.getZ(j)).applyMatrix4(mesh.matrixWorld);
      });
      const [a,b,c]=vertices,n=b.clone().sub(a).cross(c.clone().sub(a));
      if(n.length()<1e-8)continue;
      n.normalize();
      // Opposite-facing surfaces meet inside solid joins. Ground-facing bottoms are never exposed.
      if(n.y<-.99&&vertices.every(v=>Math.abs(v.y)<1e-5))continue;
      const key=[n.x,n.y,n.z,n.dot(a)].map(v=>Math.round(v*10000)).join(',');
      const omit=[Math.abs(n.x),Math.abs(n.y),Math.abs(n.z)].indexOf(Math.max(Math.abs(n.x),Math.abs(n.y),Math.abs(n.z)));
      const points=vertices.map(v=>v.toArray().filter((_,axis)=>axis!==omit));
      const list=planes.get(key)??[];list.push(points);planes.set(key,list);
    }
  });
  const cross=(a,b,p)=>(b[0]-a[0])*(p[1]-a[1])-(b[1]-a[1])*(p[0]-a[0]);
  const area=p=>Math.abs(p.reduce((s,a,i)=>{const b=p[(i+1)%p.length];return s+a[0]*b[1]-b[0]*a[1];},0))/2;
  const overlap=(triangle,clip)=>{
    let out=triangle;const sign=Math.sign(cross(...clip));
    for(let i=0;i<3&&out.length;i++){
      const a=clip[i],b=clip[(i+1)%3],input=out;out=[];
      for(let j=0;j<input.length;j++){
        const start=input[j],end=input[(j+1)%input.length],ds=cross(a,b,start)*sign,de=cross(a,b,end)*sign;
        if(ds>=0)out.push(start);
        if((ds>=0)!==(de>=0)){
          const u=ds/(ds-de);out.push([start[0]+u*(end[0]-start[0]),start[1]+u*(end[1]-start[1])]);
        }
      }
    }
    return out.length>2?area(out):0;
  };
  const found=[];
  for(const [plane,triangles] of planes)for(let i=0;i<triangles.length;i++)for(const b of triangles.slice(i+1)){
    const a=triangles[i],shared=overlap(a,b);if(shared>1e-5)found.push({plane,area:shared});
  }
  return found;
}

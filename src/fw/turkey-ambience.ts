/** Small movements clipped to the actual water, canopy and window in each supplied painting. */
import type { SceneDef } from './scene';

type Rect = [left:number, top:number, right:number, bottom:number];
type Patch = { kind:'water'|'leaves'|'dust'|'rain'|'mist'; wide?:Rect; phone?:Rect; color?:string };
// Wide and phone paintings are separately composed, so neither inherits the other's coordinates.
export const TURKEY_AMBIENCE: Record<string,Patch[]> = {
  tr_simit:[{kind:'water',wide:[.710,.357,.758,.378],phone:[.735,.348,.875,.358]}],
  tr_tea:[{kind:'leaves',wide:[.04,.02,.15,.45],phone:[.02,.025,.12,.29]},
    {kind:'water',wide:[.68,.403,.735,.429],phone:[.875,.325,.965,.347]}],
  tr_coffee:[{kind:'rain',wide:[.808,.09,.923,.30]},
    {kind:'rain',phone:[.715,.05,.846,.132]},
    {kind:'rain',phone:[.899,.03,.99,.127]},
    {kind:'rain',phone:[.903,.164,.991,.306]}],
  tr_market:[{kind:'leaves',wide:[.35,.02,.48,.26],phone:[.40,.012,.61,.23]}],
  tr_fish:[{kind:'water',wide:[.726,.386,.835,.409],phone:[.645,.283,.819,.324],color:'#f8dda0'},
    {kind:'water',wide:[.852,.365,.919,.405],color:'#f8dda0'}],
  tr_kebab:[{kind:'dust',wide:[.10,.54,.24,.61],phone:[.18,.55,.33,.62]}],
  tr_baklava:[{kind:'dust',wide:[.24,.61,.43,.69],phone:[.27,.54,.56,.60]}],
  tr_pide:[{kind:'dust',wide:[.17,.55,.33,.62],phone:[.22,.53,.45,.60]}],
  tr_yufka:[{kind:'leaves',wide:[.015,.07,.07,.35],phone:[.015,.015,.09,.23]},
    {kind:'dust',wide:[.20,.61,.34,.66],phone:[.28,.60,.47,.65]}],
  tr_dolma:[{kind:'leaves',wide:[.035,.03,.16,.28],phone:[.89,.025,.99,.24]}],
  tr_breakfast:[{kind:'leaves',wide:[.52,.01,.69,.20],phone:[.61,.012,.79,.20]}],
  tr_meze:[{kind:'water',wide:[.225,.184,.29,.206],phone:[.80,.312,.93,.326],color:'#f4c68a'}],
  tr_olive:[{kind:'leaves',wide:[.01,.03,.16,.35],phone:[.47,.015,.67,.27],color:'#acb078'}],
  tr_tea_hill:[{kind:'water',wide:[.865,.257,.975,.279],phone:[.88,.215,.985,.244]},
    {kind:'leaves',wide:[.01,.04,.08,.24],phone:[.08,.065,.16,.25]},
    {kind:'mist',wide:[.32,.12,.59,.28],phone:[.20,.19,.56,.29]}],
  tr_supper:[{kind:'leaves',wide:[.01,.025,.11,.27],phone:[.77,.015,.91,.24]}],
};

/** Match scene.ts's portrait-image expansion, including wider portrait tablets. */
export function paintingFrame(portrait:boolean,visibleWidth:number) {
  const width=portrait?Math.max(900*941/1672,visibleWidth):1616;
  return {x:portrait?(1600-width)/2:-8,y:-5,width,height:910};
}
const fraction=(n:number)=>n-Math.floor(n);

export function drawTurkeyAmbience(ctx:CanvasRenderingContext2D,t:number,portrait:boolean,patches:Patch[]) {
  const frame=paintingFrame(portrait,ctx.canvas.width/ctx.getTransform().a);
  for(const [index,patch] of patches.entries()){
    const r=portrait?patch.phone:patch.wide;if(!r)continue;
    const x=frame.x+r[0]*frame.width,y=frame.y+r[1]*frame.height,w=(r[2]-r[0])*frame.width,h=(r[3]-r[1])*frame.height;
    ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();
    if(patch.kind==='water'){
      ctx.strokeStyle=patch.color??'#d4eee9';ctx.lineWidth=portrait?1.3:1.1;ctx.lineCap='round';
      for(let i=0;i<14;i++){
        const phase=t*.14+i*.618+index,fade=Math.sin(Math.PI*fraction(phase))**2;
        const px=x+w*fraction(i*.371+Math.sin(t*.19+i)*.035),py=y+h*fraction(i*.713)+Math.sin(t*.8+i)*h*.045;
        const len=w*(.055+(i%4)*.018);
        ctx.globalAlpha=.38*fade;ctx.beginPath();
        ctx.moveTo(px-len,py);ctx.quadraticCurveTo(px,py+Math.sin(t*.65+i)*1.3,px+len,py);ctx.stroke();
      }
    }else if(patch.kind==='leaves'){
      for(let i=0;i<3;i++){
        const phase=fraction(t/(13+i*3)+i*.373+index*.21);
        const px=x+w*(.30+i*.19+Math.sin(t*.65+i*2)*.10),py=y+phase*h;
        ctx.save();ctx.translate(px,py);ctx.rotate(Math.sin(t*.8+i)*.8+i);
        ctx.globalAlpha=.70*Math.sin(Math.PI*phase)**.6;ctx.fillStyle=patch.color??'#bda064';
        ctx.beginPath();ctx.ellipse(0,0,(portrait?4:4.5)*( .3+Math.abs(Math.cos(t*.8+i))*.7),portrait?1.8:2.2,0,0,Math.PI*2);ctx.fill();
        ctx.restore();
      }
    }else if(patch.kind==='rain'){
      ctx.strokeStyle='#d3e2e1';ctx.lineWidth=.8;
      for(let i=0;i<10;i++){
        const phase=fraction(t*(.14+i%3*.025)+i*.618);
        const px=x+w*fraction(i*.317+.1),py=y+phase*h;
        ctx.globalAlpha=.28*Math.sin(Math.PI*phase);ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(px-1.2,py+7);ctx.stroke();
      }
    }else if(patch.kind==='mist'){
      // Soft banks move within the distant hills; the foreground pickers stay crisp.
      for(let i=0;i<3;i++){
        ctx.save();ctx.translate(x+w*(.25+i*.25+Math.sin(t*.12+i)*.09),y+h*(.4+i*.13));ctx.scale(w*.32,h*.38);
        const fog=ctx.createRadialGradient(0,0,.08,0,0,1);fog.addColorStop(0,'rgba(237,243,232,.13)');fog.addColorStop(1,'rgba(237,243,232,0)');
        ctx.fillStyle=fog;ctx.beginPath();ctx.arc(0,0,1,0,Math.PI*2);ctx.fill();ctx.restore();
      }
    }else{
      ctx.fillStyle='#f3e6c9';
      for(let i=0;i<12;i++){
        const phase=fraction(t*.11+i*.618);
        const px=x+w*fraction(i*.371)+Math.sin(t*.7+i)*3,py=y+h*(1-phase);
        ctx.globalAlpha=.34*Math.sin(Math.PI*phase);ctx.beginPath();ctx.arc(px,py,.8+(i%3)*.3,0,Math.PI*2);ctx.fill();
      }
    }
    ctx.restore();
  }
}

export function withTurkeyAmbience(scene:SceneDef):SceneDef {
  const base=scene.fx,patches=TURKEY_AMBIENCE[scene.id]??[];
  scene.fx=(ctx,t,dt,portrait)=>{base(ctx,t,dt,portrait);drawTurkeyAmbience(ctx,t,portrait,patches);};
  return scene;
}

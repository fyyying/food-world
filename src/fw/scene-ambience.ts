/** Continuous, painting-aligned motion. Coordinates belong to each supplied composition. */
export type PaintingRect = [left: number, top: number, right: number, bottom: number];
export type AmbientPatch = {
  kind: 'leaves' | 'birds' | 'stream-glint' | 'waterfall-glint' | 'dust' | 'rain' | 'mist' | 'light' | 'sunray' | 'breeze' | ProcessVerb;
  wide?: PaintingRect;
  phone?: PaintingRect;
  color?: string;
  leaf?: 'olive';
  angles?: [wide: number, phone: number];
  /** Orientation-specific paths traced inside the patch rectangle, in local 0..1 coordinates. */
  paths?: [wide: Point[][] | undefined, phone: Point[][] | undefined];
  /** Maximum top-pivot rotation for a tightly cropped source layer. */
  sway?: [wide: number, phone: number];
  /** Painted subject isolated by a source-layer breeze. Chilli remains the default. */
  source?: 'chilli' | 'grape';
  /** Process accents can remain still between cycles, or be reserved for touch. */
  clickOnly?: boolean;
  period?: number;
};
export type ProcessVerb = 'pour' | 'pull' | 'toss' | 'puff' | 'lid' | 'stir' | 'turn' | 'flip' | 'roll' | 'sway' | 'harvest' | 'wake' | 'rings' | 'flow' | 'snow' | 'embers' | 'glaze';
type Point = [number, number];
/** Independent composition anchors, expressed around the visible process rather than the room centre. */
function signature(kind: ProcessVerb, wide: Point, phone: Point, color = '#f1d39a', width = .12, height = .12): AmbientPatch {
  const rect = ([x,y]: Point, w: number): PaintingRect => [Math.max(0,x-w/2), Math.max(0,y-height), Math.min(1,x+w/2), Math.min(1,y+.015)];
  return { kind, wide: rect(wide,width), phone: rect(phone,width*1.65), color };
}
// 53 signatures + the existing hotpot boil. No painting is sampled or duplicated by these effects.
export const PAINTED_SIGNATURES: Record<string, AmbientPatch> = {
  noodle_shop: signature('pull',[.20,.43],[.30,.38]),
  teahouse: signature('pour',[.52,.89],[.57,.85],'#c58a32',.045,.09),
  market: signature('sway',[.44,.12],[.83,.18],'#b75639',.14,.07),
  home_kitchen: signature('toss',[.20,.49],[.22,.49],'#e1a346'),
  tower: signature('wake',[.69,.59],[.69,.56],'#eee4bb',.19,.065),
  bao_shop: signature('lid',[.62,.60],[.72,.50],'#c49d6a',.13,.055),
  stone_bridge: signature('wake',[.67,.69],[.63,.62],'#daeae1',.20,.09),
  crab_pond: signature('rings',[.78,.49],[.80,.40],'#d9ecda',.16,.065),
  jiangnan_home: signature('lid',[.36,.60],[.35,.50],'#bc9a67',.12,.055),
  lotus_garden: signature('rings',[.66,.65],[.67,.50],'#d5e8b8',.22,.09),
  rice_wine: signature('pour',[.74,.51],[.66,.47],'#ce9c38',.05,.10),
  river_market: signature('wake',[.88,.75],[.88,.46],'#d9eadb',.15,.08),
  riverside_restaurant: signature('wake',[.85,.57],[.68,.405],'#eee0ad',.18,.06),
  tea_hill: signature('harvest',[.20,.79],[.77,.75],'#638b40',.13,.13),
  kebab_grill: {kind:'light',wide:[.30,.63,.78,.78],phone:[.12,.59,.45,.65],color:'#f3a34b'},
  naan_bakery: {kind:'light',wide:[.40,.55,.60,.66],phone:[.08,.33,.20,.36],color:'#e79b4c'},
  polo_kitchen: {kind:'light',wide:[.20,.53,.54,.64],phone:[.08,.47,.64,.54],color:'#e6b452'},
  laghman_shop: {kind:'dust',wide:[.25,.59,.51,.65],phone:[.18,.51,.53,.56]},
  oasis_bazaar: {kind:'sunray',wide:[.15,0,.75,.75],phone:[.12,0,.72,.65],angles:[-.36,.34]},
  grape_courtyard: {kind:'sunray',wide:[.28,0,.72,.58],phone:[.18,0,.62,.55],angles:[-.52,.42],sway:[.018,.025]},
  oasis_field: {kind:'sunray',wide:[.43,0,.96,.62],phone:[.40,0,.98,.52],angles:[-.45,.38],sway:[.018,.018]},
  chaikhana: {kind:'sunray',wide:[.10,0,.80,.70],phone:[.10,0,.85,.65],angles:[-.42,.36]},
  xj_home: {kind:'dust',wide:[.18,.60,.34,.65],phone:[.21,.44,.39,.47]},
  caravan_stop: {kind:'embers',wide:[.62,.52,.71,.67],phone:[.80,.27,.88,.41],color:'#ffd479'},
  tianshan: {kind:'mist',wide:[.50,.15,.85,.55],phone:[.45,.20,.90,.60]},
  evening_feast: {kind:'light',wide:[.11,.10,.18,.20],phone:[.02,.04,.09,.14],color:'#ffc47a'},
  skewer_courtyard: signature('turn',[.32,.66],[.36,.58],'#eeaa57',.22,.09),
  mantou_kitchen: signature('lid',[.57,.67],[.31,.73],'#e4cea0',.13,.06),
  dumpling_house: signature('toss',[.71,.64],[.75,.54],'#f4dfaf',.09,.12),
  winter_table: signature('snow',[.48,.30],[.49,.31],'#fff9e9',.21,.25),
  courtyard_kitchen: signature('toss',[.23,.57],[.26,.44],'#e5b754',.13,.13),
  hutong: signature('sway',[.51,.24],[.48,.24],'#b8c6b0',.20,.09),
  bing_stall: signature('flip',[.43,.51],[.58,.42],'#e3b56d',.105,.12),
  north_market: signature('sway',[.47,.18],[.50,.21],'#b77951',.19,.09),
  noodle_workshop: signature('pull',[.29,.61],[.44,.54]),
  roast_duck: signature('glaze',[.54,.39],[.49,.38],'#ffd18b',.10,.20),
  vinegar_workshop: signature('pour',[.31,.64],[.49,.57],'#39291d',.06,.13),
  wheat_harvest: signature('harvest',[.50,.66],[.51,.60],'#e5c06f',.21,.18),
  tr_simit: {kind:'birds',wide:[.75,.02,.96,.20],phone:[.59,.045,.95,.18]},
  tr_tea: {kind:'birds',wide:[.66,.02,.94,.18],phone:[.66,.04,.98,.20],period:14},
  tr_coffee: {kind:'rain',wide:[.808,.09,.923,.30],phone:[.903,.164,.991,.306]},
  tr_market: {kind:'breeze',wide:[0,0,.075,.275],phone:[0,0,.06,.18],period:7.2,sway:[.048,.065]},
  tr_fish: {kind:'light',wide:[.40,.72,.50,.88],phone:[.70,.58,.82,.72],color:'#f3a34b'},
  tr_kebab: {kind:'breeze',wide:[.292,.0,.335,.235],phone:[.13,.0,.22,.18],period:6.8,sway:[.052,.072]},
  tr_baklava: {kind:'sunray',wide:[.36,.0,.98,.92],phone:[.36,.0,.99,.90],angles:[.55,.42],sway:[.026,.065]},
  tr_pide: {kind:'breeze',wide:[.57,.0,.74,.20],phone:[.065,.0,.19,.17],period:7.4,sway:[.052,.072]},
  tr_yufka: {kind:'dust',wide:[.19,.60,.36,.75],phone:[.24,.58,.46,.74]},
  tr_dolma: {kind:'breeze',wide:[.39,.0,.50,.24],phone:[.43,.0,.57,.14],period:7.1,sway:[.052,.072]},
  tr_breakfast: {kind:'sunray',wide:[.18,.0,.72,.90],phone:[.08,.0,.77,.82],angles:[-.48,.44]},
  tr_meze: {kind:'breeze',wide:[.585,.0,.67,.19],phone:[.185,.0,.33,.16],period:7.7,sway:[.052,.072]},
  tr_olive: {kind:'leaves',wide:[.37,.04,.59,.52],phone:[.50,.03,.82,.37],leaf:'olive',color:'#82945e'},
  tr_tea_hill: {kind:'mist',wide:[.30,.10,.79,.38],phone:[.22,.15,.76,.39]},
  tr_supper: {kind:'breeze',wide:[.0,.0,.12,.24],phone:[.945,.16,1,.305],period:6.9,sway:[.052,.072]},
};

/** Extra source-observed motion for Xinjiang rooms whose signature alone is too quiet. */
export const XINJIANG_AMBIENCE: Record<string, AmbientPatch[]> = {
  kebab_grill: [
    {kind:'breeze',wide:[.315,0,.365,.15],phone:[.755,.035,.825,.145],period:5.8,sway:[.110,.150],source:'grape'},
  ],
  oasis_field: [
    {kind:'birds',wide:[.58,.025,.95,.18],phone:[.56,.025,.98,.15],period:11.5},
    {kind:'breeze',wide:[.275,0,.325,.14],phone:[.265,.025,.345,.155],period:5.9,sway:[.120,.130],source:'grape'},
  ],
  grape_courtyard: [
    // Two isolated bunches per composition, staggered so the trellis breathes without moving as one sheet.
    {kind:'breeze',wide:[.665,.0,.735,.18],phone:[.64,.0,.76,.16],period:5.4,sway:[.130,.150],source:'grape'},
    {kind:'breeze',wide:[.18,.0,.24,.15],phone:[.455,.105,.56,.205],period:6.2,sway:[.150,.210],source:'grape'},
  ],
  chaikhana: [
    {kind:'breeze',wide:[.355,0,.405,.115],phone:[.445,.075,.505,.185],period:5.7,sway:[.140,.150],source:'grape'},
  ],
  evening_feast: [
    {kind:'breeze',wide:[.225,0,.275,.14],phone:[.265,0,.335,.115],period:5.6,sway:[.120,.140],source:'grape'},
  ],
};
type AmbientArt = {
  leaves: HTMLImageElement[];
  breeze?: Array<[wide?: BreezeLayer, phone?: BreezeLayer]>;
};
type BreezeLayer = { background: HTMLCanvasElement; foreground: HTMLCanvasElement };

/** Match scene.ts's portrait-image expansion, including portrait tablets. */
export function paintingFrame(portrait: boolean, visibleWidth: number) {
  if (!portrait) return { x: -8, y: -5, width: 1616, height: 910 };
  // SVG uses xMidYMid slice: wider portrait tablets crop the top and bottom, rather than stretch.
  const aspect = 941 / 1672, width = Math.max(910 * aspect, visibleWidth), height = width / aspect;
  return { x: (1600 - width) / 2, y: -5 + (910 - height) / 2, width, height };
}
const fraction = (n: number) => n - Math.floor(n);

/** Separate one hanging painted subject, then reconstruct the few pixels behind it. */
function prepareBreezeLayer(image: HTMLImageElement, rect: PaintingRect, subject: AmbientPatch['source']='chilli'): BreezeLayer | undefined {
  if (typeof document === 'undefined') return;
  const width=Math.max(1,Math.round((rect[2]-rect[0])*image.naturalWidth));
  const height=Math.max(1,Math.round((rect[3]-rect[1])*image.naturalHeight));
  const source=document.createElement('canvas');source.width=width;source.height=height;
  const sourceCtx=source.getContext('2d',{willReadFrequently:true});if(!sourceCtx)return;
  sourceCtx.drawImage(image,rect[0]*image.naturalWidth,rect[1]*image.naturalHeight,width,height,0,0,width,height);
  const original=sourceCtx.getImageData(0,0,width,height),mask=new Uint8Array(width*height);
  for(let i=0;i<mask.length;i++) {
    const p=i*4,r=original.data[p],g=original.data[p+1],b=original.data[p+2];
    // Conservative colour keys keep trellis, leaves, walls and people in the static painting.
    const chilli=r>55&&r-g>24&&r>g*1.38&&r>b*1.16;
    const max=Math.max(r,g,b),min=Math.min(r,g,b),chroma=max-min;
    const hue=chroma===0?0:max===r?60*((g-b)/chroma%6):max===g?60*((b-r)/chroma+2):60*((r-g)/chroma+4);
    const grape=max>35&&max<215&&chroma/max>.165&&(hue<25||hue>310);
    if(subject==='grape'?grape:chilli)mask[i]=1;
  }
  // Carry darker painted edges that touch each colour core, without spreading into the surroundings.
  for(let pass=0;pass<3;pass++) {
    const next=mask.slice();
    for(let y=1;y<height-1;y++)for(let x=1;x<width-1;x++)if(!mask[y*width+x]) {
      for(let yy=-1;yy<=1&&!next[y*width+x];yy++)for(let xx=-1;xx<=1;xx++)if(mask[(y+yy)*width+x+xx]){next[y*width+x]=1;break;}
    }
    mask.set(next);
  }
  if(subject==='grape') {
    // Warm grading pushes purple grapes toward red. Keep only the largest connected berry cluster so similarly
    // coloured wood, leaves and neighbouring bunches remain part of the static painting.
    const seen=new Uint8Array(mask.length),queue=new Int32Array(mask.length);let best=new Int32Array(0);
    for(let start=0;start<mask.length;start++)if(mask[start]&&!seen[start]) {
      let head=0,tail=0;queue[tail++]=start;seen[start]=1;
      while(head<tail) {
        const current=queue[head++],y=Math.floor(current/width);
        const neighbours=[current-1,current+1,current-width,current+width];
        for(const next of neighbours)if(next>=0&&next<mask.length&&!seen[next]&&mask[next]
          &&(next===current-width||next===current+width||Math.floor(next/width)===y)) {seen[next]=1;queue[tail++]=next;}
      }
      if(tail>best.length)best=queue.slice(0,tail);
    }
    mask.fill(0);for(const pixel of best)mask[pixel]=1;
  }
  const foreground=document.createElement('canvas');foreground.width=width;foreground.height=height;
  const foregroundCtx=foreground.getContext('2d');if(!foregroundCtx)return;
  const foregroundPixels=new ImageData(new Uint8ClampedArray(original.data),width,height);
  for(let i=0;i<mask.length;i++)foregroundPixels.data[i*4+3]=mask[i]?255:0;
  foregroundCtx.putImageData(foregroundPixels,0,0);

  const background=document.createElement('canvas');background.width=width;background.height=height;
  const backgroundCtx=background.getContext('2d');if(!backgroundCtx)return;
  const backgroundPixels=new ImageData(new Uint8ClampedArray(original.data),width,height),data=backgroundPixels.data;
  // Fill each horizontal subject run from the static pixels immediately beside it. The moving foreground covers most
  // of this repair; it is visible only in the narrow gap opened by the sway.
  for(let y=0;y<height;y++)for(let x=0;x<width;) {
    if(!mask[y*width+x]){x++;continue;}
    const start=x;while(x<width&&mask[y*width+x])x++;const end=x-1;
    const left=Math.max(0,start-1),right=Math.min(width-1,end+1);
    for(let px=start;px<=end;px++) {
      const mix=(px-start+1)/(end-start+2),to=(y*width+px)*4,lp=(y*width+left)*4,rp=(y*width+right)*4;
      for(let c=0;c<3;c++)data[to+c]=Math.round(data[lp+c]*(1-mix)+data[rp+c]*mix);
    }
  }
  backgroundCtx.putImageData(backgroundPixels,0,0);
  return {background,foreground};
}

/** A bounded choreography: all geometry is regenerated from time, so rotation has no stale particles. */
function drawProcess(ctx: CanvasRenderingContext2D, patch: AmbientPatch, t: number, x: number, y: number, w: number, h: number) {
  const phase = fraction(t / (patch.period ?? 7.6));
  const beat = Math.min(1, phase / .64), lift = Math.sin(beat * Math.PI);
  ctx.translate(x,y); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.strokeStyle = patch.color ?? '#edd7a2'; ctx.fillStyle = patch.color ?? '#edd7a2';
  ctx.lineWidth = Math.max(2.3,w*.025);
  const ellipse = (cx: number,cy: number,rx: number,ry: number,fill=false) => {
    ctx.beginPath(); ctx.ellipse(cx,cy,Math.max(.1,rx),Math.max(.1,ry),0,0,Math.PI*2); if(fill)ctx.fill();else ctx.stroke();
  };
  if(patch.kind === 'wake' || patch.kind === 'rings') {
    for(let i=0;i<2;i++) {
      const q = fraction(t/(5.8+i*.9)+i*.48);
      ctx.globalAlpha *= .85;
      ctx.save(); ctx.globalAlpha *= Math.sin(q*Math.PI);
      if(patch.kind==='rings') ellipse(w*.50,h*.55,w*(.08+q*.39),h*(.08+q*.31));
      else {const cx=w*(.10+q*.80);ctx.beginPath();ctx.moveTo(cx-w*.20,h*.75);ctx.quadraticCurveTo(cx-w*.09,h*.52,cx,h*.42);ctx.quadraticCurveTo(cx-w*.02,h*.64,cx-w*.13,h*.9);ctx.stroke();}
      ctx.restore();
    }
  } else if(patch.kind==='pour' || patch.kind==='flow') {
    const active = patch.kind==='flow'?1:Math.sin(Math.PI*beat);
    ctx.globalAlpha *= active;
    ctx.lineWidth = Math.max(3.5,w*.115);
    ctx.beginPath();ctx.moveTo(w*.23,h*.08);ctx.bezierCurveTo(w*.22,h*.37,w*.68,h*.40,w*.59,h*.80);ctx.stroke();
    ctx.strokeStyle = patch.color==='#39291d'?'#c19f6d':'#fff0b0';ctx.lineWidth *= .30;
    for(let i=0;i<3;i++){const q=fraction(t*1.4+i/3);ellipse(w*(.24+q*.35),h*(.13+q*.63),Math.max(1.3,w*.038),h*.06);}
    ellipse(w*.59,h*.85,w*(.13+.12*lift),h*.07);
  } else if(patch.kind==='pull') {
    ctx.globalAlpha *= .9;
    for(let i=0;i<3;i++) {ctx.beginPath();ctx.moveTo(w*(.22-.12*lift),h*.18+i*3);ctx.bezierCurveTo(w*.28,h*(.35+.6*lift),w*.72,h*(.35+.6*lift),w*(.78+.12*lift),h*.18+i*3);ctx.stroke();}
  } else if(patch.kind==='stir') {
    for(let i=0;i<7;i++){const a=t*1.4+i*.8;ctx.beginPath();ctx.ellipse(w*.5+Math.cos(a)*w*.24,h*.57+Math.sin(a)*h*.24,w*.045,h*.025,a,0,Math.PI*2);ctx.fill();}
    ctx.beginPath();ctx.moveTo(w*.82,h*.07);ctx.lineTo(w*.5+Math.cos(t*1.4)*w*.2,h*.57+Math.sin(t*1.4)*h*.2);ctx.stroke();
  } else if(patch.kind==='lid' || patch.kind==='puff' || patch.kind==='roll' || patch.kind==='flip') {
    const cy=h*(.72-(patch.kind==='flip'?.47:.20)*lift);
    const rx=w*(patch.kind==='roll'?.25+.13*lift:.35);
    const ry=patch.kind==='flip'?h*(.035+.13*Math.abs(Math.cos(beat*Math.PI*2))):h*(.08+.15*lift);
    ctx.save();ctx.globalAlpha *= .22;ellipse(w*.5,h*.87,w*.32,h*.055,true);ctx.restore();
    // A thin contour follows the food's edge; no copied rectangular image patch.
    ellipse(w*.5,cy,rx,ry);
    if(patch.kind==='lid'){ellipse(w*.5,cy-ry,w*.045,h*.06);for(let i=0;i<2;i++){ctx.save();ctx.globalAlpha*=lift*.55;ctx.beginPath();ctx.moveTo(w*(.28+i*.43),cy);ctx.quadraticCurveTo(w*(.2+i*.43),h*.27,w*(.30+i*.43),h*.1);ctx.stroke();ctx.restore();}}
    if(patch.kind==='roll'){ctx.beginPath();ctx.moveTo(w*.12,h*(.36+lift*.28));ctx.lineTo(w*.88,h*(.36+lift*.28));ctx.stroke();}
  } else if(patch.kind==='sway') {
    ctx.beginPath();ctx.moveTo(w*.06,h*.22);ctx.quadraticCurveTo(w*.5,h*(.45+.18*Math.sin(t)),w*.94,h*.22);ctx.stroke();
    for(let i=0;i<4;i++){const px=w*(.23+i*.18);ctx.beginPath();ctx.moveTo(px,h*.36);ctx.quadraticCurveTo(px+w*.04*Math.sin(t+i*.3),h*.67,px+w*.08*Math.sin(t+i*.3),h*.78);ctx.stroke();}
  } else if(patch.kind==='turn' || patch.kind==='glaze') {
    if(patch.kind==='glaze'){ctx.save();ctx.globalAlpha*=.65*Math.sin(beat*Math.PI);ctx.lineWidth=w*.06;ctx.beginPath();ctx.moveTo(w*(.15+.65*beat),h*.14);ctx.lineTo(w*(.25+.65*beat),h*.85);ctx.stroke();ctx.restore();}
    else for(let i=0;i<3;i++){const cy=h*(.35+i*.17);ctx.beginPath();ctx.moveTo(w*.10,cy);ctx.lineTo(w*.90,cy+h*.04*lift);ctx.stroke();for(let j=0;j<4;j++)ellipse(w*(.24+j*.16),cy,w*.05,h*(.035+.055*Math.abs(Math.cos(beat*Math.PI))));}
  } else {
    // Food toss, picked leaves, snow and sparks use at most six discrete silhouettes.
    const count=patch.kind==='snow'?6:patch.kind==='harvest'?3:3;
    for(let i=0;i<count;i++){
      const q=patch.kind==='snow'?fraction(t/(5+i*.3)+i*.173):fraction(t/(patch.period??7.6)+i*.08)/.66;
      if(q>1)continue;
      const px=patch.kind==='snow'?w*(.12+i*.145)+Math.sin(t+i)*3:w*(.17+q*.64);
      const py=patch.kind==='snow'?h*q:patch.kind==='embers'?h*(.88-q*.76):h*(.83-Math.sin(q*Math.PI)*.68);
      ctx.save();ctx.globalAlpha*=Math.min(1,q*9,(1-q)*9);ellipse(px,py,patch.kind==='snow'?2:Math.max(3,w*.04),patch.kind==='harvest'?h*.035:3.5,true);ctx.restore();
    }
  }
}

/** Source layers are allowed only for tightly cropped hanging details that pivot in place. */
export function ambientPainter(patches: AmbientPatch[], folder?: string) {
  const leaves = patches.some(p => p.kind === 'leaves' && !p.leaf) ? [2, 3, 5, 6, 7].map(i => {
    const image = new Image(); image.src = `${import.meta.env.BASE_URL}scenes/hotpot/leaf-${i}.png`; return image;
  }) : [];
  const breeze: AmbientArt['breeze'] = patches.map(() => []);
  if(folder&&patches.some(p=>p.kind==='breeze'))for(const [orientation,name] of ['wide','portrait'].entries()) {
    const image=new Image();image.onload=()=>patches.forEach((patch,index)=>{
      const rect=orientation?patch.phone:patch.wide;
      if(patch.kind==='breeze'&&rect)breeze[index][orientation]=prepareBreezeLayer(image,rect,patch.source);
    });
    image.src=`${import.meta.env.BASE_URL}scenes/${folder}/${name}.jpg`;
  }
  return (ctx: CanvasRenderingContext2D, t: number, portrait: boolean) => drawAmbience(ctx, t, portrait, patches, { leaves, breeze });
}

export function drawAmbience(ctx: CanvasRenderingContext2D, t: number, portrait: boolean, patches: AmbientPatch[],
  art?: AmbientArt) {
  if (!patches.length) return;
  const opacity = ctx.globalAlpha;
  const frame = paintingFrame(portrait, ctx.canvas.width / ctx.getTransform().a);
  for (const [index, patch] of patches.entries()) {
    const r = portrait ? patch.phone : patch.wide;
    if (!r) continue;
    const x = frame.x + r[0] * frame.width, y = frame.y + r[1] * frame.height;
    const w = (r[2] - r[0]) * frame.width, h = (r[3] - r[1]) * frame.height;
    ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
    if (!['leaves','birds','stream-glint','waterfall-glint','dust','rain','mist','light','sunray','breeze'].includes(patch.kind)) {
      drawProcess(ctx, patch, t + index * 1.83, x,y,w,h);
    } else if (patch.kind === 'breeze') {
      const layer=art?.breeze?.[index]?.[portrait?1:0];
      if(layer) {
        // Paint out the original hanging subject, then move its exact pixels from the pictured tie point.
        ctx.drawImage(layer.background,x,y,w,h);
        const amplitude = patch.sway?.[portrait ? 1 : 0] ?? (portrait ? .07 : .052);
        const sway = Math.sin(t * (Math.PI * 2 / (patch.period ?? 7.2)) + index * .8) * amplitude;
        ctx.translate(x+w*.5,y);ctx.rotate(sway);ctx.globalAlpha=opacity;
        ctx.drawImage(layer.foreground,-w*.5,0,w,h);
      }
    } else if (patch.kind === 'sunray') {
      // One broad beam follows the composition's light direction; soft edges keep it part of the painting.
      const angle = patch.angles?.[portrait ? 1 : 0] ?? -.4;
      const length = Math.hypot(w,h) * 1.25, beam = Math.min(w,h) * .26;
      const drift=patch.sway?.[portrait ? 1 : 0] ?? .012;
      ctx.translate(x+w*(.50+Math.sin(t*.28)*drift),y+h*(.48+Math.sin(t*.19)*drift*.55));
      ctx.rotate(angle);ctx.globalCompositeOperation='screen';
      ctx.globalAlpha=opacity*(.68+Math.sin(t*.55)*.08);
      const ray=ctx.createLinearGradient(-beam/2,0,beam/2,0);
      ray.addColorStop(0,'rgba(255,225,158,0)');ray.addColorStop(.22,'rgba(255,225,158,.16)');
      ray.addColorStop(.5,'rgba(255,244,214,.52)');ray.addColorStop(.78,'rgba(255,225,158,.16)');ray.addColorStop(1,'rgba(255,225,158,0)');
      ctx.fillStyle=ray;ctx.fillRect(-beam/2,-length/2,beam,length);
    } else if (patch.kind === 'light') {
      // A slow, warm lamp shimmer, never a whole-image flash.
      const glow = .32 + Math.sin(t * 1.5 + index) * .10 + Math.sin(t * 3.7 + index * 2) * .035;
      ctx.translate(x + w / 2, y + h / 2); ctx.scale(w / 2, h / 2);
      const light = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
      light.addColorStop(0, `rgba(255,225,158,${glow + .15})`);
      light.addColorStop(.28, `rgba(255,191,98,${glow})`);
      light.addColorStop(1, 'rgba(255,176,72,0)');
      ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = light;
      ctx.fillRect(-1, -1, 2, 2);
    } else if (patch.kind === 'stream-glint' || patch.kind === 'waterfall-glint') {
      // Trace only verified liquid already present in this exact composition. There is deliberately
      // no generic centreline or evenly distributed fallback: an untraced rectangle draws nothing.
      const paths=patch.paths?.[portrait?1:0];
      if(paths?.length){
        ctx.globalCompositeOperation='screen';ctx.lineCap='round';ctx.lineJoin='round';ctx.strokeStyle=patch.color??'#e8f8ed';
        ctx.lineWidth=patch.kind==='waterfall-glint'?(portrait?4.2:3.4):Math.max(1,Math.min(2,w*.16));
        const unit=Math.max(3,h*(patch.kind === 'waterfall-glint' ? .20 : .30));ctx.setLineDash([unit,unit*1.7]);
        for(const [pathIndex,path] of paths.entries()){
          if(path.length<2)continue;ctx.globalAlpha=opacity*(.82+.14*Math.sin(t*.8+pathIndex));
          ctx.lineDashOffset=-(t*(patch.kind==='waterfall-glint'?10:7)+pathIndex*unit*.7);
          ctx.beginPath();ctx.moveTo(x+w*path[0][0],y+h*path[0][1]);
          for(const point of path.slice(1))ctx.lineTo(x+w*point[0],y+h*point[1]);ctx.stroke();
        }
      }
    } else if (patch.kind === 'leaves') {
      for (let i = 0; i < 4; i++) {
        // Already in flight on entry. Different speeds and flutter phases prevent a repeated curtain.
        const phase = fraction(t / (7.5 + i * 1.7) + i * .271 + .13);
        const flutter = Math.sin(t * (1.3 + i * .17) + i * 2.3);
        const px = x + w * (.24 + i * .16 + flutter * .12 + (phase - .5) * .12);
        const py = y + h * (.04 + phase * .92);
        const size = (portrait ? 25 : 35) * (.78 + i * .12);
        ctx.save(); ctx.translate(px, py); ctx.rotate(i + t * (i % 2 ? .65 : -.48) + flutter * .55);
        ctx.scale(.28 + .72 * Math.abs(Math.cos(t * .95 + i)), 1);
        ctx.globalAlpha = opacity * .94 * Math.min(1, phase * 9, (1 - phase) * 9);
        const image = art?.leaves[i % art.leaves.length];
        if (!patch.leaf && image?.complete && image.naturalWidth) {
          const leafWidth = size * image.naturalWidth / image.naturalHeight;
          ctx.drawImage(image, -leafWidth / 2, -size / 2, leafWidth, size);
        } else {
          // Narrow, silver-backed olive leaves rather than autumn foliage in the evergreen grove.
          const width = size * (patch.leaf === 'olive' ? .20 : .35);
          const shade = ctx.createLinearGradient(-width, 0, width, 0);
          shade.addColorStop(0, patch.color ?? '#7c873f'); shade.addColorStop(.5, '#d0ce92'); shade.addColorStop(1, '#657b45');
          ctx.fillStyle = shade; ctx.beginPath(); ctx.moveTo(0, -size / 2);
          ctx.quadraticCurveTo(width, 0, 0, size / 2); ctx.quadraticCurveTo(-width, 0, 0, -size / 2); ctx.fill();
          ctx.strokeStyle = '#ddd7ac'; ctx.lineWidth = .7; ctx.beginPath(); ctx.moveTo(0, -size * .37); ctx.lineTo(0, size * .38); ctx.stroke();
        }
        ctx.restore();
      }
    } else if (patch.kind === 'birds') {
      // Small distant silhouettes cross the open sky, with a pause between each pair.
      for (let i = 0; i < 2; i++) {
        // Cross often enough that a normal room visit cannot land entirely in a long empty interval.
        const phase = fraction((t + 2 - i * 1.5) / (patch.period ?? 15)) * 1.65;
        if (phase > 1) continue;
        const span = (portrait ? 8 : 11) * (i ? .7 : 1);
        ctx.save(); ctx.translate(x + w * (.08 + phase * .84), y + h * (.45 + i * .22) + Math.sin(t * 1.4 + i) * 3);
        ctx.globalAlpha = opacity * .72 * Math.min(1, phase * 8, (1 - phase) * 8);
        ctx.strokeStyle = '#4d5147'; ctx.lineWidth = portrait ? 1.4 : 1.8; ctx.lineCap = 'round';
        const wing = -span * (.3 + Math.sin(t * 5 + i) * .6);
        ctx.beginPath(); ctx.moveTo(-span, wing); ctx.quadraticCurveTo(-span * .4, -span * .25, 0, 1);
        ctx.quadraticCurveTo(span * .4, -span * .25, span, wing); ctx.stroke(); ctx.restore();
      }
    } else if (patch.kind === 'rain') {
      // A few readable beads follow the existing rain on the glass. The window frame and room stay still.
      ctx.strokeStyle = '#e8f1ef'; ctx.lineWidth = portrait ? 2.2 : 1.8; ctx.lineCap='round';
      for (let i = 0; i < 6; i++) {
        const phase = fraction(t * (.16 + i % 3 * .018) + i * .173);
        const px = x + w * (.12+.76*fraction(i*.417+.08)), py = y + phase * Math.max(1,h-26);
        const trail=(portrait?22:18)+(i%3)*3;
        ctx.globalAlpha = opacity * (.68+.20*Math.sin(Math.PI*phase)); ctx.beginPath();
        ctx.moveTo(px,py);ctx.lineTo(px-2,Math.min(y+h,py+trail));ctx.stroke();
      }
    } else if (patch.kind === 'mist') {
      for (let i = 0; i < 4; i++) {
        ctx.save();
        // Keep the whole soft bank inside its clip, avoiding a straight fog edge as it drifts.
        ctx.translate(x + w * (.25 + i * .16 + Math.sin(t * .25 + i) * .025), y + h * (.40 + i * .055 + Math.sin(t * .32 + i) * .07));
        ctx.scale(w * .22, h * .29);
        const fog = ctx.createRadialGradient(0, 0, .08, 0, 0, 1);
        fog.addColorStop(0, 'rgba(237,243,232,.30)'); fog.addColorStop(.45, 'rgba(237,243,232,.16)'); fog.addColorStop(1, 'rgba(237,243,232,0)');
        ctx.fillStyle = fog; ctx.beginPath(); ctx.arc(0, 0, 1, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      }
    } else {
      // Flour lives close to the pictured work surface: a readable soft puff, not faint full-room noise.
      ctx.fillStyle = '#f7ead0';
      for (let i = 0; i < 24; i++) {
        const phase = fraction(t * (.13+(i%3)*.008) + i * .618);
        const px = x + w * (.08+.84*fraction(i * .371)) + Math.sin(t*.8 + i) * 6;
        const py = y + h * (.96 - phase*.82);
        ctx.globalAlpha = opacity * .78 * Math.sin(Math.PI * phase); ctx.beginPath(); ctx.arc(px, py, 1.5 + (i % 4) * .48, 0, Math.PI * 2); ctx.fill();
      }
    }
    ctx.restore();
  }
}

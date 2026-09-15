/** Continuous, painting-aligned motion. Coordinates belong to each supplied composition. */
export type PaintingRect = [left: number, top: number, right: number, bottom: number];
export type AmbientPatch = {
  kind: 'leaves' | 'birds' | 'stream-glint' | 'waterfall-glint' | 'dust' | 'rain' | 'mist' | 'light' | 'sunray' | 'breeze' | 'snow' | 'embers';
  wide?: PaintingRect;
  phone?: PaintingRect;
  color?: string;
  leaf?: 'olive' | 'yellow' | 'blossom';
  /** Peak opacity of a mist bank (default .40). Raise it where the painting behind is already hazy. */
  alpha?: number;
  /** Size multiplier for birds (default 1). Use up to 1.6 for birds in a large open sky near the viewer. */
  scale?: number;
  /** Falling leaves per patch (default 4, at most 8) and their size multiplier (default 1). */
  count?: number;
  size?: number;
  angles?: [wide: number, phone: number];
  /** Orientation-specific paths traced inside the patch rectangle, in local 0..1 coordinates. */
  paths?: [wide: Point[][] | undefined, phone: Point[][] | undefined];
  /** Maximum top-pivot rotation for a tightly cropped source layer. */
  sway?: [wide: number, phone: number];
  /** Painted subject isolated by a source-layer breeze. Red hanging details use the same conservative colour key. */
  source?: 'chilli' | 'red-tassel' | 'garlic' | 'bell' | 'grape' | 'leaves';
  /** A restrained ambient accent can be reserved for touch. */
  clickOnly?: boolean;
  period?: number;
};
type Point = [number, number];
// 53 signatures + the existing hotpot boil. Effects may move an isolated painted detail or add a
// natural cue anchored to visible scenery; they never draw replacement food, people or processes.
export const PAINTED_SIGNATURES: Record<string, AmbientPatch> = {
  noodle_shop: {kind:'sunray',wide:[.38,0,.93,.72],phone:[.42,.02,.94,.62],angles:[-.42,.36]},
  teahouse: {kind:'breeze',wide:[.445,.16,.465,.24],phone:[.435,.17,.46,.22],source:'red-tassel',period:7.8,sway:[.045,.045]},
  market: {kind:'breeze',wide:[.952,.025,.998,.31],phone:[.03,.10,.15,.33],source:'chilli',period:7.4,sway:[.045,.060]},
  home_kitchen: {kind:'breeze',wide:[.028,0,.09,.30],phone:[.105,.035,.215,.34],source:'chilli',period:7.0,sway:[.040,.045]},
  tower: {kind:'birds',wide:[.60,.02,.95,.24],phone:[.55,.08,.94,.25],period:12},
  bao_shop: {kind:'dust',wide:[.08,.52,.32,.67],phone:[.08,.55,.45,.68]},
  stone_bridge: {kind:'mist',wide:[.35,.40,.82,.66],phone:[.35,.37,.78,.57],alpha:.50},
  crab_pond: {kind:'leaves',wide:[.45,.02,.88,.55],phone:[.25,.02,.78,.48],color:'#b96d42'},
  jiangnan_home: {kind:'birds',wide:[.40,.02,.72,.20],phone:[.38,.05,.70,.22],period:13},
  lotus_garden: {kind:'sunray',wide:[.06,0,.66,.68],phone:[0,.05,.58,.65],angles:[-.45,.38],sway:[.04,.04]},
  rice_wine: {kind:'sunray',wide:[.35,0,.88,.72],phone:[.28,0,.82,.65],angles:[-.42,.38]},
  river_market: {kind:'sunray',wide:[.40,0,.92,.66],phone:[.35,0,.95,.60],angles:[-.40,.36],sway:[.04,.04]},
  riverside_restaurant: {kind:'birds',wide:[.48,.04,.84,.22],phone:[.42,.09,.77,.27],period:13},
  tea_hill: {kind:'birds',wide:[.48,.02,.82,.18],phone:[.35,.06,.75,.21],period:13},
  kebab_grill: {kind:'light',wide:[.30,.63,.78,.78],phone:[.12,.59,.45,.65],color:'#f3a34b'},
  naan_bakery: {kind:'sunray',wide:[.50,0,.98,.70],phone:[.42,0,.96,.66],angles:[-.42,.36]},
  polo_kitchen: {kind:'light',wide:[.20,.53,.54,.64],phone:[.08,.47,.64,.54],color:'#e6b452'},
  laghman_shop: {kind:'dust',wide:[.25,.59,.51,.65],phone:[.18,.51,.53,.56]},
  oasis_bazaar: {kind:'sunray',wide:[.15,0,.75,.75],phone:[.12,0,.72,.65],angles:[-.36,.34],sway:[.05,.05]},
  grape_courtyard: {kind:'sunray',wide:[.28,0,.72,.58],phone:[.18,0,.62,.55],angles:[-.52,.42],sway:[.018,.025]},
  oasis_field: {kind:'sunray',wide:[.43,0,.96,.62],phone:[.40,0,.98,.52],angles:[-.45,.38],sway:[.04,.04]},
  chaikhana: {kind:'sunray',wide:[.10,0,.80,.70],phone:[.10,0,.85,.65],angles:[-.42,.36]},
  xj_home: {kind:'dust',wide:[.18,.60,.34,.65],phone:[.21,.44,.39,.47]},
  caravan_stop: {kind:'leaves',wide:[.70,.22,.93,.43],phone:[.39,0,.68,.18],leaf:'olive',color:'#6f8f4e'},
  tianshan: {kind:'mist',wide:[.50,.15,.85,.55],phone:[.45,.20,.90,.60],alpha:.55},
  evening_feast: {kind:'light',wide:[.11,.10,.18,.20],phone:[.02,.04,.09,.14],color:'#ffc47a'},
  skewer_courtyard: {kind:'leaves',wide:[.38,0,.88,.34],phone:[.45,0,.98,.30],color:'#b64b35'},
  mantou_kitchen: {kind:'dust',wide:[.10,.42,.36,.66],phone:[.26,.44,.72,.59]},
  dumpling_house: {kind:'dust',wide:[.18,.51,.48,.69],phone:[.20,.49,.55,.65]},
  winter_table: {kind:'snow',wide:[.66,.03,.86,.18],phone:[.62,.14,.88,.29],color:'#fff9e9'},
  courtyard_kitchen: {kind:'snow',wide:[.61,.015,.73,.30],phone:[.60,.02,.84,.20],color:'#fff9e9'},
  hutong: {kind:'leaves',wide:[.45,0,.92,.64],phone:[.44,0,.93,.62],color:'#a76543'},
  bing_stall: {kind:'dust',wide:[.08,.40,.34,.57],phone:[.05,.43,.49,.58]},
  north_market: {kind:'sunray',wide:[.38,0,.88,.72],phone:[.35,0,.88,.68],angles:[-.42,.38],sway:[.04,.04]},
  noodle_workshop: {kind:'leaves',wide:[.64,0,.98,.31],phone:[.42,.06,.82,.27],leaf:'yellow',color:'#cc7f2f'},
  roast_duck: {kind:'light',wide:[.27,.18,.51,.48],phone:[.77,.32,1,.54],color:'#f2a34b'},
  vinegar_workshop: {kind:'sunray',wide:[.55,.08,.92,.72],phone:[.42,.04,.88,.54],angles:[-.42,.38]},
  wheat_harvest: {kind:'sunray',wide:[.25,0,.90,.75],phone:[.10,0,.90,.68],angles:[-.45,.38],sway:[.04,.04]},
  tr_simit: {kind:'birds',wide:[.75,.02,.96,.20],phone:[.59,.045,.95,.18],period:8,scale:1.5},
  tr_tea: {kind:'birds',wide:[.66,.02,.94,.18],phone:[.66,.04,.98,.20],period:8,scale:1.4},
  tr_coffee: {kind:'rain',wide:[.808,.09,.923,.30],phone:[.903,.164,.991,.306]},
  tr_market: {kind:'breeze',wide:[0,0,.075,.275],phone:[0,0,.05,.18],period:6.4,sway:[.075,.095]},
  tr_fish: {kind:'light',wide:[.40,.72,.50,.88],phone:[.70,.58,.82,.72],color:'#f3a34b'},
  tr_kebab: {kind:'breeze',wide:[.292,.0,.335,.235],phone:[.13,.0,.22,.18],period:6.8,sway:[.052,.072]},
  tr_baklava: {kind:'sunray',wide:[.36,.0,.98,.92],phone:[.36,.0,.99,.90],angles:[.55,.42],sway:[.026,.065]},
  tr_pide: {kind:'breeze',wide:[.655,.0,.706,.155],phone:[.065,.0,.19,.17],period:7.4,sway:[.052,.072]},
  tr_yufka: {kind:'dust',wide:[.19,.60,.36,.75],phone:[.24,.58,.46,.74]},
  tr_dolma: {kind:'breeze',wide:[.412,.0,.458,.235],phone:[.43,.0,.57,.14],period:6.4,sway:[.08,.10]},
  tr_breakfast: {kind:'sunray',wide:[.18,.0,.72,.90],phone:[.08,.0,.77,.82],angles:[-.48,.44],sway:[.04,.04]},
  tr_meze: {kind:'breeze',wide:[.618,.0,.665,.15],phone:[.185,.0,.33,.16],period:6.6,sway:[.085,.10]},
  tr_olive: {kind:'leaves',wide:[.37,.04,.59,.52],phone:[.50,.03,.82,.37],leaf:'olive',color:'#82945e',count:8,size:1.6},
  tr_tea_hill: {kind:'mist',wide:[.28,.12,.78,.40],phone:[.20,.16,.78,.40],alpha:.58},   // the valley haze the painting already shows, strong enough to read
  tr_supper: {kind:'breeze',wide:[.0,.0,.043,.235],phone:[.945,.16,1,.305],period:6.9,sway:[.052,.072]},
};

/** Extra source-observed motion for Xinjiang rooms whose signature alone is too quiet. */
export const XINJIANG_AMBIENCE: Record<string, AmbientPatch[]> = {
  kebab_grill: [
    {kind:'breeze',wide:[.324,.065,.35,.145],phone:[.755,.035,.825,.145],period:5.8,sway:[.24,.150],source:'grape'}   // a tight bunch needs a wider swing to read,
  ],
  naan_bakery: [
    {kind:'leaves',wide:[.70,.02,.94,.30],phone:[.63,.035,.92,.20],leaf:'yellow',color:'#c99235'},
  ],
  oasis_field: [
    {kind:'birds',wide:[.58,.025,.95,.18],phone:[.56,.025,.98,.15],period:6,scale:1.8},
    {kind:'breeze',wide:[.275,0,.325,.14],phone:[.185,.03,.265,.14],period:5.9,sway:[.120,.16],source:'grape'},
  ],
  grape_courtyard: [
    // Two isolated bunches per composition, staggered so the trellis breathes without moving as one sheet.
    {kind:'breeze',wide:[.665,.0,.735,.18],phone:[.64,.0,.76,.16],period:5.4,sway:[.130,.150],source:'grape'},
    {kind:'breeze',wide:[.18,.0,.24,.15],phone:[.455,.105,.56,.205],period:6.2,sway:[.150,.210],source:'grape'},
  ],
  chaikhana: [
    {kind:'breeze',wide:[.408,.02,.458,.10],phone:[.445,.075,.505,.185],period:5.7,sway:[.21,.150],source:'grape'},
    {kind:'leaves',wide:[.06,.04,.28,.24],phone:[.55,.14,.87,.30],leaf:'yellow',color:'#c99235'},
  ],
  xj_home: [
    // Keep the small autumn leaves inside the open courtyard, above and away from the family.
    {kind:'leaves',wide:[.41,.015,.57,.30],phone:[.10,.015,.55,.19],leaf:'yellow',color:'#c99235'},
  ],
  evening_feast: [
    {kind:'breeze',wide:[.236,.015,.262,.135],phone:[.27,.018,.335,.104],period:5.6,sway:[.155,.180],source:'grape'},
    {kind:'sunray',wide:[.44,0,.96,.72],phone:[.46,.015,.96,.68],angles:[-.40,.34]},
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

/** A deliberately narrow colour key for a source-observed hanging subject. */
export function isBreezePixel(subject: AmbientPatch['source']='chilli', r: number, g: number, b: number) {
  const chilli=r>55&&r-g>24&&r>g*1.38&&r>b*1.16;
  const max=Math.max(r,g,b),min=Math.min(r,g,b),chroma=max-min;
  const hue=chroma===0?0:max===r?60*((g-b)/chroma%6):max===g?60*((b-r)/chroma+2):60*((r-g)/chroma+4);
  const grape=max>35&&max<215&&chroma/max>.165&&(hue<25||hue>310);
  const garlic=r>145&&g>120&&b>82&&r-g<58&&g-b<58;
  const bell=max<155&&r>g*.9&&g>b*.85;
  const leaves=g>55&&g-r>10&&g>b*1.08;
  return subject==='grape'?grape:subject==='garlic'?garlic:subject==='bell'?bell:subject==='leaves'?leaves:chilli;
}

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
    if(isBreezePixel(subject,r,g,b))mask[i]=1;
  }
  // Carry darker painted edges that touch each colour core, without spreading into the surroundings.
  for(let pass=0;pass<(subject==='grape'?3:subject==='leaves'?2:1);pass++) {
    const next=mask.slice();
    for(let y=1;y<height-1;y++)for(let x=1;x<width-1;x++)if(!mask[y*width+x]) {
      for(let yy=-1;yy<=1&&!next[y*width+x];yy++)for(let xx=-1;xx<=1;xx++)if(mask[(y+yy)*width+x+xx]){next[y*width+x]=1;break;}
    }
    mask.set(next);
  }
  if(subject==='grape'||subject==='bell'||subject==='leaves') {
    // Keep only the main connected subject so similarly coloured scenery remains part of the static painting.
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
    if (patch.kind === 'breeze') {
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
      const leafCount = Math.min(8, Math.max(1, patch.count ?? 4));
      for (let i = 0; i < leafCount; i++) {
        // Already in flight on entry. Different speeds and flutter phases prevent a repeated curtain.
        const phase = fraction(t / (7.5 + i * 1.7) + i * .271 + .13);
        const flutter = Math.sin(t * (1.3 + i * .17) + i * 2.3);
        const px = x + w * (.10 + fraction(i * .618) * .80 + flutter * .10 + (phase - .5) * .10);
        const py = y + h * (.04 + phase * .92);
        const size = (patch.leaf === 'yellow' || patch.leaf === 'blossom' ? (portrait ? 16 : 20) : (portrait ? 25 : 35)) * (.78 + (i % 4) * .12) * (patch.size ?? 1);
        ctx.save(); ctx.translate(px, py); ctx.rotate(i + t * (i % 2 ? .65 : -.48) + flutter * .55);
        ctx.scale(.28 + .72 * Math.abs(Math.cos(t * .95 + i)), 1);
        ctx.globalAlpha = opacity * .94 * Math.min(1, phase * 9, (1 - phase) * 9);
        const image = art?.leaves[i % art.leaves.length];
        if (!patch.leaf && image?.complete && image.naturalWidth) {
          const leafWidth = size * image.naturalWidth / image.naturalHeight;
          ctx.drawImage(image, -leafWidth / 2, -size / 2, leafWidth, size);
        } else {
          // Procedural leaves are reserved for small yellow autumn leaves and narrow evergreen olive leaves.
          const width = size * (patch.leaf === 'olive' ? .20 : patch.leaf === 'blossom' ? .55 : .35);
          const shade = ctx.createLinearGradient(-width, 0, width, 0);
          const edge=patch.leaf==='yellow'?(patch.color??'#d7a632'):patch.leaf==='blossom'?(patch.color??'#f3c9d4'):(patch.color??'#7c873f');
          shade.addColorStop(0, edge); shade.addColorStop(.5, patch.leaf==='yellow'?'#f0c95a':patch.leaf==='blossom'?'#fff4f7':'#d0ce92');
          shade.addColorStop(1, patch.leaf==='yellow'?'#aa7025':patch.leaf==='blossom'?'#e8a9bb':'#657b45');
          ctx.fillStyle = shade; ctx.beginPath(); ctx.moveTo(0, -size / 2);
          ctx.quadraticCurveTo(width, 0, 0, size / 2); ctx.quadraticCurveTo(-width, 0, 0, -size / 2); ctx.fill();
          ctx.strokeStyle = patch.leaf==='yellow'?'#e2ad48':patch.leaf==='blossom'?'#f7dde4':'#ddd7ac'; ctx.lineWidth = .7; ctx.beginPath(); ctx.moveTo(0, -size * .37); ctx.lineTo(0, size * .38); ctx.stroke();
        }
        ctx.restore();
      }
    } else if (patch.kind === 'birds') {
      // Small distant silhouettes cross the open sky, with a pause between each pair.
      for (let i = 0; i < 2; i++) {
        // Cross often enough that a normal room visit cannot land entirely in a long empty interval.
        const phase = fraction((t + 2 - i * 1.5) / (patch.period ?? 15)) * 1.65;
        if (phase > 1) continue;
        const span = (portrait ? 8 : 11) * (i ? .7 : 1) * (patch.scale ?? 1);
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
      const mistAlpha = patch.alpha ?? .40;
      for (let i = 0; i < 4; i++) {
        ctx.save();
        // Keep the whole soft bank inside its clip, avoiding a straight fog edge as it drifts.
        ctx.translate(x + w * (.25 + i * .16 + Math.sin(t * .25 + i) * .025), y + h * (.40 + i * .055 + Math.sin(t * .32 + i) * .07));
        ctx.scale(w * .22, h * .29);
        const fog = ctx.createRadialGradient(0, 0, .08, 0, 0, 1);
        fog.addColorStop(0, `rgba(237,243,232,${mistAlpha.toFixed(2)})`); fog.addColorStop(.45, `rgba(237,243,232,${(mistAlpha*.55).toFixed(2)})`); fog.addColorStop(1, 'rgba(237,243,232,0)');
        ctx.fillStyle = fog; ctx.beginPath(); ctx.arc(0, 0, 1, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      }
    } else if (patch.kind === 'snow') {
      // Snow belongs to the outdoor opening only. The patch rectangle is the architectural boundary.
      ctx.fillStyle = patch.color ?? '#fff9e9';
      ctx.shadowColor = 'rgba(92,116,132,.30)'; ctx.shadowBlur = portrait ? 1.5 : 1.2;
      for (let i = 0; i < 16; i++) {
        const phase = fraction(t / (4.2 + i * .19) + i * .173);
        const px = x + w * (.05 + .90 * fraction(i * .417)) + Math.sin(t * (.55 + i % 3 * .11) + i) * (2 + i % 3);
        const py = y + h * phase;
        const radius=(portrait?1.35:1.05)+(i%5)*.27;
        ctx.globalAlpha = opacity * (.55 + (i % 4) * .10) * Math.min(1, phase * 8, (1 - phase) * 8);
        ctx.beginPath();
        if(i%4===0)ctx.ellipse(px,py,radius*.58,radius*1.55,t*.18+i,0,Math.PI*2);
        else ctx.arc(px,py,radius,0,Math.PI*2);
        ctx.fill();
      }
    } else if (patch.kind === 'embers') {
      // A few sparks rise from a pictured flame; no invented fuel or cookware is added.
      ctx.fillStyle = patch.color ?? '#ffd479';
      for (let i = 0; i < 5; i++) {
        const phase = fraction(t / (2.8 + i * .18) + i * .219);
        const px = x + w * (.26 + .48 * fraction(i * .371)) + Math.sin(t * 1.5 + i) * 3;
        const py = y + h * (.92 - phase * .78);
        ctx.globalAlpha = opacity * .88 * Math.sin(Math.PI * phase);
        ctx.beginPath(); ctx.arc(px, py, 2.1 + (i % 2) * .7, 0, Math.PI * 2); ctx.fill();
      }
    } else if (patch.kind === 'dust') {
      // Flour lives close to the pictured work surface: a readable soft puff, not faint full-room noise.
      ctx.fillStyle = '#f7ead0';
      for (let i = 0; i < 24; i++) {
        const phase = fraction(t * (.13+(i%3)*.008) + i * .618);
        const px = x + w * (.08+.84*fraction(i * .371)) + Math.sin(t*.8 + i) * 6;
        const py = y + h * (.96 - phase*.82);
        ctx.globalAlpha = opacity * .78 * Math.sin(Math.PI * phase); ctx.beginPath(); ctx.arc(px, py, 1.5 + (i % 4) * .48, 0, Math.PI * 2); ctx.fill();
      }
    } else {
      const exhaustiveKind: never = patch.kind;
      throw new Error(`Unsupported ambient patch: ${exhaustiveKind}`);
    }
    ctx.restore();
  }
}

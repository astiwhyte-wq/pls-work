interface GameThumbnailProps {
  title: string;
  category: string;
  id: number;
  className?: string;
}

const PALETTES: Record<string, { bg: string; primary: string; secondary: string; dark: string }> = {
  Action:     { bg: "#060400", primary: "#FF9900", secondary: "#FF5500", dark: "#1a0800" },
  Horror:     { bg: "#020005", primary: "#CC0030", secondary: "#880020", dark: "#0d0010" },
  Sports:     { bg: "#000d05", primary: "#00CC44", secondary: "#009933", dark: "#001a0a" },
  Platformer: { bg: "#000511", primary: "#00AAFF", secondary: "#0077CC", dark: "#00081a" },
  Strategy:   { bg: "#060600", primary: "#DDAA00", secondary: "#AA7700", dark: "#1a1500" },
  Racing:     { bg: "#060200", primary: "#FF5500", secondary: "#FF2200", dark: "#1a0500" },
  Simulation: { bg: "#000808", primary: "#00CCCC", secondary: "#009999", dark: "#001111" },
  Music:      { bg: "#05000d", primary: "#CC00FF", secondary: "#9900CC", dark: "#0d0011" },
  Shooter:    { bg: "#060000", primary: "#FF2200", secondary: "#CC1100", dark: "#110000" },
  Adventure:  { bg: "#000d08", primary: "#00FF88", secondary: "#00CC66", dark: "#001a0d" },
  Word:       { bg: "#060608", primary: "#AAAACC", secondary: "#8888AA", dark: "#111115" },
  Arcade:     { bg: "#080600", primary: "#FFEE00", secondary: "#CCBB00", dark: "#151000" },
  Puzzle:     { bg: "#000808", primary: "#00FFCC", secondary: "#00CCAA", dark: "#001111" },
  Fighting:   { bg: "#060000", primary: "#FF4400", secondary: "#CC2200", dark: "#110000" },
};

const DEFAULT_PALETTE = { bg: "#060400", primary: "#FF9900", secondary: "#FF5500", dark: "#1a0800" };

function hash(str: string, seed = 0): number {
  let h = seed;
  for (let i = 0; i < str.length; i++) h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function r(str: string, seed: number, min: number, max: number) {
  return min + (hash(str, seed) % (max - min));
}

/* ── Scene renderers ─────────────────────────────────────── */

function ActionScene({ p, k }: { p: typeof DEFAULT_PALETTE; k: string }) {
  return (
    <>
      {/* city silhouette */}
      {[0,30,55,90,120,155,185,215].map((x,i) => {
        const h = 20 + r(k,i*7,10,50), w = 18 + r(k,i*13,8,20);
        return <rect key={i} x={x} y={120-h} width={w} height={h} fill={p.dark} opacity="0.9" />;
      })}
      {/* muzzle flash */}
      <polygon points="60,55 90,48 60,42 100,38 60,35" fill={p.secondary} opacity="0.9"/>
      <polygon points="60,55 95,50 62,47" fill={p.primary} opacity="0.8"/>
      {/* gun barrel */}
      <rect x="20" y="52" width="65" height="7" rx="2" fill="#444"/>
      <rect x="75" y="50" width="12" height="11" rx="1" fill="#555"/>
      {/* shell ejection */}
      <rect x="55" y="40" width="5" height="9" rx="1" fill="#cc8800" transform="rotate(-20,57,45)"/>
      {/* crosshair */}
      <circle cx="160" cy="52" r="16" fill="none" stroke={p.primary} strokeWidth="1.5" opacity="0.8"/>
      <line x1="160" y1="30" x2="160" y2="42" stroke={p.primary} strokeWidth="1.5" opacity="0.8"/>
      <line x1="160" y1="62" x2="160" y2="74" stroke={p.primary} strokeWidth="1.5" opacity="0.8"/>
      <line x1="138" y1="52" x2="150" y2="52" stroke={p.primary} strokeWidth="1.5" opacity="0.8"/>
      <line x1="170" y1="52" x2="182" y2="52" stroke={p.primary} strokeWidth="1.5" opacity="0.8"/>
      <circle cx="160" cy="52" r="3" fill={p.secondary} opacity="0.9"/>
    </>
  );
}

function HorrorScene({ p, k }: { p: typeof DEFAULT_PALETTE; k: string }) {
  return (
    <>
      {/* fog layers */}
      <ellipse cx="120" cy="110" rx="120" ry="25" fill={p.dark} opacity="0.8"/>
      <ellipse cx="60" cy="115" rx="70" ry="15" fill={p.dark} opacity="0.6"/>
      {/* trees */}
      {[15,50,170,205].map((x,i) => (
        <g key={i}>
          <rect x={x+5} y="60" width="4" height="50" fill="#1a0d00" opacity="0.8"/>
          <polygon points={`${x},65 ${x+7},25 ${x+14},65`} fill="#0d0800" opacity="0.9"/>
          <polygon points={`${x+1},80 ${x+7},50 ${x+13},80`} fill="#110a00" opacity="0.9"/>
        </g>
      ))}
      {/* glowing eyes */}
      <ellipse cx="108" cy="52" rx="10" ry="7" fill={p.secondary} opacity="0.3"/>
      <ellipse cx="132" cy="52" rx="10" ry="7" fill={p.secondary} opacity="0.3"/>
      <ellipse cx="108" cy="52" rx="6" ry="4" fill={p.primary} opacity="0.8"/>
      <ellipse cx="132" cy="52" rx="6" ry="4" fill={p.primary} opacity="0.8"/>
      <ellipse cx="108" cy="52" rx="3" ry="3" fill="#ff0000" opacity="0.9"/>
      <ellipse cx="132" cy="52" rx="3" ry="3" fill="#ff0000" opacity="0.9"/>
      {/* moon */}
      <circle cx="190" cy="22" r="14" fill="#eeeecc" opacity="0.15"/>
      <circle cx="195" cy="18" r="11" fill={p.bg} opacity="0.9"/>
    </>
  );
}

function RacingScene({ p, k }: { p: typeof DEFAULT_PALETTE; k: string }) {
  return (
    <>
      {/* road */}
      <polygon points="0,120 240,120 200,55 40,55" fill="#1a1a1a"/>
      {/* road lines */}
      {[0,1,2,3,4].map(i => (
        <polygon key={i} points={`${95+i*12},120 ${101+i*12},120 ${98+i*10},68 ${92+i*10},68`} fill="#ffee00" opacity="0.5"/>
      ))}
      {/* speed lines */}
      {[0,1,2,3,4,5].map(i => (
        <line key={i} x1={r(k,i*3,0,30)} y1={r(k,i*7,20,100)} x2={r(k,i*3,40,100)} y2={r(k,i*7,20,100)} stroke={p.primary} strokeWidth="1.5" opacity="0.4"/>
      ))}
      {/* car body */}
      <rect x="80" y="78" width="70" height="26" rx="4" fill={p.secondary}/>
      <rect x="90" y="68" width="50" height="20" rx="4" fill={p.primary}/>
      {/* windows */}
      <rect x="93" y="70" width="20" height="14" rx="2" fill="#001a33" opacity="0.8"/>
      <rect x="116" y="70" width="20" height="14" rx="2" fill="#001a33" opacity="0.8"/>
      {/* wheels */}
      <circle cx="100" cy="104" r="10" fill="#111"/>
      <circle cx="140" cy="104" r="10" fill="#111"/>
      <circle cx="100" cy="104" r="5" fill="#333"/>
      <circle cx="140" cy="104" r="5" fill="#333"/>
      {/* exhaust */}
      <ellipse cx="78" cy="96" rx="10" ry="4" fill={p.primary} opacity="0.3"/>
      <ellipse cx="68" cy="95" rx="8" ry="3" fill={p.primary} opacity="0.2"/>
    </>
  );
}

function PlatformerScene({ p, k }: { p: typeof DEFAULT_PALETTE; k: string }) {
  return (
    <>
      {/* platforms */}
      {[[10,95,80,14],[120,75,70,14],[30,50,60,14],[150,35,55,14]].map(([x,y,w,h],i) => (
        <g key={i}>
          <rect x={x} y={y} width={w} height={h} fill={p.dark} rx="3"/>
          <rect x={x} y={y} width={w} height="4" fill={p.secondary} opacity="0.6" rx="2"/>
        </g>
      ))}
      {/* stars/coins */}
      {[55,90,170,195].map((x,i) => (
        <circle key={i} cx={x} cy={r(k,i*9,20,60)} r="4" fill={p.primary} opacity="0.8"/>
      ))}
      {/* character */}
      <rect x="62" y="75" width="14" height="16" rx="2" fill={p.primary}/>
      <circle cx="69" cy="70" r="8" fill={p.primary}/>
      <rect x="64" y="79" width="5" height="10" rx="1" fill={p.secondary}/>
      <rect x="71" y="79" width="5" height="10" rx="1" fill={p.secondary}/>
      {/* jump shadow */}
      <ellipse cx="69" cy="112" rx="10" ry="3" fill="#000" opacity="0.3"/>
    </>
  );
}

function StrategyScene({ p, k }: { p: typeof DEFAULT_PALETTE; k: string }) {
  return (
    <>
      {/* hex grid */}
      {[[60,30],[100,30],[140,30],[180,30],[80,55],[120,55],[160,55],[60,80],[100,80],[140,80],[180,80]].map(([cx,cy],i) => {
        const r2=18;
        const pts = Array.from({length:6},(_,j)=>{
          const a=Math.PI/180*(60*j-30);
          return `${(cx||0)+r2*Math.cos(a)},${(cy||0)+r2*Math.sin(a)}`;
        }).join(' ');
        const active = i % 3 === 1;
        return <polygon key={i} points={pts} fill={active ? p.dark : "#050500"} stroke={p.primary} strokeWidth="0.8" opacity="0.7"/>;
      })}
      {/* castle piece */}
      <rect x="88" y="42" width="24" height="20" fill={p.secondary} opacity="0.9"/>
      <rect x="86" y="36" width="8" height="10" fill={p.secondary} opacity="0.9"/>
      <rect x="96" y="36" width="8" height="10" fill={p.secondary} opacity="0.9"/>
      <rect x="106" y="36" width="8" height="10" fill={p.secondary} opacity="0.9"/>
      {/* sword piece on other hex */}
      <rect x="159" y="38" width="4" height="22" fill={p.primary} opacity="0.9"/>
      <rect x="153" y="43" width="16" height="4" fill={p.primary} opacity="0.9"/>
    </>
  );
}

function SportsScene({ p, k }: { p: typeof DEFAULT_PALETTE; k: string }) {
  return (
    <>
      {/* field */}
      <rect x="0" y="70" width="240" height="50" fill="#003300" opacity="0.8"/>
      {/* field lines */}
      <ellipse cx="120" cy="95" rx="40" ry="20" fill="none" stroke="#004400" strokeWidth="1.5"/>
      <line x1="120" y1="70" x2="120" y2="120" stroke="#004400" strokeWidth="1.5"/>
      {/* goal */}
      <rect x="10" y="75" width="4" height="35" fill="white" opacity="0.6"/>
      <rect x="10" y="75" width="22" height="4" fill="white" opacity="0.6"/>
      <rect x="28" y="75" width="4" height="35" fill="white" opacity="0.6"/>
      {/* ball */}
      <circle cx="145" cy="58" r="14" fill="white" opacity="0.9"/>
      <path d="M145,44 L148,55 L145,58 L142,55 Z" fill="#111" opacity="0.5"/>
      <path d="M159,58 L148,55 L145,58 L148,61 Z" fill="#111" opacity="0.5"/>
      <path d="M145,72 L148,61 L145,58 L142,61 Z" fill="#111" opacity="0.5"/>
      {/* motion arc */}
      <path d="M60,95 Q90,35 145,58" fill="none" stroke={p.primary} strokeWidth="2" strokeDasharray="5,3" opacity="0.6"/>
    </>
  );
}

function ShooterScene({ p, k }: { p: typeof DEFAULT_PALETTE; k: string }) {
  return (
    <>
      {/* space bg stars */}
      {Array.from({length:15},(_,i)=>(
        <circle key={i} cx={r(k,i*3,5,235)} cy={r(k,i*7,5,115)} r={r(k,i*11,1,3)} fill="white" opacity={0.1+r(k,i,0,4)*0.1}/>
      ))}
      {/* player ship */}
      <polygon points="120,95 105,115 120,108 135,115" fill={p.primary}/>
      <polygon points="120,95 115,110 120,108 125,110" fill="white" opacity="0.4"/>
      {/* engine glow */}
      <ellipse cx="120" cy="115" rx="7" ry="4" fill={p.primary} opacity="0.5"/>
      <ellipse cx="120" cy="116" rx="4" ry="2" fill="white" opacity="0.4"/>
      {/* bullets */}
      <rect x="118" y="55" width="4" height="14" rx="2" fill={p.primary} opacity="0.9"/>
      <rect x="118" y="30" width="4" height="10" rx="2" fill={p.primary} opacity="0.7"/>
      {/* enemy ships */}
      <polygon points="50,40 35,55 50,50 65,55" fill={p.secondary} transform="rotate(180,50,47)"/>
      <polygon points="190,35 175,50 190,45 205,50" fill={p.secondary} transform="rotate(180,190,42)"/>
      <polygon points="120,25 105,38 120,33 135,38" fill={p.secondary} transform="rotate(180,120,32)"/>
      {/* explosion */}
      <circle cx="120" cy="22" r="8" fill={p.primary} opacity="0.6"/>
      {[0,45,90,135,180,225,270,315].map((angle,i)=>(
        <line key={i} x1="120" y1="22"
          x2={120+12*Math.cos(angle*Math.PI/180)}
          y2={22+12*Math.sin(angle*Math.PI/180)}
          stroke={p.secondary} strokeWidth="2" opacity="0.7"/>
      ))}
    </>
  );
}

function ArcadeScene({ p, k }: { p: typeof DEFAULT_PALETTE; k: string }) {
  return (
    <>
      {/* pac-man style maze hint */}
      <rect x="20" y="20" width="200" height="90" rx="0" fill="none" stroke={p.primary} strokeWidth="2" opacity="0.3"/>
      {/* dots */}
      {Array.from({length:8},(_,i)=>(
        <circle key={i} cx={35+i*25} cy="65" r="4" fill={p.primary} opacity={i===2?"0":"0.8"}/>
      ))}
      {/* pac-man */}
      <path d="M60,65 L80,52 A20,20 0 1,1 80,78 Z" fill={p.primary}/>
      {/* ghost */}
      <g transform="translate(130,45)">
        <path d="M0,30 Q0,0 30,0 Q60,0 60,30 L60,45 L50,38 L40,45 L30,38 L20,45 L10,38 L0,45 Z" fill={p.secondary} opacity="0.9"/>
        <circle cx="20" cy="18" r="7" fill="white" opacity="0.9"/>
        <circle cx="40" cy="18" r="7" fill="white" opacity="0.9"/>
        <circle cx="22" cy="19" r="3" fill="#0000aa"/>
        <circle cx="42" cy="19" r="3" fill="#0000aa"/>
      </g>
      {/* score */}
      <text x="25" y="35" fontFamily="monospace" fontSize="10" fill={p.primary} opacity="0.7">SCORE: {r(k,42,1000,9999)}</text>
    </>
  );
}

function AdventureScene({ p, k }: { p: typeof DEFAULT_PALETTE; k: string }) {
  return (
    <>
      {/* sky */}
      <rect x="0" y="0" width="240" height="75" fill={p.dark} opacity="0.5"/>
      {/* mountains */}
      <polygon points="0,75 50,30 100,75" fill="#0a1a0a" opacity="0.8"/>
      <polygon points="60,75 120,20 180,75" fill="#0d200d" opacity="0.8"/>
      <polygon points="140,75 200,35 240,75" fill="#0a1a0a" opacity="0.8"/>
      {/* ground */}
      <rect x="0" y="75" width="240" height="45" fill="#050f05" opacity="0.9"/>
      <rect x="0" y="75" width="240" height="6" fill={p.dark} opacity="0.8"/>
      {/* trees */}
      {[10,35,185,210].map((x,i)=>(
        <g key={i}>
          <rect x={x+4} y="58" width="4" height="18" fill="#1a3300"/>
          <polygon points={`${x},65 ${x+6},40 ${x+12},65`} fill="#1a4400" opacity="0.9"/>
        </g>
      ))}
      {/* character */}
      <rect x="110" y="65" width="12" height="16" rx="2" fill={p.primary}/>
      <circle cx="116" cy="60" r="7" fill={p.primary}/>
      {/* sword */}
      <rect x="123" y="55" width="3" height="20" rx="1" fill="#cccccc" transform="rotate(30,125,65)"/>
      <rect x="119" y="60" width="10" height="3" rx="1" fill="#888"/>
      {/* stars */}
      {[30,80,160,200].map((x,i)=>(
        <circle key={i} cx={x} cy={r(k,i*5,5,30)} r="1.5" fill="white" opacity="0.6"/>
      ))}
    </>
  );
}

function PuzzleScene({ p, k }: { p: typeof DEFAULT_PALETTE; k: string }) {
  const shapes = [[40,25,40,40],[100,25,40,40],[160,25,40,40],[40,75,40,40],[100,75,40,40],[160,75,40,40]];
  const colors = [p.primary, p.secondary, p.dark, p.secondary, p.primary, p.dark];
  return (
    <>
      {shapes.map(([x,y,w,h],i)=>(
        <g key={i}>
          <rect x={x} y={y} width={w} height={h} rx="4" fill={colors[i]} opacity={0.4+i*0.08} stroke={p.primary} strokeWidth="1"/>
          {i===4 && <rect x={x+5} y={y+5} width={w-10} height={h-10} rx="2" fill={p.primary} opacity="0.5"/>}
        </g>
      ))}
      {/* connector lines */}
      <line x1="80" y1="45" x2="100" y2="45" stroke={p.primary} strokeWidth="1.5" opacity="0.5"/>
      <line x1="140" y1="45" x2="160" y2="45" stroke={p.primary} strokeWidth="1.5" opacity="0.5"/>
      <line x1="60" y1="65" x2="60" y2="75" stroke={p.primary} strokeWidth="1.5" opacity="0.5"/>
      <line x1="120" y1="65" x2="120" y2="75" stroke={p.primary} strokeWidth="1.5" opacity="0.5"/>
      <line x1="180" y1="65" x2="180" y2="75" stroke={p.primary} strokeWidth="1.5" opacity="0.5"/>
      {/* highlight piece */}
      <rect x="100" y="75" width="40" height="40" rx="4" fill="none" stroke={p.primary} strokeWidth="2.5" opacity="0.9"/>
    </>
  );
}

function MusicScene({ p, k }: { p: typeof DEFAULT_PALETTE; k: string }) {
  const bars = [30,55,80,65,45,70,90,50,40,60,75,35,85,55,45];
  return (
    <>
      {/* waveform visualiser */}
      {bars.map((h,i)=>(
        <rect key={i} x={5+i*16} y={60-h/2} width="10" height={h} rx="3"
          fill={p.primary} opacity={0.4+i/bars.length*0.5}/>
      ))}
      {/* musical note */}
      <ellipse cx="180" cy="88" rx="10" ry="8" fill={p.secondary} opacity="0.9"/>
      <rect x="188" y="60" width="4" height="30" fill={p.secondary} opacity="0.9"/>
      <rect x="188" y="60" width="20" height="4" fill={p.secondary} opacity="0.7"/>
      <ellipse cx="205" cy="78" rx="7" ry="6" fill={p.secondary} opacity="0.7"/>
      <rect x="210" y="56" width="3" height="24" fill={p.secondary} opacity="0.5"/>
    </>
  );
}

function FightingScene({ p, k }: { p: typeof DEFAULT_PALETTE; k: string }) {
  return (
    <>
      {/* arena floor */}
      <rect x="0" y="95" width="240" height="25" fill={p.dark} opacity="0.8"/>
      <rect x="0" y="95" width="240" height="3" fill={p.primary} opacity="0.3"/>
      {/* fighter 1 */}
      <g transform="translate(50,40)">
        <circle cx="15" cy="10" r="10" fill={p.primary}/>
        <rect x="7" y="20" width="16" height="22" rx="2" fill={p.secondary}/>
        <rect x="0" y="22" width="10" height="18" rx="3" fill={p.secondary} transform="rotate(-30,5,31)"/>
        <rect x="15" y="35" width="7" height="20" rx="2" fill={p.secondary}/>
        <rect x="23" y="35" width="7" height="20" rx="2" fill={p.secondary}/>
      </g>
      {/* fighter 2 */}
      <g transform="translate(155,40)">
        <circle cx="15" cy="10" r="10" fill={p.secondary}/>
        <rect x="7" y="20" width="16" height="22" rx="2" fill={p.primary}/>
        <rect x="20" y="22" width="10" height="18" rx="3" fill={p.primary} transform="rotate(30,25,31)"/>
        <rect x="10" y="35" width="7" height="20" rx="2" fill={p.primary}/>
        <rect x="18" y="35" width="7" height="20" rx="2" fill={p.primary}/>
      </g>
      {/* impact lines */}
      {[0,30,60,90,120,150].map((a,i)=>(
        <line key={i} x1="120" y1="62"
          x2={120+22*Math.cos(a*Math.PI/180)}
          y2={62+22*Math.sin(a*Math.PI/180)}
          stroke={p.primary} strokeWidth="2" opacity="0.7"/>
      ))}
      <circle cx="120" cy="62" r="8" fill={p.secondary} opacity="0.5"/>
      {/* vs text */}
      <text x="108" y="28" fontFamily="monospace" fontSize="16" fontWeight="bold" fill={p.primary} opacity="0.9">VS</text>
    </>
  );
}

function SimulationScene({ p, k }: { p: typeof DEFAULT_PALETTE; k: string }) {
  return (
    <>
      {/* city grid */}
      {[0,40,80,120,160,200].map((x,i)=>(
        <line key={`v${i}`} x1={x} y1="0" x2={x} y2="120" stroke={p.dark} strokeWidth="1" opacity="0.8"/>
      ))}
      {[0,30,60,90,120].map((y,i)=>(
        <line key={`h${i}`} x1="0" y1={y} x2="240" y2={y} stroke={p.dark} strokeWidth="1" opacity="0.8"/>
      ))}
      {/* buildings */}
      {[[0,60,35,60],[40,40,35,80],[80,55,35,65],[120,30,35,90],[160,50,35,70],[200,45,35,75]].map(([x,y,w,h],i)=>(
        <g key={i}>
          <rect x={(x||0)+2} y={y} width={(w||0)-4} height={h} fill={p.dark} opacity="0.9"/>
          {Array.from({length:Math.floor((h||0)/15)},(_,j)=>(
            <rect key={j} x={(x||0)+5} y={(y||0)+j*15+4} width="8" height="8" fill={p.primary} opacity={Math.random()>0.4?"0.6":"0.1"}/>
          ))}
        </g>
      ))}
      {/* roads */}
      <rect x="0" y="0" width="240" height="8" fill={p.secondary} opacity="0.15"/>
    </>
  );
}

function WordScene({ p, k }: { p: typeof DEFAULT_PALETTE; k: string }) {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const grid = Array.from({length:15},(_,i)=>letters[r(k,i*3,0,26)]);
  return (
    <>
      {/* letter grid */}
      {grid.map((l,i)=>{
        const col = i%5, row = Math.floor(i/5);
        const highlight = [2,7,11,13].includes(i);
        return (
          <g key={i}>
            <rect x={30+col*38} y={15+row*32} width="30" height="26" rx="3"
              fill={highlight ? p.primary : p.dark} opacity={highlight?"0.9":"0.6"}
              stroke={p.primary} strokeWidth="0.8" strokeOpacity="0.3"/>
            <text x={45+col*38} y={33+row*32} textAnchor="middle" fontFamily="monospace"
              fontSize="14" fontWeight="bold"
              fill={highlight?"#000":p.primary} opacity={highlight?"1":"0.7"}>{l}</text>
          </g>
        );
      })}
      {/* highlighted word underline */}
      <rect x="30" y="55" width="30" height="3" fill={p.secondary} opacity="0.8"/>
      <rect x="68" y="55" width="30" height="3" fill={p.secondary} opacity="0.8"/>
      <rect x="106" y="55" width="30" height="3" fill={p.secondary} opacity="0.8"/>
    </>
  );
}

function DefaultScene({ p, k }: { p: typeof DEFAULT_PALETTE; k: string }) {
  return (
    <>
      {Array.from({length:6},(_,i)=>(
        <circle key={i} cx={r(k,i*3,20,220)} cy={r(k,i*7,15,105)} r={r(k,i*11,5,20)}
          fill="none" stroke={p.primary} strokeWidth="1" opacity="0.3"/>
      ))}
      <text x="120" y="68" textAnchor="middle" fontFamily="monospace" fontSize="24" fontWeight="bold"
        fill={p.primary} opacity="0.8" style={{filter:`drop-shadow(0 0 8px ${p.primary})`}}>
        GAME
      </text>
    </>
  );
}

const SCENE_MAP: Record<string, React.ComponentType<{p: typeof DEFAULT_PALETTE; k: string}>> = {
  Action: ActionScene,
  Horror: HorrorScene,
  Racing: RacingScene,
  Platformer: PlatformerScene,
  Strategy: StrategyScene,
  Sports: SportsScene,
  Shooter: ShooterScene,
  Arcade: ArcadeScene,
  Adventure: AdventureScene,
  Puzzle: PuzzleScene,
  Music: MusicScene,
  Fighting: FightingScene,
  Simulation: SimulationScene,
  Word: WordScene,
};

export function GameThumbnail({ title, category, id, className = "" }: GameThumbnailProps) {
  const palette = PALETTES[category] ?? DEFAULT_PALETTE;
  const key = title + id;
  const Scene = SCENE_MAP[category] ?? DefaultScene;

  return (
    <svg
      viewBox="0 0 240 120"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full h-full ${className}`}
      aria-label={title}
    >
      <rect width="240" height="120" fill={palette.bg}/>

      {/* subtle scanlines */}
      {Array.from({length:12},(_,i)=>(
        <rect key={i} x="0" y={i*10} width="240" height="1" fill={palette.primary} opacity="0.025"/>
      ))}

      <Scene p={palette} k={key}/>

      {/* vignette overlay */}
      <radialGradient id={`vg-${id}`} cx="50%" cy="50%" r="70%">
        <stop offset="60%" stopColor="transparent"/>
        <stop offset="100%" stopColor={palette.bg} stopOpacity="0.7"/>
      </radialGradient>
      <rect width="240" height="120" fill={`url(#vg-${id})`}/>

      {/* category label */}
      <rect x="0" y="104" width="240" height="16" fill={palette.bg} opacity="0.7"/>
      <text x="8" y="115" fontFamily="monospace" fontSize="7" fill={palette.primary} opacity="0.6" letterSpacing="2">
        {category.toUpperCase()}
      </text>

      {/* border */}
      <rect width="240" height="120" fill="none" stroke={palette.primary} strokeWidth="1" opacity="0.35"/>
    </svg>
  );
}

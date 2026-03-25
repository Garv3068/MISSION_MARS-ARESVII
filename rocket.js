/* ═══════════════════════════════════════════════════════
   ARES VII — SHARED ROCKET MODULE
   Defines parts, saves/loads config, renders rocket SVG.
   Used by section3 (build) and section4+ (display).
═══════════════════════════════════════════════════════ */

const ROCKET = (function(){

  /* ── PART DEFINITIONS ── */
  const PARTS = [
    { id:'nosecone',   name:'NOSE CONE',     desc:'Aerodynamic cap',   slot:'slot-nose',    color:'#E8943A', accentColor:'#F5A623' },
    { id:'fueltank',   name:'FUEL TANK',     desc:'LH2 / LOX tanks',   slot:'slot-fuel',    color:'#4FC3F7', accentColor:'#81D4FA' },
    { id:'payloadbay', name:'PAYLOAD BAY',   desc:'Crew & cargo',      slot:'slot-payload', color:'#F5A623', accentColor:'#FFD54F' },
    { id:'fins',       name:'FIN ARRAY',     desc:'Stabilisation',     slot:'slot-fins',    color:'#E8943A', accentColor:'#FF7043' },
    { id:'enginebell', name:'ENGINE BELL',   desc:'RS-25 nozzle',      slot:'slot-engine',  color:'#B84016', accentColor:'#E8943A' },
    { id:'booster',    name:'SRB BOOSTERS',  desc:'Solid rocket pair', slot:'slot-booster', color:'#7A2208', accentColor:'#B84016' },
  ];

  /* ── ZONE LAYOUT (% of blueprint canvas) ── */
  const ZONES = [
    { id:'slot-nose',    label:'NOSE CONE\nMOUNT',  top:'2%',  left:'20%', width:'60%', height:'18%', partId:'nosecone'   },
    { id:'slot-payload', label:'PAYLOAD\nBAY',       top:'21%', left:'20%', width:'60%', height:'15%', partId:'payloadbay' },
    { id:'slot-fuel',    label:'FUEL\nTANK',         top:'37%', left:'18%', width:'64%', height:'18%', partId:'fueltank'   },
    { id:'slot-fins',    label:'FIN\nARRAY',         top:'56%', left:'6%',  width:'88%', height:'14%', partId:'fins'       },
    { id:'slot-engine',  label:'ENGINE\nBELL',       top:'71%', left:'20%', width:'60%', height:'16%', partId:'enginebell' },
    { id:'slot-booster', label:'SRB\nBOOSTERS',      top:'56%', left:'1%',  width:'98%', height:'28%', partId:'booster'    },
  ];

  /* ── PART SVGs (small icon view) ── */
  const PART_SVGS = {
    nosecone: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 3 L30 22 L10 22 Z" fill="rgba(232,148,58,0.25)" stroke="#E8943A" stroke-width="1.2"/>
      <line x1="20" y1="3" x2="20" y2="22" stroke="rgba(232,148,58,0.4)" stroke-width="0.7" stroke-dasharray="2,2"/>
      <line x1="10" y1="22" x2="30" y2="22" stroke="#E8943A" stroke-width="1.2"/>
    </svg>`,
    fueltank: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="12" y="8" width="16" height="24" rx="3" fill="rgba(79,195,247,0.12)" stroke="#4FC3F7" stroke-width="1.2"/>
      <line x1="12" y1="16" x2="28" y2="16" stroke="rgba(79,195,247,0.3)" stroke-width="0.7" stroke-dasharray="2,2"/>
      <line x1="12" y1="22" x2="28" y2="22" stroke="rgba(79,195,247,0.3)" stroke-width="0.7" stroke-dasharray="2,2"/>
      <circle cx="20" cy="20" r="2.5" fill="rgba(79,195,247,0.4)" stroke="#4FC3F7" stroke-width="0.8"/>
    </svg>`,
    payloadbay: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="20" height="20" rx="1" fill="rgba(245,166,35,0.1)" stroke="#F5A623" stroke-width="1.2"/>
      <rect x="14" y="14" width="5" height="5" fill="rgba(245,166,35,0.25)" stroke="#F5A623" stroke-width="0.8"/>
      <rect x="21" y="14" width="5" height="5" fill="rgba(245,166,35,0.25)" stroke="#F5A623" stroke-width="0.8"/>
      <rect x="14" y="21" width="5" height="5" fill="rgba(245,166,35,0.25)" stroke="#F5A623" stroke-width="0.8"/>
      <rect x="21" y="21" width="5" height="5" fill="rgba(245,166,35,0.25)" stroke="#F5A623" stroke-width="0.8"/>
    </svg>`,
    fins: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="8,32 16,16 16,32" fill="rgba(232,148,58,0.2)" stroke="#E8943A" stroke-width="1.1"/>
      <polygon points="32,32 24,16 24,32" fill="rgba(232,148,58,0.2)" stroke="#E8943A" stroke-width="1.1"/>
      <line x1="16" y1="32" x2="24" y2="32" stroke="#E8943A" stroke-width="1.2"/>
    </svg>`,
    enginebell: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 10 L26 10 L30 32 L10 32 Z" fill="rgba(184,64,22,0.2)" stroke="#B84016" stroke-width="1.2"/>
      <line x1="14" y1="10" x2="26" y2="10" stroke="#E8943A" stroke-width="1.5"/>
      <ellipse cx="20" cy="32" rx="10" ry="2.5" fill="rgba(184,64,22,0.3)" stroke="#B84016" stroke-width="0.8"/>
      <line x1="17" y1="18" x2="23" y2="18" stroke="rgba(184,64,22,0.5)" stroke-width="0.7" stroke-dasharray="2,2"/>
      <line x1="15" y1="25" x2="25" y2="25" stroke="rgba(184,64,22,0.5)" stroke-width="0.7" stroke-dasharray="2,2"/>
    </svg>`,
    booster: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="10" width="10" height="24" rx="2" fill="rgba(122,34,8,0.2)" stroke="#7A2208" stroke-width="1.1"/>
      <rect x="22" y="10" width="10" height="24" rx="2" fill="rgba(122,34,8,0.2)" stroke="#7A2208" stroke-width="1.1"/>
      <line x1="18" y1="22" x2="22" y2="22" stroke="rgba(122,34,8,0.5)" stroke-width="1"/>
      <circle cx="13" cy="34" r="2" fill="rgba(184,64,22,0.4)" stroke="#B84016" stroke-width="0.8"/>
      <circle cx="27" cy="34" r="2" fill="rgba(184,64,22,0.4)" stroke="#B84016" stroke-width="0.8"/>
    </svg>`,
  };

  /* ─────────────────────────────────────────────────
     FULL ROCKET SVG RENDERER
     Returns a full SVG string of the assembled rocket.
     w, h  = viewBox dimensions (default 200×500)
     parts = array of part ids that were assembled
             (if null/undefined, draws all parts)
     opts  = { glow, animate, scale }
  ───────────────────────────────────────────────── */
  function buildRocketSVG(assembledParts, opts = {}) {
    const all = assembledParts || PARTS.map(p => p.id);
    const has = id => all.includes(id);
    const glow = opts.glow !== false;
    const animate = opts.animate !== false;

    const animCss = animate ? `
      @keyframes engineFlicker {
        0%,100%{opacity:0.7} 33%{opacity:1} 66%{opacity:0.5}
      }
      @keyframes thrustPulse {
        0%,100%{transform:scaleY(1) translateY(0)} 50%{transform:scaleY(1.18) translateY(2px)}
      }
      @keyframes rocketFloat {
        0%,100%{transform:translateY(0px)} 50%{transform:translateY(-8px)}
      }
      @keyframes scanSweep {
        0%{transform:translateY(-100%)} 100%{transform:translateY(500%)}
      }
      @keyframes glowPulse {
        0%,100%{opacity:0.4} 50%{opacity:0.9}
      }
      .rocket-body { animation: rocketFloat 4s ease-in-out infinite; transform-origin: 100px 250px; }
      .thrust-flame { animation: thrustPulse 0.4s ease-in-out infinite; transform-origin: 100px 420px; }
      .engine-glow  { animation: glowPulse 0.6s ease-in-out infinite; }
      .scan-line    { animation: scanSweep 3s linear infinite; }
    ` : '';

    const glowDefs = glow ? `
      <filter id="rkt-glow-orange" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="3" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="rkt-glow-blue" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="2.5" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="rkt-glow-engine" x="-80%" y="-80%" width="360%" height="360%">
        <feGaussianBlur stdDeviation="6" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <radialGradient id="thrustGrad" cx="50%" cy="0%" r="60%">
        <stop offset="0%"   stop-color="#FFFFFF" stop-opacity="0.95"/>
        <stop offset="20%"  stop-color="#FFE066" stop-opacity="0.9"/>
        <stop offset="55%"  stop-color="#F5A623" stop-opacity="0.7"/>
        <stop offset="100%" stop-color="#B84016" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="boosterThrustL" cx="50%" cy="0%" r="60%">
        <stop offset="0%"   stop-color="#FFE066" stop-opacity="0.8"/>
        <stop offset="40%"  stop-color="#E8943A" stop-opacity="0.5"/>
        <stop offset="100%" stop-color="#7A2208" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="boosterThrustR" cx="50%" cy="0%" r="60%">
        <stop offset="0%"   stop-color="#FFE066" stop-opacity="0.8"/>
        <stop offset="40%"  stop-color="#E8943A" stop-opacity="0.5"/>
        <stop offset="100%" stop-color="#7A2208" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%"  stop-color="#1a1f2e"/>
        <stop offset="30%" stop-color="#2a3040"/>
        <stop offset="50%" stop-color="#3a4055"/>
        <stop offset="70%" stop-color="#2a3040"/>
        <stop offset="100%" stop-color="#1a1f2e"/>
      </linearGradient>
      <linearGradient id="noseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%"  stop-color="#4a5060"/>
        <stop offset="60%" stop-color="#2a3040"/>
        <stop offset="100%" stop-color="#1a1f2e"/>
      </linearGradient>
    ` : '';

    return `<svg viewBox="0 0 200 520" xmlns="http://www.w3.org/2000/svg" overflow="visible">
  <defs>
    <style>${animCss}</style>
    ${glowDefs}
    <clipPath id="rkt-clip"><rect width="200" height="520"/></clipPath>
  </defs>

  <g class="rocket-body">

    <!-- ══ BOOSTERS (behind body) ══ -->
    ${has('booster') ? `
    <g opacity="0.92">
      <!-- Left booster -->
      <rect x="28" y="260" width="26" height="120" rx="4"
        fill="url(#bodyGrad)" stroke="#7A2208" stroke-width="1.2"/>
      <rect x="28" y="260" width="26" height="8" rx="2" fill="#B84016" opacity="0.6"/>
      <line x1="28" y1="290" x2="54" y2="290" stroke="#7A2208" stroke-width="0.5" stroke-dasharray="3,3" opacity="0.5"/>
      <line x1="28" y1="310" x2="54" y2="310" stroke="#7A2208" stroke-width="0.5" stroke-dasharray="3,3" opacity="0.5"/>
      <text x="41" y="308" text-anchor="middle" font-family="'Share Tech Mono',monospace"
        font-size="5" fill="#7A2208" opacity="0.7" letter-spacing="0.5">SRB-L</text>
      <ellipse cx="41" cy="378" rx="8" ry="2.5" fill="#B84016" opacity="0.5"/>
      <!-- Left booster nozzle -->
      <path d="M36 378 L46 378 L50 395 L32 395 Z" fill="#5a1a08" stroke="#B84016" stroke-width="0.8"/>
      ${has('enginebell') ? `<ellipse class="engine-glow" cx="41" cy="395" rx="9" ry="3" fill="#E8943A" opacity="0.4" filter="url(#rkt-glow-engine)"/>` : ''}
      <!-- Left fin -->
      ${has('fins') ? `<path d="M28 330 L10 380 L28 375 Z" fill="#E8943A" opacity="0.25" stroke="#E8943A" stroke-width="0.8"/>` : ''}

      <!-- Right booster -->
      <rect x="146" y="260" width="26" height="120" rx="4"
        fill="url(#bodyGrad)" stroke="#7A2208" stroke-width="1.2"/>
      <rect x="146" y="260" width="26" height="8" rx="2" fill="#B84016" opacity="0.6"/>
      <line x1="146" y1="290" x2="172" y2="290" stroke="#7A2208" stroke-width="0.5" stroke-dasharray="3,3" opacity="0.5"/>
      <line x1="146" y1="310" x2="172" y2="310" stroke="#7A2208" stroke-width="0.5" stroke-dasharray="3,3" opacity="0.5"/>
      <text x="159" y="308" text-anchor="middle" font-family="'Share Tech Mono',monospace"
        font-size="5" fill="#7A2208" opacity="0.7" letter-spacing="0.5">SRB-R</text>
      <ellipse cx="159" cy="378" rx="8" ry="2.5" fill="#B84016" opacity="0.5"/>
      <!-- Right booster nozzle -->
      <path d="M154 378 L164 378 L168 395 L150 395 Z" fill="#5a1a08" stroke="#B84016" stroke-width="0.8"/>
      ${has('enginebell') ? `<ellipse class="engine-glow" cx="159" cy="395" rx="9" ry="3" fill="#E8943A" opacity="0.4" filter="url(#rkt-glow-engine)"/>` : ''}
      <!-- Right fin -->
      ${has('fins') ? `<path d="M172 330 L190 380 L172 375 Z" fill="#E8943A" opacity="0.25" stroke="#E8943A" stroke-width="0.8"/>` : ''}

      <!-- Booster struts -->
      <line x1="54" y1="280" x2="72" y2="280" stroke="#7A2208" stroke-width="1.2" opacity="0.7"/>
      <line x1="54" y1="340" x2="72" y2="340" stroke="#7A2208" stroke-width="1.2" opacity="0.7"/>
      <line x1="128" y1="280" x2="146" y2="280" stroke="#7A2208" stroke-width="1.2" opacity="0.7"/>
      <line x1="128" y1="340" x2="146" y2="340" stroke="#7A2208" stroke-width="1.2" opacity="0.7"/>
    </g>
    ` : ''}

    <!-- ══ MAIN BODY ══ -->
    <!-- Shadow/depth -->
    <ellipse cx="100" cy="300" rx="34" ry="280" fill="rgba(0,0,0,0.3)" transform="translate(6,0)"/>

    <!-- Body tube -->
    <rect x="68" y="110" width="64" height="280" rx="6"
      fill="url(#bodyGrad)" stroke="rgba(79,195,247,0.15)" stroke-width="0.8"/>

    <!-- Body highlight stripe -->
    <rect x="68" y="110" width="12" height="280" rx="3" fill="rgba(255,255,255,0.04)"/>

    <!-- Body panel lines -->
    <line x1="68" y1="180" x2="132" y2="180" stroke="rgba(79,195,247,0.08)" stroke-width="0.6"/>
    <line x1="68" y1="240" x2="132" y2="240" stroke="rgba(79,195,247,0.08)" stroke-width="0.6"/>
    <line x1="68" y1="310" x2="132" y2="310" stroke="rgba(79,195,247,0.08)" stroke-width="0.6"/>

    <!-- ══ NOSE CONE ══ -->
    ${has('nosecone') ? `
    <g filter="${glow ? 'url(#rkt-glow-orange)' : ''}">
      <path d="M100 20 L136 110 L64 110 Z"
        fill="url(#noseGrad)" stroke="#E8943A" stroke-width="1.2"/>
      <!-- Nose detail lines -->
      <line x1="100" y1="20" x2="100" y2="110"
        stroke="rgba(232,148,58,0.3)" stroke-width="0.6" stroke-dasharray="3,4"/>
      <line x1="84" y1="65" x2="116" y2="65"
        stroke="rgba(232,148,58,0.2)" stroke-width="0.5"/>
      <line x1="78" y1="88" x2="122" y2="88"
        stroke="rgba(232,148,58,0.2)" stroke-width="0.5"/>
      <!-- Nose tip glow -->
      <circle cx="100" cy="22" r="3" fill="#F5A623" opacity="0.6"/>
      <circle cx="100" cy="22" r="6" fill="#E8943A" opacity="0.15"/>
      <!-- Label -->
      <text x="100" y="80" text-anchor="middle" font-family="'Share Tech Mono',monospace"
        font-size="5.5" fill="#E8943A" opacity="0.55" letter-spacing="0.8">NOSE</text>
    </g>
    ` : `
    <!-- Missing nose cone indicator -->
    <path d="M100 20 L136 110 L64 110 Z" fill="none" stroke="rgba(255,68,68,0.3)" stroke-width="1" stroke-dasharray="4,4"/>
    `}

    <!-- ══ PAYLOAD BAY ══ -->
    ${has('payloadbay') ? `
    <g>
      <rect x="68" y="110" width="64" height="68" rx="2"
        fill="rgba(245,166,35,0.08)" stroke="#F5A623" stroke-width="0.8"/>
      <!-- Payload bay windows -->
      <rect x="82" y="122" width="12" height="10" rx="1.5"
        fill="rgba(245,166,35,0.18)" stroke="#F5A623" stroke-width="0.7"/>
      <rect x="106" y="122" width="12" height="10" rx="1.5"
        fill="rgba(245,166,35,0.18)" stroke="#F5A623" stroke-width="0.7"/>
      <!-- Main porthole -->
      <circle cx="100" cy="148" r="9"
        fill="rgba(79,195,247,0.1)" stroke="#4FC3F7" stroke-width="0.8"/>
      <circle cx="100" cy="148" r="5"
        fill="rgba(79,195,247,0.2)" stroke="#4FC3F7" stroke-width="0.5"/>
      <!-- Cross marks -->
      <line x1="91" y1="148" x2="109" y2="148" stroke="#4FC3F7" stroke-width="0.4" opacity="0.5"/>
      <line x1="100" y1="139" x2="100" y2="157" stroke="#4FC3F7" stroke-width="0.4" opacity="0.5"/>
      <text x="100" y="170" text-anchor="middle" font-family="'Share Tech Mono',monospace"
        font-size="4.5" fill="#F5A623" opacity="0.5" letter-spacing="0.8">PAYLOAD</text>
    </g>
    ` : `
    <rect x="68" y="110" width="64" height="68" fill="none" stroke="rgba(255,68,68,0.3)" stroke-width="1" stroke-dasharray="4,4"/>
    `}

    <!-- ══ FUEL TANK ══ -->
    ${has('fueltank') ? `
    <g>
      <rect x="68" y="178" width="64" height="90" rx="2"
        fill="rgba(79,195,247,0.06)" stroke="#4FC3F7" stroke-width="0.8"/>
      <!-- Tank level indicators -->
      <rect x="76" y="192" width="8" height="62" rx="1" fill="rgba(79,195,247,0.05)" stroke="#4FC3F7" stroke-width="0.5"/>
      <rect x="76" y="222" width="8" height="32" rx="1" fill="rgba(79,195,247,0.25)"/>
      <rect x="116" y="192" width="8" height="62" rx="1" fill="rgba(79,195,247,0.05)" stroke="#4FC3F7" stroke-width="0.5"/>
      <rect x="116" y="210" width="8" height="44" rx="1" fill="rgba(79,195,247,0.2)"/>
      <!-- Center label area -->
      <text x="100" y="215" text-anchor="middle" font-family="'Share Tech Mono',monospace"
        font-size="4.5" fill="#4FC3F7" opacity="0.5" letter-spacing="0.8">LH2</text>
      <text x="100" y="228" text-anchor="middle" font-family="'Share Tech Mono',monospace"
        font-size="4.5" fill="#4FC3F7" opacity="0.5" letter-spacing="0.8">LOX</text>
      <!-- Connector lines -->
      <line x1="84" y1="223" x2="116" y2="223" stroke="#4FC3F7" stroke-width="0.4" stroke-dasharray="3,3" opacity="0.4"/>
      <line x1="68" y1="220" x2="132" y2="220" stroke="rgba(79,195,247,0.12)" stroke-width="0.6"/>
      <text x="100" y="255" text-anchor="middle" font-family="'Share Tech Mono',monospace"
        font-size="4.5" fill="#4FC3F7" opacity="0.5" letter-spacing="0.8">TANK</text>
    </g>
    ` : `
    <rect x="68" y="178" width="64" height="90" fill="none" stroke="rgba(255,68,68,0.3)" stroke-width="1" stroke-dasharray="4,4"/>
    `}

    <!-- ══ FINS ══ -->
    ${has('fins') ? `
    <g filter="${glow ? 'url(#rkt-glow-orange)' : ''}">
      <!-- Left fin -->
      <path d="M68 290 L30 370 L68 358 Z"
        fill="rgba(232,148,58,0.18)" stroke="#E8943A" stroke-width="1"/>
      <line x1="68" y1="290" x2="30" y2="370" stroke="#E8943A" stroke-width="0.6" opacity="0.4"/>
      <!-- Right fin -->
      <path d="M132 290 L170 370 L132 358 Z"
        fill="rgba(232,148,58,0.18)" stroke="#E8943A" stroke-width="1"/>
      <line x1="132" y1="290" x2="170" y2="370" stroke="#E8943A" stroke-width="0.6" opacity="0.4"/>
      <!-- Fin labels -->
      <text x="44" y="340" text-anchor="middle" font-family="'Share Tech Mono',monospace"
        font-size="4" fill="#E8943A" opacity="0.4" transform="rotate(-60,44,340)">FIN-L</text>
      <text x="158" y="340" text-anchor="middle" font-family="'Share Tech Mono',monospace"
        font-size="4" fill="#E8943A" opacity="0.4" transform="rotate(60,158,340)">FIN-R</text>
    </g>
    ` : ''}

    <!-- ══ ENGINE BELL ══ -->
    ${has('enginebell') ? `
    <g>
      <path d="M76 380 L124 380 L138 420 L62 420 Z"
        fill="#1a1208" stroke="#B84016" stroke-width="1.2"/>
      <!-- Nozzle detail rings -->
      <line x1="76" y1="380" x2="124" y2="380" stroke="#E8943A" stroke-width="1.5"/>
      <line x1="72" y1="392" x2="128" y2="392" stroke="#B84016" stroke-width="0.6" opacity="0.5"/>
      <line x1="68" y1="406" x2="132" y2="406" stroke="#B84016" stroke-width="0.6" opacity="0.4"/>
      <ellipse cx="100" cy="420" rx="38" ry="4" fill="#0d0805" stroke="#B84016" stroke-width="0.8"/>
      <!-- Engine glow -->
      <ellipse class="engine-glow" cx="100" cy="420" rx="28" ry="6"
        fill="#E8943A" opacity="0.35" filter="${glow ? 'url(#rkt-glow-engine)' : ''}"/>
    </g>
    ` : `
    <path d="M76 380 L124 380 L138 420 L62 420 Z" fill="none" stroke="rgba(255,68,68,0.3)" stroke-width="1" stroke-dasharray="4,4"/>
    `}

    <!-- ══ THRUST FLAME ══ -->
    ${(has('enginebell')) ? `
    <g class="thrust-flame">
      <ellipse cx="100" cy="438" rx="18" ry="22" fill="url(#thrustGrad)" opacity="0.9"/>
      <ellipse cx="100" cy="430" rx="8" ry="10" fill="white" opacity="0.5"/>
      <ellipse cx="100" cy="450" rx="24" ry="12" fill="url(#thrustGrad)" opacity="0.4"/>
    </g>
    ` : ''}

    <!-- ══ BOOSTER THRUST ══ -->
    ${(has('booster') && has('enginebell')) ? `
    <g class="thrust-flame">
      <ellipse cx="41" cy="410" rx="10" ry="14" fill="url(#boosterThrustL)" opacity="0.8"/>
      <ellipse cx="41" cy="405" rx="4" ry="6" fill="#FFE066" opacity="0.5"/>
      <ellipse cx="159" cy="410" rx="10" ry="14" fill="url(#boosterThrustR)" opacity="0.8"/>
      <ellipse cx="159" cy="405" rx="4" ry="6" fill="#FFE066" opacity="0.5"/>
    </g>
    ` : ''}

    <!-- ══ ARES VII LABEL ══ -->
    <text x="100" y="295" text-anchor="middle" font-family="'Share Tech Mono',monospace"
      font-size="7" fill="#EDE8E0" opacity="0.22" letter-spacing="2">ARES VII</text>

    <!-- ══ SCAN LINE (animated) ══ -->
    ${animate ? `
    <g clip-path="url(#rkt-clip)">
      <rect class="scan-line" x="60" y="0" width="80" height="2"
        fill="rgba(79,195,247,0.12)" rx="1"/>
    </g>
    ` : ''}

  </g>
</svg>`;
  }

  /* ── STORAGE KEY ── */
  const STORAGE_KEY = 'aresVII_rocketConfig';

  /* ── SAVE rocket config ── */
  function save(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch(e) { console.warn('ROCKET.save failed', e); }
  }

  /* ── LOAD rocket config ── */
  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch(e) { return null; }
  }

  /* ── BUILD a default "complete" config (skipped or fallback) ── */
  function defaultConfig() {
    return {
      parts: PARTS.map(p => p.id),
      timeUsed: 90,
      locked: 6,
      skipped: true,
      timestamp: Date.now(),
    };
  }

  return { PARTS, ZONES, PART_SVGS, buildRocketSVG, save, load, defaultConfig };
})();
(() => {
  const W = window.WEDDING;
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const ease = t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  const rad = d => d * Math.PI / 180;

  /* ---------- Fill text from config ---------- */
  const derived = {
    coupleShort: `${W.groom} & ${W.bride}`,
    coupleCaps: `${W.groom} & ${W.bride}`.toUpperCase(),
    groomCaps: W.groom.toUpperCase(),
    brideCaps: W.bride.toUpperCase(),
    initials: `${W.groom[0]}&${W.bride[0]}`,
    venueName: W.venue.name,
    venueAddress: W.venue.address,
    venueNote: W.venue.note,
    kidsCouplet: W.kids?.couplet,
    kidsNames: W.kids?.names,
    hostFamily: W.hosts?.family,
    hostInviter: W.hosts?.inviter
  };
  $$("[data-cfg]").forEach(el => {
    const v = derived[el.dataset.cfg] ?? W[el.dataset.cfg];
    if (v) el.textContent = v;
  });
  document.title = `${W.groom} & ${W.bride} — Wedding Invitation`;
  if (!W.kids) $(".kids").remove();

  // Invitation text is revealed word by word while scrolling
  const invite = $(".invite-text");
  invite.innerHTML = invite.textContent.split(" ").map(w => `<span class="w">${w}</span>`).join(" ");
  const words = $$(".invite-text .w");

  /* ---------- Artwork ---------- */
  function feather(x, y, angle, len) {
    const ex = x + Math.cos(rad(angle)) * len, ey = y + Math.sin(rad(angle)) * len;
    const mx = (x + ex) / 2, my = (y + ey) / 2;
    return `<line x1="${x}" y1="${y}" x2="${ex}" y2="${ey}" stroke="#2f7d4f" stroke-width="2"/>
      <ellipse cx="${mx}" cy="${my}" rx="${len / 2}" ry="${len / 9}" transform="rotate(${angle} ${mx} ${my})" fill="url(#fth)" opacity=".9"/>
      <circle cx="${ex}" cy="${ey}" r="${len / 8}" fill="#d9a832"/><circle cx="${ex}" cy="${ey}" r="${len / 11}" fill="#1aa39a"/><circle cx="${ex}" cy="${ey}" r="${len / 20}" fill="#0c2a7a"/>`;
  }
  function peacock(x, y, from, to, len, count, facing) {
    let tail = "";
    for (let i = 0; i < count; i++) tail += feather(x, y, from + (to - from) * i / (count - 1), len * (0.85 + 0.15 * Math.sin(i)));
    const hx = x + facing * 10, hy = y - 42;
    return `<g>${tail}
      <ellipse cx="${x}" cy="${y - 6}" rx="13" ry="24" fill="url(#body)" transform="rotate(${facing * 12} ${x} ${y})"/>
      <path d="M${x} ${y - 24} Q${x + facing * 2} ${y - 40} ${hx} ${hy}" stroke="#1d4fb8" stroke-width="8" fill="none" stroke-linecap="round"/>
      <circle cx="${hx}" cy="${hy}" r="7" fill="#1d4fb8"/><circle cx="${hx + facing * 2}" cy="${hy - 1}" r="1.6" fill="#fff"/>
      <path d="M${hx + facing * 6} ${hy} l${facing * 7} 2 l${-facing * 7} 2z" fill="#e2b66e"/>
      ${[-6, 0, 6].map(d => `<line x1="${hx}" y1="${hy - 6}" x2="${hx + d}" y2="${hy - 16}" stroke="#1d4fb8" stroke-width="1.2"/><circle cx="${hx + d}" cy="${hy - 17}" r="2" fill="#1aa39a"/>`).join("")}
    </g>`;
  }
  $("#peacockSvg").innerHTML = `
    <defs>
      <linearGradient id="fth" x1="0" x2="1"><stop offset="0" stop-color="#1f6b3f"/><stop offset="1" stop-color="#4fb06a"/></linearGradient>
      <radialGradient id="body" cx=".4" cy=".35"><stop offset="0" stop-color="#3a8dde"/><stop offset="1" stop-color="#0b2a8a"/></radialGradient>
    </defs>
    ${peacock(300, 150, -174, -6, 125, 19, 1)}${peacock(110, 150, 95, 165, 105, 10, 1)}${peacock(490, 150, 85, 15, 105, 10, -1)}`;

  function mandala(colors, rings = 7) {
    let s = "";
    for (let r = rings; r >= 1; r--) {
      const n = 8 + r * 4, radius = r * 13, c = colors[r % colors.length];
      for (let i = 0; i < n; i++) s += `<ellipse cx="0" cy="${-radius}" rx="${4 + r * 1.3}" ry="${7 + r * 1.6}" fill="${c}" stroke="${colors[(r + 2) % colors.length]}" stroke-width=".8" transform="rotate(${360 * i / n})"/>`;
      s += `<circle r="${radius - 6}" fill="none" stroke="${colors[(r + 1) % colors.length]}" stroke-width="1" stroke-dasharray="2 3"/>`;
    }
    return `<svg viewBox="-114 -114 228 228">${s}<circle r="9" fill="${colors[0]}" stroke="${colors[3]}" stroke-width="2"/></svg>`;
  }
  const blues = ["#0b1f6e", "#1f4fb8", "#3a8dde", "#5cc8f0", "#122d8f", "#2a6fd6"];
  $$(".mandala-bg").forEach(el => (el.innerHTML = mandala(blues)));
  $$(".medallion").forEach(el => (el.innerHTML = mandala(["#2b2b3a", "#4a4a60", "#6d6d88", "#9a9ab5"], 5)));

  // Sunset palace
  function dome(cx, y, r, fill = "url(#stone2)") {
    return `<path d="M${cx - r} ${y} C${cx - r} ${y - r * 1.25} ${cx - r * .15} ${y - r * 1.2} ${cx} ${y - r * 1.55} C${cx + r * .15} ${y - r * 1.2} ${cx + r} ${y - r * 1.25} ${cx + r} ${y}Z" fill="${fill}"/>
      <line x1="${cx}" y1="${y - r * 1.55}" x2="${cx}" y2="${y - r * 1.9}" stroke="#a8602e" stroke-width="2"/><circle cx="${cx}" cy="${y - r * 1.9}" r="2.5" fill="#d4a640"/>`;
  }
  function chhatri(cx, y, w, fill) {
    return `<rect x="${cx - w / 2}" y="${y - w * .6}" width="${w}" height="${w * .6}" fill="${fill || "url(#stone)"}"/>
      ${[0, 1, 2].map(i => `<path d="M${cx - w / 2 + 3 + i * (w - 6) / 3} ${y} v${-w * .35} a${(w - 6) / 6} ${(w - 6) / 6} 0 0 1 ${(w - 6) / 3 - 2} 0 v${w * .35}z" fill="#7a3a1e"/>`).join("")}
      <rect x="${cx - w / 2 - 3}" y="${y - w * .65}" width="${w + 6}" height="5" fill="#c97b45"/>${dome(cx, y - w * .65, w / 2)}`;
  }
  function windows(x, y, w, h, cols, rows, gap, dark = "#7a3a1e", trim = "#f4c690") {
    let s = "";
    const ww = (w - gap * (cols + 1)) / cols, wh = (h - gap * (rows + 1)) / rows;
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const wx = x + gap + c * (ww + gap), wy = y + gap + r * (wh + gap);
      const lit = (r * 7 + c * 3) % 5 === 0;
      s += `<path d="M${wx} ${wy + wh} V${wy + ww / 2} A${ww / 2} ${ww / 2} 0 0 1 ${wx + ww} ${wy + ww / 2} V${wy + wh}Z" fill="${lit ? "#ffd27a" : dark}" stroke="${trim}" stroke-width="1.5"/>`;
    }
    return s;
  }
  const stoneDefs = `<defs>
      <linearGradient id="stone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f2b57a"/><stop offset="1" stop-color="#b8693a"/></linearGradient>
      <linearGradient id="stone2" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e09a5c"/><stop offset=".5" stop-color="#f8cf9a"/><stop offset="1" stop-color="#c47a42"/></linearGradient>
      <linearGradient id="pink" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f0ad86"/><stop offset="1" stop-color="#c8694a"/></linearGradient>
    </defs>`;
  $("#palaceSvg").innerHTML = `${stoneDefs}
    <rect x="0" y="330" width="1200" height="90" fill="url(#stone)"/>${windows(0, 330, 1200, 90, 30, 1, 10)}
    <rect x="100" y="220" width="310" height="115" fill="url(#stone)"/>${windows(100, 220, 310, 115, 7, 2, 8)}
    <rect x="790" y="220" width="310" height="115" fill="url(#stone)"/>${windows(790, 220, 310, 115, 7, 2, 8)}
    ${chhatri(130, 220, 44)}${chhatri(255, 220, 54)}${chhatri(380, 220, 44)}${chhatri(820, 220, 44)}${chhatri(945, 220, 54)}${chhatri(1070, 220, 44)}
    <rect x="410" y="150" width="380" height="185" fill="url(#stone)"/>${windows(410, 150, 380, 120, 8, 2, 9)}
    <path d="M555 335 V280 A45 45 0 0 1 645 280 V335Z" fill="#5a2a14" stroke="#f4c690" stroke-width="3"/>
    <rect x="400" y="142" width="400" height="10" fill="#c97b45"/>${dome(600, 142, 90)}${chhatri(450, 142, 50)}${chhatri(750, 142, 50)}
    <rect x="20" y="170" width="70" height="165" fill="url(#stone)"/>${windows(20, 170, 70, 165, 2, 4, 6)}${dome(55, 170, 35)}
    <rect x="1110" y="170" width="70" height="165" fill="url(#stone)"/>${windows(1110, 170, 70, 165, 2, 4, 6)}${dome(1145, 170, 35)}`;

  // Haveli facade that rises up to fill the screen
  function jharokha(x, y, w, h) {
    return `<path d="M${x - 8} ${y + 22} Q${x + w / 2} ${y - 18} ${x + w + 8} ${y + 22}Z" fill="#b65c3c"/>
      <rect x="${x - 10}" y="${y + 20}" width="${w + 20}" height="6" fill="#f6dcc0"/>
      <rect x="${x}" y="${y + 26}" width="${w}" height="${h - 40}" fill="#e39a72" stroke="#f6dcc0" stroke-width="2"/>
      ${windows(x, y + 26, w, h - 40, 3, 1, 6, "#5a2a14", "#f6dcc0")}
      <rect x="${x - 6}" y="${y + h - 14}" width="${w + 12}" height="8" fill="#f6dcc0"/>
      ${[0, 1, 2, 3].map(i => `<path d="M${x + 4 + i * (w - 8) / 3} ${y + h - 6} q-4 10 0 16" stroke="#b65c3c" stroke-width="4" fill="none"/>`).join("")}`;
  }
  let fac = `${stoneDefs}<rect width="1200" height="900" fill="url(#pink)"/>`;
  [[30, 150], [215, 175], [410, 175]].forEach(([y, h]) => {
    fac += `<rect x="0" y="${y + h + 4}" width="1200" height="10" fill="#f6dcc0"/>`;
    for (let x = 20; x < 1200; x += 165) fac += jharokha(x, y, 120, h);
  });
  fac += `<rect x="0" y="600" width="1200" height="300" fill="#d98763"/>
    ${windows(0, 610, 1200, 70, 20, 1, 10, "#5a2a14", "#f6dcc0")}
    <path d="M440 900 V770 C440 700 520 680 600 630 C680 680 760 700 760 770 V900Z" fill="#f6dcc0"/>
    <path d="M462 900 V775 C462 712 532 696 600 652 C668 696 738 712 738 775 V900Z" fill="#fbf3e6"/>
    ${[90, 270, 870, 1050].map(x => `<path d="M${x} 900 V790 a40 40 0 0 1 80 0 V900Z" fill="#5a2a14" stroke="#f6dcc0" stroke-width="4"/>`).join("")}
    <rect x="0" y="880" width="1200" height="20" fill="#a8502f"/>`;
  $("#facadeSvg").innerHTML = fac;

  // Desert: three layers that rise at different speeds
  function camel(x, y, s, c) {
    return `<g transform="translate(${x} ${y}) scale(${s})" fill="${c}">
      <path d="M-30 -30 Q-26 -52 -12 -44 Q-4 -62 10 -46 Q22 -44 26 -32 L30 -50 Q32 -64 42 -62 L48 -58 L40 -56 L36 -30 Q34 -20 24 -20 L-24 -20 Q-32 -22 -30 -30Z"/>
      <rect x="-24" y="-22" width="4" height="22"/><rect x="-14" y="-22" width="4" height="22"/><rect x="14" y="-22" width="4" height="22"/><rect x="22" y="-22" width="4" height="22"/></g>`;
  }
  function hut(x, y, w) {
    let art = "";
    for (let i = 0; i < 6; i++) art += `<path d="M${x + 4 + i * (w - 8) / 6} ${y - w * .5} l${(w - 8) / 12} -8 l${(w - 8) / 12} 8z" fill="${i % 2 ? "#c0392b" : "#2e7d5b"}"/>`;
    return `<rect x="${x}" y="${y - w * .7}" width="${w}" height="${w * .7}" rx="6" fill="#fbecd0" stroke="#b04a2a" stroke-width="2"/>${art}
      <path d="M${x - 10} ${y - w * .64} Q${x + w / 2} ${y - w * 1.5} ${x + w + 10} ${y - w * .64}Z" fill="#d9a24e" stroke="#8a5a1c" stroke-width="2"/>
      ${[1, 2, 3, 4, 5].map(i => `<path d="M${x - 6 + i * (w + 12) / 6} ${y - w * .66} Q${x + w / 2} ${y - w * 1.2} ${x + w / 2} ${y - w * 1.38}" stroke="#a87a30" stroke-width="1.5" fill="none"/>`).join("")}
      <path d="M${x + w * .38} ${y} v${-w * .32} a${w * .12} ${w * .12} 0 0 1 ${w * .24} 0 v${w * .32}z" fill="#7a3a1e"/>
      <rect x="${x + w * .1}" y="${y - w * .4}" width="${w * .14}" height="${w * .14}" fill="#7a3a1e" stroke="#f6c12b" stroke-width="2"/>`;
  }
  function tree(x, y, s) {
    let leaves = "";
    for (let i = 0; i < 34; i++) {
      const a = rad(-170 + i * 4.8), r = 30 + (i % 4) * 14, lx = x + Math.cos(a) * r * s, ly = y - 100 * s + Math.sin(a) * r * s;
      leaves += `<ellipse cx="${lx}" cy="${ly}" rx="${8 * s}" ry="${4 * s}" fill="${i % 4 ? "#5b8a3a" : "#e2672a"}" transform="rotate(${i * 23} ${lx} ${ly})"/>`;
    }
    return `<path d="M${x - 6} ${y} Q${x} ${y - 70 * s} ${x} ${y - 100 * s} M${x} ${y - 75 * s} q${22 * s} ${-12 * s} ${36 * s} ${-34 * s} M${x} ${y - 62 * s} q${-24 * s} ${-8 * s} ${-38 * s} ${-28 * s}" stroke="#6b3e1e" stroke-width="${6 * s}" fill="none"/>${leaves}`;
  }
  function sittingCamel(x, y, s) {
    return `<g transform="translate(${x} ${y}) scale(${s})">
      <ellipse cx="0" cy="-30" rx="70" ry="34" fill="#9a5a2a"/>
      <path d="M-30 -58 Q0 -96 30 -58Z" fill="#9a5a2a"/>
      <path d="M-50 -40 h100 v30 q-50 14 -100 0z" fill="#b0182e"/>
      ${[0, 1, 2, 3, 4, 5, 6].map(i => `<circle cx="${-44 + i * 14.5}" cy="-26" r="4" fill="#f6c12b"/><path d="M${-46 + i * 14.5} -12 l3 10 l3 -10" fill="#f6c12b"/>`).join("")}
      <path d="M58 -40 Q96 -60 92 -110 Q90 -130 104 -132 L122 -126 Q126 -118 116 -114 L106 -112 Q110 -60 74 -22Z" fill="#9a5a2a"/>
      <circle cx="110" cy="-124" r="2" fill="#2b1308"/>
      <path d="M104 -112 q-6 20 -20 26" stroke="#f6c12b" stroke-width="2" fill="none"/><circle cx="84" cy="-84" r="5" fill="#b0182e"/>
      <path d="M-66 -4 h132" stroke="#6b3e1e" stroke-width="10" stroke-linecap="round"/></g>`;
  }
  const [far, mid, near] = $$("#desert .d-layer");
  far.innerHTML = `<defs><linearGradient id="dsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fbf3e6" stop-opacity="0"/><stop offset=".6" stop-color="#f8e2b8"/></linearGradient></defs>
    <rect width="1200" height="360" fill="url(#dsky)"/><circle cx="880" cy="170" r="44" fill="#ffd27a" opacity=".6"/>
    <path d="M0 260 Q200 210 420 245 T820 236 T1200 246 V360 H0Z" fill="#ecc27a" opacity=".75"/>`;
  mid.innerHTML = `<path d="M0 292 Q300 260 600 288 T1200 282 V360 H0Z" fill="#e2ab5c"/>
    <g class="caravan">${camel(560, 290, .5, "#7a3a1e")}${camel(615, 291, .5, "#7a3a1e")}${camel(670, 292, .5, "#7a3a1e")}
      <path d="M705 292 v-16 m0 4 l-5 10 m5 -10 l5 10 m-5 -14 a4 4 0 1 0 0 -1" stroke="#7a3a1e" stroke-width="3" fill="#7a3a1e"/></g>
    <g stroke="#7a3a1e" stroke-width="2" fill="none"><path d="M620 290 V230 M610 290 L620 236 L630 290"/>${[0, 60, 120, 180, 240, 300].map(a => `<line x1="620" y1="230" x2="${620 + Math.cos(rad(a)) * 16}" y2="${230 + Math.sin(rad(a)) * 16}"/>`).join("")}</g>`;
  near.innerHTML = `<path d="M0 320 Q300 300 600 318 T1200 314 V360 H0Z" fill="#d9a24e"/>
    ${hut(70, 334, 66)}${tree(20, 340, 1)}${hut(1060, 334, 76)}${tree(1170, 340, 1)}${tree(250, 340, 1.2)}${hut(300, 330, 100)}${hut(425, 334, 72)}${sittingCamel(770, 336, .9)}${tree(965, 340, 1.1)}
    ${[200, 520, 640, 900, 1110].map(x => `<path d="M${x} 340 l4 -14 l4 14 m-10 -4 l-6 -8 m14 8 l6 -8" stroke="#6b8a3a" stroke-width="2" fill="none"/>`).join("")}`;

  // Hanging lamp for the festivities timeline
  $("#lampSvg").innerHTML = `<defs><linearGradient id="lg" x1="0" x2="1"><stop offset="0" stop-color="#b8862e"/><stop offset=".5" stop-color="#ffe9a0"/><stop offset="1" stop-color="#b8862e"/></linearGradient></defs>
    <path d="M20 0 v8" stroke="#9c7425" stroke-width="2"/><path d="M8 16 Q20 4 32 16Z" fill="url(#lg)"/>
    <rect x="7" y="16" width="26" height="4" fill="#9c7425"/>
    <path d="M8 20 h24 l-3 34 h-18z" fill="url(#lg)"/>
    <path d="M14 24 h12 l-2 26 h-8z" fill="#fff4c4"/><path d="M20 30 q-4 6 0 12 q4 -6 0 -12" fill="#f08a24"/>
    <path d="M10 54 h20 l-4 6 h-12z" fill="#9c7425"/><path d="M20 60 v8" stroke="#b0182e" stroke-width="3"/><circle cx="20" cy="72" r="4" fill="#b0182e"/>`;

  // Illustrated portraits shown until real photos are added
  function portrait(kind) {
    const skin = "#e7b189", hair = "#2b1a12";
    const bgs = { groom: ["#f9e1b0", "#f0b672"], bride: ["#fbd3c4", "#e98d7a"], man: ["#d9ecf5", "#9cc6dd"], woman: ["#f7d9e6", "#e9a0bf"], elder: ["#f5ecd0", "#d9c08a"] };
    const [b1, b2] = bgs[kind] || bgs.man;
    const face = `<rect x="52" y="92" width="16" height="18" fill="${skin}"/><ellipse cx="60" cy="76" rx="19" ry="23" fill="${skin}"/>`;
    const parts = {
      groom: `<path d="M8 160 Q14 112 60 106 Q106 112 112 160Z" fill="#f3e3c0"/><path d="M60 108 V160" stroke="#d4a640" stroke-width="2" stroke-dasharray="2 6"/>
        <path d="M30 116 Q60 150 90 116" stroke="#b0182e" stroke-width="4" fill="none" stroke-dasharray="1 5" stroke-linecap="round"/>${face}
        <path d="M37 66 Q36 38 60 36 Q86 38 84 66 Q60 56 37 66Z" fill="#e4572e"/><path d="M38 60 Q60 48 84 60" stroke="#f6c12b" stroke-width="3" fill="none"/>
        <path d="M80 50 q14 -8 18 6 q-8 -4 -16 2z" fill="#e4572e"/><circle cx="60" cy="48" r="5" fill="#f6c12b" stroke="#b0182e" stroke-width="2"/><path d="M60 43 q-2 -12 6 -16" stroke="#fff" stroke-width="3" fill="none"/>
        <path d="M51 86 q9 5 18 0" stroke="${hair}" stroke-width="3" fill="none" stroke-linecap="round"/>`,
      bride: `<path d="M22 160 Q16 56 60 40 Q104 56 98 160Z" fill="#b0122a"/><path d="M22 160 Q16 56 60 40 Q104 56 98 160" stroke="#f6c12b" stroke-width="3" fill="none"/>
        <path d="M14 160 Q18 116 60 108 Q102 116 106 160Z" fill="#c8102e"/><path d="M40 116 Q60 132 80 116" stroke="#f6c12b" stroke-width="5" fill="none"/>
        <ellipse cx="60" cy="72" rx="22" ry="26" fill="${hair}"/>${face}<path d="M60 52 v8" stroke="#f6c12b" stroke-width="2"/><circle cx="60" cy="61" r="3" fill="#f6c12b"/>
        <circle cx="60" cy="70" r="1.8" fill="#b0122a"/><circle cx="41" cy="84" r="3" fill="#f6c12b"/><circle cx="79" cy="84" r="3" fill="#f6c12b"/>`,
      man: `<path d="M8 160 Q14 112 60 106 Q106 112 112 160Z" fill="#2f5d8a"/><path d="M48 108 L60 130 L72 108" fill="#f3e3c0"/>${face}
        <path d="M40 70 Q38 48 60 48 Q84 48 80 70 Q74 56 60 58 Q46 56 40 70Z" fill="${hair}"/><path d="M51 86 q9 5 18 0" stroke="${hair}" stroke-width="3" fill="none" stroke-linecap="round"/>`,
      woman: `<path d="M8 160 Q14 112 60 106 Q106 112 112 160Z" fill="#c2185b"/><path d="M80 106 Q60 140 30 160 H60 Q90 130 100 112Z" fill="#f6c12b" opacity=".9"/>
        <ellipse cx="60" cy="74" rx="22" ry="25" fill="${hair}"/>${face}<path d="M42 66 Q50 52 60 53 Q70 52 78 66 Q70 58 60 58 Q50 58 42 66Z" fill="${hair}"/>
        <path d="M60 53 v6" stroke="#c8102e" stroke-width="2"/><circle cx="60" cy="70" r="2" fill="#c8102e"/>`,
      elder: `<path d="M8 160 Q14 112 60 106 Q106 112 112 160Z" fill="#f4efe2"/><path d="M14 160 Q30 118 46 110 L40 160Z" fill="#c97b45"/>${face}
        <path d="M38 64 Q38 40 60 40 Q84 40 82 64 Q60 54 38 64Z" fill="#f6f1e4" stroke="#d9c08a"/><path d="M40 58 Q60 48 80 58" stroke="#e2b66e" stroke-width="2" fill="none"/>
        <path d="M48 86 q12 8 24 0" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/>`
    };
    return `<svg viewBox="0 0 120 160" preserveAspectRatio="xMidYMax slice"><defs><linearGradient id="pg-${kind}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${b1}"/><stop offset="1" stop-color="${b2}"/></linearGradient></defs>
      <rect width="120" height="160" fill="url(#pg-${kind})"/>${parts[kind] || parts.man}</svg>`;
  }
  function loadPhoto(el, src, art) {
    el.innerHTML = portrait(art);
    if (!src) return;
    const img = new Image();
    img.onload = () => { el.style.backgroundImage = `url("${src}")`; el.classList.add("has-img"); };
    img.src = src;
  }
  $$(".photo[data-photo]").forEach(el => loadPhoto(el, W[el.dataset.photo], el.dataset.art));

  /* ---------- Family ---------- */
  function renderFamily(list, target) {
    $(target).innerHTML = list.map(m => `
      <figure class="member px">
        <div class="jharokha j-pink tall" data-open>
          <div class="j-top"><span class="lotus"></span><span class="lotus"></span></div>
          <div class="j-window"><div class="j-content photo" data-src="${m.photo || ""}" data-a="${m.art || "man"}"></div><div class="shutter l"></div><div class="shutter r"></div></div>
        </div>
        <span class="label">${m.relation}</span>
        <span class="mname">${m.name}</span>
      </figure>`).join("");
  }
  renderFamily(W.family.groom, "#familyGroom");
  renderFamily(W.family.bride, "#familyBride");
  $$(".member .photo").forEach(el => loadPhoto(el, el.dataset.src, el.dataset.a));

  /* ---------- Events ---------- */
  const icons = { tilakotsav: "🪔", tilak: "🪔", haldi: "🌼", mehndi: "🌿", sangeet: "🎶", "matru poojan": "🙏", "shubh vivah": "🔥", wedding: "🔥", "vadhu aagman": "🏡", reception: "✨" };
  const days = new Set(W.events.map(e => e.date)).size;
  $("#eventsKicker").textContent = `${days} day${days > 1 ? "s" : ""} of celebration`;
  $("#timeline").insertAdjacentHTML("beforeend", W.events.map((e, i) => `
    <div class="event-row${i % 2 ? " alt" : ""}">
      <div class="scroll">
        <span class="tassel l"></span><span class="tassel r"></span>
        <div class="rod"></div>
        <div class="scroll-body">
          <div class="parchment">
            <div class="emoji">${icons[e.name.toLowerCase()] || "❖"}</div>
            ${e.hindi ? `<p class="hi">${e.hindi}</p>` : ""}
            <h3>${e.name.toUpperCase()}</h3>
            ${e.note ? `<p class="note">${e.note}</p>` : ""}
            <ul><li>${e.day ? e.day + ", " : ""}${e.date}</li>${e.time ? `<li>${e.time}</li>` : ""}<li>${e.venue}</li></ul>
            ${e.map ? `<a target="_blank" rel="noopener" href="${e.map.startsWith("http") ? e.map : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(e.map)}`}">View Map</a>` : ""}
          </div>
          <div class="rod"></div>
        </div>
      </div>
      <p class="edate">${e.date.replace(/ \d{4}$/, "")}<small>${e.day || ""}</small></p>
    </div>`).join(""));
  const rows = $$(".event-row").map(r => ({ row: r, scroll: r.querySelector(".scroll"), body: r.querySelector(".scroll-body"), date: r.querySelector(".edate"), alt: r.classList.contains("alt") }));

  /* ---------- Venue + contacts ---------- */
  const v = W.venue, q = v.lat ? `${v.lat},${v.lng}` : encodeURIComponent(`${v.name} ${v.address}`);
  $("#directions").href = v.mapLink || `https://www.google.com/maps/dir/?api=1&destination=${q}`;
  const vp = $("#venuePhoto");
  if (v.photo) { vp.src = v.photo; vp.alt = `Entrance of ${v.name}`; } else vp.parentElement.remove();
  $("#contacts").innerHTML = (W.hosts?.contacts || []).map(c => `<a href="tel:+91${c.phone}">☎ ${c.name} · ${c.phone}</a>`).join("");

  /* ---------- Countdown ---------- */
  const target = new Date(W.weddingDate).getTime();
  const pad = n => String(n).padStart(2, "0");
  function tick() {
    const t = Math.max(0, target - Date.now());
    $("#cd-d").textContent = pad(Math.floor(t / 864e5));
    $("#cd-h").textContent = pad(Math.floor(t / 36e5) % 24);
    $("#cd-m").textContent = pad(Math.floor(t / 6e4) % 60);
    $("#cd-s").textContent = pad(Math.floor(t / 1e3) % 60);
  }
  tick(); setInterval(tick, 1000);

  /* ---------- Petals ---------- */
  const petals = $("#petals");
  function petalBurst(n, x, y, cls) {
    if (reduceMotion) return;
    for (let i = 0; i < n; i++) {
      const p = document.createElement("div");
      p.className = "petal " + (cls || (Math.random() < .35 ? "marigold" : ""));
      p.style.left = x === undefined ? Math.random() * 100 + "vw" : x + Math.random() * 20 - 10 + "px";
      if (y !== undefined) p.style.top = y + "px";
      p.style.setProperty("--drift", (Math.random() * 240 - 120) + "px");
      p.style.setProperty("--spin", (Math.random() * 900 - 450) + "deg");
      p.style.animationDuration = (cls === "dust" ? 1.5 + Math.random() : 6 + Math.random() * 6) + "s";
      p.style.animationDelay = (cls ? 0 : Math.random() * 1.5) + "s";
      petals.appendChild(p);
      p.addEventListener("animationend", () => p.remove());
    }
  }

  /* ---------- Shutters open when they come into view ---------- */
  const io = new IntersectionObserver(entries => entries.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add("opened"); io.unobserve(en.target); }
  }), { threshold: 0.5 });
  $$("[data-open]").forEach(el => io.observe(el));

  /* ---------- Scratch card ---------- */
  const scratchBox = $(".scratch"), cv = $("#scratchCanvas"), ctx = cv.getContext("2d");
  let scratched = false;
  function paintScratch() {
    const r = cv.getBoundingClientRect(), dpr = window.devicePixelRatio || 1;
    if (!r.width) return;
    cv.width = r.width * dpr; cv.height = r.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const g = ctx.createLinearGradient(0, 0, r.width, r.height);
    g.addColorStop(0, "#e88a2a"); g.addColorStop(1, "#a8361a");
    ctx.fillStyle = g; ctx.fillRect(0, 0, r.width, r.height);
    ctx.fillStyle = "rgba(255,255,255,.12)";
    for (let x = 10; x < r.width; x += 22) for (let y = 10; y < r.height; y += 22) { ctx.beginPath(); ctx.arc(x, y, 2, 0, 7); ctx.fill(); }
    ctx.fillStyle = "#fff3cf"; ctx.textAlign = "center"; ctx.font = "600 15px Cinzel, serif";
    ctx.fillText("✦  SCRATCH HERE  ✦", r.width / 2, r.height / 2 + 5);
  }
  function finishScratch() {
    if (scratched) return;
    scratched = true; cv.classList.add("done"); scratchBox.classList.add("done");
    const r = cv.getBoundingClientRect();
    for (let i = 0; i < 4; i++) petalBurst(8, r.left + Math.random() * r.width);
  }
  function scratchAt(e) {
    const r = cv.getBoundingClientRect();
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath(); ctx.arc(e.clientX - r.left, e.clientY - r.top, 24, 0, 7); ctx.fill();
    ctx.globalCompositeOperation = "source-over";
    if (Math.random() < .35) petalBurst(2, e.clientX, e.clientY, "dust");
  }
  function clearedRatio() {
    const d = ctx.getImageData(0, 0, cv.width, cv.height).data;
    let clear = 0, total = 0;
    for (let i = 3; i < d.length; i += 160) { total++; if (d[i] === 0) clear++; }
    return clear / total;
  }
  let drawing = false, moves = 0;
  cv.addEventListener("pointerdown", e => { drawing = true; cv.setPointerCapture(e.pointerId); scratchAt(e); });
  cv.addEventListener("pointermove", e => {
    if (!drawing || scratched) return;
    scratchAt(e);
    if (++moves % 12 === 0 && clearedRatio() > 0.45) finishScratch();
  });
  ["pointerup", "pointercancel"].forEach(t => cv.addEventListener(t, () => (drawing = false)));
  $("#revealBtn").addEventListener("click", finishScratch);
  document.fonts.ready.then(paintScratch);
  addEventListener("resize", () => { if (!scratched) paintScratch(); });

  /* ---------- Scroll-driven parallax ---------- */
  const hero = $("#hero"), stage = $(".stage"), heroText = $(".hero-text"), sky = $(".sky"),
    palace = $("#palaceSvg"), facade = $("#facadeSvg"), cue = $(".scroll-cue"),
    mandL = $(".mandala-bg.left"), mandR = $(".mandala-bg.right"), medallions = $$(".medallion svg"),
    timeline = $("#timeline"), lamp = $("#lamp"), lampString = $("#lampString"),
    desert = $("#desert"), dLayers = [far, mid, near], pxEls = $$(".px");

  function pxApply(el, vh) {
    const r = el.getBoundingClientRect();
    if (r.bottom < -100 || r.top > vh + 100) { el.style.opacity = 0; return; }
    const flat = el.hasAttribute("data-flat"), tilt = +(el.dataset.tilt || 0);
    const enter = clamp((r.top - vh * 0.7) / (vh * 0.3));
    const exit = clamp((vh * 0.28 - r.bottom) / (vh * 0.28));
    if (enter > 0) {
      el.style.transform = `perspective(1000px) translateY(${enter * 80}px) rotateX(${enter * (flat ? 14 : 32)}deg) rotateY(${enter * tilt * 22}deg) scale(${1 - enter * 0.06})`;
      el.style.opacity = 1 - enter;
    } else if (exit > 0) {
      el.style.transform = `perspective(1000px) translateY(${-exit * 40}px) rotateX(${-exit * (flat ? 10 : 22)}deg) scale(${1 - exit * 0.06})`;
      el.style.opacity = 1 - exit;
    } else {
      el.style.transform = "none";
      el.style.opacity = 1;
    }
  }

  function update() {
    const vh = innerHeight, mobile = innerWidth < 720;
    // Hero: names drift up, palace zooms, haveli rises to fill the screen
    const hr = hero.getBoundingClientRect();
    const p = clamp(-hr.top / (hr.height - vh));
    heroText.style.transform = `translateY(${-p * 45}vh)`;
    heroText.style.opacity = clamp(1 - p * 1.6);
    sky.style.transform = `translateY(${-p * 6}vh) scale(${1 + p * 0.15})`;
    palace.style.transform = `translateY(${-p * 16}vh) scale(${1 + p * 2.2})`;
    const f = ease(clamp((p - 0.28) / 0.62));
    facade.style.transform = `translateY(${(1 - f) * 100}%) scale(${1.3 - 0.3 * f})`;
    cue.classList.toggle("gone", p > 0.04);

    // Mandalas turn with the scroll
    const m = clamp((p - 0.8) / 0.2), sy = scrollY;
    mandL.style.opacity = mandR.style.opacity = m * (mobile ? 0.4 : 0.95);
    mandL.style.transform = `rotate(${sy * 0.05}deg) scale(${0.85 + m * 0.15})`;
    mandR.style.transform = `rotate(${-sy * 0.07}deg) scale(${0.85 + m * 0.15})`;
    medallions.forEach(s => (s.style.transform = `rotate(${sy * 0.2}deg)`));

    pxEls.forEach(el => pxApply(el, vh));

    // Invitation words light up one after another
    const ir = invite.getBoundingClientRect();
    const wq = clamp((vh * 0.9 - ir.top) / (vh * 0.5)) * (words.length + 4);
    words.forEach((w, i) => (w.style.opacity = 0.12 + 0.88 * clamp((wq - i) / 4)));

    // Festivities: the lamp descends and each scroll unrolls
    const tr = timeline.getBoundingClientRect();
    const lp = clamp((vh * 0.4 - tr.top) / tr.height);
    const ly = lp * Math.max(0, tr.height - 90);
    lamp.style.transform = `translateY(${ly}px)`;
    lampString.style.height = ly + 6 + "px";
    rows.forEach(({ scroll, body, date, alt }) => {
      const sr = scroll.getBoundingClientRect();
      const u = ease(clamp((vh * 0.92 - sr.top) / (vh * 0.42)));
      const side = mobile ? 1 : alt ? 1 : -1;
      body.style.transform = `scaleY(${0.04 + 0.96 * u})`;
      scroll.style.transform = `translateX(${(1 - u) * side * 50}px) rotate(${(1 - u) * side * 7}deg)`;
      scroll.style.opacity = 0.3 + 0.7 * clamp(u * 2);
      date.style.opacity = u;
      date.style.transform = `translateX(${(1 - u) * -side * 40}px)`;
    });

    // Desert layers rise at different speeds
    const dr = desert.getBoundingClientRect();
    const dq = clamp((vh - dr.top) / dr.height);
    dLayers.forEach((l, i) => (l.style.transform = `translateY(${(1 - dq) * dr.height * [0.12, 0.32, 0.6][i]}px)`));
  }
  // Guide guests who don't realise they should scroll
  const nextBtn = $("#nextBtn");
  let idle, userScrolled = false, autoScrolling = false;
  function armIdle() {
    nextBtn.classList.remove("show");
    clearTimeout(idle);
    idle = setTimeout(() => {
      const atEnd = innerHeight + scrollY >= document.documentElement.scrollHeight - 40;
      const heroCueVisible = !cue.classList.contains("gone");
      if (!document.body.classList.contains("locked") && !atEnd && !heroCueVisible) nextBtn.classList.add("show");
    }, 3500);
  }
  nextBtn.addEventListener("click", () => scrollBy({ top: innerHeight * 0.8, behavior: "smooth" }));
  addEventListener("scroll", () => { if (!autoScrolling) userScrolled = true; armIdle(); }, { passive: true });
  addEventListener("pointerdown", armIdle);
  function demoNudge() {
    if (userScrolled) return;
    autoScrolling = true;
    scrollTo({ top: innerHeight * 0.25, behavior: "smooth" });
    setTimeout(() => (autoScrolling = false), 1500);
  }

  let ticking = false;
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(() => { update(); ticking = false; }); } };
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", onScroll);
  update();

  /* ---------- Music ---------- */
  const audio = $("#bgm"), musicBtn = $("#music");
  if (W.music) { audio.src = W.music; musicBtn.hidden = false; }
  musicBtn.addEventListener("click", () => {
    if (audio.paused) audio.play().then(() => musicBtn.classList.add("playing")).catch(() => {});
    else { audio.pause(); musicBtn.classList.remove("playing"); }
  });

  /* ---------- Open the gates ---------- */
  const gate = $("#gate");
  function openGate() {
    if (gate.classList.contains("open")) return;
    gate.classList.add("open");
    if (W.music) audio.play().then(() => musicBtn.classList.add("playing")).catch(() => {});
    setTimeout(() => {
      scrollTo(0, 0);
      document.body.classList.remove("locked");
      stage.classList.add("play");
      paintScratch();
    }, 2400);
    setTimeout(() => stage.classList.add("sky-on"), 5400);
    setTimeout(demoNudge, 10500);
    setTimeout(armIdle, 9000);
    setTimeout(() => {
      gate.remove();
      petalBurst(26);
      setInterval(() => petalBurst(2), 3000);
    }, 3700);
  }
  gate.addEventListener("click", openGate);
  gate.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openGate(); } });
})();

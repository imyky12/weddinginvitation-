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
    hostInviter: W.hosts?.inviter,
    coupleHindi: `${W.groomHindi} संग ${W.brideHindi}`
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

  /* ---------- Artwork (Awadh / Uttar Pradesh) ---------- */
  const svgUrl = s => `url("data:image/svg+xml,${encodeURIComponent(s)}")`;

  // Chikankari-style white floral embroidery, used as a soft background texture
  const chikan = (bg, thread) => `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
    <rect width="64" height="64" fill="${bg}"/>
    <g fill="none" stroke="${thread}" stroke-width="1.1" stroke-linecap="round">
      ${[0, 72, 144, 216, 288].map(a => `<ellipse cx="16" cy="10" rx="3" ry="5.5" transform="rotate(${a} 16 16)"/>`).join("")}
      <circle cx="16" cy="16" r="1.6" fill="${thread}"/>
      <path d="M22 22 q10 4 14 14 M36 36 q6 -8 14 -6 M36 36 q-2 8 4 14"/>
      ${[0, 90, 180, 270].map(a => `<ellipse cx="48" cy="44" rx="2" ry="4" transform="rotate(${a} 48 48)"/>`).join("")}
    </g>
    <g fill="${thread}">${[[52, 12], [8, 44], [30, 56], [58, 30]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.2"/>`).join("")}</g></svg>`;
  $("#gate").style.backgroundImage = `radial-gradient(ellipse at center, rgba(80, 20, 20, 0) 35%, rgba(80, 20, 20, .55) 100%), ${svgUrl(chikan("#f3e1d8", "#ffffff"))}`;
  $("#gate").style.backgroundSize = "100% 100%, 64px 64px";
  document.body.style.backgroundImage = svgUrl(chikan("#fbf5ea", "#f0e2c8"));

  function fish(x, y, s, flip) {
    return `<g transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s})">
      <path d="M-46 0 C-30 -22 14 -24 34 -4 L52 -18 L46 0 L52 18 L34 4 C14 24 -30 22 -46 0Z" fill="url(#fishG)" stroke="#8a6420" stroke-width="1.5"/>
      <path d="M-10 -14 q8 -14 22 -12 q-8 6 -10 14z M-6 14 q8 12 20 10 q-8 -6 -10 -12z" fill="#2e8b6e"/>
      ${[-20, -8, 4, 16].map(px => `<path d="M${px} -9 q5 9 0 18" stroke="#8a6420" stroke-width="1" fill="none"/>`).join("")}
      <circle cx="-32" cy="-3" r="3.2" fill="#fff"/><circle cx="-32" cy="-3" r="1.6" fill="#3a1c14"/></g>`;
  }
  function marigoldRope(pts, r = 6) {
    return pts.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${i % 3 === 2 ? "#ffcd3c" : "#f08a24"}" stroke="#c4561f" stroke-width=".8"/>`).join("");
  }
  function swag(x1, x2, y, dip, n) {
    const pts = [];
    for (let i = 0; i <= n; i++) { const t = i / n; pts.push([x1 + (x2 - x1) * t, y + 4 * dip * t * (1 - t)]); }
    return marigoldRope(pts);
  }
  function strand(x, y, len) {
    const pts = [];
    for (let k = 0; k < len; k += 11) pts.push([x, y + k]);
    return marigoldRope(pts, 5) + `<path d="M${x - 6} ${y + len} l6 14 l6 -14z" fill="#c8102e"/>`;
  }
  function leaf(x, y, a, s = 1, c = "#3f7d2c") {
    return `<path d="M0 0 C6 6 6 22 0 32 C-6 22 -6 6 0 0Z" transform="translate(${x} ${y}) rotate(${a}) scale(${s})" fill="${c}" stroke="#2a5a1d" stroke-width=".8"/>`;
  }
  function bandanwar(x1, x2, y) {
    let s = `<path d="M${x1} ${y} Q${(x1 + x2) / 2} ${y + 8} ${x2} ${y}" stroke="#8a6420" stroke-width="2" fill="none"/>`;
    const n = 13;
    for (let i = 0; i <= n; i++) {
      const x = x1 + (x2 - x1) * i / n, yy = y + 8 * 4 * (i / n) * (1 - i / n) / 2;
      s += i % 2 ? leaf(x, yy, 0, .9) : `<circle cx="${x}" cy="${yy + 6}" r="6" fill="#f08a24" stroke="#c4561f"/>`;
    }
    return s;
  }
  function swastik(x, y, s, c = "#c8102e") {
    return `<g transform="translate(${x} ${y}) scale(${s})" stroke="${c}" stroke-width="2.4" fill="none" stroke-linecap="round">
      <path d="M0 -8 V8 M-8 0 H8 M0 -8 H6 M8 0 V6 M0 8 H-6 M-8 0 V-6"/>${[[-4, -4], [4, -4], [-4, 4], [4, 4]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="1" fill="${c}"/>`).join("")}</g>`;
  }
  function kalash(cx, by, s) {
    return `<g transform="translate(${cx} ${by}) scale(${s})">
      ${[-60, -35, -12, 12, 35, 60].map(a => leaf(0, -62, 180 + a, 1.1)).join("")}
      <ellipse cx="0" cy="-70" rx="13" ry="16" fill="#8a5a2b"/><path d="M-12 -60 q12 8 24 0 v6 q-12 6 -24 0z" fill="#c8102e"/>
      <path d="M-14 -56 h28 l-3 8 h-22z" fill="url(#brass)"/>
      <path d="M-11 -48 C-40 -40 -40 -4 -18 0 H18 C40 -4 40 -40 11 -48Z" fill="url(#brass)" stroke="#8a6420"/>
      <path d="M-30 -30 q30 10 60 0" stroke="#c8102e" stroke-width="3" fill="none"/>${swastik(0, -18, .9)}
      <rect x="-20" y="-2" width="40" height="5" rx="2" fill="#8a6420"/></g>`;
  }
  function diya(x, y, s = 1) {
    return `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="-10" rx="6" ry="14" fill="#ffd27a" opacity=".35"/>
      <path d="M0 -14 q-5 7 0 12 q5 -5 0 -12z" fill="#ff9f1c"/><path d="M-12 -3 q12 12 24 0 q-2 -3 -12 -3 q-10 0 -12 3z" fill="#b5541f"/></g>`;
  }
  function multifoil(x, yb, w, h, foils = 7) {
    const r = w / 2, cx = x + r, sy = yb - h + r;
    let d = `M${x} ${yb} V${sy}`, px = x, py = sy;
    for (let i = 1; i <= foils; i++) {
      const a = Math.PI + Math.PI * i / foils, nx = cx + r * Math.cos(a), ny = sy + r * Math.sin(a);
      const ch = Math.hypot(nx - px, ny - py);
      d += ` A${ch * .62} ${ch * .62} 0 0 1 ${nx.toFixed(1)} ${ny.toFixed(1)}`;
      px = nx; py = ny;
    }
    return d + ` V${yb}Z`;
  }
  const defs = `<defs>
    <linearGradient id="fishG" x1="0" x2="1"><stop offset="0" stop-color="#f8dc8a"/><stop offset=".6" stop-color="#d4a640"/><stop offset="1" stop-color="#9c7425"/></linearGradient>
    <linearGradient id="brass" x1="0" x2="1"><stop offset="0" stop-color="#9c6a1e"/><stop offset=".45" stop-color="#f3d27a"/><stop offset="1" stop-color="#9c6a1e"/></linearGradient>
    <linearGradient id="ivory" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fbf4e4"/><stop offset="1" stop-color="#e9d8b8"/></linearGradient>
    <linearGradient id="ivory2" x1="0" x2="1"><stop offset="0" stop-color="#dcc79f"/><stop offset=".5" stop-color="#fbf1dc"/><stop offset="1" stop-color="#cdb68c"/></linearGradient>
    <linearGradient id="ghat" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e9b98a"/><stop offset="1" stop-color="#b77650"/></linearGradient>
    <linearGradient id="water" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f2a96b"/><stop offset=".45" stop-color="#b9707a"/><stop offset="1" stop-color="#5a3f6e"/></linearGradient>
  </defs>`;

  // Gate: Awadhi darwaza with twin fish, marigold swags, mango-leaf toran and kalash
  $("#gateArt").innerHTML = `${defs}
    <rect width="500" height="600" fill="url(#ivory)"/>
    <path d="${multifoil(92, 600, 316, 390, 9)}" fill="#f4e6c8" stroke="#c9a24a" stroke-width="4"/>
    <path d="${multifoil(108, 600, 284, 360, 9)}" fill="none" stroke="#e6cf96" stroke-width="2"/>
    <text x="250" y="34" text-anchor="middle" font-family="Tiro Devanagari Hindi, serif" font-size="20" fill="#7b1424">॥ श्री गणेशाय नमः ॥</text>
    ${fish(165, 120, 1, false)}${fish(335, 120, 1, true)}
    <path d="M232 112 Q250 72 268 112Z" fill="url(#brass)"/><path d="M226 112 h48" stroke="#8a6420" stroke-width="3"/><path d="M250 112 v22" stroke="#8a6420" stroke-width="3"/><circle cx="250" cy="70" r="4" fill="#c8102e"/>
    ${swag(14, 170, 168, 26, 14)}${swag(170, 330, 168, 30, 14)}${swag(330, 486, 168, 26, 14)}
    ${strand(14, 172, 70)}${strand(170, 172, 50)}${strand(330, 172, 50)}${strand(486, 172, 70)}
    ${bandanwar(126, 374, 214)}
    ${kalash(54, 598, 1)}${kalash(446, 598, 1)}
    ${diya(110, 598, 1)}${diya(390, 598, 1)}`;

  // Marigold (genda) flowers for the sides, and a chowk purana medallion
  function marigold() {
    let s = "";
    const cols = ["#d9480f", "#e8590c", "#f76707", "#fd7e14", "#ff922b", "#fcc419", "#ffd43b"];
    for (let ring = 7; ring >= 1; ring--) {
      const n = 10 + ring * 4, rr = ring * 13, c = cols[7 - ring];
      for (let i = 0; i < n; i++) {
        const a = 360 * i / n + ring * 7;
        s += `<path d="M-${5 + ring} 0 Q-${6 + ring} -${10 + ring * 1.8} 0 -${14 + ring * 2} Q${6 + ring} -${10 + ring * 1.8} ${5 + ring} 0Z" transform="rotate(${a}) translate(0 ${-rr + 8})" fill="${c}" stroke="#b8400a" stroke-width=".7"/>`;
      }
    }
    return `<svg viewBox="-118 -118 236 236">${s}<circle r="10" fill="#e8590c"/>${[0, 60, 120, 180, 240, 300].map(a => `<circle cx="${Math.cos(rad(a)) * 5}" cy="${Math.sin(rad(a)) * 5}" r="2" fill="#7a2a0a"/>`).join("")}</svg>`;
  }
  function chowk() {
    let s = `<rect x="-62" y="-62" width="124" height="124" fill="none" stroke="#c8102e" stroke-width="4" transform="rotate(45)"/>
      <rect x="-62" y="-62" width="124" height="124" fill="none" stroke="#c8102e" stroke-width="4"/>`;
    for (let i = 0; i < 8; i++) s += `<path d="M0 -20 Q14 -40 0 -58 Q-14 -40 0 -20Z" fill="#f6c12b" stroke="#c8102e" stroke-width="2" transform="rotate(${i * 45})"/>`;
    for (let i = 0; i < 16; i++) s += `<circle cx="0" cy="-76" r="3.5" fill="#c8102e" transform="rotate(${i * 22.5})"/>`;
    return `<svg viewBox="-92 -92 184 184">${s}<circle r="18" fill="#fff" stroke="#c8102e" stroke-width="3"/>${swastik(0, 0, 1)}</svg>`;
  }
  $$(".mandala-bg").forEach(el => (el.innerHTML = marigold()));
  $$(".medallion").forEach(el => (el.innerHTML = chowk()));

  // Hero: dusk on the Ganga at the ghats of Shuklaganj
  function onion(cx, y, r, fill = "url(#ivory2)") {
    return `<path d="M${cx - r} ${y} C${cx - r * 1.15} ${y - r * 1.1} ${cx - r * .2} ${y - r * 1.3} ${cx} ${y - r * 1.8} C${cx + r * .2} ${y - r * 1.3} ${cx + r * 1.15} ${y - r * 1.1} ${cx + r} ${y}Z" fill="${fill}"/>
      <path d="M${cx} ${y - r * 1.8} v-${r * .45}" stroke="#b8862e" stroke-width="2"/><circle cx="${cx}" cy="${y - r * 2.3}" r="2.5" fill="#d4a640"/>`;
  }
  function shikhara(cx, by, w, h, c1 = "#e7b07c", c2 = "#c27a4a") {
    const t = by - h;
    let bands = "";
    for (let k = 1; k < 6; k++) { const yy = by - h * k / 6.2, ww = w / 2 * (1 - (k / 6.2) ** 2.2); bands += `<path d="M${cx - ww} ${yy} H${cx + ww}" stroke="${c2}" stroke-width="2"/>`; }
    return `<path d="M${cx - w / 2} ${by} C${cx - w / 2} ${by - h * .55} ${cx - w * .2} ${t + h * .08} ${cx} ${t} C${cx + w * .2} ${t + h * .08} ${cx + w / 2} ${by - h * .55} ${cx + w / 2} ${by}Z" fill="${c1}"/>${bands}
      <ellipse cx="${cx}" cy="${t - 3}" rx="${w * .14}" ry="5" fill="${c2}"/><path d="M${cx} ${t - 8} v-26" stroke="#7a3a1e" stroke-width="2"/>
      <path d="M${cx} ${t - 34} l22 7 l-22 7z" fill="#ff7b00"/>`;
  }
  function houses(x, w, by, h, c) {
    let s = `<rect x="${x}" y="${by - h}" width="${w}" height="${h}" fill="${c}"/><rect x="${x - 3}" y="${by - h - 5}" width="${w + 6}" height="6" fill="#f4e2c4"/>`;
    for (let wx = x + 8; wx < x + w - 10; wx += 20) for (let wy = by - h + 12; wy < by - 18; wy += 26)
      s += `<path d="M${wx} ${wy + 14} v-8 a5 5 0 0 1 10 0 v8z" fill="${(wx + wy) % 3 ? "#6b3a2a" : "#ffd27a"}"/>`;
    return s;
  }
  function umbrella(x, y) {
    return `<path d="M${x} ${y} v-26" stroke="#5a3a1a" stroke-width="2"/><path d="M${x - 22} ${y - 22} Q${x} ${y - 40} ${x + 22} ${y - 22}Z" fill="#e8c27a" stroke="#8a6420"/>`;
  }
  function boat(x, y, s) {
    return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-60 0 Q0 18 60 0 L50 -6 H-50Z" fill="#4a2a1a"/><path d="M-30 -6 v-22 h40 v22" fill="#c8102e" opacity=".85"/>
      <circle cx="40" cy="-24" r="5" fill="#3a1c14"/><path d="M40 -19 v14 M40 -14 l18 22" stroke="#3a1c14" stroke-width="3"/></g>`;
  }
  let ghat = `${defs}
    <path d="M0 262 H330" stroke="#a0707a" stroke-width="3" opacity=".6"/>${[0, 1, 2, 3, 4, 5].map(i => `<path d="M${i * 55} 300 v-38 a27 22 0 0 1 55 0 v38" fill="none" stroke="#a0707a" stroke-width="5" opacity=".55"/>`).join("")}
    ${houses(330, 120, 290, 90, "#e2a679")}${shikhara(470, 290, 70, 170)}${houses(505, 70, 290, 70, "#d99766")}
    <rect x="560" y="200" width="120" height="90" fill="url(#ivory2)"/><path d="${multifoil(580, 290, 34, 54, 5)}" fill="#6b3a2a"/><path d="${multifoil(623, 290, 34, 54, 5)}" fill="#6b3a2a"/>
    ${onion(620, 200, 52)}${onion(570, 200, 13)}${onion(670, 200, 13)}
    ${shikhara(760, 290, 90, 210, "#f0bd85", "#c47a42")}${houses(805, 150, 290, 100, "#e6ad80")}${shikhara(985, 290, 60, 140)}${houses(1015, 185, 290, 80, "#dc9b6c")}
    ${[0, 1, 2, 3, 4].map(i => `<rect x="0" y="${290 + i * 8}" width="1200" height="8" fill="${i % 2 ? "#c98a5e" : "#e4b183"}"/>`).join("")}
    ${umbrella(380, 300)}${umbrella(700, 300)}${umbrella(1080, 300)}
    <rect x="0" y="330" width="1200" height="90" fill="url(#water)"/>
    ${[0, 1, 2, 3, 4, 5, 6].map(i => `<ellipse cx="600" cy="${342 + i * 11}" rx="${70 - i * 7}" ry="2.5" fill="#ffe3a3" opacity="${.75 - i * .08}"/>`).join("")}
    ${[[120, 350], [210, 372], [330, 360], [470, 395], [760, 380], [880, 356], [1010, 392], [1130, 366]].map(([x, y]) => diya(x, y, .8)).join("")}
    ${boat(930, 384, .9)}`;
  $("#palaceSvg").innerHTML = ghat;

  // Facade: Awadhi palace front (Bara Imambara style) that rises to fill the screen
  let fac = `${defs}<rect width="1200" height="900" fill="url(#ivory)"/>`;
  for (let x = 0; x < 1200; x += 24) fac += `<path d="M${x} 46 l12 -18 l12 18z" fill="#e3cfa6"/>`;
  fac += `<rect x="0" y="46" width="1200" height="10" fill="#c9a24a"/>`;
  for (let x = 30; x < 1200; x += 150) fac += `<rect x="${x - 7}" y="0" width="14" height="46" fill="#ead9b6"/>${onion(x, 4, 11)}`;
  [[80, 300], [360, 580]].forEach(([top, bot]) => {
    for (let x = 20; x < 1200; x += 150) {
      fac += `<path d="${multifoil(x + 15, bot - 10, 120, bot - top - 30, 7)}" fill="#f7ecd4" stroke="#c9a24a" stroke-width="3"/>
        <path d="${multifoil(x + 27, bot - 10, 96, bot - top - 50, 7)}" fill="#5b3a2e"/>${strand(x + 75, top + 70, 60)}`;
      fac += fish(x + 2, top + 22, .32, false) + fish(x + 148, top + 22, .32, true);
    }
    fac += `<rect x="0" y="${bot - 10}" width="1200" height="14" fill="#d9c08a"/>${swag(0, 400, bot + 6, 16, 30)}${swag(400, 800, bot + 6, 16, 30)}${swag(800, 1200, bot + 6, 16, 30)}`;
  });
  fac += `<rect x="0" y="600" width="1200" height="300" fill="#efe1c4"/>
    ${[90, 270, 870, 1050].map(x => `<path d="${multifoil(x, 880, 90, 170, 5)}" fill="#5b3a2e" stroke="#c9a24a" stroke-width="3"/>`).join("")}
    <path d="${multifoil(420, 900, 360, 290, 11)}" fill="#f7ecd4" stroke="#c9a24a" stroke-width="5"/>
    <path d="${multifoil(452, 900, 296, 250, 11)}" fill="#fbf5ea"/>
    ${fish(470, 640, .7, false)}${fish(730, 640, .7, true)}${bandanwar(470, 730, 662)}
    <rect x="0" y="880" width="1200" height="20" fill="#b9935a"/>`;
  $("#facadeSvg").innerHTML = fac;

  // Closing: the baraat walks to the welcome gate
  function person(x, y, kurta, turban, extra = "") {
    return `<g transform="translate(${x} ${y})"><path d="M-3 0 l-3 -22 M3 0 l3 -22" stroke="#3a1c14" stroke-width="3"/>
      <path d="M-9 -22 L-7 -46 H7 L9 -22Z" fill="${kurta}"/><circle cx="0" cy="-52" r="6" fill="#d9a07a"/>
      <path d="M-7 -55 q7 -10 14 0z" fill="${turban}"/>${extra}</g>`;
  }
  function mare(x, y) {
    return `<g transform="translate(${x} ${y})">
      <path d="M-34 -30 q-10 6 -14 24" stroke="#f4efe2" stroke-width="5" fill="none"/>
      <ellipse cx="0" cy="-34" rx="34" ry="15" fill="#f8f4ea" stroke="#d8cdb5"/>
      ${[-24, -14, 16, 26].map(lx => `<path d="M${lx} -24 v24" stroke="#ece4d2" stroke-width="5"/>`).join("")}
      <path d="M26 -42 L40 -70 L54 -64 L44 -40Z" fill="#f8f4ea" stroke="#d8cdb5"/><path d="M40 -70 l-4 -8 l8 4z" fill="#f8f4ea"/>
      <path d="M-24 -48 h44 v20 q-22 8 -44 0z" fill="#c8102e"/>${[0, 1, 2, 3, 4].map(i => `<circle cx="${-20 + i * 10}" cy="-30" r="2.5" fill="#f6c12b"/>`).join("")}
      ${person(-2, -46, "#f3e3c0", "#e4572e", `<path d="M-6 -50 v10 M-2 -50 v12 M2 -50 v12 M6 -50 v10" stroke="#f6c12b" stroke-width="1.5"/>`)}
      <path d="M-6 -118 v20" stroke="#7a3a1e" stroke-width="2"/><path d="M-26 -116 Q-6 -134 14 -116Z" fill="#c8102e" stroke="#f6c12b"/></g>`;
  }
  function roshni(x, y) {
    return person(x, y, "#5a3a7a", "#f6c12b", `<path d="M0 -60 v-20 M-12 -80 h24" stroke="#8a6420" stroke-width="2"/><circle cx="-12" cy="-84" r="6" fill="#fff4c4"/><circle cx="12" cy="-84" r="6" fill="#fff4c4"/><circle cx="0" cy="-86" r="16" fill="#ffd27a" opacity=".35"/>`);
  }
  function banana(x, y, s) {
    return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0 V-90" stroke="#6b8a3a" stroke-width="8"/>
      ${[-62, -30, 30, 62, 0].map(a => `<path d="M0 -88 Q${a * .5} ${-128 + Math.abs(a) * .4} ${a * 1.25} ${-70 + Math.abs(a) * .5} Q${a * .55} ${-84 + Math.abs(a) * .3} 0 -88Z" fill="${a ? "#4f9a34" : "#6bb34a"}" stroke="#2a5a1d" stroke-width="1.5"/>
        <path d="M0 -88 Q${a * .5} ${-112 + Math.abs(a) * .4} ${a * 1.2} ${-72 + Math.abs(a) * .5}" stroke="#2a5a1d" stroke-width="1.2" fill="none"/>`).join("")}</g>`;
  }
  function welcomeGate(x1, x2, by) {
    const mid = (x1 + x2) / 2;
    return `${banana(x1 - 26, by, 1)}${banana(x2 + 26, by, 1)}
      <rect x="${x1 - 10}" y="${by - 150}" width="20" height="150" fill="#c8102e"/><rect x="${x2 - 10}" y="${by - 150}" width="20" height="150" fill="#c8102e"/>
      <path d="M${x1 - 18} ${by - 150} Q${mid} ${by - 210} ${x2 + 18} ${by - 150}" stroke="#d4a640" stroke-width="22" fill="none"/>
      <text x="${mid}" y="${by - 166}" text-anchor="middle" font-family="Tiro Devanagari Hindi, serif" font-size="20" fill="#7b1424">स्वागतम्</text>
      ${swag(x1, x2, by - 140, 20, 16)}${strand(x1, by - 140, 60)}${strand(x2, by - 140, 60)}${kalash(x1 - 2, by, .5)}${kalash(x2 + 2, by, .5)}`;
  }
  function shehnaiPlayers(x, y) {
    return `<rect x="${x - 40}" y="${y - 6}" width="80" height="8" fill="#c8102e"/>
      ${[-16, 16].map(dx => `<g transform="translate(${x + dx} ${y - 6})"><path d="M-12 0 Q0 -10 12 0Z" fill="#f3e3c0"/><path d="M-8 -2 L-6 -26 H6 L8 -2Z" fill="#f3e3c0"/>
        <circle cx="0" cy="-32" r="6" fill="#d9a07a"/><path d="M-7 -35 q7 -10 14 0z" fill="#e4572e"/><path d="M4 -30 l16 10" stroke="#8a6420" stroke-width="3"/><circle cx="21" cy="-19" r="3" fill="#d4a640"/></g>`).join("")}`;
  }
  const [far, mid, near] = $$("#desert .d-layer");
  far.innerHTML = `${defs}<linearGradient id="dusk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fbf5ea" stop-opacity="0"/><stop offset=".6" stop-color="#f7dcc0"/></linearGradient>
    <rect width="1200" height="360" fill="url(#dusk)"/><circle cx="880" cy="190" r="40" fill="#ffd27a" opacity=".55"/>
    <g opacity=".45">${shikhara(240, 280, 50, 120, "#d9a07a", "#b77650")}${onion(420, 280, 40, "#d9b48a")}<rect x="380" y="250" width="80" height="30" fill="#d9b48a"/>${shikhara(980, 280, 44, 100, "#d9a07a", "#b77650")}</g>
    <rect x="0" y="270" width="1200" height="30" fill="#e3b49a" opacity=".7"/>`;
  mid.innerHTML = `<path d="M0 300 H1200 V360 H0Z" fill="#ead2ae"/>
    <g class="caravan">${roshni(420, 318)}${person(470, 318, "#2f5d8a", "#c8102e", `<ellipse cx="0" cy="-34" rx="9" ry="7" fill="#b5541f"/>`)}${person(505, 318, "#f6c12b", "#c8102e", `<path d="M4 -48 l14 8" stroke="#8a6420" stroke-width="3"/>`)}
      ${mare(580, 318)}${person(640, 318, "#c2185b", "#f6c12b")}${roshni(680, 318)}${person(715, 318, "#3f7d2c", "#e4572e")}</g>`;
  near.innerHTML = `<path d="M0 336 H1200 V360 H0Z" fill="#d9b48a"/>${shehnaiPlayers(160, 340)}${banana(40, 340, .8)}${welcomeGate(880, 1080, 340)}`;

  // Brass temple bell that descends the festivities timeline
  $("#lampSvg").innerHTML = `${defs}<circle cx="20" cy="6" r="5" fill="#f08a24"/>
    <path d="M20 10 v6" stroke="#8a6420" stroke-width="2"/><path d="M8 54 C8 30 12 18 20 16 C28 18 32 30 32 54Z" fill="url(#brass)" stroke="#8a6420"/>
    <rect x="5" y="52" width="30" height="5" rx="2" fill="#8a6420"/><circle cx="20" cy="62" r="4" fill="#8a6420"/>
    <path d="M14 30 q6 4 12 0" stroke="#8a6420" fill="none"/>${swastik(20, 42, .45)}`;

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
        <div class="jharokha j-leaf tall" data-open>
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
  $("#eventsKicker").textContent = `${days} days of celebration`;
  $("#timeline").insertAdjacentHTML("beforeend", W.events.map((e, i) => `
    <div class="event-row${i % 2 ? " alt" : ""}">
      <div class="scroll">
        <span class="tassel l"></span><span class="tassel r"></span>
        <div class="rod"></div>
        <div class="scroll-body">
          <div class="parchment"><div class="parchment-in">
            <div class="emoji">${icons[e.name.toLowerCase()] || "❖"}</div>
            ${e.hindi ? `<p class="hi">${e.hindi}</p>` : ""}
            <h3>${e.name.toUpperCase()}</h3>
            ${e.note ? `<p class="note">${e.note}</p>` : ""}
            <ul><li>${e.day ? e.day + ", " : ""}${e.date}</li>${e.time ? `<li>${e.time}</li>` : ""}<li>${e.venue}</li></ul>
            ${e.map ? `<a target="_blank" rel="noopener" href="${e.map.startsWith("http") ? e.map : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(e.map)}`}">View Map</a>` : ""}
          </div></div>
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
    g.addColorStop(0, "#d6336c"); g.addColorStop(1, "#7b1424");
    ctx.fillStyle = g; ctx.fillRect(0, 0, r.width, r.height);
    ctx.fillStyle = "rgba(246,193,43,.28)";
    for (let x = 10; x < r.width; x += 22) for (let y = 10; y < r.height; y += 22) { ctx.beginPath(); ctx.arc(x, y, 2, 0, 7); ctx.fill(); }
    ctx.fillStyle = "#fff3cf"; ctx.textAlign = "center"; ctx.font = "600 15px Cinzel, serif";
    ctx.fillText("✦  SCRATCH HERE  ✦", r.width / 2, r.height / 2 + 14);
    ctx.font = "22px 'Tiro Devanagari Hindi', serif";
    ctx.fillText("यहाँ खुरचें", r.width / 2, r.height / 2 - 10);
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

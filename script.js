(() => {
  const W = window.WEDDING;
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Fill text from config ---------- */
  const derived = {
    coupleShort: `${W.groom} & ${W.bride}`,
    coupleCaps: `${W.groom} & ${W.bride}`.toUpperCase(),
    initials: `${W.groom[0]}&${W.bride[0]}`,
    venueName: W.venue.name,
    venueAddress: W.venue.address
  };
  $$("[data-cfg]").forEach(el => {
    const v = derived[el.dataset.cfg] ?? W[el.dataset.cfg];
    if (v) el.textContent = v;
  });
  document.title = `${W.groom} & ${W.bride} — Wedding Invitation`;

  // Hero names animate in letter by letter
  let delay = 0.6;
  $$(".hero-names .letters").forEach((el, i) => {
    if (i === 1) delay += 0.5;
    el.innerHTML = [...el.textContent.toUpperCase()].map(c => {
      delay += 0.12;
      return `<span class="ch" style="transition-delay:${delay.toFixed(2)}s">${c === " " ? "&nbsp;" : c}</span>`;
    }).join("");
  });

  /* ---------- SVG artwork ---------- */
  const rad = d => d * Math.PI / 180;

  function feather(x, y, angle, len) {
    const ex = x + Math.cos(rad(angle)) * len, ey = y + Math.sin(rad(angle)) * len;
    return `<line x1="${x}" y1="${y}" x2="${ex}" y2="${ey}" stroke="#2f7d4f" stroke-width="2"/>
      <ellipse cx="${(x + ex) / 2}" cy="${(y + ey) / 2}" rx="${len / 2}" ry="${len / 9}" transform="rotate(${angle} ${(x + ex) / 2} ${(y + ey) / 2})" fill="url(#fth)" opacity=".9"/>
      <circle cx="${ex}" cy="${ey}" r="${len / 8}" fill="#d9a832"/>
      <circle cx="${ex}" cy="${ey}" r="${len / 11}" fill="#1aa39a"/>
      <circle cx="${ex}" cy="${ey}" r="${len / 20}" fill="#0c2a7a"/>`;
  }
  function peacock(x, y, from, to, len, count, facing) {
    let tail = "";
    for (let i = 0; i < count; i++) tail += feather(x, y, from + (to - from) * i / (count - 1), len * (0.85 + 0.15 * Math.sin(i)));
    const hx = x + facing * 10, hy = y - 42;
    return `<g>${tail}
      <ellipse cx="${x}" cy="${y - 6}" rx="13" ry="24" fill="url(#body)" transform="rotate(${facing * 12} ${x} ${y})"/>
      <path d="M${x} ${y - 24} Q${x + facing * 2} ${y - 40} ${hx} ${hy}" stroke="#1d4fb8" stroke-width="8" fill="none" stroke-linecap="round"/>
      <circle cx="${hx}" cy="${hy}" r="7" fill="#1d4fb8"/>
      <circle cx="${hx + facing * 2}" cy="${hy - 1}" r="1.6" fill="#fff"/>
      <path d="M${hx + facing * 6} ${hy} l${facing * 7} 2 l${-facing * 7} 2z" fill="#e2b66e"/>
      ${[-6, 0, 6].map(d => `<line x1="${hx}" y1="${hy - 6}" x2="${hx + d}" y2="${hy - 16}" stroke="#1d4fb8" stroke-width="1.2"/><circle cx="${hx + d}" cy="${hy - 17}" r="2" fill="#1aa39a"/>`).join("")}
    </g>`;
  }
  $("#peacockSvg").innerHTML = `
    <defs>
      <linearGradient id="fth" x1="0" x2="1"><stop offset="0" stop-color="#1f6b3f"/><stop offset="1" stop-color="#4fb06a"/></linearGradient>
      <radialGradient id="body" cx=".4" cy=".35"><stop offset="0" stop-color="#3a8dde"/><stop offset="1" stop-color="#0b2a8a"/></radialGradient>
    </defs>
    ${peacock(300, 150, -174, -6, 125, 19, 1)}
    ${peacock(110, 150, 95, 165, 105, 10, 1)}
    ${peacock(490, 150, 85, 15, 105, 10, -1)}`;

  function mandala(colors, rings = 7) {
    let s = "";
    for (let r = rings; r >= 1; r--) {
      const n = 8 + r * 4, radius = r * 13, c = colors[r % colors.length];
      for (let i = 0; i < n; i++) {
        const a = 360 * i / n;
        s += `<ellipse cx="0" cy="${-radius}" rx="${4 + r * 1.3}" ry="${7 + r * 1.6}" fill="${c}" stroke="${colors[(r + 2) % colors.length]}" stroke-width=".8" transform="rotate(${a})"/>`;
      }
      s += `<circle r="${radius - 6}" fill="none" stroke="${colors[(r + 1) % colors.length]}" stroke-width="1" stroke-dasharray="2 3"/>`;
    }
    return `<svg viewBox="-100 -100 200 200">${s}<circle r="9" fill="${colors[0]}" stroke="${colors[3]}" stroke-width="2"/></svg>`;
  }
  const blues = ["#0b1f6e", "#1f4fb8", "#3a8dde", "#5cc8f0", "#122d8f", "#2a6fd6"];
  $$(".mandala-bg").forEach(el => (el.innerHTML = mandala(blues)));
  $$(".medallion").forEach(el => (el.innerHTML = mandala(["#2b2b3a", "#4a4a60", "#6d6d88", "#9a9ab5"], 5)));

  // Sunset palace silhouette
  function dome(cx, y, r) {
    return `<path d="M${cx - r} ${y} C${cx - r} ${y - r * 1.25} ${cx - r * .15} ${y - r * 1.2} ${cx} ${y - r * 1.55} C${cx + r * .15} ${y - r * 1.2} ${cx + r} ${y - r * 1.25} ${cx + r} ${y}Z" fill="url(#stone2)"/>
      <line x1="${cx}" y1="${y - r * 1.55}" x2="${cx}" y2="${y - r * 1.9}" stroke="#a8602e" stroke-width="2"/><circle cx="${cx}" cy="${y - r * 1.9}" r="2.5" fill="#d4a640"/>`;
  }
  function chhatri(cx, y, w) {
    return `<rect x="${cx - w / 2}" y="${y - w * .6}" width="${w}" height="${w * .6}" fill="url(#stone)"/>
      ${[0, 1, 2].map(i => `<path d="M${cx - w / 2 + 3 + i * (w - 6) / 3} ${y} v${-w * .35} a${(w - 6) / 6} ${(w - 6) / 6} 0 0 1 ${(w - 6) / 3 - 2} 0 v${w * .35}z" fill="#7a3a1e"/>`).join("")}
      <rect x="${cx - w / 2 - 3}" y="${y - w * .65}" width="${w + 6}" height="5" fill="#c97b45"/>${dome(cx, y - w * .65, w / 2)}`;
  }
  function windows(x, y, w, h, cols, rows, gap) {
    let s = "";
    const ww = (w - gap * (cols + 1)) / cols, wh = (h - gap * (rows + 1)) / rows;
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const wx = x + gap + c * (ww + gap), wy = y + gap + r * (wh + gap);
      const lit = (r * 7 + c * 3) % 5 === 0;
      s += `<path d="M${wx} ${wy + wh} V${wy + ww / 2} A${ww / 2} ${ww / 2} 0 0 1 ${wx + ww} ${wy + ww / 2} V${wy + wh}Z" fill="${lit ? "#ffd27a" : "#7a3a1e"}" stroke="#f4c690" stroke-width="1.5"/>`;
    }
    return s;
  }
  $("#palaceSvg").innerHTML = `
    <defs>
      <linearGradient id="stone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f2b57a"/><stop offset="1" stop-color="#b8693a"/></linearGradient>
      <linearGradient id="stone2" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e09a5c"/><stop offset=".5" stop-color="#f8cf9a"/><stop offset="1" stop-color="#c47a42"/></linearGradient>
    </defs>
    <rect x="0" y="330" width="1200" height="90" fill="url(#stone)"/>
    ${windows(0, 330, 1200, 90, 30, 1, 10)}
    <rect x="100" y="220" width="310" height="115" fill="url(#stone)"/>${windows(100, 220, 310, 115, 7, 2, 8)}
    <rect x="790" y="220" width="310" height="115" fill="url(#stone)"/>${windows(790, 220, 310, 115, 7, 2, 8)}
    ${chhatri(130, 220, 44)}${chhatri(255, 220, 54)}${chhatri(380, 220, 44)}
    ${chhatri(820, 220, 44)}${chhatri(945, 220, 54)}${chhatri(1070, 220, 44)}
    <rect x="410" y="150" width="380" height="185" fill="url(#stone)"/>
    ${windows(410, 150, 380, 120, 8, 2, 9)}
    <path d="M555 335 V280 A45 45 0 0 1 645 280 V335Z" fill="#5a2a14" stroke="#f4c690" stroke-width="3"/>
    <rect x="400" y="142" width="400" height="10" fill="#c97b45"/>
    ${dome(600, 142, 90)}${chhatri(450, 142, 50)}${chhatri(750, 142, 50)}
    <rect x="20" y="170" width="70" height="165" fill="url(#stone)"/>${windows(20, 170, 70, 165, 2, 4, 6)}${dome(55, 170, 35)}
    <rect x="1110" y="170" width="70" height="165" fill="url(#stone)"/>${windows(1110, 170, 70, 165, 2, 4, 6)}${dome(1145, 170, 35)}`;

  // Haveli facade band (repeating)
  const haveliUnit = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 150">
    <defs><linearGradient id="h" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f0b27a"/><stop offset="1" stop-color="#c47a42"/></linearGradient></defs>
    <rect width="240" height="150" fill="url(#h)"/>
    <rect y="0" width="240" height="8" fill="#a8602e"/><rect y="70" width="240" height="6" fill="#a8602e"/>
    ${[20, 140].map(x => `<rect x="${x}" y="16" width="80" height="48" rx="3" fill="#e8a060" stroke="#8a4a22"/>
      ${[0, 1, 2].map(i => `<path d="M${x + 6 + i * 25} 60 V34 a10 10 0 0 1 20 0 V60Z" fill="#6a3018" stroke="#ffd9a0"/>`).join("")}
      <path d="M${x - 4} 18 Q${x + 40} -4 ${x + 84} 18Z" fill="#b8693a"/>`).join("")}
    <path d="M92 150 V110 a28 28 0 0 1 56 0 V150Z" fill="#5a2a14" stroke="#ffd9a0" stroke-width="3"/>
    ${[18, 190].map(x => `<path d="M${x} 140 V104 a16 16 0 0 1 32 0 V140Z" fill="#6a3018" stroke="#ffd9a0"/>`).join("")}
    <rect y="142" width="240" height="8" fill="#8a4a22"/></svg>`;
  $("#haveliBand").style.backgroundImage = `url("data:image/svg+xml,${encodeURIComponent(haveliUnit)}")`;

  // Desert scene for the footer
  function camel(x, y, s, c) {
    return `<g transform="translate(${x} ${y}) scale(${s})" fill="${c}">
      <path d="M-30 -30 Q-26 -52 -12 -44 Q-4 -62 10 -46 Q22 -44 26 -32 L30 -50 Q32 -64 42 -62 L48 -58 L40 -56 L36 -30 Q34 -20 24 -20 L-24 -20 Q-32 -22 -30 -30Z"/>
      <rect x="-24" y="-22" width="4" height="22"/><rect x="-14" y="-22" width="4" height="22"/>
      <rect x="14" y="-22" width="4" height="22"/><rect x="22" y="-22" width="4" height="22"/>
      <path d="M-30 -30 q-8 4 -6 14" stroke="${c}" stroke-width="2" fill="none"/></g>`;
  }
  function hut(x, y, w) {
    return `<rect x="${x}" y="${y - w * .7}" width="${w}" height="${w * .7}" rx="4" fill="#fbecd0" stroke="#b04a2a" stroke-width="2"/>
      <path d="M${x - 8} ${y - w * .65} L${x + w / 2} ${y - w * 1.35} L${x + w + 8} ${y - w * .65}Z" fill="#c9923e" stroke="#8a5a1c" stroke-width="2"/>
      <rect x="${x + w * .38}" y="${y - w * .4}" width="${w * .24}" height="${w * .4}" fill="#7a3a1e"/>
      ${[0, 1, 2, 3, 4].map(i => `<path d="M${x + 4 + i * (w - 8) / 5} ${y - w * .55} l${(w - 8) / 10} -6 l${(w - 8) / 10} 6" stroke="#c0392b" stroke-width="2" fill="none"/>`).join("")}`;
  }
  function tree(x, y, s) {
    let leaves = "";
    for (let i = 0; i < 26; i++) {
      const a = rad(-160 + i * 5.5), r = 30 + (i % 4) * 12;
      leaves += `<ellipse cx="${x + Math.cos(a) * r}" cy="${y - 90 * s + Math.sin(a) * r}" rx="7" ry="4" fill="${i % 3 ? "#5b8a3a" : "#e2672a"}" transform="rotate(${i * 20} ${x + Math.cos(a) * r} ${y - 90 * s + Math.sin(a) * r})"/>`;
    }
    return `<path d="M${x - 5} ${y} Q${x} ${y - 60 * s} ${x} ${y - 90 * s} M${x} ${y - 70 * s} q20 -10 34 -30 M${x} ${y - 60 * s} q-22 -8 -36 -26" stroke="#6b3e1e" stroke-width="5" fill="none"/>${leaves}`;
  }
  $("#desertSvg").innerHTML = `
    <defs>
      <linearGradient id="dsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fbf3e6" stop-opacity="0"/><stop offset=".55" stop-color="#f8e2b8"/></linearGradient>
      <linearGradient id="dune" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f2c97a"/><stop offset="1" stop-color="#d9a24e"/></linearGradient>
    </defs>
    <rect width="1200" height="360" fill="url(#dsky)"/>
    <circle cx="900" cy="150" r="46" fill="#ffd27a" opacity=".55"/>
    <path d="M0 250 Q200 200 420 240 T820 230 T1200 240 V360 H0Z" fill="#e9b866" opacity=".7"/>
    <path d="M0 290 Q300 250 600 285 T1200 280 V360 H0Z" fill="url(#dune)"/>
    ${camel(560, 268, .55, "#7a3a1e")}${camel(620, 270, .55, "#7a3a1e")}${camel(680, 272, .55, "#7a3a1e")}
    ${hut(150, 300, 90)}${hut(270, 305, 64)}
    ${camel(980, 320, 1.5, "#8a4a22")}
    <path d="M940 280 h70 l-6 14 h-58z" fill="#b0182e"/><path d="M946 294 h58" stroke="#f6c12b" stroke-width="3" stroke-dasharray="4 4"/>
    ${tree(60, 320, 1.2)}${tree(1160, 320, 1)}
    ${[100, 380, 470, 760, 860, 1080].map(x => `<path d="M${x} 330 l4 -14 l4 14 m-10 -4 l-6 -8 m14 8 l6 -8" stroke="#6b8a3a" stroke-width="2" fill="none"/>`).join("")}`;

  /* ---------- Photos with graceful fallback ---------- */
  function loadPhoto(el, src, letter) {
    el.dataset.letter = letter || "";
    if (!src) return;
    const img = new Image();
    img.onload = () => { el.style.backgroundImage = `url("${src}")`; el.classList.add("has-img"); };
    img.src = src;
  }
  $$(".photo[data-photo]").forEach(el => loadPhoto(el, W[el.dataset.photo], W[el.dataset.initial][0]));

  /* ---------- Family ---------- */
  function renderFamily(list, target) {
    $(target).innerHTML = list.map(m => `
      <figure class="member reveal">
        <div class="jharokha j-pink tall" data-open>
          <div class="j-top"><span class="lotus">✿</span><span class="lotus">✿</span></div>
          <div class="j-window"><div class="j-content photo" data-src="${m.photo || ""}" data-l="${m.name[0]}"></div><div class="shutter l"></div><div class="shutter r"></div></div>
        </div>
        <span class="label">${m.relation}</span>
        <span class="mname">${m.name}</span>
      </figure>`).join("");
  }
  renderFamily(W.family.groom, "#familyGroom");
  renderFamily(W.family.bride, "#familyBride");
  $$(".member .photo").forEach(el => loadPhoto(el, el.dataset.src, el.dataset.l));

  /* ---------- Events ---------- */
  const icons = { haldi: "🌼", mehndi: "🌿", mehendi: "🌿", sangeet: "🎶", wedding: "🔥", reception: "✨", engagement: "💍", cocktail: "🥂" };
  const days = new Set(W.events.map(e => e.date)).size;
  $("#eventsKicker").textContent = `${days} day${days > 1 ? "s" : ""} of celebration`;
  $("#timeline").innerHTML = W.events.map(e => `
    <div class="event-row">
      <div class="lantern" aria-hidden="true"><i></i></div>
      <div class="scroll">
        <span class="tassel l"></span><span class="tassel r"></span>
        <div class="rod"></div>
        <div class="scroll-body">
          <div class="parchment">
            <div class="emoji">${icons[e.name.toLowerCase()] || "❖"}</div>
            <h3>${e.name.toUpperCase()}</h3>
            ${e.note ? `<p class="note">${e.note}</p>` : ""}
            <ul><li>${e.date}</li><li>${e.time}</li><li>${e.venue}</li></ul>
          </div>
          <div class="rod"></div>
        </div>
      </div>
      <p class="edate">${e.date}</p>
    </div>`).join("");

  /* ---------- Gallery carousel ---------- */
  const track = $("#track"), dots = $("#dots"), caption = $("#caption");
  track.style.perspective = "1200px";
  track.innerHTML = W.gallery.map((g, i) => `<div class="slide" data-i="${i}"><div class="pic ph"></div></div>`).join("");
  dots.innerHTML = W.gallery.map((_, i) => `<button aria-label="Photo ${i + 1}"></button>`).join("");
  const slides = $$(".slide");
  slides.forEach((s, i) => {
    const img = new Image();
    img.onload = () => { const p = s.firstElementChild; p.style.backgroundImage = `url("${W.gallery[i].src}")`; p.classList.remove("ph"); };
    img.src = W.gallery[i].src;
  });
  let cur = 0;
  function show(n) {
    const len = slides.length;
    cur = (n + len) % len;
    slides.forEach((s, i) => {
      let d = i - cur;
      if (d > len / 2) d -= len;
      if (d < -len / 2) d += len;
      const a = Math.abs(d);
      s.style.transform = `translateX(${-50 + d * 78}%) scale(${a ? 0.8 : 1}) rotateY(${-d * 22}deg)`;
      s.style.opacity = a > 1 ? 0 : a ? 0.75 : 1;
      s.style.zIndex = 10 - a;
      s.style.filter = a ? "brightness(.8)" : "none";
      s.style.pointerEvents = a > 1 ? "none" : "auto";
    });
    [...dots.children].forEach((b, i) => b.classList.toggle("on", i === cur));
    caption.textContent = W.gallery[cur].caption || "";
  }
  slides.forEach((s, i) => s.addEventListener("click", () => { show(i); restart(); }));
  [...dots.children].forEach((b, i) => b.addEventListener("click", () => { show(i); restart(); }));
  let auto;
  const restart = () => { clearInterval(auto); auto = setInterval(() => show(cur + 1), 4000); };
  let sx = null;
  track.addEventListener("pointerdown", e => (sx = e.clientX));
  track.addEventListener("pointerup", e => {
    if (sx !== null && Math.abs(e.clientX - sx) > 40) { show(cur + (e.clientX < sx ? 1 : -1)); restart(); }
    sx = null;
  });
  show(0); restart();

  /* ---------- Venue ---------- */
  const q = encodeURIComponent(W.venue.mapQuery || `${W.venue.name} ${W.venue.address}`);
  $("#map").src = `https://www.google.com/maps?q=${q}&output=embed`;
  $("#directions").href = `https://www.google.com/maps/dir/?api=1&destination=${q}`;

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
  function petalBurst(n, x) {
    if (reduceMotion) return;
    for (let i = 0; i < n; i++) {
      const p = document.createElement("div");
      p.className = "petal" + (Math.random() < .35 ? " marigold" : "");
      p.style.left = (x ?? Math.random() * 100) + (x === undefined ? "vw" : "px");
      p.style.setProperty("--drift", (Math.random() * 240 - 120) + "px");
      p.style.setProperty("--spin", (Math.random() * 900 - 450) + "deg");
      p.style.animationDuration = 6 + Math.random() * 6 + "s";
      p.style.animationDelay = Math.random() * 1.5 + "s";
      petals.appendChild(p);
      p.addEventListener("animationend", () => p.remove());
    }
  }

  /* ---------- Scroll reveals, shutters, scrolls ---------- */
  const io = new IntersectionObserver(entries => entries.forEach(en => {
    if (!en.isIntersecting) return;
    const el = en.target;
    if (el.classList.contains("reveal")) el.classList.add("in");
    if (el.hasAttribute("data-open")) el.classList.add("opened");
    if (el.classList.contains("scroll")) el.classList.add("in");
    io.unobserve(el);
  }), { threshold: 0.35 });
  $$(".reveal, [data-open], .scroll").forEach(el => io.observe(el));

  /* ---------- Scratch card ---------- */
  const cv = $("#scratchCanvas"), ctx = cv.getContext("2d");
  let scratched = false;
  function paintScratch() {
    const r = cv.getBoundingClientRect(), dpr = window.devicePixelRatio || 1;
    if (!r.width) return;
    cv.width = r.width * dpr; cv.height = r.height * dpr;
    ctx.scale(dpr, dpr);
    const g = ctx.createLinearGradient(0, 0, r.width, r.height);
    g.addColorStop(0, "#e88a2a"); g.addColorStop(1, "#a8361a");
    ctx.fillStyle = g; ctx.fillRect(0, 0, r.width, r.height);
    ctx.fillStyle = "rgba(255,255,255,.12)";
    for (let x = 10; x < r.width; x += 22) for (let y = 10; y < r.height; y += 22) { ctx.beginPath(); ctx.arc(x, y, 2, 0, 7); ctx.fill(); }
    ctx.fillStyle = "#fff3cf"; ctx.textAlign = "center";
    ctx.font = "600 15px Cinzel, serif";
    ctx.fillText("✦  SCRATCH HERE  ✦", r.width / 2, r.height / 2 + 5);
  }
  function scratchAt(e) {
    const r = cv.getBoundingClientRect();
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath(); ctx.arc(e.clientX - r.left, e.clientY - r.top, 24, 0, 7); ctx.fill();
    ctx.globalCompositeOperation = "source-over";
  }
  function clearedRatio() {
    const d = ctx.getImageData(0, 0, cv.width, cv.height).data;
    let clear = 0, total = 0;
    for (let i = 3; i < d.length; i += 4 * 40) { total++; if (d[i] === 0) clear++; }
    return clear / total;
  }
  let drawing = false, moves = 0;
  cv.addEventListener("pointerdown", e => { drawing = true; cv.setPointerCapture(e.pointerId); scratchAt(e); });
  cv.addEventListener("pointermove", e => {
    if (!drawing || scratched) return;
    scratchAt(e);
    if (++moves % 12 === 0 && clearedRatio() > 0.45) {
      scratched = true; cv.classList.add("done");
      const r = cv.getBoundingClientRect();
      for (let i = 0; i < 4; i++) petalBurst(8, r.left + Math.random() * r.width);
    }
  });
  ["pointerup", "pointercancel"].forEach(t => cv.addEventListener(t, () => (drawing = false)));
  document.fonts.ready.then(paintScratch);
  addEventListener("resize", () => { if (!scratched) paintScratch(); });

  /* ---------- WhatsApp: RSVP + wishes ---------- */
  const wa = text => window.open(`https://wa.me/${W.whatsapp}?text=${encodeURIComponent(text)}`, "_blank");
  $("#rsvpForm").addEventListener("submit", e => {
    e.preventDefault();
    const f = new FormData(e.target);
    wa(`RSVP for ${W.groom} & ${W.bride}'s wedding\nName: ${f.get("name")}\nGuests: ${f.get("guests")}\nResponse: ${f.get("attending")}`);
  });
  const esc = s => s.replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const wishHtml = w => `<div class="wish">“${esc(w.text)}”<small>— ${esc(w.from)}</small></div>`;
  $("#wishList").innerHTML = W.wishes.map(wishHtml).join("");
  $("#wishForm").addEventListener("submit", e => {
    e.preventDefault();
    const f = new FormData(e.target);
    const w = { from: f.get("from"), text: f.get("text") };
    $("#wishList").insertAdjacentHTML("afterbegin", wishHtml(w));
    wa(`A wish for ${W.groom} & ${W.bride} 💐\n"${w.text}"\n— ${w.from}`);
    e.target.reset();
  });

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
    $("#flash").classList.add("on");
    if (W.music) audio.play().then(() => musicBtn.classList.add("playing")).catch(() => {});
    const t = reduceMotion ? 0 : 1;
    setTimeout(() => {
      scrollTo(0, 0);
      document.body.classList.remove("locked");
      $("#hero").classList.add("play");
      paintScratch();
    }, 1800 * t);
    setTimeout(() => {
      gate.remove();
      document.body.classList.add("opened");
      petalBurst(30);
      setInterval(() => petalBurst(2), 3000);
    }, 3400 * t);
  }
  gate.addEventListener("click", openGate);
  gate.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openGate(); } });
})();

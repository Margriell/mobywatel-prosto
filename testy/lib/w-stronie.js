/* Narzędzia wstrzykiwane do strony aplikacji (window.__T).
   Sprawdzają ekran tak, jak zasady w SPECYFIKACJA.md („Kontrola”):
   tekst min. 16 px, kontrast tekstu min. 4,5:1 (ikony min. 3:1), cele dotykowe min. 48 px,
   nic się nie nakłada i nie wychodzi poza ekran, dolny pasek na samym dole, pasek „Wstecz” przyklejony. */
module.exports = function wstrzyknij() {
  if (window.__T) return true;
  const T = {};
  /* ---------- Kolory i kontrast ---------- */
  function rgba(s) { const m = String(s).match(/[\d.]+/g); if (!m) return [0, 0, 0, 0]; return [+m[0] / 255, +m[1] / 255, +m[2] / 255, m[3] === undefined ? 1 : +m[3]]; }
  function hex(h) { h = String(h).trim().replace('#', ''); if (h.length === 3) h = h.split('').map((c) => c + c).join(''); return [0, 2, 4].map((i) => parseInt(h.substr(i, 2), 16) / 255); }
  function nad(gora, dol) { const a = gora[3]; return [0, 1, 2].map((i) => gora[i] * a + dol[i] * (1 - a)); }
  function lin(c) { return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }
  function L(c) { return 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2]); }
  function kontrast(a, b) { const x = L(a), y = L(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); }
  T.kontrast = kontrast;
  /* Tło pod elementem. Na karcie dokumentu bierzemy najgorszy (najjaśniejszy) punkt:
     jasny koniec gradientu + skrzyżowanie 2 jasnych linii wzoru + szczyt błysku. */
  function tlo(el) {
    const warstwy = []; let baza = null, e = el;
    while (e && e.nodeType === 1) {
      const cs = getComputedStyle(e);
      if (e.classList.contains('karta') && cs.backgroundImage !== 'none') {
        const k = [...e.classList].find((c) => c.startsWith('k-')).slice(2);
        let c = hex(getComputedStyle(document.documentElement).getPropertyValue('--' + k + '-jasny'));
        c = nad([1, 1, 1, 1 - Math.pow(1 - 0.06, 2)], c); c = nad([1, 1, 1, 0.07], c);
        baza = c; break;
      }
      const b = rgba(cs.backgroundColor);
      if (b[3] > 0) { if (b[3] >= 1) { baza = b.slice(0, 3); break; } warstwy.push(b); }
      e = e.parentElement;
    }
    if (!baza) baza = rgba(getComputedStyle(document.body).backgroundColor).slice(0, 3);
    for (let i = warstwy.length - 1; i >= 0; i--) baza = nad(warstwy[i], baza);
    return baza;
  }
  T.tlo = tlo;
  function widoczny(el) {
    if (!el.isConnected) return false;
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return false;
    if (el.closest('[hidden], .ukryte')) return false;
    if (el.closest('[inert]') && !el.closest('.podglad')) return false;
    /* Treść zwiniętego „Twoje dodatkowe dane” jest schowana (widać tylko nagłówek) */
    const zwiniete = el.closest('details:not([open])');
    if (zwiniete && !el.closest('summary')) return false;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none') return false;
    let e = el; while (e && e.nodeType === 1) { if (+getComputedStyle(e).opacity < 0.05) return false; e = e.parentElement; }
    const okno = document.querySelector('dialog[open]');
    if (okno && !okno.contains(el)) return false; /* pod otwartym oknem nic nie sprawdzamy */
    return true;
  }
  T.widoczny = widoczny;
  function opis(el) {
    const t = (el.getAttribute && (el.getAttribute('aria-label') || '')) || '';
    return (el.tagName || '').toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).join('.') : '') +
      ' „' + (t || (el.textContent || el.value || el.placeholder || '').replace(/\s+/g, ' ').trim()).slice(0, 40) + '”';
  }
  T.opis = opis;
  function maTekst(el) { return [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()); }
  /* Ekran telefonu: w ramce — prostokąt .ekran, bez ramki — okno przeglądarki */
  function ekranRect() {
    const e = document.querySelector('.ekran').getBoundingClientRect();
    return { left: Math.max(e.left, 0), right: Math.min(e.right, innerWidth), top: Math.max(e.top, 0), bottom: Math.min(e.bottom, innerHeight) };
  }
  T.ekranRect = ekranRect;
  function kontenerPrzewijania() {
    const t = document.getElementById('tresc');
    return getComputedStyle(t).overflowY === 'auto' ? t : null;
  }
  T.klikalneSelektor = 'a[href], button, input:not([type="hidden"]), select, textarea, summary, [role="button"], [role="switch"]';
  function celDotyku(el) {
    /* Pole wyboru w etykiecie: celem jest cała etykieta */
    if (el.matches('input[type="checkbox"], input[type="radio"]') && el.closest('label')) return el.closest('label');
    if (el.matches('.pole input')) return el.closest('.pole');
    return el;
  }

  /* ---------- Sprawdzenie jednego ekranu ---------- */
  T.sprawdz = function (o) {
    o = o || {};
    const bledy = [], st = { minTekst: 99, minKontrast: 99, gdzieKontrast: '', minIkona: 99, gdzieIkona: '', minCel: 999, gdzieCel: '', teksty: 0, cele: 0 };
    const E = ekranRect();
    const okno = document.querySelector('dialog[open]');
    const wszystkie = [...document.querySelectorAll('body *')];
    /* 1. Tekst i kontrast */
    for (const el of wszystkie) {
      if (el.closest('svg') || el.tagName === 'SCRIPT' || el.tagName === 'STYLE' || el.tagName === 'NOSCRIPT') continue;
      const pole = el.matches('input[type="text"], input:not([type]), textarea');
      if (!pole && !maTekst(el)) continue;
      if (!widoczny(el)) continue;
      const cs = getComputedStyle(el);
      const fs = parseFloat(cs.fontSize);
      st.teksty++;
      st.minTekst = Math.min(st.minTekst, fs);
      if (fs < 15.9) bledy.push('tekst ' + fs + ' px: ' + opis(el));
      const b = tlo(el);
      let kolor = rgba(cs.color);
      if (pole && !el.value) kolor = rgba(getComputedStyle(el, '::placeholder').color);
      const k = kontrast(nad(kolor, b), b);
      if (k < st.minKontrast) { st.minKontrast = k; st.gdzieKontrast = opis(el); }
      if (k < 4.5) bledy.push('kontrast ' + k.toFixed(2) + ':1: ' + opis(el));
    }
    /* 2. Ikony (min. 3:1) */
    for (const s of document.querySelectorAll('svg')) {
      if (!widoczny(s) || s.classList.contains('portret') || s.classList.contains('sylwetka') || s.classList.contains('kod-paski') || s.closest('.status')) continue;
      const cs = getComputedStyle(s);
      if (cs.stroke === 'none' && cs.fill === 'none') continue;
      const b = tlo(s.parentElement);
      const k = kontrast(nad(rgba(cs.color), b), b);
      if (k < st.minIkona) { st.minIkona = k; st.gdzieIkona = opis(s.parentElement); }
      if (k < 3) bledy.push('ikona kontrast ' + k.toFixed(2) + ':1 w ' + opis(s.parentElement));
    }
    /* 3. Cele dotykowe min. 48 × 48 px */
    for (const el of document.querySelectorAll(T.klikalneSelektor)) {
      if (!widoczny(el) || el.closest('.podglad')) continue;
      if (el.disabled && !el.matches('.btn-przesun')) continue;
      const c = celDotyku(el);
      const r = c.getBoundingClientRect();
      let h = r.height;
      if (el.matches('.karta.tyl > button')) { const nast = el.parentElement.nextElementSibling; if (nast) h = nast.getBoundingClientRect().top - r.top; }
      st.cele++;
      const m = Math.min(r.width, h);
      if (m < st.minCel) { st.minCel = m; st.gdzieCel = opis(el); }
      if (r.width < 47.5 || h < 47.5) bledy.push('cel ' + Math.round(r.width) + '×' + Math.round(h) + ' px: ' + opis(el));
    }
    /* 4. Nic nie wychodzi poza ekran (w poziomie) */
    const szer = document.documentElement.scrollWidth;
    if (szer > innerWidth + 1) bledy.push('strona szersza niż ekran: ' + szer + ' > ' + innerWidth);
    const tresc = document.getElementById('tresc');
    if (tresc.scrollWidth > tresc.clientWidth + 1) bledy.push('treść przewija się w bok: ' + tresc.scrollWidth + ' > ' + tresc.clientWidth);
    const ekranEl = document.querySelector('.ekran');
    for (const el of wszystkie) {
      if (!widoczny(el) || el.closest('svg') && el.tagName !== 'svg') continue;
      if (el.contains(ekranEl)) continue; /* ramka telefonu jest większa niż ekran aplikacji */
      const r = el.getBoundingClientRect();
      const L0 = okno && okno.contains(el) ? 0 : E.left, R0 = okno && okno.contains(el) ? innerWidth : E.right;
      if (r.right > R0 + 1 || r.left < L0 - 1) { bledy.push('wychodzi poza ekran (' + Math.round(r.left) + '–' + Math.round(r.right) + '): ' + opis(el)); }
    }
    /* 5. Dolny pasek: na samym dole ekranu, w jednym rzędzie */
    const nav = document.getElementById('nawigacja');
    if (nav && !nav.hidden && o.pasekNaDole !== false) {
      const r = nav.getBoundingClientRect();
      const dol = kontenerPrzewijania() ? document.querySelector('.ekran').getBoundingClientRect().bottom : innerHeight;
      if (Math.abs(r.bottom - dol) > 1.5) bledy.push('dolny pasek nie jest na dole ekranu (' + Math.round(r.bottom) + ' zamiast ' + Math.round(dol) + ')');
      const gory = [...nav.querySelectorAll('a')].map((a) => Math.round(a.getBoundingClientRect().top));
      if (Math.max(...gory) - Math.min(...gory) > 1) bledy.push('dolny pasek nie mieści się w jednym rzędzie');
    }
    /* 6. Karty dokumentów: treść w karcie, pasek bez nakładania, jeden układ statusu */
    for (const karta of document.querySelectorAll('.karta')) {
      if (!widoczny(karta)) continue;
      const kr = karta.getBoundingClientRect();
      for (const el of karta.querySelectorAll('*')) {
        if (!widoczny(el) || el.closest('svg') && el.tagName !== 'svg') continue;
        const r = el.getBoundingClientRect();
        if (r.right > kr.right + 0.5 || r.left < kr.left - 0.5) bledy.push('wychodzi poza kartę: ' + opis(el));
      }
      const g = karta.querySelector('.karta-gora');
      if (!g || karta.classList.contains('mala')) continue;
      const n = g.querySelector('.karta-nazwa').getBoundingClientRect(), s = g.querySelector('.karta-status').getBoundingClientRect(), i = g.querySelector('.karta-ikona').getBoundingClientRect();
      const nach = (a, b) => a.left < b.right - 0.5 && b.left < a.right - 0.5 && a.top < b.bottom - 0.5 && b.top < a.bottom - 0.5;
      if (nach(n, s) || nach(n, i) || nach(s, i)) bledy.push('nakładanie w pasku karty ' + karta.dataset.id);
      const uklad = s.top >= n.bottom - 2 ? 'pod nazwą' : (s.left >= n.right - 1 ? 'po prawej' : 'inaczej');
      const oczek = document.documentElement.dataset.tekst === 'standardowy' ? 'po prawej' : 'pod nazwą';
      if (uklad !== oczek) bledy.push('status ' + uklad + ' (oczekiwano: ' + oczek + ') na karcie ' + karta.dataset.id);
    }
    return { bledy, st };
  };

  /* Nakładanie: każdy widoczny tekst musi być „na wierzchu” (nie przykryty innym elementem).
     Sprawdzamy kolejne fragmenty ekranu, przewijając treść. */
  T.nakladanie = async function () {
    const bledy = [];
    const kont = kontenerPrzewijania();
    const okno = document.querySelector('dialog[open]');
    const czekajKlatke = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    const zakres = () => {
      const E = ekranRect();
      let gora = kont ? kont.getBoundingClientRect().top : E.top, dol = kont ? kont.getBoundingClientRect().bottom : E.bottom;
      const naglowek = document.querySelector('.naglowek-pod');
      if (naglowek) gora = Math.max(gora, naglowek.getBoundingClientRect().bottom);
      if (!kont) { const nav = document.getElementById('nawigacja'); if (nav && !nav.hidden) dol = Math.min(dol, nav.getBoundingClientRect().top); }
      return { gora, dol, lewo: E.left, prawo: E.right };
    };
    const sprawdzone = new Set();
    const przewin = (y) => { if (kont) kont.scrollTop = y; else window.scrollTo(0, y); };
    const wys = kont ? kont.scrollHeight - kont.clientHeight : document.documentElement.scrollHeight - innerHeight;
    const krok = Math.max(80, (kont ? kont.clientHeight : innerHeight) * 0.6);
    const pozycje = [];
    for (let y = 0; y < wys; y += krok) pozycje.push(y);
    pozycje.push(Math.max(0, wys));
    const elementy = [...document.querySelectorAll('body *')].filter((el) => !el.closest('svg') && (maTekst(el) || el.matches('button, a[href], input[type="text"]')) && widoczny(el) && (!okno || okno.contains(el)));
    for (const y of okno ? [null] : pozycje) {
      if (y !== null) { przewin(y); await czekajKlatke(); }
      const z = okno ? { gora: 0, dol: innerHeight, lewo: 0, prawo: innerWidth } : zakres();
      for (const el of elementy) {
        if (sprawdzone.has(el)) continue;
        /* Tekst w kilku liniach: sprawdzamy pierwszą linię */
        const r = el.getClientRects()[0] || el.getBoundingClientRect();
        const x = r.left + Math.min(r.width / 2, 40), yy = r.top + Math.min(r.height / 2, 12);
        if (yy < z.gora + 1 || yy > z.dol - 1 || x < z.lewo || x > z.prawo) continue;
        if (el.closest('.naglowek-pod') || el.closest('#asystent-pasek') || el.closest('#nawigacja')) {
          /* elementy przyklejone sprawdzamy w ich własnym miejscu */
        }
        sprawdzone.add(el);
        const trafiony = document.elementFromPoint(x, yy);
        if (!trafiony) continue;
        if (trafiony === el || el.contains(trafiony) || trafiony.contains(el)) continue;
        /* Tekst w ramce telefonu pod przyklejonym paskiem, albo w portfelu za kartą z przodu — tylko gdy to nie jest pasek karty */
        bledy.push('przykryty tekst: ' + opis(el) + ' (na wierzchu: ' + opis(trafiony) + ')');
      }
    }
    przewin(0);
    await czekajKlatke();
    return bledy;
  };

  /* Pasek „Wstecz” zostaje u góry po przewinięciu */
  T.pasekPrzyklejony = async function () {
    const p = document.querySelector('.naglowek-pod');
    if (!p) return null;
    const kont = kontenerPrzewijania();
    const max = kont ? kont.scrollHeight - kont.clientHeight : document.documentElement.scrollHeight - innerHeight;
    if (max < 40) return null;
    if (kont) kont.scrollTop = max; else window.scrollTo(0, max);
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    const gora = kont ? kont.getBoundingClientRect().top : 0;
    const ok = Math.abs(p.getBoundingClientRect().top - gora) < 1.5;
    if (kont) kont.scrollTop = 0; else window.scrollTo(0, 0);
    return ok;
  };

  /* Elementy klikalne na ekranie (z numerem, żeby test mógł w nie trafić) */
  T.klikalne = function () {
    const lista = [];
    let n = 0;
    for (const el of document.querySelectorAll(T.klikalneSelektor + ', label.opcja')) {
      if (!widoczny(el) || el.closest('.podglad') || el.disabled) continue;
      if (el.matches('input[type="checkbox"], input[type="radio"]') && el.closest('label')) continue;
      el.setAttribute('data-t', ++n);
      const r = el.getBoundingClientRect();
      lista.push({ nr: n, opis: opis(el), href: el.getAttribute('href') || '', akcja: el.getAttribute('data-akcja') || '', tag: el.tagName.toLowerCase(), x: r.left + r.width / 2, y: r.top + r.height / 2 });
    }
    return lista;
  };
  /* Wygląd elementu i jego wnętrza (do porównania przed i po najechaniu / dotknięciu) */
  T.wyglad = function (sel) {
    const el = document.querySelector(sel);
    if (!el) return null;
    const cechy = ['background-color', 'background-image', 'color', 'border-top-color', 'border-bottom-color', 'border-left-color', 'border-top-width',
      'text-decoration-line', 'filter', 'transform', 'box-shadow', 'opacity', 'outline-style', 'font-weight', 'cursor'];
    return [el, ...el.querySelectorAll('*')].map((e) => { const cs = getComputedStyle(e); return cechy.map((c) => c + ':' + cs.getPropertyValue(c)).join(';'); }).join('\n');
  };
  /* Widoczne teksty ekranu (do sprawdzania języka) */
  T.teksty = function () {
    const t = [];
    for (const el of document.querySelectorAll('body *')) {
      if (el.closest('svg, script, style, noscript')) continue;
      if (!maTekst(el)) continue;
      if (!el.closest('.ukryte') && !widoczny(el)) continue;
      t.push([...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join(' ').replace(/\s+/g, ' ').trim());
    }
    for (const el of document.querySelectorAll('[aria-label], [placeholder]')) {
      if (el.getAttribute('aria-label')) t.push(el.getAttribute('aria-label'));
      if (el.getAttribute('placeholder')) t.push(el.getAttribute('placeholder'));
    }
    return t.filter(Boolean);
  };
  window.__T = T;
  return true;
};

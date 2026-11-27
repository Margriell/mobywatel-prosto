/* CZĘŚĆ 0 — zachowanie jak na telefonie.
   Nic nie reaguje na samo najechanie myszką; w chwili dotknięcia (:active) jest informacja zwrotna;
   bez niebieskiego mignięcia Androida; kursor „rączka”; widoczny fokus z klawiatury zostaje. */
'use strict';
const fs = require('fs');
const path = require('path');
const { otworz } = require('../lib/aplikacja');
const { trasa } = require('../lib/ekrany');
const { czekaj } = require('../lib/przegladarka');

const NAZWA = 'Część 0 — dotyk jak na telefonie';
const NEUTRALNY = { x: 3, y: 3 };

async function mysz(s, typ, p, przycisk) {
  await s.wyslij('Input.dispatchMouseEvent', Object.assign({ type: typ, x: p.x, y: p.y }, przycisk ? { button: 'left', clickCount: 1 } : {}));
}

module.exports = {
  nazwa: NAZWA,
  async uruchom(ctx) {
    /* 1. Kod: żadnej reguły :hover w stylach i żadnego nasłuchiwania najechania w skryptach */
    const css = fs.readFileSync(path.join(ctx.katalog, 'style.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
    const hoverCss = (css.match(/[^{}]*:hover[^{]*\{/g) || []).map((x) => x.trim());
    ctx.wynik(NAZWA, 'style.css nie ma reguł :hover', !hoverCss.length, hoverCss.join(' · ') || 'brak reguł :hover', 'poważny');
    for (const plik of ['app.js', 'asystent.js', 'index.html']) {
      const t = fs.readFileSync(path.join(ctx.katalog, plik), 'utf8');
      const m = t.match(/mouseover|mouseenter|mouseleave|mouseout|pointerenter|pointerover|:hover/g) || [];
      ctx.wynik(NAZWA, plik + ': brak reakcji na najechanie myszką', !m.length, m.join(', ') || 'brak', 'poważny');
    }
    const s = await ctx.przegladarka.nowaStrona({ szer: 390, wys: 844 });
    /* 2. W przeglądarce: reguły stylów (także z @media) */
    await otworz(s, ctx.baza, { osoba: 'tomasz' });
    const reguly = await s.js(() => {
      const zle = [], aktywne = [];
      const przejdz = (lista) => { for (const r of lista) { if (r.cssRules) przejdz(r.cssRules); if (r.selectorText) { if (/:hover/.test(r.selectorText)) zle.push(r.selectorText); if (/:active/.test(r.selectorText)) aktywne.push(r.selectorText); } } };
      for (const a of document.styleSheets) { try { przejdz(a.cssRules); } catch (e) { /* arkusz z innej domeny (czcionka) */ } }
      return { zle, aktywne: aktywne.length };
    });
    ctx.wynik(NAZWA, 'Załadowane style: brak :hover', !reguly.zle.length, reguly.zle.join(' · ') || 'brak', 'poważny');
    ctx.wynik(NAZWA, 'Załadowane style: są reguły :active (informacja zwrotna przy dotknięciu)', reguly.aktywne >= 5, reguly.aktywne + ' reguł :active', 'poważny');
    const mignięcie = await s.js(() => getComputedStyle(document.documentElement).webkitTapHighlightColor);
    ctx.wynik(NAZWA, 'Bez niebieskiego mignięcia przy dotknięciu (Android)', /rgba\(0, 0, 0, 0\)|transparent/.test(mignięcie), 'html: ' + mignięcie, 'poważny');

    /* 3. Prawdziwa mysz: najechanie i wciśnięcie każdego elementu klikalnego na każdym ekranie */
    const zestawy = [['tomasz', 'jasny', null], ['ola', 'ciemny', null], ['halina', 'kontrast', 12]];
    let ileElementow = 0, ileEkranow = 0;
    const reaguja = [], bezDotyku = [], bezRaczki = [], bezMigniecia = [];
    for (const [osoba, motyw, limit] of zestawy) {
      await otworz(s, ctx.baza, { osoba, motyw, tekst: 'standardowy', prosty: false });
      const kroki = trasa(osoba);
      for (const k of (limit ? kroki.slice(0, limit) : kroki)) {
        try { await k.krok(s); } catch (e) { ctx.wynik(NAZWA, 'Przygotowanie ekranu: ' + k.nazwa, false, e.message, 'drobny'); continue; }
        await s.js(require('../lib/w-stronie'));
        /* Czekamy, aż płynne przewijanie (np. do nowej odpowiedzi asystenta) się skończy */
        for (let i = 0, poprz = -1; i < 20; i++) { const y = await s.js(`document.getElementById('tresc').scrollTop`); if (y === poprz) break; poprz = y; await czekaj(100); }
        await mysz(s, 'mouseMoved', NEUTRALNY);
        await czekaj(60);
        const lista = await s.js(() => window.__T.klikalne());
        ileEkranow++;
        ctx.ekran();
        for (const el of lista) {
          const sel = '[data-t="' + el.nr + '"]';
          const info = await s.js((sel) => { const e = document.querySelector(sel); if (!e) return null; e.scrollIntoView({ block: 'nearest' }); const r = e.getBoundingClientRect(); const cs = getComputedStyle(e);
            return { x: r.left + r.width / 2, y: r.top + Math.min(r.height / 2, 20), kursor: cs.cursor, mig: cs.webkitTapHighlightColor, pole: e.matches('input[type="text"], input:not([type])') }; }, sel);
          if (!info) continue;
          const top = await s.js((p, sel) => { const t = document.elementFromPoint(p.x, p.y); const e = document.querySelector(sel); return !!(t && e && (t === e || e.contains(t))); }, info, sel);
          if (!top) continue; /* element przykryty (np. za kartą) — nie da się w niego najechać */
          ileElementow++;
          const przed = await s.js((sel) => window.__T.wyglad(sel), sel);
          await mysz(s, 'mouseMoved', info);
          await czekaj(110);
          const po = await s.js((sel) => window.__T.wyglad(sel), sel);
          if (po !== przed) reaguja.push(k.nazwa + ' / ' + motyw + ': ' + el.opis);
          if (!info.pole) {
            await mysz(s, 'mousePressed', info, true);
            await czekaj(110);
            const wcisniety = await s.js((sel) => window.__T.wyglad(sel), sel);
            await mysz(s, 'mouseMoved', NEUTRALNY);
            await mysz(s, 'mouseReleased', NEUTRALNY, true);
            if (wcisniety === po) bezDotyku.push(k.nazwa + ': ' + el.opis);
            if (info.kursor !== 'pointer') bezRaczki.push(k.nazwa + ': ' + el.opis + ' (' + info.kursor + ')');
          } else {
            await mysz(s, 'mouseMoved', NEUTRALNY);
          }
          if (!/rgba\(0, 0, 0, 0\)|transparent/.test(info.mig)) bezMigniecia.push(k.nazwa + ': ' + el.opis);
          await czekaj(30);
        }
        /* Okno albo przewinięta treść nie mogą zostać po teście */
        await s.js(`(() => { const t = document.getElementById('tresc'); t.scrollTop = 0; return true; })()`);
      }
    }
    ctx.stat.inne['Część 0: sprawdzone elementy klikalne (najechanie i wciśnięcie)'] = ileElementow + ' na ' + ileEkranow + ' ekranach';
    ctx.wynik(NAZWA, 'Najechanie myszką niczego nie zmienia (' + ileElementow + ' elementów, ' + ileEkranow + ' ekranów, 3 motywy)', !reaguja.length, reaguja.slice(0, 15).join(' · ') || 'żaden element nie reaguje', 'poważny');
    ctx.wynik(NAZWA, 'Wciśnięcie daje informację zwrotną (:active)', !bezDotyku.length, bezDotyku.slice(0, 15).join(' · ') + (bezDotyku.length > 15 ? ' … (' + bezDotyku.length + ')' : '') || 'każdy element reaguje na wciśnięcie', 'drobny');
    ctx.wynik(NAZWA, 'Kursor „rączka” nad elementami klikalnymi', !bezRaczki.length, bezRaczki.slice(0, 10).join(' · ') || 'wszędzie rączka', 'drobny');
    ctx.wynik(NAZWA, 'Bez mignięcia przy dotknięciu na każdym elemencie', !bezMigniecia.length, bezMigniecia.slice(0, 10).join(' · ') || 'wszędzie przezroczyste', 'drobny');

    /* 4. Fokus z klawiatury nadal widoczny */
    await otworz(s, ctx.baza, { osoba: 'tomasz', motyw: 'jasny' });
    await s.klawisz('Tab');
    const fokus = await s.js(() => { const e = document.activeElement; const cs = getComputedStyle(e); return { el: window.__T ? window.__T.opis(e) : e.tagName, outline: cs.outlineStyle + ' ' + cs.outlineWidth, fv: e.matches(':focus-visible') }; });
    ctx.wynik(NAZWA, 'Fokus z klawiatury widoczny (:focus-visible)', fokus.fv && !/none/.test(fokus.outline), fokus.el + ': obramowanie ' + fokus.outline, 'krytyczny');
    ctx.konsola(s, NAZWA);
    await s.zamknij();
  }
};

/* Wariant B3 — „Mozaika”: ciepłe, miodowe kolory i kafle różnej wielkości.
   Paleta: miodowe tło + pastelowe kafle (miód, błękit, lawenda, piasek) + granat.
   Układ: powitanie z datą → sprawa pilna jako baner → karta asystenta z dużym „Powiedz” → mozaika kafli.
   Kształty: duże zaokrąglenia (28 px), kafle różnej wysokości i szerokości. */
(function () {
  'use strict';
  window.WARIANTY = window.WARIANTY || {};
  var dzis = '';
  try { dzis = new Date().toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long' }); } catch (e) {}
  window.WARIANTY.b3 = {
    nazwa: 'B3 — Mozaika',
    css: [
      ':host{--tlo:#FFF7E8;--ramka:#7A6A4F;--miod:#FFE3A3;--blekit:#D9E8FB;--lawenda:#E9E1FA;--piasek:#F2E3D0;--okno-zaokraglenie:28px;--przycisk-zaokraglenie:16px;--pasek-tlo:#FFFDF8}',
      'main{padding:0 1rem 1.5rem}',
      '.naglowek{display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;padding:.5rem 0}',
      '.marka{display:flex;align-items:center;gap:.5rem;font-weight:700;color:var(--granat);font-size:max(16px,.8rem)}',
      '.przycisk-miodowy{display:inline-flex;align-items:center;gap:.4rem;padding:.25rem .8rem;background:var(--miod);color:#1A1F27;border:2px solid var(--ramka);border-radius:16px;font-weight:700;font-size:max(16px,.8rem)}',
      'h1{font-size:1.45rem;line-height:1.2;margin-top:.35rem}',
      '.data{color:#5A4A2F;margin-top:.15rem;font-size:max(16px,.8rem)}',
      '.pilne{display:flex;margin-top:.9rem;background:#fff;border:2px solid var(--czerwien);border-radius:28px;overflow:hidden}',
      '.pilne-pas{flex:none;display:grid;place-items:center;width:2.6rem;background:var(--czerwien);color:#fff}',
      '.pilne-tresc{flex:1;min-width:0;display:grid;gap:.45rem;padding:.8rem .9rem}',
      '.pilne h2{font-size:max(16px,.8rem);line-height:1.3;color:var(--czerwien);text-transform:none}',
      '.pilne-tekst{font-weight:700;line-height:1.35}',
      '.przycisk-glowny{display:flex;align-items:center;justify-content:center;gap:.4rem;width:100%;min-height:56px;padding:.25rem 1rem;background:var(--granat);color:#fff;border:2px solid var(--granat);border-radius:16px;font-weight:700}',
      '.asystent{margin-top:1rem;background:#fff;border:2px solid var(--ramka);border-radius:28px;padding:.85rem}',
      '.asystent label{display:flex;align-items:center;gap:.4rem;font-weight:700;margin-bottom:.45rem;line-height:1.3}',
      '.asystent label .ikona{color:var(--granat)}',
      '.rzad{display:flex;flex-wrap:wrap;gap:8px}',
      '.pole{flex:1 1 7rem;min-width:0;min-height:56px;padding:.5rem .8rem;background:#FFFDF8;border:2px solid var(--ramka);border-radius:16px}',
      '.wyslij{flex:1 0 auto;justify-content:center;display:inline-flex;align-items:center;gap:.35rem;padding:.25rem .8rem;background:var(--granat);color:#fff;border:2px solid var(--granat);border-radius:16px;font-weight:700}',
      '.powiedz{display:flex;align-items:center;justify-content:center;gap:.6rem;width:100%;min-height:56px;margin-top:8px;padding:.25rem 1rem;background:#fff;color:var(--granat);border:2px solid var(--granat);border-radius:999px;font-weight:700}',
      '.powiedz .kolko{display:grid;place-items:center;width:2.4rem;height:2.4rem;border-radius:50%;background:var(--granat);color:#fff}',
      '.pytania-tytul{margin-top:.75rem;color:#5A4A2F}',
      '.pytania{display:grid;gap:8px;margin-top:.35rem}',
      '.pytanie{width:100%;display:flex;align-items:center;gap:.5rem;min-height:48px;padding:.25rem .8rem;background:var(--miod);color:#1A1F27;border:2px solid var(--miod);border-radius:16px;text-align:left}',
      '.pytanie:hover{border-color:var(--ramka)}',
      'section.sprawy{margin-top:1.5rem}',
      '.sprawy h2{font-size:1.2rem;line-height:1.3;margin-bottom:.6rem}',
      '.mozaika{display:grid;gap:.7rem;grid-auto-flow:dense;grid-template-columns:repeat(auto-fit,minmax(min(100%,7.25rem),1fr))}',
      '.mozaika li:first-child{grid-row:span 2}',
      '.mozaika li:last-child{grid-column:1/-1}',
      '.kafel{width:100%;height:100%;min-height:6rem;display:flex;flex-direction:column;align-items:flex-start;justify-content:space-between;gap:.5rem;padding:.85rem;border:2px solid var(--ramka);border-radius:28px;text-align:left;font-weight:700;line-height:1.3;overflow-wrap:break-word;color:#1A1F27}',
      '.kafel-ikona{display:grid;place-items:center;width:2.6rem;height:2.6rem;border-radius:50%;background:rgba(255,255,255,.8);color:var(--granat)}',
      '.kafel:hover{border-color:var(--granat)}',
      '.k1{background:var(--miod)}.k2{background:var(--blekit)}.k3{background:var(--lawenda)}.k4{background:var(--piasek)}.k5{background:var(--blekit)}',
      '.k1 .kafel-ikona{width:3.25rem;height:3.25rem}.k1 .kafel-ikona .ikona{width:1.9rem;height:1.9rem}',
      '.k6{flex-direction:row;align-items:center;justify-content:flex-start;min-height:4rem;background:var(--granat);color:#fff;border-color:var(--granat)}',
      '.k6 .kafel-ikona{background:#fff}',
      '.k6 .dalej{margin-left:auto}',
      '.pasek-dolny{border-top:2px solid #EADDC4}',
      '.pasek-dolny button[aria-current="page"] .pasek-ikona{background:var(--miod)}',
      '.pasek-dolny button[aria-current="page"] .pasek-podpis{border-bottom:3px solid var(--granat)}'
    ].join('\n'),
    html: function (d, ikona, znak) {
      return '<div class="telefon"><main>' +
        '<header class="naglowek">' +
          '<div class="marka">' + znak('#123A6B', '#FFE3A3') + '<span>mObywatel</span></div>' +
          '<button type="button" class="przycisk-miodowy" data-cel="Ustawienia">' + ikona('ustawienia') + '<span>Ustawienia</span></button>' +
        '</header>' +
        '<h1>Dzień dobry, ' + d.wolacz + '</h1>' +
        (dzis ? '<p class="data">Dziś jest ' + dzis + '</p>' : '') +
        '<section class="pilne" aria-labelledby="h-uwaga-b3">' +
          '<span class="pilne-pas">' + ikona(d.pilne.ikona) + '</span>' +
          '<div class="pilne-tresc">' +
            '<h2 id="h-uwaga-b3">Wymaga Twojej uwagi: ' + d.pilne.etykieta.toLowerCase() + '</h2>' +
            '<p class="pilne-tekst">' + d.pilne.tekst + '</p>' +
            '<button type="button" class="przycisk-glowny" data-cel="' + d.pilne.cel + '"><span>' + d.pilne.przycisk + '</span>' + ikona('dalej') + '</button>' +
          '</div>' +
        '</section>' +
        '<form class="asystent" aria-label="Asystent">' +
          '<label for="pole-b3">' + ikona('iskry') + '<span>' + d.poleEtykieta + '</span></label>' +
          '<div class="rzad">' +
            '<input id="pole-b3" class="pole" type="text" autocomplete="off">' +
            '<button type="submit" class="wyslij">' + ikona('wyslij') + '<span>Wyślij</span></button>' +
          '</div>' +
          '<button type="button" class="powiedz" data-opis="' + d.mikrofonOpis + '"><span class="kolko">' + ikona('mikrofon') + '</span><span>Powiedz zamiast pisać</span></button>' +
          '<p class="pytania-tytul" id="h-pyt-b3">Na przykład:</p>' +
          '<ul class="pytania" aria-labelledby="h-pyt-b3">' + d.podpowiedzi.map(function (p) {
            return '<li><button type="button" class="pytanie" data-cel="asystenta z pytaniem „' + p + '”">' + ikona('rozmowa') + '<span>' + p + '</span></button></li>';
          }).join('') + '</ul>' +
        '</form>' +
        '<section class="sprawy" aria-labelledby="h-sprawy-b3"><h2 id="h-sprawy-b3">Najczęstsze sprawy</h2>' +
          '<ul class="mozaika">' + d.sprawy.map(function (s, i) {
            return '<li><button type="button" class="kafel k' + (i + 1) + '" data-cel="' + s.cel + '"><span class="kafel-ikona">' + ikona(s.ikona) + '</span><span>' + s.nazwa + '</span>' +
              (i === 5 ? ikona('dalej', 'dalej') : '') + '</button></li>';
          }).join('') + '</ul>' +
        '</section>' +
      '</main>' + window.Prototyp.pasekDolny() + '</div>';
    }
  };
})();

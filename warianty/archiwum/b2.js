/* Wariant B2 — „Rozmowa”: ekran Start zaczyna się jak rozmowa z asystentem.
   Paleta: biel + chłodny lawendowy (periwinkle) + granat.
   Układ: dymek asystenta z powitaniem → sprawa pilna jako karta w rozmowie → pole do pisania
          → podpowiedzi jak gotowe odpowiedzi → sprawy jako lista w 1 kolumnie.
   Kształty: dymki rozmowy, pigułki, okrągłe przyciski z podpisem. */
(function () {
  'use strict';
  window.WARIANTY = window.WARIANTY || {};
  window.WARIANTY.b2 = {
    nazwa: 'B2 — Rozmowa',
    css: [
      ':host{--tlo:#FFFFFF;--lawenda:#EEF0FB;--lawenda-2:#DDE1F7;--ramka:#6E7391;--okno-zaokraglenie:24px;--przycisk-zaokraglenie:999px}',
      'main{padding:0 1rem 1.5rem}',
      '.naglowek{display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;padding:.5rem 0}',
      '.marka{display:flex;align-items:center;gap:.5rem;font-weight:700;color:var(--granat);font-size:max(16px,.8rem)}',
      '.przycisk-obrys{display:inline-flex;align-items:center;gap:.4rem;padding:.25rem .9rem;background:#fff;color:var(--granat);border:2px solid var(--granat);border-radius:999px;font-weight:700;font-size:max(16px,.8rem)}',
      '.kto{display:flex;align-items:center;gap:.4rem;color:var(--szary);font-size:max(16px,.75rem);margin:0 0 .3rem}',
      '.kto .ikona{width:1.25rem;height:1.25rem;color:var(--granat)}',
      '.dymek{background:var(--lawenda);border-radius:22px 22px 22px 6px;padding:.65rem 1rem}',
      'h1{font-size:1.3rem;line-height:1.25;color:var(--granat)}',
      '.dymek h2{font-size:1rem;font-weight:400;line-height:1.4;margin-top:.25rem}',
      '.pilne{margin-top:.5rem;background:#fff;border:2px solid var(--czerwien);border-radius:22px;padding:.7rem 1rem .8rem;display:grid;gap:.45rem}',
      '.pilne-gora{display:flex;align-items:center;gap:.5rem;color:var(--czerwien);font-weight:700}',
      '.pilne-tekst{font-weight:700;line-height:1.35}',
      '.przycisk-glowny{display:flex;align-items:center;justify-content:center;gap:.4rem;width:100%;min-height:56px;padding:.25rem 1rem;background:var(--granat);color:#fff;border:2px solid var(--granat);border-radius:999px;font-weight:700}',
      '.pisanie{margin-top:.75rem;padding:.6rem .75rem .75rem;border:2px solid var(--ramka);border-radius:24px;background:#fff}',
      '.pisanie label{display:block;font-weight:700;margin-bottom:.4rem}',
      '.pisanie-rzad{display:flex;align-items:flex-end;gap:8px}',
      '.pole{flex:1;min-width:0;min-height:56px;padding:.5rem 1rem;background:var(--lawenda);border:2px solid var(--ramka);border-radius:999px}',
      '.okragly{flex:none;display:flex;flex-direction:column;align-items:center;gap:2px;padding:0;background:none;border:0;color:var(--granat);font-weight:700;font-size:16px;line-height:20px}',
      '.okragly .kolko{display:grid;place-items:center;width:52px;height:52px;border-radius:50%;border:2px solid var(--granat);background:#fff}',
      '.okragly.pelny .kolko{background:var(--granat);color:#fff}',
      '.odpowiedzi-tytul{margin-top:1rem;color:var(--szary)}',
      '.odpowiedzi{display:flex;flex-direction:column;align-items:flex-end;gap:8px;margin-top:.4rem}',
      '.odpowiedz{min-height:48px;padding:.3rem 1rem;background:#fff;color:var(--granat);border:2px solid var(--granat);border-radius:22px 22px 6px 22px;font-weight:700;text-align:right}',
      '.odpowiedz:hover{background:var(--lawenda)}',
      'section.sprawy{margin-top:1.5rem}',
      '.sprawy h2{font-size:1.15rem;line-height:1.3;color:var(--granat);margin-bottom:.6rem}',
      '.wiersze{display:grid;gap:.6rem}',
      '.wiersz{width:100%;display:flex;flex-wrap:wrap;align-items:center;gap:.75rem;min-height:4rem;padding:.5rem .75rem .5rem .5rem;background:var(--lawenda);border:2px solid var(--lawenda);border-radius:999px;text-align:left}',
      '.wiersz:hover{border-color:var(--granat)}',
      '.wiersz-ikona{display:grid;place-items:center;width:2.75rem;height:2.75rem;flex:none;border-radius:50%;background:#fff;color:var(--granat)}',
      '.wiersz-tekst{flex:1 1 6rem;min-width:0;display:grid;line-height:1.3;overflow-wrap:break-word}',
      '.wiersz-nazwa{font-weight:700}',
      '.wiersz-opis{color:var(--szary);font-size:max(16px,.8rem)}',
      '.wiersz>.ikona{color:var(--granat);margin-left:auto}',
      '.pasek-dolny{border-top:2px solid var(--lawenda-2)}',
      '.pasek-dolny button[aria-current="page"] .pasek-ikona{background:var(--lawenda-2)}',
      '.pasek-dolny button[aria-current="page"]::before{content:"";position:absolute;top:-2px;left:22%;right:22%;height:4px;border-radius:0 0 4px 4px;background:var(--granat)}'
    ].join('\n'),
    html: function (d, ikona, znak) {
      return '<div class="telefon"><main>' +
        '<header class="naglowek">' +
          '<div class="marka">' + znak('#123A6B', '#fff') + '<span>mObywatel</span></div>' +
          '<button type="button" class="przycisk-obrys" data-cel="Ustawienia">' + ikona('ustawienia') + '<span>Ustawienia</span></button>' +
        '</header>' +
        '<p class="kto">' + ikona('iskry') + '<span>Asystent · nic nie wyśle bez Twojej zgody</span></p>' +
        '<div class="dymek">' +
          '<h1>Dzień dobry, ' + d.wolacz + '</h1>' +
          '<h2 id="h-uwaga-b2">Wymaga Twojej uwagi:</h2>' +
        '</div>' +
        '<section class="pilne" aria-labelledby="h-uwaga-b2">' +
          '<p class="pilne-gora">' + ikona(d.pilne.ikona) + '<span>' + d.pilne.etykieta + '</span></p>' +
          '<p class="pilne-tekst">' + d.pilne.tekst + '</p>' +
          '<button type="button" class="przycisk-glowny" data-cel="' + d.pilne.cel + '"><span>' + d.pilne.przycisk + '</span>' + ikona('dalej') + '</button>' +
        '</section>' +
        '<form class="pisanie" aria-label="Asystent">' +
          '<label for="pole-b2">' + d.poleEtykieta + '</label>' +
          '<div class="pisanie-rzad">' +
            '<input id="pole-b2" class="pole" type="text" autocomplete="off">' +
            '<button type="button" class="okragly" data-opis="' + d.mikrofonOpis + '"><span class="kolko">' + ikona('mikrofon') + '</span><span>Powiedz</span></button>' +
            '<button type="submit" class="okragly pelny"><span class="kolko">' + ikona('wyslij') + '</span><span>Wyślij</span></button>' +
          '</div>' +
          '<p class="odpowiedzi-tytul" id="h-odp-b2">Albo kliknij gotowe pytanie:</p>' +
          '<ul class="odpowiedzi" aria-labelledby="h-odp-b2">' + d.podpowiedzi.map(function (p) {
            return '<li><button type="button" class="odpowiedz" data-cel="asystenta z pytaniem „' + p + '”">' + p + '</button></li>';
          }).join('') + '</ul>' +
        '</form>' +
        '<section class="sprawy" aria-labelledby="h-sprawy-b2"><h2 id="h-sprawy-b2">Najczęstsze sprawy</h2>' +
          '<ul class="wiersze">' + d.sprawy.map(function (s) {
            return '<li><button type="button" class="wiersz" data-cel="' + s.cel + '"><span class="wiersz-ikona">' + ikona(s.ikona) + '</span>' +
              '<span class="wiersz-tekst"><span class="wiersz-nazwa">' + s.nazwa + '</span><span class="wiersz-opis">' + s.opis + '</span></span>' + ikona('dalej') + '</button></li>';
          }).join('') + '</ul>' +
        '</section>' +
      '</main>' + window.Prototyp.pasekDolny() + '</div>';
    }
  };
})();

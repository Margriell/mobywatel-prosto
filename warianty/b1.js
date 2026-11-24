/* Wariant B1 — „Granatowa góra”: dopracowany kierunek B.
   Paleta: granat + kremowe tło + brzoskwiniowy awatar.
   Układ: powitanie → asystent (pole jak wyszukiwarka) → sprawa pilna → kafle 2 kolumny.
   Kształty: miękkie karty (20 px), okrągłe ikony, pole w kształcie pigułki. */
(function () {
  'use strict';
  window.WARIANTY = window.WARIANTY || {};
  window.WARIANTY.b1 = {
    nazwa: 'B1 — Granatowa góra',
    css: [
      ':host{--tlo:#F6F2EA;--ramka:#77828F;--granat-jasny:#E3ECF8;--brzoskwinia:#FFD9A8;--okno-zaokraglenie:20px;--przycisk-zaokraglenie:999px}',
      '.gora{background:linear-gradient(160deg,var(--granat) 0%,var(--granat-2) 100%);color:#fff;padding:.5rem 1rem 1rem;border-radius:0 0 1.75rem 1.75rem;--fokus:#fff}',
      '.naglowek{display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap}',
      '.marka{display:flex;align-items:center;gap:.5rem;font-weight:700;font-size:max(16px,.8rem)}',
      '.przycisk-jasny{display:inline-flex;align-items:center;gap:.4rem;padding:.25rem .9rem;background:rgba(255,255,255,.12);color:#fff;border:2px solid #fff;border-radius:999px;font-weight:700;font-size:max(16px,.8rem)}',
      '.powitanie{display:flex;align-items:center;gap:.75rem;margin-top:.75rem}',
      '.awatar{display:grid;place-items:center;width:2.5rem;height:2.5rem;flex:none;border-radius:50%;background:var(--brzoskwinia);color:var(--granat);font-weight:700;font-size:1.1rem}',
      'h1{font-size:1.3rem;line-height:1.25}',
      '.asystent{margin-top:1rem;--fokus:#fff}',
      '.asystent label{display:block;font-weight:700;margin-bottom:.4rem}',
      '.pole{display:block;width:100%;min-height:56px;padding:.5rem 1.1rem;background:#fff;color:#1A1F27;border:2px solid #fff;border-radius:999px}',
      '.pole:focus-visible{outline-offset:2px}',
      '.przyciski{display:flex;flex-wrap:wrap;gap:8px;margin-top:.6rem}',
      '.przyciski button{flex:1 1 6rem;display:inline-flex;align-items:center;justify-content:center;gap:.4rem;min-height:52px;padding:.25rem .75rem;border-radius:999px;font-weight:700}',
      '.przycisk-obrys-jasny{background:transparent;color:#fff;border:2px solid #fff}',
      '.przycisk-bialy{background:#fff;color:var(--granat);border:2px solid #fff}',
      '.podpowiedzi-lista{display:flex;flex-wrap:wrap;gap:8px}',
      '.kafel-pytanie{display:inline-flex;align-items:center;gap:.45rem;min-height:48px;padding:.25rem .9rem;background:var(--granat-jasny);color:var(--granat);border:2px solid var(--granat-jasny);border-radius:999px;font-weight:700;text-align:left}',
      '.kafel-pytanie:hover{border-color:var(--granat)}',
      '.tresc{padding:0 1rem 1.5rem}',
      'section{margin-top:1rem}',
      'h2{font-size:1.15rem;line-height:1.3;color:var(--granat);margin-bottom:.6rem}',
      '.pilne{background:#fff;border:2px solid var(--czerwien);border-radius:20px;padding:.75rem 1rem .9rem;display:grid;gap:.5rem;box-shadow:0 4px 14px rgba(26,31,39,.08)}',
      '.pilne-gora{display:flex;align-items:center;gap:.6rem}',
      '.pilne-gora h2{margin:0;color:var(--czerwien);font-size:1.05rem}',
      '.pilne-ikona{display:grid;place-items:center;width:2.5rem;height:2.5rem;flex:none;border-radius:50%;background:var(--czerwien-tlo);color:var(--czerwien)}',
      '.pilne-etykieta{display:inline-block;background:var(--czerwien);color:#fff;font-weight:700;font-size:max(16px,.75rem);padding:0 .6rem;border-radius:999px}',
      '.pilne-tekst{font-weight:700;line-height:1.35}',
      '.przycisk-glowny{display:flex;align-items:center;justify-content:center;gap:.4rem;width:100%;min-height:56px;padding:.25rem 1rem;background:var(--granat);color:#fff;border:2px solid var(--granat);border-radius:999px;font-weight:700}',
      '.kafle{display:grid;gap:.75rem;grid-template-columns:repeat(auto-fit,minmax(min(100%,7rem),1fr))}',
      '.kafel{width:100%;height:100%;min-height:6.25rem;display:flex;flex-direction:column;align-items:flex-start;justify-content:space-between;gap:.5rem;padding:.85rem;background:#fff;border:2px solid var(--ramka);border-radius:20px;text-align:left;font-weight:700;line-height:1.3;overflow-wrap:break-word;box-shadow:0 4px 14px rgba(26,31,39,.06)}',
      '.kafel:hover{border-color:var(--granat)}',
      '.kafel-ikona{display:grid;place-items:center;width:2.6rem;height:2.6rem;border-radius:50%;background:var(--granat-jasny);color:var(--granat)}',
      '.pasek-dolny{border-radius:1.25rem 1.25rem 0 0;box-shadow:0 -4px 16px rgba(26,31,39,.10)}',
      '.pasek-dolny button[aria-current="page"] .pasek-ikona{background:var(--granat-jasny)}',
      '.pasek-dolny button[aria-current="page"] .pasek-podpis{border-bottom:3px solid var(--granat)}'
    ].join('\n'),
    html: function (d, ikona, znak) {
      return '<div class="telefon"><main>' +
        '<div class="gora">' +
          '<header class="naglowek">' +
            '<div class="marka">' + znak('#fff', '#123A6B') + '<span>mObywatel</span></div>' +
            '<button type="button" class="przycisk-jasny" data-cel="Ustawienia">' + ikona('ustawienia') + '<span>Ustawienia</span></button>' +
          '</header>' +
          '<div class="powitanie"><span class="awatar" aria-hidden="true">' + d.inicjal + '</span><h1>Dzień dobry, ' + d.wolacz + '</h1></div>' +
          '<form class="asystent" aria-label="Asystent">' +
            '<label for="pole-b1">' + d.poleEtykieta + '</label>' +
            '<input id="pole-b1" class="pole" type="text" autocomplete="off">' +
            '<div class="przyciski">' +
              '<button type="button" class="przycisk-obrys-jasny" data-opis="' + d.mikrofonOpis + '">' + ikona('mikrofon') + '<span>Powiedz</span></button>' +
              '<button type="submit" class="przycisk-bialy">' + ikona('wyslij') + '<span>Wyślij</span></button>' +
            '</div>' +
          '</form>' +
        '</div>' +
        '<div class="tresc">' +
          '<section aria-labelledby="h-uwaga-b1">' +
            '<div class="pilne">' +
              '<div class="pilne-gora"><span class="pilne-ikona">' + ikona(d.pilne.ikona) + '</span><h2 id="h-uwaga-b1">Wymaga Twojej uwagi</h2></div>' +
              '<p class="pilne-tekst"><span class="pilne-etykieta">' + d.pilne.etykieta + '</span> ' + d.pilne.tekst + '</p>' +
              '<button type="button" class="przycisk-glowny" data-cel="' + d.pilne.cel + '"><span>' + d.pilne.przycisk + '</span>' + ikona('dalej') + '</button>' +
            '</div>' +
          '</section>' +
          '<section aria-labelledby="h-pytania-b1"><h2 id="h-pytania-b1">Możesz zapytać asystenta</h2>' +
            '<ul class="podpowiedzi-lista">' + d.podpowiedzi.map(function (p) {
              return '<li><button type="button" class="kafel-pytanie" data-cel="asystenta z pytaniem „' + p + '”">' + ikona('rozmowa') + '<span>' + p + '</span></button></li>';
            }).join('') + '</ul>' +
          '</section>' +
          '<section aria-labelledby="h-sprawy-b1"><h2 id="h-sprawy-b1">Najczęstsze sprawy</h2>' +
            '<ul class="kafle">' + d.sprawy.map(function (s) {
              return '<li><button type="button" class="kafel" data-cel="' + s.cel + '"><span class="kafel-ikona">' + ikona(s.ikona) + '</span><span>' + s.nazwa + '</span></button></li>';
            }).join('') + '</ul>' +
          '</section>' +
        '</div>' +
      '</main>' + window.Prototyp.pasekDolny() + '</div>';
    }
  };
})();

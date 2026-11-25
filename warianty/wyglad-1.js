/* Wygląd 1 — „Ciepły” (w duchu B1): granatowa góra, kremowe tło, miękkie kształty,
   mDowód jak pastelowy dokument z delikatnym wzorem i złotym chipem. */
(function () {
  'use strict';
  window.WYGLADY = window.WYGLADY || {};
  window.WYGLADY['1'] = {
    nazwa: 'Wygląd 1 — Ciepły',
    css: [
      ':host{--czcionka:"Atkinson Hyperlegible",system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;',
      '--tlo:#F6F2EA;--powierzchnia:#FFFFFF;--tekst:#1A1F27;--tekst-2:#4A5563;--sekcja-kolor:#123A6B;--fokus:#1A1A1A;',
      '--gora-tlo:linear-gradient(160deg,#123A6B 0%,#1D4F8C 100%);--gora-tekst:#FFFFFF;--gora-fokus:#FFFFFF;--gora-zaokraglenie:0 0 1.75rem 1.75rem;',
      '--naglowek-przycisk-tlo:rgba(255,255,255,.12);--naglowek-przycisk-ramka:rgba(255,255,255,.85);--licznik-tlo:#FFD9A8;--licznik-tekst:#123A6B;--znak-obwodka:#FFFFFF;',
      '--dowod-tlo:linear-gradient(135deg,#FFF3E8 0%,#FCE6EA 55%,#EAEFFB 100%);',
      '--dowod-wzor:repeating-radial-gradient(circle at 88% 12%,rgba(18,58,107,.08) 0 1px,transparent 1px 9px),repeating-linear-gradient(120deg,rgba(180,70,90,.06) 0 1px,transparent 1px 8px);',
      '--dowod-tekst:#1A2440;--dowod-tekst-2:#4A4F63;--dowod-ramka:1px solid rgba(18,58,107,.2);--dowod-cien:0 6px 18px rgba(26,31,39,.12);--dowod-zaokraglenie:20px;',
      '--dowod-status:#1E6B3A;--dowod-status-tlo:rgba(255,255,255,.75);--foto-tlo:#FFD9A8;--foto-tekst:#123A6B;--foto-ramka:#FFFFFF;--foto-zaokraglenie:12px;',
      '--chip-tlo:linear-gradient(135deg,#F3D08A,#D9A94E);--chip-ramka:#B8893A;',
      '--dowod-przycisk-tlo:#123A6B;--dowod-przycisk-tekst:#FFFFFF;--dowod-przycisk-ramka:#123A6B;',
      '--zaokraglenie:18px;--zaokraglenie-maly:14px;--zaokraglenie-duzy:22px;--zaokraglenie-przycisku:999px;',
      '--wiersz-ramka:#77828F;--cien-maly:0 3px 10px rgba(26,31,39,.06);--ikona-tlo:#E3ECF8;--ikona-kolor:#123A6B;--ikona-zaokraglenie:50%;--sukces:#1E7B45;',
      '--akcent:#123A6B;--akcent-tlo:#FFF1DC;--akcent-tekst:#FFFFFF;--akcent-mocny:#123A6B;--uwaga-lewa:6px;',
      '--blok-tlo:#FFFFFF;--blok-ramka:#E4DCCD;--pole-tlo:#FFFDF8;--pole-ramka:#77828F;--pole-zaokraglenie:999px;',
      '--akcja:#123A6B;--akcja-tekst:#FFFFFF;--akcja-obrys:#123A6B;',
      '--pytanie-tlo:#E3ECF8;--pytanie-tekst:#123A6B;--pytanie-ramka:#E3ECF8;--pytanie-zaokraglenie:999px;--pytanie-grubosc:700;',
      '--pasek-tlo:#FFFFFF;--pasek-ramka:#E4DCCD;--pasek-tekst:#4A5563;--pasek-aktywny:#123A6B;--pasek-aktywny-tlo:#E3ECF8;--pasek-zaokraglenie:1.25rem 1.25rem 0 0}',

      ':host([data-motyw="ciemny"]){',
      '--tlo:#14171D;--powierzchnia:#1F242C;--tekst:#F3EEE6;--tekst-2:#C9CDD5;--sekcja-kolor:#BFD6FF;--fokus:#FFFFFF;',
      '--gora-tlo:linear-gradient(160deg,#0D2342 0%,#163763 100%);--licznik-tlo:#FFD9A8;--licznik-tekst:#0D2342;',
      '--dowod-tlo:linear-gradient(135deg,#3A2B2A 0%,#33283A 55%,#232C42 100%);',
      '--dowod-wzor:repeating-radial-gradient(circle at 88% 12%,rgba(255,255,255,.06) 0 1px,transparent 1px 9px),repeating-linear-gradient(120deg,rgba(255,200,210,.05) 0 1px,transparent 1px 8px);',
      '--dowod-tekst:#FBF3EC;--dowod-tekst-2:#E0D6D0;--dowod-ramka:1px solid rgba(255,255,255,.2);--dowod-cien:0 6px 18px rgba(0,0,0,.4);',
      '--dowod-status:#9BE3B4;--dowod-status-tlo:rgba(0,0,0,.3);--foto-ramka:rgba(255,255,255,.6);',
      '--dowod-przycisk-tlo:#A9C7F5;--dowod-przycisk-tekst:#0D2342;--dowod-przycisk-ramka:#A9C7F5;',
      '--wiersz-ramka:#8A94A6;--cien-maly:none;--ikona-tlo:#2A3A55;--ikona-kolor:#CFE0FF;--sukces:#7FD8A0;',
      '--akcent:#A9C7F5;--akcent-tlo:#2A2620;--akcent-tekst:#0D2342;--akcent-mocny:#BFD6FF;',
      '--blok-tlo:#1F242C;--blok-ramka:#394150;--pole-tlo:#14171D;--pole-ramka:#8A94A6;',
      '--akcja:#A9C7F5;--akcja-tekst:#0D2342;--akcja-obrys:#A9C7F5;',
      '--pytanie-tlo:#2A3A55;--pytanie-tekst:#E3EDFF;--pytanie-ramka:#2A3A55;',
      '--pasek-tlo:#1A1E25;--pasek-ramka:#394150;--pasek-tekst:#C9CDD5;--pasek-aktywny:#BFD6FF;--pasek-aktywny-tlo:#2A3A55}',

      /* Kształty i drobne akcenty tego wyglądu */
      '.mdowod-typ{font-size:1.25rem}',
      '.pasek-dolny{box-shadow:0 -4px 16px rgba(26,31,39,.10)}'
    ].join('\n')
  };
})();

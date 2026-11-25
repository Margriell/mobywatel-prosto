/* Wygląd 2 — „Profesjonalny i żywy” (w duchu B2, ale z energią): chłodna biel,
   góra w przejściu granat → indygo → fiolet, mDowód jak nowoczesna karta z połyskiem,
   precyzyjne kształty (12–16 px) i fioletowy akcent. */
(function () {
  'use strict';
  window.WYGLADY = window.WYGLADY || {};
  window.WYGLADY['2'] = {
    nazwa: 'Wygląd 2 — Profesjonalny i żywy',
    css: [
      ':host{--czcionka:"Atkinson Hyperlegible",system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;',
      '--tlo:#F3F5FB;--powierzchnia:#FFFFFF;--tekst:#121933;--tekst-2:#465071;--sekcja-kolor:#121933;--fokus:#121933;',
      '--gora-tlo:linear-gradient(120deg,#1D3A8A 0%,#2F45C8 60%,#5B3FD6 100%);--gora-tekst:#FFFFFF;--gora-fokus:#FFFFFF;--gora-zaokraglenie:0;',
      '--naglowek-przycisk-tlo:rgba(255,255,255,.14);--naglowek-przycisk-ramka:rgba(255,255,255,.6);--licznik-tlo:#FFB547;--licznik-tekst:#121933;--znak-obwodka:#FFFFFF;',
      '--h1-odstep:-.01em;',
      '--dowod-tlo:linear-gradient(135deg,#1D3A8A 0%,#3B3FD8 55%,#6D3BE0 100%);',
      '--dowod-wzor:radial-gradient(circle at 92% 6%,rgba(255,255,255,.28),transparent 38%),radial-gradient(circle at 0% 100%,rgba(56,189,248,.35),transparent 50%),repeating-linear-gradient(-35deg,rgba(255,255,255,.07) 0 1px,transparent 1px 10px);',
      '--dowod-tekst:#FFFFFF;--dowod-tekst-2:#E6E9FF;--dowod-ramka:0 solid transparent;--dowod-cien:0 10px 24px rgba(45,55,160,.35);--dowod-zaokraglenie:16px;--dowod-typ-odstep:.02em;',
      '--dowod-status:#0B3B22;--dowod-status-tlo:#B8F5CF;--foto-tlo:rgba(255,255,255,.95);--foto-tekst:#1D3A8A;--foto-ramka:rgba(255,255,255,.9);--foto-zaokraglenie:10px;',
      '--chip-tlo:linear-gradient(135deg,#FDE68A,#F59E0B);--chip-ramka:#B45309;',
      '--dowod-przycisk-tlo:#FFFFFF;--dowod-przycisk-tekst:#1D3A8A;--dowod-przycisk-ramka:#FFFFFF;',
      '--zaokraglenie:14px;--zaokraglenie-maly:12px;--zaokraglenie-duzy:18px;--zaokraglenie-przycisku:12px;',
      '--wiersz-ramka:#6E7898;--cien-maly:0 2px 8px rgba(18,25,51,.06);--ikona-tlo:linear-gradient(135deg,#E0E7FF,#EDE9FE);--ikona-kolor:#3730A3;--ikona-zaokraglenie:12px;--sukces:#15803D;',
      '--akcent:#6D28D9;--akcent-tlo:#F3EEFF;--akcent-tekst:#FFFFFF;--akcent-mocny:#5B21B6;--uwaga-lewa:6px;',
      '--blok-tlo:#FFFFFF;--blok-ramka:#D9DEEE;--pole-tlo:#F3F5FB;--pole-ramka:#6E7898;--pole-zaokraglenie:12px;',
      '--akcja:#1D3A8A;--akcja-tekst:#FFFFFF;--akcja-obrys:#1D3A8A;',
      '--pytanie-tlo:#FFFFFF;--pytanie-tekst:#1D3A8A;--pytanie-ramka:#AEB6DA;--pytanie-zaokraglenie:12px;--pytanie-grubosc:700;',
      '--pasek-tlo:#FFFFFF;--pasek-ramka:#D9DEEE;--pasek-tekst:#465071;--pasek-aktywny:#2F45C8;--pasek-aktywny-tlo:#E0E7FF;--kreska-gora:-2px;--kreska-dol:auto}',

      ':host([data-motyw="ciemny"]){',
      '--tlo:#0E1120;--powierzchnia:#181C2F;--tekst:#EEF0FA;--tekst-2:#B8BEDA;--sekcja-kolor:#EEF0FA;--fokus:#FFFFFF;',
      '--gora-tlo:linear-gradient(120deg,#16245C 0%,#24318F 60%,#3C2A8F 100%);',
      '--dowod-tlo:linear-gradient(135deg,#1E2A78 0%,#3730A3 55%,#5B21B6 100%);--dowod-cien:0 10px 24px rgba(0,0,0,.45);',
      '--wiersz-ramka:#6C77A3;--cien-maly:none;--ikona-tlo:#262C55;--ikona-kolor:#C7D2FE;--sukces:#6EE7A0;',
      '--akcent:#C4B5FD;--akcent-tlo:#211A3A;--akcent-tekst:#1E1240;--akcent-mocny:#D8CCFF;',
      '--blok-tlo:#181C2F;--blok-ramka:#2B3150;--pole-tlo:#0E1120;--pole-ramka:#6C77A3;',
      '--akcja:#93A5FF;--akcja-tekst:#0E1120;--akcja-obrys:#93A5FF;',
      '--pytanie-tlo:#181C2F;--pytanie-tekst:#C7D2FE;--pytanie-ramka:#3A4270;',
      '--pasek-tlo:#141829;--pasek-ramka:#2B3150;--pasek-tekst:#B8BEDA;--pasek-aktywny:#A5B4FC;--pasek-aktywny-tlo:#262C55}',

      /* Żywe akcenty: kolorowa kreska przy tytułach sekcji, wyraźniejsza typografia */
      '.sekcja-tytul,.asystent label{display:flex;align-items:center;gap:.5rem}',
      '.sekcja-tytul::before{content:"";flex:none;width:.35rem;height:1.1em;border-radius:4px;background:linear-gradient(#2F45C8,#6D28D9)}',
      ':host([data-motyw="kontrast"]) .sekcja-tytul::before{background:#FFE500}',
      '.mdowod-typ{font-size:1.3rem}',
      '.mdowod-foto{box-shadow:0 4px 10px rgba(0,0,0,.2)}'
    ].join('\n')
  };
})();

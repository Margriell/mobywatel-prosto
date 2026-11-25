/* Wygląd 3 — „Czysty, bliski oficjalnemu”: biel, czerwony akcent (znak, linia u góry,
   pasek na karcie mDowodu), cienkie linie, małe zaokrąglenia, czcionka systemowa.
   Przyciski i akcje nadal granatowe (czerwień tylko jako ozdoba marki — patrz uwagi w POSTEP.md). */
(function () {
  'use strict';
  window.WYGLADY = window.WYGLADY || {};
  window.WYGLADY['3'] = {
    nazwa: 'Wygląd 3 — Czysty, bliski oficjalnemu',
    css: [
      ':host{--czcionka:system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;',
      '--tlo:#FFFFFF;--powierzchnia:#FFFFFF;--tekst:#16181D;--tekst-2:#50565F;--sekcja-kolor:#16181D;--fokus:#16181D;',
      '--gora-tlo:#FFFFFF;--gora-tekst:#16181D;--gora-fokus:#16181D;--gora-zaokraglenie:0;--gora-linia:1px solid #E1E4E8;',
      '--naglowek-przycisk-tlo:transparent;--naglowek-przycisk-ramka:transparent;--licznik-tlo:#0B3D8C;--licznik-tekst:#FFFFFF;',
      '--h1-grubosc:600;--marka-odstep:-.01em;',
      '--dowod-tlo:linear-gradient(180deg,#FFFFFF 0%,#F6F7F9 100%);',
      '--dowod-wzor:repeating-radial-gradient(circle at 100% 100%,rgba(200,16,46,.07) 0 1px,transparent 1px 7px),repeating-linear-gradient(90deg,rgba(22,24,29,.025) 0 1px,transparent 1px 6px);',
      '--dowod-tekst:#16181D;--dowod-tekst-2:#50565F;--dowod-ramka:1px solid #C9CED6;--dowod-gorna-linia:6px solid #C8102E;--dowod-cien:0 8px 24px rgba(16,24,40,.10);--dowod-zaokraglenie:12px;',
      '--dowod-status:#14532D;--dowod-status-tlo:#E7F6EC;--foto-tlo:#EEF0F3;--foto-tekst:#3A4049;--foto-ramka:#C9CED6;--foto-zaokraglenie:6px;',
      '--chip-tlo:linear-gradient(135deg,#E9D8A6,#C9A85B);--chip-ramka:#A88B45;',
      '--dowod-przycisk-tlo:#FFFFFF;--dowod-przycisk-tekst:#0B3D8C;--dowod-przycisk-ramka:#0B3D8C;',
      '--zaokraglenie:10px;--zaokraglenie-maly:8px;--zaokraglenie-duzy:12px;--zaokraglenie-przycisku:8px;',
      '--wiersz-ramka:#8A929C;--cien-maly:none;--ikona-tlo:#F1F3F5;--ikona-kolor:#16181D;--ikona-zaokraglenie:8px;--sukces:#1A7F37;',
      '--akcent:#0B3D8C;--akcent-tlo:#F2F6FC;--akcent-tekst:#FFFFFF;--akcent-mocny:#0B3D8C;--uwaga-lewa:4px;',
      '--blok-tlo:#F7F8FA;--blok-ramka:#E1E4E8;--pole-tlo:#FFFFFF;--pole-ramka:#8A929C;--pole-zaokraglenie:8px;',
      '--akcja:#0B3D8C;--akcja-tekst:#FFFFFF;--akcja-obrys:#0B3D8C;',
      '--pytanie-tlo:#FFFFFF;--pytanie-tekst:#0B3D8C;--pytanie-ramka:#C9CED6;--pytanie-zaokraglenie:8px;--pytanie-grubosc:600;',
      '--pasek-tlo:#FFFFFF;--pasek-ramka:#E1E4E8;--pasek-tekst:#50565F;--pasek-aktywny:#0B3D8C;--pasek-aktywny-tlo:transparent;--kreska-gora:-2px;--kreska-dol:auto}',

      ':host([data-motyw="ciemny"]){',
      '--tlo:#0F1114;--powierzchnia:#181B20;--tekst:#F2F3F5;--tekst-2:#B6BCC5;--sekcja-kolor:#F2F3F5;--fokus:#FFFFFF;',
      '--gora-tlo:#0F1114;--gora-tekst:#F2F3F5;--gora-fokus:#FFFFFF;--gora-linia:1px solid #2A2F37;--licznik-tlo:#9EC2FF;--licznik-tekst:#0F1114;',
      '--dowod-tlo:linear-gradient(180deg,#1C2026 0%,#171A1F 100%);',
      '--dowod-wzor:repeating-radial-gradient(circle at 100% 100%,rgba(255,90,110,.08) 0 1px,transparent 1px 7px);',
      '--dowod-tekst:#F2F3F5;--dowod-tekst-2:#B6BCC5;--dowod-ramka:1px solid #3A414B;--dowod-gorna-linia:6px solid #E5384F;--dowod-cien:none;',
      '--dowod-status:#A7F3C0;--dowod-status-tlo:rgba(167,243,192,.12);--foto-tlo:#2A2F37;--foto-tekst:#E6E8EB;--foto-ramka:#4A525E;',
      '--dowod-przycisk-tlo:transparent;--dowod-przycisk-tekst:#9EC2FF;--dowod-przycisk-ramka:#9EC2FF;',
      '--wiersz-ramka:#6B7480;--ikona-tlo:#22262D;--ikona-kolor:#E6E8EB;--sukces:#6FD98F;',
      '--akcent:#9EC2FF;--akcent-tlo:#16202E;--akcent-tekst:#0F1114;--akcent-mocny:#BCD5FF;',
      '--blok-tlo:#181B20;--blok-ramka:#2A2F37;--pole-tlo:#0F1114;--pole-ramka:#6B7480;',
      '--akcja:#9EC2FF;--akcja-tekst:#0F1114;--akcja-obrys:#9EC2FF;',
      '--pytanie-tlo:#181B20;--pytanie-tekst:#BCD5FF;--pytanie-ramka:#3A414B;',
      '--pasek-tlo:#14171B;--pasek-ramka:#2A2F37;--pasek-tekst:#B6BCC5;--pasek-aktywny:#9EC2FF;--pasek-aktywny-tlo:transparent}',

      /* Czerwony akcent marki: cienka linia na samej górze ekranu */
      '.gora{box-shadow:inset 0 3px 0 #C8102E}',
      ':host([data-motyw="kontrast"]) .gora{box-shadow:none}',
      '.mdowod-typ{font-size:1.2rem;font-weight:600}',
      '.wiersz-nazwa{font-weight:600}',
      '.sekcja-tytul{font-weight:600}'
    ].join('\n')
  };
})();

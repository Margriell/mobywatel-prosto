#!/usr/bin/env node
/* =====================================================================
   Testy prototypu „mObywatel dla każdego” — jedno polecenie:

       node testy/uruchom.js              (wszystkie części)
       node testy/uruchom.js 0 4          (wybrane części, np. 0 i 4)
       node testy/uruchom.js kontrola     (tylko pełna „Kontrola”)
       node testy/uruchom.js --szybko     (krótsza Kontrola: mniej zestawów)

   Potrzebne: Node.js 22 lub nowszy oraz Chrome albo Edge (bez instalowania pakietów).
   Wynik: podsumowanie w konsoli oraz testy/wyniki/raport.md i testy/wyniki/wyniki.json.
   ===================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const { uruchomSerwer } = require('./lib/serwer');
const { Przegladarka } = require('./lib/przegladarka');

const KATALOG = path.resolve(__dirname, '..');
const CZESCI = [
  ['0', './czesci/0-dotyk.js'],
  ['1', './czesci/1-sciezki.js'],
  ['2', './czesci/2-nawigacja.js'],
  ['3', './czesci/3-formularze.js'],
  ['4', './czesci/4-asystent.js'],
  ['5', './czesci/5-urzadzenia.js'],
  ['6', './czesci/6-dostepnosc.js'],
  ['7', './czesci/7-tresc.js'],
  ['8', './czesci/8-zgodnosc.js'],
  ['kontrola', './czesci/k-kontrola.js']
];

async function main() {
  const arg = process.argv.slice(2);
  const szybko = arg.includes('--szybko');
  const wybrane = arg.filter((a) => !a.startsWith('--'));
  const doUruchomienia = CZESCI.filter(([id]) => !wybrane.length || wybrane.includes(id));
  const start = Date.now();
  const serwer = await uruchomSerwer(KATALOG);
  const przegladarka = await Przegladarka.uruchom();
  const baza = 'http://127.0.0.1:' + serwer.port + '/';
  console.log('Przeglądarka: ' + przegladarka.wersja + ' · aplikacja: ' + baza);

  const przypadki = [];
  const stat = { ekrany: 0, minKontrast: 99, gdzieKontrast: '', minTekst: 99, minCel: 999, gdzieCel: '', minIkona: 99, gdzieIkona: '', bledyKonsoli: [], inne: {} };
  const ctx = {
    baza, katalog: KATALOG, przegladarka, szybko,
    /* Zapisuje wynik jednego przypadku. waga przy błędzie: krytyczny / poważny / drobny */
    wynik(czesc, przypadek, ok, szczegoly, waga) {
      przypadki.push({ czesc, przypadek, ok: !!ok, szczegoly: szczegoly || '', waga: ok ? '' : (waga || 'poważny') });
      if (!ok) console.log('  ✗ [' + (waga || 'poważny') + '] ' + przypadek + (szczegoly ? ' — ' + String(szczegoly).slice(0, 300) : ''));
    },
    ekran(st) {
      stat.ekrany++;
      if (!st) return;
      if (st.minKontrast < stat.minKontrast) { stat.minKontrast = st.minKontrast; stat.gdzieKontrast = st.gdzieKontrast + (st.gdzie ? ' — ' + st.gdzie : ''); }
      if (st.minIkona < stat.minIkona) { stat.minIkona = st.minIkona; stat.gdzieIkona = st.gdzieIkona + (st.gdzie ? ' — ' + st.gdzie : ''); }
      if (st.minCel < stat.minCel) { stat.minCel = st.minCel; stat.gdzieCel = st.gdzieCel + (st.gdzie ? ' — ' + st.gdzie : ''); }
      stat.minTekst = Math.min(stat.minTekst, st.minTekst);
    },
    konsola(strona, gdzie) {
      for (const b of strona.bledyKonsoli.splice(0)) stat.bledyKonsoli.push(gdzie + ': ' + b);
    },
    stat
  };

  for (const [id, plik] of doUruchomienia) {
    const czesc = require(plik);
    const t0 = Date.now();
    console.log('\n=== ' + czesc.nazwa + ' ===');
    const przed = przypadki.length;
    try { await czesc.uruchom(ctx); } catch (e) { ctx.wynik(czesc.nazwa, 'Test przerwany błędem', false, e.stack || String(e), 'krytyczny'); }
    const moje = przypadki.slice(przed);
    console.log('  ' + moje.filter((p) => p.ok).length + ' z ' + moje.length + ' przypadków bez błędu (' + Math.round((Date.now() - t0) / 1000) + ' s)');
  }
  await przegladarka.zamknij();
  await serwer.zamknij();

  /* ---------- Raport ---------- */
  const zle = przypadki.filter((p) => !p.ok);
  const wagi = ['krytyczny', 'poważny', 'drobny'];
  const ileWag = wagi.map((w) => w + ': ' + zle.filter((p) => p.waga === w).length).join(', ');
  const czas = Math.round((Date.now() - start) / 1000);
  const md = ['# Raport testów (wygenerowany automatycznie)', '',
    'Data: ' + new Date().toLocaleString('pl-PL') + ' · przeglądarka: ' + przegladarka.wersja + ' · czas: ' + czas + ' s', '',
    '- Przypadki: **' + przypadki.length + '**, bez błędu: **' + (przypadki.length - zle.length) + '**, z błędem: **' + zle.length + '** (' + ileWag + ')',
    '- Sprawdzone ekrany: **' + stat.ekrany + '**',
    stat.minKontrast < 99 ? '- Najsłabszy kontrast tekstu: **' + stat.minKontrast.toFixed(2).replace('.', ',') + ':1** (' + stat.gdzieKontrast + ')' : '',
    stat.minIkona < 99 ? '- Najsłabszy kontrast ikony: ' + stat.minIkona.toFixed(2).replace('.', ',') + ':1 (' + stat.gdzieIkona + ')' : '',
    stat.minTekst < 99 ? '- Najmniejszy tekst: ' + stat.minTekst + ' px' : '',
    stat.minCel < 999 ? '- Najmniejszy element klikalny: ' + Math.round(stat.minCel) + ' px (' + stat.gdzieCel + ')' : '',
    '- Błędy w konsoli przeglądarki: ' + stat.bledyKonsoli.length,
    ...Object.keys(stat.inne).map((k) => '- ' + k + ': ' + stat.inne[k]),
    '', '## Przypadki z błędem', '', zle.length ? '| Część | Przypadek | Co się stało | Waga |\n| --- | --- | --- | --- |' : 'Brak.',
    ...zle.map((p) => '| ' + [p.czesc, p.przypadek, String(p.szczegoly).replace(/\|/g, '/').replace(/\n/g, ' ').slice(0, 400), p.waga].join(' | ') + ' |'),
    '', '## Wszystkie przypadki', '', '| Część | Przypadek | Wynik | Szczegóły |', '| --- | --- | --- | --- |',
    ...przypadki.map((p) => '| ' + [p.czesc, p.przypadek.replace(/\|/g, '/'), p.ok ? 'OK' : '✗ ' + p.waga, String(p.szczegoly).replace(/\|/g, '/').replace(/\n/g, ' ').slice(0, 300)].join(' | ') + ' |'),
    stat.bledyKonsoli.length ? '\n## Błędy w konsoli\n\n' + stat.bledyKonsoli.map((b) => '- ' + b).join('\n') : ''
  ].filter((x) => x !== '').join('\n');
  const wyniki = path.join(__dirname, 'wyniki');
  fs.mkdirSync(wyniki, { recursive: true });
  fs.writeFileSync(path.join(wyniki, 'raport.md'), md + '\n');
  fs.writeFileSync(path.join(wyniki, 'wyniki.json'), JSON.stringify({ przypadki, stat }, null, 1));
  console.log('\n' + '='.repeat(60));
  console.log('Przypadki: ' + przypadki.length + ', z błędem: ' + zle.length + ' (' + ileWag + ')');
  console.log('Ekrany: ' + stat.ekrany + (stat.minKontrast < 99 ? ', najsłabszy kontrast: ' + stat.minKontrast.toFixed(2) + ':1' : '') + (stat.minTekst < 99 ? ', najmniejszy tekst: ' + stat.minTekst + ' px' : ''));
  console.log('Błędy w konsoli: ' + stat.bledyKonsoli.length + ' · raport: testy/wyniki/raport.md · czas: ' + czas + ' s');
  process.exitCode = zle.length ? 1 : 0;
}

main().catch((e) => { console.error(e); process.exitCode = 2; });

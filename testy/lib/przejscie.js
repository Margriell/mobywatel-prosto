/* Obchód wszystkich ekranów jednej osoby z pełnym sprawdzeniem każdego ekranu (zasady „Kontroli”). */
'use strict';
const wstrzyknij = require('./w-stronie');
const { otworz } = require('./aplikacja');
const { trasa } = require('./ekrany');

async function sprawdzEkran(s, o) {
  o = o || {};
  await s.js(wstrzyknij);
  const { bledy, st } = await s.js((op) => window.__T.sprawdz(op), { pasekNaDole: o.pasekNaDole });
  let wszystkie = bledy.slice();
  if (o.nakladanie !== false) wszystkie = wszystkie.concat(await s.js(() => window.__T.nakladanie()));
  if (!await s.js(`!!document.querySelector('dialog[open]')`)) {
    const p = await s.js(() => window.__T.pasekPrzyklejony());
    if (p === false) wszystkie.push('pasek „Wstecz” nie zostaje u góry po przewinięciu');
  }
  return { bledy: wszystkie, st };
}

/* Przechodzi wszystkie ekrany osoby z podanym wyglądem; zwraca listę błędów „ekran: błąd” i liczbę ekranów */
async function obejdz(s, ctx, o) {
  await otworz(s, ctx.baza, { osoba: o.osoba, tekst: o.tekst, motyw: o.motyw, prosty: o.prosty, trasa: '/osoba' });
  const kroki = trasa(o.osoba);
  const bledy = [];
  let ekrany = 0;
  for (const k of kroki) {
    try { await k.krok(s); } catch (e) { bledy.push(k.nazwa + ': nie udało się przygotować ekranu (' + e.message + ')'); continue; }
    try {
      const w = await sprawdzEkran(s, o);
      ekrany++;
      ctx.ekran(Object.assign({}, w.st, { gdzie: (o.opis || '') + ' ' + k.nazwa }));
      for (const b of w.bledy) bledy.push(k.nazwa + ': ' + b);
    } catch (e) { bledy.push(k.nazwa + ': błąd sprawdzania (' + e.message + ')'); }
  }
  ctx.konsola(s, o.opis || o.osoba);
  return { bledy, ekrany };
}

module.exports = { obejdz, sprawdzEkran };

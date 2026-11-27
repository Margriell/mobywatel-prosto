/* Pomocnicze polecenia dla testów aplikacji: ustawienie osoby i wyglądu, otwarcie ekranu,
   odczyt tego, co widać. */
'use strict';
const wstrzyknij = require('./w-stronie');
const { czekaj } = require('./przegladarka');

const KLUCZ = 'mobywatel-prosto-2';
const OSOBY = { halina: ['dowod', 'emeryt', 'kdr'], tomasz: ['dowod', 'prawko', 'pojazdy'], ola: ['dowod', 'legitymacja'] };
const TEKSTY = ['standardowy', 'duzy', 'bardzo-duzy'];
const MOTYWY = ['jasny', 'ciemny', 'kontrast'];
const DOMYSLNE_OSOB = {
  halina: { tekst: 'duzy', motyw: 'jasny', prosty: true },
  tomasz: { tekst: 'standardowy', motyw: 'jasny', prosty: false },
  ola: { tekst: 'standardowy', motyw: 'ciemny', prosty: false }
};

let licznik = 0;
function stanAplikacji(o) {
  const d = DOMYSLNE_OSOB[o.osoba] || DOMYSLNE_OSOB.tomasz;
  return {
    osoba: o.osoba || null, tekst: o.tekst || d.tekst, motyw: o.motyw || d.motyw,
    prosty: o.prosty === undefined ? d.prosty : !!o.prosty, czytanie: !!o.czytanie,
    przeczytane: {}, kolejnosc: o.kolejnosc || {}, uklady: o.uklady || {}, wyniki: o.wyniki || {}
  };
}
/* Otwiera aplikację z podanym stanem (osoba, rozmiar tekstu, motyw…) na podanym ekranie.
   o.stan === null — aplikacja bez zapisanych ustawień (pierwsze uruchomienie). */
async function otworz(strona, baza, o) {
  o = o || {};
  /* Pamięć czyścimy na pustej stronie pomocniczej: aplikacja przy zamykaniu zapisuje rozmowę i sprawy w toku */
  await strona.idz(baza + 'testy/pusta.html', { bezCzekania: true });
  const stan = o.stan === null ? null : stanAplikacji(o);
  await strona.js((k, s, zostawSesje) => {
    try { if (s === null) localStorage.removeItem(k); else localStorage.setItem(k, JSON.stringify(s)); } catch (e) { /* zablokowane */ }
    try { if (!zostawSesje) sessionStorage.clear(); } catch (e) { /* zablokowane */ }
    return true;
  }, KLUCZ, stan, !!o.zostawSesje);
  await strona.idz(baza + 'index.html?t=' + (++licznik) + (o.parametry ? '&' + o.parametry : '') + '#' + (o.trasa || '/dokumenty'));
  await strona.js(wstrzyknij);
}
async function przygotuj(strona) { await strona.js(wstrzyknij); }
async function trasa(strona) { return strona.js('location.hash'); }
/* Czeka, aż adres pasuje (np. /krok-2/) */
async function czekajNaTrase(strona, wzor, limit) {
  const koniec = Date.now() + (limit || 3000);
  let h = '';
  while (Date.now() < koniec) {
    h = await trasa(strona);
    if (wzor.test(h)) { await czekaj(60); return h; }
    await czekaj(40);
  }
  throw new Error('Oczekiwano ekranu ' + wzor + ', jest: ' + h);
}
async function tytulEkranu(strona) {
  return strona.js(`(() => { const h = document.querySelector('#tresc h1'); return h ? h.textContent.trim() : ''; })()`);
}
async function tekstGlowny(strona) {
  return strona.js(`(() => { const g = document.getElementById('glowna'); return g ? g.innerText.replace(/\\s+/g, ' ').trim() : ''; })()`);
}
async function oknoOtwarte(strona) {
  return strona.js(`(() => { const o = document.querySelector('dialog[open]'); return o ? o.innerText.replace(/\\s+/g, ' ').trim() : null; })()`);
}
async function stan(strona) {
  return strona.js((k) => { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } }, KLUCZ);
}

module.exports = { KLUCZ, OSOBY, TEKSTY, MOTYWY, otworz, przygotuj, trasa, czekajNaTrase, tytulEkranu, tekstGlowny, oknoOtwarte, stan, stanAplikacji };

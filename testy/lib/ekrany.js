/* Trasa po wszystkich ekranach aplikacji dla jednej osoby — w takiej kolejności, w jakiej
   przeszedłby je człowiek: ekrany wejścia, Dokumenty (każda karta na przodzie, trzy układy),
   szczegóły dokumentów, Zarządzaj, Usługi (z wyszukiwaniem), Asystent (pusty i z rozmową),
   Kod QR, Więcej, Wygląd, Skrzynka, okna oraz sprawy A, B, C krok po kroku — także z błędami. */
'use strict';
const { czekaj } = require('./przegladarka');
const { OSOBY } = require('./aplikacja');

async function idzDo(s, hash) {
  await s.js((h) => { if (location.hash !== h) location.hash = h; else window.dispatchEvent(new HashChangeEvent('hashchange')); return true; }, hash);
  await czekaj(90);
}
async function klikJs(s, selektor) {
  const ok = await s.js((sel) => { const el = document.querySelector(sel); if (!el) return false; el.click(); return true; }, selektor);
  if (!ok) throw new Error('Brak elementu: ' + selektor);
  await czekaj(90);
}
async function zamknijOkno(s) { await s.js(`(() => { const o = document.querySelector('dialog[open]'); if (o) o.close(); return true; })()`); await czekaj(40); }
async function ustawPole(s, id, wartosc) {
  await s.js((i, w) => { const el = document.getElementById(i); el.value = w; el.dispatchEvent(new Event('input', { bubbles: true })); return true; }, id, wartosc);
}
async function zaznacz(s, nazwa, wartosc, tak) {
  await s.js((n, w, t) => {
    const el = document.querySelector('input[name="' + n + '"][value="' + w + '"]');
    if (el && el.checked !== t) el.click();
    return !!el;
  }, nazwa, wartosc, tak !== false);
}
async function wyslijFormularz(s) { await klikJs(s, 'form.krok-formularz button[type="submit"]'); await czekaj(60); }
async function zapytaj(s, tekst) {
  await s.js((t) => {
    const p = document.getElementById('pole-asystenta');
    p.value = t; p.dispatchEvent(new Event('input', { bubbles: true }));
    document.getElementById('asystent-pasek').requestSubmit();
    return true;
  }, tekst);
  await czekaj(150);
}

/* Zwraca listę kroków: { nazwa, krok: async (strona) => … } — każdy krok przygotowuje ekran do sprawdzenia */
function trasa(osoba, o) {
  o = o || {};
  const docs = OSOBY[osoba];
  const K = [];
  const dodaj = (nazwa, krok) => K.push({ nazwa, krok });
  dodaj('Wybór osoby', (s) => idzDo(s, '#/osoba'));
  dodaj('Dopasuj do siebie', (s) => idzDo(s, '#/dopasuj'));
  dodaj('Poznaj asystenta', (s) => idzDo(s, '#/poznaj'));
  dodaj('Dokumenty', (s) => idzDo(s, '#/dokumenty'));
  dodaj('Dokumenty: podpowiedzi pod polem asystenta', async (s) => { await s.js(`document.getElementById('pole-asystenta').focus()`); await czekaj(250); });
  for (const id of docs.slice(1)) {
    dodaj('Dokumenty: ' + id + ' na przodzie', async (s) => {
      await idzDo(s, '#/dokumenty'); await klikJs(s, '.karta.tyl button[data-id="' + id + '"]'); await czekaj(500);
      /* Sprawdzamy położenie po animacji przesuwania kart (w tle przeglądarka może ją spowalniać) */
      await s.js(`document.getAnimations().forEach((a) => { try { if (a.effect && a.effect.getTiming().iterations !== Infinity) a.finish(); } catch (e) { /* nic */ } })`);
      await czekaj(60);
    });
  }
  dodaj('Wybierz układ', (s) => idzDo(s, '#/zarzadzaj/uklad'));
  dodaj('Dokumenty: układ Małe karty', async (s) => { await idzDo(s, '#/zarzadzaj/uklad'); await zaznacz(s, 'uklad', 'male'); await idzDo(s, '#/dokumenty'); });
  dodaj('Dokumenty: układ Lista', async (s) => { await idzDo(s, '#/zarzadzaj/uklad'); await zaznacz(s, 'uklad', 'lista'); await idzDo(s, '#/dokumenty'); });
  dodaj('Wybierz układ: z powrotem Duże karty', async (s) => { await idzDo(s, '#/zarzadzaj/uklad'); await zaznacz(s, 'uklad', 'duze'); });
  for (const id of docs) {
    dodaj('Szczegóły: ' + id, async (s) => {
      await idzDo(s, '#/dokument/' + id);
      if (id === 'dowod') await s.js(`(() => { const d = document.querySelector('details.rozwijane'); if (d) d.open = true; return true; })()`);
    });
  }
  dodaj('Okno: Niedostępne w prototypie', async (s) => { await idzDo(s, '#/dokument/dowod'); await klikJs(s, '[data-akcja="niedostepne"]'); });
  dodaj('Zarządzaj', async (s) => { await zamknijOkno(s); await idzDo(s, '#/zarzadzaj'); });
  dodaj('Kolejność dokumentów', (s) => idzDo(s, '#/zarzadzaj/kolejnosc'));
  dodaj('Kolejność: po przesunięciu w dół', async (s) => { await klikJs(s, '[data-akcja="przesun"][data-kierunek="1"]'); });
  dodaj('Kolejność: z powrotem w górę', async (s) => { await klikJs(s, '[data-akcja="przesun"][data-kierunek="-1"]:not([disabled])'); });
  dodaj('Usuń dokument', (s) => idzDo(s, '#/zarzadzaj/usun'));
  dodaj('Okno: Usunąć dokument?', (s) => klikJs(s, '[data-akcja="usun"]'));
  dodaj('Dodaj dokument', async (s) => { await zamknijOkno(s); await idzDo(s, '#/zarzadzaj/dodaj'); });
  dodaj('Usługi', (s) => idzDo(s, '#/uslugi'));
  dodaj('Usługi: wyniki „pesel”', async (s) => { await ustawPole(s, 'szukaj', 'pesel'); await czekaj(60); });
  dodaj('Usługi: brak wyników', async (s) => { await ustawPole(s, 'szukaj', 'qwerty'); await czekaj(60); });
  dodaj('Usługi: kategoria Samochód', (s) => idzDo(s, '#/uslugi/samochod'));
  dodaj('Usługi: kategoria Zdrowie', (s) => idzDo(s, '#/uslugi/zdrowie'));
  dodaj('Asystent: pusty', async (s) => { await idzDo(s, '#/asystent'); await s.js(`(() => { const b = document.querySelector('[data-akcja="nowa-rozmowa"]'); if (b) b.click(); return true; })()`); await czekaj(80); });
  dodaj('Asystent: rozmowa', async (s) => {
    for (const z of ['Zginął mi portfel', 'Czy ten SMS to oszustwo? „Twoja paczka jest wstrzymana. Dopłać 1,89 zł w ciągu 24 h: paczka-dostawa24.xyz/oplata”',
      'Wytłumacz mi pismo', 'Chcę się zameldować', 'Do kiedy mam OC?', 'zgubiłam portfel i nie wiem co z OC', 'Co mam do załatwienia?', 'Lubisz koty?']) await zapytaj(s, z);
  });
  dodaj('Kod QR', (s) => idzDo(s, '#/kod-qr'));
  dodaj('Więcej', (s) => idzDo(s, '#/wiecej'));
  dodaj('Wygląd i dostępność', (s) => idzDo(s, '#/wyglad'));
  dodaj('Skrzynka', (s) => idzDo(s, '#/skrzynka'));
  dodaj('Wiadomość w Skrzynce', async (s) => { await idzDo(s, '#/skrzynka'); await klikJs(s, '.lista a.wiersz-listy'); });
  dodaj('Nie ma takiej strony', (s) => idzDo(s, '#/skrzynka/nie-ma-takiej'));
  dodaj('Brak dokumentu', (s) => idzDo(s, '#/dokument/nie-ma-takiego'));
  /* Sprawa A — zgubione dokumenty */
  dodaj('Sprawa A, krok 1', (s) => idzDo(s, '#/sprawa/zgubione'));
  dodaj('Sprawa A, krok 1 z błędem', async (s) => {
    await s.js(`document.querySelectorAll('input[name="zginelo"]').forEach((i) => { if (i.checked) i.click(); })`);
    await wyslijFormularz(s);
  });
  dodaj('Sprawa A, krok 2', async (s) => { await zaznacz(s, 'zginelo', 'dowod'); await zaznacz(s, 'zginelo', 'karty'); await zaznacz(s, 'zginelo', docs[1] === 'pojazdy' ? 'inne' : docs[1]); await zaznacz(s, 'zginelo', 'inne'); await wyslijFormularz(s); });
  dodaj('Sprawa A, krok 2 z błędem', async (s) => {
    await s.js(`document.querySelectorAll('[data-akcja="przelacz-dzialanie"][aria-checked="true"]').forEach((b) => b.click())`);
    await wyslijFormularz(s);
  });
  dodaj('Sprawa A, krok 3', async (s) => { await s.js(`document.querySelectorAll('[data-akcja="przelacz-dzialanie"][aria-checked="false"]').forEach((b) => b.click())`); await wyslijFormularz(s); });
  dodaj('Okno: Potwierdź odciskiem palca', (s) => klikJs(s, '[data-akcja="potwierdz"]'));
  dodaj('Sprawa A, Gotowe', async (s) => { await klikJs(s, '[data-akcja="potwierdz-wyslij"]'); await czekaj(100); });
  dodaj('Sprawa A: Dowód się znalazł', (s) => idzDo(s, '#/sprawa/zgubione/znaleziony'));
  dodaj('Dokumenty po sprawie A (mDowód unieważniony)', async (s) => { await zamknijOkno(s); await idzDo(s, '#/dokumenty'); });
  dodaj('Szczegóły mDowodu po sprawie A', (s) => idzDo(s, '#/dokument/dowod'));
  /* Sprawa B — samochód */
  dodaj('Sprawa B, krok 1', (s) => idzDo(s, '#/sprawa/samochod'));
  if (osoba === 'tomasz') {
    dodaj('Sprawa B, krok 2', (s) => idzDo(s, '#/sprawa/samochod/krok-2'));
    dodaj('Sprawa B, krok 2 z błędem', async (s) => { await zaznacz(s, 'terminy', 'oc', false); await zaznacz(s, 'terminy', 'badanie', false); await wyslijFormularz(s); });
    dodaj('Sprawa B, Gotowe', async (s) => { await zaznacz(s, 'terminy', 'oc'); await zaznacz(s, 'sposob', 'sms'); await wyslijFormularz(s); await czekaj(80); });
    dodaj('Sprawa B, krok 1 z ustawionym przypomnieniem', (s) => idzDo(s, '#/sprawa/samochod'));
  }
  /* Sprawa C — zameldowanie */
  dodaj('Sprawa C, krok 1', (s) => idzDo(s, '#/sprawa/zameldowanie'));
  dodaj('Sprawa C, krok 1 z błędami', async (s) => {
    await ustawPole(s, 'm-ulica', 'Lipowa'); await ustawPole(s, 'm-mieszkanie', '5/2'); await ustawPole(s, 'm-kod', '801'); await ustawPole(s, 'm-miejscowosc', '');
    await wyslijFormularz(s);
  });
  dodaj('Sprawa C, krok 2', async (s) => {
    await ustawPole(s, 'm-ulica', 'ul. Klonowa 8'); await ustawPole(s, 'm-mieszkanie', '5'); await ustawPole(s, 'm-kod', '80-180'); await ustawPole(s, 'm-miejscowosc', 'Gdańsk');
    await wyslijFormularz(s);
  });
  dodaj('Sprawa C, krok 2 z błędem', async (s) => { await zaznacz(s, 'od', 'inna'); await ustawPole(s, 'm-data', '31.02.2026'); await wyslijFormularz(s); });
  dodaj('Sprawa C, krok 3', async (s) => { await zaznacz(s, 'od', 'dzis'); await wyslijFormularz(s); });
  dodaj('Sprawa C, krok 3 z błędem', (s) => wyslijFormularz(s));
  dodaj('Sprawa C, krok 4', async (s) => { await zaznacz(s, 'podstawa', 'wynajem'); await wyslijFormularz(s); });
  dodaj('Sprawa C, Gotowe', async (s) => { await klikJs(s, '[data-akcja="potwierdz"]'); await klikJs(s, '[data-akcja="potwierdz-wyslij"]'); await czekaj(100); });
  if (o.nowe !== false) require('./ekrany-nowe').dodajNowe(dodaj, osoba, { idzDo, klikJs, zamknijOkno, ustawPole, zaznacz, wyslijFormularz, zapytaj });
  dodaj('Skrzynka po sprawach', (s) => idzDo(s, '#/skrzynka'));
  dodaj('Wiadomość: potwierdzenie sprawy', async (s) => { await idzDo(s, '#/skrzynka'); await klikJs(s, '.lista a.wiersz-listy'); });
  dodaj('Dokumenty po sprawach', (s) => idzDo(s, '#/dokumenty'));
  return K;
}

module.exports = { trasa, idzDo, klikJs, zamknijOkno, ustawPole, zaznacz, wyslijFormularz, zapytaj };

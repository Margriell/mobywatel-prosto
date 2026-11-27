/* Trasa po ekranach nowych spraw (pakiet scenariuszy): każdy krok, błędy przy polach, ekrany dodatkowe
   („Zadzwoń pod 112”, „Wezwij policję”, kalkulator PCC, „Dowód się znalazł”), okna potwierdzenia, Gotowe,
   pisma w Skrzynce i ekrany „ta sprawa Cię nie dotyczy” u pozostałych osób.
   Dołączana do trasy z ekrany.js (po sprawach A, B, C), więc mDowód jest już unieważniony, a PESEL zastrzeżony. */
'use strict';

function dodajNowe(dodaj, osoba, h) {
  const { idzDo, klikJs, zamknijOkno, ustawPole, zaznacz, wyslijFormularz } = h;
  const potwierdz = (nazwa) => {
    dodaj(nazwa + ': okno potwierdzenia', (s) => klikJs(s, '[data-akcja="potwierdz"]'));
    dodaj(nazwa + ': Gotowe', async (s) => { await klikJs(s, '[data-akcja="potwierdz-wyslij"]'); });
  };
  const akcja = (co) => (s) => klikJs(s, '[data-akcja="kreator"][data-co="' + co + '"]');
  const tomasz = osoba === 'tomasz', halina = osoba === 'halina';

  /* D — Zapłać podatek (Halina) i mandat (Tomasz); u innych ekran „nie dotyczy” */
  dodaj('Zapłać podatek, krok 1', async (s) => { await zamknijOkno(s); await idzDo(s, '#/sprawa/podatek'); });
  if (halina) {
    dodaj('Zapłać podatek, krok 1 z błędem', (s) => wyslijFormularz(s));
    dodaj('Zapłać podatek, krok 2', async (s) => { await zaznacz(s, 'co', 'rata'); await wyslijFormularz(s); });
    dodaj('Zapłać podatek, krok 2 z błędem', (s) => wyslijFormularz(s));
    dodaj('Zapłać podatek, krok 3', async (s) => { await zaznacz(s, 'sposob', 'blik'); await wyslijFormularz(s); });
    potwierdz('Zapłać podatek');
    dodaj('Pismo z urzędu: opłacone częściowo', (s) => idzDo(s, '#/skrzynka/podatek'));
  }
  dodaj('Zapłać mandat, krok 1', (s) => idzDo(s, '#/sprawa/mandat'));
  if (tomasz) {
    dodaj('Zapłać mandat, krok 2', (s) => wyslijFormularz(s));
    dodaj('Zapłać mandat, krok 3', async (s) => { await zaznacz(s, 'sposob', 'karta'); await wyslijFormularz(s); });
    potwierdz('Zapłać mandat');
  }

  /* E — Stłuczka */
  dodaj('Stłuczka, krok 1', (s) => idzDo(s, '#/sprawa/stluczka'));
  dodaj('Stłuczka, krok 1 z błędem', (s) => wyslijFormularz(s));
  dodaj('Stłuczka: Zadzwoń pod 112', async (s) => { await zaznacz(s, 'ranny', 'tak'); await wyslijFormularz(s); });
  dodaj('Stłuczka, krok 2' + (tomasz ? '' : ' (osoba bez auta)'), async (s) => { await idzDo(s, '#/sprawa/stluczka'); await zaznacz(s, 'ranny', 'nie'); await wyslijFormularz(s); });
  if (tomasz) {
    dodaj('Stłuczka, krok 2 z błędem', (s) => wyslijFormularz(s));
    dodaj('Stłuczka, krok 2 po skanowaniu kodu', akcja('skanuj'));
    dodaj('Stłuczka, krok 3', (s) => wyslijFormularz(s));
    dodaj('Stłuczka: Wezwij policję', async (s) => { await zaznacz(s, 'sprawca', 'spor'); await wyslijFormularz(s); });
    dodaj('Stłuczka, krok 4', async (s) => { await idzDo(s, '#/sprawa/stluczka/krok-3'); await zaznacz(s, 'sprawca', 'drugi'); await wyslijFormularz(s); });
    dodaj('Stłuczka, krok 4 z błędami', async (s) => { await zaznacz(s, 'okol', 'inne'); await wyslijFormularz(s); });
    dodaj('Stłuczka, krok 5', async (s) => {
      await ustawPole(s, 's-opis', 'Auto cofało z miejsca parkingowego i zahaczyło mój zderzak.'); await ustawPole(s, 's-miejsce', 'Warszawa, parking przy ul. Słonecznej 4');
      await wyslijFormularz(s);
    });
    dodaj('Stłuczka, krok 5 z błędem', (s) => wyslijFormularz(s));
    dodaj('Stłuczka, krok 5: 3 zdjęcia', async (s) => { await akcja('zdjecie')(s); await akcja('zdjecie')(s); await akcja('zdjecie')(s); });
    dodaj('Stłuczka, krok 6 (sprawdź oświadczenie)', (s) => wyslijFormularz(s));
    potwierdz('Stłuczka');
    dodaj('Zgłoś szkodę, krok 1', (s) => idzDo(s, '#/sprawa/szkoda'));
    dodaj('Zgłoś szkodę, krok 2', async (s) => { await zaznacz(s, 'naprawa', 'kosztorys'); await wyslijFormularz(s); });
    potwierdz('Zgłoś szkodę');
  } else {
    dodaj('Zgłoś szkodę (bez oświadczenia)', (s) => idzDo(s, '#/sprawa/szkoda'));
  }

  /* F — Wniosek o dowód (po sprawie A dowód jest unieważniony) */
  dodaj('Wniosek o dowód, krok 1', (s) => idzDo(s, '#/sprawa/wniosek-dowod'));
  dodaj('Wniosek o dowód, krok 2', (s) => wyslijFormularz(s));
  dodaj('Wniosek o dowód, krok 2 z błędem', (s) => wyslijFormularz(s));
  dodaj('Wniosek o dowód, krok 3', async (s) => { await zaznacz(s, 'urzad', '0'); await wyslijFormularz(s); });
  dodaj('Wniosek o dowód, krok 4', async (s) => { await s.js(`document.querySelector('input[name="wizyta"]').click()`); await wyslijFormularz(s); });
  potwierdz('Wniosek o dowód');

  /* G — Cofnij zastrzeżenie PESEL */
  dodaj('Cofnij zastrzeżenie PESEL, krok 1', (s) => idzDo(s, '#/sprawa/cofnij-pesel'));
  dodaj('Cofnij zastrzeżenie PESEL, krok 1 z błędem daty', async (s) => { await zaznacz(s, 'naJak', 'czas'); await ustawPole(s, 'p-do', '01.01.2020'); await wyslijFormularz(s); });
  dodaj('Cofnij zastrzeżenie PESEL, krok 2', async (s) => { await zaznacz(s, 'naJak', 'stale'); await wyslijFormularz(s); });
  potwierdz('Cofnij zastrzeżenie PESEL');
  dodaj('Dowód się znalazł (po cofnięciu)', (s) => idzDo(s, '#/sprawa/zgubione/znaleziony'));

  /* H — Kupno auta */
  dodaj('Kupno auta, krok 1', (s) => idzDo(s, '#/sprawa/kupno-auta'));
  dodaj('Kupno auta, krok 1 z błędami', async (s) => { await ustawPole(s, 'k-numer', '1'); await ustawPole(s, 'k-vin', 'WVWZZZAUZHW12345O'); await ustawPole(s, 'k-data', '31.02.2017'); await wyslijFormularz(s); });
  dodaj('Kupno auta, krok 1 po zdjęciu dowodu rejestracyjnego', akcja('zdjecie-dowodu'));
  dodaj('Kupno auta, krok 2 (historia pojazdu)', (s) => wyslijFormularz(s));
  dodaj('Kupno auta: kalkulator PCC', async (s) => { await idzDo(s, '#/sprawa/kupno-auta/pcc'); await ustawPole(s, 'k-pcc', '45000'); });
  dodaj('Kupno auta, krok 3', (s) => idzDo(s, '#/sprawa/kupno-auta/krok-3'));
  dodaj('Kupno auta, krok 3 z błędami', async (s) => { await ustawPole(s, 'k-cena', 'dużo'); await wyslijFormularz(s); });
  dodaj('Kupno auta, krok 4 (sprawdź umowę)', async (s) => { await akcja('skanuj')(s); await ustawPole(s, 'k-cena', '32000'); await ustawPole(s, 'k-przebieg', '142100'); await wyslijFormularz(s); });
  potwierdz('Kupno auta');

  /* I — Urodzenie, 800 plus, Karta Dużej Rodziny */
  dodaj('Urodzenie dziecka, krok 1' + (tomasz ? '' : ' (nie dotyczy)'), (s) => idzDo(s, '#/sprawa/urodzenie'));
  if (tomasz) {
    dodaj('Dokumenty: dwie karty „Wymaga Twojej uwagi”', (s) => idzDo(s, '#/dokumenty'));
    dodaj('Urodzenie dziecka, krok 1 z błędem', async (s) => { await idzDo(s, '#/sprawa/urodzenie'); await ustawPole(s, 'u-imie', 'Zofia Maria'); await wyslijFormularz(s); });
    dodaj('Urodzenie dziecka, krok 2', async (s) => { await ustawPole(s, 'u-imie', 'Zofia'); await ustawPole(s, 'u-imie2', 'Maria'); await wyslijFormularz(s); });
    dodaj('Urodzenie dziecka, krok 3', (s) => wyslijFormularz(s));
    potwierdz('Urodzenie dziecka');
  }
  dodaj('800 plus, krok 1' + (tomasz ? '' : ' (nie dotyczy)'), (s) => idzDo(s, '#/sprawa/800plus'));
  if (tomasz) {
    dodaj('800 plus, krok 2', (s) => wyslijFormularz(s));
    dodaj('800 plus, krok 2 z błędem', (s) => wyslijFormularz(s));
    dodaj('800 plus, krok 3', async (s) => { await zaznacz(s, 'oswiadczenie', 'tak'); await wyslijFormularz(s); });
    potwierdz('800 plus');
  }
  dodaj('Karta Dużej Rodziny, krok 1' + (tomasz ? '' : ' (nie dotyczy)'), (s) => idzDo(s, '#/sprawa/karta-rodziny'));
  if (tomasz) {
    dodaj('Karta Dużej Rodziny, krok 2', (s) => wyslijFormularz(s));
    dodaj('Karta Dużej Rodziny, krok 3', async (s) => { await zaznacz(s, 'rodzaj', 'obie'); await wyslijFormularz(s); });
    potwierdz('Karta Dużej Rodziny');
  }

  /* J — Zgłoś oszustwo do CERT Polska */
  dodaj('CERT, krok 1', (s) => idzDo(s, '#/sprawa/cert'));
  dodaj('CERT, krok 1 z błędami', (s) => wyslijFormularz(s));
  dodaj('CERT, krok 2', async (s) => { await zaznacz(s, 'rodzaj', 'sms'); await ustawPole(s, 'c-tresc', 'Twoja paczka czeka. Dopłać 1,89 zł: paczka-dostawa24.xyz/oplata'); await wyslijFormularz(s); });
  dodaj('CERT, krok 3 (podano dane karty)', async (s) => { await zaznacz(s, 'dane', 'tak'); await wyslijFormularz(s); });
  potwierdz('CERT');

  /* K — Odpis aktu */
  dodaj('Odpis aktu, krok 1', (s) => idzDo(s, '#/sprawa/odpis'));
  dodaj('Odpis aktu, krok 2', async (s) => { await zaznacz(s, 'akt', halina ? 'zgonu' : 'urodzenia'); await wyslijFormularz(s); });
  dodaj('Odpis aktu, krok 3', async (s) => { await s.js(`(() => { const r = document.querySelector('input[name="czyj"]'); if (r && !r.checked) r.click(); return true; })()`); await wyslijFormularz(s); });
  dodaj('Odpis aktu, krok 4', async (s) => { await zaznacz(s, 'odpis', 'wielojezyczny'); await wyslijFormularz(s); });
  dodaj('Odpis aktu, krok 4 z błędem', async (s) => { await zaznacz(s, 'cel', 'inny'); await wyslijFormularz(s); });
  dodaj('Odpis aktu, krok 5', async (s) => { await ustawPole(s, 'o-cel', 'do banku'); await wyslijFormularz(s); });
  potwierdz('Odpis aktu');
  if (osoba === 'ola') dodaj('Odpis aktu: akt małżeństwa (brak w rejestrze)', async (s) => { await idzDo(s, '#/sprawa/odpis'); await zaznacz(s, 'akt', 'malzenstwa'); await wyslijFormularz(s); });

  /* Asystent: nowe sprawy w rozmowie */
  dodaj('Asystent: stłuczka, SMS (dane podane), kupno auta, co mam do załatwienia', async (s) => {
    await idzDo(s, '#/asystent');
    for (const z of ['ktoś mi wjechał w tył auta', 'Czy ten SMS to oszustwo? „Twoja paczka jest wstrzymana. Dopłać 1,89 zł w ciągu 24 h: paczka-dostawa24.xyz/oplata”']) await h.zapytaj(s, z);
    await s.js(`(() => { const b = [...document.querySelectorAll('[data-akcja="wybor-jeden"]')]; const t = b.find((x) => x.getAttribute('data-wartosc') === 'tak' && x.getAttribute('data-wybor') === 'sms-dane'); if (t) t.click(); return true; })()`);
    for (const z of ['kupuję używane auto', 'Co mam do załatwienia?']) await h.zapytaj(s, z);
  });
  dodaj('Skrzynka: pismo z metryczką (pierwsza wiadomość)', async (s) => { await idzDo(s, '#/skrzynka'); await klikJs(s, '.lista a.wiersz-listy'); });
}

module.exports = { dodajNowe };

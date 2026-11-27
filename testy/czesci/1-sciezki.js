/* CZĘŚĆ 1 — ścieżki użytkowników.
   Halina, Tomasz i Ola przechodzą sprawy A, B, C każdą drogą (Usługi, asystent, szczegóły dokumentu,
   karta „Wymaga Twojej uwagi”, Skrzynka, okno „Niedostępne w prototypie”), szybkie sprawy i ogólne pytania.
   Liczymy dotknięcia (kliknięcia) od ekranu Dokumenty do celu. Kliknięcia są prawdziwe (mysz w środek elementu). */
'use strict';
const { otworz, trasa, tekstGlowny, oknoOtwarte, stan } = require('../lib/aplikacja');
const { czekaj } = require('../lib/przegladarka');

const NAZWA = 'Część 1 — ścieżki użytkowników';

/* Wykonuje kroki scenariusza; zwraca liczbę dotknięć i czy było pisanie */
async function wykonaj(s, kroki) {
  let dotkniecia = 0, pisanie = 0;
  for (const k of kroki) {
    const [rodzaj, ...reszta] = k.split(':');
    const arg = reszta.join(':');
    if (rodzaj === 'nav') { await s.klikTekst(arg, { zakres: '#nawigacja' }); dotkniecia++; }
    else if (rodzaj === 't') { await s.klikTekst(arg); dotkniecia++; }
    else if (rodzaj === 's') { await s.klik(arg); dotkniecia++; }
    else if (rodzaj === 'pole') { await s.klik('#pole-asystenta'); dotkniecia++; await czekaj(200); }
    else if (rodzaj === 'pisz') {
      await s.klik('#pole-asystenta'); dotkniecia++;
      await s.pisz(arg); pisanie++;
      await s.klik('#przycisk-mow'); dotkniecia++; /* „Wyślij” */
    } else if (rodzaj === 'szukaj') { await s.klik('#szukaj'); dotkniecia++; await s.pisz(arg); pisanie++; await czekaj(80); }
    else if (rodzaj === 'wpisz') { /* wpisz:id=tekst — pole formularza */
      const [id, tekst] = arg.split('=');
      await s.klik('#' + id); dotkniecia++;
      await s.js((i) => { const e = document.getElementById(i); e.select(); return true; }, id);
      await s.pisz(tekst); pisanie++;
    } else if (rodzaj === 'czekaj') await czekaj(+arg);
    else throw new Error('Nieznany krok: ' + k);
    await czekaj(rodzaj === 's' && /tyl/.test(arg) ? 520 : 60);
  }
  return { dotkniecia, pisanie };
}

const A_GOTOWE = /krok-4$/, B_GOTOWE = /samochod\/krok-3$/, C_GOTOWE = /zameldowanie\/krok-5$/;
const POTWIERDZ = ['t:Potwierdzam i wysyłam', 't:Potwierdź (w prototypie wystarczy kliknąć)'];

/* Scenariusze: [osoba, sprawa, droga, kroki, oczekiwany adres, oczekiwane zdanie na ekranie Gotowe, sprawdzenie skutków] */
function scenariusze() {
  const L = [];
  const usl = (osoba) => osoba === 'halina' ? ['nav:Usługi', 't:Dokumenty i tożsamość'] : ['nav:Usługi'];
  const uslBezp = (osoba) => osoba === 'halina' ? ['nav:Usługi', 't:Bezpieczeństwo'] : ['nav:Usługi'];
  const uslSam = (osoba) => osoba === 'halina' ? ['nav:Usługi', 't:Samochód'] : ['nav:Usługi'];
  const uslMiesz = (osoba) => osoba === 'halina' ? ['nav:Usługi', 't:Mieszkanie'] : ['nav:Usługi'];
  for (const o of ['halina', 'tomasz', 'ola']) {
    /* ---------- Sprawa A ---------- */
    L.push([o, 'A', 'Usługi → Zgłoś utratę lub kradzież dokumentów', [...usl(o), 't:Zgłoś utratę lub kradzież dokumentów', 't:Dowód osobisty', 't:Dalej', 't:Dalej', ...POTWIERDZ],
      A_GOTOWE, 'Twój dowód jest unieważniony, a PESEL zastrzeżony.', { dowodUniewazniony: true, pesel: true }]);
    L.push([o, 'A', 'Usługi → wyszukiwarka „pesel” → Zastrzeż PESEL', ['nav:Usługi', 'szukaj:pesel', 't:Zastrzeż PESEL', 't:Dalej', ...POTWIERDZ],
      A_GOTOWE, 'Twój PESEL jest zastrzeżony.', { pesel: true, dowodUniewazniony: false }]);
    L.push([o, 'A', 'Usługi → Bezpieczeństwo → Zastrzeż PESEL', [...uslBezp(o), 't:Zastrzeż PESEL', 't:Dalej', ...POTWIERDZ],
      A_GOTOWE, 'Twój PESEL jest zastrzeżony.', { pesel: true }]);
    L.push([o, 'A', 'mDowód → Pokaż szczegóły → Zgłoś utratę dowodu', ['s:.karta.przod .btn-pokaz', 't:Zgłoś utratę dowodu', 't:Dalej', 't:Dalej', ...POTWIERDZ],
      A_GOTOWE, 'Twój dowód jest unieważniony, a PESEL zastrzeżony.', { dowodUniewazniony: true, pesel: true }]);
    L.push([o, 'A', 'mDowód → Pokaż szczegóły → Zastrzeż PESEL', ['s:.karta.przod .btn-pokaz', 't:Zastrzeż PESEL', 't:Dalej', ...POTWIERDZ],
      A_GOTOWE, 'Twój PESEL jest zastrzeżony.', { pesel: true }]);
    L.push([o, 'A', 'Asystent (pisanie): „ukradli mi torebkę z dowodem i kartą”', ['pisz:ukradli mi torebkę z dowodem i kartą', 't:Dalej', 't:Zacznij', 't:Dalej', 't:Dalej', ...POTWIERDZ],
      A_GOTOWE, 'Twój dowód jest unieważniony, a PESEL zastrzeżony.', { dowodUniewazniony: true, pesel: true }]);
    if (o !== 'ola') {
      L.push([o, 'A', 'Zakładka Asystent → podpowiedź „Zginął mi portfel”', ['nav:Asystent', 't:Zginął mi portfel', 't:Dowód osobisty', 't:Dalej', 't:Zacznij', 't:Dalej', 't:Dalej', ...POTWIERDZ],
        A_GOTOWE, 'Twój dowód jest unieważniony, a PESEL zastrzeżony.', { dowodUniewazniony: true }]);
    } else {
      L.push([o, 'A', 'Zakładka Asystent → podpowiedź „Czy mój PESEL jest zastrzeżony?” → Zastrzeż PESEL', ['nav:Asystent', 't:Czy mój PESEL jest zastrzeżony?', 't:Zastrzeż PESEL', 't:Dalej', ...POTWIERDZ],
        A_GOTOWE, 'Twój PESEL jest zastrzeżony.', { pesel: true }]);
    }
    L.push([o, 'A', 'Kod QR → Pokaż swój kod → okno „Niedostępne” → Zgubione dokumenty', ['nav:Kod QR', 't:Pokaż swój kod', 't:Zgubione dokumenty', 't:Inne dokumenty', 't:Dalej', 't:Dalej', ...POTWIERDZ],
      A_GOTOWE, 'Twój PESEL jest zastrzeżony.', { pesel: true }]);
    /* ---------- Sprawa B ---------- */
    if (o === 'tomasz') {
      L.push([o, 'B', 'Karta „Kończy się OC” (Wymaga Twojej uwagi)', ['s:a.uwaga', 't:Przypomnij mi 7 dni przed terminem', 't:Ustaw przypomnienie'], B_GOTOWE, 'Przypomnienie ustawione.', { przypomnienie: true }]);
      L.push([o, 'B', 'Moje pojazdy → Pokaż szczegóły → OC i badanie techniczne', ['s:.karta.tyl button[data-id="pojazdy"]', 's:.karta.przod .btn-pokaz', 't:OC i badanie techniczne', 't:Przypomnij mi 7 dni przed terminem', 't:Ustaw przypomnienie'], B_GOTOWE, 'Przypomnienie ustawione.', { przypomnienie: true }]);
      L.push([o, 'B', 'Usługi → OC i badanie techniczne', [...uslSam(o), 't:OC i badanie techniczne', 't:Przypomnij mi 7 dni przed terminem', 't:SMS', 't:Ustaw przypomnienie'], B_GOTOWE, 'Przypomnienie ustawione.', { przypomnienie: true, sms: true }]);
      L.push([o, 'B', 'Asystent (podpowiedź): „Do kiedy mam OC?” → Zacznij', ['pole:', 't:Do kiedy mam OC?', 't:Zacznij', 't:Ustaw przypomnienie'], B_GOTOWE, 'Przypomnienie ustawione.', { przypomnienie: true }]);
      L.push([o, 'B', 'Asystent (pisanie): „kiedy mam przegląd auta” → Zacznij', ['pisz:kiedy mam przegląd auta', 't:Zacznij', 't:Ustaw przypomnienie'], B_GOTOWE, 'Przypomnienie ustawione.', { przypomnienie: true, badanie: true }]);
      L.push([o, 'B', 'Skrzynka → „Kończy się OC…” → Sprawdź OC i badanie', ['s:a.ikona-btn[href="#/skrzynka"]', 't:Kończy się OC Twojego samochodu', 't:Sprawdź OC i badanie', 't:Przypomnij mi 7 dni przed terminem', 't:Ustaw przypomnienie'], B_GOTOWE, 'Przypomnienie ustawione.', { przypomnienie: true }]);
      L.push([o, 'B', 'Asystent: „Co mam do załatwienia?” → Kończy się OC', ['pisz:Co mam do załatwienia?', 't:Kończy się OC', 't:Przypomnij mi 7 dni przed terminem', 't:Ustaw przypomnienie'], B_GOTOWE, 'Przypomnienie ustawione.', { przypomnienie: true }]);
    } else {
      L.push([o, 'B', 'Usługi → OC i badanie techniczne (osoba bez auta)', [...uslSam(o), 't:OC i badanie techniczne'], /samochod$/, 'Nie masz zarejestrowanego pojazdu w aplikacji.', null]);
      L.push([o, 'B', 'Asystent: „Do kiedy mam OC?” (osoba bez auta)', ['pisz:Do kiedy mam OC?'], /asystent$/, 'Nie masz zarejestrowanego pojazdu w aplikacji.', null]);
    }
    /* ---------- Sprawa C ---------- */
    const adres = o === 'ola' ? [] : ['wpisz:m-ulica=ul. Polna 12', 'wpisz:m-kod=21-100', 'wpisz:m-miejscowosc=Lublin'];
    if (o === 'ola') {
      L.push([o, 'C', 'Karta „Dokończ zameldowanie” (Wymaga Twojej uwagi)', ['s:a.uwaga', 't:Dalej', 't:Od dziś', 't:Dalej', 't:Wynajmuję mieszkanie', 't:Dalej', ...POTWIERDZ], C_GOTOWE, 'Wysłaliśmy wniosek o zameldowanie do urzędu gminy.', { zameldowanie: true }]);
      L.push([o, 'C', 'Asystent (podpowiedź): „Dokończ zameldowanie”', ['pole:', 't:Dokończ zameldowanie', 't:Wynajmuję', 't:Dokończ', 't:Dalej', 't:Od dziś', 't:Dalej', 't:Dalej', ...POTWIERDZ], C_GOTOWE, 'Wysłaliśmy wniosek o zameldowanie do urzędu gminy.', { zameldowanie: true }]);
    }
    L.push([o, 'C', 'Usługi → Zameldowanie na pobyt stały', [...uslMiesz(o), 't:Zameldowanie na pobyt stały', ...adres, 't:Dalej', 't:Od dziś', 't:Dalej', 't:Mieszkanie jest moje', 't:Dalej', ...POTWIERDZ], C_GOTOWE, 'Wysłaliśmy wniosek o zameldowanie do urzędu gminy.', { zameldowanie: true }]);
    L.push([o, 'C', 'Asystent (pisanie): „przeprowadziłam się, chcę się zameldować”', ['pisz:przeprowadziłam się, chcę się zameldować', 't:Wynajmuję', 't:' + (o === 'ola' ? 'Dokończ' : 'Zacznij'), ...adres, 't:Dalej', 't:Od dziś', 't:Dalej', 't:Dalej', ...POTWIERDZ], C_GOTOWE, 'Wysłaliśmy wniosek o zameldowanie do urzędu gminy.', { zameldowanie: true }]);
  }
  return L;
}

/* Szybkie sprawy i ogólne pytania: [osoba, droga, kroki, tekst, który musi być w odpowiedzi] */
function pytania() {
  const L = [];
  const P = (o, droga, kroki, oczek) => L.push([o, droga, kroki, oczek]);
  P('halina', 'podpowiedź „Wytłumacz mi pismo”', ['pole:', 't:Wytłumacz mi pismo'], 'To pismo z urzędu o podatku od nieruchomości na 2027 rok.');
  P('halina', 'podpowiedź „Czy ten SMS to oszustwo?”', ['pole:', 't:Czy ten SMS to oszustwo?'], 'To wygląda na oszustwo. Nie klikaj w link.');
  P('halina', 'podpowiedź „Gdzie użyć Karty Dużej Rodziny?”', ['nav:Asystent', 't:Gdzie użyć Karty Dużej Rodziny?'], 'Kartą Dużej Rodziny zapłacisz mniej');
  P('halina', 'Skrzynka → pismo → Wytłumacz prostym językiem', ['s:a.ikona-btn[href="#/skrzynka"]', 't:Podatek od nieruchomości na 2027 rok', 't:Wytłumacz prostym językiem'], 'To pismo z urzędu o podatku od nieruchomości na 2027 rok.');
  P('halina', 'SMS bez znaków oszustwa', ['pisz:Czy ten SMS to oszustwo? „Dzień dobry, jutro o 10 wizyta u lekarza rodzinnego. Przychodnia”'], 'Nie widzę typowych znaków oszustwa.');
  P('tomasz', 'podpowiedź „Do kiedy mam OC?”', ['pole:', 't:Do kiedy mam OC?'], 'OC samochodu Skoda Octavia jest ważne do');
  P('tomasz', 'podpowiedź „Ile mam punktów karnych?”', ['pole:', 't:Ile mam punktów karnych?'], 'Masz 4 punkty karne.');
  P('tomasz', 'podpowiedź „Czy mam mandat do zapłaty?”', ['pole:', 't:Czy mam mandat do zapłaty?'], 'Masz 1 mandat do zapłaty: 200 zł za przekroczenie prędkości.');
  P('ola', 'podpowiedź „Jaką zniżkę daje legitymacja?”', ['pole:', 't:Jaką zniżkę daje legitymacja?'], 'Legitymacja studencka daje zniżki');
  P('ola', 'podpowiedź „Gdzie głosuję?”', ['pole:', 't:Gdzie głosuję?'], 'Głosujesz w lokalu: Biblioteka Osiedlowa');
  P('ola', 'podpowiedź „Czy mój PESEL jest zastrzeżony?”', ['nav:Asystent', 't:Czy mój PESEL jest zastrzeżony?'], 'Twój PESEL nie jest zastrzeżony.');
  for (const o of ['halina', 'tomasz', 'ola']) {
    P(o, 'pokaż dowód', ['pisz:pokaż mój dowód'], 'Proszę, oto mDowód.');
    P(o, 'kod QR', ['pisz:pokaż kod QR'], 'Kod QR otworzysz w zakładce Kod QR.');
    P(o, 'ważność dowodu', ['pisz:do kiedy jest ważny mój dowód?'], 'Twój dowód osobisty jest ważny do');
    P(o, 'punkty karne', ['pisz:ile mam punktów karnych'], o === 'tomasz' ? 'Masz 4 punkty karne.' : 'Nie masz prawa jazdy w aplikacji');
    P(o, 'mandat', ['pisz:czy mam mandat'], o === 'tomasz' ? 'Masz 1 mandat do zapłaty' : 'Nie masz mandatów do zapłaty.');
    P(o, 'gdzie głosuję', ['pisz:gdzie głosuję'], 'Głosujesz w lokalu:');
    P(o, 'zniżki z legitymacji', ['pisz:jaką zniżkę daje legitymacja'], o === 'ola' ? 'Legitymacja studencka daje zniżki' : o === 'halina' ? 'Legitymacja emeryta-rencisty daje zniżki' : 'Nie masz');
    P(o, 'Karta Dużej Rodziny', ['pisz:gdzie użyć Karty Dużej Rodziny'], o === 'halina' ? 'Kartą Dużej Rodziny zapłacisz mniej' : 'Nie masz Karty Dużej Rodziny w aplikacji.');
    P(o, 'status PESEL', ['pisz:czy mój PESEL jest zastrzeżony'], 'Twój PESEL nie jest zastrzeżony.');
    P(o, 'wytłumacz pismo', ['pisz:wytłumacz mi pismo'], o === 'halina' ? 'To pismo z urzędu o podatku' : o === 'tomasz' ? 'To przypomnienie z aplikacji mObywatel, nie rachunek.' : 'W Twojej Skrzynce nie ma pisma z urzędu do wytłumaczenia.');
    P(o, 'ogólne: Co mam do załatwienia?', ['pisz:Co mam do załatwienia?'], 'Czeka na Ciebie');
    P(o, 'ogólne: Jakie mam dokumenty?', ['pisz:Jakie mam dokumenty?'], 'Masz w aplikacji');
    P(o, 'ogólne: Co umiesz?', ['pisz:Co umiesz?'], 'Pomogę załatwić sprawę krok po kroku albo odpowiem na pytanie.');
    P(o, 'ogólne: Mam nowe wiadomości?', ['pisz:Mam nowe wiadomości?'], o === 'ola' ? 'Nie masz nowych wiadomości.' : 'Masz 1 nową wiadomość.');
    P(o, 'ogólne: Dzień dobry', ['pisz:Dzień dobry'], 'Dzień dobry, ' + { halina: 'Halino', tomasz: 'Tomaszu', ola: 'Olu' }[o] + '.');
    P(o, 'ogólne: Dziękuję', ['pisz:Dziękuję'], 'Proszę bardzo.');
    P(o, 'ogólne: Pomoc', ['pisz:Pomoc'], 'Pomogę załatwić sprawę krok po kroku');
    P(o, 'nie na temat: Lubisz koty?', ['pisz:Lubisz koty?'], 'Nie rozumiem jeszcze tej prośby.');
  }
  return L;
}

/* Wszystkie przyciski ostatniej odpowiedzi asystenta muszą dokądś prowadzić (bez ślepych zaułków) */
async function sprawdzPrzyciskiOdpowiedzi(s) {
  const przyciski = await s.js(() => {
    const w = [...document.querySelectorAll('.wiad.asystent')].pop();
    if (!w) return null;
    return [...w.querySelectorAll('a.btn, button.btn, button.podpowiedz, .karta-sprawy a')].map((b) => ({ tekst: b.textContent.trim(), href: b.getAttribute('href'), akcja: b.getAttribute('data-akcja') }));
  });
  if (!przyciski) return 'brak odpowiedzi asystenta';
  if (!przyciski.length) return 'odpowiedź bez przycisków (ślepy zaułek)';
  for (const p of przyciski) {
    if (p.href && /^(tel|sms):/.test(p.href)) continue;
    if (p.href && !/^#\//.test(p.href)) return 'dziwny adres: ' + p.href;
  }
  return '';
}

module.exports = {
  nazwa: NAZWA,
  async uruchom(ctx) {
    const s = await ctx.przegladarka.nowaStrona({ szer: 390, wys: 844 });
    const tabela = [];
    for (const [osoba, sprawa, droga, kroki, cel, zdanie, skutki] of scenariusze()) {
      const nazwa = osoba + ' · sprawa ' + sprawa + ' · ' + droga;
      try {
        await otworz(s, ctx.baza, { osoba });
        const { dotkniecia, pisanie } = await wykonaj(s, kroki);
        await czekaj(150);
        const h = await trasa(s);
        const tekst = await tekstGlowny(s);
        let blad = '';
        if (!cel.test(h)) blad = 'zamiast celu jest ekran ' + h + ' („' + tekst.slice(0, 120) + '”)';
        else if (zdanie && tekst.indexOf(zdanie) < 0) blad = 'brak zdania „' + zdanie + '” (jest: „' + tekst.slice(0, 160) + '”)';
        if (!blad && skutki) {
          const st = await stan(s);
          const w = (st.wyniki || {})[osoba] || {};
          if (skutki.pesel && !w.pesel) blad = 'PESEL nie jest zastrzeżony po sprawie';
          if (skutki.dowodUniewazniony && !w.dowodUniewazniony) blad = 'mDowód nie jest unieważniony';
          if (skutki.dowodUniewazniony === false && w.dowodUniewazniony) blad = 'mDowód unieważniony, choć wybrano tylko PESEL';
          if (skutki.przypomnienie && !w.przypomnienie) blad = 'brak przypomnienia';
          if (skutki.sms && (!w.przypomnienie || w.przypomnienie.sposob !== 'sms')) blad = 'przypomnienie nie jest SMS-em';
          if (skutki.badanie && (!w.przypomnienie || !w.przypomnienie.badanie)) blad = 'brak przypomnienia o badaniu';
          if (skutki.zameldowanie && !w.zameldowanie) blad = 'brak wniosku o zameldowanie';
          if (!(w.wiadomosci || []).length) blad = blad || 'brak potwierdzenia w Skrzynce';
          /* Skutki widać w aplikacji */
          if (!blad && skutki.dowodUniewazniony) {
            await s.js(`location.hash = '#/dokumenty'`); await czekaj(150);
            const st2 = await s.js(`document.querySelector('.karta[data-id="dowod"] .karta-status').textContent`);
            if (st2.indexOf('Unieważniony') < 0) blad = 'karta mDowodu nie ma statusu „Unieważniony” (jest: ' + st2 + ')';
          }
          if (!blad && skutki.zameldowanie && osoba === 'ola') {
            await s.js(`location.hash = '#/dokumenty'`); await czekaj(150);
            const u = await s.js(`document.querySelector('.uwaga').textContent`);
            if (u.indexOf('Wniosek o zameldowanie wysłany') < 0) blad = 'karta uwagi Oli się nie zmieniła: ' + u;
          }
          if (!blad && skutki.pesel) {
            await s.js(`location.hash = '#/asystent'`); await czekaj(120);
            await s.js(`(() => { const p = document.getElementById('pole-asystenta'); p.value = 'czy mój PESEL jest zastrzeżony'; document.getElementById('asystent-pasek').requestSubmit(); return true; })()`);
            await czekaj(200);
            const odp = await s.js(`[...document.querySelectorAll('.wiad.asystent')].pop().textContent`);
            if (odp.indexOf('Tak, Twój PESEL jest zastrzeżony') < 0) blad = 'asystent nie wie, że PESEL jest zastrzeżony: ' + odp.slice(0, 80);
          }
        }
        tabela.push([osoba, sprawa, droga, dotkniecia + (pisanie ? ' + pisanie' : ''), blad ? '✗' : 'OK']);
        ctx.wynik(NAZWA, nazwa, !blad, blad || 'cel osiągnięty: ' + dotkniecia + ' dotknięć' + (pisanie ? ' i ' + pisanie + '× pisanie' : ''), 'poważny');
        ctx.ekran();
      } catch (e) {
        tabela.push([osoba, sprawa, droga, '—', '✗']);
        ctx.wynik(NAZWA, nazwa, false, e.message, 'poważny');
      }
      ctx.konsola(s, nazwa);
    }
    for (const [osoba, droga, kroki, oczek] of pytania()) {
      const nazwa = osoba + ' · asystent · ' + droga;
      try {
        await otworz(s, ctx.baza, { osoba });
        const { dotkniecia, pisanie } = await wykonaj(s, kroki);
        await czekaj(150);
        const odp = await s.js(`(() => { const w = [...document.querySelectorAll('.wiad.asystent')].pop(); return w ? w.innerText.replace(/\\s+/g, ' ') : ''; })()`);
        let blad = '';
        if (odp.indexOf(oczek) < 0) blad = 'oczekiwano „' + oczek + '”, jest: „' + odp.slice(0, 160) + '”';
        blad = blad || await sprawdzPrzyciskiOdpowiedzi(s);
        tabela.push([osoba, 'szybka', droga, dotkniecia + (pisanie ? ' + pisanie' : ''), blad ? '✗' : 'OK']);
        ctx.wynik(NAZWA, nazwa, !blad, blad || 'odpowiedź po ' + dotkniecia + ' dotknięciach' + (pisanie ? ' + pisanie' : '') + ': „' + odp.slice(0, 90) + '”', 'poważny');
        ctx.ekran();
      } catch (e) {
        ctx.wynik(NAZWA, nazwa, false, e.message, 'poważny');
      }
      ctx.konsola(s, nazwa);
    }
    ctx.stat.inne['Część 1: liczba dotknięć do celu'] = '\n\n| Osoba | Sprawa | Droga | Dotknięcia | Wynik |\n| --- | --- | --- | --- | --- |\n' + tabela.map((w) => '| ' + w.join(' | ') + ' |').join('\n') + '\n';
    await s.zamknij();
  }
};

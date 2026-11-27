/* CZĘŚĆ 9 — nowe sprawy (pakiet scenariuszy, 27.11.2026).
   Każda nowa sprawa każdą drogą (karta „Wymaga Twojej uwagi”, Usługi, asystent, Skrzynka, szczegóły dokumentu,
   „Co dalej” innej sprawy) — prawdziwymi kliknięciami, z liczeniem dotknięć. Na każdym kroku licznik „Krok X z N”,
   przed wysłaniem podsumowanie i okno potwierdzenia, potem Gotowe i nowa wiadomość w Skrzynce oraz skutki
   (status „Opłacone”, karta uwagi, PESEL). Do tego: osoby, których sprawa nie dotyczy (bez ślepego zaułka),
   „Co mam do załatwienia?”, podwójne kliknięcie, odświeżenie w środku sprawy, wejście adresem w środek sprawy,
   kod HTML w polu tekstowym, wklejony adres i zdania asystenta dla nowych spraw. */
'use strict';
const { otworz, trasa, tekstGlowny, stan } = require('../lib/aplikacja');
const { czekaj } = require('../lib/przegladarka');
const { zaladuj, kontekst, ocenOdpowiedz } = require('../lib/asystent-node');

const NAZWA = 'Część 9 — nowe sprawy';
const POTWIERDZ = ['t:Potwierdzam i wysyłam', 't:Potwierdź (w prototypie wystarczy kliknąć)'];
const ZAPLAC = ['t:Potwierdzam i płacę', 't:Potwierdź (w prototypie wystarczy kliknąć)'];

/* Kroki jak w Części 1; „sprawdz” zapisuje licznik kroku i podsumowanie po drodze */
async function wykonaj(s, kroki, slad) {
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
      await s.klik('#przycisk-mow'); dotkniecia++;
    } else if (rodzaj === 'wpisz') {
      const i = arg.indexOf('=');
      const id = arg.slice(0, i), tekst = arg.slice(i + 1);
      await s.klik('#' + id); dotkniecia++;
      await s.js((x) => { const e = document.getElementById(x); e.select(); return true; }, id);
      await s.pisz(tekst); pisanie++;
    } else if (rodzaj === 'adres') { await s.js((h) => { location.hash = h; return true; }, arg); await czekaj(150); }
    else throw new Error('Nieznany krok: ' + k);
    await czekaj(rodzaj === 's' && /tyl/.test(arg) ? 520 : 70);
    if (slad) slad.push(await s.js(`(() => { const l = document.querySelector('.krok-licznik b'); const g = document.getElementById('glowna');
      return { hash: location.hash, licznik: l ? l.textContent : '', podsumowanie: !!document.querySelector('[data-akcja="potwierdz"]') && /Co zrobimy/.test(g ? g.innerText : ''),
        okno: !!document.querySelector('dialog[open]') }; })()`));
  }
  return { dotkniecia, pisanie };
}

/* Scenariusze: [osoba, sprawa, droga, kroki, cel (adres), zdanie na Gotowe, sprawdzenie skutków (funkcja na stanie albo null)] */
function scenariusze() {
  const L = [];
  const usl = (o, kat) => o === 'halina' ? ['nav:Usługi', 't:' + kat] : ['nav:Usługi'];
  /* D — Zapłać podatek (Halina) */
  L.push(['halina', 'D podatek', 'Karta „Nowe pismo” → Wytłumacz prostym językiem → Zapłać podatek',
    ['s:a.uwaga', 't:Wytłumacz prostym językiem', 't:Zapłać podatek', 't:Całość: 412 zł', 't:Dalej', 't:BLIK', 't:Dalej', ...ZAPLAC],
    /podatek\/krok-4$/, 'Zapłacono 412 zł.', (w) => w.oplaty && w.oplaty.podatek && w.oplaty.podatek.zaplacono === 412 ? '' : 'podatek nie jest opłacony', 'Opłacone']);
  L.push(['halina', 'D podatek', 'Usługi → Podatki → Podatek od nieruchomości (rata, karta)',
    [...usl('halina', 'Podatki'), 't:Podatek od nieruchomości', 't:I rata: 103 zł', 't:Dalej', 't:Karta płatnicza', 't:Dalej', ...ZAPLAC],
    /podatek\/krok-4$/, 'Zapłacono 103 zł.', (w) => w.oplaty && w.oplaty.podatek.zaplacono === 103 ? '' : 'rata nie jest zapisana', 'Opłacone częściowo']);
  L.push(['halina', 'D podatek', 'Asystent (pisanie): „zapłać podatek” → Zacznij',
    ['pisz:zapłać podatek', 't:Zacznij', 't:Całość: 412 zł', 't:Dalej', 't:Szybki przelew z Twojego banku', 't:Dalej', ...ZAPLAC],
    /podatek\/krok-4$/, 'Zapłacono 412 zł.', null, 'Opłacone']);
  L.push(['halina', 'D podatek', 'Skrzynka → pismo → przycisk „Zapłać podatek”',
    ['s:a.ikona-btn[href="#/skrzynka"]', 't:Decyzja: podatek od nieruchomości na 2027 rok', 's:#glowna a.btn.glowny[href="#/sprawa/podatek"]', 't:Całość: 412 zł', 't:Dalej', 't:BLIK', 't:Dalej', ...ZAPLAC],
    /podatek\/krok-4$/, 'Zapłacono 412 zł.', null, null]);
  /* D — Zapłać mandat (Tomasz) */
  L.push(['tomasz', 'D mandat', 'Asystent (podpowiedź): „Czy mam mandat do zapłaty?” → Zapłać mandat',
    ['pole:', 't:Czy mam mandat do zapłaty?', 't:Zapłać mandat', 't:Dalej', 't:BLIK', 't:Dalej', ...ZAPLAC],
    /mandat\/krok-4$/, 'Zapłacono 200 zł.', (w) => w.oplaty && w.oplaty.mandat ? '' : 'mandat nie jest opłacony', null]);
  L.push(['tomasz', 'D mandat', 'Usługi → Mandaty i punkty karne', ['nav:Usługi', 't:Mandaty i punkty karne', 't:Dalej', 't:Karta płatnicza', 't:Dalej', ...ZAPLAC],
    /mandat\/krok-4$/, 'Zapłacono 200 zł.', null, null]);
  /* E — Stłuczka (Tomasz) */
  const stluczka = ['t:Zeskanuj kod drugiego kierowcy', 't:Dalej', 't:Drugi kierowca', 't:Dalej', 't:Najechanie na tył pojazdu', 'wpisz:s-miejsce=Warszawa, ul. Słoneczna 4', 't:Dalej',
    't:Zrób zdjęcie (1 z 3)', 't:Zrób zdjęcie (2 z 3)', 't:Dalej', ...POTWIERDZ];
  L.push(['tomasz', 'E stłuczka', 'Asystent (pisanie): „ktoś mi wjechał w tył” → Nie → Zacznij', ['pisz:ktoś mi wjechał w tył', 't:Nie, nikt nie jest ranny', 't:Zacznij', ...stluczka],
    /stluczka\/krok-7$/, 'Oświadczenie o zdarzeniu jest gotowe.', (w) => w.stluczka && w.stluczka.sprawca === 'drugi' ? '' : 'brak oświadczenia', null]);
  L.push(['tomasz', 'E stłuczka', 'Usługi → Zgłoś stłuczkę → Nie → … → Zgłoś szkodę ubezpieczycielowi sprawcy',
    ['nav:Usługi', 't:Zgłoś stłuczkę (mStłuczka)', 't:Nie, nikt nie jest ranny', 't:Dalej', ...stluczka, 't:Zgłoś szkodę ubezpieczycielowi sprawcy', 't:Naprawa w warsztacie', 't:Dalej', ...POTWIERDZ],
    /szkoda\/krok-3$/, 'Szkoda jest zgłoszona do ubezpieczyciela sprawcy.', (w) => w.szkoda ? '' : 'brak zgłoszenia szkody', null]);
  L.push(['tomasz', 'E stłuczka', 'Moje pojazdy → szczegóły → Zgłoś stłuczkę → Tak, ktoś jest ranny', ['s:.karta.tyl button[data-id="pojazdy"]', 's:.karta.przod .btn-pokaz', 't:Zgłoś stłuczkę (mStłuczka)', 't:Tak, ktoś jest ranny', 't:Dalej'],
    /stluczka\/112$/, 'Zadzwoń pod 112', null, null]);
  L.push(['tomasz', 'E stłuczka', 'Asystent: „miałem stłuczkę” → Tak, ktoś jest ranny', ['pisz:miałem stłuczkę', 't:Tak, ktoś jest ranny'], /asystent$/, 'Zadzwoń pod 112.', null, null]);
  L.push(['tomasz', 'E stłuczka', 'Spór o sprawcę → Wezwij policję', ['adres:#/sprawa/stluczka', 't:Nie, nikt nie jest ranny', 't:Dalej', 't:Zeskanuj kod drugiego kierowcy', 't:Dalej', 't:Nie jesteśmy zgodni', 't:Dalej'],
    /stluczka\/policja$/, 'Wezwijcie policję', null, null]);
  /* F — Wniosek o dowód (po zgłoszeniu utraty) */
  for (const o of ['halina', 'tomasz', 'ola']) {
    L.push([o, 'F wniosek o dowód', 'Sprawa A → Gotowe → Złóż wniosek o nowy dowód osobisty',
      [...usl(o, 'Dokumenty i tożsamość'), 't:Zgłoś utratę lub kradzież dokumentów', 't:Dowód osobisty', 't:Dalej', 't:Dalej', ...POTWIERDZ, 't:Złóż wniosek o nowy dowód osobisty',
        't:Dalej', 's:label.opcja:has(input[name="urzad"])', 't:Dalej', 's:label.opcja:has(input[name="wizyta"])', 't:Dalej', ...POTWIERDZ],
      /wniosek-dowod\/krok-5$/, 'Wizyta umówiona:', (w) => w.wniosekDowod ? '' : 'brak wizyty', null]);
  }
  /* G — Dowód się znalazł / cofnięcie zastrzeżenia */
  L.push(['ola', 'G cofnij zastrzeżenie', 'Zastrzeż PESEL → mDowód → Dowód się znalazł → Cofnij zastrzeżenie PESEL',
    ['nav:Usługi', 't:Zastrzeż PESEL', 't:Dalej', ...POTWIERDZ, 't:Wróć do Dokumentów', 's:.karta.przod .btn-pokaz', 't:Dowód się znalazł', 't:Cofnij zastrzeżenie PESEL', 't:Na stałe', 't:Dalej', ...POTWIERDZ],
    /cofnij-pesel\/krok-3$/, 'Zastrzeżenie PESEL jest cofnięte.', (w) => !w.pesel && w.peselCofniety ? '' : 'PESEL nadal zastrzeżony', null]);
  L.push(['halina', 'G cofnij zastrzeżenie', 'Asystent: „Zginął mi portfel” → … → Gotowe → Jak cofnąć zastrzeżenie PESEL (do daty)',
    ['nav:Asystent', 't:Zginął mi portfel', 't:Dowód osobisty', 't:Dalej', 't:Zacznij', 't:Dalej', ...POTWIERDZ, 't:Jak cofnąć zastrzeżenie PESEL', 't:Na określony czas', 'wpisz:p-do=31.12.2026', 't:Dalej', ...POTWIERDZ],
    /cofnij-pesel\/krok-3$/, 'Zastrzeżenie PESEL jest cofnięte do 31.12.2026.', null, null]);
  /* H — Kupno auta */
  for (const o of ['tomasz', 'ola']) {
    L.push([o, 'H kupno auta', 'Asystent: „chcę kupić używane auto” → Zacznij → zdjęcie dowodu → historia → umowa',
      ['pisz:chcę kupić używane auto', 't:Zacznij', 't:Zrób zdjęcie dowodu rejestracyjnego', 't:Dalej', 't:Przygotuj umowę kupna-sprzedaży', 't:Zeskanuj kod sprzedającego',
        'wpisz:k-cena=32000', 'wpisz:k-przebieg=142100', 't:Dalej', ...POTWIERDZ],
      /kupno-auta\/krok-5$/, 'Umowa kupna-sprzedaży jest gotowa.', (w) => w.kupno && w.kupno.cena === 32000 ? '' : 'brak umowy', null]);
  }
  L.push(['tomasz', 'H kupno auta', 'Usługi → Sprawdź auto przed zakupem → wpisane dane → PCC', ['nav:Usługi', 't:Sprawdź auto przed zakupem', 'wpisz:k-numer=WE 7777A', 'wpisz:k-vin=TMBJG7NE5K0123456',
    'wpisz:k-data=10.10.2019', 't:Dalej', 't:Ile zapłacę podatku PCC?', 'wpisz:k-pcc=45000'], /kupno-auta\/pcc$/, 'podatek PCC: 900 zł', null, null]);
  /* I — Urodzenie → 800 plus → Karta Dużej Rodziny (Tomasz) */
  L.push(['tomasz', 'I urodzenie, 800 plus, KDR', 'Karta „Zgłoś urodzenie dziecka” → Gotowe → 800 plus → Karta Dużej Rodziny',
    ['s:.lista-uwag li:nth-child(2) a.uwaga', 'wpisz:u-imie=Zofia', 't:Dalej', 't:Dalej', ...POTWIERDZ, 't:Złóż wniosek o 800 plus', 't:Dalej', 't:Oświadczam, że dane we wniosku są prawdziwe.', 't:Dalej', ...POTWIERDZ,
      't:Karta Dużej Rodziny dla dziecka', 't:Dalej', 't:Elektroniczna w mObywatelu', 't:Dalej', ...POTWIERDZ],
    /karta-rodziny\/krok-4$/, 'Wniosek o Kartę Dużej Rodziny trafił do gminy.', (w) => w.dziecko && w.swiadczenie800 && w.kartaRodziny ? '' : 'brak skutków (dziecko / 800 plus / karta)', null]);
  L.push(['tomasz', 'I urodzenie', 'Asystent: „urodziła mi się córka” → Zacznij', ['pisz:urodziła mi się córka', 't:Zacznij', 'wpisz:u-imie=Maria', 'wpisz:u-imie2=Zofia', 't:Dalej', 't:Zamelduję dziecko później', 't:Dalej', ...POTWIERDZ],
    /urodzenie\/krok-4$/, 'Urodzenie dziecka jest zgłoszone: Maria Zofia Kowalska.', (w) => w.dziecko && !w.dziecko.zameldowane ? '' : 'zły wybór meldunku', null]);
  L.push(['tomasz', 'I urodzenie', 'Usługi → Zgłoś urodzenie dziecka', ['nav:Usługi', 't:Zgłoś urodzenie dziecka', 'wpisz:u-imie=Anna', 't:Dalej', 't:Dalej', ...POTWIERDZ],
    /urodzenie\/krok-4$/, 'Urodzenie dziecka jest zgłoszone: Anna Kowalska.', null, null]);
  /* J — SMS → CERT Polska */
  for (const o of ['halina', 'tomasz', 'ola']) {
    L.push([o, 'J CERT', 'Asystent: fałszywy SMS → „Czy wpisano dane?” Tak → Zacznij',
      ['pisz:Czy ten SMS to oszustwo? „Twoja paczka jest wstrzymana. Dopłać 1,89 zł w ciągu 24 h: paczka-dostawa24.xyz/oplata”', 's:[data-wybor="sms-dane"][data-wartosc="tak"]', 't:Zacznij', ...POTWIERDZ],
      /cert\/krok-4$/, 'Zgłoszenie trafiło do CERT Polska.', (w) => w.cert ? '' : 'brak zgłoszenia', null]);
  }
  L.push(['ola', 'J CERT', 'Usługi → Zgłoś oszustwo (e-mail)', ['nav:Usługi', 't:Zgłoś oszustwo', 't:E-mail', 'wpisz:c-tresc=Twoje konto zostanie zablokowane, zaloguj się: bank-logowanie.top', 't:Dalej',
    's:label.opcja:has(input[name="dane"][value="nie"])', 't:Dalej', ...POTWIERDZ], /cert\/krok-4$/, 'Zgłoszenie trafiło do CERT Polska.', null, null]);
  /* K — Odpis aktu */
  L.push(['halina', 'K odpis', 'Asystent: „potrzebuję odpis aktu zgonu męża” → Zacznij', ['pisz:potrzebuję odpis aktu zgonu męża', 't:Zacznij', 't:Dalej', 't:Dalej', 't:Odpis skrócony', 't:Dalej',
    't:Do sprawy w urzędzie', 't:Dalej', ...POTWIERDZ], /odpis\/krok-6$/, 'Wysłaliśmy wniosek o odpis aktu.', (w) => (w.odpisy || []).some((x) => x.akt === 'zg-jan') ? '' : 'zły akt', null]);
  L.push(['ola', 'K odpis', 'Usługi → Odpis aktu stanu cywilnego', ['nav:Usługi', 't:Odpis aktu stanu cywilnego', 't:Akt urodzenia', 't:Dalej', 't:Dalej', 't:Odpis zupełny', 't:Dalej', 't:Do sprawy za granicą', 't:Dalej', ...POTWIERDZ],
    /odpis\/krok-6$/, 'Wysłaliśmy wniosek o odpis aktu.', null, null]);
  return L;
}

/* Sprawy, które osoby nie dotyczą: [osoba, adres, tekst] — musi być uprzejma informacja i przycisk dalej */
const NIE_DOTYCZY = [
  ['tomasz', '#/sprawa/podatek', 'Nie masz podatku do zapłaty w aplikacji.'], ['ola', '#/sprawa/podatek', 'Nie masz podatku do zapłaty w aplikacji.'],
  ['halina', '#/sprawa/mandat', 'Nie masz mandatów do zapłaty.'], ['ola', '#/sprawa/mandat', 'Nie masz mandatów do zapłaty.'],
  ['halina', '#/sprawa/stluczka/krok-2?ranny=nie', 'Nie masz pojazdu w aplikacji.'], ['ola', '#/sprawa/szkoda', 'Najpierw spisz oświadczenie o zdarzeniu.'],
  ['halina', '#/sprawa/urodzenie', 'W aplikacji nie ma karty urodzenia dziecka.'], ['ola', '#/sprawa/800plus', 'W aplikacji nie masz dziecka'],
  ['tomasz', '#/sprawa/800plus', 'Najpierw zgłoś urodzenie dziecka.'], ['halina', '#/sprawa/karta-rodziny', 'Masz już Kartę Dużej Rodziny.'],
  ['ola', '#/sprawa/karta-rodziny', 'Kartę Dużej Rodziny dostaje rodzina z co najmniej trojgiem dzieci.'], ['tomasz', '#/sprawa/cofnij-pesel', 'Twój PESEL nie jest zastrzeżony.'],
  ['halina', '#/sprawa/zgubione/znaleziony', 'Twój dowód jest ważny. Nie musisz nic robić.']
];

module.exports = {
  nazwa: NAZWA,
  async uruchom(ctx) {
    const W = (p, ok, sz, waga) => ctx.wynik(NAZWA, p, ok, sz, waga);
    const s = await ctx.przegladarka.nowaStrona({ szer: 390, wys: 844 });
    const tabela = [];

    /* ---------- 9.1 Każda sprawa każdą drogą ---------- */
    for (const [osoba, sprawa, droga, kroki, cel, zdanie, skutki, statusPisma] of scenariusze()) {
      const nazwa = osoba + ' · ' + sprawa + ' · ' + droga;
      try {
        await otworz(s, ctx.baza, { osoba });
        const nowePrzed = await s.js(`document.querySelectorAll('.licznik').length ? +document.querySelector('.licznik').textContent : 0`);
        const slad = [];
        const { dotkniecia, pisanie } = await wykonaj(s, kroki, slad);
        await czekaj(150);
        const h = await trasa(s);
        const tekst = await tekstGlowny(s);
        let blad = '';
        if (!cel.test(h)) blad = 'zamiast celu jest ekran ' + h + ' („' + tekst.slice(0, 140) + '”)';
        else if (zdanie && tekst.indexOf(zdanie) < 0) blad = 'brak „' + zdanie + '” (jest: „' + tekst.slice(0, 160) + '”)';
        /* Licznik kroków na każdym ekranie sprawy, podsumowanie i okno przed wysłaniem */
        const ekranySprawy = slad.filter((x) => /#\/sprawa\/[\w-]+(\/krok-\d+)?(\?|$)/.test(x.hash));
        if (!blad && ekranySprawy.some((x) => !/^Krok \d+ z \d+$/.test(x.licznik))) blad = 'ekran sprawy bez licznika „Krok X z N”: ' + ekranySprawy.filter((x) => !x.licznik).map((x) => x.hash).join(', ');
        if (!blad && /krok-\d+$/.test(cel.source) && /Gotowe|Zapłacono|gotowa|gotowe|zgłoszon|trafił|cofnięte|umówiona|Wysłaliśmy/.test(zdanie || '')) {
          if (!slad.some((x) => x.podsumowanie)) blad = 'przed wysłaniem nie było podsumowania „Co zrobimy” z przyciskiem potwierdzenia';
          else if (!slad.some((x) => x.okno)) blad = 'przed wysłaniem nie było okna potwierdzenia (odcisk palca / PIN)';
        }
        if (!blad && skutki) {
          const st = await stan(s);
          const w = (st.wyniki || {})[osoba] || {};
          blad = skutki(w) || '';
          if (!blad && !(w.wiadomosci || []).length) blad = 'brak wiadomości w Skrzynce';
          if (!blad) {
            const link = await s.js(`(() => { const a = document.querySelector('a.link-skrzynka'); return a ? a.getAttribute('href') : ''; })()`);
            if (!/^#\/skrzynka\/[\w-]+$/.test(link)) blad = 'na Gotowe brak „Potwierdzenie jest w Skrzynce” z linkiem do wiadomości';
            else {
              await s.js((l) => { location.hash = l; return true; }, link); await czekaj(150);
              const wiad = await tekstGlowny(s);
              if (!/Numer|Data|Adresat/.test(wiad)) blad = 'wiadomość w Skrzynce bez numeru i daty: „' + wiad.slice(0, 120) + '”';
            }
          }
          const nowePo = await s.js(`document.querySelectorAll('.licznik').length ? +document.querySelector('.licznik').textContent : 0`);
          if (!blad && nowePo < nowePrzed) { /* przeczytana — w porządku */ }
        }
        if (!blad && statusPisma) {
          await s.js(`location.hash = '#/skrzynka/podatek'`); await czekaj(150);
          const p = await tekstGlowny(s);
          if (p.indexOf(statusPisma) < 0) blad = 'pismo nie ma statusu „' + statusPisma + '”: „' + p.slice(0, 100) + '”';
          if (!blad && statusPisma === 'Opłacone' && await s.js(`!!document.querySelector('#glowna a[href="#/sprawa/podatek"]')`)) blad = 'opłacone pismo nadal ma przycisk „Zapłać podatek”';
        }
        tabela.push([osoba, sprawa, droga, dotkniecia + (pisanie ? ' + pisanie' : ''), blad ? '✗' : 'OK']);
        W(nazwa, !blad, blad || 'cel osiągnięty: ' + dotkniecia + ' dotknięć' + (pisanie ? ' i ' + pisanie + '× pisanie' : '') + '; licznik kroków na ' + ekranySprawy.length + ' ekranach', 'poważny');
        ctx.ekran();
      } catch (e) {
        tabela.push([osoba, sprawa, droga, '—', '✗']);
        W(nazwa, false, e.message, 'poważny');
      }
      ctx.konsola(s, nazwa);
    }
    ctx.stat.inne['Część 9: liczba dotknięć do celu (nowe sprawy)'] = '\n\n| Osoba | Sprawa | Droga | Dotknięcia | Wynik |\n| --- | --- | --- | --- | --- |\n' + tabela.map((w) => '| ' + w.join(' | ') + ' |').join('\n') + '\n';

    /* ---------- 9.2 Sprawa nie dotyczy osoby: uprzejma informacja i przycisk dalej ---------- */
    for (const [osoba, adres, oczek] of NIE_DOTYCZY) {
      try {
        await otworz(s, ctx.baza, { osoba, trasa: adres.slice(1) });
        await czekaj(100);
        const t = await tekstGlowny(s);
        const przyciski = await s.js(`[...document.querySelectorAll('#glowna a.btn, #glowna button.btn')].map((b) => b.getAttribute('href') || b.getAttribute('data-akcja'))`);
        const dalej = przyciski.filter((h) => h && h !== '#/dokumenty');
        W(osoba + ' · ' + adres + ' (nie dotyczy)', t.indexOf(oczek) >= 0 && dalej.length > 0,
          t.indexOf(oczek) < 0 ? 'brak „' + oczek + '”: „' + t.slice(0, 120) + '”' : dalej.length ? '„' + oczek + '” + przyciski: ' + przyciski.join(', ') : 'tylko „Wróć do Dokumentów” — brak drogi dalej', 'poważny');
      } catch (e) { W(osoba + ' · ' + adres + ' (nie dotyczy)', false, e.message, 'poważny'); }
    }

    /* ---------- 9.3 „Co mam do załatwienia?” — każda sprawa z działającym przyciskiem ---------- */
    for (const osoba of ['halina', 'tomasz', 'ola']) {
      try {
        await otworz(s, ctx.baza, { osoba, trasa: '/asystent' });
        await s.js(`(() => { const p = document.getElementById('pole-asystenta'); p.value = 'Co mam do załatwienia?'; document.getElementById('asystent-pasek').requestSubmit(); return true; })()`);
        await czekaj(250);
        const linki = await s.js(`[...[...document.querySelectorAll('.wiad.asystent')].pop().querySelectorAll('a.btn')].map((a) => [a.textContent.trim(), a.getAttribute('href')])`);
        const zle = [];
        for (const [t, h] of linki) {
          await s.js((x) => { location.hash = x; return true; }, h); await czekaj(150);
          const ekran = await s.js(`(() => { const h = document.querySelector('#tresc h1'); return (h ? h.textContent : '') + ' | ' + location.hash; })()`);
          if (/Nie ma takiej strony/.test(ekran) || /Brakuje odpowiedzi/.test(await tekstGlowny(s))) zle.push(t + ' → ' + ekran);
        }
        const oczek = { halina: ['podatek'], tomasz: ['OC', 'urodzenie', 'Mandat'], ola: ['zameldowanie'] }[osoba];
        const brak = oczek.filter((x) => !linki.some((l) => l[0].indexOf(x) >= 0));
        W(osoba + ' · „Co mam do załatwienia?” pokazuje wszystkie sprawy z działającymi przyciskami', !zle.length && !brak.length,
          (brak.length ? 'brak spraw: ' + brak.join(', ') + '. ' : '') + (zle.length ? 'zepsute: ' + zle.join(' · ') : linki.length + ' przycisków: ' + linki.map((l) => '„' + l[0] + '”').join(', ')), 'poważny');
      } catch (e) { W(osoba + ' · „Co mam do załatwienia?”', false, e.message, 'poważny'); }
    }

    /* ---------- 9.4 Podwójne kliknięcie „Potwierdzam i płacę” i „Potwierdź” — płatność tylko raz ---------- */
    try {
      await otworz(s, ctx.baza, { osoba: 'halina', trasa: '/sprawa/podatek' });
      await wykonaj(s, ['t:Całość: 412 zł', 't:Dalej', 't:BLIK', 't:Dalej']);
      await s.klikTekst('Potwierdzam i płacę', { ile: 2 }); await czekaj(150);
      await s.klikTekst('Potwierdź (w prototypie wystarczy kliknąć)', { ile: 2 }); await czekaj(200);
      const st = await stan(s);
      const w = st.wyniki.halina;
      const platnosci = w.oplaty && w.oplaty.podatek ? w.oplaty.podatek.platnosci.length : 0;
      const wiad = (w.wiadomosci || []).filter((x) => /płatności/.test(x.tytul)).length;
      W('Podwójne kliknięcie przy płatności: podatek zapłacony raz', platnosci === 1 && wiad === 1, platnosci + ' płatność, ' + wiad + ' potwierdzenie w Skrzynce, ekran ' + await trasa(s), 'krytyczny');
    } catch (e) { W('Podwójne kliknięcie przy płatności', false, e.message, 'krytyczny'); }

    /* ---------- 9.5 Odświeżenie w środku sprawy i wejście adresem w środek ---------- */
    try {
      await otworz(s, ctx.baza, { osoba: 'tomasz', trasa: '/sprawa/stluczka' });
      await wykonaj(s, ['t:Nie, nikt nie jest ranny', 't:Dalej', 't:Zeskanuj kod drugiego kierowcy', 't:Dalej', 't:Drugi kierowca', 't:Dalej']);
      await s.przeladuj(); await czekaj(200);
      const h1 = await trasa(s);
      await s.js(`location.hash = '#/sprawa/stluczka/krok-2'`); await czekaj(150);
      const t2 = await tekstGlowny(s);
      W('Odświeżenie w środku stłuczki: krok i zeskanowany kod zostają', /krok-4$/.test(h1) && t2.indexOf('Marek Zieliński') >= 0, 'po odświeżeniu: ' + h1 + '; krok 2: ' + (t2.indexOf('Marek Zieliński') >= 0 ? 'dane drugiego kierowcy są' : 'brak danych'), 'poważny');
      await otworz(s, ctx.baza, { osoba: 'tomasz', trasa: '/sprawa/stluczka/krok-6' });
      await czekaj(150);
      const h2 = await trasa(s), t3 = await tekstGlowny(s);
      W('Wejście adresem na „Sprawdź oświadczenie” bez odpowiedzi → pierwszy niewypełniony krok', /#\/sprawa\/stluczka$/.test(h2) && /Brakuje odpowiedzi/.test(t3), h2 + ' — „' + t3.slice(0, 90) + '”', 'poważny');
      await otworz(s, ctx.baza, { osoba: 'halina', trasa: '/sprawa/podatek/krok-4' });
      await czekaj(150);
      const h3 = await trasa(s);
      W('Wejście adresem na Gotowe płatności bez płacenia → krok 1 (nie fałszywe „Zapłacono”)', /#\/sprawa\/podatek$/.test(h3), h3, 'krytyczny');
    } catch (e) { W('Odświeżenie i wejście adresem w środek nowej sprawy', false, e.message, 'poważny'); }

    /* ---------- 9.6 Tekst użytkownika zawsze jako tekst (opis stłuczki, treść oszustwa) ---------- */
    try {
      await otworz(s, ctx.baza, { osoba: 'ola', trasa: '/sprawa/cert' });
      await s.js(`window.__xss = 0`);
      await wykonaj(s, ['t:Strona internetowa', 'wpisz:c-tresc=<img src=x onerror="window.__xss=1"><b>pogrubione</b>', 't:Dalej', 's:label.opcja:has(input[name="dane"][value="nie"])', 't:Dalej']);
      const naPodsumowaniu = await s.js(`!!document.querySelector('#glowna img, #glowna dd b')`);
      await wykonaj(s, POTWIERDZ);
      const link = await s.js(`document.querySelector('a.link-skrzynka').getAttribute('href')`);
      await s.js((l) => { location.hash = l; return true; }, link); await czekaj(200);
      const wSkrzynce = await s.js(`!!document.querySelector('#glowna img, .pismo b')`);
      const wykonane = await s.js(`window.__xss`);
      W('Kod HTML w treści zgłoszenia oszustwa pokazuje się jako tekst (podsumowanie i Skrzynka)', !naPodsumowaniu && !wSkrzynce && !wykonane,
        naPodsumowaniu || wSkrzynce || wykonane ? 'kod zadziałał jako HTML' : 'w podsumowaniu i w Skrzynce widać zwykły tekst „<img …><b>…</b>”', 'krytyczny');
    } catch (e) { W('Kod HTML w treści zgłoszenia', false, e.message, 'krytyczny'); }

    /* ---------- 9.7 Wklejony adres z kilku linijek i „m. 5” ---------- */
    try {
      await otworz(s, ctx.baza, { osoba: 'tomasz', trasa: '/sprawa/zameldowanie' });
      await s.js(`(() => { const p = document.getElementById('m-ulica'); p.focus(); const dt = new DataTransfer(); dt.setData('text/plain', 'ul. Lipowa 5 m. 3\\n80-180 Gdańsk');
        p.dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true })); return true; })()`);
      await czekaj(80);
      const pola = await s.js(`['m-ulica', 'm-mieszkanie', 'm-kod', 'm-miejscowosc'].map((i) => document.getElementById(i).value)`);
      W('Wklejony adres z dwóch linijek rozdziela się na pola', pola.join('|') === 'ul. Lipowa 5|3|80-180|Gdańsk', 'pola: ' + pola.map((p) => '„' + p + '”').join(', '), 'drobny');
      await s.js(`(() => { const p = document.getElementById('m-ulica'); p.value = ''; p.focus(); const dt = new DataTransfer(); dt.setData('text/plain', 'ul. Lipowa\\n5');
        p.dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true })); document.getElementById('m-mieszkanie').value = 'm. 5'; return true; })()`);
      const ulica = await s.js(`document.getElementById('m-ulica').value`);
      await s.klikTekst('Dalej'); await czekaj(150);
      const h = await trasa(s);
      const st = await s.js(`JSON.parse(sessionStorage.getItem('mobywatel-prosto-sesja')).szkice['tomasz:zameldowanie'].adres`);
      W('Wklejone „ul. Lipowa⏎5” nie skleja słów, a „m. 5” zmienia się w „5”', ulica === 'ul. Lipowa 5' && /krok-2$/.test(h) && st.mieszkanie === '5', 'ulica „' + ulica + '”, mieszkanie „' + st.mieszkanie + '”, ekran ' + h, 'drobny');
    } catch (e) { W('Wklejanie adresu', false, e.message, 'drobny'); }

    /* ---------- 9.8 Asystent: zdania nowych spraw (min. 15 na sprawę) i sprawdzian ---------- */
    const sb = zaladuj(ctx.katalog);
    for (const [plik, opis] of [['../zdania-sprawy.js', 'zdania nowych spraw'], ['../zdania-sprawy-sprawdzian.js', 'sprawdzian nowych spraw (zdania spoza poprawek)']]) {
      const zdania = require(plik);
      const grupy = {}, zle = [];
      let dobrze = 0, zaulki = 0;
      for (const [g, t, oczek] of zdania) {
        const r = sb.ASYSTENT.rozpoznajSprawe(t);
        grupy[g] = grupy[g] || [0, 0]; grupy[g][1]++;
        if (oczek.indexOf(r.sprawa) >= 0) { dobrze++; grupy[g][0]++; } else zle.push('„' + t + '” → ' + r.sprawa);
        for (const o of ['halina', 'tomasz', 'ola']) if (ocenOdpowiedz(sb, o, sb.ASYSTENT.odpowiedz(t, kontekst(sb, o))).length) zaulki++;
      }
      const proc = Math.round(dobrze / zdania.length * 1000) / 10;
      W('Asystent — ' + opis + ': ' + zdania.length + ' zdań', proc >= 95 && !zaulki, dobrze + ' z ' + zdania.length + ' (' + String(proc).replace('.', ',') + '%); ' +
        Object.entries(grupy).map(([g, [a, b]]) => g + ' ' + a + '/' + b).join(', ') + '; problemy w odpowiedziach: ' + zaulki + (zle.length ? '; źle: ' + zle.slice(0, 8).join(' · ') : ''), 'poważny');
      ctx.stat.inne['Część 9: ' + opis] = dobrze + ' z ' + zdania.length + ' (' + String(proc).replace('.', ',') + '%)';
    }
    const mniej = Object.entries(require('../zdania-sprawy.js').reduce((a, z) => { a[z[0]] = (a[z[0]] || 0) + 1; return a; }, {})).filter(([, n]) => n < 15);
    W('Co najmniej 15 sformułowań dla każdej nowej sprawy', !mniej.length, mniej.length ? 'za mało: ' + mniej.map(([g, n]) => g + ' ' + n).join(', ') : 'każda sprawa ma min. 15 zdań', 'poważny');

    ctx.konsola(s, NAZWA);
    await s.zamknij();
  }
};

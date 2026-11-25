/* =====================================================================
   mObywatel Prosto — dane prototypu. WSZYSTKIE DANE SĄ FIKCYJNE.
   Numery PESEL mają celowo błędną cyfrę kontrolną (nie należą do nikogo).
   Zwykły skrypt (bez modułów i bez fetch): działa po dwukliku i na GitHub Pages.
   ===================================================================== */
(function () {
  'use strict';

  /* Daty liczone od dzisiaj (np. OC Tomasza kończy się za 12 dni) */
  function dataZaDni(dni) {
    var d = new Date();
    d.setHours(12, 0, 0, 0);
    d.setDate(d.getDate() + dni);
    return d;
  }
  function formatuj(d) {
    return ('0' + d.getDate()).slice(-2) + '.' + ('0' + (d.getMonth() + 1)).slice(-2) + '.' + d.getFullYear();
  }
  var DZIS = formatuj(dataZaDni(0));
  var KONIEC_OC_TOMASZA = formatuj(dataZaDni(12));

  /* Wiadomość powitalna — ta sama dla każdej osoby */
  function powitanie() {
    return {
      id: 'witamy', nowa: false, nadawca: 'mObywatel', tytul: 'Witamy w aplikacji', data: formatuj(dataZaDni(-14)),
      tresc: ['Tu znajdziesz wiadomości z urzędów.', 'Tu trafią też potwierdzenia załatwionych spraw.']
    };
  }

  var OSOBY = {
    halina: {
      id: 'halina', imie: 'Halina', wolacz: 'Halino', nazwisko: 'Wiśniewska', inicjaly: 'HW', wiek: '71 lat',
      opis: 'Emerytka, pierwszy raz korzysta z aplikacji.',
      ustawienia: { tekst: 'duzy', motyw: 'jasny', prosty: true, czytanie: false },
      ustawieniaOpis: 'Duży tekst, tryb prosty',
      /* Kolejność = kolejność w portfelu; ostatnia karta leży z przodu */
      dokumenty: [
        { id: 'pojazdy', rodzaj: 'pojazdy', nazwa: 'Moje pojazdy', kolor: 'pojazdy', status: '1 pojazd',
          pojazdy: [{ marka: 'Toyota Yaris', numer: 'KR 7731C', rok: '2015', oc: '30.06.2027', ocPilne: false, badanie: '14.05.2027' }] },
        { id: 'prawko', rodzaj: 'prawko', nazwa: 'mPrawo jazdy', kolor: 'prawko', status: 'Ważne', ikonaStatusu: 'ok',
          dane: [['Imię i nazwisko', 'Halina Wiśniewska'], ['Kategorie', 'B'], ['Ważne do', '04.09.2033'],
            ['Numer prawa jazdy', '00412/03/1261'], ['Wydane przez', 'Prezydent Miasta Krakowa']] },
        { id: 'kdr', rodzaj: 'kdr', nazwa: 'Karta Dużej Rodziny', kolor: 'kdr', status: 'Ważna', ikonaStatusu: 'ok',
          dane: [['Imię i nazwisko', 'Halina Wiśniewska'], ['Numer karty', '12/2014/000184'], ['Ważna do', 'bezterminowo'],
            ['Wydana przez', 'Urząd Miasta Krakowa']] },
        { id: 'dowod', rodzaj: 'dowod', nazwa: 'mDowód', kolor: 'dowod', status: 'Ważny do 12.03.2031',
          dane: [['Imię i nazwisko', 'Halina Wiśniewska'], ['Data urodzenia', '14.03.1955'], ['Miejsce urodzenia', 'Kraków'],
            ['PESEL', '55031412345'], ['Obywatelstwo', 'polskie'], ['Seria i numer', 'XYZ 104233'],
            ['Ważny do', '12.03.2031'], ['Wydany przez', 'Prezydent Miasta Krakowa']] }
      ],
      uwaga: { styl: 'nowe', ikona: 'list', etykieta: 'Nowe pismo', opis: 'Urząd Miasta: podatek od nieruchomości', href: '#/skrzynka/podatek' },
      wiadomosci: [
        { id: 'podatek', nowa: true, nadawca: 'Urząd Miasta Krakowa', tytul: 'Podatek od nieruchomości na 2027 rok', data: DZIS,
          tresc: ['Masz do zapłaty 412 zł podatku od nieruchomości.', 'Możesz zapłacić od razu albo w czterech ratach.', 'Pierwsza rata: do 15 marca 2027.'],
          akcja: { tekst: 'Zapłać podatek', ikona: 'portfel', niedostepne: 'Płatność podatku' } },
        powitanie()
      ]
    },

    tomasz: {
      id: 'tomasz', imie: 'Tomasz', wolacz: 'Tomaszu', nazwisko: 'Kowalski', inicjaly: 'TK', wiek: '38 lat',
      opis: 'Kierowca, za 12 dni kończy mu się OC.',
      ustawienia: { tekst: 'standardowy', motyw: 'jasny', prosty: false, czytanie: false },
      ustawieniaOpis: 'Standardowy tekst, jasny motyw',
      dokumenty: [
        { id: 'pojazdy', rodzaj: 'pojazdy', nazwa: 'Moje pojazdy', kolor: 'pojazdy', status: 'OC: 12 dni', ikonaStatusu: 'uwaga',
          pojazdy: [{ marka: 'Skoda Octavia', numer: 'WX 4821K', rok: '2019', oc: KONIEC_OC_TOMASZA, ocPilne: true, badanie: '14.05.2027' }] },
        { id: 'prawko', rodzaj: 'prawko', nazwa: 'mPrawo jazdy', kolor: 'prawko', status: 'Ważne', ikonaStatusu: 'ok',
          dane: [['Imię i nazwisko', 'Tomasz Kowalski'], ['Kategorie', 'B, C, C+E'], ['Ważne do', '22.06.2031'],
            ['Numer prawa jazdy', '01877/06/1465'], ['Wydane przez', 'Prezydent m.st. Warszawy']] },
        { id: 'dowod', rodzaj: 'dowod', nazwa: 'mDowód', kolor: 'dowod', status: 'Ważny do 03.10.2030',
          dane: [['Imię i nazwisko', 'Tomasz Kowalski'], ['Data urodzenia', '22.06.1988'], ['Miejsce urodzenia', 'Warszawa'],
            ['PESEL', '88062254310'], ['Obywatelstwo', 'polskie'], ['Seria i numer', 'XYZ 552910'],
            ['Ważny do', '03.10.2030'], ['Wydany przez', 'Prezydent m.st. Warszawy']] }
      ],
      uwaga: { styl: 'pilne', ikona: 'uwaga', etykieta: 'Kończy się OC', opis: 'OC samochodu kończy się za 12 dni (' + KONIEC_OC_TOMASZA + ')', href: '#/sprawa/samochod' },
      wiadomosci: [
        { id: 'oc', nowa: true, nadawca: 'mObywatel', tytul: 'Kończy się OC Twojego samochodu', data: DZIS,
          tresc: ['OC samochodu Skoda Octavia (WX 4821K) jest ważne do ' + KONIEC_OC_TOMASZA + '.', 'Kup nowe OC albo przedłuż obecne, żeby uniknąć kary.'],
          akcja: { tekst: 'Sprawdź OC i badanie', ikona: 'auto', href: '#/sprawa/samochod' } },
        powitanie()
      ]
    },

    ola: {
      id: 'ola', imie: 'Ola', wolacz: 'Olu', nazwisko: 'Nowak', inicjaly: 'AN', wiek: '24 lata',
      opis: 'Studentka, lubi ciemny motyw.',
      ustawienia: { tekst: 'standardowy', motyw: 'ciemny', prosty: false, czytanie: false },
      ustawieniaOpis: 'Standardowy tekst, ciemny motyw',
      dokumenty: [
        { id: 'legitymacja', rodzaj: 'legitymacja', nazwa: 'mLegitymacja studencka', kolor: 'legitymacja', status: 'Ważna', ikonaStatusu: 'ok',
          dane: [['Imię i nazwisko', 'Aleksandra Nowak'], ['Uczelnia', 'Uniwersytet Gdański'], ['Numer albumu', '412377'], ['Ważna do', '31.03.2027']] },
        { id: 'prawko', rodzaj: 'prawko', nazwa: 'mPrawo jazdy', kolor: 'prawko', status: 'Ważne', ikonaStatusu: 'ok',
          dane: [['Imię i nazwisko', 'Aleksandra Nowak'], ['Kategorie', 'B'], ['Ważne do', '18.07.2035'],
            ['Numer prawa jazdy', '02931/20/2261'], ['Wydane przez', 'Prezydent Miasta Gdańska']] },
        { id: 'dowod', rodzaj: 'dowod', nazwa: 'mDowód', kolor: 'dowod', status: 'Ważny do 09.02.2032',
          dane: [['Imię i nazwisko', 'Aleksandra Nowak'], ['Data urodzenia', '09.02.2002'], ['Miejsce urodzenia', 'Gdańsk'],
            ['PESEL', '02220912346'], ['Obywatelstwo', 'polskie'], ['Seria i numer', 'XYZ 731045'],
            ['Ważny do', '09.02.2032'], ['Wydany przez', 'Prezydent Miasta Gdańska']] }
      ],
      uwaga: { styl: 'ok', ikona: 'ok', etykieta: 'Wszystko w porządku', opis: 'Nie masz spraw, które czekają.' },
      wiadomosci: [
        { id: 'legitymacja', nowa: false, nadawca: 'Uniwersytet Gdański', tytul: 'mLegitymacja jest gotowa', data: formatuj(dataZaDni(-3)),
          tresc: ['Twoja mLegitymacja studencka jest już w aplikacji.', 'Znajdziesz ją w zakładce Dokumenty.'],
          akcja: { tekst: 'Pokaż mLegitymację', ikona: 'czapka', href: '#/dokument/legitymacja' } },
        powitanie()
      ]
    }
  };

  /* Sprawy, które działają w prototypie (pokazywane w oknie „Niedostępne w prototypie”) */
  var DZIALAJACE = [
    { id: 'zgubione', nazwa: 'Zgubione dokumenty', ikona: 'dowod', href: '#/sprawa/zgubione' },
    { id: 'samochod', nazwa: 'Samochód: OC i badanie', ikona: 'auto', href: '#/sprawa/samochod' }
  ];

  /* Usługi według sytuacji życiowych. „slowa” = synonimy dla wyszukiwarki (bez polskich znaków) */
  var KATEGORIE = [
    { id: 'dokumenty', nazwa: 'Dokumenty i tożsamość', ikona: 'dowod', uslugi: [
      { id: 'utrata', nazwa: 'Zgłoś utratę lub kradzież dokumentów', opis: 'Unieważnij dowód i zastrzeż PESEL w jednym miejscu.', sprawa: 'zgubione',
        slowa: 'zgubic zgubilem zgubilam zgubiony zgubione zginal zginela zginelo zginely ukradli ukradziony kradziez portfel torebka utrata stracilem stracilam uniewaznic dowod osobisty zastrzec' },
      { id: 'wniosek-dowod', nazwa: 'Wniosek o dowód osobisty', opis: 'Złóż wniosek o nowy dowód, np. gdy kończy się ważność.', slowa: 'nowy dowod wymiana dowodu wyrobic dowod osobisty' },
      { id: 'paszport', nazwa: 'Paszport', opis: 'Sprawdź, czy Twój paszport jest gotowy do odbioru.', slowa: 'paszport wyjazd zagranica podroz' },
      { id: 'dane-pesel', nazwa: 'Twoje dane w rejestrze PESEL', opis: 'Zobacz, jakie dane o Tobie ma urząd.', slowa: 'pesel rejestr dane osobowe adres' }
    ] },
    { id: 'samochod', nazwa: 'Samochód', ikona: 'auto', uslugi: [
      { id: 'oc-badanie', nazwa: 'OC i badanie techniczne', opis: 'Sprawdź, do kiedy masz OC i przegląd. Ustaw przypomnienie.', sprawa: 'samochod',
        slowa: 'oc ubezpieczenie polisa przeglad badanie techniczne samochod auto pojazd przypomnienie' },
      { id: 'punkty', nazwa: 'Punkty karne', opis: 'Sprawdź, ile masz punktów karnych.', slowa: 'punkty karne mandat prawo jazdy' },
      { id: 'rejestracja', nazwa: 'Zarejestruj pojazd', opis: 'Zarejestruj samochód po zakupie.', slowa: 'rejestracja rejestrowac kupno zakup auta samochodu tablice' },
      { id: 'sprzedaz', nazwa: 'Zgłoś sprzedaż pojazdu', opis: 'Powiadom urząd, że sprzedajesz samochód.', slowa: 'sprzedaz sprzedac zbycie auta samochodu' }
    ] },
    { id: 'mieszkanie', nazwa: 'Mieszkanie', ikona: 'dom', uslugi: [
      { id: 'zameldowanie', nazwa: 'Zameldowanie', opis: 'Zamelduj się pod nowym adresem.', slowa: 'meldunek zameldowac zamelduj przeprowadzka nowy adres mieszkanie' },
      { id: 'wymeldowanie', nazwa: 'Wymeldowanie', opis: 'Wymelduj się, gdy się wyprowadzasz.', slowa: 'wymeldowac wymelduj wyprowadzka meldunek' },
      { id: 'ogrzewanie', nazwa: 'Zgłoś źródło ogrzewania', opis: 'Wpisz, czym ogrzewasz dom lub mieszkanie.', slowa: 'piec kociol ogrzewanie ceeb deklaracja' }
    ] },
    { id: 'rodzina', nazwa: 'Rodzina', ikona: 'rodzina', uslugi: [
      { id: 'wniosek-kdr', nazwa: 'Karta Dużej Rodziny', opis: 'Złóż wniosek o kartę dla rodziny z co najmniej trójką dzieci.', slowa: 'kdr karta duzej rodziny znizki dzieci' },
      { id: '800plus', nazwa: 'Rodzina 800 plus', opis: 'Złóż wniosek o świadczenie na dziecko.', slowa: '800 800+ swiadczenie dziecko zasilek' },
      { id: 'narodziny', nazwa: 'Zgłoś narodziny dziecka', opis: 'Nadaj dziecku PESEL i zamelduj je.', slowa: 'urodzenie narodziny dziecko noworodek pesel' },
      { id: 'odpis', nazwa: 'Odpis aktu stanu cywilnego', opis: 'Zamów odpis aktu urodzenia, małżeństwa lub zgonu.', slowa: 'akt urodzenia malzenstwa zgonu odpis slub' }
    ] },
    { id: 'zdrowie', nazwa: 'Zdrowie', ikona: 'serce', uslugi: [
      { id: 'recepty', nazwa: 'Recepty', opis: 'Zobacz swoje e-recepty i kod do apteki.', slowa: 'recepta erecepta leki lek apteka' },
      { id: 'skierowania', nazwa: 'Skierowania', opis: 'Sprawdź swoje e-skierowania do lekarza.', slowa: 'skierowanie lekarz specjalista badania' },
      { id: 'ubezpieczenie-zdrowotne', nazwa: 'Ubezpieczenie zdrowotne', opis: 'Sprawdź, czy masz ubezpieczenie zdrowotne.', slowa: 'nfz ewus ubezpieczenie zdrowotne' }
    ] },
    { id: 'podatki', nazwa: 'Podatki', ikona: 'paragon', uslugi: [
      { id: 'pit', nazwa: 'Rozlicz PIT', opis: 'Twój e-PIT jest gotowy, wystarczy go sprawdzić.', slowa: 'pit epit zeznanie rozliczenie podatek dochodowy urzad skarbowy' },
      { id: 'podatek-nieruchomosci', nazwa: 'Podatek od nieruchomości', opis: 'Sprawdź, ile i do kiedy zapłacić.', slowa: 'podatek nieruchomosci dom mieszkanie dzialka oplata' },
      { id: 'zaswiadczenie', nazwa: 'Zaświadczenie o niezaleganiu', opis: 'Pobierz zaświadczenie z urzędu skarbowego.', slowa: 'zaswiadczenie niezaleganie urzad skarbowy podatki' }
    ] },
    { id: 'bezpieczenstwo', nazwa: 'Bezpieczeństwo', ikona: 'tarcza', uslugi: [
      { id: 'zastrzez-pesel', nazwa: 'Zastrzeż PESEL', opis: 'Nikt nie weźmie kredytu na Twoje dane.', sprawa: 'zgubione',
        slowa: 'zastrzec zastrzezenie pesel kredyt wyludzenie oszustwo kradziez tozsamosci' },
      { id: 'alerty', nazwa: 'Ostrzeżenia o zagrożeniach', opis: 'Dostawaj ostrzeżenia o burzach i innych zagrożeniach.', slowa: 'alert rcb ostrzezenie burza powodz zagrozenie' },
      { id: 'mapa-zagrozen', nazwa: 'Zgłoś niebezpieczne miejsce', opis: 'Powiedz policji o zagrożeniu w Twojej okolicy.', slowa: 'policja zgloszenie mapa zagrozen niebezpieczne' }
    ] }
  ];

  window.DANE = {
    osoby: OSOBY,
    kolejnoscOsob: ['halina', 'tomasz', 'ola'],
    kategorie: KATEGORIE,
    najczestsze: ['utrata', 'oc-badanie', 'pit', 'recepty'],
    dzialajace: DZIALAJACE,
    /* Gotowe pytania: 3 pod polem asystenta, 4 na pustym ekranie Asystenta */
    pytania: ['Zginął mi portfel', 'Do kiedy mam OC?', 'Jak zastrzec PESEL?'],
    podpowiedziAsystenta: ['Zginął mi portfel', 'Do kiedy mam OC?', 'Jak zastrzec PESEL?', 'Co umiesz?'],
    nazwyDokumentow: { dowod: 'Dowód osobisty', prawko: 'Prawo jazdy', kdr: 'Karta Dużej Rodziny', legitymacja: 'Legitymacja studencka' },
    dzis: DZIS
  };
})();

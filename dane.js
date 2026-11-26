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

  /* Przykładowy fałszywy SMS (podpowiedź „Czy ten SMS to oszustwo?”) — adres strony wymyślony */
  var SMS_OSZUSTWO = 'Twoja paczka jest wstrzymana. Dopłać 1,89 zł w ciągu 24 h: paczka-dostawa24.xyz/oplata';

  /* Wiadomość powitalna — ta sama dla każdej osoby */
  function powitanie() {
    return {
      id: 'witamy', nowa: false, nadawca: 'mObywatel', tytul: 'Witamy w aplikacji', data: formatuj(dataZaDni(-14)),
      tresc: ['Tu znajdziesz wiadomości z urzędów.', 'Tu trafią też potwierdzenia załatwionych spraw.']
    };
  }

  /* Ostatnia aktualizacja dokumentu (np. „23.11.2026, 08:12”) */
  function aktualizacja(dni, godzina) { return formatuj(dataZaDni(-dni)) + ', ' + godzina; }

  /* Dokumenty: kolejność = kolejność w portfelu od góry; ostatni leży z przodu.
     pola = dane na karcie (jak na prawdziwym dokumencie); dane = sekcja „Dane” w szczegółach.
     Trzeci element: 'dlugie' (cała szerokość karty), 'alarm' (ostrzeżenie: ikona + słowa). */
  var OSOBY = {
    halina: {
      id: 'halina', imie: 'Halina', wolacz: 'Halino', nazwisko: 'Wiśniewska', inicjaly: 'HW', wiek: '71 lat',
      opis: 'Emerytka, pierwszy raz korzysta z aplikacji.',
      ustawienia: { tekst: 'duzy', motyw: 'jasny', prosty: true, czytanie: false },
      ustawieniaOpis: 'Duży tekst, tryb prosty',
      adres: 'ul. Lipowa 14 m. 3, 30-001 Kraków',
      lokalWyborczy: { nazwa: 'Szkoła Podstawowa nr 21', adres: 'ul. Lipowa 20, Kraków', obwod: '112' },
      telefon: '+48 ••• ••• 271',
      punktyKarne: null,
      mandaty: [],
      /* Gotowe pytania: 3 pierwsze pod polem asystenta, wszystkie 4 na pustym ekranie Asystenta */
      podpowiedzi: [
        { tekst: 'Wytłumacz mi pismo' },
        { tekst: 'Czy ten SMS to oszustwo?', pytanie: 'Czy ten SMS to oszustwo? „' + SMS_OSZUSTWO + '”' },
        { tekst: 'Gdzie użyć Karty Dużej Rodziny?' },
        { tekst: 'Zginął mi portfel' }
      ],
      dokumenty: [
        { id: 'kdr', rodzaj: 'kdr', nazwa: 'Karta Dużej Rodziny', kolor: 'kdr', status: 'Ważna', ikonaStatusu: 'ok',
          pola: [['Imię', 'Halina'], ['Nazwisko', 'Wiśniewska'], ['Numer karty', '12/2014/000184'], ['Ważność', 'bezterminowo']],
          dane: [['Imię', 'Halina'], ['Nazwisko', 'Wiśniewska'], ['Numer karty', '12/2014/000184'], ['Rodzaj karty', 'Rodzic'], ['Ważność', 'bezterminowo']],
          aktualizacja: aktualizacja(6, '10:24') },
        { id: 'emeryt', rodzaj: 'emeryt', nazwa: 'mLegitymacja emeryta-rencisty', kolor: 'emeryt', status: 'Ważna', ikonaStatusu: 'ok',
          pola: [['Imię', 'Halina'], ['Nazwisko', 'Wiśniewska'], ['PESEL', '55031412345'], ['Ważność', 'bezterminowo'], ['Organ wydający', 'ZUS', 'dlugie']],
          dane: [['Imię', 'Halina'], ['Nazwisko', 'Wiśniewska'], ['PESEL', '55031412345'], ['Organ wydający', 'Zakład Ubezpieczeń Społecznych (ZUS)'], ['Ważność', 'bezterminowo']],
          aktualizacja: aktualizacja(3, '09:05') },
        { id: 'dowod', rodzaj: 'dowod', nazwa: 'mDowód', kolor: 'dowod', status: 'Ważny', ikonaStatusu: 'ok',
          pola: [['Imię', 'Halina'], ['Nazwisko', 'Wiśniewska'], ['Data urodzenia', '14.03.1955'], ['PESEL', '55031412345']],
          dane: [['Seria i numer dowodu', 'XYZ 104233'], ['Termin ważności', '12.03.2031'], ['Data wydania', '12.03.2021'], ['Imię ojca', 'Stanisław'], ['Imię matki', 'Zofia']],
          dodatkowe: [['Nazwisko rodowe', 'Nowicka'], ['Miejsce urodzenia', 'Kraków'], ['Obywatelstwo', 'polskie']],
          aktualizacja: aktualizacja(2, '08:12') }
      ],
      uwaga: { styl: 'nowe', ikona: 'list', etykieta: 'Nowe pismo', opis: 'Urząd Miasta: podatek od nieruchomości', href: '#/skrzynka/podatek' },
      wiadomosci: [
        { id: 'podatek', nowa: true, nadawca: 'Urząd Miasta Krakowa', tytul: 'Podatek od nieruchomości na 2027 rok', data: DZIS,
          tresc: ['Masz do zapłaty 412 zł podatku od nieruchomości.', 'Możesz zapłacić od razu albo w czterech ratach.', 'Pierwsza rata: do 15 marca 2027.'],
          akcja: { tekst: 'Zapłać podatek', ikona: 'portfel', niedostepne: 'Płatność podatku' },
          slowa: 'podatek nieruchomosci urzad miasta 412 zl rata raty zaplacic',
          wyjasnienie: {
            wstep: 'To pismo z urzędu o podatku od nieruchomości na 2027 rok.',
            fakty: [['Od kogo', 'Urząd Miasta Krakowa'], ['Ile', '412 zł'],
              ['Do kiedy', 'Całość albo pierwsza rata do 15 marca 2027'],
              ['Co zrobić', 'Zapłać całość albo w 4 ratach. Pierwszą ratę zapłać do 15 marca 2027.']],
            platnosc: 'Płatność podatku'
          } },
        powitanie()
      ]
    },

    tomasz: {
      id: 'tomasz', imie: 'Tomasz', wolacz: 'Tomaszu', nazwisko: 'Kowalski', inicjaly: 'TK', wiek: '38 lat',
      opis: 'Kierowca, za 12 dni kończy mu się OC.',
      ustawienia: { tekst: 'standardowy', motyw: 'jasny', prosty: false, czytanie: false },
      ustawieniaOpis: 'Standardowy tekst, jasny motyw',
      adres: 'ul. Słoneczna 21 m. 8, 02-495 Warszawa',
      lokalWyborczy: { nazwa: 'Szkoła Podstawowa nr 7', adres: 'ul. Słoneczna 4, Warszawa', obwod: '54' },
      telefon: '+48 ••• ••• 412',
      punktyKarne: 4,
      mandaty: [{ kwota: '200 zł', za: 'przekroczenie prędkości', termin: formatuj(dataZaDni(10)) }],
      podpowiedzi: [
        { tekst: 'Do kiedy mam OC?' },
        { tekst: 'Ile mam punktów karnych?' },
        { tekst: 'Czy mam mandat do zapłaty?' },
        { tekst: 'Zginął mi portfel' }
      ],
      dokumenty: [
        { id: 'pojazdy', rodzaj: 'pojazdy', nazwa: 'Moje pojazdy', kolor: 'pojazdy', status: 'OC: 12 dni', ikonaStatusu: 'uwaga', alarm: true,
          pojazd: { marka: 'Skoda Octavia', numer: 'WX 4821K', oc: KONIEC_OC_TOMASZA, ocDni: 12, badanie: '14.05.2027',
            przypomnienieOc: formatuj(dataZaDni(5)), przypomnienieBadanie: '07.05.2027' },
          pola: [['Marka i model', 'Skoda Octavia'], ['Numer rejestracyjny', 'WX 4821K'],
            ['OC ważne do', KONIEC_OC_TOMASZA + ' — zostało 12 dni', 'alarm dlugie'], ['Badanie techniczne do', '14.05.2027', 'dlugie']],
          dane: [['Marka i model', 'Skoda Octavia'], ['Numer rejestracyjny', 'WX 4821K'],
            ['OC ważne do', KONIEC_OC_TOMASZA + ' — zostało 12 dni', 'alarm'], ['Badanie techniczne do', '14.05.2027']],
          aktualizacja: aktualizacja(1, '07:40') },
        { id: 'prawko', rodzaj: 'prawko', nazwa: 'mPrawo jazdy', kolor: 'prawko', status: 'Ważne', ikonaStatusu: 'ok',
          pola: [['Imię', 'Tomasz'], ['Nazwisko', 'Kowalski'], ['Kategorie', 'B, C, C+E'], ['Ważne do', '22.06.2031']],
          dane: [['Imię', 'Tomasz'], ['Nazwisko', 'Kowalski'], ['Kategorie', 'B, C, C+E'], ['Ważne do', '22.06.2031']],
          aktualizacja: aktualizacja(4, '18:31') },
        { id: 'dowod', rodzaj: 'dowod', nazwa: 'mDowód', kolor: 'dowod', status: 'Ważny', ikonaStatusu: 'ok',
          pola: [['Imię', 'Tomasz'], ['Nazwisko', 'Kowalski'], ['Data urodzenia', '22.06.1988'], ['PESEL', '88062254310']],
          dane: [['Seria i numer dowodu', 'XYZ 552910'], ['Termin ważności', '03.10.2030'], ['Data wydania', '03.10.2020'], ['Imię ojca', 'Andrzej'], ['Imię matki', 'Ewa']],
          dodatkowe: [['Nazwisko rodowe', 'Kowalski'], ['Miejsce urodzenia', 'Warszawa'], ['Obywatelstwo', 'polskie']],
          aktualizacja: aktualizacja(2, '08:12') }
      ],
      uwaga: { styl: 'pilne', ikona: 'uwaga', etykieta: 'Kończy się OC', opis: 'OC samochodu kończy się za 12 dni (' + KONIEC_OC_TOMASZA + ')', href: '#/sprawa/samochod' },
      wiadomosci: [
        { id: 'oc', nowa: true, nadawca: 'mObywatel', tytul: 'Kończy się OC Twojego samochodu', data: DZIS,
          tresc: ['OC samochodu Skoda Octavia (WX 4821K) jest ważne do ' + KONIEC_OC_TOMASZA + '.', 'Kup nowe OC albo przedłuż obecne, żeby uniknąć kary.'],
          akcja: { tekst: 'Sprawdź OC i badanie', ikona: 'auto', href: '#/sprawa/samochod' },
          slowa: 'oc ubezpieczenie przypomnienie skoda',
          wyjasnienie: {
            wstep: 'To przypomnienie z aplikacji mObywatel, nie rachunek.',
            fakty: [['Od kogo', 'mObywatel'], ['Czego dotyczy', 'OC samochodu Skoda Octavia (WX 4821K)'],
              ['Do kiedy', 'OC jest ważne do ' + KONIEC_OC_TOMASZA],
              ['Co zrobić', 'Kup nowe OC albo przedłuż obecne przed tą datą.']]
          } },
        powitanie()
      ]
    },

    ola: {
      id: 'ola', imie: 'Ola', wolacz: 'Olu', nazwisko: 'Nowak', inicjaly: 'AN', wiek: '24 lata',
      opis: 'Studentka, lubi ciemny motyw.',
      ustawienia: { tekst: 'standardowy', motyw: 'ciemny', prosty: false, czytanie: false },
      ustawieniaOpis: 'Standardowy tekst, ciemny motyw',
      adres: 'ul. Polna 2 m. 7, 80-001 Gdańsk',
      lokalWyborczy: { nazwa: 'Biblioteka Osiedlowa', adres: 'ul. Polna 10, Gdańsk', obwod: '23' },
      telefon: '+48 ••• ••• 538',
      punktyKarne: null,
      mandaty: [],
      /* Zaczęte zameldowanie: adres nowego mieszkania jest już wpisany */
      szkicMeldunku: { ulica: 'ul. Klonowa 8', mieszkanie: '5', kod: '80-180', miejscowosc: 'Gdańsk' },
      podpowiedzi: [
        { tekst: 'Dokończ zameldowanie' },
        { tekst: 'Jaką zniżkę daje legitymacja?' },
        { tekst: 'Gdzie głosuję?' },
        { tekst: 'Czy mój PESEL jest zastrzeżony?' }
      ],
      dokumenty: [
        { id: 'legitymacja', rodzaj: 'legitymacja', nazwa: 'mLegitymacja studencka', kolor: 'legitymacja', status: 'Ważna', ikonaStatusu: 'ok',
          pola: [['Imię', 'Aleksandra'], ['Nazwisko', 'Nowak'], ['Data urodzenia', '09.02.2002'], ['PESEL', '02220912346'],
            ['Nazwa uczelni', 'Uniwersytet Gdański', 'dlugie'], ['Numer albumu', '412377'], ['Data wydania', '04.10.2021']],
          dane: [['Imię', 'Aleksandra'], ['Nazwisko', 'Nowak'], ['Data urodzenia', '09.02.2002'], ['PESEL', '02220912346'],
            ['Nazwa uczelni', 'Uniwersytet Gdański'], ['Numer albumu', '412377'], ['Data wydania', '04.10.2021']],
          kod: '412377',
          komunikat: 'Dokument wymaga potwierdzenia danych',
          aktualizacja: aktualizacja(3, '12:47') },
        { id: 'dowod', rodzaj: 'dowod', nazwa: 'mDowód', kolor: 'dowod', status: 'Ważny', ikonaStatusu: 'ok',
          pola: [['Imię', 'Aleksandra'], ['Nazwisko', 'Nowak'], ['Data urodzenia', '09.02.2002'], ['PESEL', '02220912346']],
          dane: [['Seria i numer dowodu', 'XYZ 731045'], ['Termin ważności', '09.02.2032'], ['Data wydania', '09.02.2022'], ['Imię ojca', 'Piotr'], ['Imię matki', 'Anna']],
          dodatkowe: [['Nazwisko rodowe', 'Nowak'], ['Miejsce urodzenia', 'Gdańsk'], ['Obywatelstwo', 'polskie']],
          aktualizacja: aktualizacja(2, '08:12') }
      ],
      uwaga: { styl: 'nowe', ikona: 'dom', etykieta: 'Dokończ zameldowanie', opis: 'Nowy adres jest już wpisany. Sprawdź go i wyślij.', href: '#/sprawa/zameldowanie' },
      wiadomosci: [
        { id: 'legitymacja', nowa: false, nadawca: 'Uniwersytet Gdański', tytul: 'mLegitymacja jest gotowa', data: formatuj(dataZaDni(-3)),
          tresc: ['Twoja mLegitymacja studencka jest już w aplikacji.', 'Znajdziesz ją w zakładce Dokumenty.'],
          akcja: { tekst: 'Pokaż mLegitymację', ikona: 'czapka', href: '#/dokument/legitymacja' } },
        powitanie()
      ]
    }
  };

  /* Akcje w szczegółach dokumentu (jak w mObywatelu). „Usuń dokument” dokłada aplikacja.
     href = działa w prototypie; niedostepne = okno „Niedostępne w prototypie”. */
  var AKCJE = {
    dowod: {
      akcje: [
        { tekst: 'Potwierdź swoje dane osobiste', ikona: 'osobaOk', niedostepne: 'Potwierdź swoje dane osobiste' },
        { tekst: 'Dane dowodu osobistego', ikona: 'dowod', niedostepne: 'Dane dowodu osobistego' }
      ],
      skroty: [
        { tekst: 'Zastrzeż PESEL', ikona: 'tarcza', href: '#/sprawa/zgubione/krok-2?tylko=pesel' },
        { tekst: 'Zgłoś utratę dowodu', ikona: 'uwaga', href: '#/sprawa/zgubione?zginelo=dowod' },
        { tekst: 'Mandaty', ikona: 'paragon', niedostepne: 'Mandaty' },
        { tekst: 'Wybory', ikona: 'wybory', niedostepne: 'Wybory' }
      ]
    },
    legitymacja: { akcje: [{ tekst: 'Bezpieczny autobus', ikona: 'autobus', niedostepne: 'Bezpieczny autobus' }] },
    pojazdy: { akcje: [{ tekst: 'OC i badanie techniczne', ikona: 'auto', href: '#/sprawa/samochod' }] }
  };

  /* Zarządzaj → Dodaj dokument: dokumenty dostępne w mObywatelu (rodzaj = osoba może już go mieć) */
  var DO_DODANIA = [
    { nazwa: 'Legitymacje i karty', dokumenty: [
      { nazwa: 'mLegitymacja szkolna' },
      { nazwa: 'mLegitymacja studencka', rodzaj: 'legitymacja' },
      { nazwa: 'mLegitymacja doktoranta' },
      { nazwa: 'mLegitymacja emeryta-rencisty', rodzaj: 'emeryt' },
      { nazwa: 'mLegitymacja osoby niepełnosprawnej' },
      { nazwa: 'Karta Dużej Rodziny', rodzaj: 'kdr' },
      { nazwa: 'Legitymacja ulgowych usług transportowych' }
    ] },
    { nazwa: 'Legitymacje zawodowe', dokumenty: [
      { nazwa: 'Legitymacja adwokacka' },
      { nazwa: 'Legitymacja radcy prawnego' },
      { nazwa: 'Prawo wykonywania zawodu lekarza (PWZ)' },
      { nazwa: 'Legitymacja pielęgniarki i położnej' },
      { nazwa: 'Legitymacja farmaceuty' },
      { nazwa: 'Legitymacja fizjoterapeuty' },
      { nazwa: 'Legitymacja nauczyciela' }
    ] }
  ];

  /* Sprawy, które działają w prototypie (pokazywane w oknie „Niedostępne w prototypie”) */
  var DZIALAJACE = [
    { id: 'zgubione', nazwa: 'Zgubione dokumenty', ikona: 'dowod', href: '#/sprawa/zgubione' },
    { id: 'samochod', nazwa: 'Samochód: OC i badanie', ikona: 'auto', href: '#/sprawa/samochod' },
    { id: 'zameldowanie', nazwa: 'Zameldowanie na pobyt stały', ikona: 'dom', href: '#/sprawa/zameldowanie' }
  ];

  /* Usługi według sytuacji życiowych. „slowa” = synonimy dla wyszukiwarki (bez polskich znaków) */
  var KATEGORIE = [
    { id: 'dokumenty', nazwa: 'Dokumenty i tożsamość', ikona: 'dowod', uslugi: [
      { id: 'utrata', nazwa: 'Zgłoś utratę lub kradzież dokumentów', opis: 'Unieważnij dowód i zastrzeż PESEL w jednym miejscu.', sprawa: 'zgubione', href: '#/sprawa/zgubione',
        slowa: 'zgubic zgubilem zgubilam zgubiony zgubione zginal zginela zginelo zginely ukradli ukradziony kradziez portfel torebka utrata stracilem stracilam uniewaznic dowod osobisty zastrzec' },
      { id: 'wniosek-dowod', nazwa: 'Wniosek o dowód osobisty', opis: 'Złóż wniosek o nowy dowód, np. gdy kończy się ważność.', slowa: 'nowy dowod wymiana dowodu wyrobic dowod osobisty' },
      { id: 'paszport', nazwa: 'Paszport', opis: 'Sprawdź, czy Twój paszport jest gotowy do odbioru.', slowa: 'paszport wyjazd zagranica podroz' },
      { id: 'dane-pesel', nazwa: 'Twoje dane w rejestrze PESEL', opis: 'Zobacz, jakie dane o Tobie ma urząd.', slowa: 'pesel rejestr dane osobowe adres' }
    ] },
    { id: 'samochod', nazwa: 'Samochód', ikona: 'auto', uslugi: [
      { id: 'oc-badanie', nazwa: 'OC i badanie techniczne', opis: 'Sprawdź, do kiedy masz OC i przegląd. Ustaw przypomnienie.', sprawa: 'samochod', href: '#/sprawa/samochod',
        slowa: 'oc ubezpieczenie polisa przeglad badanie techniczne samochod auto pojazd przypomnienie' },
      { id: 'punkty', nazwa: 'Punkty karne', opis: 'Sprawdź, ile masz punktów karnych.', slowa: 'punkty karne mandat prawo jazdy' },
      { id: 'rejestracja', nazwa: 'Zarejestruj pojazd', opis: 'Zarejestruj samochód po zakupie.', slowa: 'rejestracja rejestrowac kupno zakup auta samochodu tablice' },
      { id: 'sprzedaz', nazwa: 'Zgłoś sprzedaż pojazdu', opis: 'Powiadom urząd, że sprzedajesz samochód.', slowa: 'sprzedaz sprzedac zbycie auta samochodu' }
    ] },
    { id: 'mieszkanie', nazwa: 'Mieszkanie', ikona: 'dom', uslugi: [
      { id: 'zameldowanie', nazwa: 'Zameldowanie na pobyt stały', opis: 'Zamelduj się pod nowym adresem.', sprawa: 'zameldowanie', href: '#/sprawa/zameldowanie', slowa: 'meldunek zameldowac zamelduj przeprowadzka nowy adres mieszkanie' },
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
      { id: 'zastrzez-pesel', nazwa: 'Zastrzeż PESEL', opis: 'Nikt nie weźmie kredytu na Twoje dane.', sprawa: 'zgubione', href: '#/sprawa/zgubione/krok-2?tylko=pesel',
        slowa: 'zastrzec zastrzezenie pesel kredyt wyludzenie oszustwo kradziez tozsamosci' },
      { id: 'alerty', nazwa: 'Ostrzeżenia o zagrożeniach', opis: 'Dostawaj ostrzeżenia o burzach i innych zagrożeniach.', slowa: 'alert rcb ostrzezenie burza powodz zagrozenie' },
      { id: 'mapa-zagrozen', nazwa: 'Zgłoś niebezpieczne miejsce', opis: 'Powiedz policji o zagrożeniu w Twojej okolicy.', slowa: 'policja zgloszenie mapa zagrozen niebezpieczne' }
    ] }
  ];

  window.DANE = {
    osoby: OSOBY,
    kolejnoscOsob: ['halina', 'tomasz', 'ola'],
    kategorie: KATEGORIE,
    najczestsze: ['utrata', 'oc-badanie', 'zameldowanie', 'pit'],
    dzialajace: DZIALAJACE,
    akcje: AKCJE,
    doDodania: DO_DODANIA,
    smsPrzyklad: SMS_OSZUSTWO,
    formatuj: formatuj,
    dataZaDni: dataZaDni,
    nazwyDokumentow: { dowod: 'Dowód osobisty', prawko: 'Prawo jazdy', kdr: 'Karta Dużej Rodziny', legitymacja: 'Legitymacja studencka', emeryt: 'Legitymacja emeryta-rencisty' },
    dzis: DZIS
  };
})();

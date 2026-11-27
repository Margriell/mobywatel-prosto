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

  /* Dokumenty: kolejność jak w Zarządzaj — pierwszy leży z przodu portfela.
     pola = dane na karcie (jak na prawdziwym dokumencie); dane = sekcja „Dane” w szczegółach.
     Trzeci element: 'dlugie' (cała szerokość karty), 'alarm' (ostrzeżenie: ikona + słowa), 'tablica' (tablica rejestracyjna). */
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
        { id: 'dowod', rodzaj: 'dowod', nazwa: 'mDowód', kolor: 'dowod', status: 'Ważny', ikonaStatusu: 'ok',
          pola: [['Imię', 'Halina'], ['Nazwisko', 'Wiśniewska'], ['Data urodzenia', '14.03.1955'], ['PESEL', '55031412345']],
          dane: [['Seria i numer dowodu', 'XYZ 104233'], ['Termin ważności', '12.03.2031'], ['Data wydania', '12.03.2021'], ['Imię ojca', 'Stanisław'], ['Imię matki', 'Zofia']],
          dodatkowe: [['Nazwisko rodowe', 'Nowicka'], ['Miejsce urodzenia', 'Kraków'], ['Obywatelstwo', 'polskie']],
          aktualizacja: aktualizacja(2, '08:12') },
        { id: 'emeryt', rodzaj: 'emeryt', nazwa: 'mLegitymacja emeryta-rencisty', nazwaKrotka: 'mLegitymacja emeryta', kolor: 'emeryt', status: 'Ważna', ikonaStatusu: 'ok',
          pola: [['Imię', 'Halina'], ['Nazwisko', 'Wiśniewska'], ['PESEL', '55031412345'], ['Ważność', 'bezterminowo'], ['Organ wydający', 'ZUS', 'dlugie']],
          dane: [['Imię', 'Halina'], ['Nazwisko', 'Wiśniewska'], ['PESEL', '55031412345'], ['Organ wydający', 'Zakład Ubezpieczeń Społecznych (ZUS)'], ['Ważność', 'bezterminowo']],
          aktualizacja: aktualizacja(3, '09:05') },
        { id: 'kdr', rodzaj: 'kdr', nazwa: 'Karta Dużej Rodziny', kolor: 'kdr', status: 'Ważna', ikonaStatusu: 'ok',
          pola: [['Imię', 'Halina'], ['Nazwisko', 'Wiśniewska'], ['Numer karty', '12/2014/000184'], ['Ważność', 'bezterminowo']],
          dane: [['Imię', 'Halina'], ['Nazwisko', 'Wiśniewska'], ['Numer karty', '12/2014/000184'], ['Rodzaj karty', 'Rodzic'], ['Ważność', 'bezterminowo']],
          aktualizacja: aktualizacja(6, '10:24') }
      ],
      /* Sprawy na karcie „Wymaga Twojej uwagi” (po kolei; karta znika albo zmienia się po załatwieniu) */
      uwagi: ['podatek'],
      urzedy: [{ nazwa: 'Urząd Miasta Krakowa — Punkt Obsługi Mieszkańców', adres: 'ul. Kwiatowa 7, Kraków' },
        { nazwa: 'Urząd Miasta Krakowa — Punkt Obsługi Mieszkańców', adres: 'ul. Ogrodowa 15, Kraków' }],
      usc: 'Urząd Stanu Cywilnego w Krakowie',
      /* Akty stanu cywilnego w rejestrze (do odpisu) */
      akty: [
        { id: 'ur-halina', rodzaj: 'urodzenia', czyj: 'Twój akt urodzenia', numer: 'A/1955/0412', usc: 'Urząd Stanu Cywilnego w Krakowie',
          dane: [['Imię i nazwisko', 'Halina Nowicka'], ['Data urodzenia', '14.03.1955'], ['Miejsce urodzenia', 'Kraków'], ['Imię ojca', 'Stanisław'], ['Imię matki', 'Zofia']] },
        { id: 'ms-halina', rodzaj: 'malzenstwa', czyj: 'Twój akt małżeństwa (z Janem Wiśniewskim)', numer: 'B/1976/0218', usc: 'Urząd Stanu Cywilnego w Krakowie',
          dane: [['Małżonkowie', 'Halina Nowicka i Jan Wiśniewski'], ['Data zawarcia małżeństwa', '12.06.1976'], ['Miejsce', 'Kraków'], ['Nazwisko po ślubie', 'Wiśniewska']] },
        { id: 'zg-jan', rodzaj: 'zgonu', czyj: 'Akt zgonu męża: Jan Wiśniewski', numer: 'C/2019/0087', usc: 'Urząd Stanu Cywilnego w Krakowie',
          dane: [['Imię i nazwisko', 'Jan Wiśniewski'], ['Data zgonu', '03.02.2019'], ['Miejsce zgonu', 'Kraków'], ['Stan cywilny', 'żonaty (Halina Wiśniewska)']] }
      ],
      wiadomosci: [
        /* Decyzja podatkowa jak prawdziwa: organ, znak sprawy, raty, pouczenie (dane fikcyjne) */
        { id: 'podatek', nowa: true, nadawca: 'Urząd Miasta Krakowa', tytul: 'Decyzja: podatek od nieruchomości na 2027 rok', data: DZIS,
          rodzaj: 'Decyzja', oplata: 'podatek',
          metryczka: [['Organ', 'Prezydent Miasta Krakowa'], ['Znak sprawy', 'FN-I.3120.18342.2026'], ['Data wydania', DZIS]],
          tresc: ['Na podstawie ustawy o podatkach i opłatach lokalnych oraz Ordynacji podatkowej Prezydent Miasta Krakowa ustala Pani Halinie Wiśniewskiej podatek od nieruchomości na 2027 rok w wysokości 412 zł.',
            'Podatek dotyczy lokalu mieszkalnego przy ul. Lipowej 14 m. 3 w Krakowie.',
            'Podatek można zapłacić jednorazowo albo w czterech ratach, w terminach podanych niżej.'],
          sekcje: [
            { tytul: 'Raty podatku', tabela: [['I rata — do 15.03.2027', '103 zł'], ['II rata — do 15.05.2027', '103 zł'], ['III rata — do 15.09.2027', '103 zł'], ['IV rata — do 15.11.2027', '103 zł']] },
            { tytul: 'Pouczenie', akapity: ['Od tej decyzji przysługuje odwołanie do Samorządowego Kolegium Odwoławczego w Krakowie, za pośrednictwem Prezydenta Miasta Krakowa, w terminie 14 dni od dnia jej doręczenia.'] }
          ],
          akcja: { tekst: 'Zapłać podatek', ikona: 'portfel', href: '#/sprawa/podatek' },
          slowa: 'podatek nieruchomosci urzad miasta decyzja 412 zl rata raty zaplacic',
          wyjasnienie: {
            wstep: 'To decyzja z urzędu: masz zapłacić podatek od mieszkania na 2027 rok.',
            fakty: [['Od kogo', 'Urząd Miasta Krakowa'], ['Ile', '412 zł — całość albo 4 raty po 103 zł'],
              ['Do kiedy', 'Całość albo pierwsza rata do 15 marca 2027'],
              ['Co zrobić', 'Zapłać całość albo pierwszą ratę. Zrobisz to w aplikacji.']],
            platnosc: 'podatek'
          } },
        powitanie()
      ],
      /* Płatności w aplikacji (symulowane, bez wpisywania danych): podatek od nieruchomości */
      platnosci: {
        podatek: { nazwa: 'Zapłać podatek', odbiorca: 'Urząd Miasta Krakowa', tytul: 'Podatek od nieruchomości na 2027 rok', znak: 'FN-I.3120.18342.2026', kwota: 412,
          raty: [['I rata', 103, '15.03.2027'], ['II rata', 103, '15.05.2027'], ['III rata', 103, '15.09.2027'], ['IV rata', 103, '15.11.2027']], pismo: 'podatek' }
      }
    },

    tomasz: {
      id: 'tomasz', imie: 'Tomasz', wolacz: 'Tomaszu', nazwisko: 'Kowalski', inicjaly: 'TK', wiek: '38 lat',
      opis: 'Kierowca, tata trojga dzieci. Za 12 dni kończy mu się OC.',
      ustawienia: { tekst: 'standardowy', motyw: 'jasny', prosty: false, czytanie: false },
      ustawieniaOpis: 'Standardowy tekst, jasny motyw',
      adres: 'ul. Słoneczna 21 m. 8, 02-495 Warszawa',
      lokalWyborczy: { nazwa: 'Szkoła Podstawowa nr 7', adres: 'ul. Słoneczna 4, Warszawa', obwod: '54' },
      telefon: '+48 ••• ••• 412',
      punktyKarne: 4,
      mandaty: [{ kwota: '200 zł', za: 'przekroczenie prędkości', termin: formatuj(dataZaDni(10)), numer: 'MK 4471203', wystawil: 'Policja — Warszawa', data: formatuj(dataZaDni(-4)) }],
      /* Rodzina: żona i dwoje starszych dzieci; najmłodsze dziecko urodziło się 6 dni temu (karta urodzenia ze szpitala) */
      rodzina: {
        partner: { imie: 'Marta', nazwisko: 'Kowalska', kto: 'żona' },
        dzieci: [{ imie: 'Jakub', biernik: 'Jakuba', nazwisko: 'Kowalski', urodzony: '12.04.2017', swiadczenie: true }, { imie: 'Maja', biernik: 'Maję', nazwisko: 'Kowalska', urodzony: '03.09.2020', swiadczenie: true }],
        kartaUrodzenia: { data: formatuj(dataZaDni(-6)), godzina: '06:40', szpital: 'Szpital Miejski nr 3 w Warszawie', miejsce: 'Warszawa', plec: 'dziewczynka', nazwisko: 'Kowalska', dni: 6 }
      },
      konto: '•••• 4821',
      podpowiedzi: [
        { tekst: 'Do kiedy mam OC?' },
        { tekst: 'Ile mam punktów karnych?' },
        { tekst: 'Czy mam mandat do zapłaty?' },
        { tekst: 'Zginął mi portfel' }
      ],
      dokumenty: [
        { id: 'dowod', rodzaj: 'dowod', nazwa: 'mDowód', kolor: 'dowod', status: 'Ważny', ikonaStatusu: 'ok',
          pola: [['Imię', 'Tomasz'], ['Nazwisko', 'Kowalski'], ['Data urodzenia', '22.06.1988'], ['PESEL', '88062254310']],
          dane: [['Seria i numer dowodu', 'XYZ 552910'], ['Termin ważności', '03.10.2030'], ['Data wydania', '03.10.2020'], ['Imię ojca', 'Andrzej'], ['Imię matki', 'Ewa']],
          dodatkowe: [['Nazwisko rodowe', 'Kowalski'], ['Miejsce urodzenia', 'Warszawa'], ['Obywatelstwo', 'polskie']],
          aktualizacja: aktualizacja(2, '08:12') },
        { id: 'prawko', rodzaj: 'prawko', nazwa: 'mPrawo jazdy', kolor: 'prawko', status: 'Ważne', ikonaStatusu: 'ok',
          pola: [['Imię', 'Tomasz'], ['Nazwisko', 'Kowalski'], ['Kategorie', 'B, C, C+E'], ['Ważne do', '22.06.2031']],
          dane: [['Imię', 'Tomasz'], ['Nazwisko', 'Kowalski'], ['Kategorie', 'B, C, C+E'], ['Ważne do', '22.06.2031']],
          aktualizacja: aktualizacja(4, '18:31') },
        { id: 'pojazdy', rodzaj: 'pojazdy', nazwa: 'Moje pojazdy', kolor: 'pojazdy', status: 'OC: 12 dni', ikonaStatusu: 'uwaga', alarm: true,
          pojazd: { marka: 'Skoda Octavia', numer: 'WX 4821K', kolorAuta: '#2D6CC0', oc: KONIEC_OC_TOMASZA, ocDni: 12, badanie: '14.05.2027',
            ubezpieczyciel: 'TU Spokojna Droga S.A.', polisa: 'SD/2025/118342',
            przypomnienieOc: formatuj(dataZaDni(5)), przypomnienieBadanie: '07.05.2027' },
          pola: [['Marka i model', 'Skoda Octavia'], ['Numer rejestracyjny', 'WX 4821K', 'tablica'],
            ['OC ważne do', KONIEC_OC_TOMASZA + ' — zostało 12 dni', 'alarm dlugie'], ['Badanie techniczne do', '14.05.2027', 'dlugie']],
          dane: [['Marka i model', 'Skoda Octavia'], ['Numer rejestracyjny', 'WX 4821K'],
            ['OC ważne do', KONIEC_OC_TOMASZA + ' — zostało 12 dni', 'alarm'], ['Badanie techniczne do', '14.05.2027']],
          aktualizacja: aktualizacja(1, '07:40') }
      ],
      uwagi: ['oc', 'urodzenie'],
      urzedy: [{ nazwa: 'Urząd Dzielnicy — Wydział Obsługi Mieszkańców', adres: 'ul. Słoneczna 40, Warszawa' },
        { nazwa: 'Urząd Dzielnicy — Wydział Obsługi Mieszkańców', adres: 'ul. Brzozowa 3, Warszawa' }],
      usc: 'Urząd Stanu Cywilnego w Warszawie',
      akty: [
        { id: 'ur-tomasz', rodzaj: 'urodzenia', czyj: 'Twój akt urodzenia', numer: 'A/1988/1543', usc: 'Urząd Stanu Cywilnego w Warszawie',
          dane: [['Imię i nazwisko', 'Tomasz Kowalski'], ['Data urodzenia', '22.06.1988'], ['Miejsce urodzenia', 'Warszawa'], ['Imię ojca', 'Andrzej'], ['Imię matki', 'Ewa']] },
        { id: 'ur-jakub', rodzaj: 'urodzenia', czyj: 'Akt urodzenia syna: Jakub Kowalski', numer: 'A/2017/2290', usc: 'Urząd Stanu Cywilnego w Warszawie',
          dane: [['Imię i nazwisko', 'Jakub Kowalski'], ['Data urodzenia', '12.04.2017'], ['Miejsce urodzenia', 'Warszawa'], ['Imię ojca', 'Tomasz'], ['Imię matki', 'Marta']] },
        { id: 'ur-maja', rodzaj: 'urodzenia', czyj: 'Akt urodzenia córki: Maja Kowalska', numer: 'A/2020/3318', usc: 'Urząd Stanu Cywilnego w Warszawie',
          dane: [['Imię i nazwisko', 'Maja Kowalska'], ['Data urodzenia', '03.09.2020'], ['Miejsce urodzenia', 'Warszawa'], ['Imię ojca', 'Tomasz'], ['Imię matki', 'Marta']] },
        { id: 'ms-tomasz', rodzaj: 'malzenstwa', czyj: 'Twój akt małżeństwa (z Martą Kowalską)', numer: 'B/2014/0731', usc: 'Urząd Stanu Cywilnego w Warszawie',
          dane: [['Małżonkowie', 'Tomasz Kowalski i Marta Lis'], ['Data zawarcia małżeństwa', '05.07.2014'], ['Miejsce', 'Warszawa'], ['Nazwisko żony po ślubie', 'Kowalska']] }
      ],
      wiadomosci: [
        { id: 'oc', nowa: true, nadawca: 'mObywatel', tytul: 'Kończy się OC Twojego samochodu', data: DZIS,
          tresc: ['OC samochodu Skoda Octavia (WX 4821K) jest ważne do ' + KONIEC_OC_TOMASZA + '.', 'Kup nowe OC albo przedłuż obecne, żeby uniknąć kary.'],
          akcja: { tekst: 'Sprawdź OC i badanie', ikona: 'auto', href: '#/sprawa/samochod' },
          slowa: 'oc ubezpieczenie przypomnienie skoda',
          rodzaj: 'Przypomnienie',
          wyjasnienie: {
            wstep: 'To przypomnienie z aplikacji mObywatel, nie rachunek.',
            fakty: [['Od kogo', 'mObywatel'], ['Czego dotyczy', 'OC samochodu Skoda Octavia (WX 4821K)'],
              ['Do kiedy', 'OC jest ważne do ' + KONIEC_OC_TOMASZA],
              ['Co zrobić', 'Kup nowe OC albo przedłuż obecne przed tą datą.']]
          } },
        powitanie()
      ],
      platnosci: {
        mandat: { nazwa: 'Zapłać mandat', odbiorca: 'Policja — Warszawa', tytul: 'Mandat karny MK 4471203 za przekroczenie prędkości', znak: 'MK 4471203', kwota: 200, termin: formatuj(dataZaDni(10)) }
      }
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
        { id: 'dowod', rodzaj: 'dowod', nazwa: 'mDowód', kolor: 'dowod', status: 'Ważny', ikonaStatusu: 'ok',
          pola: [['Imię', 'Aleksandra'], ['Nazwisko', 'Nowak'], ['Data urodzenia', '09.02.2002'], ['PESEL', '02220912346']],
          dane: [['Seria i numer dowodu', 'XYZ 731045'], ['Termin ważności', '09.02.2032'], ['Data wydania', '09.02.2022'], ['Imię ojca', 'Piotr'], ['Imię matki', 'Anna']],
          dodatkowe: [['Nazwisko rodowe', 'Nowak'], ['Miejsce urodzenia', 'Gdańsk'], ['Obywatelstwo', 'polskie']],
          aktualizacja: aktualizacja(2, '08:12') },
        { id: 'legitymacja', rodzaj: 'legitymacja', nazwa: 'mLegitymacja studencka', kolor: 'legitymacja', status: 'Ważna', ikonaStatusu: 'ok',
          pola: [['Imię', 'Aleksandra'], ['Nazwisko', 'Nowak'], ['Data urodzenia', '09.02.2002'], ['PESEL', '02220912346'],
            ['Nazwa uczelni', 'Uniwersytet Gdański', 'dlugie'], ['Numer albumu', '412377'], ['Data wydania', '04.10.2021']],
          dane: [['Imię', 'Aleksandra'], ['Nazwisko', 'Nowak'], ['Data urodzenia', '09.02.2002'], ['PESEL', '02220912346'],
            ['Nazwa uczelni', 'Uniwersytet Gdański'], ['Numer albumu', '412377'], ['Data wydania', '04.10.2021']],
          kod: '412377',
          komunikat: 'Dokument wymaga potwierdzenia danych',
          aktualizacja: aktualizacja(3, '12:47') }
      ],
      uwagi: ['zameldowanie'],
      urzedy: [{ nazwa: 'Urząd Miejski w Gdańsku — Wydział Spraw Obywatelskich', adres: 'ul. Morska 12, Gdańsk' },
        { nazwa: 'Urząd Miejski w Gdańsku — Wydział Spraw Obywatelskich', adres: 'ul. Polna 30, Gdańsk' }],
      usc: 'Urząd Stanu Cywilnego w Gdańsku',
      akty: [
        { id: 'ur-ola', rodzaj: 'urodzenia', czyj: 'Twój akt urodzenia', numer: 'A/2002/0569', usc: 'Urząd Stanu Cywilnego w Gdańsku',
          dane: [['Imię i nazwisko', 'Aleksandra Nowak'], ['Data urodzenia', '09.02.2002'], ['Miejsce urodzenia', 'Gdańsk'], ['Imię ojca', 'Piotr'], ['Imię matki', 'Anna']] }
      ],
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
        { tekst: 'Mandaty', ikona: 'paragon', href: '#/sprawa/mandat' },
        { tekst: 'Wybory', ikona: 'wybory', niedostepne: 'Wybory' }
      ]
    },
    legitymacja: { akcje: [{ tekst: 'Bezpieczny autobus', ikona: 'autobus', niedostepne: 'Bezpieczny autobus' }] },
    pojazdy: { akcje: [{ tekst: 'OC i badanie techniczne', ikona: 'auto', href: '#/sprawa/samochod' }, { tekst: 'Zgłoś stłuczkę (mStłuczka)', ikona: 'uwaga', href: '#/sprawa/stluczka' }] }
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
    { id: 'stluczka', nazwa: 'Zgłoś stłuczkę (mStłuczka)', ikona: 'auto', href: '#/sprawa/stluczka' },
    { id: 'samochod', nazwa: 'OC i badanie techniczne', ikona: 'auto', href: '#/sprawa/samochod' },
    { id: 'zameldowanie', nazwa: 'Zameldowanie na pobyt stały', ikona: 'dom', href: '#/sprawa/zameldowanie' }
  ];

  /* Usługi według sytuacji życiowych. „slowa” = synonimy dla wyszukiwarki (bez polskich znaków) */
  var KATEGORIE = [
    { id: 'dokumenty', nazwa: 'Dokumenty i tożsamość', ikona: 'dowod', uslugi: [
      { id: 'utrata', nazwa: 'Zgłoś utratę lub kradzież dokumentów', opis: 'Unieważnij dowód i zastrzeż PESEL w jednym miejscu.', sprawa: 'zgubione', href: '#/sprawa/zgubione',
        slowa: 'zgubic zgubilem zgubilam zgubiony zgubione zginal zginela zginelo zginely ukradli ukradziony kradziez portfel torebka utrata stracilem stracilam uniewaznic dowod osobisty zastrzec' },
      { id: 'wniosek-dowod', nazwa: 'Wniosek o dowód osobisty', opis: 'Przygotuj wniosek o nowy dowód i umów wizytę w urzędzie.', sprawa: 'wniosek-dowod', href: '#/sprawa/wniosek-dowod',
        slowa: 'nowy dowod wymiana dowodu wyrobic dowod osobisty wizyta urzad odciski' },
      { id: 'paszport', nazwa: 'Paszport', opis: 'Sprawdź, czy Twój paszport jest gotowy do odbioru.', slowa: 'paszport wyjazd zagranica podroz' },
      { id: 'dane-pesel', nazwa: 'Twoje dane w rejestrze PESEL', opis: 'Zobacz, jakie dane o Tobie ma urząd.', slowa: 'pesel rejestr dane osobowe adres' }
    ] },
    { id: 'samochod', nazwa: 'Samochód', ikona: 'auto', uslugi: [
      { id: 'oc-badanie', nazwa: 'OC i badanie techniczne', opis: 'Sprawdź, do kiedy masz OC i przegląd. Ustaw przypomnienie.', sprawa: 'samochod', href: '#/sprawa/samochod',
        slowa: 'oc ubezpieczenie polisa przeglad badanie techniczne samochod auto pojazd przypomnienie' },
      { id: 'stluczka', nazwa: 'Zgłoś stłuczkę (mStłuczka)', opis: 'Spisz z drugim kierowcą wspólne oświadczenie o zdarzeniu.', sprawa: 'stluczka', href: '#/sprawa/stluczka',
        slowa: 'stluczka kolizja wypadek oswiadczenie sprawca poszkodowany szkoda mstluczka' },
      { id: 'kupno-auta', nazwa: 'Sprawdź auto przed zakupem', opis: 'Zobacz historię pojazdu, policz podatek PCC i przygotuj umowę.', sprawa: 'kupno-auta', href: '#/sprawa/kupno-auta',
        slowa: 'kupno zakup uzywane auto historia pojazdu vin przebieg pcc umowa kupna sprzedazy' },
      { id: 'punkty', nazwa: 'Mandaty i punkty karne', opis: 'Zapłać mandat i sprawdź punkty karne.', sprawa: 'mandat', href: '#/sprawa/mandat', slowa: 'punkty karne mandat mandaty prawo jazdy zaplac' },
      { id: 'rejestracja', nazwa: 'Zarejestruj pojazd', opis: 'Zarejestruj samochód po zakupie.', slowa: 'rejestracja rejestrowac tablice' },
      { id: 'sprzedaz', nazwa: 'Zgłoś sprzedaż pojazdu', opis: 'Powiadom urząd, że sprzedajesz samochód.', slowa: 'sprzedaz sprzedac zbycie auta samochodu' }
    ] },
    { id: 'mieszkanie', nazwa: 'Mieszkanie', ikona: 'dom', uslugi: [
      { id: 'zameldowanie', nazwa: 'Zameldowanie na pobyt stały', opis: 'Zamelduj się pod nowym adresem.', sprawa: 'zameldowanie', href: '#/sprawa/zameldowanie', slowa: 'meldunek zameldowac zamelduj przeprowadzka nowy adres mieszkanie' },
      { id: 'wymeldowanie', nazwa: 'Wymeldowanie', opis: 'Wymelduj się, gdy się wyprowadzasz.', slowa: 'wymeldowac wymelduj wyprowadzka meldunek' },
      { id: 'ogrzewanie', nazwa: 'Zgłoś źródło ogrzewania', opis: 'Wpisz, czym ogrzewasz dom lub mieszkanie.', slowa: 'piec kociol ogrzewanie ceeb deklaracja' }
    ] },
    { id: 'rodzina', nazwa: 'Rodzina', ikona: 'rodzina', uslugi: [
      { id: 'narodziny', nazwa: 'Zgłoś urodzenie dziecka', opis: 'Nadaj dziecku imię i numer PESEL. Zamelduj je.', sprawa: 'urodzenie', href: '#/sprawa/urodzenie', slowa: 'urodzenie narodziny dziecko noworodek pesel karta urodzenia' },
      { id: '800plus', nazwa: 'Rodzina 800 plus', opis: 'Złóż wniosek o świadczenie na dziecko.', sprawa: '800plus', href: '#/sprawa/800plus', slowa: '800 800+ swiadczenie dziecko zasilek zus' },
      { id: 'wniosek-kdr', nazwa: 'Karta Dużej Rodziny', opis: 'Złóż wniosek o kartę dla rodziny z co najmniej trojgiem dzieci.', sprawa: 'karta-rodziny', href: '#/sprawa/karta-rodziny', slowa: 'kdr karta duzej rodziny znizki dzieci' },
      { id: 'odpis', nazwa: 'Odpis aktu stanu cywilnego', opis: 'Zamów odpis aktu urodzenia, małżeństwa lub zgonu.', sprawa: 'odpis', href: '#/sprawa/odpis', slowa: 'akt urodzenia malzenstwa zgonu odpis slub usc' }
    ] },
    { id: 'zdrowie', nazwa: 'Zdrowie', ikona: 'serce', uslugi: [
      { id: 'recepty', nazwa: 'Recepty', opis: 'Zobacz swoje e-recepty i kod do apteki.', slowa: 'recepta erecepta leki lek apteka' },
      { id: 'skierowania', nazwa: 'Skierowania', opis: 'Sprawdź swoje e-skierowania do lekarza.', slowa: 'skierowanie lekarz specjalista badania' },
      { id: 'ubezpieczenie-zdrowotne', nazwa: 'Ubezpieczenie zdrowotne', opis: 'Sprawdź, czy masz ubezpieczenie zdrowotne.', slowa: 'nfz ewus ubezpieczenie zdrowotne' }
    ] },
    { id: 'podatki', nazwa: 'Podatki', ikona: 'paragon', uslugi: [
      { id: 'pit', nazwa: 'Rozlicz PIT', opis: 'Twój e-PIT jest gotowy, wystarczy go sprawdzić.', slowa: 'pit epit zeznanie rozliczenie podatek dochodowy urzad skarbowy' },
      { id: 'podatek-nieruchomosci', nazwa: 'Podatek od nieruchomości', opis: 'Sprawdź, ile i do kiedy zapłacić. Zapłać w aplikacji.', sprawa: 'podatek', href: '#/sprawa/podatek', slowa: 'podatek nieruchomosci dom mieszkanie dzialka oplata zaplac rata' },
      { id: 'zaswiadczenie', nazwa: 'Zaświadczenie o niezaleganiu', opis: 'Pobierz zaświadczenie z urzędu skarbowego.', slowa: 'zaswiadczenie niezaleganie urzad skarbowy podatki' }
    ] },
    { id: 'bezpieczenstwo', nazwa: 'Bezpieczeństwo', ikona: 'tarcza', uslugi: [
      { id: 'zastrzez-pesel', nazwa: 'Zastrzeż PESEL', opis: 'Nikt nie weźmie kredytu na Twoje dane.', sprawa: 'zgubione', href: '#/sprawa/zgubione/krok-2?tylko=pesel',
        slowa: 'zastrzec zastrzezenie pesel kredyt wyludzenie kradziez tozsamosci' },
      { id: 'cofnij-pesel', nazwa: 'Cofnij zastrzeżenie PESEL', opis: 'Gdy dokument się znalazł albo bierzesz kredyt.', sprawa: 'cofnij-pesel', href: '#/sprawa/cofnij-pesel',
        slowa: 'cofnij cofniecie zastrzezenia pesel odblokuj znalazl sie dowod' },
      { id: 'cert', nazwa: 'Zgłoś oszustwo', opis: 'Fałszywy SMS, e-mail albo strona? Zgłoś to do CERT Polska.', sprawa: 'cert', href: '#/sprawa/cert',
        slowa: 'oszustwo oszust sms phishing cert zglos falszywa strona link 8080' },
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

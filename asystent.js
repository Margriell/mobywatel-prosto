/* =====================================================================
   mObywatel Prosto — asystent. Działa bez internetu i bez serwera.

   Zasada: „AI rozumie, aplikacja prowadzi”. Asystent rozpoznaje sprawę
   i odpowiada krótko, po ludzku. Działania (wysłanie, zastrzeżenie,
   zgłoszenie) idą zawsze przez widoczne kroki z potwierdzeniem — te same
   co z Usług. Asystent nie podaje faktów prawnych, kwot ani zniżek,
   których nie jest pewny; konkretne dane mają tylko fikcyjne osoby.

   - Każda sprawa to JEDEN wpis w tablicy SPRAWY: słowa kluczowe,
     odpowiedź, przyciski i to, dokąd prowadzi.
   - Całe rozpoznawanie jest w jednej funkcji rozpoznajSprawe(tekst).
     Później można ją podmienić na model językowy (np. Bielik) — wystarczy,
     że zwróci { sprawa: 'id-wpisu', dokumenty: [...] }.
   - Tekst porównujemy małymi literami, bez polskich znaków,
     z tolerancją literówek.
   ===================================================================== */
(function (global) {
  'use strict';

  var D = global.DANE;

  /* ======================= TEKST I LITERÓWKI ======================= */
  function normalizuj(t) {
    return String(t || '').toLowerCase().replace(/ł/g, 'l').normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9+]+/g, ' ').trim();
  }
  function tokeny(t) {
    var n = normalizuj(t);
    return n ? n.split(' ') : [];
  }
  /* Liczba literówek między dwoma słowami (także przestawione litery) */
  function literowki(a, b) {
    var d = [], i, j;
    for (i = 0; i <= a.length; i++) d[i] = [i];
    for (j = 0; j <= b.length; j++) d[0][j] = j;
    for (i = 1; i <= a.length; i++) {
      for (j = 1; j <= b.length; j++) {
        d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
        if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      }
    }
    return d[a.length][b.length];
  }
  /* Czy słowo z tekstu pasuje do rdzenia, np. „zgubilam” do „zgubi”.
     Rdzeń z „=” na początku musi pasować dokładnie (np. „=auto”, żeby nie łapać „autobus”).
     Krótkie rdzenie (do 3 liter, np. „oc”) — tylko dokładnie. Od 5 liter — 1 literówka, od 8 liter — 2. */
  function pasujeSlowo(t, k) {
    if (k.charAt(0) === '=') return t === k.slice(1);
    if (k.length <= 3) return t === k;
    if (t.indexOf(k) === 0) return true;
    if (k.length < 5 || t.length < k.length - 1 || t.charAt(0) !== k.charAt(0)) return false;
    var limit = k.length >= 8 ? 2 : 1;
    for (var dl = k.length - 1; dl <= k.length + 1 && dl <= t.length; dl++) {
      if (literowki(t.slice(0, dl), k) <= limit) return true;
    }
    return false;
  }
  /* Czy w tekście jest wzorzec (jedno słowo albo kilka słów po kolei) */
  function gdzie(tok, wzorzec) {
    var cz = wzorzec.split(' ');
    for (var i = 0; i + cz.length <= tok.length; i++) {
      var ok = true;
      for (var j = 0; j < cz.length && ok; j++) ok = pasujeSlowo(tok[i + j], cz[j]);
      if (ok) return { od: i, ile: cz.length };
    }
    return null;
  }
  function ileTrafien(tok, lista) {
    var n = 0;
    (lista || []).forEach(function (w) { if (gdzie(tok, w)) n++; });
    return n;
  }
  function odmiana(n, jeden, kilka, wiele) {
    if (n === 1) return jeden;
    var r10 = n % 10, r100 = n % 100;
    return (r10 >= 2 && r10 <= 4 && (r100 < 12 || r100 > 14)) ? kilka : wiele;
  }

  /* ======================= DOKUMENTY W TEKŚCIE ======================= */
  var NAZWY = {
    dowod: { nazwa: 'mDowód', dopelniacz: 'mDowodu', rzecz: 'Dowód osobisty', pokaz: 'Pokaż mDowód' },
    prawko: { nazwa: 'mPrawo jazdy', dopelniacz: 'prawa jazdy', rzecz: 'Prawo jazdy', pokaz: 'Pokaż mPrawo jazdy' },
    legitymacja: { nazwa: 'mLegitymacja studencka', dopelniacz: 'legitymacji studenckiej', rzecz: 'Legitymacja studencka', pokaz: 'Pokaż mLegitymację' },
    emeryt: { nazwa: 'mLegitymacja emeryta-rencisty', dopelniacz: 'legitymacji emeryta-rencisty', rzecz: 'Legitymacja emeryta-rencisty', pokaz: 'Pokaż mLegitymację' },
    'legitymacja-ogolna': { nazwa: 'legitymacja', dopelniacz: 'legitymacji', rzecz: null },
    kdr: { nazwa: 'Karta Dużej Rodziny', dopelniacz: 'Karty Dużej Rodziny', rzecz: 'Karta Dużej Rodziny', pokaz: 'Pokaż Kartę Dużej Rodziny' },
    pojazdy: { nazwa: 'Moje pojazdy', dopelniacz: 'zarejestrowanego pojazdu', rzecz: null, pokaz: 'Pokaż Moje pojazdy' },
    karty: { rzecz: 'Karty płatnicze' },
    inne: { rzecz: 'Inne dokumenty' }
  };
  /* Kolejność ma znaczenie: dłuższe nazwy najpierw, a ich słowa są potem pomijane
     (np. „karta dużej rodziny” to nie karta płatnicza, „dowód rejestracyjny” to nie dowód osobisty) */
  var SLOWA_DOKUMENTOW = [
    ['kdr', ['karta duzej rodziny', 'karty duzej rodziny', 'karte duzej rodziny', 'karcie duzej rodziny', 'duzej rodziny', 'duza rodzina', 'kdr']],
    ['pojazdy', ['dowod rejestracyjny', 'dowodu rejestracyjnego', 'pojazd', 'samochod', '=auto', '=auta', '=autem', 'skoda']],
    ['prawko', ['prawo jazdy', 'prawa jazdy', 'prawem jazdy', 'prawko', 'prawka', 'mprawo']],
    ['emeryt', ['emeryt', 'emerytk', 'rencist', 'zus']],
    ['legitymacja', ['legitymacja studencka', 'studenck', 'legitymacj', 'mlegitymacj', 'legitke', 'legitka']],
    ['dowod', ['dowod osobisty', 'dowodu osobistego', 'dowod', 'dowodu', 'mdowod', 'dowodzik', 'dowodem']],
    ['karty', ['karta platnicza', 'karty platnicze', 'karte platnicza', 'platnicz', 'kredytow', 'bankow', 'debetow', 'bankomat', '=karta', '=karty', '=karte', '=kart', '=karta']]
  ];
  function dokumentyWTekscie(tok) {
    var t = tok.slice(), wynik = [];
    SLOWA_DOKUMENTOW.forEach(function (para) {
      para[1].forEach(function (w) {
        var g;
        while ((g = gdzie(t, w))) {
          if (wynik.indexOf(para[0]) < 0) wynik.push(para[0]);
          t.splice(g.od, g.ile);
        }
      });
    });
    return wynik;
  }

  /* ======================= ZNAKI OSZUSTWA W SMS-ie ======================= */
  var SLOWA_OSZUSTWA = ['doplat', 'oplat', 'paczk', 'przesylk', 'kurier', 'zablok', 'zawiesz', 'blik', 'kliknij', 'pilne', 'pilnie',
    '24 h', '24h', 'odlacz', 'zaleglos', 'wygral', 'nagrod', 'potwierdz dane', 'zaktualizuj', 'dane karty', 'haslo', 'konto zostanie', 'faktur',
    'nowy numer', 'zmienilam numer', 'zmienilem numer', 'mamo', 'tato', 'babciu', 'dziadku', 'pozycz', 'przelew', 'wyslij kod'];
  function znakiOszustwa(surowy) {
    var maly = String(surowy || '').toLowerCase();
    var n = ' ' + normalizuj(surowy) + ' ';
    var link = /(https?:\/\/|www\.|\b[a-z0-9-]+\.(xyz|top|info|online|site|click|link|shop|icu|live|pl|com|net|eu|org)\b)/.test(maly);
    var ile = SLOWA_OSZUSTWA.filter(function (s) { return n.indexOf(' ' + s) >= 0; }).length;
    var cytat = /[„”"«»]/.test(maly) || /sms[a-z-]*\s*:/.test(maly);
    return { link: link, ile: ile, podejrzany: (link && ile >= 1) || ile >= 2, tresc: link || ile >= 1 || cytat || normalizuj(surowy).length > 70 };
  }

  /* ======================= USŁUGI (gdy żadna sprawa nie pasuje) ======================= */
  var POMIJANE = ['jak', 'co', 'czy', 'mam', 'mi', 'sie', 'do', 'na', 'w', 'z', 'i', 'o', 'po', 'od', 'moj', 'moja', 'moje', 'chce', 'chcialbym',
    'chcialabym', 'gdzie', 'kiedy', 'jest', 'mnie', 'to', 'ze', 'za', 'nie', 'a', 'ja', 'ten', 'ta', 'te', 'prosze', 'musze', 'trzeba', 'mozna', 'sprawa', 'sprawe',
    'nowy', 'nowa', 'nowe', 'nowego', 'nowej', 'zalatwic', 'zrobic', 'potrzebuje'];
  function szukajUslug(tok) {
    var slowa = tok.filter(function (s) { return s.length >= 3 && POMIJANE.indexOf(s) < 0; });
    if (!slowa.length) return [];
    var najlepsze = 0, wyniki = [];
    D.kategorie.forEach(function (k) {
      k.uslugi.forEach(function (u) {
        var stog = tokeny(u.nazwa + ' ' + u.opis + ' ' + (u.slowa || ''));
        var trafienia = slowa.filter(function (s) {
          return s.length >= 4 && stog.some(function (w) { return pasujeSlowo(w, s.slice(0, Math.max(4, s.length - 2))); });
        }).length;
        if (!trafienia) return;
        if (trafienia > najlepsze) { najlepsze = trafienia; wyniki = []; }
        if (trafienia === najlepsze) wyniki.push(u);
      });
    });
    return wyniki.slice(0, 3);
  }

  /* ======================= POMOCNICZE DO ODPOWIEDZI ======================= */
  function link(tekst, href, ikona) { return { tekst: tekst, href: href, ikona: ikona }; }
  function pytaj(tekst, pytanie) { return { tekst: tekst, pytanie: pytanie || tekst }; }
  function niedostepne(tekst, nazwa, ikona) { return { tekst: tekst, niedostepne: nazwa || tekst, ikona: ikona }; }
  function uslugi() { return link('Zobacz wszystkie usługi', '#/uslugi', 'uslugi'); }
  function dokumenty() { return link('Wróć do Dokumentów', '#/dokumenty', 'dokumenty'); }
  function sam(href) { return link('Wolę przejść krok po kroku sam(a)', href, 'klik'); }
  function dok(k, rodzaj) {
    for (var i = 0; i < k.dokumenty.length; i++) if (k.dokumenty[i].rodzaj === rodzaj) return k.dokumenty[i];
    return null;
  }
  function wartosc(d, etykieta) {
    var lista = (d.dane || []).concat(d.pola || []);
    for (var i = 0; i < lista.length; i++) if (lista[i][0] === etykieta) return lista[i][1];
    return '';
  }
  function podpowiedziJakoPrzyciski(k, ile) {
    return (k.osoba.podpowiedzi || []).slice(0, ile || 4).map(function (p) { return pytaj(p.tekst, p.pytanie); });
  }
  function adresTekst(s) {
    return s.ulica + (s.mieszkanie ? ' m. ' + s.mieszkanie : '') + ', ' + s.kod + ' ' + s.miejscowosc;
  }
  /* Dokumenty z portfela, które mogą zginąć (jako rzeczy), najważniejsze najpierw — dla sprawy A */
  var KOLEJNOSC_UTRATY = ['dowod', 'prawko', 'legitymacja', 'emeryt', 'kdr'];
  function dokumentyDoZaznaczenia(docs) {
    var rodzaje = docs.map(function (d) { return d.rodzaj; });
    return KOLEJNOSC_UTRATY.filter(function (r) { return rodzaje.indexOf(r) >= 0; });
  }
  /* Uprzejma odpowiedź, gdy osoba nie ma dokumentu, o który pyta */
  function brakDokumentu(k, rodzaj) {
    if (rodzaj === 'pojazdy') {
      return { zdania: ['Nie masz zarejestrowanego pojazdu w aplikacji.', 'Sprawy kierowców znajdziesz w Usługach.'],
        przyciski: [link('Usługi: Samochód', '#/uslugi/samochod', 'auto'), uslugi()] };
    }
    if (rodzaj === 'prawko') {
      return { zdania: ['Nie masz prawa jazdy w aplikacji.', 'Sprawy kierowców znajdziesz w Usługach.'],
        przyciski: [link('Usługi: Samochód', '#/uslugi/samochod', 'auto'), uslugi()] };
    }
    if (rodzaj === 'kdr') {
      return { zdania: ['Nie masz Karty Dużej Rodziny w aplikacji.', 'Wniosek o kartę złożysz w Usługach.'],
        przyciski: [link('Karta Dużej Rodziny w Usługach', '#/uslugi/rodzina', 'rodzina'), dokumenty()] };
    }
    if (rodzaj === 'dowod') {
      return { zdania: ['Nie masz mDowodu w aplikacji.', 'W prototypie wróci, gdy wybierzesz osobę jeszcze raz.'],
        przyciski: [link('Zmień osobę', '#/osoba', 'rodzina'), dokumenty()] };
    }
    return { zdania: ['Nie masz ' + (NAZWY[rodzaj] ? NAZWY[rodzaj].dopelniacz : 'legitymacji') + ' w aplikacji.', 'Legitymację dodasz w Dokumentach.'],
      przyciski: [link('Dodaj dokument', '#/zarzadzaj/dodaj', 'plus'), dokumenty()] };
  }
  /* Który dokument ma na myśli osoba: „legitymacja” to ta, którą ma (studencka albo emeryta-rencisty) */
  function ktoryDokument(k, r, dozwolone) {
    var lista = r.dokumenty.filter(function (x) { return !dozwolone || dozwolone.indexOf(x) >= 0; });
    var rodzaj = lista[0] || null;
    if (rodzaj === 'legitymacja' && !dok(k, 'legitymacja') && dok(k, 'emeryt')) rodzaj = 'emeryt';
    if (rodzaj === 'legitymacja' && !dok(k, 'legitymacja') && !dok(k, 'emeryt') && !r.tylkoLegitymacja) rodzaj = 'legitymacja-ogolna';
    return rodzaj;
  }

  /* ======================= SPRAWY ASYSTENTA (jeden wpis = jedna sprawa) =======================
     slowa: grupy słów — w tekście musi być słowo z KAŻDEJ grupy. lub: drugi zestaw grup (alternatywa).
     dodatkowe: słowa, które wzmacniają dopasowanie. wykluczenia: słowa, przy których wpis nie pasuje.
     priorytet: wygrywa wyższy. slaby: tylko gdy nic innego nie pasuje (np. „dzień dobry”). */
  var SPRAWY = [

    /* --- „Czy ten SMS to oszustwo?” --- */
    { id: 'sms', opis: 'Sprawdzenie SMS-a (oszustwo)', priorytet: 6,
      slowa: [['oszust', 'oszuk', 'podejrzan', 'wyludz', 'phishing', 'scam', 'falszyw', 'dziwny sms', 'dziwnego sms', 'naciag']],
      dodatkowe: ['sms', 'esemes', 'wiadomosc', 'link'],
      odpowiedz: function (k, r) {
        var znaki = r.sms;
        var listaZnakow = { tytul: 'Po czym poznać oszustwo:', punkty: ['Prośba o pieniądze, dopłatę albo Twoje dane.', 'Pośpiech i nacisk: „pilne”, „w ciągu 24 h”.', 'Nieznany numer albo dziwny adres strony.'] };
        var czegoNie = { tytul: 'Czego nie robić:', punkty: ['Nie klikaj w link.', 'Nie podawaj danych karty, kodu BLIK ani haseł.', 'Nie odpisuj. Usuń wiadomość.'] };
        if (!znaki.tresc) {
          return { zdania: ['Wklej treść SMS-a w pole na dole i wyślij.', 'Sprawdzę, czy ma typowe znaki oszustwa.'],
            przyciski: [pytaj('Sprawdź przykładowy SMS', 'Czy ten SMS to oszustwo? „' + D.smsPrzyklad + '”'), dokumenty()] };
        }
        if (znaki.podejrzany) {
          return { ostrzezenie: true, zdania: ['To wygląda na oszustwo. Nie klikaj w link.', 'Oszuści często podszywają się pod kurierów, banki i urzędy.'],
            listy: [listaZnakow, czegoNie],
            przyciski: [link('Przekaż SMS na numer 8080 (CERT Polska)', 'sms:8080', 'wyslij'),
              link('Podano dane karty? Zastrzeż ją: 828 828 828', 'tel:828828828', 'telefon')] };
        }
        return { zdania: ['Nie widzę typowych znaków oszustwa.', 'Mimo to nie klikaj w linki od nieznanych nadawców.'],
          listy: [listaZnakow],
          przyciski: [link('Przekaż SMS na numer 8080 (CERT Polska)', 'sms:8080', 'wyslij'), dokumenty()] };
      } },

    /* --- Czy mój PESEL jest zastrzeżony? --- */
    { id: 'pesel-status', opis: 'Status zastrzeżenia PESEL', priorytet: 5,
      slowa: [['pesel', 'pesla', 'peselu'], ['zastrzezon', 'czy jest', 'czy mam', 'czy moj', 'status', 'sprawdz', 'sprawdzic']],
      odpowiedz: function (k) {
        if (k.wyniki.pesel) {
          return { zdania: ['Tak, Twój PESEL jest zastrzeżony od ' + k.wyniki.pesel + '.', 'Nikt nie weźmie na niego kredytu.'],
            przyciski: [niedostepne('Jak cofnąć zastrzeżenie?', 'Cofnięcie zastrzeżenia PESEL', 'powtorz'), dokumenty()] };
        }
        return { zdania: ['Twój PESEL nie jest zastrzeżony.', 'Zastrzeżenie chroni Cię przed kredytem na Twoje dane.'],
          przyciski: [link('Zastrzeż PESEL', '#/sprawa/zgubione/krok-2?tylko=pesel&z=asystent', 'tarcza'), dokumenty()] };
      } },

    /* --- Zastrzeż PESEL (część sprawy A) --- */
    { id: 'zastrzez-pesel', opis: 'Zastrzeżenie PESEL → sprawa A', priorytet: 4,
      slowa: [['pesel', 'pesla', 'peselu'], ['zastrz', 'zastrzec', 'zablok', 'zabezpiecz', 'chron']],
      odpowiedz: function (k) {
        if (k.wyniki.pesel) return SPRAWA('pesel-status').odpowiedz(k);
        return { zdania: ['Zastrzeżenie PESEL chroni Cię przed kredytem na Twoje dane.', 'Zrobimy to w widocznych krokach.'],
          karta: { tytul: 'Zastrzeż PESEL', opis: 'Sprawa „Zgubione dokumenty”. Nic nie wyślemy bez Twojej zgody.',
            zacznij: link('Zacznij', '#/sprawa/zgubione/krok-2?tylko=pesel&z=asystent', 'dalej'), sam: sam('#/sprawa/zgubione') } };
      } },

    /* --- SPRAWA A: zgubione lub skradzione dokumenty --- */
    { id: 'zgubione', opis: 'Sprawa A: zgubione dokumenty', priorytet: 4,
      slowa: [['zgubi', 'zgub', 'zgin', 'zginal', 'zginel', 'ukradl', 'ukradzi', 'ukradz', 'kradziez', 'kradz', 'skradzi', 'okradl', 'okradzi',
        'stracil', 'zagin', 'wypadl', 'nie moge znalezc', 'nie mam portfel', 'zostawil', 'zgubion', 'utrat', 'zapodzial']],
      dodatkowe: ['portfel', 'torebk', 'dowod', 'dokument', 'plecak', 'karta', 'karty', 'prawo jazdy'],
      odpowiedz: function (k, r) {
        var opcje = dokumentyDoZaznaczenia(k.dokumenty).map(function (rodzaj) {
          return { wartosc: rodzaj, etykieta: NAZWY[rodzaj].rzecz };
        }).concat([{ wartosc: 'karty', etykieta: NAZWY.karty.rzecz }, { wartosc: 'inne', etykieta: NAZWY.inne.rzecz }]);
        var wspomniane = r.dokumenty.map(function (x) { return x === 'legitymacja' && !dok(k, 'legitymacja') ? 'emeryt' : x; });
        opcje.forEach(function (o) { o.zaznaczona = wspomniane.indexOf(o.wartosc) >= 0; });
        return { zdania: ['Przykro mi.', 'Zabezpieczmy Twoje dokumenty.'],
          wybor: { id: 'zgubione-co', typ: 'wiele', pytanie: 'Co zginęło?', podpowiedz: 'Zaznacz wszystko, co zginęło.', opcje: opcje, przycisk: 'Dalej' },
          przyciski: [sam('#/sprawa/zgubione')] };
      },
      dalej: function (k, wartosci) {
        if (!wartosci.length) {
          var w = SPRAWA('zgubione').odpowiedz(k, { dokumenty: [] });
          w.zdania = ['Zaznacz co najmniej jedną rzecz.'];
          w.przyciski = [pytaj('Nic nie zginęło, chcę zastrzec PESEL', 'Chcę zastrzec PESEL'), sam('#/sprawa/zgubione')];
          return { ty: null, odpowiedz: w };
        }
        var nazwy = wartosci.map(function (x) { return NAZWY[x].rzecz; });
        var karty = wartosci.indexOf('karty') >= 0;
        return { ty: 'Zginęło: ' + nazwy.join(', ') + '.',
          odpowiedz: { zdania: karty ? ['Sprawa jest gotowa do sprawdzenia.', 'Karty płatnicze zastrzeż od razu: 828 828 828.'] : ['Dziękuję.', 'Sprawa jest gotowa do sprawdzenia.'],
            karta: { tytul: 'Zgubione dokumenty', opis: '4 kroki. Nic nie wyślemy bez Twojej zgody.', punkty: nazwy,
              zacznij: link('Zacznij', '#/sprawa/zgubione?zginelo=' + wartosci.join(',') + '&z=asystent', 'dalej'), sam: sam('#/sprawa/zgubione') },
            przyciski: karty ? [link('Zadzwoń i zastrzeż karty: 828 828 828', 'tel:828828828', 'telefon')] : [] } };
      } },

    /* --- „Wytłumacz mi to pismo” --- */
    { id: 'pismo', opis: 'Wytłumaczenie pisma ze Skrzynki', priorytet: 4,
      slowa: [['pism', 'wytlumacz', 'wyjasnij', 'objasnij', 'co to znaczy', 'co znaczy', 'list z urzedu', 'decyzj', 'wezwani', 'prostym jezykiem']],
      lub: [['podatek', 'podatk'], ['ile', 'zaplac', 'termin', 'do kiedy', 'rata', 'raty', 'nieruchomosc']],
      dodatkowe: ['urzad', 'podatek', 'nieruchomosc'],
      odpowiedz: function (k, r) {
        var listy = k.wiadomosci.filter(function (w) { return w.wyjasnienie; });
        var w = null;
        if (k.pismo) w = listy.filter(function (x) { return x.id === k.pismo; })[0] || null;
        if (!w) w = listy.filter(function (x) { return x.slowa && ileTrafien(r.tokeny, tokeny(x.slowa).filter(function (s) { return s.length >= 4; })) > 0; })[0] || null;
        if (!w && !r.podatek) w = listy[0] || null;
        if (!w) {
          return { zdania: ['W Twojej Skrzynce nie ma pisma z urzędu do wytłumaczenia.', 'Gdy przyjdzie, pomogę je zrozumieć.'],
            przyciski: [link('Otwórz Skrzynkę', '#/skrzynka', 'list'), r.podatek ? link('Usługi: Podatki', '#/uslugi/podatki', 'paragon') : dokumenty()] };
        }
        return { zdania: [w.wyjasnienie.wstep], fakty: w.wyjasnienie.fakty,
          przyciski: [link('Pokaż pismo', '#/skrzynka/' + w.id, 'list'),
            w.wyjasnienie.platnosc ? niedostepne('Jak zapłacić?', w.wyjasnienie.platnosc, 'portfel') : dokumenty()] };
      } },

    /* --- SPRAWA B: OC i badanie techniczne --- */
    { id: 'samochod', opis: 'Sprawa B: OC i badanie techniczne', priorytet: 3,
      slowa: [['oc', 'ubezpiecz', 'polis', 'przeglad', 'badanie techniczne', 'badania technicznego', 'badanie auta', 'badanie samochodu',
        'samochod', '=auto', '=auta', '=autem', 'pojazd', 'skoda', 'octavi']],
      wykluczenia: ['sprzeda', 'kupil', 'kupic', 'zarejestrowac', 'rejestracj', 'punkt', 'mandat', 'prawo jazdy', 'prawa jazdy', 'prawko',
        'zdrowot', 'nfz', 'zgubi', 'zgin', 'ukradl', 'ukradzi', 'kradz'],
      odpowiedz: function (k, r) {
        var d = dok(k, 'pojazdy');
        if (!d || !d.pojazd) return brakDokumentu(k, 'pojazdy');
        var p = d.pojazd, przyp = k.wyniki.przypomnienie;
        var zdania = r.badanie ?
          ['Badanie techniczne samochodu ' + p.marka + ' jest ważne do ' + p.badanie + '.', 'Wszystko jest w porządku.'] :
          ['OC samochodu ' + p.marka + ' jest ważne do ' + p.oc + '.', 'Zostało ' + p.ocDni + ' ' + odmiana(p.ocDni, 'dzień', 'dni', 'dni') + '.'];
        if (przyp) {
          zdania[1] = 'Przypomnienie jest ustawione na ' + (r.badanie && przyp.badanie ? przyp.badanie : przyp.oc || przyp.badanie) + '.';
          return { zdania: zdania, przyciski: [link('Pokaż mój samochód', '#/sprawa/samochod', 'auto'), dokumenty()] };
        }
        return { zdania: zdania,
          karta: { tytul: r.badanie ? 'Przypomnienie o badaniu technicznym' : 'Przypomnienie o OC', opis: 'Przypomnimy Ci 7 dni przed terminem. 3 kroki.',
            zacznij: link('Zacznij', '#/sprawa/samochod/krok-2?przypomnij=' + (r.badanie ? 'badanie' : 'oc') + '&z=asystent', 'dalej'),
            sam: sam('#/sprawa/samochod') } };
      } },

    /* --- SPRAWA C: zameldowanie na pobyt stały --- */
    { id: 'zameldowanie', opis: 'Sprawa C: zameldowanie', priorytet: 3,
      slowa: [['zameld', 'zamelduj', 'meldun', 'meldowa', 'przemeldow', 'przeprowadz', 'nowy adres', 'nowym adresem', 'zmiana adresu',
        'zmienic adres', 'pobyt staly', 'pobyt stal']],
      wykluczenia: ['wymeld'],
      odpowiedz: function (k) {
        var wynik = k.wyniki.zameldowanie;
        if (wynik) {
          return { zdania: ['Wniosek o zameldowanie wysłano ' + wynik.data + '.', 'Odpowiedź z urzędu dostaniesz w Skrzynce.'],
            przyciski: [link('Otwórz Skrzynkę', '#/skrzynka', 'list'), dokumenty()] };
        }
        var szkic = k.osoba.szkicMeldunku;
        return { zdania: [szkic ? 'Masz zaczęte zameldowanie: ' + adresTekst(szkic) + '.' : 'Pomogę Ci zameldować się na pobyt stały.'],
          wybor: { id: 'meldunek-podstawa', typ: 'jeden', pytanie: 'Jesteś właścicielem mieszkania czy je wynajmujesz?',
            opcje: [{ wartosc: 'wlasciciel', etykieta: 'Jestem właścicielem' }, { wartosc: 'wynajem', etykieta: 'Wynajmuję' }] },
          przyciski: [sam('#/sprawa/zameldowanie')] };
      },
      dalej: function (k, wartosci) {
        var v = wartosci[0] === 'wynajem' ? 'wynajem' : 'wlasciciel';
        var szkic = k.osoba.szkicMeldunku;
        return { ty: v === 'wynajem' ? 'Wynajmuję mieszkanie.' : 'Jestem właścicielem mieszkania.',
          odpowiedz: { zdania: ['Dziękuję.', 'Sprawa jest gotowa do sprawdzenia.'],
            karta: { tytul: 'Zameldowanie na pobyt stały', opis: '5 kroków. Nic nie wyślemy bez Twojej zgody.',
              punkty: (szkic ? ['Adres: ' + adresTekst(szkic)] : []).concat(['Podstawa: ' + (v === 'wynajem' ? 'wynajem' : 'własność')]),
              zacznij: link(szkic ? 'Dokończ' : 'Zacznij', '#/sprawa/zameldowanie?podstawa=' + v + '&z=asystent', 'dalej'),
              sam: sam('#/sprawa/zameldowanie') } } };
      } },

    /* --- Punkty karne --- */
    { id: 'punkty', opis: 'Punkty karne', priorytet: 2,
      slowa: [['punkt', 'punkcik']], dodatkowe: ['karn'],
      odpowiedz: function (k) {
        if (!dok(k, 'prawko') || k.osoba.punktyKarne === null) {
          return { zdania: ['Nie masz prawa jazdy w aplikacji, więc nie ma tu punktów karnych.'],
            przyciski: [link('Usługi: Samochód', '#/uslugi/samochod', 'auto'), uslugi()] };
        }
        var n = k.osoba.punktyKarne;
        return { zdania: ['Masz ' + n + ' ' + odmiana(n, 'punkt karny', 'punkty karne', 'punktów karnych') + '.', 'Szczegóły znajdziesz w usłudze Punkty karne.'],
          przyciski: [niedostepne('Punkty karne', 'Punkty karne', 'paragon'), link('Pokaż mPrawo jazdy', '#/dokument/prawko', 'oko')] };
      } },

    /* --- Mandaty --- */
    { id: 'mandat', opis: 'Mandaty do zapłaty', priorytet: 2,
      slowa: [['mandat', 'grzywn', 'mandacik']],
      odpowiedz: function (k) {
        var m = k.osoba.mandaty || [];
        if (!m.length) {
          return { zdania: ['Nie masz mandatów do zapłaty.'], przyciski: [niedostepne('Mandaty w aplikacji', 'Mandaty', 'paragon'), dokumenty()] };
        }
        return { zdania: ['Masz 1 mandat do zapłaty: ' + m[0].kwota + ' za ' + m[0].za + '.', 'Termin płatności: ' + m[0].termin + '.'],
          przyciski: [niedostepne('Zapłać mandat', 'Mandaty', 'portfel'), dokumenty()] };
      } },

    /* --- Gdzie głosuję --- */
    { id: 'wybory', opis: 'Lokal wyborczy', priorytet: 2,
      slowa: [['glosuj', 'glosowa', 'zaglosowa', 'wybory', 'wyborach', 'wyborcz', 'lokal wyborczy', 'komisj wyborcz', 'gdzie glos', 'obwod glosowania']],
      odpowiedz: function (k) {
        var l = k.osoba.lokalWyborczy;
        return { zdania: ['Głosujesz w lokalu: ' + l.nazwa + ', ' + l.adres + '.', 'To obwód nr ' + l.obwod + ', według adresu zameldowania.'],
          przyciski: [niedostepne('Wybory w aplikacji', 'Wybory', 'wybory'), dokumenty()] };
      } },

    /* --- Jaką zniżkę daje legitymacja --- */
    { id: 'znizka', opis: 'Zniżki z legitymacji', priorytet: 2,
      slowa: [['znizk', 'znizek', 'zniszk', 'ulg', 'ulgow', 'taniej', 'tansz', 'rabat']],
      odpowiedz: function (k, r) {
        var rodzaj = ktoryDokument(k, r, ['legitymacja', 'emeryt', 'kdr']);
        if (rodzaj === 'kdr') return SPRAWA('kdr').odpowiedz(k, r);
        if (rodzaj === 'legitymacja-ogolna') return brakDokumentu(k, rodzaj);
        if (!rodzaj) rodzaj = dok(k, 'legitymacja') ? 'legitymacja' : dok(k, 'emeryt') ? 'emeryt' : dok(k, 'kdr') ? 'kdr' : null;
        if (rodzaj === 'kdr') return SPRAWA('kdr').odpowiedz(k, r);
        if (!rodzaj) {
          return { zdania: ['Nie masz w aplikacji legitymacji ani Karty Dużej Rodziny.', 'Legitymację dodasz w Dokumentach.'],
            przyciski: [link('Dodaj dokument', '#/zarzadzaj/dodaj', 'plus'), uslugi()] };
        }
        var d = dok(k, rodzaj);
        if (!d) return brakDokumentu(k, rodzaj);
        return { zdania: [(rodzaj === 'legitymacja' ? 'Legitymacja studencka' : 'Legitymacja emeryta-rencisty') + ' daje zniżki m.in. na kolej i komunikację miejską.',
          'Wysokość zniżki zależy od przewoźnika i miasta.'],
          przyciski: [link(NAZWY[rodzaj].pokaz, '#/dokument/' + d.id, 'oko'), dokumenty()] };
      } },

    /* --- Gdzie użyć Karty Dużej Rodziny --- */
    { id: 'kdr', opis: 'Karta Dużej Rodziny — gdzie jej użyć', priorytet: 2,
      slowa: [['karta duzej rodziny', 'karty duzej rodziny', 'karte duzej rodziny', 'karcie duzej rodziny', 'duzej rodziny', 'duza rodzina', 'kdr']],
      odpowiedz: function (k) {
        var d = dok(k, 'kdr');
        if (!d) return brakDokumentu(k, 'kdr');
        return { zdania: ['Kartą Dużej Rodziny zapłacisz mniej m.in. w sklepach, na stacjach paliw i w muzeach.', 'Listę miejsc znajdziesz na stronie programu.'],
          przyciski: [link('Pokaż Kartę Dużej Rodziny', '#/dokument/' + d.id, 'oko'), dokumenty()] };
      } },

    /* --- Kod QR --- */
    { id: 'kod-qr', opis: 'Kod QR', priorytet: 2,
      slowa: [['qr', 'kod qr', 'kodu qr', 'zeskanuj', 'skanuj', 'zeskanowa', 'skanowa']],
      odpowiedz: function () {
        return { zdania: ['Kod QR otworzysz w zakładce Kod QR.', 'Pokażesz tam swój kod albo zeskanujesz inny.'],
          przyciski: [link('Otwórz Kod QR', '#/kod-qr', 'qr'), dokumenty()] };
      } },

    /* --- Kiedy traci ważność dokument --- */
    { id: 'waznosc', opis: 'Ważność dokumentu', priorytet: 2,
      slowa: [['wazn', 'wazny', 'traci', 'straci', 'wygas', 'do kiedy', 'kiedy konczy', 'kiedy sie konczy', 'termin', 'przedluz', 'koniec']],
      odpowiedz: function (k, r) {
        var rodzaj = ktoryDokument(k, r);
        if (rodzaj === 'pojazdy') return SPRAWA('samochod').odpowiedz(k, r);
        if (!rodzaj || rodzaj === 'karty') {
          return { zdania: ['Który dokument chcesz sprawdzić?'],
            przyciski: k.dokumenty.filter(function (d) { return d.rodzaj !== 'pojazdy'; }).map(function (d) {
              return pytaj(d.nazwa, 'Ważność: ' + d.nazwa);
            }).concat([dokumenty()]) };
        }
        var d = dok(k, rodzaj);
        if (!d) return brakDokumentu(k, rodzaj);
        var pokaz = link(NAZWY[rodzaj].pokaz, '#/dokument/' + d.id, 'oko');
        if (rodzaj === 'dowod') {
          if (k.wyniki.dowodUniewazniony) {
            return { zdania: ['Twój dowód osobisty jest unieważniony.', 'Złóż wniosek o nowy dowód.'],
              przyciski: [niedostepne('Wniosek o nowy dowód', 'Wniosek o dowód osobisty', 'dowod'), dokumenty()] };
          }
          return { zdania: ['Twój dowód osobisty jest ważny do ' + wartosc(d, 'Termin ważności') + '.'], przyciski: [pokaz, dokumenty()] };
        }
        if (rodzaj === 'prawko') return { zdania: ['Twoje prawo jazdy jest ważne do ' + wartosc(d, 'Ważne do') + '.'], przyciski: [pokaz, dokumenty()] };
        if (rodzaj === 'legitymacja') {
          return { zdania: ['Twoja mLegitymacja studencka jest ważna.', 'O przedłużenie ważności zapytaj na uczelni.'], przyciski: [pokaz, dokumenty()] };
        }
        return { zdania: ['Twoja ' + NAZWY[rodzaj].nazwa + ' jest ważna bezterminowo.'], przyciski: [pokaz, dokumenty()] };
      } },

    /* --- Pokaż mój dowód (albo inny dokument) --- */
    { id: 'pokaz', opis: 'Pokaż dokument', priorytet: 1,
      slowa: [['pokaz', 'pokac', 'otworz', 'wyswietl', 'gdzie jest', 'gdzie mam', 'zobaczyc', 'zobacz', 'wejdz'],
        ['dowod', 'mdowod', 'prawo jazdy', 'prawko', 'legitymacj', 'duzej rodziny', 'kdr', 'pojazd', 'samochod', '=auto', 'dokument']],
      odpowiedz: function (k, r) {
        var rodzaj = ktoryDokument(k, r) || 'dowod';
        if (rodzaj === 'karty') rodzaj = 'dowod';
        var d = dok(k, rodzaj);
        if (!d) return brakDokumentu(k, rodzaj);
        if (rodzaj === 'pojazdy') {
          return { zdania: ['Twój samochód: ' + d.pojazd.marka + ', ' + d.pojazd.numer + '.'],
            przyciski: [link('Pokaż Moje pojazdy', '#/dokument/pojazdy', 'oko'), link('OC i badanie techniczne', '#/sprawa/samochod', 'auto')] };
        }
        return { zdania: ['Proszę, oto ' + NAZWY[rodzaj].nazwa + '.'],
          przyciski: [link(NAZWY[rodzaj].pokaz, '#/dokument/' + d.id, 'oko'), link('Pokaż kod QR', '#/kod-qr', 'qr')] };
      } },

    /* --- Skrzynka --- */
    { id: 'skrzynka', opis: 'Skrzynka', priorytet: 1,
      slowa: [['skrzynk', 'wiadomosci', 'poczt', 'moje listy', 'nowe pisma']],
      odpowiedz: function (k) {
        var n = k.liczbaNowych;
        return { zdania: [n ? 'Masz ' + n + ' ' + odmiana(n, 'nową wiadomość', 'nowe wiadomości', 'nowych wiadomości') + '.' : 'Nie masz nowych wiadomości.'],
          przyciski: [link('Otwórz Skrzynkę', '#/skrzynka', 'list'), dokumenty()] };
      } },

    /* --- Co umiesz? / Pomoc --- */
    { id: 'co-umiesz', opis: 'Co umiesz / pomoc', slaby: true,
      slowa: [['co umiesz', 'co potrafisz', 'pomoc', 'pomocy', 'w czym pomozesz', 'jak dzialasz', 'co mozesz', 'kim jestes', 'jak to dziala', 'help', 'pomoz']],
      odpowiedz: function (k) {
        return { zdania: ['Pomogę załatwić sprawę krok po kroku albo odpowiem na pytanie.', 'Nic nie wyślę bez Twojej zgody.'],
          przyciski: D.dzialajace.map(function (s) { return link(s.nazwa, s.href, s.ikona); })
            .concat(podpowiedziJakoPrzyciski(k, 2)).concat([uslugi()]) };
      } },

    /* --- Powitanie --- */
    { id: 'powitanie', opis: 'Powitanie', slaby: true,
      slowa: [['czesc', 'dzien dobry', 'dobry wieczor', 'hej', 'witam', 'witaj', 'siema', 'halo', 'dzien dobr']],
      odpowiedz: function (k) {
        return { zdania: ['Dzień dobry, ' + k.osoba.wolacz + '.', 'W czym mogę pomóc?'],
          przyciski: podpowiedziJakoPrzyciski(k, 4).concat([uslugi()]) };
      } },

    /* --- Podziękowanie --- */
    { id: 'podziekowanie', opis: 'Podziękowanie', slaby: true,
      slowa: [['dzieki', 'dziekuj', 'dzieku', 'super', 'swietnie', 'dobrze', 'okej', '=ok']],
      odpowiedz: function (k) {
        return { zdania: ['Proszę bardzo.', 'Czy mogę pomóc w czymś jeszcze?'],
          przyciski: podpowiedziJakoPrzyciski(k, 3).concat([uslugi()]) };
      } },

    /* --- Pasuje usługa z listy Usług (gdy żadna sprawa nie pasuje) --- */
    { id: 'uslugi', opis: 'Usługa z listy Usług', wewnetrzny: true,
      odpowiedz: function (k, r) {
        return { zdania: ['Tę sprawę znajdziesz w Usługach.'],
          przyciski: r.uslugi.map(function (u) { return u.href ? link(u.nazwa, u.href, 'dalej') : niedostepne(u.nazwa, u.nazwa, 'dalej'); }).concat([uslugi()]) };
      } },

    /* --- Nie rozumiem: nigdy ślepy zaułek --- */
    { id: 'nieznane', opis: 'Nie rozumiem — pokazuje sprawy', wewnetrzny: true,
      odpowiedz: function () {
        return { zdania: ['Nie rozumiem jeszcze tej prośby.', 'Mogę pomóc w tych sprawach:'],
          przyciski: D.dzialajace.map(function (s) { return link(s.nazwa, s.href, s.ikona); }).concat([uslugi()]) };
      } }
  ];
  function SPRAWA(id) {
    for (var i = 0; i < SPRAWY.length; i++) if (SPRAWY[i].id === id) return SPRAWY[i];
    return null;
  }

  /* ======================= ROZPOZNAWANIE (do podmiany na model językowy) ======================= */
  function grupyPasuja(tok, grupy) {
    var n = 0;
    for (var i = 0; i < grupy.length; i++) {
      var ile = ileTrafien(tok, grupy[i]);
      if (!ile) return -1;
      n += ile;
    }
    return n;
  }
  function rozpoznajSprawe(tekst) {
    var tok = tokeny(tekst);
    var wynik = {
      sprawa: 'nieznane', tokeny: tok, dokumenty: dokumentyWTekscie(tok), sms: znakiOszustwa(tekst),
      badanie: !!(gdzie(tok, 'przeglad') || gdzie(tok, 'badani')) && !gdzie(tok, 'oc') && !gdzie(tok, 'ubezpiecz'),
      podatek: !!gdzie(tok, 'podatk') || !!gdzie(tok, 'podatek'), uslugi: [], punkty: 0
    };
    wynik.tylkoLegitymacja = !!gdzie(tok, 'studenck');
    if (!tok.length) return wynik;
    var najlepszy = null, najlepszyWynik = -1, slaby = null, slabyWynik = -1;
    SPRAWY.forEach(function (s) {
      if (s.wewnetrzny) return;
      if (s.wykluczenia && ileTrafien(tok, s.wykluczenia)) return;
      var p = grupyPasuja(tok, s.slowa);
      if (p < 0 && s.lub) p = grupyPasuja(tok, s.lub);
      if (s.id === 'sms' && p < 0 && wynik.sms.podejrzany) p = 1;
      if (p < 0) return;
      var punkty = (s.priorytet || 0) * 100 + p * 10 + ileTrafien(tok, s.dodatkowe);
      if (s.slaby) { if (punkty > slabyWynik) { slaby = s; slabyWynik = punkty; } return; }
      if (punkty > najlepszyWynik) { najlepszy = s; najlepszyWynik = punkty; }
    });
    if (!najlepszy && wynik.dokumenty.length && tok.length <= 3) najlepszy = SPRAWA('pokaz');
    if (!najlepszy) {
      wynik.uslugi = szukajUslug(tok);
      if (wynik.uslugi.length && !slaby) najlepszy = SPRAWA('uslugi');
    }
    najlepszy = najlepszy || slaby;
    if (najlepszy) { wynik.sprawa = najlepszy.id; wynik.punkty = najlepszyWynik; }
    return wynik;
  }

  /* ======================= ODPOWIEDŹ ======================= */
  /* kontekst: { osoba, dokumenty, wyniki, wiadomosci, liczbaNowych, pismo } */
  function odpowiedz(tekst, kontekst) {
    var r = rozpoznajSprawe(tekst);
    var w = SPRAWA(r.sprawa).odpowiedz(kontekst, r);
    w.sprawa = r.sprawa;
    return w;
  }
  /* Odpowiedź na wybór w wiadomości (np. „Co zginęło?”) */
  function dalej(idWyboru, wartosci, kontekst) {
    var s = idWyboru === 'zgubione-co' ? SPRAWA('zgubione') : idWyboru === 'meldunek-podstawa' ? SPRAWA('zameldowanie') : null;
    if (!s) return { ty: null, odpowiedz: SPRAWA('nieznane').odpowiedz(kontekst) };
    var w = s.dalej(kontekst, wartosci);
    w.odpowiedz.sprawa = s.id;
    return w;
  }

  global.ASYSTENT = {
    normalizuj: normalizuj,
    rozpoznajSprawe: rozpoznajSprawe,
    odpowiedz: odpowiedz,
    dalej: dalej,
    sprawy: SPRAWY,
    nazwy: NAZWY,
    dokumentyDoZaznaczenia: dokumentyDoZaznaczenia,
    adresTekst: adresTekst
  };
})(typeof window !== 'undefined' ? window : this);

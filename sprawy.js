/* =====================================================================
   mObywatel Prosto — nowe sprawy (pakiet scenariuszy, 27.11.2026).
   Każda sprawa to jeden wpis: kroki z licznikiem „Krok X z N”, podsumowanie
   i potwierdzenie przed wysłaniem, ekran Gotowe i wiadomość w Skrzynce.
   Wspólny mechanizm kroków (błędy przy polach, pamięć spraw w toku,
   potwierdzenie odciskiem palca, Gotowe) jest w app.js; tu są treści i reguły.
   WSZYSTKIE DANE SĄ FIKCYJNE. Płatności i skanowanie kodów są udawane —
   nie wpisujesz żadnych danych karty ani logowania.
   Zwykły skrypt (bez modułów i bez fetch): działa po dwukliku i na GitHub Pages.
   ===================================================================== */
(function () {
  'use strict';

  /* P — pomocnicze funkcje z app.js (ikony, pola formularza, dane osoby, skutki spraw) */
  window.NOWE_SPRAWY = function (P) {
    var D = P.D, ik = P.ikona, esc = P.esc;

    /* ---------- Wspólne kawałki ---------- */
    function link(href, ikona, tekst, glowny) {
      return '<a class="btn ' + (glowny ? 'glowny' : 'drugi') + '" href="' + href + '">' + ik(ikona) + tekst + '</a>';
    }
    function alarmLink(href, tekst) { return '<a class="btn usun" href="' + href + '">' + ik('telefon') + tekst + '</a>'; }
    function przyciski(lista) { return '<div class="przyciski-pion">' + lista.filter(Boolean).join('') + '</div>'; }
    function dokumentyBtn() { return link('#/dokumenty', 'dokumenty', 'Wróć do Dokumentów'); }
    /* Ekran „ta sprawa Cię nie dotyczy” — zawsze z wyjściem, nigdy ślepy zaułek */
    function brak(tytul, tekst, btns) {
      return '<div class="pusty-stan"><p><b>' + tytul + '</b></p>' + (tekst ? '<p>' + tekst + '</p>' : '') + przyciski((btns || []).concat([dokumentyBtn()])) + '</div>';
    }
    function info(tekst, ikona) { return '<p class="z-asystenta">' + ik(ikona || 'info') + '<span>' + tekst + '</span></p>'; }
    function alarm(tekst) { return '<p class="komunikat-dokumentu alarm">' + ik('uwaga') + '<span>' + tekst + '</span></p>'; }
    function punktyInfo(lista) {
      return '<ul class="lista-zrobimy info">' + lista.map(function (p) { return '<li>' + ik(p[0]) + '<span>' + p[1] + '</span></li>'; }).join('') + '</ul>';
    }
    function przyciskAkcji(sprawa, co, ikona, tekst) {
      return '<button type="button" class="btn drugi" data-akcja="kreator" data-sprawa="' + sprawa + '" data-co="' + co + '">' + ik(ikona) + tekst + '</button>';
    }
    function zl(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' zł'; }
    function km(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' km'; }
    function radia(nazwa, opcje, wybrana) {
      return opcje.map(function (op) { return P.opcjaPola('radio', nazwa, op[0], op[1], wybrana === op[0], op[2]); }).join('');
    }
    function nazwaOpcji(opcje, v) { for (var i = 0; i < opcje.length; i++) if (opcje[i][0] === v) return opcje[i][1]; return ''; }
    function miasto(o) { return o.adres.split(' ').pop(); }
    /* Litery (także z ogonkami i łącznikiem), bez cyfr — imiona i nazwy */
    function tylkoLitery(t) { return P.LITERA.test(t) && !/[\d<>{}[\]\\\/@#$%^&*_=+|~`"]/.test(t); }
    /* Data dd.mm.rrrr w przyszłości (np. do kiedy cofnąć zastrzeżenie PESEL) */
    function dataPrzyszla(t) {
      var m = String(t).match(/^(\d{1,2})[.\-\/ ](\d{1,2})[.\-\/ ](\d{4})$/);
      if (!m) return { blad: 'Wpisz datę jako dzień.miesiąc.rok, np. ' + D.formatuj(D.dataZaDni(14)) + '.' };
      var d = new Date(+m[3], +m[2] - 1, +m[1], 12);
      if (d.getDate() !== +m[1] || d.getMonth() !== +m[2] - 1) return { blad: 'Taki dzień nie istnieje. Sprawdź datę.' };
      if (d <= D.dataZaDni(0)) return { blad: 'Ta data już minęła. Wpisz dzień w przyszłości.' };
      if (d > D.dataZaDni(366)) return { blad: 'Wybierz dzień najwyżej rok od dziś.' };
      return { data: D.formatuj(d) };
    }
    var DNI = ['niedziela', 'poniedziałek', 'wtorek', 'środa', 'czwartek', 'piątek', 'sobota'];
    function godzinaTeraz() { var d = new Date(); return d.getHours() + ':' + ('0' + d.getMinutes()).slice(-2); }

    var K = {};

    /* =====================================================================
       PŁATNOŚĆ: podatek od nieruchomości (Halina) i mandat (Tomasz).
       Wspólne kroki: co płacisz → jak zapłacisz → sprawdź → Gotowe.
       Płatność jest udawana: wybór BLIK / karta / przelew, bez wpisywania danych.
       ===================================================================== */
    var SPOSOBY = [['blik', 'BLIK', 'W prawdziwej aplikacji potwierdzisz płatność w aplikacji banku.'],
      ['karta', 'Karta płatnicza', 'W prawdziwej aplikacji wybierzesz zapisaną kartę.'],
      ['przelew', 'Szybki przelew z Twojego banku', 'W prawdziwej aplikacji zalogujesz się do banku.']];
    function platnosc(klucz) {
      function dane(o) { return o.platnosci && o.platnosci[klucz]; }
      function stan(o) { var w = P.wyniki(o); return (w.oplaty && w.oplaty[klucz]) || { zaplacono: 0, raty: 0, platnosci: [] }; }
      function pozostalo(o) { var d = dane(o); return d ? d.kwota - stan(o).zaplacono : 0; }
      function opcje(o) {
        var d = dane(o), st = stan(o), r = pozostalo(o), lista = [];
        if (r <= 0) return lista;
        lista.push(['calosc', st.zaplacono ? 'Cała pozostała kwota: ' + zl(r) : 'Całość: ' + zl(r), d.termin ? 'Termin: ' + d.termin + '.' : 'Zapłacisz wszystko od razu.', r]);
        if (d.raty && st.raty < d.raty.length && d.raty[st.raty][1] < r) {
          var rt = d.raty[st.raty];
          lista.push(['rata', rt[0] + ': ' + zl(rt[1]), 'Termin: ' + rt[2] + '.', rt[1]]);
        }
        return lista;
      }
      return {
        nazwa: klucz === 'podatek' ? 'Zapłać podatek' : 'Zapłać mandat',
        oknoTytul: 'Potwierdź płatność odciskiem palca lub PIN-em',
        brak: function (o) {
          var d = dane(o);
          if (!d) {
            if (klucz === 'podatek') return brak('Nie masz podatku do zapłaty w aplikacji.', 'Pisma z urzędu znajdziesz w Skrzynce.', [link('#/uslugi/podatki', 'paragon', 'Usługi: Podatki', true)]);
            var prawko = P.znajdz(P.dokumenty(o), 'prawko');
            return brak('Nie masz mandatów do zapłaty.', prawko && o.punktyKarne !== null ? 'Masz ' + o.punktyKarne + ' ' + P.odmiana(o.punktyKarne, 'punkt karny', 'punkty karne', 'punktów karnych') + '.' :
              'Nie masz prawa jazdy w aplikacji, więc nie ma tu punktów karnych.', [link('#/uslugi/samochod', 'auto', 'Usługi: Samochód', true)]);
          }
          if (pozostalo(o) <= 0) {
            var ost = stan(o).platnosci.slice(-1)[0];
            return brak(klucz === 'podatek' ? 'Ten podatek jest już opłacony.' : 'Ten mandat jest już opłacony.',
              'Numer potwierdzenia: ' + (ost ? ost.numer : '—') + '.', [link('#/skrzynka', 'list', 'Otwórz Skrzynkę', true)]);
          }
          return null;
        },
        kroki: [
          { h1: 'Do zapłaty',
            widok: function (o, s) {
              var d = dane(o), ops = opcje(o);
              if (!s.co && ops.length === 1) s.co = 'calosc';
              return P.daneHtml([['Odbiorca', d.odbiorca], ['Za co', d.tytul], [klucz === 'podatek' ? 'Znak sprawy' : 'Numer mandatu', d.znak],
                ['Zostało do zapłaty', zl(pozostalo(o))]]) +
                (klucz === 'mandat' && o.punktyKarne !== null ? info('Masz też ' + o.punktyKarne + ' ' + P.odmiana(o.punktyKarne, 'punkt karny', 'punkty karne', 'punktów karnych') + '.', 'paragon') : '') +
                P.grupaPol('co', 'Ile chcesz zapłacić?', ops.map(function (op) { return P.opcjaPola('radio', 'co', op[0], op[1], s.co === op[0], op[2]); }).join(''));
            },
            dalej: function (o, s, zaznaczone, tekst, blad) {
              var v = zaznaczone('co')[0];
              if (!v) return blad('co', 'Wybierz, ile chcesz zapłacić.');
              var op = opcje(o).filter(function (x) { return x[0] === v; })[0];
              s.co = v; s.kwota = op[3]; s.coNazwa = op[0] === 'rata' ? op[1].split(':')[0] : (stan(o).zaplacono ? 'pozostała kwota' : 'całość');
            },
            gotowy: function (s) { return !!s.kwota; } },
          { h1: 'Jak zapłacisz?',
            widok: function (o, s) {
              return P.grupaPol('sposob', 'Wybierz sposób płatności', radia('sposob', SPOSOBY, s.sposob)) +
                info('W prototypie płatność jest udawana. Nie wpisujesz żadnych danych.', 'tarczaOk');
            },
            dalej: function (o, s, zaznaczone, tekst, blad) {
              var v = zaznaczone('sposob')[0];
              if (!v) return blad('sposob', 'Wybierz sposób płatności.');
              s.sposob = v;
            },
            gotowy: function (s) { return !!s.sposob; } },
          { h1: 'Sprawdź, zanim zapłacimy', potwierdzenie: true, napis: 'Potwierdzam i płacę', wroc: '#/sprawa/' + klucz + '/krok-2',
            widok: function (o, s) {
              var d = dane(o);
              return P.podsumowanie('Co zrobimy', ['Zapłacimy ' + zl(s.kwota) + ' (' + s.coNazwa + ').']) +
                '<h2>Szczegóły płatności</h2>' + P.daneHtml([['Odbiorca', d.odbiorca], ['Tytuł płatności', d.tytul + ' (' + d.znak + ')'],
                  ['Kwota', zl(s.kwota), '#/sprawa/' + klucz], ['Sposób płatności', nazwaOpcji(SPOSOBY, s.sposob), '#/sprawa/' + klucz + '/krok-2'],
                  ['Płaci', P.daneOsoby(o).imie]]);
            } }
        ],
        zakoncz: function (o, w, s) {
          var d = dane(o), st = stan(o), numer = P.numer('PL');
          st = { zaplacono: st.zaplacono + s.kwota, raty: s.co === 'rata' ? st.raty + 1 : (d.raty ? d.raty.length : 1), platnosci: st.platnosci.concat([{ kwota: s.kwota, data: D.dzis, numer: numer, sposob: s.sposob }]) };
          w.oplaty = w.oplaty || {};
          w.oplaty[klucz] = st;
          var reszta = d.kwota - st.zaplacono, nast = d.raty && d.raty[st.raty];
          return {
            zdanie: 'Zapłacono ' + zl(s.kwota) + '.',
            fakty: [['ok', 'Numer potwierdzenia: ' + numer + '.'],
              reszta > 0 ? ['kalendarz', 'Zostało ' + zl(reszta) + (nast ? '. Następna rata do ' + nast[2] + '.' : '.')] :
                ['list', klucz === 'podatek' ? 'Pismo z urzędu ma teraz status „Opłacone”.' : 'Mandat ma teraz status „Opłacony”.']],
            coDalej: d.pismo ? [{ tekst: 'Pokaż pismo z urzędu', ikona: 'list', href: '#/skrzynka/' + d.pismo }] : [],
            wiadomosc: { tytul: 'Potwierdzenie płatności: ' + (klucz === 'podatek' ? 'podatek od nieruchomości' : 'mandat'), rodzaj: 'Potwierdzenie',
              metryczka: [['Numer potwierdzenia', numer], ['Data płatności', D.dzis], ['Kwota', zl(s.kwota)]],
              tresc: ['Płatność została przyjęta.', 'Odbiorca: ' + d.odbiorca + '.', 'Tytuł: ' + d.tytul + ' (' + d.znak + ').', 'Sposób płatności: ' + nazwaOpcji(SPOSOBY, s.sposob) + '.'] }
          };
        }
      };
    }
    K.podatek = platnosc('podatek');
    K.mandat = platnosc('mandat');

    /* =====================================================================
       STŁUCZKA (mStłuczka): wspólne oświadczenie o zdarzeniu drogowym.
       Najpierw bezpieczeństwo: „Czy ktoś jest ranny?” → Tak: 112.
       ===================================================================== */
    var DRUGI = { imie: 'Marek Zieliński', pojazd: 'Toyota Yaris', numer: 'WE 52K19', ubezpieczyciel: 'TU Pewny Krok S.A.', polisa: 'PK/2026/004417' };
    var OKOLICZNOSCI = [['tyl', 'Najechanie na tył pojazdu'], ['pas', 'Zmiana pasa ruchu'], ['cofanie', 'Cofanie'], ['parking', 'Wyjazd z parkingu albo z bramy'],
      ['pierwszenstwo', 'Nieustąpienie pierwszeństwa'], ['drzwi', 'Otwarcie drzwi auta'], ['inne', 'Inaczej — opiszę']];
    var ZDJECIA = ['Przód Twojego auta', 'Bok drugiego auta', 'Miejsce zdarzenia'];
    function wynikSkanu(dane) {
      return '<p class="komunikat-ok statyczny" tabindex="-1">' + ik('ok') + '<span>Zeskanowano kod. Dane są z mObywatela drugiej osoby.</span></p>' + P.daneHtml(dane);
    }
    function daneDrugiego() { return [['Kierowca', DRUGI.imie], ['Pojazd', DRUGI.pojazd + ', ' + DRUGI.numer], ['Ubezpieczenie OC', DRUGI.ubezpieczyciel + ', polisa ' + DRUGI.polisa]]; }
    function galeria(s) {
      var n = s.zdjecia || 0, h = '';
      if (n) {
        h += '<ul class="zdjecia">';
        for (var i = 0; i < n; i++) h += '<li><span class="zdjecie" aria-hidden="true">' + ik('aparat') + '</span><span>Zdjęcie ' + (i + 1) + ': ' + ZDJECIA[i].toLowerCase() + '</span></li>';
        h += '</ul>';
      }
      return h + (n < 3 ? przyciskAkcji('stluczka', 'zdjecie', 'aparat', 'Zrób zdjęcie (' + (n + 1) + ' z 3)') :
        '<p class="komunikat-ok statyczny" tabindex="-1">' + ik('ok') + '<span>Masz 3 zdjęcia uszkodzeń.</span></p>');
    }
    function opisSprawcy(o, s) { return s.sprawca === 'ja' ? 'Ja (' + P.daneOsoby(o).imie + ')' : 'Drugi kierowca (' + DRUGI.imie + ')'; }
    K.stluczka = {
      nazwa: 'Zgłoś stłuczkę (mStłuczka)',
      brak: function (o, s, krok) {
        if (krok >= 2 && !P.pojazd(o)) {
          return brak('Nie masz pojazdu w aplikacji.', 'Oświadczenie spiszesz, gdy w Moich pojazdach jest Twoje auto.', [link('#/uslugi/samochod', 'auto', 'Usługi: Samochód', true)]);
        }
        return null;
      },
      parametry: function (s, p) { if (p.get('ranny') === 'nie') s.ranny = 'nie'; },
      kroki: [
        { h1: 'Bezpieczeństwo',
          widok: function (o, s) {
            return P.grupaPol('ranny', 'Czy ktoś jest ranny?', radia('ranny', [['tak', 'Tak, ktoś jest ranny', 'Pokażemy, jak wezwać pomoc.'], ['nie', 'Nie, nikt nie jest ranny']], s.ranny)) +
              info('Jeśli możesz, włącz światła awaryjne i ustaw trójkąt ostrzegawczy.', 'uwaga');
          },
          dalej: function (o, s, zaznaczone, tekst, blad) {
            var v = zaznaczone('ranny')[0];
            if (!v) return blad('ranny', 'Wybierz odpowiedź. To ważne dla Twojego bezpieczeństwa.');
            s.ranny = v;
            if (v === 'tak') return '#/sprawa/stluczka/112';
          },
          gotowy: function (s) { return s.ranny === 'nie'; } },
        { h1: 'Uczestnicy',
          widok: function (o, s) {
            var p = P.pojazd(o).pojazd;
            return '<h2>Twój samochód</h2>' + P.daneHtml([['Pojazd', p.marka + ', ' + p.numer], ['Ubezpieczenie OC', p.ubezpieczyciel + ', polisa ' + p.polisa]]) +
              '<h2>Drugi kierowca</h2><div id="skan-drugi" class="skan" aria-describedby="blad-skan-drugi">' + P.bladHtml('skan-drugi') + '<div id="skan-drugi-wynik">' +
              (s.drugi ? wynikSkanu(daneDrugiego()) : '<p class="podtytul">Poproś drugiego kierowcę, żeby otworzył w mObywatelu zakładkę Kod QR.</p>' +
                przyciskAkcji('stluczka', 'skanuj', 'skan', 'Zeskanuj kod drugiego kierowcy')) + '</div></div>';
          },
          dalej: function (o, s, zaznaczone, tekst, blad) {
            if (!s.drugi) return blad('skan-drugi', 'Zeskanuj kod z mObywatela drugiego kierowcy. W prototypie wystarczy kliknąć.');
          },
          gotowy: function (s) { return !!s.drugi; } },
        { h1: 'Kto spowodował zdarzenie?',
          widok: function (o, s) {
            return P.grupaPol('sprawca', 'Kto spowodował zdarzenie?', radia('sprawca', [['ja', 'Ja', 'Szkodę drugiego kierowcy pokryje Twoje OC.'],
              ['drugi', 'Drugi kierowca', 'Twoją szkodę pokryje OC drugiego kierowcy.'], ['spor', 'Nie jesteśmy zgodni', 'Pokażemy, jak wezwać policję.']], s.sprawca));
          },
          dalej: function (o, s, zaznaczone, tekst, blad) {
            var v = zaznaczone('sprawca')[0];
            if (!v) return blad('sprawca', 'Wybierz, kto spowodował zdarzenie.');
            s.sprawca = v;
            if (v === 'spor') return '#/sprawa/stluczka/policja';
          },
          gotowy: function (s) { return s.sprawca === 'ja' || s.sprawca === 'drugi'; } },
        { h1: 'Okoliczności',
          widok: function (o, s) {
            return P.grupaPol('okol', 'Co się stało?', radia('okol', OKOLICZNOSCI, s.okol)) +
              P.poleOpisu('s-opis', 'opis', 'Opisz krótko, co się stało', s.opis, { podpowiedz: 'Nieobowiązkowe. Przy „Inaczej — opiszę” wpisz opis, np. auto cofało z parkingu.' }) +
              P.poleTekstowe('s-miejsce', 'miejsce', 'Gdzie to się stało?', s.miejsce, { podpowiedz: 'Na przykład: Warszawa, parking przy ul. Słonecznej 4' });
          },
          dalej: function (o, s, zaznaczone, tekst, blad) {
            var v = zaznaczone('okol')[0], opis = tekst('opis').replace(/\s+/g, ' '), miejsce = tekst('miejsce').replace(/\s+/g, ' '), zle = 0;
            if (!v) { blad('okol', 'Wybierz, co się stało.'); zle++; }
            if (v === 'inne' && !opis) { blad('s-opis', 'Opisz, co się stało, np. „auto cofało z parkingu”.'); zle++; }
            else if (opis.length > 500) { blad('s-opis', 'Opis jest za długi. Wpisz najwyżej 500 znaków.'); zle++; }
            if (!miejsce) { blad('s-miejsce', 'Wpisz, gdzie to się stało, np. Warszawa, ul. Słoneczna 4.'); zle++; }
            else if (miejsce.length > 100) { blad('s-miejsce', 'Wpisz najwyżej 100 znaków, np. Warszawa, ul. Słoneczna 4.'); zle++; }
            else if (!P.LITERA.test(miejsce)) { blad('s-miejsce', 'Wpisz nazwę miejsca literami, np. Warszawa, ul. Słoneczna 4.'); zle++; }
            if (zle) return;
            s.okol = v; s.opis = opis; s.miejsce = miejsce;
            if (!s.czas) s.czas = godzinaTeraz();
          },
          gotowy: function (s) { return !!(s.okol && s.miejsce); } },
        { h1: 'Zdjęcia uszkodzeń',
          widok: function (o, s) {
            return '<p class="podtytul">Zrób zdjęcia obu aut i miejsca zdarzenia. W prototypie zdjęcia są udawane.</p>' +
              '<div id="zdjecia" aria-describedby="blad-zdjecia">' + P.bladHtml('zdjecia') + '<div id="zdjecia-wynik">' + galeria(s) + '</div></div>';
          },
          dalej: function (o, s, zaznaczone, tekst, blad) {
            if (!s.zdjecia) return blad('zdjecia', 'Zrób co najmniej jedno zdjęcie uszkodzeń.');
          },
          gotowy: function (s) { return (s.zdjecia || 0) >= 1; } },
        { h1: 'Sprawdź oświadczenie', potwierdzenie: true, wroc: '#/sprawa/stluczka/krok-5',
          widok: function (o, s) {
            var p = P.pojazd(o).pojazd;
            return P.podsumowanie('Co zrobimy', ['Wyślemy oświadczenie o zdarzeniu do drugiego kierowcy.', 'Drugi kierowca potwierdzi je w swoim mObywatelu.', 'Oświadczenie trafi do Skrzynki obu kierowców.']) +
              '<h2>Oświadczenie</h2>' + P.daneHtml([['Data i godzina', D.dzis + ', ' + s.czas], ['Miejsce', s.miejsce, '#/sprawa/stluczka/krok-4'],
                ['Twój pojazd', p.marka + ', ' + p.numer], ['Drugi pojazd', DRUGI.pojazd + ', ' + DRUGI.numer + ' (' + DRUGI.imie + ')', '#/sprawa/stluczka/krok-2'],
                ['Kto spowodował', opisSprawcy(o, s), '#/sprawa/stluczka/krok-3'],
                ['Co się stało', nazwaOpcji(OKOLICZNOSCI, s.okol) + (s.opis ? ': ' + s.opis : ''), '#/sprawa/stluczka/krok-4'],
                ['Zdjęcia', s.zdjecia + ' ' + P.odmiana(s.zdjecia, 'zdjęcie', 'zdjęcia', 'zdjęć'), '#/sprawa/stluczka/krok-5']]);
          } }
      ],
      ekrany: {
        '112': function () {
          return { h1: 'Zadzwoń pod 112', rodzic: '#/sprawa/stluczka',
            html: '<div class="alarm-duzy" role="alert">' + ik('uwaga') + '<p><b>Ktoś jest ranny. Zadzwoń pod 112.</b></p><p>Powiedz, gdzie jesteś i co się stało.</p></div>' +
              przyciski([alarmLink('tel:112', 'Zadzwoń pod 112'), link('#/sprawa/stluczka', 'wstecz', 'Wróć do pytania'), dokumentyBtn()]) +
              info('Gdy ktoś jest ranny, oświadczenie nie wystarczy. Na miejsce przyjedzie policja.') };
        },
        policja: function () {
          return { h1: 'Wezwij policję', rodzic: '#/sprawa/stluczka/krok-3',
            html: '<div class="alarm-duzy" role="alert">' + ik('uwaga') + '<p><b>Nie jesteście zgodni. Wezwijcie policję.</b></p><p>Policja ustali, kto spowodował zdarzenie.</p></div>' +
              przyciski([alarmLink('tel:112', 'Zadzwoń na policję: 112'), link('#/sprawa/stluczka/krok-3', 'wstecz', 'Wróć i zmień odpowiedź'), dokumentyBtn()]) };
        }
      },
      akcje: {
        skanuj: function (o, s) {
          s.drugi = DRUGI.imie;
          return { cel: 'skan-drugi-wynik', html: wynikSkanu(daneDrugiego()), ogloszenie: 'Zeskanowano kod. Drugi kierowca: ' + DRUGI.imie + '.', ukryjBlad: 'skan-drugi', fokus: '#skan-drugi-wynik .komunikat-ok' };
        },
        zdjecie: function (o, s) {
          s.zdjecia = Math.min(3, (s.zdjecia || 0) + 1);
          return { cel: 'zdjecia-wynik', html: galeria(s), ogloszenie: 'Dodano zdjęcie ' + s.zdjecia + ' z 3.', ukryjBlad: 'zdjecia',
            fokus: s.zdjecia < 3 ? '#zdjecia-wynik button' : '#zdjecia-wynik .komunikat-ok' };
        }
      },
      zakoncz: function (o, w, s) {
        var p = P.pojazd(o).pojazd, numer = P.numer('OS'), os = P.daneOsoby(o);
        w.stluczka = { numer: numer, sprawca: s.sprawca, data: D.dzis, czas: s.czas, miejsce: s.miejsce, zdjecia: s.zdjecia };
        delete w.szkoda;
        var przebieg = [nazwaOpcji(OKOLICZNOSCI, s.okol).replace(' — opiszę', '') + '.'].concat(s.opis ? ['Opis: ' + s.opis] : []);
        return {
          zdanie: 'Oświadczenie o zdarzeniu jest gotowe.',
          fakty: [['ok', 'Drugi kierowca potwierdził oświadczenie w swoim mObywatelu (w prototypie od razu).'], ['list', 'Oświadczenie nr ' + numer + ' jest w Skrzynce.']],
          coDalej: s.sprawca === 'drugi' ? [{ tekst: 'Zgłoś szkodę ubezpieczycielowi sprawcy', ikona: 'tarcza', href: '#/sprawa/szkoda' }] :
            [{ tekst: 'Co dalej ze szkodą drugiego kierowcy?', ikona: 'info', info: ['Szkoda drugiego kierowcy', 'Drugi kierowca zgłosi szkodę do Twojego ubezpieczyciela (' + p.ubezpieczyciel + '). Ty nie musisz nic robić.'] }],
          wiadomosc: { tytul: 'Oświadczenie o zdarzeniu drogowym', rodzaj: 'Oświadczenie',
            metryczka: [['Numer oświadczenia', numer], ['Data i godzina zdarzenia', D.dzis + ', ' + s.czas], ['Miejsce zdarzenia', s.miejsce]],
            tresc: ['Kierowcy spisali wspólne oświadczenie o zdarzeniu drogowym.', 'Oświadczenie potwierdzono w aplikacji mObywatel.'],
            sekcje: [{ tytul: 'Pojazdy i kierowcy', tabela: [['Pojazd 1: ' + os.imie, p.marka + ', ' + p.numer + ', OC: ' + p.ubezpieczyciel],
              ['Pojazd 2: ' + DRUGI.imie, DRUGI.pojazd + ', ' + DRUGI.numer + ', OC: ' + DRUGI.ubezpieczyciel]] },
              { tytul: 'Przebieg zdarzenia', akapity: przebieg },
              { tytul: 'Sprawca zdarzenia', akapity: [s.sprawca === 'ja' ? os.imie + ' (pojazd 1).' : DRUGI.imie + ' (pojazd 2).'] },
              { tytul: 'Zdjęcia', akapity: [s.zdjecia + ' ' + P.odmiana(s.zdjecia, 'zdjęcie', 'zdjęcia', 'zdjęć') + ' uszkodzeń dołączono do oświadczenia.'] }] }
        };
      }
    };

    /* Zgłoszenie szkody z OC sprawcy (dla poszkodowanego, po oświadczeniu) */
    K.szkoda = {
      nazwa: 'Zgłoś szkodę z OC sprawcy',
      brak: function (o) {
        var w = P.wyniki(o);
        if (!w.stluczka) return brak('Najpierw spisz oświadczenie o zdarzeniu.', 'Szkodę zgłosisz, gdy sprawcą jest drugi kierowca.', [link('#/sprawa/stluczka', 'auto', 'Zgłoś stłuczkę (mStłuczka)', true)]);
        if (w.stluczka.sprawca !== 'drugi') return brak('W oświadczeniu sprawcą jesteś Ty.', 'Drugi kierowca zgłosi szkodę do Twojego ubezpieczyciela.', [link('#/skrzynka', 'list', 'Otwórz Skrzynkę', true)]);
        if (w.szkoda) return brak('Szkoda jest już zgłoszona.', 'Numer szkody: ' + w.szkoda.numer + '.', [link('#/skrzynka', 'list', 'Otwórz Skrzynkę', true)]);
        return null;
      },
      kroki: [
        { h1: 'Jak rozliczyć szkodę?',
          widok: function (o, s) {
            return P.grupaPol('naprawa', 'Jak chcesz rozliczyć szkodę?', radia('naprawa', [['warsztat', 'Naprawa w warsztacie', 'Ubezpieczyciel zapłaci warsztatowi za naprawę.'],
              ['kosztorys', 'Wypłata pieniędzy', 'Ubezpieczyciel wyceni szkodę i przeleje Ci pieniądze.']], s.naprawa));
          },
          dalej: function (o, s, zaznaczone, tekst, blad) {
            var v = zaznaczone('naprawa')[0];
            if (!v) return blad('naprawa', 'Wybierz, jak chcesz rozliczyć szkodę.');
            s.naprawa = v;
          },
          gotowy: function (s) { return !!s.naprawa; } },
        { h1: 'Sprawdź zgłoszenie szkody', potwierdzenie: true, wroc: '#/sprawa/szkoda',
          widok: function (o, s) {
            var w = P.wyniki(o), p = P.pojazd(o).pojazd;
            return P.podsumowanie('Co zrobimy', ['Zgłosimy szkodę do ubezpieczyciela sprawcy (' + DRUGI.ubezpieczyciel + ').', 'Dołączymy oświadczenie nr ' + w.stluczka.numer + ' i zdjęcia.']) +
              '<h2>Zgłoszenie</h2>' + P.daneHtml([['Ubezpieczyciel sprawcy', DRUGI.ubezpieczyciel], ['Polisa sprawcy', DRUGI.polisa], ['Oświadczenie', w.stluczka.numer + ', ' + w.stluczka.data],
                ['Twój pojazd', p.marka + ', ' + p.numer], ['Rozliczenie', s.naprawa === 'warsztat' ? 'Naprawa w warsztacie' : 'Wypłata pieniędzy', '#/sprawa/szkoda'], ['Kontakt do Ciebie', o.telefon]]);
          } }
      ],
      zakoncz: function (o, w, s) {
        var numer = P.numer('SZ');
        w.szkoda = { numer: numer, data: D.dzis, naprawa: s.naprawa };
        return {
          zdanie: 'Szkoda jest zgłoszona do ubezpieczyciela sprawcy.',
          fakty: [['ok', 'Numer szkody: ' + numer + '.'], ['telefon', 'Ubezpieczyciel zadzwoni, żeby umówić oględziny auta.']], coDalej: [],
          wiadomosc: { tytul: 'Zgłoszenie szkody z OC sprawcy', rodzaj: 'Potwierdzenie',
            metryczka: [['Numer szkody', numer], ['Ubezpieczyciel', DRUGI.ubezpieczyciel], ['Data zgłoszenia', D.dzis]],
            tresc: ['Zgłosiliśmy szkodę z polisy OC sprawcy: ' + DRUGI.polisa + '.', 'Dołączyliśmy oświadczenie o zdarzeniu nr ' + w.stluczka.numer + '.',
              'Ubezpieczyciel skontaktuje się z Tobą, żeby umówić oględziny auta.'] }
        };
      }
    };

    /* =====================================================================
       WNIOSEK O DOWÓD OSOBISTY: powód → urząd → wizyta → sprawdź → Gotowe.
       Wniosek składa się osobiście (odciski palców); odbiór też osobiście.
       ===================================================================== */
    var POWODY = [['utrata', 'Zgubienie albo kradzież'], ['waznosc', 'Kończy się ważność dowodu'], ['dane', 'Zmiana danych, np. nazwiska'],
      ['uszkodzenie', 'Dowód jest uszkodzony'], ['inny', 'Inny powód']];
    function terminyWizyt() {
      var wynik = [], d = 2, godziny = ['10:00', '12:30', '08:45'];
      while (wynik.length < 3) {
        var t = D.dataZaDni(d++);
        if (t.getDay() === 0 || t.getDay() === 6) continue;
        var tekst = D.formatuj(t) + ', ' + godziny[wynik.length];
        wynik.push([tekst, tekst, DNI[t.getDay()].charAt(0).toUpperCase() + DNI[t.getDay()].slice(1) + '.']);
      }
      return wynik;
    }
    K['wniosek-dowod'] = {
      nazwa: 'Wniosek o dowód osobisty',
      brak: function (o) {
        var w = P.wyniki(o).wniosekDowod;
        if (w) return brak('Wizyta w urzędzie jest już umówiona: ' + w.wizyta + '.', w.urzad + ', ' + w.adres + '.', [link('#/skrzynka/' + w.wiadomosc, 'list', 'Pokaż potwierdzenie', true)]);
        return null;
      },
      kroki: [
        { h1: 'Powód',
          widok: function (o, s) {
            var uniewazniony = P.wyniki(o).dowodUniewazniony;
            if (uniewazniony && !s.powod) s.powod = 'utrata';
            return (uniewazniony ? info('Twój stary dowód jest unieważniony. Zaznaczyliśmy powód: zgubienie albo kradzież.') : '') +
              P.grupaPol('powod', 'Dlaczego potrzebujesz nowego dowodu?', radia('powod', POWODY, s.powod));
          },
          dalej: function (o, s, zaznaczone, tekst, blad) {
            var v = zaznaczone('powod')[0];
            if (!v) return blad('powod', 'Wybierz powód.');
            s.powod = v;
          },
          gotowy: function (s) { return !!s.powod; } },
        { h1: 'Urząd',
          widok: function (o, s) {
            return P.grupaPol('urzad', 'Gdzie złożysz wniosek?', radia('urzad', o.urzedy.map(function (u, i) { return [String(i), u.nazwa, u.adres]; }), s.urzad)) +
              info('Wniosek złożysz w dowolnym urzędzie gminy w Polsce.');
          },
          dalej: function (o, s, zaznaczone, tekst, blad) {
            var v = zaznaczone('urzad')[0];
            if (v === undefined) return blad('urzad', 'Wybierz urząd.');
            s.urzad = v;
          },
          gotowy: function (s) { return s.urzad !== undefined; } },
        { h1: 'Termin wizyty',
          widok: function (o, s) {
            return '<p class="podtytul">Wniosek złożysz osobiście. Urzędnik pobierze odciski palców.</p>' +
              P.grupaPol('wizyta', 'Wybierz termin wizyty', radia('wizyta', terminyWizyt(), s.wizyta)) +
              P.grupaPol('przypomnij', 'Przypomnienie', P.opcjaPola('checkbox', 'przypomnij', 'tak', 'Przypomnij mi dzień wcześniej', s.przypomnij !== false, 'SMS na numer ' + o.telefon));
          },
          dalej: function (o, s, zaznaczone, tekst, blad) {
            var v = zaznaczone('wizyta')[0];
            if (!v) return blad('wizyta', 'Wybierz termin wizyty.');
            s.wizyta = v; s.przypomnij = zaznaczone('przypomnij').length > 0;
          },
          gotowy: function (s) { return !!s.wizyta; } },
        { h1: 'Sprawdź, zanim wyślemy', potwierdzenie: true, wroc: '#/sprawa/wniosek-dowod/krok-3',
          widok: function (o, s) {
            var u = o.urzedy[+s.urzad], os = P.daneOsoby(o);
            return P.podsumowanie('Co zrobimy', ['Przygotujemy wniosek z Twoimi danymi z rejestru PESEL.', 'Zarezerwujemy wizytę w urzędzie.']
              .concat(s.przypomnij ? ['Przypomnimy Ci o wizycie dzień wcześniej.'] : [])) +
              '<h2>Na wizycie</h2>' + punktyInfo([['odcisk', 'Urzędnik pobierze odciski palców. Złożysz podpis.'], ['aparat', 'Zabierz jedno aktualne zdjęcie 35 × 45 mm.'],
                ['dowod', 'Nowy dowód odbierzesz osobiście w tym samym urzędzie.']]) +
              '<h2>Twoje dane</h2>' + P.daneHtml([['Imię i nazwisko', os.imie], ['PESEL', os.pesel], ['Powód', nazwaOpcji(POWODY, s.powod), '#/sprawa/wniosek-dowod'],
                ['Urząd', u.nazwa + ', ' + u.adres, '#/sprawa/wniosek-dowod/krok-2'], ['Wizyta', s.wizyta, '#/sprawa/wniosek-dowod/krok-3'],
                ['Przypomnienie', s.przypomnij ? 'SMS dzień wcześniej' : 'bez przypomnienia', '#/sprawa/wniosek-dowod/krok-3']]);
          } }
      ],
      zakoncz: function (o, w, s, idWiadomosci) {
        var u = o.urzedy[+s.urzad], numer = P.numer('WD');
        w.wniosekDowod = { urzad: u.nazwa, adres: u.adres, wizyta: s.wizyta, przypomnij: s.przypomnij, data: D.dzis, numer: numer, wiadomosc: idWiadomosci };
        return {
          zdanie: 'Wizyta umówiona: ' + s.wizyta + '.',
          fakty: [['kalendarz', u.nazwa + ', ' + u.adres + '.'], ['odcisk', 'W urzędzie pobiorą odciski palców. Zabierz zdjęcie 35 × 45 mm.']]
            .concat(s.przypomnij ? [['dzwonek', 'Przypomnimy Ci SMS-em dzień wcześniej.']] : []),
          coDalej: [],
          wiadomosc: { tytul: 'Wizyta w urzędzie: wniosek o dowód osobisty', rodzaj: 'Potwierdzenie',
            metryczka: [['Numer rezerwacji', numer], ['Termin wizyty', s.wizyta], ['Urząd', u.nazwa + ', ' + u.adres]],
            tresc: ['Zarezerwowaliśmy wizytę w sprawie dowodu osobistego.', 'Wniosek z Twoimi danymi jest gotowy. Podpiszesz go w urzędzie.'],
            sekcje: [{ tytul: 'Co zabrać', akapity: ['Jedno aktualne zdjęcie 35 × 45 mm.', 'Obecny dowód osobisty, jeśli go masz.'] },
              { tytul: 'W urzędzie', akapity: ['Urzędnik pobierze odciski palców i poprosi o podpis.', 'Dowód odbierzesz osobiście w tym samym urzędzie.'] }] }
        };
      }
    };

    /* =====================================================================
       COFNIĘCIE ZASTRZEŻENIA PESEL (np. gdy dowód się znalazł) — na stałe albo na czas.
       ===================================================================== */
    K['cofnij-pesel'] = {
      nazwa: 'Cofnij zastrzeżenie PESEL',
      brak: function (o) {
        if (!P.wyniki(o).pesel) return brak('Twój PESEL nie jest zastrzeżony.', 'Nie ma czego cofać.', [link('#/sprawa/zgubione/krok-2?tylko=pesel', 'tarcza', 'Zastrzeż PESEL', true)]);
        return null;
      },
      kroki: [
        { h1: 'Na jak długo?',
          widok: function (o, s) {
            return '<p class="podtytul">Twój PESEL jest zastrzeżony od ' + P.wyniki(o).pesel + '.</p>' +
              P.grupaPol('naJak', 'Na jak długo cofnąć zastrzeżenie?', radia('naJak', [['stale', 'Na stałe', 'Na przykład, gdy dokument się znalazł.'],
                ['czas', 'Na określony czas', 'Na przykład, gdy bierzesz kredyt. Potem zastrzeżenie wróci samo.']], s.naJak)) +
              P.poleTekstowe('p-do', 'do', 'Do kiedy cofnąć zastrzeżenie?', s.naJak === 'czas' ? s.do : '', { inputmode: 'numeric', zaznacz: 'naJak:czas',
                podpowiedz: 'Tylko przy „Na określony czas”. Dzień.miesiąc.rok, np. ' + D.formatuj(D.dataZaDni(14)) }) +
              alarm('Bez zastrzeżenia ktoś z Twoim dowodem może wziąć kredyt na Twoje dane.');
          },
          dalej: function (o, s, zaznaczone, tekst, blad) {
            var v = zaznaczone('naJak')[0];
            if (!v) return blad('naJak', 'Wybierz, na jak długo cofnąć zastrzeżenie.');
            if (v === 'czas') {
              var t = tekst('do');
              if (!t) return blad('p-do', 'Wpisz datę, np. ' + D.formatuj(D.dataZaDni(14)) + '.');
              var d = dataPrzyszla(t);
              if (d.blad) return blad('p-do', d.blad);
              s.do = d.data;
            } else s.do = null;
            s.naJak = v;
          },
          gotowy: function (s) { return !!s.naJak; } },
        { h1: 'Sprawdź, zanim wyślemy', potwierdzenie: true, wroc: '#/sprawa/cofnij-pesel',
          widok: function (o, s) {
            var os = P.daneOsoby(o);
            return P.podsumowanie('Co zrobimy', [s.naJak === 'czas' ? 'Cofniemy zastrzeżenie PESEL do ' + s.do + '. Potem wróci samo.' : 'Cofniemy zastrzeżenie PESEL na stałe.']) +
              '<h2>Twoje dane</h2>' + P.daneHtml([['Imię i nazwisko', os.imie], ['PESEL', os.pesel], ['Zastrzeżony od', P.wyniki(o).pesel],
                ['Cofnięcie', s.naJak === 'czas' ? 'do ' + s.do : 'na stałe', '#/sprawa/cofnij-pesel']]);
          } }
      ],
      zakoncz: function (o, w, s) {
        var numer = P.numer('ZP');
        delete w.pesel;
        w.peselCofniety = { data: D.dzis, do: s.do || null };
        return {
          zdanie: s.do ? 'Zastrzeżenie PESEL jest cofnięte do ' + s.do + '.' : 'Zastrzeżenie PESEL jest cofnięte.',
          fakty: [['info', s.do ? 'Po tym dniu PESEL będzie znów zastrzeżony.' : 'PESEL zastrzeżesz znowu w każdej chwili.']],
          coDalej: [{ tekst: 'Zastrzeż PESEL ponownie', ikona: 'tarcza', href: '#/sprawa/zgubione/krok-2?tylko=pesel' }],
          wiadomosc: { tytul: 'Potwierdzenie: cofnięcie zastrzeżenia PESEL', rodzaj: 'Potwierdzenie',
            metryczka: [['Numer zgłoszenia', numer], ['Data', D.dzis]],
            tresc: [s.do ? 'Zastrzeżenie numeru PESEL jest cofnięte do ' + s.do + '.' : 'Zastrzeżenie numeru PESEL jest cofnięte na stałe.',
              'Zastrzeżenie włączysz znowu w każdej chwili w aplikacji mObywatel.'] }
        };
      }
    };

    /* =====================================================================
       KUPNO UŻYWANEGO AUTA: dane pojazdu → historia pojazdu → umowa → sprawdź → Gotowe.
       Obok: kalkulator podatku PCC (2% wartości, 14 dni).
       ===================================================================== */
    var AUTO = { marka: 'Volkswagen Golf 1.6 TDI', rok: '2017', wlasciciele: '3', oc: D.formatuj(D.dataZaDni(41)), badanie: D.formatuj(D.dataZaDni(133)),
      przebiegi: [['Badanie techniczne 2021', km(121300)], ['Badanie techniczne 2023', km(186400)], ['Badanie techniczne 2025', km(142100)]] };
    var SPRZEDAJACY = { imie: 'Jan Wójcik', adres: 'ul. Leśna 9, 05-500 Piaseczno' };
    var ZDJECIE_DOWODU = { numer: 'KR 5G721', vin: 'WVWZZZAUZHW123456', data: '14.03.2017' };
    function pcc(cena) { return cena <= 1000 ? 0 : Math.round(cena * 0.02); }
    function liczba(t) { var c = String(t).replace(/[\s .]/g, '').replace(/(zł|zl|km)$/i, ''); return /^\d{1,9}$/.test(c) ? +c : NaN; }
    function tekstPcc(t) {
      var c = liczba(t);
      if (isNaN(c) || c < 1) return 'Wpisz cenę samymi cyframi, np. 32000.';
      return c <= 1000 ? 'Auto za ' + zl(c) + ' — bez podatku PCC.' : 'Auto za ' + zl(c) + ' → podatek PCC: ' + zl(pcc(c)) + '.';
    }
    K['kupno-auta'] = {
      nazwa: 'Sprawdź auto przed zakupem',
      kroki: [
        { h1: 'Dane pojazdu',
          widok: function (o, s) {
            return '<p class="podtytul">Te dane znajdziesz w dowodzie rejestracyjnym auta, które chcesz kupić.</p>' +
              '<div class="przyciski-pion">' + przyciskAkcji('kupno-auta', 'zdjecie-dowodu', 'aparat', 'Zrób zdjęcie dowodu rejestracyjnego') + '</div><div id="k-skan"></div>' +
              P.poleTekstowe('k-numer', 'numer', 'Numer rejestracyjny', s.numer, { podpowiedz: 'Na przykład: KR 5G721' }) +
              P.poleTekstowe('k-vin', 'vin', 'Numer VIN', s.vin, { podpowiedz: '17 znaków, pole E w dowodzie rejestracyjnym' }) +
              P.poleTekstowe('k-data', 'data', 'Data pierwszej rejestracji', s.dataRej, { inputmode: 'numeric', podpowiedz: 'Pole B w dowodzie rejestracyjnym, np. 14.03.2017' });
          },
          dalej: function (o, s, zaznaczone, tekst, blad) {
            var numer = tekst('numer').toUpperCase().replace(/\s+/g, ' '), nr = numer.replace(/[\s-]/g, ''), vin = tekst('vin').toUpperCase().replace(/[\s-]/g, ''), zle = 0;
            if (!nr) { blad('k-numer', 'Wpisz numer z tablicy rejestracyjnej, np. KR 5G721.'); zle++; }
            else if (!/^[A-Z]{1,3}[A-Z0-9]{2,6}$/.test(nr) || nr.length < 4 || nr.length > 8 || !/\d/.test(nr)) { blad('k-numer', 'Sprawdź numer. Ma litery i cyfry, np. KR 5G721.'); zle++; }
            if (!vin) { blad('k-vin', 'Wpisz numer VIN. Znajdziesz go w polu E dowodu rejestracyjnego.'); zle++; }
            else if (/[^A-Z0-9]/.test(vin)) { blad('k-vin', 'VIN ma tylko litery i cyfry, bez innych znaków.'); zle++; }
            else if (vin.length !== 17) { blad('k-vin', 'VIN ma 17 znaków. Wpisano ' + vin.length + '.'); zle++; }
            else if (/[IOQ]/.test(vin)) { blad('k-vin', 'W VIN nie ma liter I, O ani Q. To pewnie cyfra 1 albo 0.'); zle++; }
            var t = tekst('data'), d = t ? P.sprawdzDate(t, { przyszlosc: 'Ta data jest w przyszłości. Sprawdź pole B w dowodzie rejestracyjnym.' }) : null;
            if (!t) { blad('k-data', 'Wpisz datę pierwszej rejestracji, np. 14.03.2017.'); zle++; }
            else if (d.blad) { blad('k-data', d.blad); zle++; }
            if (zle) return;
            s.numer = numer; s.vin = vin; s.dataRej = d.data;
          },
          gotowy: function (s) { return !!s.vin; } },
        { h1: 'Historia pojazdu', bezFormularza: true,
          widok: function (o, s) {
            return '<p class="podtytul">Raport z Centralnej Ewidencji Pojazdów. W prototypie raport jest przykładowy.</p>' +
              P.daneHtml([['Pojazd', AUTO.marka + ', rok produkcji ' + AUTO.rok], ['Numer rejestracyjny', s.numer], ['VIN', s.vin], ['Pierwsza rejestracja', s.dataRej],
                ['Liczba właścicieli', AUTO.wlasciciele]]) +
              '<h2>Co sprawdziliśmy</h2><ul class="statusy">' +
                '<li class="status-wiersz pilne">' + ik('uwaga') + '<span><b>Uwaga: niezgodny przebieg.</b> W 2023 roku licznik pokazywał ' + km(186400) + ', a w 2025 roku ' + km(142100) + '. Licznik mógł być cofnięty.</span></li>' +
                '<li class="status-wiersz info">' + ik('info') + '<span><b>1 szkoda z OC w 2021 roku</b> — zapytaj sprzedającego o naprawę.</span></li>' +
                '<li class="status-wiersz ok">' + ik('ok') + '<span><b>OC ważne do ' + AUTO.oc + '</b> — w porządku</span></li>' +
                '<li class="status-wiersz ok">' + ik('ok') + '<span><b>Badanie techniczne ważne do ' + AUTO.badanie + '</b> — w porządku</span></li>' +
                '<li class="status-wiersz ok">' + ik('ok') + '<span><b>Nie jest zgłoszony jako kradziony</b></span></li></ul>' +
              '<h2>Odczyty licznika</h2>' + P.daneHtml(AUTO.przebiegi) +
              przyciski([link('#/sprawa/kupno-auta/krok-3', 'dokumenty', 'Przygotuj umowę kupna-sprzedaży', true), link('#/sprawa/kupno-auta/pcc', 'paragon', 'Ile zapłacę podatku PCC?'), dokumentyBtn()]);
          } },
        { h1: 'Umowa: sprzedający i cena',
          widok: function (o, s) {
            return '<h2>Sprzedający</h2><div id="k-sprzedajacy" class="skan" aria-describedby="blad-k-sprzedajacy">' + P.bladHtml('k-sprzedajacy') + '<div id="k-sprzedajacy-wynik">' +
              (s.sprzedajacy ? wynikSkanu([['Sprzedający', SPRZEDAJACY.imie], ['Adres', SPRZEDAJACY.adres]]) :
                '<p class="podtytul">Poproś sprzedającego, żeby otworzył w mObywatelu zakładkę Kod QR.</p>' + przyciskAkcji('kupno-auta', 'skanuj', 'skan', 'Zeskanuj kod sprzedającego')) +
              '</div></div><h2>Cena i przebieg</h2>' +
              P.poleTekstowe('k-cena', 'cena', 'Cena auta (zł)', s.cena, { inputmode: 'numeric', podpowiedz: 'Samymi cyframi, np. 32000' }) +
              P.poleTekstowe('k-przebieg', 'przebieg', 'Przebieg (km)', s.przebieg, { inputmode: 'numeric', podpowiedz: 'Stan licznika w dniu zakupu, np. 142100' });
          },
          dalej: function (o, s, zaznaczone, tekst, blad) {
            var cena = liczba(tekst('cena')), przebieg = liczba(tekst('przebieg')), zle = 0;
            if (!s.sprzedajacy) { blad('k-sprzedajacy', 'Zeskanuj kod sprzedającego. W prototypie wystarczy kliknąć.'); zle++; }
            if (!tekst('cena')) { blad('k-cena', 'Wpisz cenę auta, np. 32000.'); zle++; }
            else if (isNaN(cena) || cena < 1 || cena > 10000000) { blad('k-cena', 'Wpisz cenę w złotych, samymi cyframi, np. 32000.'); zle++; }
            if (!tekst('przebieg')) { blad('k-przebieg', 'Wpisz przebieg, np. 142100.'); zle++; }
            else if (isNaN(przebieg) || przebieg > 2000000) { blad('k-przebieg', 'Wpisz przebieg w kilometrach, samymi cyframi, np. 142100.'); zle++; }
            if (zle) return;
            s.cena = cena; s.przebieg = przebieg;
          },
          gotowy: function (s) { return !!(s.sprzedajacy && s.cena && s.przebieg !== undefined); } },
        { h1: 'Sprawdź umowę', potwierdzenie: true, wroc: '#/sprawa/kupno-auta/krok-3',
          widok: function (o, s) {
            var os = P.daneOsoby(o);
            return P.podsumowanie('Co zrobimy', ['Przygotujemy umowę kupna-sprzedaży samochodu.', 'Sprzedający podpisze ją w swoim mObywatelu.', 'Umowa trafi do Twojej Skrzynki.']) +
              '<h2>Umowa</h2>' + P.daneHtml([['Sprzedający', SPRZEDAJACY.imie + ', ' + SPRZEDAJACY.adres], ['Kupujący', os.imie + ', ' + o.adres],
                ['Samochód', AUTO.marka + ', ' + s.numer], ['VIN', s.vin, '#/sprawa/kupno-auta'], ['Cena', zl(s.cena), '#/sprawa/kupno-auta/krok-3'],
                ['Przebieg', km(s.przebieg), '#/sprawa/kupno-auta/krok-3'], ['Data i miejsce', D.dzis + ', ' + miasto(o)]]) +
              info('Podatek PCC: ' + zl(pcc(s.cena)) + '. Zapłać go w ciągu 14 dni od zakupu.', 'paragon');
          } }
      ],
      ekrany: {
        pcc: function (o, s) {
          return { h1: 'Podatek PCC', rodzic: '#/sprawa/kupno-auta/krok-2',
            html: '<p class="podtytul">Kupujesz auto od osoby prywatnej? Zapłacisz podatek PCC: 2% wartości auta.</p>' +
              P.poleTekstowe('k-pcc', 'pcc', 'Cena auta (zł)', s.cena || 32000, { inputmode: 'numeric', podpowiedz: 'Wpisz cenę, a policzymy podatek' }) +
              '<p class="wynik-pcc" id="wynik-pcc" aria-live="polite">' + tekstPcc(s.cena || 32000) + '</p>' +
              '<h2>Ważne</h2>' + punktyInfo([['kalendarz', 'Zapłać podatek w ciągu 14 dni od zakupu.'], ['dokumenty', 'Złóż deklarację PCC-3 w urzędzie skarbowym albo przez internet.'],
                ['info', 'Podatek liczy się od wartości rynkowej auta.'], ['info', 'Auto za najwyżej 1000 zł — bez podatku.']]) +
              przyciski([link('#/sprawa/kupno-auta/krok-2', 'wstecz', 'Wróć do historii pojazdu'), dokumentyBtn()]),
            po: function () {
              var pole = document.getElementById('k-pcc'), wynik = document.getElementById('wynik-pcc');
              if (pole && wynik) pole.addEventListener('input', function () { wynik.textContent = tekstPcc(pole.value); });
            } };
        }
      },
      akcje: {
        'zdjecie-dowodu': function (o, s) {
          return { pola: ZDJECIE_DOWODU, cel: 'k-skan', html: '<p class="komunikat-ok statyczny" tabindex="-1">' + ik('ok') + '<span>Odczytaliśmy dane ze zdjęcia (w prototypie przykładowe). Sprawdź je.</span></p>',
            ogloszenie: 'Odczytaliśmy dane z dowodu rejestracyjnego. Sprawdź je.', fokus: '#k-skan .komunikat-ok', ukryjBledy: true };
        },
        skanuj: function (o, s) {
          s.sprzedajacy = SPRZEDAJACY.imie;
          return { cel: 'k-sprzedajacy-wynik', html: wynikSkanu([['Sprzedający', SPRZEDAJACY.imie], ['Adres', SPRZEDAJACY.adres]]),
            ogloszenie: 'Zeskanowano kod. Sprzedający: ' + SPRZEDAJACY.imie + '.', ukryjBlad: 'k-sprzedajacy', fokus: '#k-sprzedajacy-wynik .komunikat-ok' };
        }
      },
      zakoncz: function (o, w, s) {
        var numer = P.numer('UK'), os = P.daneOsoby(o), podatek = pcc(s.cena);
        w.kupno = { numer: s.numer, vin: s.vin, cena: s.cena, data: D.dzis, umowa: numer };
        return {
          zdanie: 'Umowa kupna-sprzedaży jest gotowa.',
          fakty: [['ok', 'Umowę podpisano w aplikacji (w prototypie od razu).'],
            ['paragon', podatek ? 'Zapłać podatek PCC: ' + zl(podatek) + ' w ciągu 14 dni.' : 'Przy tej cenie nie płacisz podatku PCC.'],
            ['auto', 'Zarejestruj auto w ciągu 30 dni od zakupu.']],
          coDalej: [{ tekst: 'Ile zapłacę podatku PCC?', ikona: 'paragon', href: '#/sprawa/kupno-auta/pcc' }, { tekst: 'Zarejestruj pojazd', ikona: 'auto', niedostepne: 'Zarejestruj pojazd' }],
          wiadomosc: { tytul: 'Umowa kupna-sprzedaży samochodu', rodzaj: 'Umowa',
            metryczka: [['Numer umowy', numer], ['Data i miejsce zawarcia', D.dzis + ', ' + miasto(o)]],
            tresc: ['Umowa kupna-sprzedaży samochodu zawarta między stronami wymienionymi niżej.'],
            sekcje: [{ tytul: 'Strony umowy', tabela: [['Sprzedający', SPRZEDAJACY.imie + ', ' + SPRZEDAJACY.adres], ['Kupujący', os.imie + ', ' + o.adres]] },
              { tytul: 'Przedmiot umowy', tabela: [['Samochód', AUTO.marka], ['Rok produkcji', AUTO.rok], ['Numer rejestracyjny', s.numer], ['VIN', s.vin], ['Przebieg', km(s.przebieg)]] },
              { tytul: 'Cena', akapity: ['Kupujący płaci sprzedającemu ' + zl(s.cena) + '.'] },
              { tytul: 'Oświadczenia stron', akapity: ['Sprzedający oświadcza, że samochód jest jego własnością i nie ma wad prawnych.', 'Kupujący oświadcza, że zna stan techniczny samochodu.'] }] }
        };
      }
    };

    /* =====================================================================
       URODZENIE DZIECKA (Tomasz): imię → dane z karty urodzenia → sprawdź → Gotowe;
       potem 800 plus i Karta Dużej Rodziny.
       ===================================================================== */
    function imiona(s) { return s.imie + (s.imie2 ? ' ' + s.imie2 : ''); }
    function poprawImie(t) { return t.toLowerCase().replace(/(^|-)(\S)/g, function (c, a, b) { return a + b.toUpperCase(); }); }
    /* PESEL dziecka z daty urodzenia (miesiąc + 20 dla lat 2000–2099); cyfra kontrolna celowo błędna — numer nie należy do nikogo */
    function peselDziecka(data, dziewczynka) {
      var m = data.split('.'), cyfry = m[2].slice(2) + ('0' + (+m[1] + 20)).slice(-2) + m[0] + '048' + (dziewczynka ? '2' : '3');
      var wagi = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3], suma = 0;
      for (var i = 0; i < 10; i++) suma += +cyfry.charAt(i) * wagi[i];
      return cyfry + String(((10 - suma % 10) % 10 + 1) % 10);
    }
    function sprawdzImie(t, pole, blad, wymagane) {
      if (!t) { if (wymagane) blad(pole, 'Wpisz imię dziecka, np. Zofia.'); return !wymagane; }
      if (/\s/.test(t)) { blad(pole, 'Wpisz jedno imię. Drugie imię wpisz w osobnym polu.'); return false; }
      if (t.length > 30) { blad(pole, 'To imię jest za długie. Wpisz najwyżej 30 liter.'); return false; }
      if (!tylkoLitery(t) || t.length < 2) { blad(pole, 'Wpisz imię literami, np. Zofia.'); return false; }
      return true;
    }
    K.urodzenie = {
      nazwa: 'Zgłoś urodzenie dziecka',
      brak: function (o) {
        var w = P.wyniki(o);
        if (!o.rodzina || !o.rodzina.kartaUrodzenia) return brak('W aplikacji nie ma karty urodzenia dziecka.', 'Urodzenie zgłosisz, gdy szpital przekaże kartę urodzenia.', [link('#/uslugi/rodzina', 'rodzina', 'Usługi: Rodzina', true)]);
        if (w.dziecko) return brak('Urodzenie dziecka jest już zgłoszone.', w.dziecko.imie + ' ' + w.dziecko.nazwisko + ', PESEL ' + w.dziecko.pesel + '.',
          [link('#/sprawa/800plus', 'rodzina', 'Złóż wniosek o 800 plus', true)]);
        return null;
      },
      kroki: [
        { h1: 'Imię dziecka',
          widok: function (o, s) {
            var ku = o.rodzina.kartaUrodzenia;
            return info('Szpital przekazał kartę urodzenia z ' + ku.data + '. Urodzenie zgłoś w ciągu 21 dni.') +
              P.poleTekstowe('u-imie', 'imie', 'Imię dziecka', s.imie, { podpowiedz: 'Na przykład: Zofia' }) +
              P.poleTekstowe('u-imie2', 'imie2', 'Drugie imię (jeśli chcesz)', s.imie2) +
              '<p class="dopisek">Dziecko może mieć najwyżej dwa imiona.</p>';
          },
          dalej: function (o, s, zaznaczone, tekst, blad) {
            var a = tekst('imie'), b = tekst('imie2');
            var ok1 = sprawdzImie(a, 'u-imie', blad, true), ok2 = sprawdzImie(b, 'u-imie2', blad, false);
            if (ok1 && ok2 && b && a.toLowerCase() === b.toLowerCase()) { blad('u-imie2', 'Drugie imię jest takie samo jak pierwsze.'); return; }
            if (!ok1 || !ok2) return;
            s.imie = poprawImie(a); s.imie2 = b ? poprawImie(b) : '';
          },
          gotowy: function (s) { return !!s.imie; } },
        { h1: 'Dane dziecka i rodziców',
          widok: function (o, s) {
            var ku = o.rodzina.kartaUrodzenia, r = o.rodzina.partner, os = P.daneOsoby(o);
            return '<h2>Z karty urodzenia</h2>' + P.daneHtml([['Data i godzina urodzenia', ku.data + ', ' + ku.godzina], ['Miejsce urodzenia', ku.szpital], ['Płeć', ku.plec], ['Nazwisko', ku.nazwisko]]) +
              '<h2>Rodzice</h2>' + P.daneHtml([['Matka', r.imie + ' ' + r.nazwisko], ['Ojciec', os.imie]]) +
              info('Drugi rodzic dostanie powiadomienie w swoim mObywatelu.') +
              P.grupaPol('adres', 'Adres zameldowania dziecka', radia('adres', [['moj', 'Pod Twoim adresem', o.adres], ['pozniej', 'Zamelduję dziecko później']], s.adres || 'moj'));
          },
          dalej: function (o, s, zaznaczone, tekst, blad) {
            var v = zaznaczone('adres')[0];
            if (!v) return blad('adres', 'Wybierz adres zameldowania dziecka.');
            s.adres = v;
          },
          gotowy: function (s) { return !!s.adres; } },
        { h1: 'Sprawdź, zanim wyślemy', potwierdzenie: true, wroc: '#/sprawa/urodzenie/krok-2',
          widok: function (o, s) {
            var ku = o.rodzina.kartaUrodzenia, r = o.rodzina.partner;
            return P.podsumowanie('Co zrobimy', ['Zgłosimy urodzenie dziecka do urzędu stanu cywilnego.', 'Urząd nada dziecku numer PESEL.']
              .concat(s.adres === 'moj' ? ['Zameldujemy dziecko pod Twoim adresem.'] : [])) +
              '<h2>Dane dziecka</h2>' + P.daneHtml([['Imiona', imiona(s), '#/sprawa/urodzenie'], ['Nazwisko', ku.nazwisko], ['Data urodzenia', ku.data],
                ['Miejsce urodzenia', ku.miejsce + ' (' + ku.szpital + ')'], ['Rodzice', P.daneOsoby(o).imie + ', ' + r.imie + ' ' + r.nazwisko],
                ['Adres zameldowania', s.adres === 'moj' ? o.adres : 'później', '#/sprawa/urodzenie/krok-2']]);
          } }
      ],
      zakoncz: function (o, w, s) {
        var ku = o.rodzina.kartaUrodzenia, r = o.rodzina.partner, os = P.daneOsoby(o), numer = P.numer('UR');
        var pesel = peselDziecka(ku.data, ku.plec === 'dziewczynka'), nrAktu = 'A/' + ku.data.slice(-4) + '/' + numer.slice(-4);
        w.dziecko = { imie: s.imie, imie2: s.imie2, nazwisko: ku.nazwisko, pesel: pesel, data: ku.data, zameldowane: s.adres === 'moj', akt: nrAktu };
        return {
          zdanie: 'Urodzenie dziecka jest zgłoszone: ' + imiona(s) + ' ' + ku.nazwisko + '.',
          fakty: [['ok', 'Dziecko dostało numer PESEL: ' + pesel + '.'], ['list', 'Odpis aktu urodzenia jest w Skrzynce.'], ['serce', 'Gratulacje z okazji narodzin!']],
          coDalej: [{ tekst: 'Złóż wniosek o 800 plus', ikona: 'rodzina', href: '#/sprawa/800plus' }, { tekst: 'Karta Dużej Rodziny dla dziecka', ikona: 'rodzina', href: '#/sprawa/karta-rodziny' }],
          wiadomosc: { tytul: 'Potwierdzenie: zgłoszenie urodzenia dziecka', rodzaj: 'Potwierdzenie',
            metryczka: [['Numer zgłoszenia', numer], ['Adresat', o.usc], ['Data', D.dzis]],
            tresc: ['Zgłoszenie urodzenia zostało przyjęte.', 'Dziecko: ' + imiona(s) + ' ' + ku.nazwisko + ', urodzone ' + ku.data + '.']
              .concat(s.adres === 'moj' ? ['Adres zameldowania dziecka: ' + o.adres + '.'] : []) },
          inne: [{ nadawca: o.usc, tytul: 'Odpis zupełny aktu urodzenia: ' + imiona(s) + ' ' + ku.nazwisko, rodzaj: 'Odpis',
            metryczka: [['Numer aktu', nrAktu], ['Urząd', o.usc], ['Data sporządzenia', D.dzis]],
            tresc: ['Kierownik urzędu stanu cywilnego sporządził akt urodzenia dziecka.', 'Dziecku nadano numer PESEL.'],
            sekcje: [{ tytul: 'Dane z aktu', tabela: [['Imię (imiona) i nazwisko', imiona(s) + ' ' + ku.nazwisko], ['Data urodzenia', ku.data + ', ' + ku.godzina],
              ['Miejsce urodzenia', ku.miejsce], ['Płeć', ku.plec === 'dziewczynka' ? 'żeńska' : 'męska'], ['PESEL', pesel], ['Ojciec', os.imie], ['Matka', r.imie + ' ' + r.nazwisko]] }] }]
        };
      }
    };

    function dzieckoNowe(o) { return P.wyniki(o).dziecko; }
    K['800plus'] = {
      nazwa: 'Rodzina 800 plus',
      brak: function (o) {
        var w = P.wyniki(o);
        if (!o.rodzina) return brak('W aplikacji nie masz dziecka, na które złożysz wniosek.', 'Świadczenie przysługuje na dziecko do 18 lat.', [link('#/uslugi/rodzina', 'rodzina', 'Usługi: Rodzina', true)]);
        if (!w.dziecko) return brak('Najpierw zgłoś urodzenie dziecka.', 'Potem złożysz wniosek o 800 plus.', [link('#/sprawa/urodzenie', 'rodzina', 'Zgłoś urodzenie dziecka', true)]);
        if (w.swiadczenie800) return brak('Wniosek o 800 plus jest już wysłany.', 'Odpowiedź z ZUS dostaniesz w Skrzynce.', [link('#/skrzynka', 'list', 'Otwórz Skrzynkę', true)]);
        return null;
      },
      kroki: [
        { h1: 'Dziecko',
          widok: function (o, s) {
            var d = dzieckoNowe(o), starsze = o.rodzina.dzieci.filter(function (x) { return x.swiadczenie; });
            if (!s.dzieci) s.dzieci = ['nowe'];
            return (starsze.length ? info('Na ' + starsze.map(function (x) { return x.biernik || x.imie; }).join(' i ') + ' już dostajesz świadczenie.') : '') +
              P.grupaPol('dzieci', 'Na które dziecko składasz wniosek?', P.opcjaPola('checkbox', 'dzieci', 'nowe', d.imie + ' ' + d.nazwisko, s.dzieci.indexOf('nowe') >= 0, 'Urodzone ' + d.data + ', PESEL ' + d.pesel));
          },
          dalej: function (o, s, zaznaczone, tekst, blad) {
            var v = zaznaczone('dzieci');
            if (!v.length) return blad('dzieci', 'Zaznacz dziecko, na które składasz wniosek.');
            s.dzieci = v;
          },
          gotowy: function (s) { return !!(s.dzieci && s.dzieci.length); } },
        { h1: 'Wypłata i oświadczenie',
          widok: function (o, s) {
            return P.daneHtml([['Wypłata na konto', o.konto + ' (to samo co dla starszych dzieci)']]) +
              P.grupaPol('oswiadczenie', 'Oświadczenie', P.opcjaPola('checkbox', 'oswiadczenie', 'tak', 'Oświadczam, że dane we wniosku są prawdziwe.', !!s.oswiadczenie)) +
              info('Wniosek złożony w ciągu 3 miesięcy od urodzenia daje świadczenie od miesiąca urodzenia.', 'kalendarz');
          },
          dalej: function (o, s, zaznaczone, tekst, blad) {
            if (!zaznaczone('oswiadczenie').length) return blad('oswiadczenie', 'Zaznacz oświadczenie, żeby wysłać wniosek.');
            s.oswiadczenie = true;
          },
          gotowy: function (s) { return !!s.oswiadczenie; } },
        { h1: 'Sprawdź, zanim wyślemy', potwierdzenie: true, wroc: '#/sprawa/800plus/krok-2',
          widok: function (o, s) {
            var d = dzieckoNowe(o), os = P.daneOsoby(o);
            return P.podsumowanie('Co zrobimy', ['Wyślemy wniosek o świadczenie Rodzina 800 plus do ZUS.']) +
              '<h2>Wniosek</h2>' + P.daneHtml([['Wnioskodawca', os.imie], ['PESEL', os.pesel], ['Dziecko', d.imie + ' ' + d.nazwisko + ', PESEL ' + d.pesel, '#/sprawa/800plus'],
                ['Konto do wypłaty', o.konto], ['Adresat', 'Zakład Ubezpieczeń Społecznych (ZUS)']]);
          } }
      ],
      zakoncz: function (o, w, s) {
        var d = dzieckoNowe(o), numer = P.numer('RP');
        w.swiadczenie800 = { data: D.dzis, numer: numer };
        return {
          zdanie: 'Wniosek o 800 plus trafił do ZUS.',
          fakty: [['info', 'ZUS sprawdzi wniosek. Informację dostaniesz w Skrzynce.'], ['kalendarz', 'Świadczenie będzie od miesiąca urodzenia dziecka.']],
          coDalej: [{ tekst: 'Karta Dużej Rodziny dla dziecka', ikona: 'rodzina', href: '#/sprawa/karta-rodziny' }],
          wiadomosc: { tytul: 'Wniosek o świadczenie Rodzina 800 plus wysłany', rodzaj: 'Potwierdzenie',
            metryczka: [['Numer wniosku', numer], ['Adresat', 'Zakład Ubezpieczeń Społecznych'], ['Data', D.dzis]],
            tresc: ['Wysłaliśmy wniosek o świadczenie wychowawcze Rodzina 800 plus.', 'Dziecko: ' + d.imie + ' ' + d.nazwisko + '.', 'ZUS sprawdzi wniosek. Informację o przyznaniu dostaniesz w Skrzynce.'] }
        };
      }
    };

    K['karta-rodziny'] = {
      nazwa: 'Karta Dużej Rodziny',
      brak: function (o) {
        var w = P.wyniki(o);
        if (P.znajdz(o.dokumenty, 'kdr')) return brak('Masz już Kartę Dużej Rodziny.', 'Znajdziesz ją w Dokumentach.', [link('#/dokument/kdr', 'oko', 'Pokaż Kartę Dużej Rodziny', true)]);
        if (!o.rodzina) return brak('Kartę Dużej Rodziny dostaje rodzina z co najmniej trojgiem dzieci.', 'W aplikacji nie ma Twoich dzieci.', [link('#/uslugi/rodzina', 'rodzina', 'Usługi: Rodzina', true)]);
        if (!w.dziecko) return brak('Najpierw zgłoś urodzenie dziecka.', 'Wtedy w rejestrze będzie troje Twoich dzieci.', [link('#/sprawa/urodzenie', 'rodzina', 'Zgłoś urodzenie dziecka', true)]);
        if (w.kartaRodziny) return brak('Wniosek o Kartę Dużej Rodziny jest już wysłany.', 'Gmina sprawdzi wniosek. Odpowiedź dostaniesz w Skrzynce.', [link('#/skrzynka', 'list', 'Otwórz Skrzynkę', true)]);
        return null;
      },
      kroki: [
        { h1: 'Kto dostanie kartę?',
          widok: function (o, s) {
            var lista = czlonkowie(o);
            if (!s.osoby) s.osoby = lista.map(function (x) { return x[0]; });
            return info('Masz troje dzieci, więc Twoja rodzina może dostać kartę.') +
              P.grupaPol('osoby', 'Zaznacz, kto dostanie kartę', lista.map(function (x) { return P.opcjaPola('checkbox', 'osoby', x[0], x[1], s.osoby.indexOf(x[0]) >= 0, x[2]); }).join(''));
          },
          dalej: function (o, s, zaznaczone, tekst, blad) {
            var v = zaznaczone('osoby');
            if (!v.length) return blad('osoby', 'Zaznacz co najmniej jedną osobę.');
            s.osoby = v;
          },
          gotowy: function (s) { return !!(s.osoby && s.osoby.length); } },
        { h1: 'Rodzaj karty',
          widok: function (o, s) {
            return P.grupaPol('rodzaj', 'Jaką kartę chcesz?', radia('rodzaj', [['elektroniczna', 'Elektroniczna w mObywatelu', 'Pokażesz ją w telefonie.'],
              ['obie', 'Plastikowa i elektroniczna', 'Plastikową odbierzesz w urzędzie gminy.']], s.rodzaj));
          },
          dalej: function (o, s, zaznaczone, tekst, blad) {
            var v = zaznaczone('rodzaj')[0];
            if (!v) return blad('rodzaj', 'Wybierz rodzaj karty.');
            s.rodzaj = v;
          },
          gotowy: function (s) { return !!s.rodzaj; } },
        { h1: 'Sprawdź, zanim wyślemy', potwierdzenie: true, wroc: '#/sprawa/karta-rodziny/krok-2',
          widok: function (o, s) {
            return P.podsumowanie('Co zrobimy', ['Wyślemy wniosek o Kartę Dużej Rodziny do gminy.', 'Gmina sprawdzi dane w rejestrach.']) +
              '<h2>Wniosek</h2>' + P.daneHtml([['Wnioskodawca', P.daneOsoby(o).imie], ['Karta dla', nazwyCzlonkow(o, s.osoby), '#/sprawa/karta-rodziny'],
                ['Rodzaj karty', s.rodzaj === 'obie' ? 'Plastikowa i elektroniczna' : 'Elektroniczna w mObywatelu', '#/sprawa/karta-rodziny/krok-2'],
                ['Adresat', 'Gmina: ' + miasto(o)]]);
          } }
      ],
      zakoncz: function (o, w, s) {
        var numer = P.numer('KDR');
        w.kartaRodziny = { data: D.dzis, numer: numer, osoby: s.osoby, rodzaj: s.rodzaj };
        return {
          zdanie: 'Wniosek o Kartę Dużej Rodziny trafił do gminy.',
          fakty: [['info', 'Gmina sprawdzi wniosek. Odpowiedź dostaniesz w Skrzynce.'], ['dowod', 'Elektroniczna karta pojawi się w Dokumentach.']], coDalej: [],
          wiadomosc: { tytul: 'Wniosek o Kartę Dużej Rodziny wysłany', rodzaj: 'Potwierdzenie',
            metryczka: [['Numer wniosku', numer], ['Adresat', 'Gmina: ' + miasto(o)], ['Data', D.dzis]],
            tresc: ['Wysłaliśmy wniosek o Kartę Dużej Rodziny.', 'Karta dla: ' + nazwyCzlonkow(o, s.osoby) + '.', 'Rodzaj karty: ' + (s.rodzaj === 'obie' ? 'plastikowa i elektroniczna' : 'elektroniczna') + '.'] }
        };
      }
    };
    function czlonkowie(o) {
      var r = o.rodzina, d = P.wyniki(o).dziecko, os = P.daneOsoby(o);
      return [['ja', 'Ty: ' + os.imie, 'Rodzic'], ['partner', r.partner.imie + ' ' + r.partner.nazwisko, 'Rodzic']]
        .concat(r.dzieci.map(function (x, i) { return ['dziecko' + i, x.imie + ' ' + x.nazwisko, 'Dziecko, urodzone ' + x.urodzony]; }))
        .concat(d ? [['nowe', d.imie + ' ' + d.nazwisko, 'Dziecko, urodzone ' + d.data]] : []);
    }
    function nazwyCzlonkow(o, wybrane) {
      return czlonkowie(o).filter(function (x) { return wybrane.indexOf(x[0]) >= 0; }).map(function (x) { return x[1].replace('Ty: ', ''); }).join(', ');
    }

    /* =====================================================================
       ZGŁOSZENIE OSZUSTWA DO CERT POLSKA (po fałszywym SMS-ie, mailu, stronie, telefonie).
       ===================================================================== */
    var RODZAJE_OSZUSTWA = [['sms', 'SMS'], ['email', 'E-mail'], ['telefon', 'Telefon'], ['strona', 'Strona internetowa']];
    K.cert = {
      nazwa: 'Zgłoś oszustwo do CERT Polska',
      parametry: function (s, p) {
        if (p.get('rodzaj') && nazwaOpcji(RODZAJE_OSZUSTWA, p.get('rodzaj'))) s.rodzaj = p.get('rodzaj');
        if (p.get('tresc')) s.tresc = p.get('tresc').slice(0, 1000);
        if (p.get('dane') === 'tak' || p.get('dane') === 'nie') s.dane = p.get('dane');
      },
      kroki: [
        { h1: 'Co się stało?',
          widok: function (o, s) {
            return P.grupaPol('rodzaj', 'Skąd przyszło oszustwo?', radia('rodzaj', RODZAJE_OSZUSTWA, s.rodzaj)) +
              P.poleOpisu('c-tresc', 'tresc', 'Treść wiadomości, adres strony albo numer telefonu', s.tresc, { podpowiedz: 'Wklej albo przepisz. Najwyżej 1000 znaków.' });
          },
          dalej: function (o, s, zaznaczone, tekst, blad) {
            var v = zaznaczone('rodzaj')[0], t = tekst('tresc'), zle = 0;
            if (!v) { blad('rodzaj', 'Wybierz, skąd przyszło oszustwo.'); zle++; }
            if (!t) { blad('c-tresc', 'Wklej treść wiadomości, adres strony albo numer telefonu.'); zle++; }
            else if (t.length > 1000) { blad('c-tresc', 'Treść jest za długa. Wklej najwyżej 1000 znaków.'); zle++; }
            if (zle) return;
            s.rodzaj = v; s.tresc = t;
          },
          gotowy: function (s) { return !!(s.rodzaj && s.tresc); } },
        { h1: 'Twoje dane',
          widok: function (o, s) {
            return P.grupaPol('dane', 'Czy podano oszustowi dane karty, kod BLIK albo hasło?', radia('dane', [['tak', 'Tak', 'Pokażemy, jak zablokować kartę.'], ['nie', 'Nie']], s.dane));
          },
          dalej: function (o, s, zaznaczone, tekst, blad) {
            var v = zaznaczone('dane')[0];
            if (!v) return blad('dane', 'Wybierz odpowiedź.');
            s.dane = v;
          },
          gotowy: function (s) { return !!s.dane; } },
        { h1: 'Sprawdź zgłoszenie', potwierdzenie: true, wroc: '#/sprawa/cert/krok-2',
          widok: function (o, s) {
            return (s.dane === 'tak' ? alarm('Najpierw zastrzeż kartę: zadzwoń pod 828 828 828 albo do swojego banku. Zmień hasło do banku.') +
              przyciski([alarmLink('tel:828828828', 'Zadzwoń i zastrzeż kartę: 828 828 828')]) : '') +
              P.podsumowanie('Co zrobimy', ['Wyślemy zgłoszenie do CERT Polska.', 'CERT Polska ostrzega innych przed fałszywymi stronami.']) +
              '<h2>Zgłoszenie</h2>' + P.daneHtml([['Skąd', nazwaOpcji(RODZAJE_OSZUSTWA, s.rodzaj), '#/sprawa/cert'], ['Treść', s.tresc, '#/sprawa/cert'],
                ['Podano dane', s.dane === 'tak' ? 'Tak' : 'Nie', '#/sprawa/cert/krok-2'], ['Kontakt do Ciebie', o.telefon]]);
          } }
      ],
      zakoncz: function (o, w, s) {
        var numer = P.numer('CERT');
        w.cert = (w.cert || 0) + 1;
        var coDalej = [];
        if (s.rodzaj === 'sms') coDalej.push({ tekst: 'Przekaż SMS na numer 8080', ikona: 'wyslij', href: 'sms:8080' });
        if (s.dane === 'tak') coDalej.push({ tekst: 'Zastrzeż kartę: 828 828 828', ikona: 'telefon', href: 'tel:828828828' });
        return {
          zdanie: 'Zgłoszenie trafiło do CERT Polska.',
          fakty: [s.rodzaj === 'sms' ? ['wyslij', 'Przekaż też tego SMS-a na numer 8080 — to bezpłatne.'] : ['info', 'Usuń wiadomość i nie klikaj w linki.']]
            .concat(s.dane === 'tak' ? [['telefon', 'Zastrzeż kartę: 828 828 828. Zmień hasło do banku.']] : []),
          coDalej: coDalej,
          wiadomosc: { tytul: 'Zgłoszenie do CERT Polska', rodzaj: 'Potwierdzenie',
            metryczka: [['Numer zgłoszenia', numer], ['Adresat', 'CERT Polska'], ['Data', D.dzis]],
            tresc: ['Przyjęliśmy zgłoszenie podejrzanej wiadomości.', 'Skąd: ' + nazwaOpcji(RODZAJE_OSZUSTWA, s.rodzaj) + '.', 'Treść: „' + s.tresc + '”']
              .concat(s.rodzaj === 'sms' ? ['Przekaż też tego SMS-a na numer 8080.'] : []) }
        };
      }
    };

    /* =====================================================================
       ODPIS AKTU STANU CYWILNEGO: rodzaj aktu → czyj → rodzaj odpisu → cel i odbiór → sprawdź → Gotowe.
       ===================================================================== */
    var AKTY = [['urodzenia', 'Akt urodzenia'], ['malzenstwa', 'Akt małżeństwa'], ['zgonu', 'Akt zgonu']];
    var ODPISY = [['skrocony', 'Odpis skrócony', 'Najważniejsze dane. Wystarczy w większości spraw.'], ['zupelny', 'Odpis zupełny', 'Wszystkie dane z aktu, także późniejsze zmiany.'],
      ['wielojezyczny', 'Odpis wielojęzyczny', 'Do użytku za granicą.']];
    var CELE = [['urzad', 'Do sprawy w urzędzie'], ['slub', 'Do ślubu'], ['sad', 'Do sprawy w sądzie'], ['granica', 'Do sprawy za granicą'], ['inny', 'Inny cel']];
    function aktyOsoby(o) {
      var d = P.wyniki(o).dziecko, lista = (o.akty || []).slice();
      if (d) {
        lista.push({ id: 'ur-nowe', rodzaj: 'urodzenia', czyj: 'Akt urodzenia ' + (o.rodzina.kartaUrodzenia.plec === 'dziewczynka' ? 'córki' : 'syna') + ': ' + d.imie + ' ' + d.nazwisko, numer: d.akt, usc: o.usc,
          dane: [['Imię i nazwisko', d.imie + (d.imie2 ? ' ' + d.imie2 : '') + ' ' + d.nazwisko], ['Data urodzenia', d.data], ['Miejsce urodzenia', o.rodzina.kartaUrodzenia.miejsce],
            ['Imię ojca', o.imie], ['Imię matki', o.rodzina.partner.imie]] });
      }
      return lista;
    }
    function aktOsoby(o, id) { return aktyOsoby(o).filter(function (a) { return a.id === id; })[0] || null; }
    K.odpis = {
      nazwa: 'Odpis aktu stanu cywilnego',
      parametry: function (s, p) {
        var a = p.get('akt');
        if (a === 'slubu') a = 'malzenstwa';
        if (nazwaOpcji(AKTY, a)) { if (s.rodzaj !== a) s.aktId = null; s.rodzaj = a; }
        if (p.get('czyj')) s.aktId = p.get('czyj');
      },
      kroki: [
        { h1: 'Rodzaj aktu',
          widok: function (o, s) { return P.grupaPol('akt', 'Jakiego aktu potrzebujesz?', radia('akt', AKTY, s.rodzaj)); },
          dalej: function (o, s, zaznaczone, tekst, blad) {
            var v = zaznaczone('akt')[0];
            if (!v) return blad('akt', 'Wybierz rodzaj aktu.');
            if (v !== s.rodzaj) s.aktId = null;
            s.rodzaj = v;
          },
          gotowy: function (s) { return !!s.rodzaj; } },
        { h1: 'Czyj akt?',
          widok: function (o, s) {
            var lista = aktyOsoby(o).filter(function (a) { return a.rodzaj === s.rodzaj; });
            if (!lista.length) {
              return { bezFormularza: true, html: '<div class="pusty-stan"><p><b>W rejestrze nie ma takiego aktu dla Ciebie ani Twojej rodziny.</b></p>' +
                '<p>Odpis aktu innej osoby dostaniesz w urzędzie, gdy masz w tym interes prawny.</p>' +
                przyciski([link('#/sprawa/odpis', 'wstecz', 'Wybierz inny akt', true), dokumentyBtn()]) + '</div>' };
            }
            if (!s.aktId && lista.length === 1) s.aktId = lista[0].id;
            return P.grupaPol('czyj', 'Wybierz akt', radia('czyj', lista.map(function (a) { return [a.id, a.czyj, a.usc]; }), s.aktId));
          },
          dalej: function (o, s, zaznaczone, tekst, blad) {
            var v = zaznaczone('czyj')[0];
            if (!v) return blad('czyj', 'Wybierz akt.');
            s.aktId = v;
          },
          gotowy: function (s, o) { var a = s.aktId && aktOsoby(o, s.aktId); return !!(a && a.rodzaj === s.rodzaj); } },
        { h1: 'Rodzaj odpisu',
          widok: function (o, s) { return P.grupaPol('odpis', 'Jaki odpis?', radia('odpis', ODPISY, s.odpis)); },
          dalej: function (o, s, zaznaczone, tekst, blad) {
            var v = zaznaczone('odpis')[0];
            if (!v) return blad('odpis', 'Wybierz rodzaj odpisu.');
            s.odpis = v;
          },
          gotowy: function (s) { return !!s.odpis; } },
        { h1: 'Cel i odbiór',
          widok: function (o, s) {
            return P.grupaPol('cel', 'Do czego potrzebujesz odpisu?', radia('cel', CELE, s.cel)) +
              P.poleTekstowe('o-cel', 'celInny', 'Inny cel', s.cel === 'inny' ? s.celInny : '', { zaznacz: 'cel:inny', podpowiedz: 'Tylko przy „Inny cel”, np. do banku' }) +
              '<h2>Odbiór</h2>' + info('Odpis dostaniesz elektronicznie do Skrzynki w mObywatelu.', 'list');
          },
          dalej: function (o, s, zaznaczone, tekst, blad) {
            var v = zaznaczone('cel')[0], t = tekst('celInny').replace(/\s+/g, ' ');
            if (!v) return blad('cel', 'Wybierz cel.');
            if (v === 'inny') {
              if (!t) return blad('o-cel', 'Wpisz cel, np. do banku.');
              if (t.length > 100) return blad('o-cel', 'Wpisz najwyżej 100 znaków, np. do banku.');
              if (!P.LITERA.test(t)) return blad('o-cel', 'Wpisz cel słowami, np. do banku.');
            }
            s.cel = v; s.celInny = v === 'inny' ? t : '';
          },
          gotowy: function (s) { return !!s.cel; } },
        { h1: 'Sprawdź, zanim wyślemy', potwierdzenie: true, wroc: '#/sprawa/odpis/krok-4',
          widok: function (o, s) {
            var a = aktOsoby(o, s.aktId);
            return P.podsumowanie('Co zrobimy', ['Wyślemy wniosek o odpis do urzędu: ' + a.usc + '.', 'Odpis dostaniesz do Skrzynki.']) +
              '<h2>Wniosek</h2>' + P.daneHtml([['Wnioskodawca', P.daneOsoby(o).imie], ['Akt', nazwaOpcji(AKTY, s.rodzaj) + ': ' + a.czyj, '#/sprawa/odpis/krok-2'],
                ['Rodzaj odpisu', nazwaOpcji(ODPISY, s.odpis), '#/sprawa/odpis/krok-3'], ['Cel', s.cel === 'inny' ? s.celInny : nazwaOpcji(CELE, s.cel), '#/sprawa/odpis/krok-4'],
                ['Odbiór', 'Elektronicznie, do Skrzynki w mObywatelu'], ['Opłata', 'W prototypie bez opłaty']]);
          } }
      ],
      zakoncz: function (o, w, s) {
        var a = aktOsoby(o, s.aktId), numer = P.numer('OD'), nazwa = nazwaOpcji(ODPISY, s.odpis) + ' ' + nazwaOpcji(AKTY, s.rodzaj).replace('Akt', 'aktu');
        w.odpisy = (w.odpisy || []).concat([{ akt: a.id, odpis: s.odpis, data: D.dzis, numer: numer }]);
        return {
          zdanie: 'Wysłaliśmy wniosek o odpis aktu.',
          fakty: [['list', 'Odpis jest już w Skrzynce (w prototypie od razu).']], coDalej: [],
          wiadomosc: { tytul: 'Wniosek o odpis aktu wysłany', rodzaj: 'Potwierdzenie',
            metryczka: [['Numer wniosku', numer], ['Adresat', a.usc], ['Data', D.dzis]],
            tresc: ['Wysłaliśmy wniosek: ' + nazwa.charAt(0).toLowerCase() + nazwa.slice(1) + '.', 'Akt: ' + a.czyj + '.'] },
          inne: [{ nadawca: a.usc, tytul: nazwa + ': ' + a.dane[0][1], rodzaj: 'Odpis',
            metryczka: [['Numer aktu', a.numer], ['Urząd', a.usc], ['Data wydania odpisu', D.dzis]],
            tresc: [nazwa + '.', 'Dokument elektroniczny wydany przez kierownika urzędu stanu cywilnego.'],
            sekcje: [{ tytul: 'Dane z aktu', tabela: a.dane }] }]
        };
      }
    };

    /* =====================================================================
       EKRAN „DOWÓD SIĘ ZNALAZŁ” (część sprawy A): unieważnienia nie da się cofnąć,
       zastrzeżenie PESEL — tak.
       ===================================================================== */
    var EKRANY = {
      'zgubione/znaleziony': function (o) {
        var w = P.wyniki(o), html;
        if (w.dowodUniewazniony) {
          html = alarm('Unieważnionego dowodu nie da się przywrócić, nawet gdy się znalazł.') +
            '<p class="podtytul">Nie używaj go już. Złóż wniosek o nowy dowód.</p>' +
            przyciski([link('#/sprawa/wniosek-dowod', 'dowod', 'Złóż wniosek o nowy dowód', true), w.pesel ? link('#/sprawa/cofnij-pesel', 'powtorz', 'Cofnij zastrzeżenie PESEL') : '', dokumentyBtn()]);
        } else if (w.pesel) {
          html = '<p class="podtytul">Twój dowód nie był unieważniony, więc nadal jest ważny.</p><p class="podtytul">Twój PESEL jest zastrzeżony. Możesz to cofnąć.</p>' +
            przyciski([link('#/sprawa/cofnij-pesel', 'powtorz', 'Cofnij zastrzeżenie PESEL', true), dokumentyBtn()]);
        } else {
          html = '<p class="podtytul">Twój dowód jest ważny. Nie musisz nic robić.</p>' + przyciski([link('#/dokument/dowod', 'oko', 'Pokaż mDowód', true), dokumentyBtn()]);
        }
        return { h1: 'Dowód się znalazł', rodzic: '#/dokumenty', html: html };
      }
    };

    return { kreatory: K, ekrany: EKRANY };
  };
})();

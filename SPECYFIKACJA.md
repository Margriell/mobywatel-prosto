# Specyfikacja prototypu „mObywatel Prosto”

Wersja 1.0 · 24.11.2026

Budujemy klikalny prototyp aplikacji mObywatel na konkurs mObywatel Challenge i do pracy magisterskiej. Prototyp rozwija pomysł prototypu Janusza Cieszyńskiego (mobywatel.ai): zostawia nowoczesnego asystenta, ale opiera go na widocznej, przewidywalnej strukturze. Ma być czytelny dla seniorów, osób słabo obeznanych z technologią i osób z niepełnosprawnościami.

Ten plik jest jedynym źródłem prawdy. Nie zmieniaj go bez zgody autorki.

## Zasady pracy (dla AI)

1. Na początku każdej rozmowy przeczytaj ten plik i `POSTEP.md`.
2. Rób tylko etap, o który prosi autorka. Nie buduj niczego na zapas.
3. Zasady projektowe są obowiązkowe. Jeśli coś się z nimi kłóci, zapytaj, zamiast decydować samodzielnie.
4. Na koniec każdego etapu: sprawdź pracę według zasad projektowych, zaktualizuj `POSTEP.md` i napisz po polsku, prostym językiem: co zrobione, jak to sprawdzić w przeglądarce, co wymaga decyzji autorki.
5. Autorka nie jest programistką. Wyjaśniaj bez żargonu.

## Etapy budowy

1. Trzy warianty ekranu Start (do wyboru kierunku wyglądu).
2. Szkielet całej aplikacji i nawigacja.
3. Sprawa A — zgubione dokumenty.
4. Sprawa B — samochód: OC i badanie techniczne.
5. Sprawa C — zameldowanie.
6. Asystent.
7. Kontrola jakości.
8. Publikacja (GitHub Pages).

Po etapie 3 aplikacja musi nadawać się do zgłoszenia, nawet jeśli dalsze etapy nie powstaną.

## Cel i zasady

Cel: nowoczesność prototypu Cieszyńskiego, ale tak, żeby nikt się nie gubił — także osoba starsza, słabowidząca czy pierwszy raz w aplikacji.

Pięć zasad, z których wynika każda decyzja:

1. **Widać, co da się załatwić.** Podpisany dolny pasek i lista spraw. Asystent to skrót, nie jedyna droga.
2. **Jedna rzecz na raz.** Sprawy prowadzone krok po kroku, z licznikiem „Krok 2 z 4” i przyciskiem „Wstecz”.
3. **Czytelność od pierwszego ekranu.** Duży tekst, wysoki kontrast, duże przyciski, wybór rozmiaru tekstu na starcie.
4. **Żadnych ślepych zaułków.** Każdy przycisk i każda podpowiedź działa albo jasno mówi, że w prototypie jest niedostępna, i pokazuje, co można zrobić zamiast tego.
5. **Kontrola w rękach człowieka.** Nic nie jest wysyłane bez podsumowania i potwierdzenia.

Mierzalne cele (te same pomiary zrobiono na prototypie Cieszyńskiego):

| Miara | Prototyp Cieszyńskiego | Nasz cel |
| --- | --- | --- |
| Tekst poniżej 16 px na ekranie startowym | 69% | 0% |
| Najmniejszy tekst | ok. 10 px | 16 px |
| Elementy klikalne mniejsze niż 44 px (start) | 8 z 14 | 0 (minimum 48 px) |
| Powiększenie 200% | układ się rozsypuje | wszystko czytelne, nic się nie nakłada |
| Najsłabszy kontrast tekstu | 2,9:1 | co najmniej 4,5:1 |
| Podpowiedzi prowadzące w ślepy zaułek | 6 z 20 | 0 |

## Mapa aplikacji

- **Ekrany wejściowe** (tylko przy pierwszym uruchomieniu): 1. Wybór osoby → 2. Dopasuj wygląd → 3. Poznaj asystenta → Start.
- **Dolny pasek, zawsze widoczny:** Start · Dokumenty · Sprawy · Asystent · Skrzynka.
- **Do każdej sprawy prowadzą cztery drogi:** kafel na Start, szczegóły dokumentu, lista Spraw, asystent.
- **Każda sprawa kończy się tak samo:** Potwierdzenie (podsumowanie i zgoda) → Gotowe (potwierdzenie trafia do Skrzynki).
- Ustawienia otwiera się ze Start. Sprawy spoza prototypu pokazują okno „Niedostępne w prototypie”.

## Zasady projektowe

| Element | Wymaganie |
| --- | --- |
| Tekst | Podstawowy 18 px, nagłówki 22–28 px, nic poniżej 16 px. Interlinia 1,5. Trzy tryby: Standardowy (18 px), Duży (22 px), Bardzo duży (26 px), skalowane jedną zmienną |
| Czcionka | Atkinson Hyperlegible (Google Fonts, projektowana dla osób słabowidzących) albo systemowa |
| Kontrast | Tekst co najmniej 4,5:1, tekst podstawowy najlepiej 7:1; ikony i obramowania pól co najmniej 3:1. Tryb wysokiego kontrastu w ustawieniach |
| Kolory | Granat dla akcji i przycisków. Czerwień wyłącznie dla spraw pilnych i błędów. Zieleń dla sukcesu. Kolor nigdy nie jest jedynym sygnałem: zawsze z ikoną i słowem |
| Przyciski | Każdy element klikalny co najmniej 48 × 48 px, odstęp co najmniej 8 px. Główny przycisk na całą szerokość, wysokość 56 px |
| Ikony | Zawsze z podpisem tekstowym, także w nagłówku i na pasku |
| Język | Prosty, zdania do 15 słów, zwracanie się na „Ty”, bez urzędowego żargonu. Formy neutralne płciowo („Co zginęło?” zamiast „Zgubiłam”) |
| Układ | Jedna kolumna, treść w naturalnym przepływie (bez nakładania się elementów), jednostki rem. Działa przy szerokości 320 px i powiększeniu 200% |
| Nawigacja | Dolny pasek zawsze widoczny (poza krokami sprawy). Na każdym podekranie przycisk „Wstecz” z napisem. W sprawach licznik „Krok 2 z 4” |
| Czas i ruch | Brak limitów czasu i komunikatów, które same znikają. Animacje subtelne, wyłączone przy ustawieniu „ogranicz ruch” |
| Czytniki ekranu | `lang="pl"`, prawdziwe nagłówki, etykiety pól, wiadomości asystenta ogłaszane (`aria-live`), zaznaczenie opcji ogłaszane (pola wyboru), widoczny fokus |
| Oznaczenia | Neutralny znak zamiast godła i logo mObywatela. Stały pasek „Prototyp — to nie jest usługa rządowa”. Dane fikcyjne, awatary z inicjałów zamiast zdjęć |

## Ekrany po kolei

Aplikacja ma 3 ekrany wejściowe, 5 zakładek na dolnym pasku i 4 ekrany wspólne.

**Wejście (pokazywane raz)**

1. **Wybór osoby** (tylko w prototypie, dla jury). Trzy fikcyjne osoby z awatarem z inicjałów i jednym zdaniem o sytuacji:
   - Halina, 71 lat, emerytka, pierwszy raz w aplikacji — domyślnie Duży tekst;
   - Tomasz, 38 lat, kierowca — kończy mu się OC;
   - Ola, 24 lata, studentka — właśnie się przeprowadziła.
2. **Dopasuj wygląd.** Pytanie „Jak wygodnie Ci czytać?”. Trzy duże opcje rozmiaru tekstu z podglądem na żywo, przełącznik „Tryb prosty” (mniej elementów na Start, większe kafle), przycisk „Dalej”. Dopisek: „Możesz to zmienić później w Ustawieniach”.
3. **Poznaj asystenta.** Jeden ekran: „Możesz napisać albo powiedzieć, co chcesz załatwić. Poprowadzę Cię krok po kroku. Nic nie wyślę bez Twojego potwierdzenia.” Przyciski „Zaczynam” i „Pomiń”.

**Zakładki na dolnym pasku** (ikona + podpis, zakładka aktywna oznaczona kolorem, pogrubieniem i kreską)

4. **Start**
   - Nagłówek: „Dzień dobry, Halino” i przycisk „Ustawienia” (ikona z podpisem).
   - „Wymaga Twojej uwagi”: najwyżej 2 karty, jedyne miejsce z czerwienią, np. „OC samochodu kończy się za 12 dni” → sprawa B.
   - „Najczęstsze sprawy”: 6 dużych kafli w 2 kolumnach — Zgubione dokumenty, Mój samochód, Meldunek, Pokaż mDowód, Skrzynka, Wszystkie sprawy. W trybie prostym 4 kafle w 1 kolumnie.
   - Pole asystenta: „Napisz lub powiedz, co chcesz załatwić”, przycisk mikrofonu z podpisem, 3 przykładowe podpowiedzi, które działają.
5. **Dokumenty**
   - Lista kart dokumentów jedna pod drugą, bez nakładania. Na karcie nazwa i status („Ważny do 12.03.2031” z ikoną).
   - Szczegóły dokumentu: dane jako lista „etykieta — wartość”, przyciski „Pokaż kod QR” (niedostępne w prototypie) i „Zgłoś utratę tego dokumentu” → sprawa A z zaznaczonym dokumentem.
6. **Sprawy**
   - Wyszukiwarka u góry: „Szukaj sprawy, np. meldunek”. Wyszukuje też bez polskich znaków i po synonimach.
   - Kategorie według sytuacji życiowych: Dokumenty i tożsamość, Samochód, Mieszkanie, Rodzina, Zdrowie, Podatki — każda z 2–3 sprawami.
   - Sprawy działające w prototypie mają etykietę „Dostępne w prototypie”. Pozostałe otwierają okno „Niedostępne w prototypie”.
7. **Asystent**
   - Góra: „Asystent · odpowiada sztuczna inteligencja · nic nie wyśle bez Twojego potwierdzenia”.
   - Pusty stan: „W czym mogę pomóc?”, 4 podpowiedzi i link „Zobacz wszystkie sprawy”.
   - Rozmowa: duży tekst, przy każdej odpowiedzi przycisk „Przeczytaj na głos”. Zachowanie — sekcja Asystent.
8. **Skrzynka.** Lista wiadomości, nowe oznaczone słowem „Nowa” i pogrubieniem (nie tylko kolorem). Po zakończeniu sprawy pojawia się potwierdzenie.

**Ekrany wspólne**

9. **Potwierdzenie.** „Sprawdź, zanim wyślemy”: lista „Co zrobimy” i „Twoje dane”. Przyciski „Potwierdzam i wysyłam” oraz „Wróć i popraw”. Potem symulowane potwierdzenie tożsamości: „Potwierdź odciskiem palca lub PIN-em” z przyciskiem „Potwierdź (w prototypie wystarczy kliknąć)”.
10. **Gotowe.** Duża ikona sukcesu, jedno zdanie, co się stało, sekcja „Co dalej”, informacja „Potwierdzenie jest w Skrzynce”, przycisk „Wróć na Start”.
11. **Niedostępne w prototypie** (okno). „Tej sprawy nie ma jeszcze w prototypie. Działają:” + 3 przyciski do działających spraw + „Zamknij”.
12. **Ustawienia.** Rozmiar tekstu, wysoki kontrast, tryb prosty, czytanie na głos, „Pokaż wprowadzenie ponownie”, „Zmień osobę (prototyp)”.

## Scenariusze

Trzy sprawy, każda innego typu: działanie w kilku krokach, szukanie informacji i formularz. Te same zadania będą wykonywane w oryginalnym mObywatelu podczas badania eyetrackerem. Każda sprawa jest dostępna z kafla na Start, z zakładki Sprawy i przez asystenta.

**A. Zgubione dokumenty** (działanie w kilku krokach)

1. **Co zginęło?** Pola wyboru: Dowód osobisty, Prawo jazdy, Karty płatnicze, Inne dokumenty. Krok 1 z 4.
2. **Co zrobimy.** Lista działań z przełącznikiem przy każdym i jednym zdaniem wyjaśnienia:
   - unieważnimy dowód osobisty, żeby nikt się nim nie posłużył;
   - zastrzeżemy numer PESEL, żeby nikt nie wziął kredytu na Twoje dane;
   - zgłosimy utratę prawa jazdy;
   - karty płatnicze: tego nie zrobimy za Ciebie — przycisk „Zadzwoń i zastrzeż karty: 828 828 828”.
3. **Potwierdzenie** (ekran wspólny).
4. **Gotowe.** „Twój dowód jest unieważniony, a PESEL zastrzeżony.” Co dalej: jak złożyć wniosek o nowy dowód, jak cofnąć zastrzeżenie PESEL.

**B. Mój samochód: OC i badanie techniczne** (szukanie informacji)

1. **Mój samochód.** Karta pojazdu: marka, numer rejestracyjny. Statusy z ikoną i słowem: „OC ważne do 1.12.2026 — zostało 12 dni” (ostrzeżenie), „Badanie techniczne ważne do 14.05.2027” (w porządku).
2. **Przypomnienie.** Przycisk „Przypomnij mi 7 dni przed terminem” → wybór: powiadomienie w aplikacji lub SMS.
3. **Gotowe.** „Przypomnienie ustawione”, wiadomość w Skrzynce.

Zadanie w badaniu: „Sprawdź, do kiedy ważne jest badanie techniczne samochodu”.

**C. Zameldowanie na pobyt stały** (formularz)

1. **Nowy adres.** Pola: miejscowość, ulica, numer domu, numer mieszkania, kod pocztowy. Krok 1 z 5.
2. **Od kiedy tu mieszkasz?** Wybór daty; domyślnie dzisiaj.
3. **Na jakiej podstawie?** „Jestem właścicielem” albo „Wynajmuję lub mieszkam u kogoś”. Przy drugiej opcji wyjaśnienie: właściciel potwierdzi zameldowanie w swojej aplikacji.
4. **Potwierdzenie** (ekran wspólny).
5. **Gotowe.** Co dalej: kiedy zameldowanie będzie widoczne, gdzie znaleźć zaświadczenie.

Błędy w formularzu: komunikat przy polu, którego dotyczy, z ikoną i podpowiedzią, jak poprawić (np. „Kod pocztowy ma 5 cyfr, np. 21-100”). Nigdy tylko czerwona ramka.

## Asystent

Asystent jest obecny tak jak u Cieszyńskiego (pole na ekranie Start), a dodatkowo ma własną zakładkę. Rozpoznaje sprawę, zadaje najwyżej 1–2 pytania i przekazuje użytkownika do tych samych widocznych kroków co formularz. Rozmowa to skrót, a nie osobny, ukryty świat.

**Wersja konkursowa: rozmowy ze scenariusza.** Bez serwera i kluczy, więc link działa dla jury bez logowania i bez kosztów. Kod ma jedną funkcję `rozpoznajSprawe(tekst)`. Później zostanie podmieniona na wywołanie modelu Bielik, a reszta aplikacji zostanie bez zmian.

**Rozpoznawanie**

- Tekst zamieniany na małe litery i bez polskich znaków, więc „zgubilem dowod” działa tak samo jak „Zgubiłem dowód”.
- Dla każdej sprawy szeroka lista słów i zwrotów, np.:
  - A: zgubić, zgubiony, ukradli, kradzież, portfel, torebka, dowód, zastrzec, PESEL, karta;
  - B: OC, ubezpieczenie, przegląd, badanie techniczne, samochód, auto, rejestracja;
  - C: meldunek, zameldować, przeprowadzka, nowe mieszkanie, adres.
- Dodatkowo: „pokaż dowód”, „skrzynka”, „pomoc”, „co umiesz”.

**Gdy asystent nie rozumie** — nigdy „tego nie załatwię”:

> „Nie rozumiem jeszcze tej prośby. W prototypie mogę pomóc w tych sprawach:” + przyciski A, B, C + „Zobacz wszystkie sprawy”.

**Styl odpowiedzi**

- Najwyżej 2 krótkie zdania na wiadomość. Jedno pytanie naraz.
- Każda wiadomość kończy się przyciskami następnego kroku, żeby nie trzeba było pisać.
- Wybór kilku opcji jako lista pól wyboru, nie dymki do klikania.
- Gdy sprawa jest rozpoznana: karta sprawy z przyciskiem „Zacznij” → kroki sprawy z już wypełnionymi odpowiedziami. Obok link „Wolę przejść krok po kroku”.
- Odpowiedzi informacyjne z dopiskiem „Na podstawie: …”.
- Wpisywanie głosem przez przeglądarkę (Web Speech API), gdy jest dostępne; w przeciwnym razie przycisk mikrofonu wyjaśnia, że trzeba pisać.
- Wskaźnik „Asystent pisze…” najwyżej 1 sekundę; nic nie dzieje się samo bez kliknięcia.

## Technika

Zwykłe HTML, CSS i JavaScript, bez frameworków i bez budowania. Otwiera się `index.html` w przeglądarce i działa; ten sam folder idzie na GitHub Pages.

- **Pliki:** `index.html`, `style.css`, `app.js` (ekrany i nawigacja), `dane.js` (osoby, dokumenty, sprawy, wiadomości), `asystent.js`, `SPECYFIKACJA.md`, `POSTEP.md`.
- **Każdy ekran ma własny adres** (np. `#/start`, `#/sprawy`, `#/sprawa/zameldowanie/krok-2`). Dzięki temu w badaniu każde zadanie zaczyna się z tego samego miejsca, a jury może dostać link do konkretnego ekranu.
- **Parametry adresu:** `?osoba=halina`, `?tekst=duzy`, `?reset=1` (czysty stan dla kolejnego uczestnika badania).
- **Ustawienia** zapamiętywane w przeglądarce (localStorage w try/catch); aplikacja działa też, gdy przeglądarka tego zabrania.
- **Telefon przede wszystkim:** projekt dla 360–390 px szerokości. Na komputerze aplikacja wyświetla się w ramce telefonu na środku ekranu, żeby jury widziało ją tak jak na telefonie.
- **Ikony:** otwarta biblioteka Lucide (licencja MIT), wklejone jako SVG.
- **Hosting:** GitHub Pages — darmowy, link działa bez logowania.
- **Później (do pracy magisterskiej, nie teraz):** tryb badania `?badanie=1` — ukrywa etykiety „Dostępne w prototypie” i zapisuje czas oraz kliknięcia do pobrania jako CSV; asystent na Bieliku.

## Decyzje

- Nazwa: mObywatel Prosto.
- Asystent: pole na ekranie Start (jak u Cieszyńskiego) + osobna zakładka.
- Sprawy A, B, C: autorka sprawdza, czy istnieją w oficjalnym mObywatelu. Nie zmieniaj ich bez polecenia.

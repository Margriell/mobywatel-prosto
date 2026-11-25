# Specyfikacja prototypu „mObywatel dla każdego”

Wersja 2.0 · 25.11.2026 · zastępuje wszystkie wcześniejsze wersje

Klikalny prototyp aplikacji mObywatel na konkurs mObywatel Challenge (termin zgłoszenia: 26.11 wieczorem). Konkurs ma pierwszeństwo: prototyp ma być lepszy od prototypu referencyjnego Janusza Cieszyńskiego (mobywatel.ai), mieć na to dowody i wyróżniać się.

Ten plik jest jedynym źródłem prawdy. Nie zmieniaj go bez zgody autorki.

## Zasady pracy (dla AI)

1. Na początku każdej rozmowy przeczytaj ten plik i `POSTEP.md`.
2. Rób tylko etap, o który prosi autorka. Nie buduj na zapas.
3. Zasady projektowe są obowiązkowe. Jeśli coś się z nimi kłóci, zapytaj.
4. Na koniec etapu: sprawdź pracę (patrz „Kontrola”), zaktualizuj `POSTEP.md` i napisz po polsku, prostym językiem: co zrobione, jak to sprawdzić, co wymaga decyzji.
5. Autorka nie jest programistką. Wyjaśniaj bez żargonu. Relacje w trakcie pracy krótkie.

## Idea

**„mObywatel dla każdego. Widzisz wszystkie możliwości — asystent pomaga, kiedy chcesz.”**

| | Oficjalny mObywatel | Prototyp Cieszyńskiego | Nasz prototyp |
| --- | --- | --- | --- |
| Co widać na starcie | Dokumenty | Dokumenty (nachodzące karty) | Dokumenty, czytelne, nic się nie nakłada |
| Jak załatwić sprawę | Ręcznie, przez Usługi | Tylko rozmowa z AI | Ręcznie przez Usługi **albo** z asystentem — obie drogi prowadzą do tych samych kroków |
| Czy widać, co można zrobić | Tak | Nie — trzeba wiedzieć, o co zapytać; aplikacja wydaje się pusta | Tak — pełna lista usług z opisami + podpowiedzi asystenta |
| Asystent | Tylko odpowiada na pytania | Załatwia sprawy w czacie | Załatwia sprawy i prowadzi widocznymi krokami |
| Dla kogo | Typowy użytkownik | Osoba obyta z czatem | Młodzi i starsi: dopasowanie wyglądu od pierwszego ekranu |

Zostaje od Cieszyńskiego: nowoczesny wygląd, asystent załatwiający sprawy, sprawy życiowe („Zgubiłam portfel”), przypomnienia na starcie, potwierdzenie przed każdą akcją, ludzki język.
Zostaje z oficjalnej aplikacji: dokumenty na starcie, dolny pasek (Dokumenty, Usługi, Kod QR, Więcej), możliwość przeklikania wszystkiego ręcznie.

## Trzy wyróżniki (jury ma je zobaczyć w 30 sekund)

1. **„Dopasuj do siebie” na pierwszym ekranie** — rozmiar tekstu, motyw (jasny, ciemny, wysoki kontrast), tryb prosty, czytanie na głos; podgląd na żywo. Te same ustawienia zawsze dostępne w „Więcej”.
2. **Widzisz wszystkie możliwości** — zakładka Usługi z pełną listą spraw pogrupowanych według sytuacji życiowych, z krótkim opisem pod każdą i wyszukiwarką. Nic nie jest ukryte za czatem.
3. **Asystent, który prowadzi, a nie tylko gada** — rozpoznaje sprawę i przekazuje do widocznych kroków z licznikiem i potwierdzeniem. Nigdy ślepy zaułek: gdy nie rozumie, pokazuje, w czym może pomóc.

## Zakres i etapy (w tej kolejności)

1. ~~Warianty ekranu startowego~~ — zakończony; kierunek wyglądu: `warianty/start-b1.html` (granatowa góra, kremowe tło, miękkie karty), logika podpowiedzi i opisów spraw z `start-b2.html`.
2. **Szkielet całej aplikacji:** wybór osoby, „Dopasuj do siebie”, motywy, ekran Dokumenty, Usługi, Asystent (pusty stan), Kod QR, Więcej/Ustawienia, Skrzynka, okno „Niedostępne w prototypie”.
3. **Sprawa A — zgubione dokumenty** w pełni, dostępna trzema drogami (Usługi, asystent, szczegóły dowodu), razem z asystentem dla tej sprawy.
4. **Sprawa B — samochód: OC i badanie techniczne.**
5. **Kontrola jakości i publikacja** (GitHub Pages).
6. Opcjonalnie, jeśli zostanie czas: sprawa C — zameldowanie.

Po etapie 3 aplikacja musi nadawać się do zgłoszenia.

## Zasady projektowania uniwersalnego (podstawa decyzji)

| Zasada | Jak ją realizujemy |
| --- | --- |
| 1. Równe szanse | Jedna aplikacja dla wszystkich, bez osobnej „wersji dla seniora” — dopasowanie to ustawienie, nie inna aplikacja |
| 2. Elastyczność | Rozmiar tekstu, trzy motywy, tryb prosty; sprawę można załatwić klikając, pisząc albo mówiąc |
| 3. Prostota i intuicyjność | Znany układ mObywatela, jedna rzecz na ekranie w krokach sprawy, prosty język |
| 4. Dostrzegalna informacja | Kolor nigdy nie jest jedynym sygnałem (zawsze ikona + słowo) — działa także dla osób z zaburzeniami widzenia barw; czytanie na głos |
| 5. Tolerancja błędów | Podsumowanie i potwierdzenie przed wysłaniem, „Wstecz” i „Wróć i popraw” na każdym kroku |
| 6. Niski wysiłek | Mało pisania — odpowiedzi do kliknięcia; gotowe podpowiedzi dla asystenta |
| 7. Rozmiar i przestrzeń | Cele dotykowe min. 48 px, odstępy min. 8 px |

## Zasady projektowe

| Element | Wymaganie |
| --- | --- |
| Tekst | Podstawowy 18 px, nagłówki 22–28 px, nic poniżej 16 px. Interlinia 1,5. Rozmiary: Standardowy (18), Duży (22), Bardzo duży (26), skalowane jedną zmienną. Podpisy dolnego paska stałe 16 px, pasek zawsze w jednym rzędzie |
| Czcionka | Atkinson Hyperlegible (Google Fonts) albo systemowa |
| Motywy | Jasny (jak B1: granat, kremowe tło), Ciemny, Wysoki kontrast. Wszystkie kolory jako zmienne CSS. W każdym motywie tekst min. 4,5:1, ikony i obramowania min. 3:1 |
| Kolory | Granat — akcje. Czerwień — wyłącznie sprawy z terminem lub ryzykiem i błędy. Zieleń — sukces. Zawsze z ikoną i słowem |
| Przyciski | Min. 48 × 48 px, odstęp min. 8 px. Główny przycisk na całą szerokość, 56 px |
| Ikony | Zawsze z podpisem |
| Język | Zdania do 15 słów, na „Ty”, bez żargonu, formy neutralne płciowo |
| Układ | Jedna kolumna, naturalny przepływ, nic się nie nakłada, jednostki rem. Działa przy 320 px i powiększeniu 200% |
| Nawigacja | Dolny pasek widoczny poza krokami sprawy. Na podekranach „Wstecz” z napisem. W sprawach „Krok 2 z 4” |
| Czas i ruch | Brak limitów czasu i znikających komunikatów. Animacje subtelne, wyłączone przy „ogranicz ruch” |
| Czytniki ekranu | `lang="pl"`, nagłówki, etykiety pól, `aria-live` dla asystenta, pola wyboru ogłaszające zaznaczenie, widoczny fokus |
| Oznaczenia | Nazwa „mObywatel”. Ikona: czerwony kwadrat z zaokrąglonymi rogami i prostym białym znakiem własnego projektu — bez godła i oficjalnego logo. Informacja „Prototyp konkursowy, dane fikcyjne” tylko na ekranie wyboru osoby i w „Więcej”. Awatary z inicjałów |

## Osoby (pokazują, że aplikacja jest dla młodych i starszych)

| Osoba | Ustawienia startowe | Karta „Wymaga Twojej uwagi” |
| --- | --- | --- |
| Halina, 71 lat, emerytka, pierwszy raz w aplikacji | Duży tekst, tryb prosty, jasny motyw | Nowe pismo z Urzędu Miasta o podatku od nieruchomości (kolor akcentu, etykieta „Nowe”, bez czerwieni) → Skrzynka |
| Tomasz, 38 lat, kierowca | Standardowy tekst, jasny motyw | OC kończy się za 12 dni (czerwień; data = dziś + 12 dni) → sprawa B |
| Ola, 24 lata, studentka | Standardowy tekst, ciemny motyw | Brak pilnych spraw („Wszystko w porządku”) |

## Mapa aplikacji

- **Wejście** (pierwsze uruchomienie): Wybór osoby → Dopasuj do siebie → Poznaj asystenta (jeden ekran, można pominąć) → Dokumenty.
- **Nagłówek:** ikona + „mObywatel”, po prawej przycisk „Aa Wygląd” (otwiera panel „Wygląd i dostępność”, ten sam co w Więcej) i Skrzynka (ikona z podpisem i licznikiem).
- **Dolny pasek:** Dokumenty (ekran startowy) · Usługi · Asystent · Kod QR · Więcej.
- **Do każdej sprawy prowadzą trzy drogi:** Usługi, asystent (pole na ekranie Dokumenty i zakładka), szczegóły dokumentu.
- **Każda sprawa kończy się tak samo:** Potwierdzenie → Gotowe → wiadomość w Skrzynce.
- Sprawy spoza prototypu otwierają okno „Niedostępne w prototypie”, które pokazuje działające sprawy.

## Ekrany

**1. Wybór osoby.** Trzy karty osób (awatar z inicjałów, imię, wiek, jedno zdanie). Pod spodem „Prototyp konkursowy, dane fikcyjne”. Wybór ustawia ustawienia startowe osoby.

**2. Dopasuj do siebie.** „Jak Ci wygodnie?” Podgląd na żywo (fragment ekranu Dokumenty) zmienia się od razu.
- Rozmiar tekstu: Standardowy / Duży / Bardzo duży.
- Motyw: Jasny / Ciemny / Wysoki kontrast.
- Tryb prosty: wł./wył. (mniej elementów, większe przyciski, sprawy w jednej kolumnie).
- Czytanie na głos: wł./wył. (przycisk „Przeczytaj” przy treściach; Web Speech API, gdy dostępne).
- „Dalej”. Dopisek: „Zmienisz to w każdej chwili w Więcej → Wygląd i dostępność”.

**3. Poznaj asystenta.** „Możesz kliknąć, napisać albo powiedzieć, co chcesz załatwić. Asystent poprowadzi Cię krok po kroku i nic nie wyśle bez Twojej zgody.” „Zaczynam” / „Pomiń”.

**4. Dokumenty (ekran startowy).** Od góry:
1. Powitanie „Dzień dobry, Halino” w granatowej górnej części.
2. mDowód jako duża karta (inicjały zamiast zdjęcia, imię, „Pokaż dane”). Pod nią mPrawo jazdy, Moje pojazdy, Karta Dużej Rodziny jako pełne wiersze z nazwą i statusem („Ważny do…” z ikoną). Nic się nie nakłada.
3. „Wymaga Twojej uwagi” — karta zależna od osoby.
4. Asystent: pole „Co chcesz załatwić?”, szerokie przyciski „Powiedz” i „Wyślij” z napisem, 3 przykładowe pytania tuż pod polem, jako jeden blok.
Przy tekście Standardowym na 390 × 844 bez przewijania widać mDowód, kartę sprawy i pole asystenta. Jeśli się nie mieści — zapytaj autorkę, zanim coś ukryjesz.

**5. Szczegóły dokumentu.** Dane jako lista „etykieta — wartość”. Przyciski: „Pokaż kod QR” (niedostępne w prototypie), „Zgłoś utratę tego dokumentu” → sprawa A z zaznaczonym dokumentem.

**6. Usługi.** Wyszukiwarka u góry („Szukaj usługi, np. PESEL”; działa bez polskich znaków i po synonimach). Potem „Najczęstsze” (3–4 usługi), potem wszystkie usługi według sytuacji życiowych: Dokumenty i tożsamość, Samochód, Mieszkanie, Rodzina, Zdrowie, Podatki, Bezpieczeństwo — w każdej 3–5 usług z jednozdaniowym opisem, np. „Zastrzeż PESEL — nikt nie weźmie kredytu na Twoje dane”. Usługi działające w prototypie mają etykietę „Działa w prototypie”. W trybie prostym: tylko kategorie jako duże przyciski, usługi po wejściu w kategorię.

**7. Asystent.** Góra: „Asystent · nic nie wyśle bez Twojej zgody”. Pusty stan: „W czym mogę pomóc?”, 4 podpowiedzi, link „Zobacz wszystkie usługi”. Zachowanie — sekcja Asystent.

**8. Kod QR.** Dwa duże przyciski: „Pokaż swój kod” i „Zeskanuj kod” — oba otwierają okno „Niedostępne w prototypie”.

**9. Więcej.** Wygląd i dostępność (te same ustawienia co ekran 2), Zmień osobę, Pokaż wprowadzenie ponownie, O prototypie („Prototyp konkursowy, dane fikcyjne” + 3 wyróżniki w trzech zdaniach).

**10. Skrzynka.** Lista wiadomości; nowe oznaczone słowem „Nowa” i pogrubieniem. Po zakończeniu sprawy pojawia się potwierdzenie.

**11. Potwierdzenie** (wspólne). „Sprawdź, zanim wyślemy”: „Co zrobimy” i „Twoje dane”. „Potwierdzam i wysyłam” / „Wróć i popraw”. Potem „Potwierdź odciskiem palca lub PIN-em” z przyciskiem „Potwierdź (w prototypie wystarczy kliknąć)”.

**12. Gotowe** (wspólne). Ikona sukcesu, jedno zdanie, „Co dalej”, „Potwierdzenie jest w Skrzynce”, „Wróć do Dokumentów”.

**13. Niedostępne w prototypie** (okno). „Tej usługi nie ma jeszcze w prototypie. Działają:” + przyciski do działających spraw + „Zamknij”.

## Sprawy

**A. Zgubione dokumenty**
1. **Co zginęło?** Pola wyboru: Dowód osobisty, Prawo jazdy, Karty płatnicze, Inne dokumenty. Krok 1 z 4.
2. **Co zrobimy.** Lista działań z przełącznikiem i jednym zdaniem wyjaśnienia: unieważnimy dowód; zastrzeżemy PESEL (nikt nie weźmie kredytu na Twoje dane); zgłosimy utratę prawa jazdy; karty płatnicze — tego nie zrobimy za Ciebie: przycisk „Zadzwoń i zastrzeż karty: 828 828 828”.
3. **Potwierdzenie.**
4. **Gotowe.** „Twój dowód jest unieważniony, a PESEL zastrzeżony.” Co dalej: wniosek o nowy dowód, jak cofnąć zastrzeżenie PESEL.

**B. Mój samochód: OC i badanie techniczne**
1. **Mój samochód.** Marka, numer rejestracyjny. „OC ważne do [dziś + 12 dni] — zostało 12 dni” (ostrzeżenie), „Badanie techniczne ważne do 14.05.2027” (w porządku).
2. **Przypomnienie.** „Przypomnij mi 7 dni przed terminem” → powiadomienie w aplikacji lub SMS.
3. **Gotowe.** „Przypomnienie ustawione”, wiadomość w Skrzynce.

**C. Zameldowanie** (opcjonalnie): adres → od kiedy → podstawa (właściciel / wynajem) → Potwierdzenie → Gotowe. Błędy przy polu, z podpowiedzią, nigdy tylko czerwona ramka.

## Asystent

Rozpoznaje sprawę, zadaje najwyżej 1–2 pytania i przekazuje do tych samych widocznych kroków co Usługi, z wypełnionymi odpowiedziami. Obok zawsze „Wolę przejść krok po kroku sam(a)”.

- Rozmowy ze scenariusza, bez serwera. Całe rozpoznawanie w jednej funkcji `rozpoznajSprawe(tekst)` w `asystent.js` (później podmieniana na model Bielik).
- Tekst bez polskich znaków i małymi literami; szerokie listy słów: A — zgubić, ukradli, kradzież, portfel, torebka, dowód, zastrzec, PESEL, karta; B — OC, ubezpieczenie, przegląd, badanie, samochód, auto; C — meldunek, zameldować, przeprowadzka, adres. Dodatkowo: „pokaż dowód”, „skrzynka”, „pomoc”, „co umiesz”.
- Gdy nie rozumie: „Nie rozumiem jeszcze tej prośby. Mogę pomóc w tych sprawach:” + przyciski działających spraw + „Zobacz wszystkie usługi”. Nigdy „tego nie załatwię”.
- Najwyżej 2 krótkie zdania na wiadomość, jedno pytanie naraz, każda wiadomość kończy się przyciskami następnego kroku. Wybór wielu opcji jako pola wyboru. Przy odpowiedziach „Przeczytaj na głos”. Wpisywanie głosem przez Web Speech API, gdy dostępne.

## Technika

- Zwykłe HTML, CSS, JavaScript, bez frameworków i budowania. **Wszystko działa po otwarciu `index.html` dwuklikiem (bez serwera) i na GitHub Pages** — bez iframe i bez wczytywania lokalnych plików przez fetch.
- Pliki: `index.html`, `style.css`, `app.js`, `dane.js`, `asystent.js`.
- Każdy ekran ma własny adres (`#/dokumenty`, `#/uslugi`, `#/sprawa/zgubione/krok-2`). Parametry: `?osoba=halina`, `?reset=1`.
- Ustawienia zapamiętywane w localStorage (w try/catch); aplikacja działa także bez niego.
- Na komputerze aplikacja w ramce telefonu na środku ekranu; na telefonie na pełnym ekranie.
- Ikony: Lucide (MIT), wklejone jako SVG.

## Kontrola (po każdym etapie)

Sprawdź w trzech rozmiarach tekstu, trzech motywach i przy 320 px:
- brak tekstu poniżej 16 px; kontrast tekstu min. 4,5:1 w każdym motywie;
- wszystkie elementy klikalne min. 48 px;
- nic się nie nakłada i nie wychodzi poza ekran, także przy powiększeniu 200%;
- każdy przycisk coś robi (nie ma martwych kliknięć);
- działa po otwarciu dwuklikiem.

## Mierzalne cele (porównanie z prototypem Cieszyńskiego)

| Miara | Cieszyński | Cel |
| --- | --- | --- |
| Tekst poniżej 16 px na ekranie startowym | 69% | 0% |
| Najmniejszy tekst | ok. 10 px | 16 px |
| Elementy klikalne poniżej 44 px (start) | 8 z 14 | 0 (min. 48 px) |
| Powiększenie 200% | układ się rozsypuje | wszystko czytelne |
| Najsłabszy kontrast tekstu | 2,9:1 | min. 4,5:1 |
| Podpowiedzi kończące się ślepym zaułkiem | 6 z 20 | 0 |
| Motywy i dopasowanie wyglądu | brak | 3 rozmiary, 3 motywy, tryb prosty |

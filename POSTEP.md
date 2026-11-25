# Postęp prac — mObywatel dla każdego

Ten plik prowadzi AI. Po każdym etapie dopisz wpis do dziennika i zaktualizuj sekcję „Stan”.

## Stan

- Obowiązuje SPECYFIKACJA.md w wersji 2.0 (ekran startowy: Dokumenty).
- Ukończony etap: 1, runda 3 — trzy wyglądy ekranu Dokumenty (czeka na wybór autorki).
- Następny etap: 2 — szkielet całej aplikacji (po wyborze wyglądu 1, 2 albo 3).

## Decyzje autorki

- 24.11.2026: nazwa „mObywatel Prosto”.
- 24.11.2026: asystent jako pole na Start + osobna zakładka.
- 24.11.2026: kierunek wyglądu — wariant B. Warianty A i C przeniesione do `warianty/archiwum/`.
- 24.11.2026: stałe dla wszystkich wariantów (wpisane do SPECYFIKACJA.md, wersja 1.1): nazwa „mObywatel” w nagłówku; bez paska „Prototyp” na ekranach aplikacji; bez przewijania widać powitanie, kartę pilną i pole asystenta; dolny pasek zawsze w 1 rzędzie z podpisami 16 px; kafle w 1 lub 2 kolumnach; karta pilna zależna od osoby; wszystko działa po dwukliku i na GitHub Pages; folder `.claude/` w `.gitignore`.

- 25.11.2026: specyfikacja 2.0 — ekranem startowym są Dokumenty; dolny pasek Dokumenty · Usługi · Asystent · Kod QR · Więcej.
- 25.11.2026: przycisk „Aa Wygląd” w nagłówku (otwiera panel „Wygląd i dostępność”, ten sam co w Więcej) — dopisany do SPECYFIKACJA.md, sekcja „Mapa aplikacji”.
- 25.11.2026: warianty B1–B3 przeniesione do `warianty/archiwum/`.

## Dziennik

### 25.11.2026 Etap 1, runda 3 — trzy wyglądy ekranu Dokumenty
- Zrobione:
  - Jeden wspólny układ ekranu Dokumenty dokładnie według specyfikacji 2.0, w tej kolejności: nagłówek (znak + „mObywatel”, „Aa Wygląd”, Skrzynka z licznikiem), „Dzień dobry, Halino”, duża karta mDowodu, trzy pełne wiersze dokumentów z ważnością, „Wymaga Twojej uwagi” (pismo z Urzędu Miasta, etykieta „Nowe”, bez czerwieni), blok asystenta („Co chcesz załatwić?”, „Powiedz”, „Wyślij”, 3 pytania), dolny pasek.
  - Karta mDowodu wygląda jak dokument, a nie jak przycisk: ma tło z delikatnym wzorem jak na dokumentach, miejsce na zdjęcie z inicjałami „HW”, imię i nazwisko, ważność ze znaczkiem i ozdobny chip. Klikalny jest tylko przycisk „Pokaż dane”.
  - **Wygląd 1 — Ciepły.** Granatowa góra z powitaniem, kremowe tło i miękkie, zaokrąglone kształty, jak w wariancie B1. mDowód wygląda jak pastelowy dokument: brzoskwiniowo-różowe tło z delikatnym wzorem, miejsce na zdjęcie z inicjałami i złoty chip. Przyciski mają kształt pigułek, a gotowe pytania do asystenta są jasnoniebieskie.
  - **Wygląd 2 — Profesjonalny i żywy.** Chłodna biel i góra w przejściu od granatu do fioletu dają nowoczesny, energiczny charakter. mDowód przypomina nowoczesną kartę z połyskiem: intensywny gradient, białe dane, złoty chip i jasne zdjęcie z inicjałami. Kształty są precyzyjne, a tytuły sekcji wyróżnia kolorowa kreska.
  - **Wygląd 3 — Czysty, bliski oficjalnemu.** Dużo bieli, cienkie szare linie, małe zaokrąglenia i czcionka systemowa — spokojnie i czysto, jak w oficjalnej aplikacji. Czerwony akcent pojawia się w znaku, w cienkiej linii u góry ekranu i w pasku na karcie mDowodu. mDowód ma prawie białe tło z subtelnym wzorem, więc wygląda jak prawdziwy dokument.
  - Każdy wygląd ma trzy motywy: jasny, ciemny i wysoki kontrast (czarne tło, biały tekst, żółte przyciski — wspólny dla wszystkich wyglądów).
  - Porównanie: trzy telefony obok siebie, nad nimi przełączniki rozmiaru tekstu i motywu, które działają na wszystkie trzy naraz.
  - Każdy przycisk otwiera okno „To jest podgląd wyglądu” z informacją, dokąd poprowadzi w gotowej aplikacji.
- Pliki: `warianty/dokumenty-1.html`, `dokumenty-2.html`, `dokumenty-3.html`, `dokumenty-wspolne.js` (układ, dane Haliny, motyw wysokiego kontrastu), `wyglad-1.js`, `wyglad-2.js`, `wyglad-3.js` (kolory, kształty i czcionka każdego wyglądu), `porownanie.html` (przebudowane); B1–B3 razem z ich skryptami w `warianty/archiwum/`; `SPECYFIKACJA.md` (przycisk „Aa Wygląd” w „Mapie aplikacji”).
- Jak sprawdzić: dwuklik na `warianty/porownanie.html`. Przełączniki u góry zmieniają rozmiar tekstu i motyw we wszystkich trzech telefonach. Ekran w telefonie przewija się kółkiem myszy. Działają też adresy z parametrami, np. `porownanie.html?motyw=ciemny&tekst=duzy`.
- Kontrola (według sekcji „Kontrola” specyfikacji; pliki otwierane jako `file://`, tak jak po dwukliku, w Edge i Chrome):
  - 3 wyglądy × 3 rozmiary tekstu × 3 motywy × 3 szerokości (390 px, 320 px i 640 × 360 px, czyli okno 1280 × 720 przy powiększeniu 200%) = 81 ekranów, 0 błędów.
  - Najmniejszy tekst: 16 px we wszystkich wyglądach.
  - Najsłabszy kontrast tekstu: wygląd 1 — 6,1:1, wygląd 2 — 5,0:1 (jasny tekst na fioletowej części karty mDowodu), wygląd 3 — 6,9:1.
  - Wszystkie elementy klikalne mają co najmniej 48 × 48 px, a odstępy między nimi co najmniej 8 px.
  - Nic się nie nakłada i nic nie wychodzi poza ekran.
  - Dolny pasek zawsze ma jeden rząd z podpisami 16 px, bez ucinania.
  - Każdy przycisk coś robi (otwiera okno podglądu albo przewija do góry).
  - Przy tekście Standardowym na 390 × 844 bez przewijania widać mDowód, kartę „Wymaga Twojej uwagi” i pole asystenta. Zapas nad dolnym paskiem jest mały: wygląd 1 — 10 px, wygląd 2 — 12 px, wygląd 3 — 5 px. Przyciski „Powiedz” / „Wyślij” i 3 pytania są już niżej, pod paskiem.
  - Poprawione w trakcie:
    - Pole asystenta było o ok. 100 px za nisko. Pomogło zmniejszenie odstępów, krótszy status „1 pojazd, OC ważne” oraz strzałka zamiast osobnej linii „Przeczytaj pismo” na karcie uwagi.
    - Z karty mDowodu wypadła data urodzenia (moje dodatkowe pole, nie ma jej w specyfikacji).
    - Przy 320 px i tekście Bardzo dużym karty i wiersze wychodziły w bok — teraz ich zawartość przechodzi do następnej linii.
- Znane problemy / do decyzji:
  - Halina ma w specyfikacji ustawiony tekst Duży. Przy Dużym pole asystenta jest ok. 340 px niżej i trzeba przewinąć. Reguła „bez przewijania” w specyfikacji dotyczy tylko tekstu Standardowego.
  - Wygląd 3 a specyfikacja: w wyglądzie 3 góra ekranu jest biała, a specyfikacja (ekran 4, punkt 1) mówi o „granatowej górnej części”. Czerwień w wyglądzie 3 jest tylko ozdobą marki (znak, linia u góry, pasek na mDowodzie). Przyciski i zaznaczona zakładka zostały granatowe, bo specyfikacja zostawia czerwień dla spraw z terminem i błędów. Do decyzji: czy zaznaczona zakładka ma być czerwona, jak w oficjalnej aplikacji.
  - Dane na karcie są wymyślone: nazwisko „Wiśniewska”, „Ważny do 12.03.2031”, mPrawo jazdy „Ważne do 04.09.2033”, Karta Dużej Rodziny „Ważna bezterminowo”, „1 pojazd, OC ważne”.
  - Tryb prosty (Halina ma go w ustawieniach startowych) nie był częścią tej rundy.

### 24.11.2026 Etap 1, runda 2 — warianty B1, B2, B3
- Zrobione:
  - **B1 — Granatowa góra.** To dopracowany wariant B: granatowa góra z powitaniem i inicjałem, kremowe tło i miękkie, zaokrąglone karty. Pole asystenta stoi w granatowej części jak wyszukiwarka w aplikacji bankowej, a pod nim jest sprawa pilna. Kafle spraw są w dwóch kolumnach, a gotowe pytania do asystenta mają osobny rząd pod sprawą pilną.
  - **B2 — Rozmowa.** Ekran zaczyna się jak rozmowa: asystent wita Halinę w dymku i od razu pokazuje sprawę pilną. Pod spodem jest pole do pisania z okrągłymi przyciskami „Powiedz” i „Wyślij” oraz gotowe pytania w kształcie odpowiedzi. Białe tło z chłodną lawendą, a sprawy to szerokie „pigułki” w jednej kolumnie, z krótkim opisem.
  - **B3 — Mozaika.** Ciepłe, miodowe tło i pastelowe kafle różnej wielkości, ułożone w mozaikę. Najpierw powitanie z dzisiejszą datą i sprawa pilna jako baner, potem karta asystenta z dużym przyciskiem „Powiedz zamiast pisać”. Mocno zaokrąglone kształty i jeden szeroki, granatowy kafel „Wszystkie sprawy” na końcu.
  - Halina ma nową kartę pilną: nowe pismo w Skrzynce. Nazwa w nagłówku „mObywatel”, bez paska „Prototyp”.
  - Porównanie przebudowane: nie używa już ramek `iframe`. Każdy wariant to zwykły skrypt (`b1.js`, `b2.js`, `b3.js`), który strona porównania i strona wariantu wklejają do telefonu. Dzięki temu działa po dwukliku, bez serwera, i na GitHub Pages.
  - Spisane w SPECYFIKACJA.md (wersja 1.1) wszystkie 8 uzgodnionych stałych, w tym zasada „działa po dwukliku” w sekcji „Technika” i data OC liczona jako dziś + 12 dni.
- Pliki: `warianty/start-b1.html`, `start-b2.html`, `start-b3.html`, `wspolne.js`, `b1.js`, `b2.js`, `b3.js`, `porownanie.html` (przebudowane); `warianty/archiwum/start-a.html`, `start-c.html` (przeniesione); `.gitignore` (nowy); `SPECYFIKACJA.md`. Plik `warianty/start-b.html` (B z rundy 1) został na miejscu.
- Jak sprawdzić: dwuklik na `warianty/porownanie.html`. Przełącznik nad telefonami zmienia rozmiar tekstu we wszystkich trzech naraz; ekran w telefonie przewija się kółkiem myszy.
- Kontrola:
  - Pliki otwarte jako `file://` (tak jak po dwukliku) w Chrome i Edge — ten sam silnik co Opera. Wszystkie trzy telefony są wypełnione. Samej Opery nie sprawdziłem (autorka nie dała dostępu).
  - Na ekranie 390 × 844 px przy tekście Standardowym i Dużym (domyślnym dla Haliny) bez przewijania widać powitanie, całą kartę pilną i pole asystenta; zapas nad dolnym paskiem przy Dużym: B1 110 px, B2 143 px, B3 162 px.
  - W 3 rozmiarach tekstu, przy 390 px i 320 px: najmniejszy tekst 16 px; najsłabszy kontrast 6,6:1 (czerwone napisy); brak elementów klikalnych mniejszych niż 48 × 48 px; odstępy co najmniej 8 px; nic nie wychodzi w bok i nic się nie nakłada; dolny pasek zawsze w 1 rzędzie, podpisy 16 px, nic nie jest ucięte.
  - Poprawione w trakcie: przy 320 px podpisy paska były ucięte (teraz litery są lekko ściśnięte poniżej 360 px szerokości); w B3 pole asystenta było za wąskie przy 320 px; na komputerze pasek przewijania zabierał telefonowi 15 px i mozaika B3 spadała do 1 kolumny (pasek przewijania w ramce telefonu jest teraz ukryty, jak w telefonie).
- Znane problemy / do decyzji:
  - Przy tekście Bardzo dużym na 390 × 844 nie wszystko mieści się bez przewijania: w B1 karta pilna, a w B2 i B3 pole asystenta są niżej. Czy reguła „bez przewijania” ma obowiązywać także przy Bardzo dużym tekście?
  - Na komputerze z widocznym paskiem przewijania i oknem węższym niż ok. 330 px podpisy paska mogą się nie zmieścić; na telefonie 320 px mieszczą się.
  - Karta pilna Haliny ma czerwone obramowanie (jak cała sekcja „Wymaga Twojej uwagi”), choć nowe pismo nie zawsze jest pilne.
  - Treść pisma jest wymyślona: „Urząd Miasta przysłał pismo o podatku od nieruchomości”.

### 24.11.2026 Etap 1 — trzy warianty ekranu Start
- Zrobione: trzy samodzielne warianty ekranu Start dla Haliny (domyślnie Duży tekst) w ramce telefonu 390 px oraz strona porównania. A — spokojny i urzędowy; B — ciepły i przyjazny, „bankowy”; C — maksymalnie prosty, dla osoby 75+. Każdy przycisk otwiera okno „To jest podgląd wyglądu” z informacją, dokąd poprowadzi w gotowej aplikacji (bez ślepych zaułków). Rozmiar tekstu przełączany jedną zmienną; działa też parametr `?tekst=standardowy|duzy|bardzo-duzy`.
- Pliki: `warianty/start-a.html`, `warianty/start-b.html`, `warianty/start-c.html`, `warianty/porownanie.html`, `.claude/launch.json` (mały serwer podglądu dla Claude, nie jest częścią aplikacji).
- Jak sprawdzić: otworzyć `warianty/porownanie.html` w przeglądarce (dwuklik w Eksploratorze plików). Przełącznik nad wariantami zmienia rozmiar tekstu we wszystkich trzech naraz.
- Kontrola automatyczna (każdy wariant, w 3 rozmiarach tekstu, przy szerokości 390 px i 320 px oraz w widoku odpowiadającym powiększeniu 200%): najmniejszy tekst 16 px; najsłabszy kontrast tekstu 5,9:1 (słowo „Pilne” na jasnoczerwonym tle), tekst podstawowy powyżej 7:1; brak elementów klikalnych mniejszych niż 48 × 48 px; odstępy między nimi co najmniej 8 px; nic nie wychodzi poza ekran i nic się nie nakłada. W wariancie C poprawiono wiersze spraw, które przy 320 px i bardzo dużym tekście wychodziły poza ekran.
- Znane problemy / do decyzji:
  - Wariant B ma pole asystenta nad kartą pilną i kaflami (w specyfikacji jest na końcu ekranu).
  - Wariant C pokazuje sprawy jako 6 szerokich wierszy w jednej kolumnie z krótkim opisem (w specyfikacji: 6 kafli w 2 kolumnach).
  - Napisy na dolnym pasku mają stałe minimum 16 px i rosną wolniej niż reszta tekstu, żeby 5 zakładek zmieściło się w jednym rzędzie. Przy Bardzo dużym tekście lub ekranie 320 px pasek łamie się na 2 rzędy (nic się nie nakłada).
  - Karta pilna u Haliny to „OC samochodu kończy się za 12 dni” (przykład ze specyfikacji), choć według opisu osób OC dotyczy Tomasza. Do etapu 4: w specyfikacji data „OC ważne do 1.12.2026” nie zgadza się z „zostało 12 dni” przy dzisiejszej dacie.

<!-- Format wpisu:
### [data] Etap N — nazwa
- Zrobione:
- Pliki:
- Jak sprawdzić:
- Znane problemy / do decyzji:
-->

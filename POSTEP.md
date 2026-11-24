# Postęp prac — mObywatel Prosto

Ten plik prowadzi AI. Po każdym etapie dopisz wpis do dziennika i zaktualizuj sekcję „Stan”.

## Stan

- Ukończony etap: 1, runda 2 — warianty B1, B2, B3 ekranu Start (czeka na wybór autorki).
- Następny etap: 2 — szkielet całej aplikacji i nawigacja (po wyborze B1, B2 albo B3).

## Decyzje autorki

- 24.11.2026: nazwa „mObywatel Prosto”.
- 24.11.2026: asystent jako pole na Start + osobna zakładka.
- 24.11.2026: kierunek wyglądu — wariant B. Warianty A i C przeniesione do `warianty/archiwum/`.
- 24.11.2026: stałe dla wszystkich wariantów (wpisane do SPECYFIKACJA.md, wersja 1.1): nazwa „mObywatel” w nagłówku; bez paska „Prototyp” na ekranach aplikacji; bez przewijania widać powitanie, kartę pilną i pole asystenta; dolny pasek zawsze w 1 rzędzie z podpisami 16 px; kafle w 1 lub 2 kolumnach; karta pilna zależna od osoby; wszystko działa po dwukliku i na GitHub Pages; folder `.claude/` w `.gitignore`.

## Dziennik

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

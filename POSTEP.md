# Postęp prac — mObywatel Prosto

Ten plik prowadzi AI. Po każdym etapie dopisz wpis do dziennika i zaktualizuj sekcję „Stan”.

## Stan

- Ukończony etap: 1 — trzy warianty ekranu Start (czeka na wybór autorki).
- Następny etap: 2 — szkielet całej aplikacji i nawigacja (po wyborze wariantu A, B lub C).

## Decyzje autorki

- 24.11.2026: nazwa „mObywatel Prosto”.
- 24.11.2026: asystent jako pole na Start + osobna zakładka.

## Dziennik

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

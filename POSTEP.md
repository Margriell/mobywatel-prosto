# Postęp prac — mObywatel dla każdego

Ten plik prowadzi AI. Po każdym etapie dopisz wpis do dziennika i zaktualizuj sekcję „Stan”.

## Stan

- Obowiązuje SPECYFIKACJA.md w wersji 2.4 (poprawki po teście, publikacja, przygotowanie pod Bielika).
- Ukończone (26.11.2026): poprawki po teście autorki i przygotowanie do publikacji na GitHub Pages — z pełną Kontrolą (21 zestawów, 0 błędów). Szczegóły w dzienniku.
- Wcześniej: etap 3 — asystent offline i sprawy A, B, C.
- Następny krok: publikacja na GitHub Pages (robi autorka w GitHub Desktop), potem sprawdzenie adresu w podglądzie linku.
- **Etap „Asystent i sprawy offline” (26.11.2026) — wszystkie kroki 1–6 ukończone:**
  - [x] Krok 1 — szkielet asystenta: `asystent.js` (jeden wpis na sprawę, `rozpoznajSprawe(tekst)`, tolerancja literówek), rozmowa na zakładce Asystent, podpowiedzi dla każdej osoby, „Przeczytaj na głos” przy każdej odpowiedzi, „Powiedz” (rozpoznawanie mowy w przeglądarce), „Nie rozumiem jeszcze tej prośby…” z przyciskami spraw.
  - [x] Krok 2 — sprawa A „Zgubione dokumenty”: Co zginęło? (dokumenty z portfela osoby + karty płatnicze + inne) → Co zrobimy (przełączniki; karty: „Zadzwoń i zastrzeż karty: 828 828 828”) → Sprawdź, zanim wyślemy (+ odcisk palca/PIN) → Gotowe, wiadomość w Skrzynce. Po wysłaniu mDowód ma status „Unieważniony”, a PESEL jest zastrzeżony. Drogi: Usługi, szczegóły mDowodu (Zgłoś utratę / Zastrzeż PESEL), asystent.
  - [x] Krok 3 — sprawa B „Mój samochód: OC i badanie techniczne”: ekran pojazdu ze statusami (OC — ostrzeżenie, badanie — w porządku) → „Przypomnij mi 7 dni przed terminem” (OC / badanie; powiadomienie w aplikacji albo SMS) → Gotowe, wiadomość w Skrzynce. Drogi: karta pilna Tomasza, Moje pojazdy, Usługi, asystent. Osoba bez auta dostaje uprzejmą informację i link do Usług.
  - [x] Krok 4 — sprawa C „Zameldowanie na pobyt stały”: Adres → Od kiedy → Podstawa (właściciel / wynajem) → Sprawdź, zanim wyślemy (z „Zmień” przy każdej odpowiedzi) → Gotowe, wiadomość w Skrzynce. Błędy przy polu z podpowiedzią, jak poprawić (ulica bez numeru, zły kod pocztowy, data nieistniejąca lub z przyszłości, brak wyboru). Drogi: karta pilna Oli „Dokończ zameldowanie” (adres już wpisany), Usługi, asystent. Po wysłaniu karta Oli zmienia się na „Wniosek o zameldowanie wysłany”.
  - [x] Krok 5 — szybkie sprawy asystenta: wytłumaczenie pisma (też z pisma w Skrzynce: „Wytłumacz prostym językiem”), „Czy ten SMS to oszustwo?” (z przykładem jako podpowiedź Haliny), pokaż dowód / kod QR, ważność dokumentów, punkty karne, mandaty, lokal wyborczy, zniżki z legitymacji, Karta Dużej Rodziny, status PESEL. Gdy osoba nie ma dokumentu — uprzejma informacja i co może zrobić.
  - [x] Krok 6 — test 70 zdań × 3 osoby (210 odpowiedzi, 0 ślepych zaułków; tabela w dzienniku), sprawy A, B, C przejdzone każdą drogą, Kontrola: 21 zestawów, 4116 ekranów, 0 błędów.

## Decyzje autorki

- 24.11.2026: nazwa „mObywatel Prosto”.
- 24.11.2026: asystent jako pole na Start + osobna zakładka.
- 24.11.2026: kierunek wyglądu — wariant B. Warianty A i C przeniesione do `warianty/archiwum/`.
- 24.11.2026: stałe dla wszystkich wariantów (wpisane do SPECYFIKACJA.md, wersja 1.1): nazwa „mObywatel” w nagłówku; bez paska „Prototyp” na ekranach aplikacji; bez przewijania widać powitanie, kartę pilną i pole asystenta; dolny pasek zawsze w 1 rzędzie z podpisami 16 px; kafle w 1 lub 2 kolumnach; karta pilna zależna od osoby; wszystko działa po dwukliku i na GitHub Pages; folder `.claude/` w `.gitignore`.

- 25.11.2026: specyfikacja 2.0 — ekranem startowym są Dokumenty; dolny pasek Dokumenty · Usługi · Asystent · Kod QR · Więcej.
- 25.11.2026: przycisk „Aa Wygląd” w nagłówku (otwiera panel „Wygląd i dostępność”, ten sam co w Więcej) — dopisany do SPECYFIKACJA.md, sekcja „Mapa aplikacji”.
- 25.11.2026: warianty B1–B3 przeniesione do `warianty/archiwum/`.
- 25.11.2026: wzorem wyglądu i układu jest `warianty/makieta-dokumenty.html` (zatwierdzona przez autorkę). Warianty Dokumenty 1–3 przeniesione do `warianty/archiwum/`.
- 25.11.2026: decyzje z makiety wpisane do SPECYFIKACJA.md (wersja 2.1): (1) dokumenty jako portfel kart jedna za drugą, każda z czytelnym paskiem, mDowód z przodu w całości, dotknięcie paska otwiera szczegóły; (2) kolor mają tylko karty dokumentów, reszta spokojna — białe powierzchnie i granat, czerwień tylko dla spraw z terminem; (3) w nagłówku „Dostosuj” (suwaki z podpisem) i „Skrzynka” z licznikiem; (4) pole asystenta przypięte nad dolnym paskiem, po dotknięciu 3 gotowe pytania, blok asystenta pod kartą sprawy usunięty; (5) pasek telefonu z godziną i baterią.

- 25.11.2026: poprawki do etapu 2 — dokumenty mają odpowiadać prawdziwemu mObywatelowi (opis z aplikacji autorki), wpisane do SPECYFIKACJA.md (wersja 2.2): (1) dokumenty osób — Halina: mDowód, mLegitymacja emeryta-rencisty, Karta Dużej Rodziny; Tomasz: mDowód, mPrawo jazdy, Moje pojazdy; Ola: mDowód, mLegitymacja studencka; (2) dotknięcie karty z tyłu przesuwa ją na przód, szczegóły otwiera przycisk na przedniej karcie; (3) każda karta wygląda jak prawdziwy dokument — wspólny szablon, własny kolor, wzór giloszowy; (4) szczegóły dokumentu jak w mObywatelu; (5) „Zarządzaj”: kolejność, usuń, układ, dodaj; (6) „Wstecz” z tytułem przyklejone u góry podekranów; (7) czcionka Atkinson Hyperlegible z Google Fonts, zapasowo systemowa.

- 26.11.2026: etap „Asystent i sprawy offline”, wpisany do SPECYFIKACJA.md (wersja 2.3): zasada „AI rozumie, aplikacja prowadzi”; każda sprawa to jeden wpis w `asystent.js`, rozpoznawanie w `rozpoznajSprawe(tekst)` (później Bielik); odpowiedzi najwyżej 2 zdania, zawsze z przyciskami; podpowiedzi dopasowane do osoby; sprawy A, B, C w pełni (C już nie opcjonalna); karta pilna Oli „Dokończ zameldowanie”; szybkie sprawy asystenta (pismo, SMS, dowód, ważność, punkty, mandat, wybory, zniżki, KDR, PESEL); wszystko działa bez internetu.

## Dziennik

### 26.11.2026 Poprawki po teście autorki i przygotowanie do publikacji (SPECYFIKACJA.md 2.4)
- Zrobione:
  - **Portfel:** z przodu zawsze pierwszy dokument z kolejności w „Zarządzaj” (domyślnie mDowód). Dotknięcie karty z tyłu pokazuje ją z przodu tylko chwilowo — po wyjściu z Dokumentów i po ponownym otwarciu wraca pierwszy dokument. Kolejność decyduje też o „Małe karty” i „Lista”. W „Zarządzaj” dopisek „Pierwszy dokument z listy będzie zawsze na przodzie”. Zapis w przeglądarce ma nowy klucz, więc stare kolejności zaczynają od nowa.
  - **Długie nazwy:** paski kart z tyłu mają zawsze równą wysokość (wyrównywane po każdym rysowaniu i zmianie tekstu); na karcie krótsza nazwa „mLegitymacja emeryta”, pełna w szczegółach.
  - **Dolny pasek:** przewijanie rozmowy przesuwało całą ramkę telefonu. Teraz przewija się tylko treść; ramka nie da się przewinąć. Pasek zawsze na samym dole.
  - **„Powiedz”:** Opera i Firefox — „Ta przeglądarka nie obsługuje mówienia. Wpisz pytanie albo otwórz aplikację w Chrome lub Edge.”; bez internetu — „Mówienie wymaga internetu…”.
  - **Ogólne pytania asystenta:** „Co mam do załatwienia?” (karta uwagi + nieprzeczytane wiadomości), „Jakie mam dokumenty?”, „Mam nowe wiadomości?” (lista wiadomości z przyciskami), rozszerzone „W czym mi pomożesz?”. Wyniki — tabela poniżej (29 sformułowań × 3 osoby, 0 problemów). Stary test 70 zdań nadal: 0 problemów.
  - **Bielik (bez podłączania):** `config.js` (adres pusty), `rozpoznajSprawe(tekst)` najpierw pyta model, gdy adres jest ustawiony; limit 6 s, potem scenariusze; zdanie modelu z liczbami/datami/adresami odrzucane. Sprawdzone z udawanym modelem (odpowiedź, zdanie z liczbą, brak odpowiedzi → scenariusz po 6,2 s). `bielik/worker.js` (Cloudflare Worker, format API OpenAI, ukrywa klucz), `bielik/INSTRUKCJA.md`, `bielik/test.html`. Nic nie wdrożone.
  - **Publikacja:** tytuł „mObywatel dla każdego — prototyp konkursowy”, opis, ikona `media/ikona.svg` + `media/ikona-180.png`, Open Graph z obrazkiem `media/podglad.png` (1200 × 630), `.nojekyll`, `README.md` po polsku. Aplikacja nie linkuje do `warianty/`.
- Kontrola (według sekcji „Kontrola” specyfikacji; automatycznie, 199 ekranów na zestaw, z nowymi sprawdzeniami: dolny pasek na samym dole, ramka telefonu nieprzewinięta, równe paski kart z tyłu, z przodu pierwszy dokument z kolejności):
  - 390 px (ramka telefonu): 12 zestawów (3 rozmiary tekstu × 3 motywy + 3 z trybem prostym), 2388 ekranów — 0 błędów.
  - 320 px: 6 zestawów, 1194 ekrany — 0 błędów.
  - Powiększenie 200% (640 × 360): 3 zestawy, 597 ekranów — 0 błędów (po poprawce poniżej).
  - Razem 21 zestawów, 4179 ekranów. Najmniejszy tekst 16 px, najsłabszy kontrast 4,65:1. Działa z pliku bez internetu (Edge).
  - Poprawione w trakcie: przy 200% w jednym przebiegu komunikat o błędzie w sprawie A znalazł się nad ekranem — płynne przewijanie rozmowy z asystentem mogło jeszcze trwać przy przejściu do sprawy. Przy dużym powiększeniu (przewija się cała strona) przewijanie jest teraz natychmiastowe; płynne zostaje tylko w ramce telefonu.
- Do decyzji:
  - **Adres strony w podglądzie linku** wpisany jako `https://margriell.github.io/mobywatel-prosto/` — sprawdzić po publikacji (repozytorium nie ma jeszcze ustawionego adresu GitHub).
  - **Licencja kodu** w README: „© 2026 autorka, do oceny w konkursie” — do decyzji (np. MIT).
  - Fakty z poprzedniego etapu (828 828 828, 8080, cofanie zastrzeżenia PESEL) — nadal do sprawdzenia.

#### Ogólne pytania do asystenta (test)

| Zdanie | Halina | Tomasz | Ola |
| --- | --- | --- | --- |
| Co mam do załatwienia? | „Czeka na Ciebie 1 sprawa.” → Nowe pismo: Urząd Miasta: podatek od nieruchomości | „Czeka na Ciebie 2 sprawy.” → Kończy się OC: OC samochodu kończy się za 12 dni (08.12.2026); Pismo: Kończy się OC Twojego samochodu | „Czeka na Ciebie 1 sprawa.” → Dokończ zameldowanie: Nowy adres jest już wpisany. Sprawdź go i wyślij. |
| Jakie mam sprawy? | „Czeka na Ciebie 1 sprawa.” → Nowe pismo: Urząd Miasta: podatek od nieruchomości | „Czeka na Ciebie 2 sprawy.” → Kończy się OC: OC samochodu kończy się za 12 dni (08.12.2026); Pismo: Kończy się OC Twojego samochodu | „Czeka na Ciebie 1 sprawa.” → Dokończ zameldowanie: Nowy adres jest już wpisany. Sprawdź go i wyślij. |
| Czy coś na mnie czeka? | „Czeka na Ciebie 1 sprawa.” → Nowe pismo: Urząd Miasta: podatek od nieruchomości | „Czeka na Ciebie 2 sprawy.” → Kończy się OC: OC samochodu kończy się za 12 dni (08.12.2026); Pismo: Kończy się OC Twojego samochodu | „Czeka na Ciebie 1 sprawa.” → Dokończ zameldowanie: Nowy adres jest już wpisany. Sprawdź go i wyślij. |
| co muszę zrobić | „Czeka na Ciebie 1 sprawa.” → Nowe pismo: Urząd Miasta: podatek od nieruchomości | „Czeka na Ciebie 2 sprawy.” → Kończy się OC: OC samochodu kończy się za 12 dni (08.12.2026); Pismo: Kończy się OC Twojego samochodu | „Czeka na Ciebie 1 sprawa.” → Dokończ zameldowanie: Nowy adres jest już wpisany. Sprawdź go i wyślij. |
| mam coś do zrobienia? | „Czeka na Ciebie 1 sprawa.” → Nowe pismo: Urząd Miasta: podatek od nieruchomości | „Czeka na Ciebie 2 sprawy.” → Kończy się OC: OC samochodu kończy się za 12 dni (08.12.2026); Pismo: Kończy się OC Twojego samochodu | „Czeka na Ciebie 1 sprawa.” → Dokończ zameldowanie: Nowy adres jest już wpisany. Sprawdź go i wyślij. |
| czy czeka na mnie coś pilnego | „Czeka na Ciebie 1 sprawa.” → Nowe pismo: Urząd Miasta: podatek od nieruchomości | „Czeka na Ciebie 2 sprawy.” → Kończy się OC: OC samochodu kończy się za 12 dni (08.12.2026); Pismo: Kończy się OC Twojego samochodu | „Czeka na Ciebie 1 sprawa.” → Dokończ zameldowanie: Nowy adres jest już wpisany. Sprawdź go i wyślij. |
| Jakie mam dokumenty? | „Masz w aplikacji 3 dokumenty.” → mDowód, mLegitymacja emeryta-rencisty, Karta Dużej Rodziny | „Masz w aplikacji 3 dokumenty.” → mDowód, mPrawo jazdy, Moje pojazdy | „Masz w aplikacji 2 dokumenty.” → mDowód, mLegitymacja studencka |
| pokaż moje dokumenty | „Masz w aplikacji 3 dokumenty.” → mDowód, mLegitymacja emeryta-rencisty, Karta Dużej Rodziny | „Masz w aplikacji 3 dokumenty.” → mDowód, mPrawo jazdy, Moje pojazdy | „Masz w aplikacji 2 dokumenty.” → mDowód, mLegitymacja studencka |
| co mam w portfelu | „Masz w aplikacji 3 dokumenty.” → mDowód, mLegitymacja emeryta-rencisty, Karta Dużej Rodziny | „Masz w aplikacji 3 dokumenty.” → mDowód, mPrawo jazdy, Moje pojazdy | „Masz w aplikacji 2 dokumenty.” → mDowód, mLegitymacja studencka |
| lista dokumentów | „Masz w aplikacji 3 dokumenty.” → mDowód, mLegitymacja emeryta-rencisty, Karta Dużej Rodziny | „Masz w aplikacji 3 dokumenty.” → mDowód, mPrawo jazdy, Moje pojazdy | „Masz w aplikacji 2 dokumenty.” → mDowód, mLegitymacja studencka |
| ile mam dokumentów | „Masz w aplikacji 3 dokumenty.” → mDowód, mLegitymacja emeryta-rencisty, Karta Dużej Rodziny | „Masz w aplikacji 3 dokumenty.” → mDowód, mPrawo jazdy, Moje pojazdy | „Masz w aplikacji 2 dokumenty.” → mDowód, mLegitymacja studencka |
| Co umiesz? | Mówi, co umie + przyciski spraw | Mówi, co umie + przyciski spraw | Mówi, co umie + przyciski spraw |
| W czym mi pomożesz? | Mówi, co umie + przyciski spraw | Mówi, co umie + przyciski spraw | Mówi, co umie + przyciski spraw |
| Pomoc | Mówi, co umie + przyciski spraw | Mówi, co umie + przyciski spraw | Mówi, co umie + przyciski spraw |
| jak działasz | Mówi, co umie + przyciski spraw | Mówi, co umie + przyciski spraw | Mówi, co umie + przyciski spraw |
| co potrafisz | Mówi, co umie + przyciski spraw | Mówi, co umie + przyciski spraw | Mówi, co umie + przyciski spraw |
| potrzebuję pomocy | Mówi, co umie + przyciski spraw | Mówi, co umie + przyciski spraw | Mówi, co umie + przyciski spraw |
| Mam nowe wiadomości? | „Masz 1 nową wiadomość.” + przyciski wiadomości + „Otwórz Skrzynkę” | „Masz 1 nową wiadomość.” + przyciski wiadomości + „Otwórz Skrzynkę” | „Nie masz nowych wiadomości.” + „Otwórz Skrzynkę” |
| czy przyszło jakieś pismo | „Masz 1 nową wiadomość.” + przyciski wiadomości + „Otwórz Skrzynkę” | „Masz 1 nową wiadomość.” + przyciski wiadomości + „Otwórz Skrzynkę” | „Nie masz nowych wiadomości.” + „Otwórz Skrzynkę” |
| co w skrzynce | „Masz 1 nową wiadomość.” + przyciski wiadomości + „Otwórz Skrzynkę” | „Masz 1 nową wiadomość.” + przyciski wiadomości + „Otwórz Skrzynkę” | „Nie masz nowych wiadomości.” + „Otwórz Skrzynkę” |
| nowe wiadomości | „Masz 1 nową wiadomość.” + przyciski wiadomości + „Otwórz Skrzynkę” | „Masz 1 nową wiadomość.” + przyciski wiadomości + „Otwórz Skrzynkę” | „Nie masz nowych wiadomości.” + „Otwórz Skrzynkę” |
| czy mam pocztę | „Masz 1 nową wiadomość.” + przyciski wiadomości + „Otwórz Skrzynkę” | „Masz 1 nową wiadomość.” + przyciski wiadomości + „Otwórz Skrzynkę” | „Nie masz nowych wiadomości.” + „Otwórz Skrzynkę” |
| Dziękuję | „Proszę bardzo” + podpowiedzi | „Proszę bardzo” + podpowiedzi | „Proszę bardzo” + podpowiedzi |
| dzięki | „Proszę bardzo” + podpowiedzi | „Proszę bardzo” + podpowiedzi | „Proszę bardzo” + podpowiedzi |
| Dzień dobry | Wita po imieniu + podpowiedzi | Wita po imieniu + podpowiedzi | Wita po imieniu + podpowiedzi |
| cześć | Wita po imieniu + podpowiedzi | Wita po imieniu + podpowiedzi | Wita po imieniu + podpowiedzi |
| witam | Wita po imieniu + podpowiedzi | Wita po imieniu + podpowiedzi | Wita po imieniu + podpowiedzi |
| dobry wieczór | Wita po imieniu + podpowiedzi | Wita po imieniu + podpowiedzi | Wita po imieniu + podpowiedzi |
| super, dzięki | „Proszę bardzo” + podpowiedzi | „Proszę bardzo” + podpowiedzi | „Proszę bardzo” + podpowiedzi |

### 26.11.2026 Etap 3 — asystent offline i sprawy A, B, C
- Zasada całego etapu: „AI rozumie, aplikacja prowadzi”. Asystent rozpoznaje sprawę i odpowiada krótko; wysłanie, zastrzeżenie i zgłoszenie idą zawsze przez widoczne kroki z potwierdzeniem — te same co z Usług. Wszystko działa bez internetu i bez serwera.
- Zrobione:
  - **Krok 1 — szkielet asystenta.** Nowy plik `asystent.js`: każda sprawa to jeden wpis (słowa kluczowe, odpowiedź, przyciski, dokąd prowadzi), całe rozpoznawanie w funkcji `rozpoznajSprawe(tekst)` — do podmiany na model Bielik. Tekst porównywany małymi literami, bez polskich znaków, z tolerancją literówek. Gdy żadna sprawa nie pasuje, asystent szuka w liście Usług, a dopiero potem mówi „Nie rozumiem jeszcze tej prośby. Mogę pomóc w tych sprawach:” z przyciskami spraw i „Zobacz wszystkie usługi”. Rozmowa na zakładce Asystent (dymki, karta sprawy z „Zacznij” i „Wolę przejść krok po kroku sam(a)”, pola wyboru, „Przeczytaj na głos” przy każdej odpowiedzi, „Nowa rozmowa”). Pytanie z pola na ekranie Dokumenty przenosi do rozmowy. Podpowiedzi dopasowane do osoby (3 pod polem, 4 w pustym stanie). „Powiedz” używa rozpoznawania mowy w przeglądarce; gdy nie działa, prosi o wpisanie pytania.
  - **Krok 2 — sprawa A „Zgubione dokumenty”** (4 kroki): Co zginęło? (dokumenty z portfela osoby, karty płatnicze, inne) → Co zrobimy (przełączniki: unieważnić dowód, zastrzec PESEL, zgłosić utratę prawa jazdy; karty — „Zadzwoń i zastrzeż karty: 828 828 828”; legitymacje i KDR — gdzie zgłosić) → Sprawdź, zanim wyślemy (+ odcisk palca / PIN) → Gotowe. Wiadomość w Skrzynce; mDowód dostaje status „Unieważniony”, PESEL jest zastrzeżony.
  - **Krok 3 — sprawa B „Mój samochód: OC i badanie techniczne”** (3 kroki): pojazd ze statusami → przypomnienie 7 dni przed terminem (OC, badanie; powiadomienie w aplikacji albo SMS) → Gotowe, wiadomość w Skrzynce. Osoba bez auta dostaje uprzejmą informację i link do Usług.
  - **Krok 4 — sprawa C „Zameldowanie na pobyt stały”** (5 kroków): adres → od kiedy → podstawa (właściciel / wynajem) → Sprawdź, zanim wyślemy („Zmień” przy każdej odpowiedzi) → Gotowe, wiadomość w Skrzynce. Błędy przy polu z ikoną i podpowiedzią, jak poprawić. Ola ma kartę pilną „Dokończ zameldowanie” z wpisanym adresem; po wysłaniu karta zmienia się na „Wniosek o zameldowanie wysłany”.
  - **Krok 5 — szybkie sprawy asystenta:** wytłumaczenie pisma (najważniejsze: pismo Haliny o podatku — od kogo, ile, do kiedy, co zrobić; „Pokaż pismo”, „Jak zapłacić?”; także przyciskiem „Wytłumacz prostym językiem” w samym piśmie), „Czy ten SMS to oszustwo?” (przykład fałszywego SMS-a o dopłacie do paczki jako podpowiedź Haliny), pokaż dowód / kod QR, ważność dokumentów, punkty karne, mandat, lokal wyborczy, zniżki z legitymacji (ogólnie), Karta Dużej Rodziny (ogólnie), status PESEL. Gdy osoba nie ma dokumentu — uprzejma informacja i co może zrobić.
  - SPECYFIKACJA.md: wersja 2.3 (zasada etapu, asystent, sprawy A, B, C, podpowiedzi osób, karta Oli, dane fikcyjne).
- Pliki: `asystent.js` (nowy), `app.js`, `dane.js`, `style.css`, `index.html`, `SPECYFIKACJA.md`, `POSTEP.md`.
- Jak sprawdzić (dwuklik na `index.html`; szybkie wejście `?osoba=halina|tomasz|ola`, od nowa `?reset=1`):
  - **Asystent:** dotknij pola „Co chcesz załatwić?” na Dokumentach i wybierz gotowe pytanie albo wpisz własne (np. „zgubilam portfle”). Odpowiedź pojawia się na zakładce Asystent.
  - **Sprawa A:** u Tomasza mDowód → „Zgłoś utratę dowodu” albo w asystencie „ukradli mi torebkę”. Po wysłaniu mDowód ma status „Unieważniony”, a w Skrzynce jest potwierdzenie.
  - **Sprawa B:** u Tomasza czerwona karta „Kończy się OC” → „Przypomnij mi 7 dni przed terminem”. U Haliny pytanie „do kiedy mam OC” kończy się uprzejmą informacją o braku auta.
  - **Sprawa C:** u Oli karta „Dokończ zameldowanie” — adres jest już wpisany. Spróbuj złego kodu pocztowego albo daty z przyszłości, żeby zobaczyć podpowiedź przy polu.
  - **Pismo i SMS:** u Haliny podpowiedzi „Wytłumacz mi pismo” i „Czy ten SMS to oszustwo?”.
- Test asystenta (automatycznie, ten sam kod co w aplikacji): 70 różnych zdań × 3 osoby = 210 odpowiedzi. Każda kończy się przyciskami następnego kroku, kartą sprawy albo pytaniem z wyborem — 0 ślepych zaułków. Każda ma najwyżej 2 zdania, zdania do 15 słów, wszystkie przyciski prowadzą do istniejących ekranów. Sprawdzony też każdy wybór w rozmowie (także pusty). „Nie rozumiem jeszcze tej prośby” tylko dla zdań nie na temat (pogoda, kawał, „asdfgh”, pierogi, bilet do Zakopanego) — zawsze z przyciskami spraw.

| Zdanie | Halina | Tomasz | Ola |
| --- | --- | --- | --- |
| zgubiłam portfel | Sprawa A: „Przykro mi…”, pyta „Co zginęło?” | Sprawa A: „Przykro mi…”, pyta „Co zginęło?” | Sprawa A: „Przykro mi…”, pyta „Co zginęło?” |
| Zginął mi portfel | Sprawa A: „Przykro mi…”, pyta „Co zginęło?” | Sprawa A: „Przykro mi…”, pyta „Co zginęło?” | Sprawa A: „Przykro mi…”, pyta „Co zginęło?” |
| ukradli mi torebkę | Sprawa A: „Przykro mi…”, pyta „Co zginęło?” | Sprawa A: „Przykro mi…”, pyta „Co zginęło?” | Sprawa A: „Przykro mi…”, pyta „Co zginęło?” |
| zginął mi dowód | Sprawa A: „Przykro mi…”, pyta „Co zginęło?” (zaznacza: dowód osobisty) | Sprawa A: „Przykro mi…”, pyta „Co zginęło?” (zaznacza: dowód osobisty) | Sprawa A: „Przykro mi…”, pyta „Co zginęło?” (zaznacza: dowód osobisty) |
| zgubilem dowod osobisty | Sprawa A: „Przykro mi…”, pyta „Co zginęło?” (zaznacza: dowód osobisty) | Sprawa A: „Przykro mi…”, pyta „Co zginęło?” (zaznacza: dowód osobisty) | Sprawa A: „Przykro mi…”, pyta „Co zginęło?” (zaznacza: dowód osobisty) |
| skradziono mi plecak z dokumentami | Sprawa A: „Przykro mi…”, pyta „Co zginęło?” | Sprawa A: „Przykro mi…”, pyta „Co zginęło?” | Sprawa A: „Przykro mi…”, pyta „Co zginęło?” |
| nie mogę znaleźć prawa jazdy | Sprawa A: „Przykro mi…”, pyta „Co zginęło?” | Sprawa A: „Przykro mi…”, pyta „Co zginęło?” (zaznacza: prawo jazdy) | Sprawa A: „Przykro mi…”, pyta „Co zginęło?” |
| zgubiłam kartę płatniczą | Sprawa A: „Przykro mi…”, pyta „Co zginęło?” (zaznacza: karty płatnicze) | Sprawa A: „Przykro mi…”, pyta „Co zginęło?” (zaznacza: karty płatnicze) | Sprawa A: „Przykro mi…”, pyta „Co zginęło?” (zaznacza: karty płatnicze) |
| zgbiłam portfel | Sprawa A: „Przykro mi…”, pyta „Co zginęło?” | Sprawa A: „Przykro mi…”, pyta „Co zginęło?” | Sprawa A: „Przykro mi…”, pyta „Co zginęło?” |
| zastrzec PESEL | Sprawa A: karta „Zastrzeż PESEL” → krok 2 | Sprawa A: karta „Zastrzeż PESEL” → krok 2 | Sprawa A: karta „Zastrzeż PESEL” → krok 2 |
| jak zastrzec pesel | Sprawa A: karta „Zastrzeż PESEL” → krok 2 | Sprawa A: karta „Zastrzeż PESEL” → krok 2 | Sprawa A: karta „Zastrzeż PESEL” → krok 2 |
| chce zastrzec numer pesl | Sprawa A: karta „Zastrzeż PESEL” → krok 2 | Sprawa A: karta „Zastrzeż PESEL” → krok 2 | Sprawa A: karta „Zastrzeż PESEL” → krok 2 |
| czy mój PESEL jest zastrzeżony | PESEL nie jest zastrzeżony + „Zastrzeż PESEL” | PESEL nie jest zastrzeżony + „Zastrzeż PESEL” | PESEL nie jest zastrzeżony + „Zastrzeż PESEL” |
| czy mam zastrzezony pesel | PESEL nie jest zastrzeżony + „Zastrzeż PESEL” | PESEL nie jest zastrzeżony + „Zastrzeż PESEL” | PESEL nie jest zastrzeżony + „Zastrzeż PESEL” |
| do kiedy mam OC | Nie ma auta → „Usługi: Samochód” | OC ważne do … (12 dni) + karta przypomnienia (sprawa B) | Nie ma auta → „Usługi: Samochód” |
| kiedy kończy się ubezpieczenie samochodu | Nie ma auta → „Usługi: Samochód” | OC ważne do … (12 dni) + karta przypomnienia (sprawa B) | Nie ma auta → „Usługi: Samochód” |
| przegląd auta | Nie ma auta → „Usługi: Samochód” | Badanie ważne do 14.05.2027 + karta przypomnienia (sprawa B) | Nie ma auta → „Usługi: Samochód” |
| kiedy mam badanie techniczne | Nie ma auta → „Usługi: Samochód” | Badanie ważne do 14.05.2027 + karta przypomnienia (sprawa B) | Nie ma auta → „Usługi: Samochód” |
| ubezpieczenie samochodu | Nie ma auta → „Usługi: Samochód” | OC ważne do … (12 dni) + karta przypomnienia (sprawa B) | Nie ma auta → „Usługi: Samochód” |
| OC | Nie ma auta → „Usługi: Samochód” | OC ważne do … (12 dni) + karta przypomnienia (sprawa B) | Nie ma auta → „Usługi: Samochód” |
| chcę się zameldować | Sprawa C: pyta: właściciel czy wynajem | Sprawa C: pyta: właściciel czy wynajem | Sprawa C: przypomina wpisany adres, pyta: właściciel czy wynajem |
| jak się zameldować | Sprawa C: pyta: właściciel czy wynajem | Sprawa C: pyta: właściciel czy wynajem | Sprawa C: przypomina wpisany adres, pyta: właściciel czy wynajem |
| przeprowadzka | Sprawa C: pyta: właściciel czy wynajem | Sprawa C: pyta: właściciel czy wynajem | Sprawa C: przypomina wpisany adres, pyta: właściciel czy wynajem |
| meldunek | Sprawa C: pyta: właściciel czy wynajem | Sprawa C: pyta: właściciel czy wynajem | Sprawa C: przypomina wpisany adres, pyta: właściciel czy wynajem |
| zameldowac sie na pobyt staly | Sprawa C: pyta: właściciel czy wynajem | Sprawa C: pyta: właściciel czy wynajem | Sprawa C: przypomina wpisany adres, pyta: właściciel czy wynajem |
| Dokończ zameldowanie | Sprawa C: pyta: właściciel czy wynajem | Sprawa C: pyta: właściciel czy wynajem | Sprawa C: przypomina wpisany adres, pyta: właściciel czy wynajem |
| Wytłumacz mi pismo | Wyjaśnia pismo: Urząd Miasta Krakowa, 412 zł + „Pokaż pismo” | Wyjaśnia pismo: mObywatel, OC samochodu Skoda Octavia (WX 4821K) + „Pokaż pismo” | Brak pisma do wyjaśnienia → „Otwórz Skrzynkę” |
| wytlumacz mi to pismo z urzedu | Wyjaśnia pismo: Urząd Miasta Krakowa, 412 zł + „Pokaż pismo” | Wyjaśnia pismo: mObywatel, OC samochodu Skoda Octavia (WX 4821K) + „Pokaż pismo” | Brak pisma do wyjaśnienia → „Otwórz Skrzynkę” |
| nie rozumiem pisma | Wyjaśnia pismo: Urząd Miasta Krakowa, 412 zł + „Pokaż pismo” | Wyjaśnia pismo: mObywatel, OC samochodu Skoda Octavia (WX 4821K) + „Pokaż pismo” | Brak pisma do wyjaśnienia → „Otwórz Skrzynkę” |
| ile mam zapłacić podatku | Wyjaśnia pismo: Urząd Miasta Krakowa, 412 zł + „Pokaż pismo” | Brak pisma do wyjaśnienia → „Otwórz Skrzynkę” | Brak pisma do wyjaśnienia → „Otwórz Skrzynkę” |
| Czy ten SMS to oszustwo? | Prosi o wklejenie SMS-a + przykład | Prosi o wklejenie SMS-a + przykład | Prosi o wklejenie SMS-a + przykład |
| Czy ten SMS to oszustwo? „Twoja paczka jest wstrzymana. Dopłać 1,89 zł w ciągu 24 h: paczka-dostawa24.xyz/oplata” | Ostrzega: oszustwo, 3 znaki, czego nie robić, 8080 | Ostrzega: oszustwo, 3 znaki, czego nie robić, 8080 | Ostrzega: oszustwo, 3 znaki, czego nie robić, 8080 |
| Dostałam SMS: Twoje konto zostanie zablokowane, kliknij bank-weryfikacja.top | Ostrzega: oszustwo, 3 znaki, czego nie robić, 8080 | Ostrzega: oszustwo, 3 znaki, czego nie robić, 8080 | Ostrzega: oszustwo, 3 znaki, czego nie robić, 8080 |
| Czy ten SMS to oszustwo? „Cześć mamo, to mój nowy numer, odezwij się” | Ostrzega: oszustwo, 3 znaki, czego nie robić, 8080 | Ostrzega: oszustwo, 3 znaki, czego nie robić, 8080 | Ostrzega: oszustwo, 3 znaki, czego nie robić, 8080 |
| Czy ten SMS to oszustwo? „Przypominamy o wizycie u lekarza jutro o 10:00” | Nie widzi znaków oszustwa, ale radzi ostrożność | Nie widzi znaków oszustwa, ale radzi ostrożność | Nie widzi znaków oszustwa, ale radzi ostrożność |
| pokaż mój dowód | „Proszę, oto mDowód.” + przycisk dokumentu i kodu QR | „Proszę, oto mDowód.” + przycisk dokumentu i kodu QR | „Proszę, oto mDowód.” + przycisk dokumentu i kodu QR |
| pokaz dowod | „Proszę, oto mDowód.” + przycisk dokumentu i kodu QR | „Proszę, oto mDowód.” + przycisk dokumentu i kodu QR | „Proszę, oto mDowód.” + przycisk dokumentu i kodu QR |
| pokaż prawo jazdy | Nie ma dokumentu → co zrobić | „Proszę, oto mPrawo jazdy.” + przycisk dokumentu i kodu QR | Nie ma dokumentu → co zrobić |
| kod qr | Kod QR → „Otwórz Kod QR” | Kod QR → „Otwórz Kod QR” | Kod QR → „Otwórz Kod QR” |
| jak zeskanować kod | Kod QR → „Otwórz Kod QR” | Kod QR → „Otwórz Kod QR” | Kod QR → „Otwórz Kod QR” |
| kiedy traci ważność mój dowód | „Twój dowód osobisty jest ważny do 12.03.2031.” | „Twój dowód osobisty jest ważny do 03.10.2030.” | „Twój dowód osobisty jest ważny do 09.02.2032.” |
| kiedy wygasa prawo jazdy | „Nie masz prawa jazdy w aplikacji.” | „Twoje prawo jazdy jest ważne do 22.06.2031.” | „Nie masz prawa jazdy w aplikacji.” |
| do kiedy ważna legitymacja | „Twoja mLegitymacja emeryta-rencisty jest ważna bezterminowo.” | „Nie masz legitymacji w aplikacji.” | „Twoja mLegitymacja studencka jest ważna.” |
| ważność dokumentu | Pyta: który dokument? (przyciski dokumentów) | Pyta: który dokument? (przyciski dokumentów) | Pyta: który dokument? (przyciski dokumentów) |
| ile mam punktów karnych | „Nie masz prawa jazdy w aplikacji, więc nie ma tu punktów karnych.” | „Masz 4 punkty karne.” | „Nie masz prawa jazdy w aplikacji, więc nie ma tu punktów karnych.” |
| punkty karne | „Nie masz prawa jazdy w aplikacji, więc nie ma tu punktów karnych.” | „Masz 4 punkty karne.” | „Nie masz prawa jazdy w aplikacji, więc nie ma tu punktów karnych.” |
| czy mam mandat do zapłaty | „Nie masz mandatów do zapłaty.” | „Masz 1 mandat do zapłaty: 200 zł za przekroczenie prędkości.” | „Nie masz mandatów do zapłaty.” |
| mandaty | „Nie masz mandatów do zapłaty.” | „Masz 1 mandat do zapłaty: 200 zł za przekroczenie prędkości.” | „Nie masz mandatów do zapłaty.” |
| gdzie głosuję | „Głosujesz w lokalu: Szkoła Podstawowa nr 21, ul. Lipowa 20, Kraków.” | „Głosujesz w lokalu: Szkoła Podstawowa nr 7, ul. Słoneczna 4, Warszawa.” | „Głosujesz w lokalu: Biblioteka Osiedlowa, ul. Polna 10, Gdańsk.” |
| gdzie glosuje w wyborach | „Głosujesz w lokalu: Szkoła Podstawowa nr 21, ul. Lipowa 20, Kraków.” | „Głosujesz w lokalu: Szkoła Podstawowa nr 7, ul. Słoneczna 4, Warszawa.” | „Głosujesz w lokalu: Biblioteka Osiedlowa, ul. Polna 10, Gdańsk.” |
| jaką zniżkę daje legitymacja | „Legitymacja emeryta-rencisty daje zniżki m.in. na kolej i komunikację miejską.” | „Nie masz legitymacji w aplikacji.” | „Legitymacja studencka daje zniżki m.in. na kolej i komunikację miejską.” |
| jakie mam zniżki | „Legitymacja emeryta-rencisty daje zniżki m.in. na kolej i komunikację miejską.” | „Nie masz w aplikacji legitymacji ani Karty Dużej Rodziny.” | „Legitymacja studencka daje zniżki m.in. na kolej i komunikację miejską.” |
| gdzie użyć karty dużej rodziny | „Kartą Dużej Rodziny zapłacisz mniej m.in. w sklepach, na stacjach paliw i w muzeach.” | „Nie masz Karty Dużej Rodziny w aplikacji.” | „Nie masz Karty Dużej Rodziny w aplikacji.” |
| karta duzej rodziny gdzie znizki | „Kartą Dużej Rodziny zapłacisz mniej m.in. w sklepach, na stacjach paliw i w muzeach.” | „Nie masz Karty Dużej Rodziny w aplikacji.” | „Nie masz Karty Dużej Rodziny w aplikacji.” |
| skrzynka | „Masz 1 nową wiadomość.” + „Otwórz Skrzynkę” | „Masz 1 nową wiadomość.” + „Otwórz Skrzynkę” | „Nie masz nowych wiadomości.” + „Otwórz Skrzynkę” |
| mam nowe wiadomości? | „Masz 1 nową wiadomość.” + „Otwórz Skrzynkę” | „Masz 1 nową wiadomość.” + „Otwórz Skrzynkę” | „Nie masz nowych wiadomości.” + „Otwórz Skrzynkę” |
| co umiesz | Mówi, co umie + przyciski spraw | Mówi, co umie + przyciski spraw | Mówi, co umie + przyciski spraw |
| pomoc | Mówi, co umie + przyciski spraw | Mówi, co umie + przyciski spraw | Mówi, co umie + przyciski spraw |
| dzień dobry | Wita po imieniu + podpowiedzi | Wita po imieniu + podpowiedzi | Wita po imieniu + podpowiedzi |
| dziękuję | „Proszę bardzo” + podpowiedzi | „Proszę bardzo” + podpowiedzi | „Proszę bardzo” + podpowiedzi |
| wymeldować się | Usługa z listy: Wymeldowanie | Usługa z listy: Wymeldowanie | Usługa z listy: Wymeldowanie |
| chcę nowy paszport | Usługa z listy: Paszport | Usługa z listy: Paszport | Usługa z listy: Paszport |
| rozliczenie PIT | Usługa z listy: Rozlicz PIT | Usługa z listy: Rozlicz PIT | Usługa z listy: Rozlicz PIT |
| recepta na leki | Usługa z listy: Recepty | Usługa z listy: Recepty | Usługa z listy: Recepty |
| jaka jest pogoda | „Nie rozumiem jeszcze tej prośby” + 3 sprawy + Usługi | „Nie rozumiem jeszcze tej prośby” + 3 sprawy + Usługi | „Nie rozumiem jeszcze tej prośby” + 3 sprawy + Usługi |
| opowiedz kawał | „Nie rozumiem jeszcze tej prośby” + 3 sprawy + Usługi | „Nie rozumiem jeszcze tej prośby” + 3 sprawy + Usługi | „Nie rozumiem jeszcze tej prośby” + 3 sprawy + Usługi |
| asdfgh | „Nie rozumiem jeszcze tej prośby” + 3 sprawy + Usługi | „Nie rozumiem jeszcze tej prośby” + 3 sprawy + Usługi | „Nie rozumiem jeszcze tej prośby” + 3 sprawy + Usługi |
| kocham pierogi | „Nie rozumiem jeszcze tej prośby” + 3 sprawy + Usługi | „Nie rozumiem jeszcze tej prośby” + 3 sprawy + Usługi | „Nie rozumiem jeszcze tej prośby” + 3 sprawy + Usługi |
| ile kosztuje bilet do Zakopanego | „Nie rozumiem jeszcze tej prośby” + 3 sprawy + Usługi | „Nie rozumiem jeszcze tej prośby” + 3 sprawy + Usługi | „Nie rozumiem jeszcze tej prośby” + 3 sprawy + Usługi |
| dowód | „Proszę, oto mDowód.” + przycisk dokumentu i kodu QR | „Proszę, oto mDowód.” + przycisk dokumentu i kodu QR | „Proszę, oto mDowód.” + przycisk dokumentu i kodu QR |

- Drogi spraw (przejdzone w przeglądarce, do ekranu Gotowe i wiadomości w Skrzynce):
  - A: Usługi („Zgłoś utratę lub kradzież dokumentów”, „Zastrzeż PESEL”), szczegóły mDowodu („Zgłoś utratę dowodu”, „Zastrzeż PESEL”), asystent („ukradli mi torebkę z dowodem” → pytanie z zaznaczonym dowodem → „Zacznij” → kroki z zaznaczonymi odpowiedziami).
  - B: karta pilna Tomasza, Moje pojazdy → „OC i badanie techniczne”, Usługi, asystent („do kiedy mam ubezpieczenie auta” → „Zacznij” → przypomnienie z zaznaczonym OC). Halina i Ola: informacja o braku auta.
  - C: karta pilna Oli (adres wpisany), Usługi, asystent („chcę się zameldować” → „Wynajmuję” → „Zacznij” → kroki z zaznaczoną podstawą).
- Kontrola (według sekcji „Kontrola” specyfikacji; automatycznie, w przeglądarce opartej na Chrome, z włączonym czytaniem na głos):
  - 196 ekranów na zestaw: wszystkie ekrany trzech osób jak w poprzednim etapie, a do tego rozmowa z asystentem (7 pytań różnego rodzaju i 2 wybory w rozmowie), każdy krok spraw A, B i C razem z ekranami błędów, okno potwierdzenia, ekrany Gotowe, Skrzynka z potwierdzeniami.
  - Szerokość 390 px (ramka telefonu): 3 rozmiary tekstu × 3 motywy + 3 zestawy z trybem prostym. Szerokość 320 px: 6 zestawów. Powiększenie 200% (640 × 360 px): 3 zestawy. Razem 21 zestawów, 4116 ekranów — 0 błędów. Po ostatnich poprawkach powtórzone 5 zestawów (390 px i 200%) — 0 błędów.
  - Najmniejszy tekst: 16 px. Najsłabszy kontrast: 4,65:1 (to samo miejsce co wcześniej — skrzyżowanie linii wzoru na zielonej karcie legitymacji). Wszystkie elementy klikalne co najmniej 48 × 48 px, odstępy co najmniej 8 px, nic nie wychodzi poza ekran i nic się nie nakłada. Każdy przycisk coś robi.
  - Po błędzie w formularzu komunikat i pole są widoczne pod paskiem „Wstecz”; po „W górę”/„W dół” przycisk z fokusem jest w całości widoczny.
  - Bez przewijania (390 × 844, tekst Standardowy): mDowód, karta „Wymaga Twojej uwagi” i pole asystenta widać u wszystkich — zapas: Halina 8 px, Tomasz 35 px, Ola 86 px.
  - Działa po otwarciu z pliku (bez serwera) i przy zablokowanym internecie: sprawdzone w Edge (rozmowa z asystentem, sprawa C z wpisanym adresem) i w Chrome (wyjaśnienie pisma). Brak błędów w konsoli.
- Znane problemy / do decyzji:
  - **„Powiedz” a internet i prywatność:** rozpoznawanie mowy w Chrome i Edge działa przez serwery Google/Microsoft — potrzebuje internetu, a nagranie głosu wychodzi poza telefon. Bez internetu asystent pokazuje okno „…rozpoznawanie mowy potrzebuje internetu. Napisz, co chcesz załatwić”. Do decyzji: zostawić tak, czy ukrywać „Powiedz”, gdy nie ma internetu. Czytanie na głos działa bez internetu (głosy systemu).
  - **Fakty podane ogólnie — warto sprawdzić przed zgłoszeniem:** zastrzeganie kart pod numerem 828 828 828 (ze specyfikacji); przekazywanie podejrzanych SMS-ów na numer 8080 (CERT Polska); „zastrzeżenie PESEL cofniesz w aplikacji mObywatel albo w urzędzie gminy”; „zgłoszenie utraty prawa jazdy trafi do urzędu, który je wydał”; „wniosek o zameldowanie trafia do urzędu gminy”; zniżki z legitymacji „m.in. na kolej i komunikację miejską, wysokość zależy od przewoźnika i miasta”; Karta Dużej Rodziny „m.in. w sklepach, na stacjach paliw i w muzeach”. Bez kwot i procentów.
  - **Sprawa B bez kroku „Potwierdzenie”:** ustawienie przypomnienia nic nie wysyła do urzędu, więc kroki są: pojazd → przypomnienie → Gotowe (jak w poleceniu). Wpisane do specyfikacji.
  - **„Zastrzeż PESEL” bez zgubienia** otwiera od razu krok 2 z 4 sprawy A (tylko przełącznik PESEL). „Wstecz” prowadzi do kroku 1.
  - **Moje pojazdy** nie są na liście „Co zginęło?” — to nie jest dokument, który można zgubić.
  - **Unieważniony mDowód** zostaje w portfelu ze statusem „Unieważniony” (czerwony) i komunikatem w szczegółach. Wszystko wraca do początku po ponownym wybraniu osoby.
  - **Rozmowa z asystentem** trwa do końca wizyty (po odświeżeniu strony zaczyna się od nowa). „Nowa rozmowa” czyści ją ręcznie.
  - **Kod kreskowy, zdjęcia, dane** — nadal fikcyjne. Nowe fikcyjne dane: adresy i lokale wyborcze osób, 4 punkty karne i mandat 200 zł Tomasza (termin: dziś + 10 dni), adres nowego mieszkania Oli (ul. Klonowa 8 m. 5, 80-180 Gdańsk), częściowo ukryte numery telefonów, adres strony w przykładowym SMS-ie (paczka-dostawa24.xyz).
  - **Karta pilna Oli** zmieniona z „Wszystko w porządku” na „Dokończ zameldowanie” (zgodnie z poleceniem; wpisane do specyfikacji).
  - **Poprawione w trakcie:** „opowiedz kawał” przypadkiem trafiało w usługę (za luźne literówki — teraz pierwsza litera musi się zgadzać); „chcę nowy paszport” podsuwało też dowód i zameldowanie; SMS „Cześć mamo, to mój nowy numer” nie był rozpoznawany jako oszustwo; przy 320 px po „W dół” przycisk z fokusem zostawał pod krawędzią ekranu; przy powiększeniu 200% komunikat o błędzie w formularzu mógł schować się pod paskiem „Wstecz”.

### 25.11.2026 Etap 2, poprawki — dokumenty jak w mObywatelu
- Zrobione:
  - **Dokumenty osób** według opisu autorki: Halina — mDowód, mLegitymacja emeryta-rencisty (ZUS), Karta Dużej Rodziny (rodzic, bezterminowo), bez prawa jazdy i pojazdów; Tomasz — mDowód, mPrawo jazdy, Moje pojazdy; Ola — mDowód, mLegitymacja studencka.
  - **Karty jak prawdziwe dokumenty:** jeden wspólny szablon — na górze pasek z nazwą i statusem, pod nim zdjęcie (inicjały) i dane jak na dokumencie. Każda karta w swoim kolorze (nowy: zielony dla legitymacji emeryta-rencisty). Wzór giloszowy jak na banknotach i dowodach: jasna rozeta z przeplatanych krzywych w prawym górnym rogu i ciemne fale przez środek karty. Moje pojazdy: sylwetka auta zamiast zdjęcia, u Tomasza białe pole z czerwonym ostrzeżeniem „[data] — zostało 12 dni”. mLegitymacja studencka: kod kreskowy z numerem albumu.
  - **Portfel:** dotknięcie karty z tyłu przesuwa ją na przód — karty płynnie zamieniają się miejscami, a dane nowej karty łagodnie się pojawiają (bez animacji przy „ogranicz ruch”). Szczegóły otwiera dopiero przycisk „Pokaż szczegóły” na przedniej karcie. Czytnik ekranu czyta każdą kartę z tyłu jako przycisk „Pokaż [nazwa] na przodzie” (ze statusem). Po przesunięciu fokus trafia na „Pokaż szczegóły”.
  - **Szczegóły dokumentu** jak w mObywatelu: podgląd karty, „Dane”, ostatnia aktualizacja, akcje. mDowód: seria i numer, termin ważności, data wydania, imię ojca i matki, rozwijane „Twoje dodatkowe dane”; „Potwierdź swoje dane osobiste”, „Dane dowodu osobistego”; „Pozostałe skróty”: Zastrzeż PESEL, Zgłoś utratę dowodu (sprawa A), Mandaty, Wybory, Usuń dokument. mLegitymacja studencka: dane z karty, numer albumu, kod kreskowy, komunikat „Dokument wymaga potwierdzenia danych”, „Bezpieczny autobus”, „Usuń dokument”. Pozostałe: dane z karty i „Usuń dokument”; Moje pojazdy dodatkowo „OC i badanie techniczne” (sprawa B). Akcje spoza prototypu otwierają okno „Niedostępne w prototypie”.
  - **Zarządzaj** (przycisk z ikoną nad portfelem): Kolejność dokumentów (przyciski „W górę” / „W dół”, po każdym przesunięciu zdanie „mDowód jest teraz na miejscu 2 z 3”), Usuń dokument (okno z potwierdzeniem, potem zielony komunikat „Usunięto dokument…”), Wybierz układ (Duże karty, Małe karty, Lista — zmiana od razu), Dodaj dokument (lista z opisu autorki, z oznaczeniem „Masz w aplikacji”; wybór otwiera okno „Niedostępne w prototypie”). Kolejność i układ zapamiętują się w przeglądarce.
  - **„Wstecz” zawsze widoczne:** na każdym podekranie górny pasek z „Wstecz” i tytułem ekranu jest przyklejony u góry i nie znika przy przewijaniu.
  - **Czcionka:** Atkinson Hyperlegible wczytywana z Google Fonts; bez internetu aplikacja działa z czcionką systemową.
  - SPECYFIKACJA.md: wersja 2.2 (dokumenty osób w tabeli „Osoby”, sekcje „Karty dokumentów”, „5. Szczegóły dokumentu”, „5a. Zarządzaj”, zasady „Czcionka” i „Nawigacja”).
- Pliki: `index.html` (czcionka), `style.css`, `app.js`, `dane.js`, `SPECYFIKACJA.md`, `POSTEP.md`.
- Jak sprawdzić: dwuklik na `index.html`. Dotknij paska karty z tyłu portfela — przesunie się na przód; „Pokaż szczegóły” otwiera szczegóły. „Zarządzaj” nad portfelem. Szybkie wejście: `?osoba=tomasz` (albo `halina`, `ola`) — każdy wybór osoby przywraca jej wszystkie dokumenty, kolejność i układ „Duże karty”.
- Kontrola (według sekcji „Kontrola” specyfikacji; automatycznie, w przeglądarce opartej na Chrome, z włączonym czytaniem na głos):
  - 119 ekranów na zestaw: wszystkie ekrany trzech osób, w tym szczegóły każdego dokumentu, rozwinięte „Twoje dodatkowe dane”, każda karta z tyłu przesunięta na przód, wszystkie ekrany „Zarządzaj”, układy „Małe karty” i „Lista”, przesunięcie w kolejności, okno usuwania, ekran po usunięciu i „Brak dokumentu”, wyszukiwarka, okno „Niedostępne w prototypie”.
  - Szerokość 390 px (ramka telefonu): 3 rozmiary tekstu × 3 motywy + 3 zestawy z trybem prostym. Szerokość 320 px: 6 zestawów. Powiększenie 200% (640 × 360 px): 3 zestawy. Razem 21 zestawów, 2499 ekranów — 0 błędów. Dodatkowo 2 zestawy kontrolne na ostatecznej wersji kodu — 0 błędów.
  - Najmniejszy tekst: 16 px. Najsłabszy kontrast: 4,65:1 — liczony w najgorszym miejscu, czyli tam, gdzie na zielonej karcie mLegitymacji studenckiej krzyżują się dwie jasne linie wzoru; bez wzoru 6,4:1.
  - Wszystkie elementy klikalne mają co najmniej 48 × 48 px (widoczny pasek karty z tyłu: 51 px), odstępy co najmniej 8 px. Nic nie wychodzi poza ekran i nic się nie nakłada. Każdy przycisk coś robi, każdy adres prowadzi do ekranu.
  - Bez przewijania (390 × 844, tekst Standardowy): widać mDowód, kartę „Wymaga Twojej uwagi” i pole asystenta u wszystkich — zapas: Halina 8 px, Tomasz 35 px, Ola 109 px.
  - Działa po otwarciu z pliku (bez serwera) w Edge i Chrome. Bez internetu (zablokowana sieć) działa z czcionką systemową.
  - Poprawione w trakcie: wzór giloszowy był prawie niewidoczny (wzmocniony; fale są ciemne, więc nie osłabiają kontrastu); za mały odstęp nad akcjami w szczegółach; przy powiększeniu 200% przycisk „W górę”/„W dół” z fokusem chował się pod przyklejonym paskiem „Wstecz” (teraz przewijanie zawsze zostawia miejsce na pasek); jawne etykiety dla czytnika ekranu przy kartach i „Zarządzaj”.
- Rozwiązane z poprzedniego wpisu: Halina mieści się teraz bez przewijania (ma 3 dokumenty zamiast 4); czcionka Atkinson Hyperlegible jest wczytywana.
- Znane problemy / do decyzji:
  - **„Twoje dodatkowe dane”** (mDowód): opis nie mówił, co zawierają. Wpisałem nazwisko rodowe, miejsce urodzenia i obywatelstwo — do potwierdzenia.
  - **Zastrzeż PESEL** w „Pozostałych skrótach” prowadzi do sprawy A (tak jak w Usługach — PESEL zastrzega się w kroku 2 tej sprawy).
  - **Akcje pozostałych dokumentów:** mPrawo jazdy, Karta Dużej Rodziny i mLegitymacja emeryta-rencisty mają tylko „Usuń dokument”. Moje pojazdy mają też „OC i badanie techniczne” (sprawa B), bo specyfikacja wymaga drogi do sprawy ze szczegółów dokumentu.
  - **Karta Dużej Rodziny:** „Rodzaj karty: Rodzic” jest w danych w szczegółach (z opisu „rodzic”), na samej karcie nie.
  - **Usunięty dokument** wraca po ponownym wyborze osoby; „Dodaj dokument” w prototypie otwiera okno „Niedostępne w prototypie”.
  - **Karta z przodu:** zostaje z przodu do końca wizyty (np. po powrocie ze szczegółów). Po odświeżeniu z przodu jest ostatni dokument z kolejności — domyślnie mDowód.
  - **Ola:** w szczegółach mLegitymacji jest przykładowy komunikat „Dokument wymaga potwierdzenia danych”, a karta na ekranie Dokumenty nadal mówi „Wszystko w porządku” (zgodnie ze specyfikacją).
  - **Czcionka z Google Fonts:** przy otwarciu aplikacji przeglądarka łączy się z serwerami Google, żeby pobrać czcionkę.
  - **Kod kreskowy** to ilustracja (paski ułożone z cyfr numeru albumu), nie prawdziwy kod do skanowania.
  - **Małe karty:** przy tekście Standardowym 2 kolumny, przy większym tekście lub 320 px — 1 kolumna.
  - **Dane wymyślone:** serie i numery dowodów (XYZ …), imiona rodziców, nazwiska rodowe, numer Karty Dużej Rodziny, numer albumu, daty wydania, daty ostatniej aktualizacji. Nowy kolor karty: zielony dla mLegitymacji emeryta-rencisty.

### 25.11.2026 Etap 2 — szkielet całej aplikacji
- Zrobione:
  - Cała aplikacja w stylu makiety: jasnoszare tło, białe powierzchnie, granatowy akcent, kolorowe tylko karty dokumentów. Pasek telefonu z prawdziwą godziną i baterią (w ramce telefonu na komputerze), nagłówek z „Dostosuj” i „Skrzynką” z licznikiem, dolny pasek jak w makiecie.
  - **Wejście:** wybór osoby (Halina, Tomasz, Ola; pod spodem „Prototyp konkursowy, dane fikcyjne”) → „Jak Ci wygodnie?” (rozmiar tekstu, motyw, tryb prosty, czytanie na głos; podgląd na żywo, zmiany działają od razu) → „Poznaj asystenta” („Zaczynam” otwiera Dokumenty z 3 gotowymi pytaniami pod polem asystenta, „Pomiń” — same Dokumenty).
  - **Dokumenty:** portfel kart jedna za drugą, mDowód z przodu w całości. Każdy pasek karty otwiera szczegóły dokumentu. Karta „Wymaga Twojej uwagi” zależna od osoby: Halina — nowe pismo (granat, prowadzi do pisma w Skrzynce), Tomasz — OC kończy się za 12 dni (czerwień, ikona ostrzeżenia), Ola — „Wszystko w porządku” (zieleń). Pole asystenta przypięte nad dolnym paskiem; po dotknięciu 3 gotowe pytania. Gdy coś wpiszesz, przycisk „Powiedz” zmienia się na „Wyślij”.
  - **Szczegóły dokumentu:** karta dokumentu i dane jako lista „etykieta — wartość”; „Pokaż kod QR” (okno „Niedostępne w prototypie”) i „Zgłoś utratę tego dokumentu” (otwiera sprawę A z zaznaczonym dokumentem). Moje pojazdy: OC i badanie techniczne ze statusem (ikona + słowo) i przycisk do sprawy B.
  - **Usługi:** wyszukiwarka (działa bez polskich znaków, po synonimach i odmianach, np. „zgubiłam dowód”, „ukradli portfel”, „Do kiedy mam OC?”); „Najczęstsze”; 7 sytuacji życiowych po 3–4 usługi z jednozdaniowym opisem; etykieta „Działa w prototypie” przy sprawach A i B. Gdy nic nie znajdzie: „Zapytaj asystenta” i przyciski działających spraw. W trybie prostym: same kategorie jako duże przyciski, usługi po wejściu w kategorię.
  - **Asystent** (pusty stan): „Nic nie wyśle bez Twojej zgody”, „W czym mogę pomóc?”, 4 podpowiedzi, „Zobacz wszystkie usługi”.
  - **Kod QR:** „Pokaż swój kod” i „Zeskanuj kod” — oba otwierają okno „Niedostępne w prototypie”.
  - **Więcej:** osoba, „Wygląd i dostępność” (ten sam panel co „Dostosuj”), „Zmień osobę”, „Pokaż wprowadzenie ponownie”, „O prototypie” z 3 wyróżnikami.
  - **Skrzynka:** wiadomości osoby; nowe z etykietą „Nowa” i pogrubione; po otwarciu wiadomość staje się przeczytana, a licznik w nagłówku maleje.
  - **Okno „Niedostępne w prototypie”:** nazwa usługi, „Działają:” + przyciski do spraw A i B, „Zamknij”.
  - **Sprawy A i B oraz rozmowa z asystentem:** prosty ekran „W budowie” (pokazuje zaznaczony dokument albo wpisane pytanie, żeby było widać, że droga działa).
  - **Motyw wysoki kontrast:** czarne tło, biały tekst, żółte przyciski, karty dokumentów jako czarne z białą ramką.
  - **Czytanie na głos:** po włączeniu przy tytule każdego ekranu jest „Przeczytaj” (czyta ekran polskim głosem; drugi raz — „Zatrzymaj”). Jeśli przeglądarka nie umie czytać, pokazuje okno z wyjaśnieniem.
  - Każdy ekran ma własny adres (`#/dokumenty`, `#/uslugi`, `#/dokument/dowod`…). Działają `?osoba=halina|tomasz|ola` (od razu Dokumenty tej osoby) i `?reset=1` (od początku). Ustawienia zapamiętywane w przeglądarce. „Wstecz” wraca do poprzedniego ekranu.
  - SPECYFIKACJA.md: wersja 2.1 z 5 decyzjami z makiety.
- Pliki: `index.html`, `style.css`, `app.js`, `dane.js` (nowe); `SPECYFIKACJA.md` (wersja 2.1); `warianty/dokumenty-1.html`, `dokumenty-2.html`, `dokumenty-3.html`, `dokumenty-wspolne.js`, `wyglad-1.js`, `wyglad-2.js`, `wyglad-3.js` → `warianty/archiwum/`; `warianty/porownanie.html` (poprawione ścieżki, nadal działa).
- Jak sprawdzić: dwuklik na `index.html` w folderze projektu. Na start wybór osoby. Szybkie wejście: dopisz do adresu `?osoba=tomasz` (albo `halina`, `ola`); od początku: `?reset=1`.
- Kontrola (według sekcji „Kontrola” specyfikacji; automatycznie, w przeglądarce opartej na Chrome):
  - 71 ekranów na zestaw (wszystkie ekrany dla trzech osób, w tym szczegóły każdego dokumentu, każda wiadomość, wyniki wyszukiwania, brak wyników, gotowe pytania pod polem asystenta, okno „Niedostępne”), z włączonym czytaniem na głos.
  - Szerokość 390 px (ramka telefonu): 3 rozmiary tekstu × 3 motywy + 3 zestawy z trybem prostym. Szerokość 320 px: 6 zestawów. Powiększenie 200% (640 × 360 px): 3 zestawy. Razem 21 zestawów — 0 błędów.
  - Najmniejszy tekst: 16 px. Najsłabszy kontrast tekstu: 5,1:1 (biała litera „m” w czerwonym znaku aplikacji); reszta wyżej.
  - Wszystkie elementy klikalne mają co najmniej 48 × 48 px (w portfelu: widoczna część paska karty), odstępy między nimi co najmniej 8 px.
  - Nic nie wychodzi poza ekran, tekst nie nachodzi na tekst, napisy nie są ucięte (także podpowiedzi w polach). Dolny pasek zawsze w jednym rzędzie, podpisy 16 px.
  - Każdy przycisk coś robi; każdy adres prowadzi do ekranu.
  - Działa po otwarciu z pliku (bez serwera): sprawdzone w Edge i Chrome.
  - Poprawione w trakcie: zdjęcie na karcie mDowodu rozciągało się przy dużym tekście; przy 320 px napis „Dokumenty” w dolnym pasku był o włos za szeroki, nagłówek zawijał się do dwóch linii, a pole asystenta wychodziło w bok; ucinała się podpowiedź w wyszukiwarce (teraz nad polem jest etykieta „Szukaj usługi”, a w polu „np. PESEL”); napis „Powiedz” był ściśnięty; okno „Niedostępne” pokazywało się w rogu zamiast na środku; za mały odstęp pod podpowiedziami na ekranie Asystent.
- Znane problemy / do decyzji:
  - **Reguła „bez przewijania”** (390 × 844, tekst Standardowy): u Tomasza i Oli (3 karty) widać mDowód, całą kartę „Wymaga Twojej uwagi” i pole asystenta, z zapasem 43 px. U Haliny (4 karty, jak w makiecie) karta uwagi wystaje 15 px pod pole asystenta; z jej trybem prostym — 35 px. Tak samo jest w samej makiecie. Nic nie ukryłem. Możliwe rozwiązania: krótszy tekst na karcie („Podatek od nieruchomości” w jednej linii) albo trochę niższe paski kart w portfelu.
  - **Czcionka:** makieta wymienia Atkinson Hyperlegible, ale jej nie wczytuje, więc na komputerze autorki wyświetla się czcionka systemowa (Segoe UI). Zrobiłem tak samo. Do decyzji: czy wczytywać Atkinson Hyperlegible z Google Fonts (wtedy aplikacja wygląda tak samo na każdym komputerze, ale potrzebuje internetu do czcionki).
  - **Wyszukiwarka:** tekst „Szukaj usługi, np. PESEL” rozdzielony na etykietę nad polem i podpowiedź „np. PESEL”, bo przy 320 px i dużym tekście się ucinał.
  - **Pasek telefonu** jest tylko w ramce na komputerze; na prawdziwym telefonie jest jego własny pasek.
  - **Pole asystenta** jest tylko na ekranach Dokumenty i Asystent (tak mówi specyfikacja). Przy wąskim ekranie i dużym tekście przycisk „Powiedz” przechodzi pod pole, żeby podpowiedź „Co chcesz załatwić?” była cała.
  - **Licznik Skrzynki** ma 16 px zamiast 14 px z makiety (zasada: nic poniżej 16 px).
  - **Dane wymyślone:** dokumenty osób (Tomasz: Skoda Octavia WX 4821K, prawo jazdy B, C, C+E; Ola: mLegitymacja studencka Uniwersytetu Gdańskiego, mPrawo jazdy), treść pism w Skrzynce (podatek 412 zł dla Haliny, przypomnienie o OC dla Tomasza, mLegitymacja dla Oli), lista 25 usług i ich opisy. Numery PESEL mają celowo błędną cyfrę kontrolną.
  - Każdy wybór osoby zaczyna od świeżej Skrzynki (wiadomości znów są nowe) — wygodne przy pokazywaniu jury.

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

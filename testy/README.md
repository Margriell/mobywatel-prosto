# Testy prototypu — jak je powtórzyć

Wszystkie testy z „wielkiego testu końcowego” (27.11.2026) są tu zapisane jako skrypty. Po każdej zmianie wyglądu albo treści można je powtórzyć **jednym poleceniem**. Wynik opisuje `RAPORT-TESTOW.md` w głównym folderze.

## Czego potrzeba

- **Node.js 22 lub nowszy** (https://nodejs.org — wersja „LTS”). Nic więcej nie trzeba instalować: testy nie używają żadnych dodatkowych pakietów.
- **Google Chrome albo Microsoft Edge** (testy same je znajdują; inna ścieżka: zmienna `CHROME`).

Testy otwierają przeglądarkę w tle (bez okna) i własny, mały serwer tylko na tym komputerze. Niczego nie wysyłają do internetu poza dwoma wyjątkami: czcionką Google Fonts (jak sama aplikacja) i sprawdzeniem publicznego adresu prototypu na GitHub Pages w Części 8.

## Jedno polecenie

W folderze projektu (np. w terminalu w GitHub Desktop: *Repository → Open in Command Prompt*):

```
node testy/uruchom.js
```

To uruchamia wszystkie części (ok. 25–35 minut). Krótsze warianty:

| Polecenie | Co robi | Czas |
| --- | --- | --- |
| `node testy/uruchom.js` | wszystko: części 0–8 i pełna „Kontrola” | ok. 30 min |
| `node testy/uruchom.js --szybko` | wszystko, ale „Kontrola” w okrojonej siatce (np. tylko jasny motyw) | ok. 20 min |
| `node testy/uruchom.js 4` | tylko asystent (zdania, złośliwe teksty) | ok. 20 s |
| `node testy/uruchom.js 1 2 3` | ścieżki, nawigacja, formularze | ok. 5 min |
| `node testy/uruchom.js kontrola` | tylko pełna „Kontrola” ze specyfikacji | ok. 15 min |

Na końcu w konsoli pojawia się podsumowanie: liczba przypadków, błędy według wagi, liczba sprawdzonych ekranów, najsłabszy kontrast i najmniejszy tekst.

## Gdzie są wyniki

- `testy/wyniki/raport.md` — raport z ostatniego uruchomienia: podsumowanie, przypadki z błędem (z wagą), wszystkie przypadki, tabela dotknięć do celu, tabela zdań asystenta.
- `testy/wyniki/wyniki.json` — to samo w formie danych.
- `testy/wyniki/teksty.txt` — wszystkie teksty aplikacji (ekrany i odpowiedzi asystenta) do przeczytania przez człowieka.

Folder `testy/wyniki/` nie trafia do GitHuba (jest w `.gitignore`) — zawsze można go odtworzyć poleceniem.

## Co sprawdza każda część

| Plik | Część | Co sprawdza |
| --- | --- | --- |
| `czesci/0-dotyk.js` | 0 — dotyk jak na telefonie | brak reakcji na najechanie myszką (każdy element na wszystkich ekranach, 3 motywy), reakcja na wciśnięcie, brak mignięcia, kursor „rączka”, widoczny fokus |
| `czesci/1-sciezki.js` | 1 — ścieżki użytkowników | sprawy A, B, C każdą drogą przez Halinę, Tomasza i Olę, szybkie sprawy i ogólne pytania, skutki spraw, liczba dotknięć do celu |
| `czesci/2-nawigacja.js` | 2 — nawigacja i stan | „Wstecz” i wstecz/dalej przeglądarki, odświeżanie, dziwne adresy i parametry, zmiana ustawień w trakcie, dwie karty, zablokowana pamięć, okno prywatne, ponowne sprawy, usunięcie dokumentów, szybkie i wielokrotne kliknięcia |
| `czesci/3-formularze.js` | 3 — dane w formularzach | puste pola, spacje, 5000 znaków, emoji, cyrylica, tekst od prawej do lewej, kody pocztowe, daty, kod HTML; komunikat przy polu z podpowiedzią |
| `czesci/4-asystent.js` | 4 — asystent „na złośliwca” | regresja (212 zdań), 94 nietypowe zdania, sprawdzian (40 zdań), ślepe zaułki, adresy przycisków, długość odpowiedzi, wstrzyknięcie kodu, szybkie wysyłanie, 50 wiadomości |
| `czesci/5-urzadzenia.js` | 5 — urządzenia | mały telefon, telefon poziomo, tablet, komputery i laptopy, klawiatura ekranowa, 200%, systemowy tryb ciemny, „ogranicz ruch”, bez Google Fonts |
| `czesci/6-dostepnosc.js` | 6 — dostępność | sprawy wyłącznie klawiaturą, widoczny fokus, okna (pułapka fokusu, Esc, powrót fokusu), nazwy dla czytnika ekranu, ogłaszanie |
| `czesci/7-tresc.js` | 7 — treść i jakość | typografia, formy neutralne płciowo, wołacz, spójne nazwy, martwe kliknięcia, wyjście z każdego ekranu, zapytania sieciowe, czas ładowania, rozmiar plików, błędy w konsoli |
| `czesci/8-zgodnosc.js` | 8 — konkurs | publiczny link w oknie prywatnym, licencje, brak zdjęć i godła, fikcyjne numery PESEL, podgląd linku, działanie z pliku (dwuklik) |
| `czesci/k-kontrola.js` | Kontrola | pełna „Kontrola” ze specyfikacji: 3 osoby × 3 rozmiary × 3 motywy przy 390 i 320 px, tryb prosty, 200%, ramka na komputerze; brak przewijania na Dokumentach; test zrozumienia asystenta |

Pomocnicze: `lib/` (sterowanie przeglądarką, serwer, sprawdzanie ekranu, trasa po ekranach), `zdania-regresja.json`, `zdania-nowe.js`, `zdania-sprawdzian.js` (zdania do asystenta z oczekiwanymi odpowiedziami), `pusta.html` (pusta strona pomocnicza).

## Gdy coś się zmieni w aplikacji

- **Zmiana tekstu przycisku** (np. „Dalej”): testy klikają po napisach — poprawić napis w `czesci/1-sciezki.js` albo `czesci/6-dostepnosc.js`.
- **Nowy ekran:** dopisać go do `lib/ekrany.js` (trasa po ekranach) — wtedy obejmą go testy dotyku, urządzeń i „Kontrola”.
- **Nowe zdania do asystenta:** dopisać do `zdania-nowe.js` z oczekiwaną sprawą; po świadomej zmianie odpowiedzi asystenta poprawić `zdania-regresja.json`.

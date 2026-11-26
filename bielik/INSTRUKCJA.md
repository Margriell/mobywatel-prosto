# Jak podłączyć model Bielik do asystenta — krok po kroku

Ta instrukcja jest dla osoby, która nie programuje. Zajmie około 30 minut.

**Nie musisz tego robić.** Bez modelu asystent działa na wbudowanych scenariuszach, także bez internetu. Model tylko lepiej rozumie nietypowe zdania.

## Jak to działa

```
Aplikacja  →  pośrednik (Cloudflare)  →  model Bielik u dostawcy
```

- Aplikacja wysyła pytanie osoby do **pośrednika**.
- Pośrednik dokłada tajny **klucz API** i przekazuje pytanie do modelu.
- Model zwraca tylko nazwę sprawy z naszej listy (albo „nie wiem”) i jedno życzliwe zdanie.
- Dalej zawsze prowadzą kroki aplikacji. Model niczego nie wysyła i nie podaje faktów.
- Gdy model nie odpowie w 6 sekund, aplikacja po cichu używa scenariuszy.

Pośrednik jest potrzebny, bo klucza API nie wolno wpisać do aplikacji — każdy mógłby go podejrzeć.

## Co musisz mieć

1. **Dostęp do Bielika przez API zgodne z OpenAI.** Od dostawcy (własny serwer albo usługa w chmurze) potrzebujesz trzech rzeczy:
   - **adres** modelu — zwykle kończy się na `/v1/chat/completions`,
   - **klucz API** — długi ciąg znaków, tajny jak hasło,
   - **nazwę modelu** — dokładnie tak, jak podaje dostawca.

   Jeśli nie wiesz, czy dostawca ma „API zgodne z OpenAI”, zapytaj go dokładnie tymi słowami.
2. **Darmowe konto w Cloudflare** — założysz je w kroku 1.

## Krok 1. Załóż konto w Cloudflare

1. Wejdź na stronę `cloudflare.com` i wybierz **Sign up**.
2. Podaj e-mail i hasło, potwierdź e-mail.
3. Plan darmowy wystarczy. Dzienny limit zapytań sprawdzisz w cenniku Cloudflare.

## Krok 2. Utwórz pośrednika (Worker)

1. W panelu Cloudflare wybierz z menu po lewej **Workers & Pages**.
2. Kliknij **Create** (Utwórz), potem **Create Worker**.
3. Wpisz nazwę, np. `mobywatel-bielik`, i kliknij **Deploy**.
4. Kliknij **Edit code** (Edytuj kod).
5. Zaznacz cały kod w edytorze (Ctrl+A) i usuń go.
6. Otwórz plik `bielik/worker.js` z tego folderu w Notatniku, zaznacz wszystko (Ctrl+A), skopiuj (Ctrl+C).
7. Wklej kod w edytorze Cloudflare (Ctrl+V) i kliknij **Deploy**.

## Krok 3. Wpisz ustawienia i klucz

1. Wróć do strony Workera i otwórz **Settings** → **Variables and Secrets**.
2. Kliknij **Add** i dodaj po kolei:

| Nazwa (wpisz dokładnie tak) | Typ | Wartość |
| --- | --- | --- |
| `ADRES_MODELU` | Text | adres modelu od dostawcy |
| `MODEL` | Text | nazwa modelu od dostawcy |
| `KLUCZ_API` | **Secret** | klucz API od dostawcy |
| `DOZWOLONE_ZRODLO` | Text | (nieobowiązkowe) adres Twojej strony, np. `https://twoja-nazwa.github.io` |

3. Kliknij **Deploy**, żeby zapisać.

Ważne: klucz zawsze jako **Secret**. Wtedy nikt go nie zobaczy, nawet w panelu.
Jeśli wpiszesz `DOZWOLONE_ZRODLO`, pośrednik zadziała tylko ze strony aplikacji (nie z pliku otwartego dwuklikiem).

## Krok 4. Sprawdź, czy działa

1. Skopiuj adres Workera z jego strony, np. `https://mobywatel-bielik.twoja-nazwa.workers.dev`.
2. Dopisz na końcu `/v1/chat/completions`.
3. Otwórz plik `bielik/test.html` w przeglądarce (dwuklik).
4. Wklej adres i kliknij **Sprawdź**.
5. Gdy zobaczysz „Działa!” i czas poniżej 6 sekund — gotowe.

Jeśli widzisz błąd:
- **500** — brakuje `ADRES_MODELU` albo `KLUCZ_API` (krok 3).
- **401 lub 403** — zły klucz API albo `DOZWOLONE_ZRODLO` nie pasuje.
- **404** — sprawdź, czy adres kończy się na `/v1/chat/completions`.

## Krok 5. Podłącz model do aplikacji

1. Otwórz plik `config.js` w Notatniku.
2. W linii `adres: ''` wpisz adres z kroku 4 między apostrofy:
   `adres: 'https://mobywatel-bielik.twoja-nazwa.workers.dev/v1/chat/completions'`
3. Zapisz plik.
4. Zapisz zmianę w GitHub Desktop (Commit, potem Push). Strona zaktualizuje się po kilku minutach.

Jak sprawdzić: zapytaj asystenta np. „straciłam wszystko z torebką”. Przy pracującym modelu pierwsze zdanie odpowiedzi napisze model.

## Jak wyłączyć model

W `config.js` zostaw pusty adres: `adres: ''`. Asystent wraca do scenariuszy.

## Koszty i prywatność

- Pytania osób trafiają do Cloudflare i do dostawcy modelu. W prototypie są tylko dane fikcyjne — nie wpisuj prawdziwych danych osobowych.
- Pośrednik przyjmuje tylko krótkie zapytania i ogranicza długość odpowiedzi, żeby obniżyć koszty.
- Koszt modelu zależy od dostawcy. Sprawdź jego cennik przed podłączeniem.

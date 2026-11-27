# Specyfikacja prototypu „mObywatel dla każdego”

Wersja 2.8 · 27.11.2026 · zastępuje wszystkie wcześniejsze wersje (2.1: decyzje z makiety ekranu Dokumenty; 2.2: dokumenty jak w prawdziwym mObywatelu; 2.3: asystent offline i sprawy A, B, C; 2.4: poprawki po teście, publikacja; 2.5: asystent zna wszystkie usługi i język ludzi, rezygnacja z modelu językowego; 2.6: nowocześniejsze karty dokumentów, czerwień marki; 2.7: zachowanie jak na telefonie — dotyk zamiast najechania myszką; 2.8: zasady wymuszone przez wielki test, drobne poprawki po teście, pakiet nowych spraw D–K i pisma jak prawdziwe)

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
| Co widać na starcie | Dokumenty | Dokumenty (nachodzące karty) | Dokumenty jako portfel kart: każda karta wygląda jak prawdziwy dokument i ma czytelny pasek z nazwą i statusem, mDowód z przodu w całości; dotknięcie karty z tyłu przesuwa ją na przód |
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

1. ~~Warianty ekranu startowego~~ — zakończony. **Wzór wyglądu i układu: `warianty/makieta-dokumenty.html`** (zatwierdzony przez autorkę; zastępuje kierunek B1) — kolory, czcionka, karty, nagłówek, dolny pasek, odstępy.
2. **Szkielet całej aplikacji:** wybór osoby, „Dopasuj do siebie”, motywy, ekran Dokumenty, Usługi, Asystent (pusty stan), Kod QR, Więcej/Ustawienia, Skrzynka, okno „Niedostępne w prototypie”.
3. **Asystent offline i sprawy A, B, C** (jeden etap): szkielet asystenta, sprawa A — zgubione dokumenty, sprawa B — samochód: OC i badanie techniczne, sprawa C — zameldowanie na pobyt stały, szybkie sprawy asystenta, test zdań. Każda sprawa dostępna kilkoma drogami (Usługi, asystent, szczegóły dokumentu, karta pilna).
4. ~~Sprawa B~~ — w etapie 3.
5. **Kontrola jakości i publikacja** (GitHub Pages).
6. ~~Sprawa C~~ — w etapie 3 (już nie opcjonalna).

7. **Pakiet scenariuszy (27.11.2026):** drobne poprawki po wielkim teście, pilne karty bez ślepego zaułka (płatność podatku), sprawy D–K (sekcja „Sprawy”), „Co mam do załatwienia?” ze wszystkimi sprawami osoby, pisma i wnioski wzorowane na prawdziwych usługach, rozpoznawanie i testy nowych spraw.

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
| Czcionka | Atkinson Hyperlegible wczytywana z Google Fonts; zapasowo czcionka systemowa — bez internetu aplikacja działa dalej |
| Motywy | Jasny (jak makieta: jasnoszare tło, białe powierzchnie, granatowy akcent), Ciemny, Wysoki kontrast. Wszystkie kolory jako zmienne CSS. W każdym motywie tekst min. 4,5:1, ikony i obramowania min. 3:1 |
| Kolory | Kolor mają tylko karty dokumentów. Reszta interfejsu jest spokojna: białe powierzchnie, jeden akcent (granat) — akcje. Czerwień — akcent marki (znak „mObywatel” i licznik nowych wiadomości przy „Skrzynce”), poza tym wyłącznie sprawy z terminem lub ryzykiem i błędy. Zieleń — sukces. Zawsze z ikoną i słowem |
| Przyciski | Min. 48 × 48 px, odstęp min. 8 px. Główny przycisk na całą szerokość, 56 px |
| Ikony | Zawsze z podpisem |
| Język | Zdania do 15 słów, na „Ty”, bez żargonu, formy neutralne płciowo |
| Układ | Jedna kolumna, naturalny przepływ, nic się nie nakłada, jednostki rem. Działa przy 320 px i powiększeniu 200%. Jedyny wyjątek: portfel kart dokumentów — karty leżą jedna za drugą, ale pasek każdej karty (nazwa i status) jest w całości widoczny i ma min. 48 px wysokości |
| Nawigacja | Dolny pasek widoczny poza krokami sprawy, zawsze na samym dole ekranu — na każdej zakładce, w każdym rozmiarze tekstu i motywie (przewija się tylko treść, nigdy cała ramka). Na każdym podekranie górny pasek z „Wstecz” (z napisem) i tytułem ekranu, przyklejony u góry — nie znika przy przewijaniu. W sprawach „Krok 2 z 4” |
| Czas i ruch | Brak limitów czasu i znikających komunikatów. Animacje subtelne, wyłączone przy „ogranicz ruch” (także błysk na karcie dokumentu, który dodatkowo nie działa w trybie wysokiego kontrastu) |
| Dotyk | Prototyp zachowuje się jak aplikacja na ekranie dotykowym. Nic nie reaguje na samo najechanie myszką (brak efektów `:hover` — przyciski, wiersze, karty, zakładki i podpowiedzi), także na komputerze. Informacja zwrotna dopiero w chwili dotknięcia albo kliknięcia (`:active`): lekkie przyciemnienie i zmniejszenie przycisku albo ciemniejsze tło wiersza. Bez niebieskiego mignięcia przy dotknięciu na Androidzie (`-webkit-tap-highlight-color: transparent`). Kursor „rączka” nad elementami klikalnymi zostaje. Widoczny fokus dla klawiatury (`:focus-visible`) zostaje zawsze |
| Kliknięcia | Podwójne (i potrójne) kliknięcie działa jak jedno: nie przeskakuje kroku, nie wysyła sprawy drugi raz i nie trafia w przycisk, który właśnie pojawił się w tym samym miejscu. Wysłanie sprawy działa tylko z ekranu potwierdzenia |
| Pamięć spraw w toku | Odświeżenie strony niczego nie gubi: odpowiedzi w sprawach w toku, rozmowa z asystentem i ekran Gotowe zostają do końca wizyty (pamięć karty przeglądarki). Wejście adresem w środek sprawy prowadzi do pierwszego niewypełnionego kroku z dopiskiem — nigdy do „Potwierdzam” ani fałszywego „Gotowe”. Dwie karty przeglądarki naraz widzą te same dane (zmiana osoby, wyglądu albo załatwiona sprawa w jednej karcie jest od razu w drugiej) |
| Czytniki ekranu | `lang="pl"`, nagłówki, etykiety pól, `aria-live` dla asystenta, pola wyboru ogłaszające zaznaczenie, widoczny fokus |
| Oznaczenia | Nazwa „mObywatel”. Ikona: czerwony kwadrat z zaokrąglonymi rogami i prostym białym znakiem własnego projektu — bez godła i oficjalnego logo. Informacja „Prototyp konkursowy, dane fikcyjne” tylko na ekranie wyboru osoby i w „Więcej”. Awatary z inicjałów (wybór osoby, Więcej); na kartach dokumentów ilustrowane portrety (nie zdjęcia prawdziwych osób) |

## Osoby (pokazują, że aplikacja jest dla młodych i starszych)

| Osoba | Ustawienia startowe | Dokumenty (dane fikcyjne) | Karta „Wymaga Twojej uwagi” |
| --- | --- | --- | --- |
| Halina, 71 lat, emerytka, pierwszy raz w aplikacji | Duży tekst, tryb prosty, jasny motyw | mDowód, mLegitymacja emeryta-rencisty (ZUS), Karta Dużej Rodziny (rodzic, ważna bezterminowo). Nie ma prawa jazdy ani pojazdów. Wdowa (akt zgonu męża w rejestrze) | Nowe pismo z Urzędu Miasta: decyzja o podatku od nieruchomości (kolor akcentu, etykieta „Nowe”, bez czerwieni) → Skrzynka → „Wytłumacz prostym językiem” → „Zapłać podatek” (sprawa D). Po zapłacie: „Podatek opłacony” |
| Tomasz, 38 lat, kierowca, tata trojga dzieci | Standardowy tekst, jasny motyw | mDowód, mPrawo jazdy, Moje pojazdy. Żona Marta, dzieci Jakub (9 lat) i Maja (6 lat); najmłodsza córka urodziła się 6 dni temu (karta urodzenia ze szpitala) | Dwie karty: OC kończy się za 12 dni (czerwień; data = dziś + 12 dni) → sprawa B; „Zgłoś urodzenie dziecka” (czerwień: termin 21 dni) → sprawa I, potem „Złóż wniosek o 800 plus” i „Karta Dużej Rodziny” |
| Ola, 24 lata, studentka | Standardowy tekst, ciemny motyw | mDowód, mLegitymacja studencka | „Dokończ zameldowanie” — zaczęta sprawa C, nowy adres już wpisany (kolor akcentu, bez czerwieni) → sprawa C. Po wysłaniu: „Wniosek o zameldowanie wysłany” |

Dane fikcyjne potrzebne asystentowi: adres zameldowania i lokal wyborczy każdej osoby; Tomasz — 4 punkty karne i 1 mandat (200 zł za przekroczenie prędkości), auto ubezpieczone w fikcyjnym towarzystwie; telefon do SMS-ów pokazany częściowo (np. +48 ••• ••• 412); urzędy w mieście osoby; akty stanu cywilnego (urodzenia, małżeństwa, zgonu) osoby i jej rodziny. Po załatwieniu sprawy może pojawić się kolejna karta (np. „Wizyta w urzędzie” po wniosku o dowód).

Gotowe pytania asystenta (3 pierwsze pod polem asystenta, 4 na pustym ekranie Asystenta), dopasowane do osoby:
- Halina: „Wytłumacz mi pismo”, „Czy ten SMS to oszustwo?” (wysyła przykładowy fałszywy SMS o dopłacie do paczki), „Gdzie użyć Karty Dużej Rodziny?”, „Zginął mi portfel”.
- Tomasz: „Do kiedy mam OC?”, „Ile mam punktów karnych?”, „Czy mam mandat do zapłaty?”, „Zginął mi portfel”.
- Ola: „Dokończ zameldowanie”, „Jaką zniżkę daje legitymacja?”, „Gdzie głosuję?”, „Czy mój PESEL jest zastrzeżony?”.

## Mapa aplikacji

- **Wejście** (pierwsze uruchomienie): Wybór osoby → Dopasuj do siebie → Poznaj asystenta (jeden ekran, można pominąć) → Dokumenty.
- **Pasek telefonu:** na górze ekranu godzina i bateria, żeby prototyp wyglądał jak prawdziwa aplikacja.
- **Nagłówek:** ikona + „mObywatel”, po prawej „Dostosuj” (ikona suwaków z podpisem; otwiera panel „Wygląd i dostępność”, ten sam co w Więcej) i „Skrzynka” (ikona z podpisem i licznikiem).
- **Podekrany:** górny pasek z „Wstecz” i tytułem, przyklejony u góry ekranu.
- **Pole asystenta** przypięte nad dolnym paskiem: pole „Co chcesz załatwić?” + przycisk „Powiedz” (jak u Cieszyńskiego). Po dotknięciu pola pokazują się 3 gotowe pytania dopasowane do osoby. Pytanie z pola przenosi do rozmowy na zakładce Asystent.
- **Dolny pasek:** Dokumenty (ekran startowy) · Usługi · Asystent · Kod QR · Więcej.
- **Do każdej sprawy prowadzą trzy drogi:** Usługi, asystent (pole przypięte na ekranie Dokumenty i zakładka), szczegóły dokumentu.
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

**4. Dokumenty (ekran startowy).** Wzór: `warianty/makieta-dokumenty.html`. Od góry:
1. Pasek telefonu (godzina, bateria), nagłówek (znak + „mObywatel”, „Dostosuj”, „Skrzynka” z licznikiem), powitanie „Dzień dobry, Halino”.
2. Nad portfelem przycisk „Zarządzaj” (ikona z podpisem) — ekran 5a.
3. Portfel kart ułożonych jedna za drugą (układ „Duże karty”): karty z tyłu pokazują czytelny pasek z nazwą i statusem. Z przodu, w całości, jest zawsze pierwszy dokument z kolejności ustawionej w „Zarządzaj” (domyślnie mDowód), tuż za nim drugi itd. Dotknięcie karty z tyłu pokazuje ją z przodu tylko chwilowo (płynna animacja, wyłączona przy „ogranicz ruch”): po wyjściu z ekranu Dokumenty i powrocie, a także po ponownym otwarciu aplikacji, z przodu jest znów pierwszy dokument. Paski kart z tyłu mają zawsze równą wysokość; długa nazwa zawija się albo ma krótszą wersję na karcie (np. „mLegitymacja emeryta”), pełna nazwa jest w szczegółach. Szczegóły otwiera dopiero przycisk na przedniej karcie. Dla czytnika ekranu każda karta z tyłu to przycisk „Pokaż [nazwa] na przodzie”. Wygląd kart — sekcja „Karty dokumentów”.
4. „Wymaga Twojej uwagi” — karty zależne od osoby (jedna albo kilka, najpilniejsza pierwsza); każda prowadzi do w pełni działającej ścieżki. Gdy nic nie czeka: „Wszystko załatwione”.
5. Pole asystenta przypięte nad dolnym paskiem („Co chcesz załatwić?” + „Powiedz”); po dotknięciu pola 3 gotowe pytania. Wcześniejszy blok asystenta pod kartą sprawy usunięty.
Przy tekście Standardowym na 390 × 844 bez przewijania widać mDowód, pierwszą kartę sprawy i pole asystenta (kolejne karty mogą być niżej). Jeśli się nie mieści — zapytaj autorkę, zanim coś ukryjesz.

**Karty dokumentów.** Każda karta wygląda jak prawdziwa plastikowa karta: jeden wspólny szablon, ale każdy dokument ma własny charakter. Nowocześnie, po swojemu — nie kopiujemy prototypu referencyjnego. Czytelność i kontrast min. 4,5:1 mają pierwszeństwo przed efektami (także w najjaśniejszym miejscu karty i podczas błysku).
- **Tło:** gradient w kolorze dokumentu (każdy dokument ma własny kolor i kierunek gradientu).
- **Wzór giloszowy:** inny układ cienkich linii dla każdego dokumentu — mDowód: rozeta i fale; mPrawo jazdy: koncentryczne kręgi; mLegitymacja studencka: siatka przeplatanych fal; mLegitymacja emeryta-rencisty: wstęgi; Karta Dużej Rodziny: splecione pierścienie; Moje pojazdy: szprychy koła i bieżnik.
- **Ikona dokumentu** w prawym górnym rogu, narysowana przez nas (bez godła i oficjalnych znaków): mDowód — tarcza z chipem, mPrawo jazdy — kierownica, mLegitymacja studencka — czapka absolwenta, mLegitymacja emeryta-rencisty — dłoń z sercem, Karta Dużej Rodziny — rodzina, Moje pojazdy — samochód.
- **„Zdjęcie”:** prosty, ilustrowany portret osoby w SVG (przyjazny, płaski styl, inny dla Haliny, Tomasza i Oli). Nie używamy zdjęć prawdziwych osób.
- **Głębia:** delikatny cień pod kartą i subtelny połysk krawędzi. Karta z przodu portfela co ok. 8 sekund dostaje delikatny przelatujący błysk — wyłączony przy „ogranicz ruch” i w trybie wysokiego kontrastu.
- **Pasek karty (nazwa, status, ikona):** ten sam układ na wszystkich kartach — z tyłu i z przodu, w szczegółach i w podglądzie. Tekst Standardowy: status zawsze po prawej od nazwy (długa nazwa zawija się w swojej kolumnie). Tekst Duży i Bardzo duży: status zawsze pod nazwą. Ikona zawsze w prawym górnym rogu.

Pola na kartach:
- mDowód: zdjęcie (portret), imię, nazwisko, data urodzenia, PESEL.
- mPrawo jazdy: zdjęcie, imię, nazwisko, kategorie, ważne do.
- mLegitymacja studencka: zdjęcie, imię, nazwisko, data urodzenia, PESEL, nazwa uczelni, numer albumu, data wydania, kod kreskowy.
- mLegitymacja emeryta-rencisty: zdjęcie, imię, nazwisko, PESEL, organ wydający (ZUS), ważność.
- Karta Dużej Rodziny: zdjęcie, imię, nazwisko, numer karty, ważna bezterminowo.
- Moje pojazdy: sylwetka auta w kolorze pojazdu zamiast zdjęcia, marka i model, numer rejestracyjny jako tablica w polskim stylu (białe tło, niebieski pasek z „PL”), OC ważne do, badanie techniczne do (u Tomasza ostrzeżenie o OC).

**5. Szczegóły dokumentu** (jak w mObywatelu). Na górze podgląd karty, pod nim sekcja „Dane”, ostatnia aktualizacja, a potem akcje. Akcje spoza prototypu otwierają okno „Niedostępne w prototypie”.
- mDowód — Dane: seria i numer dowodu, termin ważności, data wydania, imię ojca, imię matki, rozwijane „Twoje dodatkowe dane”, ostatnia aktualizacja. Akcje: „Potwierdź swoje dane osobiste”, „Dane dowodu osobistego”. „Pozostałe skróty”: Zastrzeż PESEL, Zgłoś utratę dowodu (→ sprawa A), Mandaty, Wybory, Usuń dokument.
- mLegitymacja studencka — dane z karty, numer albumu, kod kreskowy, ostatnia aktualizacja, przykładowy komunikat („Dokument wymaga potwierdzenia danych”). Akcje: „Bezpieczny autobus”, „Usuń dokument”.
- Pozostałe dokumenty analogicznie, tylko z danymi z karty (sekcja „Karty dokumentów”).

**5a. Zarządzaj** (jak w mObywatelu; otwiera go przycisk nad portfelem).
- Kolejność dokumentów: przyciski „W górę” / „W dół” przy każdym dokumencie (bez przeciągania — łatwiej dla seniorów). Dopisek: „Pierwszy dokument z listy będzie zawsze na przodzie”. Kolejność decyduje o wszystkich układach: w „Duże karty” pierwszy jest z przodu portfela, w „Małe karty” i „Lista” pierwszy jest na górze.
- Usuń dokument (z potwierdzeniem).
- Wybierz układ: Duże karty (portfel), Małe karty, Lista. Każdy układ spełnia zasady projektowe (tekst min. 16 px, przyciski min. 48 px).
- Dodaj dokument: lista dokumentów dostępnych w mObywatelu, m.in. mLegitymacja szkolna, studencka, doktoranta, emeryta-rencisty, osoby niepełnosprawnej, Karta Dużej Rodziny, legitymacja ulgowych usług transportowych, legitymacje zawodowe (adwokacka, radcy prawnego, PWZ lekarza, pielęgniarki i położnej, farmaceuty, fizjoterapeuty, nauczyciela i inne). Wybór otwiera okno „Niedostępne w prototypie”.
- Kolejność i układ zapamiętują się.

**6. Usługi.** Wyszukiwarka u góry („Szukaj usługi, np. PESEL”; działa bez polskich znaków i po synonimach). Potem „Najczęstsze” (3–4 usługi), potem wszystkie usługi według sytuacji życiowych: Dokumenty i tożsamość, Samochód, Mieszkanie, Rodzina, Zdrowie, Podatki, Bezpieczeństwo — w każdej 3–6 usług z jednozdaniowym opisem, np. „Zastrzeż PESEL — nikt nie weźmie kredytu na Twoje dane”. Usługi działające w prototypie mają etykietę „Działa w prototypie”. W trybie prostym: tylko kategorie jako duże przyciski, usługi po wejściu w kategorię.

**7. Asystent.** Góra: „Asystent · nic nie wyśle bez Twojej zgody”. Pusty stan: „W czym mogę pomóc?”, 4 podpowiedzi osoby, link „Zobacz wszystkie usługi”. Rozmowa: dymki „Ty” i „Asystent”; przy każdej odpowiedzi „Przeczytaj na głos”; na dole „Nowa rozmowa”. Rozmowa trwa do końca wizyty (zmiana osoby zaczyna nową). Zachowanie — sekcja Asystent.

**8. Kod QR.** Dwa duże przyciski: „Pokaż swój kod” i „Zeskanuj kod” — oba otwierają okno „Niedostępne w prototypie”.

**9. Więcej.** Wygląd i dostępność (te same ustawienia co ekran 2), Zmień osobę, Pokaż wprowadzenie ponownie, O prototypie („Prototyp konkursowy, dane fikcyjne” + 3 wyróżniki w trzech zdaniach).

**10. Skrzynka.** Lista wiadomości; nowe oznaczone słowem „Nowa” i pogrubieniem. Po zakończeniu sprawy pojawia się potwierdzenie (z numerem sprawy, adresatem i datą), a dokumenty z urzędu (np. odpis aktu) jako osobne wiadomości. Pismo, które asystent umie wyjaśnić, ma przycisk „Wytłumacz prostym językiem”. Pismo z płatnością ma status (ikona + słowo): „Do zapłaty: 412 zł”, „Opłacone częściowo…”, „Opłacone”; po zapłacie znika przycisk „Zapłać”.

**Pisma i wnioski jak prawdziwe** (wzór: usługi gov.pl i mObywatela): rodzaj pisma („Decyzja”, „Potwierdzenie”, „Odpis”, „Umowa”), metryczka (organ, znak sprawy, data), te same nazwy pól, kolejność danych, nazwy urzędów i rejestrów, typowe sformułowania i pouczenie. Gdy nie ma pewności co do przepisu lub terminu — ogólnie, bez wymyślania. Treść pisma może być urzędowa; wyjaśnienie prostym językiem daje asystent.

**11. Potwierdzenie** (wspólne). „Sprawdź, zanim wyślemy”: „Co zrobimy” i „Twoje dane”. „Potwierdzam i wysyłam” / „Wróć i popraw”. Potem „Potwierdź odciskiem palca lub PIN-em” z przyciskiem „Potwierdź (w prototypie wystarczy kliknąć)”.

**12. Gotowe** (wspólne). Ikona sukcesu, jedno zdanie, „Co dalej”, „Potwierdzenie jest w Skrzynce”, „Wróć do Dokumentów”.

**13. Niedostępne w prototypie** (okno). „Tej usługi nie ma jeszcze w prototypie. Działają:” + przyciski do 4 głównych spraw + „Wszystkie działające sprawy w Usługach” + „Zamknij”.

## Sprawy

Wszystkie sprawy: „Krok X z N” z paskiem postępu, „Wstecz” na każdym kroku, dolny pasek ukryty w krokach. Gdy kroki otwiera asystent, odpowiedzi z rozmowy są już zaznaczone i widać dopisek „Zaznaczyliśmy odpowiedzi z rozmowy z asystentem. Sprawdź je.” Na ekranie Gotowe „Wstecz” prowadzi do Dokumentów.

**Zasada dla wszystkich nowych spraw:** każda dostępna i przez asystenta, i ręcznie przez Usługi; widoczne kroki z licznikiem „Krok X z N”; podsumowanie i potwierdzenie przed wysłaniem (odcisk palca / PIN); ekran Gotowe; wiadomość w Skrzynce. Obowiązuje wszystko, co naprawiły testy (podwójne kliknięcie, pamięć spraw w toku, bezpieczne wyświetlanie tekstu użytkownika, fokus w oknach, brak efektów po najechaniu myszką). Osoba, której sprawa nie dotyczy (np. Halina bez auta przy stłuczce), dostaje uprzejmą informację i przyciski dalej — nigdy ślepy zaułek. Płatności, skanowanie kodów i zdjęcia są w prototypie udawane: nie wpisuje się danych karty ani logowania. Dane (kwoty, numery, daty, adresy) są fikcyjne; fakty prawne — ogólne albo powszechnie znane i pewne.

**A. Zgubione dokumenty** (4 kroki). Drogi: Usługi („Zgłoś utratę lub kradzież dokumentów”, „Zastrzeż PESEL”), szczegóły mDowodu („Zgłoś utratę dowodu”, „Zastrzeż PESEL”), asystent.
1. **Co zginęło?** Pola wyboru: dokumenty z portfela danej osoby (Dowód osobisty, Prawo jazdy, legitymacje, Karta Dużej Rodziny), Karty płatnicze, Inne dokumenty. Pod spodem „Nic nie zginęło? Zastrzeż tylko PESEL” (od razu krok 2).
2. **Co zrobimy.** Lista działań z przełącznikiem i jednym zdaniem wyjaśnienia: unieważnimy dowód (znacznik „Na stałe”: tego nie da się cofnąć, nawet gdy dowód się znajdzie); zastrzeżemy PESEL (znacznik „Można cofnąć”: nikt nie weźmie kredytu na Twoje dane, cofniesz to w każdej chwili); zgłosimy utratę prawa jazdy. Gdy sprawę otwiera asystent, zaczyna się od tego kroku (krok 1 był w rozmowie), a u góry jest „Zginęło: … — Zmień”. „Tego nie zrobimy za Ciebie”: karty płatnicze — przycisk „Zadzwoń i zastrzeż karty: 828 828 828”; legitymacje i Karta Dużej Rodziny — gdzie zgłosić utratę (uczelnia, ZUS, urząd, który wydał kartę).
3. **Potwierdzenie.**
4. **Gotowe.** „Twój dowód jest unieważniony, a PESEL zastrzeżony.” Co dalej (wszystko działa): „Złóż wniosek o nowy dowód osobisty” (sprawa F), „Dowód się znalazł”, „Jak cofnąć zastrzeżenie PESEL” (sprawa G), zastrzeżenie kart. Skutki: mDowód ma status „Unieważniony”, asystent wie, że PESEL jest zastrzeżony.
5. **„Dowód się znalazł”** (ekran sprawy A, także w szczegółach mDowodu i u asystenta): dowód unieważniony — „Unieważnionego dowodu nie da się przywrócić” + „Złóż wniosek o nowy dowód”; tylko zastrzeżony PESEL — „Cofnij zastrzeżenie PESEL” (sprawa G); nic nie zgłoszono — „Twój dowód jest ważny”.

**B. OC i badanie techniczne** (3 kroki; jedna nazwa w całej aplikacji). Drogi: karta pilna Tomasza, Moje pojazdy, Usługi, asystent. Sprawa nic nie wysyła do urzędu, więc nie ma kroku potwierdzenia.
1. **Mój samochód.** Marka, numer rejestracyjny. „OC ważne do [dziś + 12 dni] — zostało 12 dni” (ostrzeżenie), „Badanie techniczne ważne do 14.05.2027” (w porządku).
2. **Przypomnienie.** „Przypomnij mi 7 dni przed terminem”: o czym (koniec OC, badanie techniczne) i jak (powiadomienie w aplikacji lub SMS).
3. **Gotowe.** „Przypomnienie ustawione”, daty przypomnień, wiadomość w Skrzynce.
Osoba bez auta: „Nie masz zarejestrowanego pojazdu w aplikacji” + link do Usług (Samochód).

**C. Zameldowanie na pobyt stały** (5 kroków). Drogi: karta pilna Oli „Dokończ zameldowanie”, Usługi, asystent.
1. **Adres:** ulica i numer domu, numer mieszkania (jeśli jest), kod pocztowy, miejscowość. U Oli adres jest już wpisany.
2. **Od kiedy:** „Od dziś” albo „Od innego dnia” + data.
3. **Podstawa:** właściciel lub współwłaściciel / wynajem (w prototypie bez załączania umowy).
4. **Potwierdzenie** — przy każdej odpowiedzi „Zmień”.
5. **Gotowe:** „Wysłaliśmy wniosek o zameldowanie do urzędu gminy.” Co dalej: urząd sprawdzi wniosek, odpowiedź w Skrzynce.
Błędy przy polu, z ikoną i podpowiedzią, jak poprawić — nigdy tylko czerwona ramka (np. ulica bez numeru, kod pocztowy bez 5 cyfr, data nieistniejąca, z przyszłości albo sprzed urodzenia osoby). „m. 5”, „lok. 5” i „/5” w numerze mieszkania aplikacja poprawia sama na „5”. Wklejony adres z kilku linijek rozdziela się na pola (ulica, mieszkanie, kod, miejscowość); wklejony tekst nigdy nie skleja słów. Po wysłanym wniosku krok 1 mówi: „Wniosek o zameldowanie wysłano [data]. Możesz wysłać nowy, jeśli znów się przeprowadzasz.”

**D. Zapłać podatek / Zapłać mandat** (4 kroki; Halina — podatek od nieruchomości z decyzji w Skrzynce, Tomasz — mandat). Drogi: karta pilna Haliny → pismo → „Wytłumacz prostym językiem” → „Zapłać podatek”; przycisk „Zapłać podatek” w piśmie; Usługi (Podatki: Podatek od nieruchomości; Samochód: Mandaty i punkty karne); asystent („zapłać podatek”, „zapłać mandat”).
1. **Do zapłaty:** podsumowanie (urząd, tytuł, znak sprawy, kwota) i wybór: całość albo najbliższa rata (kwota, termin). 2. **Jak zapłacisz:** BLIK / karta / szybki przelew — udawane, bez wpisywania danych. 3. **Sprawdź, zanim zapłacimy** → „Potwierdzam i płacę” → „Potwierdź płatność odciskiem palca lub PIN-em”. 4. **Gotowe:** „Zapłacono 103 zł.”, numer potwierdzenia, ile zostało; potwierdzenie płatności w Skrzynce; pismo dostaje status „Opłacone” (albo „Opłacone częściowo”). Opłacone: krok 1 mówi „Ten podatek jest już opłacony”.

**E. Zgłoś stłuczkę (mStłuczka)** (7 kroków; Tomasz). Drogi: asystent („stłuczka”, „kolizja”, „ktoś mi wjechał”, „uderzyłem w auto na parkingu”, „wypadek”…), Usługi → Samochód, szczegóły Moich pojazdów.
1. **Czy ktoś jest ranny?** Tak → ekran „Zadzwoń pod 112” (duży komunikat, przycisk 112); Nie → dalej. 2. **Uczestnicy:** Twoje auto z Moich pojazdów (z OC) + drugi kierowca przez udawane zeskanowanie kodu z jego mObywatela. 3. **Kto spowodował:** ja / drugi kierowca / nie jesteśmy zgodni → ekran „Wezwij policję” (112). 4. **Okoliczności:** lista (najechanie na tył, zmiana pasa, cofanie, wyjazd z parkingu, pierwszeństwo, drzwi, „Inaczej — opiszę”) + własny opis + miejsce. 5. **Zdjęcia uszkodzeń:** 3 udawane zdjęcia. 6. **Sprawdź oświadczenie** (ze „Zmień”). 7. **Gotowe:** oświadczenie w Skrzynce; poszkodowany dostaje „Zgłoś szkodę ubezpieczycielowi sprawcy” (sprawa E2: sposób rozliczenia → sprawdź → Gotowe z numerem szkody → Skrzynka). Osoba bez auta: pytanie o rannych, potem uprzejma informacja.

**F. Wniosek o dowód osobisty** (5 kroków). Drogi: Gotowe sprawy A, szczegóły unieważnionego mDowodu, „Dowód się znalazł”, Usługi, asystent. 1. **Powód** (po zgłoszeniu utraty zaznaczony). 2. **Urząd** (dowolny urząd gminy). 3. **Termin wizyty** + przypomnienie dzień wcześniej. 4. **Sprawdź:** „Na wizycie”: urzędnik pobierze odciski palców, zdjęcie 35 × 45 mm, odbiór osobiście. 5. **Gotowe:** „Wizyta umówiona: [data, godzina]”, wiadomość w Skrzynce, karta „Wizyta w urzędzie”.

**G. Cofnij zastrzeżenie PESEL** (3 kroki). Drogi: „Dowód się znalazł”, Gotowe sprawy A, asystent, Usługi → Bezpieczeństwo. 1. **Na jak długo:** na stałe albo do wybranego dnia (potem zastrzeżenie wraca samo); ostrzeżenie o ryzyku. 2. **Sprawdź.** 3. **Gotowe** + Skrzynka. Gdy PESEL nie jest zastrzeżony — informacja i „Zastrzeż PESEL”.

**H. Sprawdź auto przed zakupem** (5 kroków; asystent: „kupuję auto”, „sprawdź samochód przed kupnem”, „historia pojazdu”; Usługi → Samochód). 1. **Dane pojazdu:** numer rejestracyjny, VIN (17 znaków, bez I, O, Q), data pierwszej rejestracji — albo udawane „Zrób zdjęcie dowodu rejestracyjnego”. 2. **Historia pojazdu** (przykładowy raport z CEP): właściciele, OC, badanie, szkoda, kradzież, odczyty licznika i ostrzeżenie „Uwaga: niezgodny przebieg”. Obok: **„Ile zapłacę podatku PCC?”** (2% wartości, przykład na fikcyjnej cenie, 14 dni, deklaracja PCC-3) i „Przygotuj umowę kupna-sprzedaży”. 3. **Umowa:** sprzedający (udawane zeskanowanie kodu), cena, przebieg. 4. **Sprawdź umowę.** 5. **Gotowe:** umowa w Skrzynce (strony, przedmiot, cena, oświadczenia), PCC w 14 dni, rejestracja w 30 dni.

**I. Zgłoś urodzenie dziecka** (4 kroki; karta pilna Tomasza, Usługi → Rodzina, asystent). 1. **Imię dziecka** (najwyżej dwa imiona). 2. **Dane z karty urodzenia** (data, szpital, płeć, nazwisko), rodzice, adres zameldowania dziecka. 3. **Sprawdź.** 4. **Gotowe:** numer PESEL dziecka, w Skrzynce potwierdzenie i odpis zupełny aktu urodzenia z USC; Co dalej: 800 plus i Karta Dużej Rodziny.
**I2. Rodzina 800 plus** (4 kroki): dziecko → wypłata i oświadczenie → sprawdź → Gotowe (wniosek do ZUS). **I3. Karta Dużej Rodziny** (4 kroki): kto dostanie kartę → rodzaj karty → sprawdź → Gotowe (wniosek do gminy). Bez zgłoszonego urodzenia albo bez dzieci — informacja, co zrobić najpierw.

**J. Zgłoś oszustwo do CERT Polska** (4 kroki). Po ostrzeżeniu o fałszywym SMS-ie (albo telefonie) asystent pyta: „Czy wpisano na tej stronie dane karty albo hasło?” → Tak: zastrzeż kartę (828 828 828, bank, zmiana hasła); w obu przypadkach karta „Zgłoś do CERT Polska” + przypomnienie o przesłaniu SMS-a na 8080. Kroki: co się stało (SMS / e-mail / telefon / strona + treść) → czy podano dane → sprawdź → Gotowe. Także Usługi → Bezpieczeństwo.

**K. Odpis aktu stanu cywilnego** (6 kroków; Usługi → Rodzina, asystent). Rodzaj aktu (urodzenia / małżeństwa / zgonu) → czyj (akty osoby i jej rodziny z rejestru; brak — informacja o interesie prawnym) → rodzaj odpisu (skrócony / zupełny / wielojęzyczny) → cel i odbiór (elektronicznie do Skrzynki) → sprawdź → Gotowe; odpis przychodzi do Skrzynki jako osobna wiadomość z USC.

## Asystent

**Zasada: „AI rozumie, aplikacja prowadzi”.** Asystent rozpoznaje sprawę i odpowiada krótko, po ludzku. Działania (wysłanie, zastrzeżenie, zgłoszenie) zawsze idą przez widoczne kroki z potwierdzeniem — te same co z Usług. Asystent nie wymyśla faktów prawnych, kwot ani zniżek, jeśli nie ma pewności: mówi ogólnie. Konkretne dane (kwoty, terminy, numery) mają tylko fikcyjne osoby.

Rozpoznaje sprawę, zadaje najwyżej 1–2 pytania i przekazuje do tych samych widocznych kroków co Usługi, z wypełnionymi odpowiedziami. Obok zawsze „Wolę przejść krok po kroku sam(a)”.

- **Trudne pytania** (z wielkiego testu): polityka — neutralnie, bez opinii („Nie doradzam, na kogo głosować — to Twoja decyzja”) + „Gdzie głosuję?”; dane innej osoby — odmowa („Pokazuję tylko Twoje dane”); obelgi — spokojnie, bez powtarzania („Przykro mi, że coś poszło nie tak”) + sprawy; inny język — informacja po polsku i po angielsku albo ukraińsku.
- **Nowe sprawy w asystencie:** stłuczka (najpierw „Czy ktoś jest ranny?”), kupno auta (historia pojazdu, PCC), urodzenie dziecka, 800 plus, Karta Dużej Rodziny, wniosek o dowód, dowód się znalazł / cofnięcie zastrzeżenia PESEL, zgłoszenie do CERT Polska, odpis aktu, zapłata podatku i mandatu. Każda ma co najmniej 15 sprawdzonych sformułowań (potoczne, literówki, bez polskich znaków, z mowy).
- Działa bez internetu i bez serwera. Każda sprawa to jeden wpis w jednym miejscu w `asystent.js`: słowa kluczowe, odpowiedź, przyciski, dokąd prowadzi. Całe rozpoznawanie w jednej funkcji `rozpoznajSprawe(tekst)`, wyłącznie na scenariuszach — bez modelu językowego (autorka zrezygnowała z niego 26.11.2026).
- Tekst bez polskich znaków i małymi literami, z tolerancją literówek (1 literówka w słowach od 5 liter, 2 od 8 liter); szerokie listy słów: A — zgubić, ukradli, kradzież, portfel, torebka, dowód, zastrzec, PESEL, karta; B — OC, ubezpieczenie, przegląd, badanie, samochód, auto; C — meldunek, zameldować, przeprowadzka, nowy adres. Gdy żadna sprawa nie pasuje, asystent szuka w liście Usług.
- Gdy nie rozumie: „Nie rozumiem jeszcze tej prośby. Mogę pomóc w tych sprawach:” + przyciski działających spraw + „Zobacz wszystkie usługi”. Nigdy „tego nie załatwię”.
- Najwyżej 2 krótkie zdania na wiadomość, jedno pytanie naraz, każda wiadomość kończy się przyciskami następnego kroku albo kartą sprawy („Zacznij” / „Wolę przejść krok po kroku sam(a)”). Wybór wielu opcji jako pola wyboru. Przy każdej odpowiedzi „Przeczytaj na głos” (głosy systemu — działa bez internetu). „Powiedz” używa rozpoznawania mowy w przeglądarce (Chrome, Edge) i **nigdy nie milczy**: podczas nagrywania nad polem jest „Słucham… Powiedz, co chcesz załatwić.”, a przy błędzie zawsze jasny komunikat — brak dostępu do mikrofonu: „Zezwól na mikrofon w ustawieniach przeglądarki”; nic nie usłyszano: „Nic nie słychać — spróbuj jeszcze raz” (forma neutralna); brak mikrofonu; brak internetu: „Mówienie wymaga internetu…”; przeglądarka bez obsługi mówienia (np. Opera, Firefox) albo taka, która nie zacznie słuchać w 5 sekund: „Ta przeglądarka nie obsługuje mówienia. Wpisz pytanie albo otwórz aplikację w Chrome lub Edge.”
- Szybkie sprawy (odpowiedź 1–2 zdania + przycisk do właściwego ekranu lub danych): wytłumacz pismo (od kogo, ile, do kiedy, co zrobić; „Pokaż pismo”, „Jak zapłacić?”), czy ten SMS to oszustwo (3 znaki rozpoznawcze, czego nie robić, przekazanie SMS-a na 8080), pokaż dowód / kod QR, ważność dokumentu, punkty karne, mandat do zapłaty, gdzie głosuję, zniżki z legitymacji (ogólnie, bez liczb), gdzie użyć Karty Dużej Rodziny (ogólnie), czy PESEL jest zastrzeżony (+ „Zastrzeż PESEL”). Gdy osoba nie ma dokumentu, o który pyta — uprzejma informacja i co może zrobić.
- **Asystent zna wszystkie usługi** z zakładki Usługi: każda ma wpis w `asystent.js` (słowa kluczowe i synonimy + jedno zdanie, czym jest usługa — ogólnie, bez kwot i terminów — + przycisk „Otwórz usługę”; niedziałające otwierają okno „Niedostępne w prototypie” z listą działających spraw).
- **Język ludzi:** asystent rozumie długie, grzeczne zdania („Dzień dobry, chciałabym zapytać, co mam zrobić, bo zgubiłam…”), potoczne słowa i zdrobnienia (dowodzik, portfelik, autko, legitka, ubezpieczenie od auta, meldunek, przeprowadzka, ściema), literówki, brak polskich znaków oraz tekst z rozpoznawania mowy (bez interpunkcji i wielkich liter, np. „o ce” zamiast „OC”).
- **Dwie sprawy w jednym zdaniu** („zgubiłam portfel i nie wiem co z OC”): asystent zaczyna od pilniejszej (najpierw zgubione dokumenty i PESEL, potem SMS-y, OC, mandaty, pisma, zameldowanie), a drugą proponuje od razu przyciskiem „Druga sprawa: …”.
- Ogólne pytania: „Co mam do załatwienia?”, „Jakie mam sprawy?”, „Czy coś na mnie czeka?” → wszystkie sprawy osoby: karty „Wymaga Twojej uwagi”, mandat do zapłaty i nieprzeczytane wiadomości, każda z działającym przyciskiem; „Jakie mam dokumenty?” → dokumenty z portfela (w kolejności) z przyciskami; „Co umiesz?”, „W czym mi pomożesz?”, „Pomoc” → krótko, co asystent potrafi, + przyciski spraw; „Mam nowe wiadomości?” → nieprzeczytane wiadomości z przyciskami; „Dziękuję”, „Dzień dobry” → krótka, życzliwa odpowiedź + podpowiedzi.

## Technika

- Zwykłe HTML, CSS, JavaScript, bez frameworków i budowania. **Wszystko działa po otwarciu `index.html` dwuklikiem (bez serwera) i na GitHub Pages** — bez iframe i bez wczytywania lokalnych plików przez fetch. **Wszystko działa bez internetu** (z internetu korzysta tylko czcionka — bez niego jest systemowa — oraz, w niektórych przeglądarkach, rozpoznawanie mowy „Powiedz”).
- Pliki: `index.html`, `style.css`, `app.js` (szkielet, sprawy A, B, C i wspólny mechanizm kroków), `sprawy.js` (sprawy D–K: jeden wpis na sprawę), `dane.js`, `asystent.js`, `media/` (ikona, obrazek podglądu linku), `README.md`, `testy/` (testy do powtórzenia: `node testy/uruchom.js`).
- Każdy ekran ma własny adres (`#/dokumenty`, `#/uslugi`, `#/sprawa/zgubione/krok-2`). Parametry: `?osoba=halina`, `?reset=1`.
- Ustawienia zapamiętywane w localStorage (w try/catch); aplikacja działa także bez niego.
- Na komputerze aplikacja w ramce telefonu na środku ekranu — od 481 px wysokości okna (i od ok. 500 px szerokości), więc także na typowych laptopach; na telefonie (także poziomo) na pełnym ekranie. Na Androidzie aplikacja kurczy się nad klawiaturą ekranową.
- Ikony: Lucide (licencja ISC), wklejone jako SVG.
- **Publikacja na GitHub Pages:** `index.html` w głównym folderze, wszystkie ścieżki względne, pusty plik `.nojekyll`. Tytuł strony „mObywatel dla każdego — prototyp konkursowy”, opis strony, ikona w karcie przeglądarki (czerwony kwadrat z białym „m”), podgląd linku Open Graph (tytuł, opis, obrazek 1200 × 630 z ekranem Dokumenty). README.md po polsku. Folder `warianty/` zostaje jako dokumentacja procesu, ale aplikacja do niego nie linkuje.

## Kontrola (po każdym etapie)

Sprawdź w trzech rozmiarach tekstu, trzech motywach i przy 320 px:
- brak tekstu poniżej 16 px; kontrast tekstu min. 4,5:1 w każdym motywie;
- wszystkie elementy klikalne min. 48 px;
- nic się nie nakłada i nie wychodzi poza ekran, także przy powiększeniu 200%;
- każdy przycisk coś robi (nie ma martwych kliknięć);
- działa po otwarciu dwuklikiem;
- asystent: test zrozumienia — co najmniej 150 zdań (zwykłe, seniorskie, potoczne, z literówkami, „z mowy”, dwie sprawy, nie na temat) dla wszystkich trzech osób: % poprawnie rozpoznanych zdań na temat, liczba dobrych odpowiedzi „nie rozumiem + co umiem” dla zdań nie na temat, 0 ślepych zaułków; każda sprawa przejdzona każdą drogą.

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

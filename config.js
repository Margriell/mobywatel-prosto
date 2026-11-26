/* =====================================================================
   mObywatel dla każdego — ustawienia asystenta.

   Model językowy (np. Bielik) jest NIEOBOWIĄZKOWY.
   - Pusty adres (tak jest teraz): asystent działa na wbudowanych scenariuszach,
     bez internetu i bez serwera.
   - Wpisany adres: asystent najpierw pyta model, którą sprawę ma na myśli osoba.
     Model zwraca tylko identyfikator sprawy z naszej listy (albo „nie wiem”)
     i jedno krótkie, życzliwe zdanie. Dalej zawsze prowadzą nasze kroki.
     Gdy model nie odpowie w czasie z „limitCzasu”, asystent po cichu wraca
     do scenariuszy — osoba nic nie zauważa.

   Adres to pośrednik z folderu bielik/ (ukrywa klucz API).
   Jak go uruchomić — bielik/INSTRUKCJA.md.
   ===================================================================== */
window.KONFIGURACJA = {
  model: {
    /* np. 'https://mobywatel-bielik.twoja-nazwa.workers.dev/v1/chat/completions' */
    adres: '',
    /* nazwa modelu przekazywana pośrednikowi (pośrednik może ją zmienić) */
    nazwa: 'bielik',
    /* ile milisekund czekać na model, zanim asystent użyje scenariuszy */
    limitCzasu: 6000
  }
};

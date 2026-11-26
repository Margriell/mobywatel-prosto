/* =====================================================================
   mObywatel dla każdego — pośrednik do modelu językowego (np. Bielik).
   Cloudflare Worker. Przyjmuje zapytania w formacie API OpenAI
   (POST /v1/chat/completions) i przekazuje je do modelu.

   Po co pośrednik? Klucz API do modelu musi być tajny. Gdyby był w aplikacji,
   każdy mógłby go podejrzeć. Aplikacja zna tylko adres pośrednika,
   a klucz jest zapisany w Cloudflare jako „Secret”.

   Ustawienia (Cloudflare → Worker → Settings → Variables and Secrets):
   - ADRES_MODELU      adres modelu zgodnego z API OpenAI, zakończony /chat/completions
   - MODEL             nazwa modelu u dostawcy (np. podana przez dostawcę nazwa Bielika)
   - KLUCZ_API         klucz API od dostawcy — dodaj jako „Secret”
   - DOZWOLONE_ZRODLO  (nieobowiązkowe) adres strony z aplikacją, np. https://twoja-nazwa.github.io
                       — wtedy z pośrednika skorzysta tylko ta strona. Puste = każda strona.

   Instrukcja krok po kroku: bielik/INSTRUKCJA.md. Niczego tu nie trzeba zmieniać.
   ===================================================================== */

const MAKS_ROZMIAR = 8000;     // największe zapytanie w bajtach
const MAKS_WIADOMOSCI = 4;     // aplikacja wysyła 2: instrukcję i pytanie osoby
const MAKS_TEKST = 4000;       // najdłuższa wiadomość w znakach
const MAKS_TOKENY = 200;       // najdłuższa odpowiedź modelu (ogranicza koszty)

export default {
  async fetch(request, env) {
    const cors = {
      'Access-Control-Allow-Origin': env.DOZWOLONE_ZRODLO || '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400'
    };
    const odpowiedz = (dane, status) => new Response(JSON.stringify(dane), {
      status, headers: { ...cors, 'Content-Type': 'application/json; charset=utf-8' }
    });
    const blad = (tekst, status) => odpowiedz({ error: { message: tekst } }, status);

    // Przeglądarka najpierw pyta, czy wolno wysłać zapytanie (CORS)
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });

    const url = new URL(request.url);
    if (request.method !== 'POST' || !url.pathname.endsWith('/chat/completions')) {
      return blad('Użyj POST /v1/chat/completions', 404);
    }
    if (env.DOZWOLONE_ZRODLO && request.headers.get('Origin') !== env.DOZWOLONE_ZRODLO) {
      return blad('Ta strona nie może korzystać z pośrednika.', 403);
    }
    if (!env.ADRES_MODELU || !env.KLUCZ_API) {
      return blad('Pośrednik nie jest jeszcze ustawiony (brak ADRES_MODELU albo KLUCZ_API).', 500);
    }
    if (Number(request.headers.get('Content-Length') || 0) > MAKS_ROZMIAR) return blad('Za długie zapytanie.', 413);

    let dane;
    try { dane = await request.json(); } catch (e) { return blad('Zapytanie nie jest poprawnym JSON.', 400); }

    const wiadomosci = Array.isArray(dane.messages) ? dane.messages : null;
    const poprawne = wiadomosci && wiadomosci.length > 0 && wiadomosci.length <= MAKS_WIADOMOSCI &&
      wiadomosci.every((w) => w && ['system', 'user', 'assistant'].includes(w.role) &&
        typeof w.content === 'string' && w.content.length <= MAKS_TEKST);
    if (!poprawne) return blad('Nieprawidłowe wiadomości.', 400);

    // Do modelu idzie tylko to, co potrzebne. Klucz API dokłada dopiero pośrednik.
    const doModelu = {
      model: env.MODEL || dane.model,
      messages: wiadomosci.map((w) => ({ role: w.role, content: w.content })),
      temperature: 0,
      max_tokens: Math.min(Number(dane.max_tokens) || 150, MAKS_TOKENY)
    };

    let odp;
    try {
      odp = await fetch(env.ADRES_MODELU, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + env.KLUCZ_API },
        body: JSON.stringify(doModelu)
      });
    } catch (e) {
      return blad('Model nie odpowiada.', 502);
    }
    // Odpowiedź modelu wraca do aplikacji bez zmian (format API OpenAI)
    return new Response(await odp.text(), {
      status: odp.status, headers: { ...cors, 'Content-Type': 'application/json; charset=utf-8' }
    });
  }
};

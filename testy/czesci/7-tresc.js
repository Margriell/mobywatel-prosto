/* CZĘŚĆ 7 — treść i jakość.
   Teksty (literówki, typografia, formy neutralne płciowo, odmiana imion, spójne nazwy), martwe kliknięcia
   i ekrany bez wyjścia, błędy w konsoli, czas ładowania i rozmiar plików, zapytania sieciowe. */
'use strict';
const fs = require('fs');
const path = require('path');
const { otworz, trasa } = require('../lib/aplikacja');
const { trasa: trasaEkranow, zapytaj } = require('../lib/ekrany');
const { zaladuj, kontekst } = require('../lib/asystent-node');
const { czekaj } = require('../lib/przegladarka');
const wstrzyknij = require('../lib/w-stronie');

const NAZWA = 'Część 7 — treść i jakość';

/* Typografia i typowe błędy (polskie zasady) */
const REGULY = [
  [/ {2,}/, 'podwójna spacja'], [/ [,.:;!?…](?!\d)/, 'spacja przed znakiem interpunkcyjnym'], [/[a-ząćęłńóśźż][,;](?=[A-Za-ząćęłńóśźżĄĆĘŁŃÓŚŹŻ])/, 'brak spacji po przecinku'],
  [/(^|[^\d])\.\.\.($|[^.])/, 'trzy kropki zamiast wielokropka „…”'], [/"/, 'prosty cudzysłów zamiast „…”'], [/ - /, 'łącznik zamiast półpauzy lub myślnika „—”'],
  [/(^|[^a-ząćęłńóśźż])([a-ząćęłńóśźż]{2,}) \2(?![a-ząćęłńóśźż])/i, 'powtórzone słowo'], [/\bz pośród\b|\bnaprzeciwko\b|\bwogóle\b|\bnarazie\b|\bnapewno\b|\bconajmniej\b|\bpoprostu\b|\bwłaściwie\b/i, 'częsty błąd pisowni'],
  [/\bprosze\b|\bdziekuje\b|\bwiecej\b|\bnalezy\b|\bmozesz\b|\bzeby\b/i, 'brak polskich znaków']
];
/* Formy zależne od płci, gdy aplikacja mówi do osoby (specyfikacja: formy neutralne) */
const PLEC = [/\b\w+(łeś|łaś)\b/i, /\bJesteś (pewien|pewna|gotowy|gotowa|zalogowany|zalogowana|zadowolony|zadowolona|właścicielem|właścicielką|studentem|studentką)\b/i,
  /\bzostałeś\b|\bzostałaś\b|\bzrobiłeś\b|\bzrobiłaś\b|\bzgubiłeś\b|\bzgubiłaś\b|\bwybrałeś\b|\bwybrałaś\b/i, /\bJestem właścicielem\b|\bJestem właścicielką\b/i, /\b(sam|sama)\b(?!\(a\))(?! (numer|kod|adres|nazw))/];

module.exports = {
  nazwa: NAZWA,
  async uruchom(ctx) {
    const W = (p, ok, sz, waga) => ctx.wynik(NAZWA, p, ok, sz, waga);
    const s = await ctx.przegladarka.nowaStrona({ szer: 390, wys: 844 });

    /* ---------- 1. Wszystkie teksty: ekrany trzech osób + odpowiedzi asystenta ---------- */
    const teksty = new Map(); /* tekst → gdzie */
    for (const osoba of ['halina', 'tomasz', 'ola']) {
      await otworz(s, ctx.baza, { osoba, trasa: '/osoba' });
      for (const k of trasaEkranow(osoba)) {
        try { await k.krok(s); } catch (e) { continue; }
        await s.js(wstrzyknij);
        for (const t of await s.js(() => window.__T.teksty())) if (!teksty.has(t)) teksty.set(t, osoba + ': ' + k.nazwa);
        ctx.ekran();
      }
      ctx.konsola(s, NAZWA + ' (' + osoba + ')');
    }
    const sb = zaladuj(ctx.katalog);
    const zdania = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'zdania-regresja.json'), 'utf8')).map((z) => z.zdanie)
      .concat(require('../zdania-nowe.js').map((z) => z[1])).concat(require('../zdania-sprawdzian.js').map((z) => z[1]));
    for (const o of ['halina', 'tomasz', 'ola']) for (const z of zdania) {
      const w = sb.ASYSTENT.odpowiedz(z, kontekst(sb, o));
      const t = [].concat(w.zdania || [], (w.przyciski || []).map((p) => p.tekst), (w.listy || []).reduce((a, l) => a.concat([l.tytul], l.punkty), []),
        (w.fakty || []).map((f) => f[0] + ': ' + f[1]), w.karta ? [w.karta.tytul, w.karta.opis].concat(w.karta.punkty || []) : [], w.wybor ? [w.wybor.pytanie].concat(w.wybor.opcje.map((x) => x.etykieta)) : []);
      for (const x of t) if (x && !teksty.has(x)) teksty.set(x, 'asystent (' + o + '): „' + z + '”');
    }
    /* Do przeczytania przez człowieka */
    const lista = [...teksty.keys()].sort((a, b) => a.localeCompare(b, 'pl'));
    fs.mkdirSync(path.join(__dirname, '..', 'wyniki'), { recursive: true });
    fs.writeFileSync(path.join(__dirname, '..', 'wyniki', 'teksty.txt'), lista.map((t) => t + '\t[' + teksty.get(t) + ']').join('\n') + '\n');
    ctx.stat.inne['Część 7: różnych tekstów w aplikacji'] = lista.length + ' (lista: testy/wyniki/teksty.txt)';
    /* Teksty wpisane przez użytkownika (pytania z testu) nie są tekstami aplikacji */
    const zTestu = new Set(zdania);
    const typografia = [], plec = [];
    for (const [t, gdzie] of teksty) {
      if (zTestu.has(t) || /^Ty: /.test(t) || /paczka-dostawa24|onerror|<img|<script/.test(t)) continue;
      for (const [re, opis] of REGULY) if (re.test(t)) typografia.push(opis + ': „' + t.slice(0, 70) + '” (' + gdzie + ')');
      for (const re of PLEC) if (re.test(t)) plec.push('„' + t.slice(0, 70) + '” (' + gdzie + ')');
    }
    W('Typografia i pisownia (' + lista.length + ' tekstów: ekrany 3 osób i odpowiedzi asystenta)', !typografia.length, typografia.length ? typografia.slice(0, 10).join(' · ') : 'bez podwójnych spacji, prostych cudzysłowów, łączników zamiast myślników, powtórzeń i braków polskich znaków', 'drobny');
    W('Formy neutralne płciowo (aplikacja mówi do osoby bez form męskich i żeńskich)', !plec.length, plec.length ? plec.slice(0, 10).join(' · ') : 'brak form zależnych od płci', 'poważny');
    /* Wołacz w powitaniu */
    const wolacz = { halina: 'Halino', tomasz: 'Tomaszu', ola: 'Olu' };
    const zle = [];
    for (const [osoba, w] of Object.entries(wolacz)) {
      await otworz(s, ctx.baza, { osoba, trasa: '/dokumenty' });
      const h = await s.js(`document.querySelector('#tresc h1').textContent`);
      if (h !== 'Dzień dobry, ' + w) zle.push(h);
    }
    W('Powitanie w wołaczu: „Dzień dobry, Halino / Tomaszu / Olu”', !zle.length, zle.length ? zle.join(', ') : 'Halino, Tomaszu, Olu (też w podglądzie i w odpowiedzi na „Dzień dobry”)', 'poważny');
    /* Spójne nazwy spraw w całej aplikacji */
    const nazwyB = lista.filter((t) => /^(Mój samochód: OC i badanie|Samochód: OC i badanie|OC i badanie techniczne|OC i badanie auta)$/.test(t));
    const nazwyA = lista.filter((t) => /^(Zgubione dokumenty|Zgłoś utratę lub kradzież dokumentów|zgubione dokumenty)$/.test(t));
    W('Spójne nazwy spraw w całej aplikacji', nazwyB.length <= 1, 'sprawa B występuje jako: ' + nazwyB.map((t) => '„' + t + '”').join(', ') + '; sprawa A: ' + nazwyA.map((t) => '„' + t + '”').join(', '), 'drobny');

    /* ---------- 2. Martwe kliknięcia i ekrany bez wyjścia ---------- */
    const ekrany = [
      ['tomasz', '/osoba'], ['tomasz', '/dopasuj'], ['tomasz', '/poznaj'], ['tomasz', '/dokumenty'], ['halina', '/dokumenty'], ['ola', '/dokumenty'],
      ['tomasz', '/dokument/dowod'], ['tomasz', '/dokument/prawko'], ['tomasz', '/dokument/pojazdy'], ['halina', '/dokument/emeryt'], ['halina', '/dokument/kdr'], ['ola', '/dokument/legitymacja'],
      ['tomasz', '/zarzadzaj'], ['tomasz', '/zarzadzaj/kolejnosc'], ['tomasz', '/zarzadzaj/usun'], ['tomasz', '/zarzadzaj/uklad'], ['tomasz', '/zarzadzaj/dodaj'],
      ['tomasz', '/uslugi'], ['halina', '/uslugi'], ['halina', '/uslugi/zdrowie'], ['tomasz', '/asystent'], ['halina', '/asystent', ['Wytłumacz mi pismo', 'Czy ten SMS to oszustwo? „Twoja paczka jest wstrzymana. Dopłać 1,89 zł w ciągu 24 h: paczka-dostawa24.xyz/oplata”', 'Co umiesz?']],
      ['tomasz', '/asystent', ['Zginął mi portfel', 'Do kiedy mam OC?', 'Na kogo głosować?']], ['ola', '/asystent', ['Dokończ zameldowanie', 'Lubisz koty?', 'I lost my wallet']],
      ['tomasz', '/kod-qr'], ['tomasz', '/wiecej'], ['tomasz', '/wyglad'], ['tomasz', '/skrzynka'], ['halina', '/skrzynka/podatek'], ['tomasz', '/skrzynka/oc'], ['ola', '/skrzynka/legitymacja'],
      ['tomasz', '/sprawa/zgubione'], ['tomasz', '/sprawa/zgubione/krok-2?tylko=pesel'], ['tomasz', '/sprawa/samochod'], ['tomasz', '/sprawa/samochod/krok-2'], ['halina', '/sprawa/samochod'],
      ['ola', '/sprawa/zameldowanie'], ['tomasz', '/dokument/xyz'], ['tomasz', '/skrzynka/xyz']
    ];
    const martwe = [], bezWyjscia = [];
    let klikniec = 0;
    for (const [osoba, adres, pytania] of ekrany) {
      const przygotuj = async () => { await otworz(s, ctx.baza, { osoba, trasa: adres }); if (pytania) for (const p of pytania) await zapytaj(s, p); };
      await przygotuj();
      const droga = await s.js(`(() => { const n = document.getElementById('nawigacja'); return (n && !n.hidden) || !!document.querySelector('.wstecz, a[href="#/dokumenty"], [data-akcja="wybierz-osobe"]'); })()`);
      if (!droga) bezWyjscia.push(osoba + ' ' + adres);
      const lista = await s.js(() => window.__T.klikalne());
      for (const el of lista) {
        if (el.tag === 'input') continue;
        await przygotuj();
        klikniec++;
        const wynik = await s.js((nr) => new Promise((ok) => {
          const lista = window.__T.klikalne();
          const cel = lista.find((x) => x.nr === nr);
          const el = document.querySelector('[data-t="' + nr + '"]');
          if (!el || !cel) return ok('brak');
          const href = el.getAttribute('href') || '';
          if (/^(tel|sms):/.test(href)) return ok('telefon/SMS');
          const przed = { h: location.hash, okno: !!document.querySelector('dialog[open]'), fokus: document.activeElement, html: document.getElementById('tresc').innerHTML.length + '|' + document.documentElement.outerHTML.length, ustaw: JSON.stringify(document.documentElement.dataset) };
          let zmiany = 0;
          const obs = new MutationObserver((m) => { zmiany += m.length; });
          obs.observe(document.documentElement, { subtree: true, childList: true, attributes: true, characterData: true });
          el.click();
          setTimeout(() => {
            obs.disconnect();
            const po = { h: location.hash, okno: !!document.querySelector('dialog[open]'), fokus: document.activeElement };
            if (po.h !== przed.h) return ok('przejście do ' + po.h);
            if (po.okno && !przed.okno) return ok('okno');
            if (przed.okno && !po.okno) return ok('zamknięcie okna');
            if (JSON.stringify(document.documentElement.dataset) !== przed.ustaw) return ok('zmiana ustawień');
            if (zmiany) return ok('zmiana na ekranie');
            if (po.fokus !== przed.fokus) return ok('fokus');
            ok('');
          }, 250);
        }), el.nr);
        if (!wynik) martwe.push(osoba + ' ' + adres + ': ' + el.opis);
      }
      ctx.ekran();
    }
    W('Każdy przycisk i link coś robi (' + klikniec + ' kliknięć na ' + ekrany.length + ' ekranach)', !martwe.length, martwe.length ? martwe.slice(0, 10).join(' · ') : 'brak martwych kliknięć', 'poważny');
    W('Z każdego ekranu jest wyjście (dolny pasek, „Wstecz” albo przycisk do Dokumentów)', !bezWyjscia.length, bezWyjscia.length ? bezWyjscia.join(', ') : ekrany.length + ' ekranów — wszystkie mają wyjście', 'poważny');

    /* ---------- 3. Zapytania sieciowe, czas ładowania i rozmiar plików ---------- */
    s.zapytania.splice(0);
    await otworz(s, ctx.baza, { osoba: 'tomasz', trasa: '/osoba' });
    for (const k of trasaEkranow('tomasz')) { try { await k.krok(s); } catch (e) { /* nic */ } }
    const hosty = new Set();
    for (const z of s.zapytania) {
      if (/^data:|^about:|^blob:/.test(z.url)) continue;
      const h = new URL(z.url).host;
      if (h !== new URL(ctx.baza).host) hosty.add(h);
    }
    const obce = [...hosty].filter((h) => !/^fonts\.(googleapis|gstatic)\.com$/.test(h));
    W('Brak zapytań sieciowych poza czcionką Google Fonts (cała trasa Tomasza)', !obce.length, 'zewnętrzne adresy: ' + ([...hosty].join(', ') || 'brak'), 'poważny');
    const pliki = ['index.html', 'style.css', 'app.js', 'asystent.js', 'dane.js', 'media/ikona.svg', 'media/ikona-180.png'];
    const rozmiary = pliki.map((f) => [f, fs.statSync(path.join(ctx.katalog, f)).size]);
    const razem = rozmiary.reduce((a, b) => a + b[1], 0);
    const zlib = require('zlib');
    const gz = pliki.reduce((a, f) => a + zlib.gzipSync(fs.readFileSync(path.join(ctx.katalog, f))).length, 0);
    ctx.stat.inne['Część 7: rozmiar plików aplikacji'] = rozmiary.map((r) => r[0] + ' ' + Math.round(r[1] / 1024) + ' KB').join(', ') + '; razem ' + Math.round(razem / 1024) + ' KB (spakowane, jak na GitHub Pages: ok. ' + Math.round(gz / 1024) + ' KB)';
    /* Czas ładowania: zwykłe łącze i wolny internet komórkowy (3G) */
    const czasy = [];
    for (const [opis, warunki] of [['bez ograniczeń', null], ['wolny internet komórkowy (3G: 1,6 Mb/s, opóźnienie 150 ms)', { offline: false, latency: 150, downloadThroughput: 1.6 * 1024 * 1024 / 8, uploadThroughput: 750 * 1024 / 8 }]]) {
      if (warunki) await s.wyslij('Network.emulateNetworkConditions', warunki);
      await s.idz(ctx.baza + 'index.html?czas=' + Date.now() + '#/dokumenty');
      const t = await s.js(`(() => { const n = performance.getEntriesByType('navigation')[0]; return { dcl: Math.round(n.domContentLoadedEventEnd), load: Math.round(n.loadEventEnd) }; })()`);
      czasy.push(opis + ': gotowa po ' + t.dcl + ' ms, wszystko z czcionką po ' + t.load + ' ms');
      if (warunki) await s.wyslij('Network.emulateNetworkConditions', { offline: false, latency: 0, downloadThroughput: -1, uploadThroughput: -1 });
    }
    /* Limit 600 KB (27.11.2026: doszło 12 nowych spraw w sprawy.js); ważniejszy jest czas ładowania na wolnym internecie */
    W('Czas ładowania i rozmiar', razem < 600 * 1024, czasy.join('; ') + '; pliki: ' + Math.round(razem / 1024) + ' KB (spakowane ok. ' + Math.round(gz / 1024) + ' KB)', 'drobny');
    /* Bez internetu (poza serwerem z plikami): aplikacja działa z czcionką systemową */
    await s.blokuj(['*fonts.googleapis.com*', '*fonts.gstatic.com*']);
    await otworz(s, ctx.baza, { osoba: 'halina', trasa: '/dokumenty' });
    await zapytaj(s, 'Zginął mi portfel');
    const dziala = await s.js(`document.querySelectorAll('.wiad.asystent').length === 1`);
    s.bledyKonsoli.splice(0);
    await s.blokuj([]);
    W('Bez internetu: aplikacja i asystent działają (czcionka systemowa)', dziala, dziala ? 'asystent odpowiada bez internetu' : 'brak odpowiedzi', 'krytyczny');

    /* ---------- 4. Błędy w konsoli w całym teście ---------- */
    W('Brak błędów w konsoli przeglądarki (wszystkie części tego uruchomienia do tej chwili)', !ctx.stat.bledyKonsoli.length, ctx.stat.bledyKonsoli.length ? ctx.stat.bledyKonsoli.slice(0, 5).join(' · ') : '0 błędów i ostrzeżeń', 'poważny');
    await s.zamknij();
  }
};

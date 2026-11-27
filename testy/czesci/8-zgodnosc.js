/* CZĘŚĆ 8 — zgodność z konkursem mObywatel Challenge (część, którą da się sprawdzić automatycznie).
   Publiczny link bez logowania (okno prywatne), materiały, do których mamy prawa (licencje czcionki i ikon,
   brak godła, oficjalnych logotypów i zdjęć prawdziwych osób), dane fikcyjne, podgląd linku.
   Ocena według 10 heurystyk Nielsena i tabela wymogów są w RAPORT-TESTOW.md. */
'use strict';
const fs = require('fs');
const path = require('path');
const { otworz } = require('../lib/aplikacja');
const { idzDo } = require('../lib/ekrany');
const { czekaj } = require('../lib/przegladarka');

const NAZWA = 'Część 8 — zgodność z konkursem';
const ADRES_PUBLICZNY = 'https://margriell.github.io/mobywatel-prosto/';

function peselPoprawny(p) {
  const w = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3];
  const s = w.reduce((a, x, i) => a + x * +p[i], 0);
  return (10 - s % 10) % 10 === +p[10];
}

module.exports = {
  nazwa: NAZWA,
  async uruchom(ctx) {
    const W = (p, ok, sz, waga) => ctx.wynik(NAZWA, p, ok, sz, waga);
    const K = ctx.katalog;
    const czytaj = (f) => fs.readFileSync(path.join(K, f), 'utf8');

    /* ---------- Publiczny link w oknie prywatnym ---------- */
    const s = await ctx.przegladarka.nowaStrona({ szer: 1366, wys: 768, prywatna: true });
    try {
      await s.idz(ADRES_PUBLICZNY, { bezCzekania: true });
      await czekaj(1500);
      const r = await s.js(`({ url: location.href, tytul: document.title, ekran: (document.querySelector('#tresc h1') || {}).textContent || '', haslo: !!document.querySelector('input[type="password"]'), appjs: [...document.scripts].map((x) => x.src).filter((x) => /app\\.js/.test(x))[0] || '' })`);
      let zgodne = '';
      try {
        const zdalny = await s.js(`fetch('app.js', { cache: 'no-store' }).then((r) => r.text()).then((t) => t.length)`);
        const lokalny = czytaj('app.js').replace(/\r\n/g, '\n').length; /* znaki, jak w przeglądarce */
        zgodne = Math.abs(zdalny - lokalny) < 50 ? 'opublikowana wersja = ta z testów' : 'opublikowana wersja jest STARSZA (app.js ' + zdalny + ' znaków, lokalnie ' + lokalny + ') — trzeba opublikować zmiany';
      } catch (e) { zgodne = 'nie udało się porównać wersji'; }
      const ok = /Wybierz osobę/.test(r.ekran) && !r.haslo;
      W('Publiczny link (okno prywatne, bez logowania): ' + ADRES_PUBLICZNY, ok, (ok ? 'działa bez logowania, ekran „' + r.ekran + '”' : 'nie działa: „' + r.tytul + '”, ekran „' + r.ekran + '”') + '; ' + zgodne, ok && /=/.test(zgodne) ? 'drobny' : 'poważny');
      if (ok && !/=/.test(zgodne)) W('Opublikowana wersja zawiera poprawki z testów', false, zgodne + ' — do zrobienia przez autorkę w GitHub Desktop (Push), potem odczekać kilka minut', 'poważny');
    } catch (e) { W('Publiczny link (okno prywatne)', false, 'brak połączenia albo strona nie działa: ' + e.message, 'poważny'); }
    s.bledyKonsoli.splice(0);
    await s.zamknij();

    /* ---------- Materiały i prawa ---------- */
    const readme = czytaj('README.md'), app = czytaj('app.js'), html = czytaj('index.html');
    W('Czcionka Atkinson Hyperlegible: licencja SIL Open Font License w README', /Atkinson Hyperlegible/.test(readme) && /Open Font License/.test(readme), 'README: Atkinson Hyperlegible — SIL Open Font License 1.1', 'poważny');
    const lucideKod = (app.match(/Lucide \(licencja [^)]+\)/) || [''])[0];
    W('Ikony Lucide: licencja ISC (README i kod)', /Lucide.*ISC/.test(readme) && /ISC/.test(lucideKod), 'README: ISC; komentarz w app.js: „' + lucideKod + '”', 'drobny');
    const zdjecia = (app + html).match(/<img\b|\.jpe?g|\.webp/gi) || [];
    W('Brak zdjęć (także prawdziwych osób) — portrety to rysunki SVG', !zdjecia.length, zdjecia.length ? 'znaleziono: ' + zdjecia.join(', ') : 'w aplikacji nie ma żadnego zdjęcia; portrety, auto i ikony to własne rysunki', 'krytyczny');
    const media = fs.readdirSync(path.join(K, 'media'));
    W('Folder media: tylko własne pliki (znak „m”, obrazek podglądu linku)', media.every((f) => /^(ikona\.svg|ikona-180\.png|podglad\.png)$/.test(f)), media.join(', '), 'poważny');
    const ikona = czytaj('media/ikona.svg');
    W('Znak aplikacji: własny (czerwony kwadrat z białym „m”), bez godła', /<text|<path/.test(ikona) && !/orze[lł]|godlo|godło|eagle/i.test(ikona + app), 'media/ikona.svg i znak w nagłówku — litera „m”; brak godła i oficjalnego logo', 'krytyczny');
    /* Dane fikcyjne: PESEL-e z błędną cyfrą kontrolną */
    const pesele = [...new Set((czytaj('dane.js').match(/\b\d{11}\b/g) || []))];
    const prawdziwe = pesele.filter(peselPoprawny);
    W('Dane fikcyjne: numery PESEL celowo z błędną cyfrą kontrolną (nie należą do nikogo)', !prawdziwe.length, pesele.join(', ') + (prawdziwe.length ? ' — POPRAWNE (mogą należeć do kogoś): ' + prawdziwe.join(', ') : ' — wszystkie niepoprawne'), 'krytyczny');
    /* Informacja „Prototyp konkursowy, dane fikcyjne” */
    const s2 = await ctx.przegladarka.nowaStrona({ szer: 390, wys: 844 });
    await otworz(s2, ctx.baza, { osoba: 'tomasz', trasa: '/osoba' });
    const n1 = await s2.js(`document.getElementById('glowna').innerText`);
    await idzDo(s2, '#/wiecej');
    const n2 = await s2.js(`document.getElementById('glowna').innerText`);
    W('Informacja „Prototyp konkursowy, dane fikcyjne” na wyborze osoby i w „Więcej”', /Prototyp konkursowy, dane fikcyjne/.test(n1) && /Prototyp konkursowy, dane fikcyjne/.test(n2), 'jest na obu ekranach', 'poważny');
    /* Podgląd linku (Open Graph) i strona */
    const og = ['og:title', 'og:description', 'og:image', 'og:url', 'og:image:alt'].filter((p) => !new RegExp('property="' + p + '"').test(html));
    W('Podgląd linku: tytuł, opis, obrazek 1200 × 630, adres; tytuł strony i ikona w karcie', !og.length && /<title>mObywatel dla każdego — prototyp konkursowy<\/title>/.test(html) && /rel="icon"/.test(html), og.length ? 'brakuje: ' + og.join(', ') : 'komplet; obrazek: media/podglad.png', 'poważny');
    W('Pusty plik .nojekyll (GitHub Pages) i względne ścieżki', fs.existsSync(path.join(K, '.nojekyll')) && !/(src|href)="\//.test(html), '.nojekyll jest; wszystkie ścieżki względne', 'poważny');
    /* Działa po otwarciu z pliku (dwuklik) */
    const s3 = await ctx.przegladarka.nowaStrona({ szer: 390, wys: 844 });
    try {
      await s3.idz('file:///' + path.join(K, 'index.html').replace(/\\/g, '/'));
      await s3.js(`(() => { document.querySelector('[data-osoba="halina"]').click(); return true; })()`); await czekaj(200);
      await s3.js(`location.hash = '#/sprawa/zgubione'`); await czekaj(200);
      await s3.js(`(() => { document.querySelector('input[value="dowod"]').click(); document.querySelector('form.krok-formularz').requestSubmit(); return true; })()`); await czekaj(200);
      await s3.js(`document.querySelector('form.krok-formularz').requestSubmit()`); await czekaj(200);
      await s3.js(`document.querySelector('[data-akcja="potwierdz"]').click()`); await czekaj(100);
      await s3.js(`document.querySelector('[data-akcja="potwierdz-wyslij"]').click()`); await czekaj(200);
      const t = await s3.js(`document.getElementById('glowna').innerText`);
      const bl = s3.bledyKonsoli.splice(0).filter((b) => !/fonts\./.test(b));
      W('Działa po otwarciu index.html z pliku (dwuklik): wybór osoby i sprawa A do końca', /unieważniony/.test(t) && !bl.length, /unieważniony/.test(t) ? 'Gotowe: „' + t.match(/Twój dowód[^.]*\./)[0] + '”' : 'nie działa: „' + t.slice(0, 80) + '”' + (bl.length ? '; błędy: ' + bl.join(' / ') : ''), 'krytyczny');
    } catch (e) { W('Działa po otwarciu z pliku (dwuklik)', false, e.message, 'krytyczny'); }
    await s3.zamknij();
    ctx.konsola(s2, NAZWA);
    await s2.zamknij();
  }
};

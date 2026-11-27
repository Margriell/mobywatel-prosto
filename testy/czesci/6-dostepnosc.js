/* CZĘŚĆ 6 — dostępność.
   Wszystkie sprawy wyłącznie klawiaturą (Tab, Shift+Tab, Enter, Spacja, Esc): kolejność fokusu, widoczny fokus,
   fokus uwięziony w oknach i wracający po zamknięciu, Esc zamyka okna. Nazwy wszystkich przycisków i pól
   dla czytnika ekranu, ogłaszanie odpowiedzi asystenta i błędów formularza. (Kontrast — w „Kontroli”.) */
'use strict';
const { otworz, trasa, oknoOtwarte } = require('../lib/aplikacja');
const { trasa: trasaEkranow, idzDo, klikJs } = require('../lib/ekrany');
const { czekaj } = require('../lib/przegladarka');
const wstrzyknij = require('../lib/w-stronie');

const NAZWA = 'Część 6 — dostępność';

/* Opis elementu z fokusem: nazwa, widoczność (na ekranie, nie pod paskami), widoczny wskaźnik fokusu */
async function fokus(s) {
  return s.js(() => {
    const e = document.activeElement;
    if (!e || e === document.body) return { nazwa: '(nic)', tag: 'body', widac: true, ramka: true };
    const nazwa = (e.getAttribute('aria-label') || (e.labels && e.labels[0] && e.labels[0].textContent) || e.textContent || e.value || e.placeholder || '').replace(/\s+/g, ' ').trim();
    const r = e.getBoundingClientRect();
    const okno = document.querySelector('dialog[open]');
    let widac = r.width > 0 && r.height > 0 && r.top >= -1 && r.bottom <= innerHeight + 1;
    /* Nie pod przyklejonym paskiem „Wstecz” ani pod dolnymi paskami */
    if (widac && !okno) {
      const x = r.left + Math.min(r.width / 2, 30), y = r.top + Math.min(r.height / 2, 14);
      const t = document.elementFromPoint(x, y);
      widac = !!t && (t === e || e.contains(t) || t.contains(e) || (e.closest('label') && e.closest('label').contains(t)));
    }
    /* Wskaźnik fokusu: obramowanie na elemencie, rodzicu (pole, opcja) albo nazwie karty */
    const maRamke = (el) => { if (!el) return false; const cs = getComputedStyle(el); return cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) >= 2; };
    const ramka = e.matches(':focus-visible') && (maRamke(e) || maRamke(e.parentElement) || maRamke(e.closest('.pole, .opcja')) || maRamke(e.querySelector('.karta-nazwa')) || maRamke(e.querySelector('.dymek')) || e.matches('h1, h2, .wiad, [tabindex="-1"]'));
    return { nazwa: nazwa.slice(0, 50), tag: e.tagName.toLowerCase(), widac, ramka, wOknie: !!(okno && okno.contains(e)), id: e.id };
  });
}

module.exports = {
  nazwa: NAZWA,
  async uruchom(ctx) {
    const W = (p, ok, sz, waga) => ctx.wynik(NAZWA, p, ok, sz, waga);
    const s = await ctx.przegladarka.nowaStrona({ szer: 390, wys: 844 });
    let problemy = [], kroki = 0;
    /* Naciska Tab (albo Shift+Tab), aż fokus trafi na element pasujący do wzoru; sprawdza każdy przystanek */
    async function tabDo(wzor, o) {
      o = o || {};
      for (let i = 0; i < (o.max || 60); i++) {
        await s.klawisz('Tab', { shift: o.wstecz, czekaj: 30 });
        kroki++;
        const f = await fokus(s);
        if (!f.widac) problemy.push('fokus niewidoczny (schowany): ' + f.tag + ' „' + f.nazwa + '”');
        if (!f.ramka) problemy.push('brak widocznego obramowania fokusu: ' + f.tag + ' „' + f.nazwa + '”');
        if (wzor.test(f.nazwa)) return f;
      }
      throw new Error('Tab nie doszedł do „' + wzor + '”');
    }
    const naEkranie = async (wzor) => { await czekaj(200); const h = await trasa(s); if (!wzor.test(h)) throw new Error('oczekiwano ' + wzor + ', jest ' + h); };

    /* ---------- 1. Sprawy wyłącznie klawiaturą ---------- */
    const scenariusze = [
      ['Sprawa A klawiaturą (Tomasz): Usługi → Zgłoś utratę → Dowód osobisty → Potwierdzam → Potwierdź', 'tomasz', async () => {
        await tabDo(/^Usługi$/); await s.klawisz('Enter'); await naEkranie(/uslugi$/);
        await tabDo(/Zgłoś utratę lub kradzież/); await s.klawisz('Enter'); await naEkranie(/zgubione$/);
        await tabDo(/^Dowód osobisty$/); await s.klawisz('Spacja');
        await tabDo(/^Dalej/); await s.klawisz('Enter'); await naEkranie(/krok-2$/);
        await tabDo(/^Dalej/); await s.klawisz('Enter'); await naEkranie(/krok-3$/);
        await tabDo(/Potwierdzam i wysyłam/); await s.klawisz('Enter'); await czekaj(150);
        const f = await fokus(s); if (!f.wOknie) throw new Error('po otwarciu okna fokus nie jest w oknie');
        await tabDo(/^Potwierdź/); await s.klawisz('Enter'); await naEkranie(/krok-4$/);
      }],
      ['Sprawa B klawiaturą (Tomasz): karta „Kończy się OC” → Przypomnij → Ustaw', 'tomasz', async () => {
        await tabDo(/Kończy się OC/); await s.klawisz('Enter'); await naEkranie(/samochod$/);
        await tabDo(/Przypomnij mi 7 dni/); await s.klawisz('Enter'); await naEkranie(/krok-2$/);
        await tabDo(/^Powiadomienie w aplikacji/); await s.klawisz('ArrowDown'); /* w grupie opcji chodzi się strzałkami */
        if (await s.js(`document.querySelector('input[name="sposob"]:checked').value`) !== 'sms') throw new Error('strzałka nie wybrała SMS');
        await tabDo(/Ustaw przypomnienie/); await s.klawisz('Enter'); await naEkranie(/krok-3$/);
      }],
      ['Sprawa C klawiaturą (Ola): Dokończ zameldowanie → Od dziś → Wynajmuję → Potwierdzam', 'ola', async () => {
        await tabDo(/Dokończ zameldowanie/); await s.klawisz('Enter'); await naEkranie(/zameldowanie$/);
        await tabDo(/^Dalej/); await s.klawisz('Enter'); await naEkranie(/krok-2$/);
        await tabDo(/^Od dziś/); await s.klawisz('Spacja');
        await tabDo(/^Dalej/); await s.klawisz('Enter'); await naEkranie(/krok-3$/);
        await tabDo(/^Mieszkanie jest moje/); await s.klawisz('ArrowDown');
        if (await s.js(`document.querySelector('input[name="podstawa"]:checked').value`) !== 'wynajem') throw new Error('strzałka nie wybrała „Wynajmuję”');
        await tabDo(/^Dalej/); await s.klawisz('Enter'); await naEkranie(/krok-4$/);
        await tabDo(/Potwierdzam i wysyłam/); await s.klawisz('Enter'); await czekaj(150);
        await tabDo(/^Potwierdź/); await s.klawisz('Enter'); await naEkranie(/krok-5$/);
      }],
      ['Sprawa C klawiaturą z nowym adresem i błędem (Tomasz): wpisanie złego kodu, poprawka, dalej', 'tomasz', async () => {
        await tabDo(/^Usługi$/); await s.klawisz('Enter'); await naEkranie(/uslugi$/);
        await tabDo(/^Zameldowanie na pobyt stały/); await s.klawisz('Enter'); await naEkranie(/zameldowanie$/);
        await tabDo(/Ulica i numer domu/); await s.pisz('ul. Polna 12');
        await tabDo(/Kod pocztowy/); await s.pisz('211');
        await tabDo(/Miejscowość/); await s.pisz('Lublin');
        await tabDo(/^Dalej/); await s.klawisz('Enter'); await czekaj(150);
        const f = await fokus(s);
        const opis = await s.js(`(() => { const e = document.activeElement; const ids = (e.getAttribute('aria-describedby') || '').split(' '); return ids.map((i) => { const x = document.getElementById(i); return x && !x.hidden ? x.textContent.trim() : ''; }).filter(Boolean).join(' / '); })()`);
        if (f.id !== 'm-kod' || !/5 cyfr/.test(opis)) throw new Error('po błędzie fokus na ' + f.id + ', czytnik usłyszy: „' + opis + '”');
        await s.js(`document.activeElement.select()`); await s.pisz('21-100');
        await tabDo(/^Dalej/); await s.klawisz('Enter'); await naEkranie(/krok-2$/);
      }],
      ['Asystent klawiaturą (Halina): pole → pytanie → zaznaczenie w rozmowie → Zacznij', 'halina', async () => {
        await tabDo(/Co chcesz załatwić/); await s.pisz('ukradli mi torebkę'); await s.klawisz('Enter'); await naEkranie(/asystent$/);
        const f = await fokus(s); if (f.tag !== 'li') throw new Error('po odpowiedzi fokus nie jest na odpowiedzi asystenta (jest: ' + f.tag + ' „' + f.nazwa + '”)');
        await tabDo(/^Dowód osobisty$/); await s.klawisz('Spacja');
        await tabDo(/^Dalej/); await s.klawisz('Enter'); await czekaj(200);
        await tabDo(/^Zacznij/); await s.klawisz('Enter'); await naEkranie(/zgubione\?/);
      }],
      ['Portfel klawiaturą (Tomasz): karta z tyłu na przód, fokus na „Pokaż szczegóły”', 'tomasz', async () => {
        await tabDo(/Pokaż Moje pojazdy na przodzie/); await s.klawisz('Enter'); await czekaj(300);
        const f = await fokus(s); if (!/Pokaż szczegóły: Moje pojazdy/.test(f.nazwa)) throw new Error('fokus po przełożeniu karty: „' + f.nazwa + '”');
        await s.klawisz('Enter'); await naEkranie(/dokument\/pojazdy$/);
      }],
      ['Zarządzaj klawiaturą (Tomasz): kolejność W dół, ogłoszenie zmiany, fokus zostaje na przycisku', 'tomasz', async () => {
        await tabDo(/Zarządzaj dokumentami/); await s.klawisz('Enter'); await naEkranie(/zarzadzaj$/);
        await tabDo(/Kolejność dokumentów/); await s.klawisz('Enter'); await naEkranie(/kolejnosc$/);
        await tabDo(/W dół: mDowód/); await s.klawisz('Enter'); await czekaj(150);
        const f = await fokus(s);
        const ogl = await s.js(`document.getElementById('ogloszenie').textContent`);
        if (!/mDowód/.test(f.nazwa) || !/miejscu 2/.test(ogl)) throw new Error('fokus: „' + f.nazwa + '”, ogłoszenie: „' + ogl + '”');
      }],
      ['Ustawienia klawiaturą (Ola): Dostosuj → motyw jasny (strzałki) → tryb prosty (Spacja)', 'ola', async () => {
        await tabDo(/Dostosuj/); await s.klawisz('Enter'); await naEkranie(/wyglad$/);
        await tabDo(/^Ciemny/); await s.klawisz('ArrowUp'); await czekaj(80);
        const m = await s.js('document.documentElement.dataset.motyw');
        await tabDo(/Tryb prosty/); await s.klawisz('Spacja'); await czekaj(80);
        const p = await s.js('document.documentElement.dataset.prosty');
        if (m !== 'jasny' || p !== 'tak') throw new Error('motyw ' + m + ', tryb prosty ' + p);
      }]
    ];
    const tabele = [];
    for (const [nazwa, osoba, f] of scenariusze) {
      problemy = []; kroki = 0;
      try {
        await otworz(s, ctx.baza, { osoba, trasa: '/dokumenty' });
        await f();
        const u = [...new Set(problemy)];
        W(nazwa, !u.length, u.length ? u.slice(0, 5).join(' · ') : 'przeszło: ' + kroki + ' naciśnięć Tab, fokus zawsze widoczny i z obramowaniem', 'poważny');
        tabele.push(nazwa.split(':')[0] + ': ' + kroki);
      } catch (e) { W(nazwa, false, e.message + (problemy.length ? '; ' + [...new Set(problemy)].slice(0, 3).join(' · ') : ''), 'poważny'); }
      ctx.ekran(); ctx.konsola(s, nazwa);
    }

    /* ---------- 2. Okna: fokus w oknie, uwięziony, Esc zamyka, fokus wraca ---------- */
    const okna = [
      ['Okno „Niedostępne w prototypie” (Usługi)', 'tomasz', '/uslugi', /Wniosek o dowód osobisty/],
      ['Okno „Potwierdź odciskiem palca” (sprawa A, krok 3)', 'tomasz', '/sprawa/zgubione', /Potwierdzam i wysyłam/],
      ['Okno „Usunąć dokument?” (Zarządzaj → Usuń)', 'halina', '/zarzadzaj/usun', /Karta Dużej Rodziny/],
      ['Okno informacji „Mówienie” (przycisk Powiedz)', 'ola', '/asystent', /Powiedz, co chcesz załatwić/]
    ];
    for (const [nazwa, osoba, adres, wzor] of okna) {
      problemy = []; kroki = 0;
      try {
        await otworz(s, ctx.baza, { osoba, trasa: adres });
        if (/zgubione/.test(adres)) { await s.js(`(() => { document.querySelector('input[value="dowod"]').click(); document.querySelector('form.krok-formularz').requestSubmit(); return true; })()`); await czekaj(150); await s.js(`document.querySelector('form.krok-formularz').requestSubmit()`); await czekaj(150); }
        const otwierajacy = await tabDo(wzor);
        await s.klawisz('Enter');
        let otwarte = null;
        for (let i = 0; i < 70 && !otwarte; i++) { await czekaj(100); otwarte = await oknoOtwarte(s); }
        if (!otwarte) throw new Error('okno się nie otworzyło');
        const f0 = await fokus(s);
        let poza = 0;
        for (let i = 0; i < 8; i++) { await s.klawisz('Tab', { czekaj: 20 }); if (!(await fokus(s)).wOknie) poza++; }
        for (let i = 0; i < 8; i++) { await s.klawisz('Tab', { shift: true, czekaj: 20 }); if (!(await fokus(s)).wOknie) poza++; }
        await s.klawisz('Escape'); await czekaj(150);
        const zamkniete = !(await oknoOtwarte(s));
        const f1 = await fokus(s);
        const wrocil = f1.nazwa === otwierajacy.nazwa;
        const ok = f0.wOknie && !poza && zamkniete && wrocil;
        W(nazwa + ': fokus w oknie, nie wychodzi z okna, Esc zamyka, fokus wraca', ok,
          'po otwarciu fokus: „' + f0.nazwa + '”' + (f0.wOknie ? ' (w oknie)' : ' (POZA oknem)') + '; Tab/Shift+Tab poza oknem: ' + poza + ' z 16; Esc ' + (zamkniete ? 'zamyka' : 'NIE zamyka') + '; fokus wraca na „' + f1.nazwa + '”' + (wrocil ? '' : ' (zamiast „' + otwierajacy.nazwa + '”)'), 'poważny');
      } catch (e) { W(nazwa, false, e.message, 'poważny'); }
      ctx.ekran();
    }
    /* Esc zamyka podpowiedzi pod polem asystenta, fokus zostaje w polu */
    try {
      await otworz(s, ctx.baza, { osoba: 'halina', trasa: '/dokumenty' });
      await tabDo(/Co chcesz załatwić/);
      await czekaj(150);
      const przed = await s.js(`!document.getElementById('podpowiedzi-paska').hidden`);
      await s.klawisz('Escape'); await czekaj(80);
      const po = await s.js(`!document.getElementById('podpowiedzi-paska').hidden`);
      const f = await fokus(s);
      W('Podpowiedzi pod polem asystenta: otwierają się przy fokusie, Esc je zamyka, fokus zostaje w polu', przed && !po && f.id === 'pole-asystenta', 'otwarte: ' + przed + ', po Esc: ' + po + ', fokus: #' + f.id, 'poważny');
    } catch (e) { W('Podpowiedzi pod polem asystenta i Esc', false, e.message, 'poważny'); }

    /* ---------- 3. Nazwy dla czytnika ekranu na wszystkich ekranach ---------- */
    const bezNazwy = new Set(), naglowki = new Set();
    let ekrany = 0, elementy = 0;
    for (const osoba of ['tomasz', 'halina', 'ola']) {
      await otworz(s, ctx.baza, { osoba, trasa: '/osoba' });
      for (const k of trasaEkranow(osoba)) {
        try { await k.krok(s); } catch (e) { continue; }
        const drzewo = (await s.wyslij('Accessibility.getFullAXTree')).nodes;
        ekrany++;
        let h1 = 0;
        for (const n of drzewo) {
          if (n.ignored) continue;
          const rola = n.role && n.role.value;
          if (['button', 'link', 'textbox', 'checkbox', 'radio', 'switch', 'searchbox', 'combobox'].indexOf(rola) >= 0) {
            elementy++;
            const imie = n.name && String(n.name.value || '').trim();
            if (!imie) bezNazwy.add(k.nazwa + ': ' + rola);
          }
          if (rola === 'heading' && (n.properties || []).some((p) => p.name === 'level' && p.value.value === 1)) h1++;
        }
        if (h1 !== 1 && !/^Okno/.test(k.nazwa)) naglowki.add(k.nazwa + ' (' + h1 + ' nagłówków pierwszego stopnia)');
      }
    }
    W('Każdy przycisk, link i pole ma nazwę dla czytnika ekranu (' + elementy + ' elementów na ' + ekrany + ' ekranach)', !bezNazwy.size, bezNazwy.size ? [...bezNazwy].slice(0, 8).join(' · ') : 'wszystkie mają nazwy', 'poważny');
    W('Każdy ekran ma jeden nagłówek pierwszego stopnia (tytuł ekranu)', !naglowki.size, naglowki.size ? [...naglowki].slice(0, 8).join(' · ') : ekrany + ' ekranów — po jednym', 'drobny');
    ctx.ekran();

    /* ---------- 4. Ogłaszanie: odpowiedzi asystenta, nowy ekran, błędy ---------- */
    try {
      await otworz(s, ctx.baza, { osoba: 'tomasz', trasa: '/asystent' });
      await s.js(`(() => { const p = document.getElementById('pole-asystenta'); p.value = 'Dzień dobry'; document.getElementById('asystent-pasek').requestSubmit(); return true; })()`); await czekaj(200);
      await s.js(`(() => { const p = document.getElementById('pole-asystenta'); p.value = 'Ile mam punktów karnych?'; document.getElementById('asystent-pasek').requestSubmit(); return true; })()`); await czekaj(200);
      const ogl = await s.js(`(() => { const o = document.getElementById('ogloszenia'); return { tekst: o.textContent, live: o.getAttribute('aria-live') }; })()`);
      W('Odpowiedź asystenta jest ogłaszana czytnikowi ekranu (aria-live)', ogl.live === 'polite' && /4 punkty karne/.test(ogl.tekst), 'aria-live="' + ogl.live + '": „' + ogl.tekst.slice(0, 80) + '”', 'poważny');
      await otworz(s, ctx.baza, { osoba: 'tomasz', trasa: '/dokumenty' });
      await idzDo(s, '#/uslugi');
      const f = await fokus(s);
      W('Po przejściu do nowego ekranu fokus jest na jego tytule (czytnik ogłasza ekran)', f.tag === 'h1' && /Usługi/.test(f.nazwa), 'fokus: ' + f.tag + ' „' + f.nazwa + '”', 'poważny');
      await idzDo(s, '#/sprawa/zgubione'); await s.js(`document.querySelector('form.krok-formularz').requestSubmit()`); await czekaj(150);
      const b = await s.js(`(() => { const e = document.activeElement; const fs = e.closest('fieldset'); const opis = (fs && fs.getAttribute('aria-describedby')) || e.getAttribute('aria-describedby') || ''; return { el: e.tagName + ' ' + (e.value || ''), czyta: opis.split(' ').map((i) => document.getElementById(i)).filter((x) => x && !x.hidden).map((x) => x.textContent.trim()).join(' / ') }; })()`);
      W('Błąd formularza: fokus na polu, czytnik czyta komunikat (aria-describedby)', /Zaznacz co najmniej jedną rzecz/.test(b.czyta), 'fokus: ' + b.el + '; czytnik usłyszy: „' + b.czyta + '”', 'poważny');
      await idzDo(s, '#/uslugi');
      const wyniki = await s.js(`document.getElementById('wyniki').getAttribute('aria-live')`);
      W('Wyniki wyszukiwania usług są ogłaszane (aria-live)', wyniki === 'polite', 'aria-live="' + wyniki + '"', 'drobny');
      const lang = await s.js('document.documentElement.lang');
      W('Język strony: polski (lang="pl")', lang === 'pl', 'lang="' + lang + '"', 'poważny');
    } catch (e) { W('Ogłaszanie dla czytnika ekranu', false, e.message, 'poważny'); }
    ctx.stat.inne['Część 6: naciśnięcia Tab w sprawach'] = tabele.join('; ');
    ctx.konsola(s, NAZWA);
    await s.zamknij();
  }
};

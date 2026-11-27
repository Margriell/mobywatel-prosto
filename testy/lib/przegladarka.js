/* Uruchamia ukrytą przeglądarkę (Chrome albo Edge) i daje proste polecenia dla testów:
   otwórz stronę, kliknij, naciśnij klawisz, wpisz tekst, zmień rozmiar ekranu. */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');
const { Cdp } = require('./cdp');

const czekaj = (ms) => new Promise((r) => setTimeout(r, ms));

function znajdzPrzegladarke() {
  const kandydaci = [
    process.env.CHROME,
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    path.join(process.env.LOCALAPPDATA || '', 'Google/Chrome/Application/chrome.exe'),
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
    '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/microsoft-edge'
  ].filter(Boolean);
  for (const k of kandydaci) if (fs.existsSync(k)) return k;
  throw new Error('Nie znaleziono Chrome ani Edge. Ustaw ścieżkę w zmiennej CHROME.');
}

const KLAWISZE = {
  Tab: { key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 },
  Enter: { key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13, text: '\r' },
  Spacja: { key: ' ', code: 'Space', windowsVirtualKeyCode: 32, text: ' ' },
  Escape: { key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 },
  ArrowDown: { key: 'ArrowDown', code: 'ArrowDown', windowsVirtualKeyCode: 40 },
  ArrowUp: { key: 'ArrowUp', code: 'ArrowUp', windowsVirtualKeyCode: 38 },
  ArrowRight: { key: 'ArrowRight', code: 'ArrowRight', windowsVirtualKeyCode: 39 },
  ArrowLeft: { key: 'ArrowLeft', code: 'ArrowLeft', windowsVirtualKeyCode: 37 },
  Backspace: { key: 'Backspace', code: 'Backspace', windowsVirtualKeyCode: 8 }
};

class Strona {
  constructor(przegladarka, sesja, cel) {
    this.p = przegladarka; this.sesja = sesja; this.cel = cel;
    this.bledyKonsoli = []; this.zapytania = []; this.zdarzenia = [];
    this.odpinanie = this.p.cdp.sluchaj((metoda, par, sesja) => {
      if (sesja !== this.sesja) return;
      if (metoda === 'Runtime.exceptionThrown') this.bledyKonsoli.push('Wyjątek: ' + ((par.exceptionDetails.exception && par.exceptionDetails.exception.description) || par.exceptionDetails.text));
      if (metoda === 'Runtime.consoleAPICalled' && (par.type === 'error' || par.type === 'warning' || par.type === 'assert')) this.bledyKonsoli.push('Konsola (' + par.type + '): ' + par.args.map((a) => a.value || a.description || '').join(' '));
      if (metoda === 'Log.entryAdded' && par.entry.level === 'error') this.bledyKonsoli.push('Log: ' + par.entry.text + (par.entry.url ? ' (' + par.entry.url + ')' : ''));
      if (metoda === 'Network.requestWillBeSent') this.zapytania.push({ url: par.request.url, typ: par.type });
      if (metoda === 'Page.javascriptDialogOpening') { this.zdarzenia.push('okno-js: ' + par.message); this.wyslij('Page.handleJavaScriptDialog', { accept: true }).catch(() => {}); }
      for (const s of this.sluchaczeZdarzen || []) s(metoda, par);
    });
  }
  wyslij(m, par) { return this.p.cdp.wyslij(m, par, this.sesja); }
  async wlacz() {
    await Promise.all(['Page.enable', 'Runtime.enable', 'Network.enable', 'Log.enable'].map((m) => this.wyslij(m)));
    await this.wyslij('Network.setCacheDisabled', { cacheDisabled: true });
    /* Strona zachowuje się jak aktywne okno (fokus z klawiatury, :focus-visible) */
    await this.wyslij('Emulation.setFocusEmulationEnabled', { enabled: true });
  }
  czekajNaZdarzenie(nazwa, limit) {
    return new Promise((ok, blad) => {
      const t = setTimeout(() => { usun(); blad(new Error('Nie doczekano się: ' + nazwa)); }, limit || 15000);
      this.sluchaczeZdarzen = this.sluchaczeZdarzen || [];
      const f = (m, p) => { if (m === nazwa) { clearTimeout(t); usun(); ok(p); } };
      const usun = () => { this.sluchaczeZdarzen = this.sluchaczeZdarzen.filter((x) => x !== f); };
      this.sluchaczeZdarzen.push(f);
    });
  }
  /* Wykonuje kod w stronie. Można podać funkcję i argumenty (przekazywane jako JSON). */
  async js(kod, ...arg) {
    const wyr = typeof kod === 'function' ? '(' + kod.toString() + ')(' + arg.map((a) => JSON.stringify(a)).join(',') + ')' : kod;
    const w = await this.wyslij('Runtime.evaluate', { expression: wyr, awaitPromise: true, returnByValue: true, userGesture: true });
    if (w.exceptionDetails) throw new Error('Błąd w stronie: ' + ((w.exceptionDetails.exception && w.exceptionDetails.exception.description) || w.exceptionDetails.text));
    return w.result.value;
  }
  async gotowa(limit) {
    const koniec = Date.now() + (limit || 10000);
    while (Date.now() < koniec) {
      try {
        const ok = await this.js(`document.readyState === 'complete' && !!document.getElementById('tresc') && document.getElementById('tresc').children.length > 0`);
        if (ok) { await this.js('document.fonts ? document.fonts.ready.then(() => true) : true'); await czekaj(60); return; }
      } catch (e) { /* strona się jeszcze ładuje */ }
      await czekaj(40);
    }
    throw new Error('Strona nie wczytała się w czasie');
  }
  async idz(adres, opcje) {
    opcje = opcje || {};
    const ladowanie = this.czekajNaZdarzenie('Page.loadEventFired', 20000);
    await this.wyslij('Page.navigate', { url: adres });
    await ladowanie;
    if (opcje.bezCzekania) return;
    await this.gotowa();
  }
  async przeladuj() {
    const ladowanie = this.czekajNaZdarzenie('Page.loadEventFired', 20000);
    await this.wyslij('Page.reload', { ignoreCache: true });
    await ladowanie;
    await this.gotowa();
  }
  /* Wstecz / dalej przeglądarki (historia), bez przeładowania strony */
  async historia(kierunek) {
    const h = await this.wyslij('Page.getNavigationHistory');
    const cel = h.entries[h.currentIndex + kierunek];
    if (!cel) return false;
    await this.wyslij('Page.navigateToHistoryEntry', { entryId: cel.id });
    await czekaj(250);
    return true;
  }
  async ustawRozmiar(szer, wys, o) {
    o = o || {};
    await this.wyslij('Emulation.setDeviceMetricsOverride', { width: szer, height: wys, deviceScaleFactor: o.skala || 1, mobile: !!o.mobile });
    await this.wyslij('Emulation.setTouchEmulationEnabled', { enabled: !!o.mobile, maxTouchPoints: o.mobile ? 5 : 1 });
  }
  async media(cechy) { await this.wyslij('Emulation.setEmulatedMedia', { features: cechy || [] }); }
  async blokuj(adresy) { await this.wyslij('Network.setBlockedURLs', { urls: adresy || [] }); }
  async srodek(selektor, nr) {
    return this.js((sel, nr) => {
      const el = typeof sel === 'string' ? document.querySelectorAll(sel)[nr || 0] : null;
      if (!el) return null;
      el.scrollIntoView({ block: 'center', inline: 'nearest' });
      const r = el.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height };
    }, selektor, nr);
  }
  /* Prawdziwe kliknięcie myszą w środek elementu (selektor albo {x, y}) */
  async klik(cel, o) {
    o = o || {};
    const pkt = typeof cel === 'string' ? await this.srodek(cel, o.nr) : cel;
    if (!pkt) throw new Error('Nie ma elementu do kliknięcia: ' + cel);
    const ile = o.ile || 1;
    for (let i = 1; i <= ile; i++) {
      await this.wyslij('Input.dispatchMouseEvent', { type: 'mouseMoved', x: pkt.x, y: pkt.y });
      await this.wyslij('Input.dispatchMouseEvent', { type: 'mousePressed', x: pkt.x, y: pkt.y, button: 'left', clickCount: i });
      await this.wyslij('Input.dispatchMouseEvent', { type: 'mouseReleased', x: pkt.x, y: pkt.y, button: 'left', clickCount: i });
    }
    await czekaj(o.czekaj === undefined ? 120 : o.czekaj);
    return pkt;
  }
  /* Kliknięcie elementu o danym tekście (np. przycisk „Dalej”) */
  async klikTekst(tekst, o) {
    o = o || {};
    const pkt = await this.js((t, zakres) => {
      const kandydaci = [...document.querySelectorAll((zakres || '') + ' a, ' + (zakres || '') + ' button, ' + (zakres || '') + ' label, ' + (zakres || '') + ' summary')]
        .filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && !e.closest('[hidden]') && !e.closest('[inert]'); });
      const oknoOtwarte = document.querySelector('dialog[open]');
      const lista = oknoOtwarte ? kandydaci.filter((e) => oknoOtwarte.contains(e)) : kandydaci;
      const norm = (s) => s.replace(/\s+/g, ' ').trim();
      const el = lista.find((e) => norm(e.textContent) === t) || lista.find((e) => norm(e.textContent).indexOf(t) >= 0) || lista.find((e) => (e.getAttribute('aria-label') || '').indexOf(t) >= 0);
      if (!el) return null;
      el.scrollIntoView({ block: 'center' });
      const r = el.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    }, tekst, o.zakres || '');
    if (!pkt) throw new Error('Nie ma przycisku ani linku „' + tekst + '”');
    return this.klik(pkt, o);
  }
  async klawisz(nazwa, o) {
    o = o || {};
    const k = KLAWISZE[nazwa] || { key: nazwa, code: 'Key' + nazwa.toUpperCase(), windowsVirtualKeyCode: nazwa.toUpperCase().charCodeAt(0), text: nazwa };
    const mod = o.shift ? 8 : 0;
    const ile = o.ile || 1;
    for (let i = 0; i < ile; i++) {
      await this.wyslij('Input.dispatchKeyEvent', Object.assign({ type: k.text ? 'keyDown' : 'rawKeyDown', modifiers: mod }, k));
      await this.wyslij('Input.dispatchKeyEvent', Object.assign({ type: 'keyUp', modifiers: mod }, k, { text: undefined }));
    }
    await czekaj(o.czekaj === undefined ? 60 : o.czekaj);
  }
  async pisz(tekst) { await this.wyslij('Input.insertText', { text: tekst }); await czekaj(40); }
  async zrzut(plik) {
    const z = await this.wyslij('Page.captureScreenshot', { format: 'png' });
    fs.mkdirSync(path.dirname(plik), { recursive: true });
    fs.writeFileSync(plik, Buffer.from(z.data, 'base64'));
  }
  async zamknij() {
    this.odpinanie();
    try { await this.p.cdp.wyslij('Target.closeTarget', { targetId: this.cel }); } catch (e) { /* nic */ }
  }
}

class Przegladarka {
  static async uruchom() {
    const plik = znajdzPrzegladarke();
    const profil = fs.mkdtempSync(path.join(os.tmpdir(), 'mobywatel-testy-'));
    const proc = spawn(plik, ['--headless=new', '--remote-debugging-port=0', '--user-data-dir=' + profil, '--no-first-run',
      '--no-default-browser-check', '--disable-extensions', '--hide-scrollbars', '--lang=pl-PL', '--mute-audio', '--window-size=1280,900',
      '--disable-features=Translate,MediaRouter', 'about:blank'], { stdio: 'ignore' });
    const plikPortu = path.join(profil, 'DevToolsActivePort');
    let tekst = null;
    for (let i = 0; i < 200 && !tekst; i++) {
      await czekaj(50);
      if (fs.existsSync(plikPortu)) { const t = fs.readFileSync(plikPortu, 'utf8').split('\n'); if (t.length >= 2 && t[1]) tekst = t; }
    }
    if (!tekst) throw new Error('Przeglądarka nie wystartowała: ' + plik);
    const cdp = await Cdp.polacz('ws://127.0.0.1:' + tekst[0].trim() + tekst[1].trim());
    const p = new Przegladarka();
    p.cdp = cdp; p.proc = proc; p.profil = profil; p.plik = plik;
    p.wersja = (await cdp.wyslij('Browser.getVersion')).product;
    return p;
  }
  /* Nowa karta. prywatna: true = osobny profil jak w oknie prywatnym (bez wspólnej pamięci) */
  async nowaStrona(o) {
    o = o || {};
    const par = { url: 'about:blank' };
    if (o.prywatna) par.browserContextId = (await this.cdp.wyslij('Target.createBrowserContext', { disposeOnDetach: true })).browserContextId;
    else if (o.kontekst) par.browserContextId = o.kontekst;
    const { targetId } = await this.cdp.wyslij('Target.createTarget', par);
    const { sessionId } = await this.cdp.wyslij('Target.attachToTarget', { targetId, flatten: true });
    const s = new Strona(this, sessionId, targetId);
    s.kontekst = par.browserContextId;
    await s.wlacz();
    await s.ustawRozmiar(o.szer || 390, o.wys || 844, { mobile: o.mobile });
    return s;
  }
  async zamknij() {
    try { await this.cdp.wyslij('Browser.close'); } catch (e) { /* nic */ }
    this.cdp.zamknij();
    await czekaj(300);
    try { this.proc.kill(); } catch (e) { /* nic */ }
    try { fs.rmSync(this.profil, { recursive: true, force: true }); } catch (e) { /* zostanie w katalogu tymczasowym */ }
  }
}

module.exports = { Przegladarka, Strona, czekaj };

/* Prosty klient Chrome DevTools Protocol (bez dodatkowych pakietów — wbudowany WebSocket z Node 22+).
   Pozwala sterować przeglądarką: otwierać strony, klikać, pisać, zmieniać rozmiar ekranu. */
'use strict';

class Cdp {
  constructor(ws) {
    this.ws = ws;
    this.nr = 0;
    this.czekajace = new Map();
    this.sluchacze = [];
    ws.addEventListener('message', (e) => {
      const m = JSON.parse(typeof e.data === 'string' ? e.data : Buffer.from(e.data).toString());
      if (m.id !== undefined) {
        const c = this.czekajace.get(m.id);
        if (!c) return;
        this.czekajace.delete(m.id);
        if (m.error) c.blad(new Error(c.metoda + ': ' + m.error.message));
        else c.ok(m.result);
      } else {
        for (const s of this.sluchacze) s(m.method, m.params || {}, m.sessionId);
      }
    });
  }
  static polacz(adres) {
    return new Promise((ok, blad) => {
      const ws = new WebSocket(adres);
      ws.addEventListener('open', () => ok(new Cdp(ws)));
      ws.addEventListener('error', (e) => blad(new Error('Nie udało się połączyć z przeglądarką: ' + (e.message || adres))));
    });
  }
  wyslij(metoda, parametry, sesja) {
    const id = ++this.nr;
    const wiad = { id, method: metoda, params: parametry || {} };
    if (sesja) wiad.sessionId = sesja;
    return new Promise((ok, blad) => {
      this.czekajace.set(id, { ok, blad, metoda });
      this.ws.send(JSON.stringify(wiad));
    });
  }
  sluchaj(f) { this.sluchacze.push(f); return () => { this.sluchacze = this.sluchacze.filter((x) => x !== f); }; }
  zamknij() { try { this.ws.close(); } catch (e) { /* nic */ } }
}

module.exports = { Cdp };

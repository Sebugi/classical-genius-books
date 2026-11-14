// Sebugi Books: legge le frasi da data/frasi.json
let tutte = [];
let disponibili = [];
let corrente = null;
let ctx = null; // cosa è in gioco (quanti libri, autori, generi)
let risposte = {};

const sel = { nazione: new Set(), genere: new Set(), autore: new Set(), libro: new Set() };
const el = id => document.getElementById(id);

// ---------- Lingua dell'interfaccia ----------
const TESTI = {
    it: {sottotitolo:'Riconosci il libro dalle sue parole', scegli:'Scegli come vuoi giocare', livello:'Livello',
        suggerimento:'Tocca per scegliere, anche più di uno. Se non scegli niente, vanno bene tutti.',
        tutteFrasi:'Tutte le frasi', celebri:'Frasi celebri', resto:'Resto del libro', genere:'Genere', nazione:'Nazione', autore:'Autore',
        libro:'Libro', gioca:'Inizia a giocare', giocaSubito:'Inizia a giocare se non vuoi scegliere niente',
        fPrivacy:'Privacy', fTermini:"Condizioni d'uso", fAvviso:'Non affiliazione',
        domanda:'Di quale libro è questa frase?', domandaAutore:'Di quale libro di {autore} è questa frase?',
        domandaUno:'Frase da «{libro}»',
        corretto:'Corretto', insicuro:'Insicuro', sbagliato:'Sbagliato',
        nonricordavo:'Non ricordavo', nonsapevo:'Non lo sapevo', mostra:'Mostra risposta', home:'← Home',
        scegliAutore:'Scegli uno o più autori per vedere i loro libri',
        finite:'Hai visto tutte le frasi! Ricomincia.', nessuna:'Nessuna frase trovata con queste scelte! Prova a togliere qualche filtro.',
        statTitolo:'Le tue risposte', statN:'{n} su {t}',
        ripassa:'Ripassa le tue risposte', ripassaNota:'Scegli quali frasi rivedere.', cancellaVoti:'Cancella le mie risposte',
        confermaCancella:'Vuoi cancellare tutte le tue risposte salvate? Non si può annullare.', nessunaCat:'Non ci sono frasi in questa categoria.'},
    en: {sottotitolo:'Recognise the book from its words', scegli:'Choose how to play', livello:'Level',
        suggerimento:"Tap to choose, as many as you like. If you choose nothing, everything is included.",
        tutteFrasi:'All phrases', celebri:'Famous quotes', resto:'Rest of the book', genere:'Genre', nazione:'Country', autore:'Author',
        libro:'Book', gioca:'Start playing', giocaSubito:"Start playing if you don't want to choose anything",
        fPrivacy:'Privacy', fTermini:'Terms of use', fAvviso:'Disclaimer',
        domanda:'Which book is this phrase from?', domandaAutore:'Which book by {autore} is this phrase from?',
        domandaUno:'A phrase from "{libro}"',
        corretto:'Correct', insicuro:'Unsure', sbagliato:'Wrong',
        nonricordavo:'I forgot it', nonsapevo:"I didn't know", mostra:'Show answer', home:'← Home',
        scegliAutore:'Choose one or more authors to see their books',
        finite:"You've seen all the phrases! Start again.", nessuna:'No phrases found with these choices!',
        statTitolo:'Your answers', statN:'{n} of {t}',
        ripassa:'Review your answers', ripassaNota:'Choose which phrases to see again.', cancellaVoti:'Delete my answers',
        confermaCancella:'Delete all your saved answers? This cannot be undone.', nessunaCat:'There are no phrases in this category.'},
    de: {sottotitolo:'Erkenne das Buch an seinen Worten', scegli:'Wähle, wie du spielen möchtest', livello:'Stufe',
        suggerimento:'Tippe zum Auswählen, auch mehrere. Wenn du nichts wählst, ist alles dabei.',
        tutteFrasi:'Alle Sätze', celebri:'Berühmte Zitate', resto:'Rest des Buches', genere:'Genre', nazione:'Land', autore:'Autor',
        libro:'Buch', gioca:'Spiel starten', giocaSubito:'Spiel starten, wenn du nichts auswählen möchtest',
        fPrivacy:'Privacy', fTermini:'Terms of use', fAvviso:'Disclaimer',
        domanda:'Aus welchem Buch stammt dieser Satz?', domandaAutore:'Aus welchem Buch von {autore} stammt dieser Satz?',
        domandaUno:'Ein Satz aus „{libro}“',
        corretto:'Richtig', insicuro:'Unsicher', sbagliato:'Falsch',
        nonricordavo:'Vergessen', nonsapevo:'Wusste ich nicht', mostra:'Antwort zeigen', home:'← Start',
        scegliAutore:'Wähle einen oder mehrere Autoren, um ihre Bücher zu sehen',
        finite:'Du hast alle Sätze gesehen! Fang neu an.', nessuna:'Keine Sätze für diese Auswahl gefunden!',
        statTitolo:'Deine Antworten', statN:'{n} von {t}',
        ripassa:'Deine Antworten wiederholen', ripassaNota:'Wähle, welche Sätze du noch einmal sehen willst.', cancellaVoti:'Meine Antworten löschen',
        confermaCancella:'Alle gespeicherten Antworten löschen? Das kann nicht rückgängig gemacht werden.', nessunaCat:'In dieser Kategorie gibt es keine Sätze.'}
};
let ui = 'it';
try { ui = localStorage.getItem('cgb-ui') || 'it'; } catch (e) {}
try { const l = new URLSearchParams(location.search).get('lang'); if (l && TESTI[l]) ui = l; } catch (e) {}
if (!TESTI[ui]) ui = 'it';
const T = (k, v) => {
    let s = TESTI[ui][k];
    if (v) Object.keys(v).forEach(x => { s = s.replace('{' + x + '}', v[x]); });
    return s;
};

// ---------- Risposte salvate sul dispositivo ----------
const CHIAVE_VOTI = 'cgb-voti';
let voti = {};
try { voti = JSON.parse(localStorage.getItem(CHIAVE_VOTI) || '{}') || {}; } catch (e) { voti = {}; }
const salvaVoti = () => { try { localStorage.setItem(CHIAVE_VOTI, JSON.stringify(voti)); } catch (e) {} };
const idFrase = x => {
    let h = 5381;
    const t = x.libro + '|' + x.testo;
    for (let i = 0; i < t.length; i++) h = ((h << 5) + h + t.charCodeAt(i)) | 0;
    return (h >>> 0).toString(36);
};
const contaVoti = () => {
    const r = {};
    Object.keys(voti).forEach(k => { r[voti[k]] = (r[voti[k]] || 0) + 1; });
    return r;
};

const CATEGORIE = [
    ['corretto', 'btn-corretto'], ['insicuro', 'btn-insicuro'], ['sbagliato', 'btn-sbagliato'],
    ['nonricordavo', 'btn-nonricordo'], ['nonsapevo', 'btn-nonsapevo']
];

function mostraHome() {
    el('schermata-home').style.display = 'block';
    el('schermata-gioco').style.display = 'none';
}
function mostraGioco() {
    el('schermata-home').style.display = 'none';
    el('schermata-gioco').style.display = 'block';
}

// ---------- Scelte a bottoni (genere, autore, libro) ----------
const basePerLivello = () => {
    const lv = el('sel-livello').value;
    const lg = el('sel-lingua').value;
    // Con l'interfaccia italiana la frase è mostrata in italiano: servono solo le frasi già tradotte
    return tutte.filter(x => (!lv || String(x.livello) === lv) && (!lg || x.lingua === lg) && (ui === 'it' ? x.it : (x.lingua !== 'it' || x.en)));
};
const NAZ = {
    'Regno Unito': { it: 'Regno Unito', en: 'United Kingdom', de: 'Vereinigtes Königreich' },
    'Irlanda': { it: 'Irlanda', en: 'Ireland', de: 'Irland' },
    'Stati Uniti': { it: 'Stati Uniti', en: 'United States', de: 'USA' },
    'Canada': { it: 'Canada', en: 'Canada', de: 'Kanada' },
    'Italia': { it: 'Italia', en: 'Italy', de: 'Italien' },
    'Russia': { it: 'Russia', en: 'Russia', de: 'Russland' },
    'Francia': { it: 'Francia', en: 'France', de: 'Frankreich' },
    'Spagna': { it: 'Spagna', en: 'Spain', de: 'Spanien' },
    'Germania': { it: 'Germania', en: 'Germany', de: 'Deutschland' },
    'Svizzera': { it: 'Svizzera', en: 'Switzerland', de: 'Schweiz' },
    'Norvegia': { it: 'Norvegia', en: 'Norway', de: 'Norwegen' },
    'Cina': { it: 'Cina', en: 'China', de: 'China' },
    'Polonia': { it: 'Polonia', en: 'Poland', de: 'Polen' },
    'Austria-Ungheria': { it: 'Austria-Ungheria', en: 'Austria-Hungary', de: 'Österreich-Ungarn' }
};
const etichetta = (tipo, v) => tipo === 'nazione' && NAZ[v] ? NAZ[v][ui] : v;
const conInsieme = (valore, insieme) => insieme.size === 0 || insieme.has(valore);

function disegnaChips(id, tipo, valori) {
    const box = el(id);
    box.innerHTML = '';
    [...valori].sort((a, b) => etichetta(tipo, a).localeCompare(etichetta(tipo, b))).forEach(v => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'chip' + (sel[tipo].has(v) ? ' on' : '');
        b.textContent = etichetta(tipo, v);
        b.setAttribute('aria-pressed', sel[tipo].has(v));
        b.addEventListener('click', () => {
            if (sel[tipo].has(v)) sel[tipo].delete(v); else sel[tipo].add(v);
            aggiornaScelte();
        });
        box.appendChild(b);
    });
}

function aggiornaScelte() {
    const base = basePerLivello();
    const nazioni = new Set(base.map(x => x.nazione));
    sel.nazione.forEach(n => { if (!nazioni.has(n)) sel.nazione.delete(n); });
    const perNazione = base.filter(x => conInsieme(x.nazione, sel.nazione));
    const generi = new Set(perNazione.map(x => x.genere));
    sel.genere.forEach(g => { if (!generi.has(g)) sel.genere.delete(g); });

    const perGenere = perNazione.filter(x => conInsieme(x.genere, sel.genere));
    const autori = new Set(perGenere.map(x => x.autore));
    sel.autore.forEach(a => { if (!autori.has(a)) sel.autore.delete(a); });

    const libri = new Set(perGenere.filter(x => sel.autore.has(x.autore)).map(x => x.libro));
    sel.libro.forEach(l => { if (!libri.has(l)) sel.libro.delete(l); });

    disegnaChips('chip-nazione', 'nazione', nazioni);
    disegnaChips('chip-genere', 'genere', generi);
    disegnaChips('chip-autore', 'autore', autori);
    if (sel.autore.size) {
        disegnaChips('chip-libro', 'libro', libri);
    } else {
        el('chip-libro').innerHTML = '<p class="suggerimento">' + T('scegliAutore') + '</p>';
    }
}

function filtrate() {
    return basePerLivello().filter(x =>
        conInsieme(x.nazione, sel.nazione) && conInsieme(x.genere, sel.genere) && conInsieme(x.autore, sel.autore) && conInsieme(x.libro, sel.libro));
}

// ---------- Gioco ----------
function testoDomanda() {
    if (!ctx) return T('domanda');
    if (ctx.libri === 1) return T('domandaUno', {libro: ctx.libro});
    if (ctx.autori === 1) return T('domandaAutore', {autore: ctx.autore});
    return T('domanda');
}

// Nell'interfaccia italiana la domanda è la traduzione; sotto la risposta compare l'originale inglese
const testoFrase = x => ui === 'it' ? (x.it || x.testo) : (x.lingua === 'it' ? x.en : x.testo);
// Sotto la risposta: l'originale (inglese per l'interfaccia italiana, italiano per le altre)
const originaleDi = x => ui === 'it' ? (x.lingua === 'en' ? x.testo : '') : (x.lingua === 'it' ? x.testo : '');

function prossima() {
    if (disponibili.length === 0) {
        alert(T('finite'));
        mostraHome();
        return;
    }
    corrente = disponibili.pop();
    el('info-frase').textContent = testoDomanda();
    el('testo-frase').textContent = testoFrase(corrente);
    el('illustrazione').innerHTML = '';
    el('risposta').style.display = 'none';
    el('btn-mostra-risposta').style.display = 'block';
}

function mostraRisposta() {
    if (!corrente) return;
    // Quello che l'utente ha già scelto non va ripetuto come se fosse una scoperta
    const t = el('titolo-risposta'), a = el('autore-risposta'), g = el('genere-risposta');
    t.textContent = corrente.libro;  t.style.display = ctx.libri > 1 ? '' : 'none';
    a.textContent = corrente.autore; a.style.display = ctx.autori > 1 ? '' : 'none';
    g.textContent = corrente.genere; g.style.display = ctx.generi > 1 ? '' : 'none';
    disegnaIllustrazione(corrente.genere);
    el('traduzione-risposta').textContent = originaleDi(corrente);
    el('risposta').style.display = 'block';
    el('btn-mostra-risposta').style.display = 'none';
}

// ---------- Grafico delle risposte ----------
function disegnaStatistiche() {
    risposte = contaVoti();
    disegnaMiniVoti();
    disegnaRipasso();
    const tot = CATEGORIE.reduce((s, [k]) => s + (risposte[k] || 0), 0);
    el('statistiche').style.display = tot ? 'block' : 'none';
    if (!tot) return;
    el('stat-titolo').textContent = T('statTitolo') + ' · ' + tot;
    el('stat-grafico').innerHTML = CATEGORIE.map(([k]) => {
        const n = risposte[k] || 0;
        const p = Math.round(n * 100 / tot);
        return `<div class="stat-col stat-${k}">
            <span class="stat-pct">${p}%</span>
            <div class="stat-asta"><div class="stat-riempi" style="height:${p}%"></div></div>
            <span class="stat-nome">${T(k)}</span>
            <span class="stat-n">${n}</span>
        </div>`;
    }).join('');
}

function disegnaMiniVoti() {
    const r = risposte;
    const tot = CATEGORIE.reduce((n, [k]) => n + (r[k] || 0), 0);
    el('mini-voti').style.display = tot ? 'flex' : 'none';
    el('mini-voti').innerHTML = CATEGORIE.map(([k]) =>
        `<span class="mini-voto stat-${k}" title="${T(k)}"><i></i>${r[k] || 0}</span>`).join('');
}

// ---------- Ripasso delle risposte salvate ----------
function disegnaRipasso() {
    const r = risposte;
    const tot = CATEGORIE.reduce((n, [k]) => n + (r[k] || 0), 0);
    el('ripasso').style.display = tot ? 'block' : 'none';
    if (!tot) return;
    el('ripasso-bottoni').innerHTML = CATEGORIE.map(([k]) =>
        `<button type="button" class="chip ripasso-btn stat-${k}" data-cat="${k}" ${r[k] ? '' : 'disabled'}>${T(k)} · ${r[k] || 0}</button>`).join('');
    el('ripasso-bottoni').querySelectorAll('button').forEach(b => b.addEventListener('click', () => avviaRipasso(b.dataset.cat)));
}

function avviaRipasso(cat) {
    const scelte = basePerLivelloTutte().filter(x => voti[idFrase(x)] === cat);
    if (scelte.length === 0) { alert(T('nessunaCat')); return; }
    const diversi = campo => new Set(scelte.map(x => x[campo]));
    ctx = {
        libri: diversi('libro').size, autori: diversi('autore').size, generi: diversi('genere').size,
        libro: scelte[0].libro, autore: scelte[0].autore
    };
    disponibili = scelte.sort(() => Math.random() - 0.5);
    mostraGioco();
    prossima();
}
const basePerLivelloTutte = () => tutte.filter(x => ui === 'it' ? x.it : (x.lingua !== 'it' || x.en));

function registra(chiave) {
    if (corrente) { voti[idFrase(corrente)] = chiave; salvaVoti(); }
    disegnaStatistiche();
    prossima();
}

// ---------- Lingua: applica ----------
function applicaLingua() {
    document.documentElement.lang = ui;
    document.querySelectorAll('[data-i18n]').forEach(n => { n.textContent = T(n.dataset.i18n); });
    document.querySelectorAll('#sel-interfaccia button').forEach(b => b.classList.toggle('attivo', b.dataset.ui === ui));
    if (tutte.length) aggiornaScelte();
    if (corrente) {
        el('info-frase').textContent = testoDomanda();
        el('testo-frase').textContent = testoFrase(corrente);
        el('traduzione-risposta').textContent =
            (el('risposta').style.display === 'block') ? originaleDi(corrente) : '';
    }
    disegnaStatistiche();
}

document.querySelectorAll('#sel-interfaccia button').forEach(b => b.addEventListener('click', () => {
    ui = b.dataset.ui;
    try { localStorage.setItem('cgb-ui', ui); } catch (e) {}
    applicaLingua();
}));

el('sel-livello').addEventListener('change', aggiornaScelte);

const avviaGioco = () => {
    const scelte = filtrate();
    if (scelte.length === 0) {
        alert(T('nessuna'));
        return;
    }
    const diversi = campo => new Set(scelte.map(x => x[campo]));
    ctx = {
        libri: diversi('libro').size, autori: diversi('autore').size, generi: diversi('genere').size,
        libro: scelte[0].libro, autore: scelte[0].autore
    };
    disegnaStatistiche();
    disponibili = scelte.sort(() => Math.random() - 0.5);
    mostraGioco();
    prossima();
};
['btn-gioca', 'btn-gioca-subito'].forEach(id => el(id).addEventListener('click', avviaGioco));

el('btn-home').addEventListener('click', () => { mostraHome(); disegnaStatistiche(); });
el('btn-cancella-voti').addEventListener('click', () => {
    if (!confirm(T('confermaCancella'))) return;
    voti = {};
    try { localStorage.removeItem(CHIAVE_VOTI); } catch (e) {}
    disegnaStatistiche();
});
el('btn-mostra-risposta').addEventListener('click', mostraRisposta);
CATEGORIE.forEach(([k, id]) => el(id).addEventListener('click', () => registra(k)));

async function avvio() {
    const r = await fetch('data/frasi.json');
    tutte = await r.json();
    applicaLingua();
}
applicaLingua();
avvio();

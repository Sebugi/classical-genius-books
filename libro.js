// Pagina di un singolo libro: stesso meccanismo dell'app (frase, risposta, autovalutazione, grafico)
const LIBRO = document.body.dataset.libro;
const TITOLO = document.body.dataset.titolo;
const DATI = document.body.dataset.dati || '../data/frasi.json';
const LANG = document.documentElement.lang === 'en' ? 'en' : 'it';
const el = id => document.getElementById(id);

const TXT = {
    it: {
        categorie: {corretto: 'Corretto', insicuro: 'Insicuro', sbagliato: 'Sbagliato', nonricordavo: 'Non ricordavo', nonsapevo: 'Non lo sapevo'},
        statTitolo: 'Le tue risposte',
        questo: 'Questa frase è proprio di ' + TITOLO + '.',
        avanti: 'Avanti', risultato: 'Vedi il risultato',
        punteggio: (p, n) => 'Ne hai riconosciute ' + p + ' su ' + n,
        alto: 'Ottimo, conosci bene questo libro e i suoi compagni di scaffale.',
        medio: 'Buon risultato. Nel quiz completo puoi allenarti su tutti i libri e ripassare gli errori.',
        basso: 'Si impara giocando: ogni frase che non conoscevi è una da ricordare. Riprova o passa al quiz completo.'
    },
    en: {
        categorie: {corretto: 'Correct', insicuro: 'Unsure', sbagliato: 'Wrong', nonricordavo: 'I forgot it', nonsapevo: "I didn't know"},
        statTitolo: 'Your answers',
        questo: 'This phrase really is from ' + TITOLO + '.',
        avanti: 'Next', risultato: 'See your score',
        punteggio: (p, n) => 'You recognised ' + p + ' out of ' + n,
        alto: 'Excellent, you know this book and its shelf-mates well.',
        medio: 'Good score. In the full quiz you can practise on every book and review your mistakes.',
        basso: 'You learn by playing: every phrase you did not know is one to remember. Try again or move on to the full quiz.'
    }
}[LANG];

const CATEGORIE = [
    ['corretto', 'btn-corretto'], ['insicuro', 'btn-insicuro'], ['sbagliato', 'btn-sbagliato'],
    ['nonricordavo', 'btn-nonricordo'], ['nonsapevo', 'btn-nonsapevo']
];

let domande = [];
let indice = 0;
let risposte = {};

function mescola(a) { return a.sort(() => Math.random() - 0.5); }

function disegnaStatistiche() {
    const tot = CATEGORIE.reduce((s, [k]) => s + (risposte[k] || 0), 0);
    el('statistiche').style.display = tot ? 'block' : 'none';
    if (!tot) return;
    el('stat-titolo').textContent = TXT.statTitolo + ' · ' + tot;
    el('stat-grafico').innerHTML = CATEGORIE.map(([k]) => {
        const n = risposte[k] || 0;
        const p = Math.round(n * 100 / tot);
        return `<div class="stat-col stat-${k}">
            <span class="stat-pct">${p}%</span>
            <div class="stat-asta"><div class="stat-riempi" style="height:${p}%"></div></div>
            <span class="stat-nome">${TXT.categorie[k]}</span>
            <span class="stat-n">${n}</span>
        </div>`;
    }).join('');
}

function testoDi(q) { return LANG === 'it' ? (q.it || q.testo) : (q.lingua === 'it' ? q.en : q.testo); }
function originaleDi(q) { return LANG === 'it' ? (q.lingua === 'en' ? q.testo : '') : (q.lingua === 'it' ? q.testo : ''); }

function mostraDomanda() {
    const q = domande[indice];
    el('numero').textContent = indice + 1;
    el('totale').textContent = domande.length;
    el('testo-frase').textContent = testoDi(q);
    el('card-frase').style.display = 'block';
    el('btn-mostra-risposta').style.display = 'block';
    el('risposta').style.display = 'none';
}

function mostraRisposta() {
    const q = domande[indice];
    el('titolo-risposta').textContent = q.libro;
    el('autore-risposta').textContent = q.autore;
    el('genere-risposta').textContent = q.genere;
    // Nella pagina italiana la domanda è tradotta: sotto la risposta si vede l'originale inglese
    el('traduzione-risposta').textContent = originaleDi(q);
    el('nota-libro').textContent = q.libro === LIBRO ? TXT.questo : '';
    disegnaIllustrazione(q.genere);
    el('btn-mostra-risposta').style.display = 'none';
    el('risposta').style.display = 'block';
}

function registra(chiave) {
    risposte[chiave] = (risposte[chiave] || 0) + 1;
    disegnaStatistiche();
    indice++;
    if (indice < domande.length) { mostraDomanda(); return; }
    el('card-frase').style.display = 'none';
    el('risposta').style.display = 'none';
    el('btn-mostra-risposta').style.display = 'none';
    el('fine').style.display = 'block';
    const giuste = risposte.corretto || 0;
    el('punteggio').textContent = TXT.punteggio(giuste, domande.length);
    const p = giuste / domande.length;
    el('commento-fine').textContent = p >= 0.8 ? TXT.alto : p >= 0.5 ? TXT.medio : TXT.basso;
}

function inizia(tutte) {
    // Frasi di questo libro: prima le celebri, poi (se servono) alcune frasi scelte dal testo
    const conTesto = x => LANG === 'it' ? x.it : (x.lingua !== 'it' || x.en);
    let proprie = mescola(tutte.filter(x => x.libro === LIBRO && x.livello === 1 && conTesto(x)));
    if (proprie.length < 4) {
        proprie = proprie.concat(mescola(tutte.filter(x => x.libro === LIBRO && x.vetrina && conTesto(x))).slice(0, 4 - proprie.length));
    }
    const altre = tutte.filter(x => x.libro !== LIBRO && x.livello === 1 && conTesto(x));
    const n = Math.min(5, proprie.length);
    domande = mescola([...proprie.slice(0, n), ...mescola(altre.slice()).slice(0, 10 - n)]);
    indice = 0; risposte = {};
    el('fine').style.display = 'none';
    disegnaStatistiche();
    mostraDomanda();
}

el('btn-mostra-risposta').addEventListener('click', mostraRisposta);
CATEGORIE.forEach(([k, id]) => el(id).addEventListener('click', () => registra(k)));
el('btn-ricomincia').addEventListener('click', () => fetch(DATI).then(r => r.json()).then(inizia));

fetch(DATI).then(r => r.json()).then(inizia);

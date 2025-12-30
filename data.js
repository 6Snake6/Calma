/**
 * FIV en Calma — Programa de 14 dies
 * Ordre: Mòdul 1 (Audio 2) → Mòdul 2 (Audio 1)
 *
 * IMPORTANT: Aquest contingut és de suport emocional i d'hàbits.
 * No substitueix l'assessorament mèdic ni psicològic.
 */

const PROGRAM = {
  version: "1.0.0",
  totalDays: 14,
  modules: [
    {
      id: "M1",
      title: "MÒDUL 1 — Entrena el teu cervell per viure millor (Audio 2)",
      goal: "Baixar l'alarma (estrès) i recuperar una mica d'energia amb microaccions.",
      audioUrl: "https://open.spotify.com/episode/3fbS1T8QXrioZF6TJVAr44",
      audioLabel: "Obrir l\u2019\u00e0udio 2 a Spotify",
      days: [
        {
          n: 1,
          title: "Mode alarma i incertesa (FIV)",
          why: "Quan hi ha incertesa, el cervell intenta 'resoldre-ho' rumiant. Avui només observem el patró i fem 1 pas de seguretat.",
          steps: [
            { id:"checkin", type:"checkin", title:"Check-in de 60 segons", desc:"Com estàs ara mateix? (no cal arreglar res)" },
            { id:"breath_3", type:"timer", title:"Respiració coherent (3 min)", seconds:180, desc:"Inhala 5s, exhala 5s. Suau, sense forçar." },
            { id:"air_8", type:"timer", title:"Aire a fora (8 min)", seconds:480, desc:"Sortir a la porta/terrassa/carrer. Sense objectiu, només llum i moviment." },
            { id:"journal_2", type:"journal", title:"2 frases", prompt:"Avui, la FIV em pesa sobretot quan…\nI el meu cos ho nota a… (pit, gola, panxa, espatlles…)" }
          ],
          partner: {
            phrase: "No hem de solucionar res avui. Només vull estar al teu costat.",
            action: "Oferir-li un te/aigua i seure 3 minuts en silenci (sense consells)."
          }
        },
        {
          n: 2,
          title: "Seguretat al cos abans del cap",
          why: "Si el cos baixa 1 punt d'estrès, el cap s'obre. Avui practiquem 'calmar el sistema'.",
          steps: [
            { id:"checkin", type:"checkin", title:"Check-in", desc:"Posa número a emoció/energia/rumiació." },
            { id:"breath_5", type:"timer", title:"Respiració coherent (5 min)", seconds:300, desc:"5s inhala + 5s exhala. Deixa que l'exhalació sigui una mica més llarga si et surt." },
            { id:"ground_54321", type:"tool", title:"Eina 5-4-3-2-1 (2-3 min)", desc:"Torna al present amb els sentits." },
            { id:"journal_safe", type:"journal", title:"Microseguretat", prompt:"Quina és la cosa més petita que em faria sentir 1% més segura avui?\n(Exemples: dutxa calenta, roba còmoda, caminar 5', apagar notificacions 1h…)" }
          ],
          partner: {
            phrase: "T'entenc. Fem un pas petit i prou.",
            action: "Pactar un 'matí sense pressa': 1 microtasca abans del mòbil."
          }
        },
        {
          n: 3,
          title: "Atenció: sortir del bucle",
          why: "La rumiació és un bucle d'atenció. Avui entrenem l'atenció com un múscul, molt suau.",
          steps: [
            { id:"checkin", type:"checkin", title:"Check-in", desc:"Només observar." },
            { id:"focus_10", type:"timer", title:"Tasca mecànica conscient (10 min)", seconds:600, desc:"Plats, plegar roba, ordenar 1 calaix. Sense música. Només la tasca." },
            { id:"air_10", type:"timer", title:"Aire a fora (10 min)", seconds:600, desc:"Passeig lent. Si tens pensaments, torna al tacte dels peus a terra." },
            { id:"journal_loop", type:"journal", title:"Mapa del bucle", prompt:"El meu pensament repetitiu d'avui és…\nQuè intenta protegir/evitar aquest pensament? (ex: decepció, dolor, vergonya…)" }
          ],
          partner: {
            phrase: "Quan et vingui el pensament, t'ajudo a tornar al present: peus, respiració i aquí.",
            action: "Fer junts la tasca mecànica 10' (cadascú una cosa) sense parlar."
          }
        },
        {
          n: 4,
          title: "Microrecompensa: dopamina sana",
          why: "El cervell necessita petites recompenses per tenir empenta. Avui n'activem una, encara que no en vingui de gust.",
          steps: [
            { id:"checkin", type:"checkin", title:"Check-in", desc:"Com et sents abans de començar?" },
            { id:"breath_3", type:"timer", title:"Respiració (3 min)", seconds:180, desc:"Regula primer, actua després." },
            { id:"pleasant_10", type:"journal", title:"Microplaer (10 min)", prompt:"Tria 1 cosa que sigui amable pel cos (no pantalles):\n• dutxa calenta\n• infusió\n• música suau\n• sortir al sol\n• crema a les mans\nEscriu quina faràs i quan (hora aproximada)." },
            { id:"air_8", type:"timer", title:"Aire a fora (8 min)", seconds:480, desc:"Llum + moviment = combustible suau." }
          ],
          partner: {
            phrase: "Fem una cosa petita que et faci bé, sense haver d'estar bé.",
            action: "Preparar l'ambient del microplaer (llum, manta, infusió) i marxar 10' si necessita espai."
          }
        },
        {
          n: 5,
          title: "Pantalles: ordre, no prohibició",
          why: "Les pantalles anestesien però també drenen. Avui canviem l'ordre: primer 1 activació, després pantalla.",
          steps: [
            { id:"checkin", type:"checkin", title:"Check-in", desc:"Quina és la temptació de pantalla al matí?" },
            { id:"air_10", type:"timer", title:"10 minuts a l'aire (abans del mòbil)", seconds:600, desc:"Només sortir. Si plou, finestra oberta + estirar 2 minuts." },
            { id:"breath_3", type:"timer", title:"Respiració (3 min)", seconds:180, desc:"Just després de tornar." },
            { id:"journal_screen", type:"journal", title:"Acord amable", prompt:"A partir d'avui, al matí faré:\n(1) ________ (p.ex. aire 10')\nI DESPRÉS sí que miraré el mòbil.\nQuè em pot ajudar a complir-ho? (p.ex. deixar el mòbil a la cuina)" }
          ],
          partner: {
            phrase: "No vull controlar-te; vull que el matí et faci menys mal.",
            action: "Deixar carregant els mòbils fora del dormitori (si és possible)."
          }
        },
        {
          n: 6,
          title: "Resposta al trigger (comentaris, xarxes, embarassos)",
          why: "Els triggers són normals en FIV. Avui preparem una resposta automàtica per protegir-te.",
          steps: [
            { id:"checkin", type:"checkin", title:"Check-in", desc:"Quin trigger és més freqüent?" },
            { id:"ground_54321", type:"tool", title:"5-4-3-2-1", desc:"Quan aparegui el trigger." },
            { id:"script", type:"journal", title:"Guió de 2 frases", prompt:"Escriu 2 frases per quan algú pregunti/insisteixi:\n1) 'Ara mateix estem amb un procés mèdic i preferim no parlar-ne gaire.'\n2) 'Si hi ha novetats ja ho direm nosaltres.'\n(Adapta-les al teu estil.)" },
            { id:"breath_5", type:"timer", title:"Respiració (5 min)", seconds:300, desc:"Per tancar el dia i baixar l'activació." }
          ],
          partner: {
            phrase: "Si algú pregunta, jo també puc posar el límit per protegir-nos.",
            action: "Acordar una paraula clau per marxar d'una conversa (p.ex. 'pausa')."
          }
        },
        {
          n: 7,
          title: "Revisió: quines 3 eines et funcionen?",
          why: "El cervell millora quan veu proves. Avui triem les 3 eines més útils per repetir.",
          steps: [
            { id:"checkin", type:"checkin", title:"Check-in", desc:"Com estàs comparat amb el dia 1?" },
            { id:"review", type:"journal", title:"Top 3 eines", prompt:"De tot el que has fet aquesta setmana, què t'ha ajudat més?\n1) ________\n2) ________\n3) ________\nQuina faràs cada matí durant 5 dies seguits?" },
            { id:"air_10", type:"timer", title:"Aire a fora (10 min)", seconds:600, desc:"Repetim una eina guanyadora." },
            { id:"breath_3", type:"timer", title:"Respiració (3 min)", seconds:180, desc:"Tanca el mòdul amb calma." }
          ],
          partner: {
            phrase: "M'agrada veure què et serveix. Ho repetim sense pressionar.",
            action: "Fer una mini-celebració neutra: 'avui ho has fet' (sense exigir alegria)."
          }
        }
      ]
    },
    {
      id: "M2",
      title: "MÒDUL 2 — Ensenya al cervell que és possible (Audio 1)",
      goal: "Construir 'proves' petites de possibilitat: seguretat → voler → flexibilitat.",
      audioUrl: "https://open.spotify.com/episode/1ICPxYJmwST6jzozdlc6IO",
      audioLabel: "Obrir l\u2019\u00e0udio 1 a Spotify",
      days: [
        {
          n: 8,
          title: "Definir un possible realista (no perfecte)",
          why: "El cervell es mou si veu un 'possible'. No és 'estar bé', és 'estar 1 punt millor'.",
          steps: [
            { id:"checkin", type:"checkin", title:"Check-in", desc:"On ets avui?" },
            { id:"possible", type:"journal", title:"El meu possible", prompt:"El meu 'possible' d'aquesta setmana és:\n• Llevar-me i fer ________ abans del mòbil.\n• Sortir 10' almenys ____ dies.\n• Parlar-me amb més cura quan…\nEscriu 1 objectiu petit i concret." },
            { id:"air_10", type:"timer", title:"Aire a fora (10 min)", seconds:600, desc:"Acció que dona prova." },
            { id:"breath_3", type:"timer", title:"Respiració (3 min)", seconds:180, desc:"Fixem la sensació de seguretat després d'actuar." }
          ],
          partner: {
            phrase: "No busquem perfecte. Busquem possible.",
            action: "Preguntar: 'Quin és el teu possible d'avui?' i acceptar la resposta."
          }
        },
        {
          n: 9,
          title: "Seguretat: preparar el terreny",
          why: "Quan el cervell percep risc, bloqueja. Avui dissenyem un pla perquè sigui fàcil i segur.",
          steps: [
            { id:"checkin", type:"checkin", title:"Check-in", desc:"Què et fa sentir insegura avui?" },
            { id:"plan", type:"journal", title:"Pla de seguretat", prompt:"Per fer el meu 'possible', em posaré aquestes facilitats:\n• lloc: ________\n• hora aproximada: ________\n• barrera principal: ________\n• solució mínima: ________" },
            { id:"task_10", type:"timer", title:"Tasca mecànica conscient (10 min)", seconds:600, desc:"Prova que 'jo puc començar'." },
            { id:"breath_5", type:"timer", title:"Respiració (5 min)", seconds:300, desc:"Quan el cos baixa, el cap col·labora." }
          ],
          partner: {
            phrase: "Ho fem fàcil: jo t'ajudo amb la logística.",
            action: "Eliminar 1 fricció (deixar sabates/jaqueta a punt, preparar esmorzar simple…)."
          }
        },
        {
          n: 10,
          title: "Voler: connectar amb el perquè (sense autoexigència)",
          why: "El voler real no és pressió: és sentit. En FIV, el sentit sovint és cuidar-te per poder sostenir el procés.",
          steps: [
            { id:"checkin", type:"checkin", title:"Check-in", desc:"Com està la motivació avui?" },
            { id:"values", type:"journal", title:"El meu perquè", prompt:"Vull fer aquests passos petits perquè…\n(Exemples: 'vull estar més present', 'vull patir una mica menys', 'vull cuidar la relació', 'vull tenir força per la propera etapa'.)\nEscriu 3 línies." },
            { id:"air_8", type:"timer", title:"Aire a fora (8 min)", seconds:480, desc:"Moviment suau + sentit = millor adherència." },
            { id:"pleasant_10", type:"journal", title:"Microrecompensa", prompt:"Quina microrecompensa faràs avui després d'haver complert 1 tasca?\n(no pantalles, 5-10 min)" }
          ],
          partner: {
            phrase: "El teu perquè té sentit. No cal demostrar res a ningú.",
            action: "Fer 1 pregunta bona: 'Què et cuidaria avui?' i executar-ho."
          }
        },
        {
          n: 11,
          title: "Flexibilitat: tolerar 5% d'incomoditat",
          why: "El progrés ve d'aguantar una mica d'incomoditat amb seguretat. Només 5%.",
          steps: [
            { id:"checkin", type:"checkin", title:"Check-in", desc:"Quina incomoditat és la que costa més?" },
            { id:"ladder", type:"journal", title:"Escala de flexibilitat", prompt:"Tria 1 repte micro (5%):\n• caminar 5' si no en tinc ganes\n• 3 minuts de respiració tot i la mandra\n• enviar un missatge posant un límit\nEscriu quin faràs avui i quin és el pla B si no pots." },
            { id:"breath_3", type:"timer", title:"Respiració (3 min)", seconds:180, desc:"Abans del microrepte." },
            { id:"air_10", type:"timer", title:"Microrepte (10 min)", seconds:600, desc:"Fes el microrepte triat (si és caminar, ja ho tens)." }
          ],
          partner: {
            phrase: "No és gran cosa: és 5%. Però és valent.",
            action: "Reforç neutral: 'Gràcies per fer el pas petit'."
          }
        },
        {
          n: 12,
          title: "Banc de proves: recopilar que sí que pots",
          why: "El cervell creu el que veu repetit. Avui fem un banc de proves (petites evidències).",
          steps: [
            { id:"checkin", type:"checkin", title:"Check-in", desc:"Com estàs avui?" },
            { id:"evidence_add", type:"evidence", title:"Afegeix 1 prova", desc:"Una cosa petita que has fet aquests dies (encara que sigui mínima)." },
            { id:"task_10", type:"timer", title:"Tasca mecànica (10 min)", seconds:600, desc:"Acció simple que deixa rastre." },
            { id:"journal_kind", type:"journal", title:"Frase amable", prompt:"Escriu una frase que diries a una amiga que estigués en FIV i desanimada.\nAra escriu-la per a tu." }
          ],
          partner: {
            phrase: "Mirem proves, no promeses.",
            action: "Dir-li 1 prova que tu has observat (ex: 'he vist que avui t'has dutxat i això ja és cuidar-te')."
          }
        },
        {
          n: 13,
          title: "Quan torna el dubte: guió de rescat",
          why: "El dubte tornarà. No és fallar. Avui prepares què fer quan passi.",
          steps: [
            { id:"checkin", type:"checkin", title:"Check-in", desc:"On està el dubte avui?" },
            { id:"rescue", type:"journal", title:"Guió de rescat (90 segons)", prompt:"Quan em vingui el bucle, faré:\n1) 3 respiracions lentes\n2) 5-4-3-2-1\n3) 1 tasca de 2 minuts (p.ex. fer el llit)\nQuina serà la meva tasca de 2 minuts?" },
            { id:"breath_3", type:"timer", title:"Respiració (3 min)", seconds:180, desc:"Practica el guió." },
            { id:"air_8", type:"timer", title:"Aire a fora (8 min)", seconds:480, desc:"Tanca amb moviment suau." }
          ],
          partner: {
            phrase: "Quan torni el bucle, no estàs sola. Fem el guió plegats.",
            action: "Recordar-li el pas 1 (respirar) sense discutir el pensament."
          }
        },
        {
          n: 14,
          title: "Continuïtat: el teu pla de 14 dies → 14 més",
          why: "El cervell aprèn per repetició. Avui dissenyem un pla petit per mantenir el que funciona.",
          steps: [
            { id:"checkin", type:"checkin", title:"Check-in final", desc:"Mira enrere sense jutjar." },
            { id:"plan14", type:"journal", title:"Pla de continuïtat", prompt:"Quines 2 eines faré 4 dies per setmana?\n1) ________\n2) ________\nQuin és el meu senyal d'alarma? (ex: 2 matins seguits al llit amb mòbil)\nQuina és la resposta? (ex: respirar 3' + aire 8')" },
            { id:"evidence_add", type:"evidence", title:"Afegeix 1 prova final", desc:"Què has aconseguit sostenir aquests dies?" },
            { id:"pleasant_10", type:"journal", title:"Celebració neutra", prompt:"Tria una celebració petita i neutra (no cal alegria):\n• sopar tranquil\n• bany calent\n• passeig junts\nQuina faràs avui?" }
          ],
          partner: {
            phrase: "Hem fet camí. El següent pas també el farem petit.",
            action: "Proposar una 'setmana simple': 2 eines fixes i prou."
          }
        }
      ]
    }
  ]
};

// Eines ràpides (per la pestanya Eines)
const QUICK_TOOLS = [
  {
    id: "tool_breath_180",
    title: "Respiració coherent (3 min)",
    type: "timer",
    seconds: 180,
    desc: "5s inhala + 5s exhala. Si et mareges, baixa intensitat."
  },
  {
    id: "tool_breath_300",
    title: "Respiració coherent (5 min)",
    type: "timer",
    seconds: 300,
    desc: "Regula el cos abans de discutir amb el cap."
  },
  {
    id: "tool_ground_54321",
    title: "5-4-3-2-1 (present)",
    type: "grounding",
    desc: "5 coses que veus, 4 que notes, 3 que escoltes, 2 que olores, 1 que tastes."
  },
  {
    id: "tool_task_120",
    title: "Tasca de 2 minuts",
    type: "microtask",
    desc: "Només començar. Ex: fer el llit, recollir una superfície, posar rentaplats."
  },
  {
    id: "tool_air_600",
    title: "Aire a fora (10 min)",
    type: "timer",
    seconds: 600,
    desc: "Moviment suau, llum, respiració natural."
  }
];

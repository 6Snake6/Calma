/* global PROGRAM, QUICK_TOOLS */

(() => {
  "use strict";

  const STATE_KEY = "fivcalma_state_v1";
  const ENTRIES_KEY = "fivcalma_entries_v1";
  const EVIDENCE_KEY = "fivcalma_evidence_v1";

  // ---------- Helpers ----------
  function el(tag, attrs = {}, children = []) {
    const node = document.createElement(tag);

    for (const [k, v] of Object.entries(attrs || {})) {
      if (k === "class") node.className = v;
      else if (k === "text") node.textContent = v;
      else if (k === "html") node.innerHTML = v;
      else if (k.startsWith("on") && typeof v === "function") {
        // Accepta onClick / onInput / onChange... i ho converteix a DOM nadiu
        const evt = k.slice(2).toLowerCase();
        node.addEventListener(evt, v);
      } else if (k in node && (k === "value" || k === "checked" || k === "disabled")) {
        node[k] = v;
      } else {
        node.setAttribute(k, v);
      }
    }

    const arr = Array.isArray(children) ? children : [children];
    arr.forEach((ch) => {
      if (ch === null || ch === undefined) return;
      if (Array.isArray(ch)) {
        ch.forEach((c) => node.appendChild(typeof c === "string" ? document.createTextNode(c) : c));
      } else if (typeof ch === "string") {
        node.appendChild(document.createTextNode(ch));
      } else {
        node.appendChild(ch);
      }
    });

    return node;
  }

  function todayISO() {
    const d = new Date();
    const tzOffset = d.getTimezoneOffset() * 60000;
    return new Date(d - tzOffset).toISOString().slice(0, 10);
  }
  function parseISO(s) { return new Date(s + "T00:00:00"); }
  function diffDays(aISO, bISO) {
    const a = parseISO(aISO);
    const b = parseISO(bISO);
    const ms = b.getTime() - a.getTime();
    return Math.floor(ms / (24 * 60 * 60 * 1000));
  }

  function loadJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (_e) {
      return fallback;
    }
  }
  function saveJSON(key, obj) { localStorage.setItem(key, JSON.stringify(obj)); }

  // ---------- State ----------
  function loadState() {
    return loadJSON(STATE_KEY, { startDate: null, name: "", createdAt: todayISO() });
  }
  function saveState(state) { saveJSON(STATE_KEY, state); }
  function loadEntries() { return loadJSON(ENTRIES_KEY, {}); }
  function saveEntries(entries) { saveJSON(ENTRIES_KEY, entries); }
  function loadEvidence() { return loadJSON(EVIDENCE_KEY, []); }
  function saveEvidence(list) { saveJSON(EVIDENCE_KEY, list); }

  function getDayByNumber(n) {
    for (const mod of PROGRAM.modules) {
      for (const day of mod.days) {
        if (day.n === n) return { module: mod, day };
      }
    }
    return null;
  }

  function getProgramDayNumber(state) {
    const t = todayISO();
    const start = state.startDate || t;
    let n = diffDays(start, t) + 1;
    if (n < 1) n = 1;
    if (n > PROGRAM.totalDays) n = PROGRAM.totalDays;
    return n;
  }

  function ensureTodayEntry(entries, iso, dayNumber) {
    if (!entries[iso]) {
      entries[iso] = {
        date: iso,
        dayNumber,
        mood: null,
        energy: null,
        rumination: null,
        notes: {},
        completed: [],
        updatedAt: new Date().toISOString()
      };
    } else {
      entries[iso].dayNumber = dayNumber;
    }
    return entries[iso];
  }

  function completionPct(entry, dayObj) {
    if (!entry || !dayObj) return 0;
    const stepIds = dayObj.steps.filter((s) => s.type !== "checkin").map((s) => s.id);
    if (stepIds.length === 0) return 0;
    const done = stepIds.filter((id) => entry.completed.includes(id)).length;
    return Math.round((done / stepIds.length) * 100);
  }

  function val(v) { return (v === null || v === undefined) ? "—" : String(v); }

  // ---------- UI refs ----------
  let view = null;
  let subtitleEl = null;
  let tabs = [];
  let modal = null;
  let modalTitle = null;
  let modalBody = null;

  // ---------- Timer state ----------
  let timerInterval = null;
  let remaining = 0;
  let timerTotalSeconds = 0;
  let running = false;

  function setSubtitle(text) {
    if (subtitleEl) subtitleEl.textContent = text;
  }

  // ---------- Modal ----------
  function openModal(title, bodyNode) {
    modalTitle.textContent = title;
    modalBody.innerHTML = "";
    if (bodyNode) modalBody.appendChild(bodyNode);
    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
  }

  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  function closeModal() {
    stopTimer();
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
    modalBody.innerHTML = "";
  }

  // ---------- Rendering ----------
  function render(tab) {
    const state = loadState();
    if (!state.startDate) {
      renderOnboarding();
      return;
    }

    const safeTab = tab || document.querySelector(".tab.active")?.dataset.tab || "today";
    if (safeTab === "today") renderToday();
    else if (safeTab === "tools") renderTools();
    else if (safeTab === "progress") renderProgress();
    else if (safeTab === "partner") renderPartner();
    else if (safeTab === "data") renderData();
    else renderToday();
  }

  function renderOnboarding() {
    setSubtitle("Programa de 14 dies (Mòdul 1 → Mòdul 2)");
    view.innerHTML = "";

    const state = loadState();
    const iso = todayISO();

    const card = el("div", { class: "card" }, [
      el("div", { class: "kicker", text: "Benvinguda / benvingut" }),
      el("h2", { text: "Comencem amb microaccions (sense pressa)" }),
      el("p", { text: "Aquesta app et guia 14 dies amb passos molt petits per baixar l'estrès i recuperar una mica d'energia durant la FIV. No cal estar bé per començar." }),
      el("hr", { class: "sep" }),
      el("label", { class: "small", text: "Data d'inici" }),
      el("input", { type: "date", id: "startDate", value: iso }),
      el("div", { style: "height:10px" }),
      el("label", { class: "small", text: "Nom (opcional)" }),
      el("input", { type: "text", id: "name", placeholder: "(opcional)" }),
      el("div", { style: "height:12px" }),
      el("button", {
        class: "primary",
        onClick: () => {
          const sd = document.getElementById("startDate")?.value || iso;
          const name = document.getElementById("name")?.value || "";
          state.startDate = sd;
          state.name = name;
          saveState(state);

          const entries = loadEntries();
          const dn = getProgramDayNumber(state);
          ensureTodayEntry(entries, todayISO(), dn);
          saveEntries(entries);

          tabs.forEach((b) => b.classList.remove("active"));
          const todayTab = document.querySelector('.tab[data-tab="today"]');
          if (todayTab) todayTab.classList.add("active");

          render("today");
        }
      }, "Començar avui")
    ]);

    const warn = el("div", { class: "card" }, [
      el("h2", { text: "Avís important" }),
      el("p", { text: "Aquesta app és suport emocional i d'hàbits. No substitueix professionals de salut mental ni el teu equip mèdic de FIV." }),
      el("p", { class: "note", text: "Si apareixen idees d'autolesió, desesperança intensa o risc imminent, demana ajuda immediata (112 emergències). Si ets a Catalunya, també tens el 061 (Una veu contra el suïcidi) i a Espanya la línia 024." })
    ]);

    view.appendChild(card);
    view.appendChild(warn);
  }

  function renderToday() {
    const state = loadState();
    const dayNumber = getProgramDayNumber(state);
    const ctx = getDayByNumber(dayNumber);
    if (!ctx) {
      setSubtitle("Avui");
      view.innerHTML = "";
      view.appendChild(el("div", { class: "card" }, [
        el("h2", { text: "Error de programa" }),
        el("p", { text: "No s'ha pogut trobar el dia del programa. Revisa data d'inici a Configuració." })
      ]));
      return;
    }

    const iso = todayISO();
    const entries = loadEntries();
    const entry = ensureTodayEntry(entries, iso, dayNumber);
    saveEntries(entries);

    setSubtitle(`Dia ${dayNumber} de ${PROGRAM.totalDays} — ${ctx.module.id === "M1" ? "Regular" : "Possible"}`);
    view.innerHTML = "";

    const header = el("div", { class: "card" }, [
      el("div", { class: "kicker", text: ctx.module.title }),
      el("h2", { text: `Dia ${ctx.day.n}: ${ctx.day.title}` }),
      el("p", { text: ctx.day.why }),
      el("div", { style: "height:10px" }),
      el("div", { class: "row" }, [
        el("span", { class: "pill" }, [
          el("span", { class: "small", text: "Objectiu:" }),
          el("span", { text: ctx.module.goal })
        ]),
        el("span", { class: "badge tight", text: `${completionPct(entry, ctx.day)}% completat` })
      ]),
      el("div", { style: "height:10px" }),
      el("a", { class: "primary", href: ctx.module.audioUrl || "#", target: "_blank", rel: "noopener" }, ctx.module.audioLabel || "Obrir l’àudio a Spotify")
    ]);

    const checkin = renderCheckinCard(entry, entries, iso);
    const tasks = renderTasksCard(entry, entries, iso, ctx.day);

    const safety = el("div", { class: "card" }, [
      el("h2", { text: "Recordatori suau" }),
      el("p", { text: "En dies de FIV difícils, el teu cervell pot buscar anestèsia (mòbil/tele). L'objectiu aquí no és 'ser positiva', és fer 1 pas petit perquè el cos baixi l'alarma." })
    ]);

    view.appendChild(header);
    view.appendChild(checkin);
    view.appendChild(tasks);
    view.appendChild(safety);
  }

  function renderCheckinCard(entry, entries, iso) {
    const card = el("div", { class: "card" }, [
      el("h2", { text: "Check-in (1 minut)" }),
      el("p", { text: "Posa números. No és un examen: és un termòmetre." }),
      el("hr", { class: "sep" })
    ]);

    card.appendChild(renderScore("Ànim", entry.mood, (v) => {
      entry.mood = v; entry.updatedAt = new Date().toISOString();
      entries[iso] = entry; saveEntries(entries);
      render("today");
    }));
    card.appendChild(el("div", { style: "height:8px" }));

    card.appendChild(renderScore("Energia", entry.energy, (v) => {
      entry.energy = v; entry.updatedAt = new Date().toISOString();
      entries[iso] = entry; saveEntries(entries);
      render("today");
    }));
    card.appendChild(el("div", { style: "height:8px" }));

    card.appendChild(renderScore("Rumiació", entry.rumination, (v) => {
      entry.rumination = v; entry.updatedAt = new Date().toISOString();
      entries[iso] = entry; saveEntries(entries);
      render("today");
    }));

    card.appendChild(el("div", { class: "note", text: "0 = molt baix / 10 = molt alt. Si et sents saturada, fes només respiració 3'." }));
    return card;
  }

  function renderScore(label, value, onPick) {
    const wrap = el("div");
    wrap.appendChild(el("div", { class: "row" }, [
      el("div", { class: "tight" }, el("span", { class: "pill" }, [
        el("span", { text: label }),
        el("span", { class: "small", text: value === null ? "—" : String(value) })
      ])),
      el("div", { class: "small", text: "0..10" })
    ]));

    const grid = el("div", { class: "grid" });
    for (let i = 0; i <= 10; i++) {
      grid.appendChild(el("button", { class: "score-btn" + (value === i ? " active" : ""), onClick: () => onPick(i) }, String(i)));
    }
    wrap.appendChild(grid);
    return wrap;
  }

  function renderTasksCard(entry, entries, iso, dayObj) {
    const card = el("div", { class: "card" }, [
      el("h2", { text: "Passos d'avui" }),
      el("p", { text: "Fes-los en qualsevol ordre. Si només en fas un, que sigui el de respiració." })
    ]);

    const steps = dayObj.steps.filter((s) => s.type !== "checkin");
    steps.forEach((step) => {
      const done = entry.completed.includes(step.id);
      card.appendChild(el("div", { class: "task" }, [
        el("div", { class: "meta" }, [
          el("div", { class: "name", text: step.title }),
          el("div", { class: "desc", text: step.desc || "" }),
          done ? el("div", { class: "note", text: "✓ Fet" }) : el("div", { class: "note", text: "" })
        ]),
        el("div", { class: "actions" }, [
          el("button", { class: "mini", onClick: () => openStep(step, entry, entries, iso) }, "Obrir"),
          el("button", { class: "mini", onClick: () => toggleDone(step.id, entry, entries, iso) }, done ? "Desmarcar" : "Marcar fet")
        ])
      ]));
    });

    card.appendChild(el("hr", { class: "sep" }));
    card.appendChild(el("button", {
      class: "primary",
      onClick: () => openJournalModal(
        "Notes lliures del dia",
        entry, entries, iso,
        "__free__",
        "Escriu el que necessitis. Exemple: què ha sigut més difícil avui? què t'ha ajudat 1%?"
      )
    }, "Afegir notes del dia"));

    return card;
  }

  function toggleDone(stepId, entry, entries, iso) {
    const idx = entry.completed.indexOf(stepId);
    if (idx >= 0) entry.completed.splice(idx, 1);
    else entry.completed.push(stepId);
    entry.updatedAt = new Date().toISOString();
    entries[iso] = entry; saveEntries(entries);
    render("today");
  }

  function openStep(step, entry, entries, iso) {
    if (step.type === "timer") {
      openTimerModal(step.title, step.seconds, step.desc || "", () => {
        if (!entry.completed.includes(step.id)) entry.completed.push(step.id);
        entry.updatedAt = new Date().toISOString();
        entries[iso] = entry; saveEntries(entries);
        render("today");
        closeModal();
      });
    } else if (step.type === "tool") {
      openGroundingModal(step.title, step.desc || "");
    } else if (step.type === "journal") {
      openJournalModal(step.title, entry, entries, iso, step.id, step.prompt || "");
    } else if (step.type === "evidence") {
      openEvidenceModal(entry, entries, iso, step.id);
    } else {
      openGroundingModal(step.title, step.desc || "");
    }
  }

  // ---------- Tools tab ----------
  function renderTools() {
    setSubtitle("Eines ràpides (per quan el cap no para)");
    view.innerHTML = "";

    const card = el("div", { class: "card" }, [
      el("h2", { text: "Eines ràpides" }),
      el("p", { text: "Per dies de FIV amb rumiació, cansament o bloqueig. Tria'n una i prou." }),
      el("div", { style: "height:10px" }),
      el("div", { class: "row" }, [
        el("a", { class: "ghost", href: PROGRAM.modules[0].audioUrl, target: "_blank", rel: "noopener" }, PROGRAM.modules[0].audioLabel || "Àudio 2"),
        el("a", { class: "ghost", href: PROGRAM.modules[1].audioUrl, target: "_blank", rel: "noopener" }, PROGRAM.modules[1].audioLabel || "Àudio 1")
      ])
    ]);

    QUICK_TOOLS.forEach((t) => {
      card.appendChild(el("div", { class: "task" }, [
        el("div", { class: "meta" }, [
          el("div", { class: "name", text: t.title }),
          el("div", { class: "desc", text: t.desc })
        ]),
        el("div", { class: "actions" }, [
          el("button", { class: "mini", onClick: () => openQuickTool(t) }, "Obrir")
        ])
      ]));
    });

    const evidenceCard = el("div", { class: "card" }, [
      el("h2", { text: "Banc de proves (possibles)" }),
      el("p", { text: "Quan el cervell diu 'no puc', ajuda veure evidències petites. Afegeix-ne una quan puguis." }),
      el("button", { class: "primary", onClick: () => openEvidenceModal() }, "Afegir una prova"),
      el("div", { style: "height:10px" }),
      renderEvidenceList()
    ]);

    view.appendChild(card);
    view.appendChild(evidenceCard);
  }

  function openQuickTool(tool) {
    if (tool.type === "timer") openTimerModal(tool.title, tool.seconds, tool.desc, () => closeModal());
    else if (tool.type === "grounding") openGroundingModal(tool.title, tool.desc);
    else if (tool.type === "microtask") openMicrotaskModal();
    else openGroundingModal(tool.title, tool.desc || "");
  }

  function renderEvidenceList() {
    const list = loadEvidence();
    if (!list.length) {
      return el("div", { class: "note", text: "Encara no hi ha proves guardades. Comença amb una cosa mínima (ex: 'avui he respirat 3 minuts')." });
    }
    const wrap = el("div");
    list.slice(-8).reverse().forEach((item) => {
      wrap.appendChild(el("div", { class: "task" }, [
        el("div", { class: "meta" }, [
          el("div", { class: "name", text: item.text }),
          el("div", { class: "desc", text: `Data: ${item.date}` })
        ])
      ]));
    });
    return wrap;
  }

  // ---------- Progress tab ----------
  function renderProgress() {
    setSubtitle("Progrés (petit = real)");
    view.innerHTML = "";

    const state = loadState();
    const entries = loadEntries();
    const isoToday = todayISO();

    const days = [];
    for (let i = 0; i < PROGRAM.totalDays; i++) {
      const d = parseISO(isoToday);
      d.setDate(d.getDate() - i);
      const tzOffset = d.getTimezoneOffset() * 60000;
      days.push(new Date(d - tzOffset).toISOString().slice(0, 10));
    }

    const rows = days.map((iso) => entries[iso]).filter(Boolean).reverse();
    const completedDays = rows.filter((e) => (e.completed || []).length > 0).length;

    const summary = el("div", { class: "card" }, [
      el("h2", { text: "Resum" }),
      el("div", { class: "row" }, [
        el("span", { class: "pill" }, [el("span", { class: "small", text: "Dies amb alguna acció:" }), el("span", { text: String(completedDays) })]),
        el("span", { class: "pill" }, [el("span", { class: "small", text: "Inici:" }), el("span", { text: state.startDate || "—" })])
      ]),
      el("p", { class: "note", text: "Aquest progrés no és per jutjar: és per veure patrons i reforçar el que funciona." })
    ]);

    const list = el("div", { class: "card" }, [
      el("h2", { text: "Últims dies" }),
      el("p", { text: "Ànim / Energia / Rumiació (0..10) i percentatge del dia." }),
      el("hr", { class: "sep" })
    ]);

    if (rows.length === 0) {
      list.appendChild(el("p", { class: "note", text: "Encara no hi ha registres. Fes un check-in a la pestanya Avui." }));
    } else {
      rows.slice(-14).forEach((e) => {
        const ctx = getDayByNumber(e.dayNumber);
        const pct = ctx ? completionPct(e, ctx.day) : 0;
        list.appendChild(el("div", { class: "task" }, [
          el("div", { class: "meta" }, [
            el("div", { class: "name", text: `${e.date} — Dia ${e.dayNumber}` }),
            el("div", { class: "desc", text: `${ctx ? ctx.day.title : ""}` }),
            el("div", { class: "desc", text: `Ànim: ${val(e.mood)} · Energia: ${val(e.energy)} · Rumiació: ${val(e.rumination)} · Fet: ${pct}%` })
          ])
        ]));
      });
    }

    view.appendChild(summary);
    view.appendChild(list);
  }

  // ---------- Partner tab ----------
  function renderPartner() {
    const state = loadState();
    const dayNumber = getProgramDayNumber(state);
    const ctx = getDayByNumber(dayNumber);
    if (!ctx) { renderToday(); return; }

    setSubtitle("Com a parella: presència > solucions");
    view.innerHTML = "";

    view.appendChild(el("div", { class: "card" }, [
      el("h2", { text: "Frase d'avui" }),
      el("p", { text: ctx.day.partner.phrase }),
      el("hr", { class: "sep" }),
      el("h2", { text: "Microacció d'avui" }),
      el("p", { text: ctx.day.partner.action }),
      el("div", { style: "height:12px" }),
      el("button", { class: "primary", onClick: () => openPartnerToolkit() }, "Kit ràpid per moments difícils")
    ]));

    view.appendChild(el("div", { class: "card" }, [
      el("h2", { text: "3 regles d'or (FIV)" }),
      el("p", { text: "1) Valida abans d'aconsellar. 2) Un pas petit abans de parlar molt. 3) Protegiu límits amb tercers (família/xarxes) si cal." })
    ]));
  }

  function openPartnerToolkit() {
    openModal("Kit ràpid (parella)", el("div", {}, [
      el("p", { text: "Quan la teva parella està bloquejada, prova aquesta seqüència (2-3 minuts):" }),
      el("div", { class: "task" }, [el("div", { class: "meta" }, [
        el("div", { class: "name", text: "1) Presència" }),
        el("div", { class: "desc", text: "Seu a prop. Frase curta: 'Sóc aquí'." })
      ])]),
      el("div", { class: "task" }, [el("div", { class: "meta" }, [
        el("div", { class: "name", text: "2) Cos" }),
        el("div", { class: "desc", text: "Proposa: 'Fem 3 respiracions lentes junts?'. Si diu no, respecta." })
      ])]),
      el("div", { class: "task" }, [el("div", { class: "meta" }, [
        el("div", { class: "name", text: "3) Microacció" }),
        el("div", { class: "desc", text: "Ofereix 2 opcions fàcils: 'Aire 8 minuts' o 'dutxa calenta'. Només triar." })
      ])]),
      el("p", { class: "note", text: "Evita: 'no hi pensis', 'anima't', 'hauries de…'. Primer seguretat; després ja vindrà el pensament." })
    ]));
  }

  // ---------- Settings ----------
  
  // ---------- Data tab ----------
  function renderData() {
    setSubtitle("Dades i exportació");
    view.innerHTML = "";

    const state = loadState();
    const entries = loadEntries();
    const evidence = loadEvidence();

    const card = el("div", { class: "card" }, [
      el("h2", { text: "Exportar dades" }),
      el("p", { text: "Les dades es guarden al teu dispositiu (localStorage). Aquí pots descarregar-les o compartir-les." }),
      el("hr", { class: "sep" }),

      el("div", { class: "task" }, [
        el("div", { class: "meta" }, [
          el("div", { class: "name", text: "Excel (CSV)" }),
          el("div", { class: "desc", text: "Un fitxer CSV que s'obre amb Excel/Sheets. Inclou estat + registres + banc de proves." })
        ]),
        el("div", { class: "actions" }, [
          el("button", { class: "mini", onClick: () => downloadCSV() }, "Descarregar"),
          el("button", { class: "mini", onClick: () => shareCSV() }, "Enviar (WhatsApp/Email)")
        ])
      ]),

      el("div", { class: "task" }, [
        el("div", { class: "meta" }, [
          el("div", { class: "name", text: "Còpia completa (JSON)" }),
          el("div", { class: "desc", text: "Per fer còpia de seguretat o restaurar en un altre dispositiu." })
        ]),
        el("div", { class: "actions" }, [
          el("button", { class: "mini", onClick: () => downloadJSON() }, "Descarregar")
        ])
      ]),

      el("hr", { class: "sep" }),
      el("h2", { text: "Resum" }),
      el("p", { class: "note", text: `Nom: ${state.name || "—"} · Inici: ${state.startDate || "—"}` }),
      el("p", { class: "note", text: `Registres guardats: ${Object.keys(entries).length} · Proves: ${evidence.length}` }),
      el("div", { style: "height:10px" }),

      el("button", { class: "ghost", onClick: () => openSettings() }, "Configuració / Reset"),
      el("p", { class: "note", text: "Nota: si el botó 'Enviar' no funciona al teu mòbil, descarrega el CSV i comparteix-lo des del gestor de fitxers." })
    ]);

    view.appendChild(card);
  }

  function fileSafeName(s) {
    return (s || "Usuari").trim().replace(/[^\p{L}\p{N}_-]+/gu, "_").slice(0, 40) || "Usuari";
  }

  function csvEscape(v) {
    const s = (v === null || v === undefined) ? "" : String(v);
    if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  }

  function buildCSV() {
    const state = loadState();
    const entries = loadEntries();
    const evidence = loadEvidence();

    const lines = [];
    const push = (row) => lines.push(row.map(csvEscape).join(","));

    // STATE
    lines.push("SECCIÓ,CLAU,VALOR");
    push(["STATE", "name", state.name || ""]);
    push(["STATE", "startDate", state.startDate || ""]);
    push(["STATE", "createdAt", state.createdAt || ""]);
    lines.push("");

    // EVIDENCE
    lines.push("SECCIÓ,DATA,TEXT");
    (evidence || []).forEach((e) => push(["EVIDENCE", e.date || "", e.text || ""]));
    lines.push("");

    // ENTRIES
    lines.push("SECCIÓ,DATE,DAY_NUMBER,MOOD,ENERGY,RUMINATION,COMPLETED,NOTES_JSON,UPDATED_AT");
    Object.keys(entries).sort().forEach((k) => {
      const e = entries[k];
      push([
        "ENTRY",
        e.date || k,
        e.dayNumber ?? "",
        e.mood ?? "",
        e.energy ?? "",
        e.rumination ?? "",
        Array.isArray(e.completed) ? e.completed.join("|") : "",
        JSON.stringify(e.notes || {}),
        e.updatedAt || ""
      ]);
    });

    return lines.join("\n");
  }

  function downloadBlob(filename, blob) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      URL.revokeObjectURL(a.href);
      a.remove();
    }, 0);
  }

  function downloadCSV() {
    const state = loadState();
    const name = fileSafeName(state.name);
    const fn = `FIV-Calma-${name}-${todayISO()}.csv`;
    const csv = buildCSV();
    downloadBlob(fn, new Blob([csv], { type: "text/csv;charset=utf-8" }));
  }

  async function shareCSV() {
    const state = loadState();
    const name = fileSafeName(state.name);
    const fn = `FIV-Calma-${name}-${todayISO()}.csv`;
    const csv = buildCSV();
    const file = new File([csv], fn, { type: "text/csv;charset=utf-8" });

    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          title: "Dades FIV en Calma",
          text: "Et passo el fitxer amb les dades (CSV) de l'app FIV en Calma.",
          files: [file]
        });
        return;
      } catch (_e) {
        // cancel·lat o error; fem fallback
      }
    }

    downloadBlob(fn, new Blob([csv], { type: "text/csv;charset=utf-8" }));
    alert("He descarregat el CSV. Ara el pots compartir manualment des del gestor de fitxers (WhatsApp/Email).");
  }

  function downloadJSON() {
    const state = loadState();
    const name = fileSafeName(state.name);
    const fn = `FIV-Calma-${name}-${todayISO()}.json`;

    const payload = {
      exportedAt: new Date().toISOString(),
      state: loadState(),
      entries: loadEntries(),
      evidence: loadEvidence()
    };

    downloadBlob(fn, new Blob([JSON.stringify(payload, null, 2)], { type: "application/json;charset=utf-8" }));
  }

function openSettings() {
    const state = loadState();
    openModal("Configuració", el("div", {}, [
      el("p", { text: "Configuració bàsica." }),
      el("hr", { class: "sep" }),
      el("label", { class: "small", text: "Data d'inici del programa" }),
      el("input", { type: "date", id: "setStartDate", value: state.startDate || todayISO() }),
      el("div", { style: "height:10px" }),
      el("label", { class: "small", text: "Nom (opcional)" }),
      el("input", { type: "text", id: "setName", value: state.name || "" }),
      el("div", { style: "height:12px" }),
      el("button", {
        class: "primary",
        onClick: () => {
          state.startDate = document.getElementById("setStartDate")?.value || todayISO();
          state.name = document.getElementById("setName")?.value || "";
          saveState(state);
          closeModal();
          render("today");
        }
      }, "Desar"),
      el("div", { style: "height:10px" }),
      el("button", {
        class: "ghost",
        onClick: () => {
          if (confirm("Vols esborrar totes les dades de l'app?")) {
            localStorage.removeItem(STATE_KEY);
            localStorage.removeItem(ENTRIES_KEY);
            localStorage.removeItem(EVIDENCE_KEY);
            closeModal();
            renderOnboarding();
          }
        }
      }, "Esborrar dades (reset)")
    ]));
  }

  // ---------- Journal ----------
  function openJournalModal(title, entry, entries, iso, noteKey, prompt) {
    const text = (entry.notes && entry.notes[noteKey]) ? entry.notes[noteKey] : "";
    const body = el("div", {}, [
      prompt ? el("div", { class: "small", style: "white-space:pre-wrap" }, prompt) : null,
      el("textarea", { id: "journalText", placeholder: "Escriu aquí…" }, []),
      el("div", { style: "height:10px" }),
      el("button", {
        class: "primary",
        onClick: () => {
          const v = document.getElementById("journalText")?.value || "";
          entry.notes = entry.notes || {};
          entry.notes[noteKey] = v;
          entry.updatedAt = new Date().toISOString();
          entries[iso] = entry;
          saveEntries(entries);
          closeModal();
          render("today");
        }
      }, "Desar")
    ]);

    setTimeout(() => {
      const ta = document.getElementById("journalText");
      if (ta) ta.value = text;
    }, 0);

    openModal(title, body);
  }

  // ---------- Evidence ----------
  function openEvidenceModal(entry = null, entries = null, iso = null, stepId = null) {
    openModal("Banc de proves", el("div", {}, [
      el("p", { text: "Escriu una prova petita que indiqui 'això és possible'." }),
      el("textarea", { id: "evidenceText", placeholder: "Ex: Avui he sortit 8 minuts a l'aire tot i no tenir ganes." }),
      el("div", { style: "height:10px" }),
      el("button", {
        class: "primary",
        onClick: () => {
          const txt = (document.getElementById("evidenceText")?.value || "").trim();
          if (!txt) return;

          const list = loadEvidence();
          list.push({ date: todayISO(), text: txt });
          saveEvidence(list);

          if (entry && entries && iso && stepId) {
            if (!entry.completed.includes(stepId)) entry.completed.push(stepId);
            entry.updatedAt = new Date().toISOString();
            entries[iso] = entry;
            saveEntries(entries);
          }

          closeModal();
          render(document.querySelector(".tab.active")?.dataset.tab || "today");
        }
      }, "Guardar prova")
    ]));
  }

  // ---------- Grounding ----------
  function openGroundingModal(title, desc) {
    openModal(title, el("div", {}, [
      el("p", { text: desc || "" }),
      el("div", { class: "task" }, [
        el("div", { class: "meta" }, [
          el("div", { class: "name", text: "Passos" }),
          el("div", { class: "desc", text: "1) Mira 5 coses. 2) Nota 4 sensacions al cos. 3) Escolta 3 sons. 4) Olor 2 coses. 5) 1 gust." })
        ])
      ]),
      el("p", { class: "note", text: "Si tens ansietat alta, fes-ho asseguda, amb els peus a terra." })
    ]));
  }

  function openMicrotaskModal() {
    openModal("Tasca de 2 minuts", el("div", {}, [
      el("p", { text: "Tria una tasca de 2 minuts. L'objectiu és començar, no acabar." }),
      el("div", { class: "task" }, [el("div", { class: "meta" }, [
        el("div", { class: "name", text: "Opcions ràpides" }),
        el("div", { class: "desc", text: "• Fer el llit • Rentar 3 plats • Obrir la finestra • Dutxa ràpida • Plegar 5 peces de roba" })
      ])]),
      el("label", { class: "small", text: "La meva tasca de 2 minuts avui és:" }),
      el("input", { type: "text", id: "microTaskInput", placeholder: "Escriu una tasca…" }),
      el("div", { style: "height:10px" }),
      el("button", { class: "primary", onClick: () => closeModal() }, "D'acord")
    ]));
  }

  // ---------- Timer ----------
  function openTimerModal(title, seconds, desc, onDone) {
    remaining = seconds;
    timerTotalSeconds = seconds;
    running = false;

    const timerEl = el("div", { class: "timer", id: "timer" }, formatTime(remaining));
    const status = el("div", { class: "center small", id: "timerStatus", text: desc || "" });

    const btnStart = el("button", { class: "primary", id: "btnStart", onClick: () => toggleTimer(timerEl, status) }, "Començar");
    const btnDone = el("button", { class: "ghost", onClick: () => { stopTimer(); if (onDone) onDone(); } }, "Marcar com fet");

    openModal(title, el("div", {}, [
      status,
      timerEl,
      el("div", { class: "row" }, [
        el("div", {}, btnStart),
        el("div", {}, el("button", { class: "ghost", onClick: () => resetTimer(timerEl) }, "Reiniciar"))
      ]),
      el("div", { style: "height:10px" }),
      btnDone,
      el("p", { class: "note", text: "Si et mareges respirant, para i respira natural. L'objectiu és seguretat, no rendiment." })
    ]));
  }

  function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
  }

  function toggleTimer(timerEl, statusEl) {
    const btn = document.getElementById("btnStart");
    if (!running) {
      running = true;
      statusEl.textContent = "En marxa…";
      if (btn) btn.textContent = "Pausar";
      startTimer(timerEl, statusEl);
    } else {
      running = false;
      statusEl.textContent = "En pausa.";
      if (btn) btn.textContent = "Continuar";
      stopTimer();
    }
  }

  function startTimer(timerEl, statusEl) {
    stopTimer();
    timerInterval = setInterval(() => {
      if (!running) return;
      remaining -= 1;
      if (remaining < 0) remaining = 0;
      timerEl.textContent = formatTime(remaining);
      if (remaining === 0) {
        running = false;
        stopTimer();
        statusEl.textContent = "Fet. Pots marcar com fet o tancar.";
        const btn = document.getElementById("btnStart");
        if (btn) btn.textContent = "Començar";
        if (navigator.vibrate) navigator.vibrate([80, 60, 80]);
      }
    }, 1000);
  }

  function resetTimer(timerEl) {
    stopTimer();
    running = false;
    remaining = timerTotalSeconds || remaining || 180;
    timerEl.textContent = formatTime(remaining);
    const statusEl = document.getElementById("timerStatus");
    if (statusEl) statusEl.textContent = "Reiniciat.";
    const btn = document.getElementById("btnStart");
    if (btn) btn.textContent = "Començar";
  }

  // ---------- SW ----------
  function registerSW() {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("./sw.js", { scope: "./" }).catch(() => {});
      });
    }
  }

  // ---------- Init ----------
  function init() {
    view = document.getElementById("view");
    subtitleEl = document.getElementById("subtitle");
    modal = document.getElementById("modal");
    modalTitle = document.getElementById("modalTitle");
    modalBody = document.getElementById("modalBody");

    if (!view || !subtitleEl || !modal || !modalTitle || !modalBody) {
      console.error("Falten elements base del DOM (view/subtitle/modal...).");
      return;
    }

    // Tabs
    tabs = Array.from(document.querySelectorAll(".tab"));
    tabs.forEach((btn) => btn.addEventListener("click", () => {
      tabs.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      render(btn.dataset.tab);
    }));

    // Modal close
    const modalClose = document.getElementById("modalClose");
    if (modalClose) modalClose.addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });

    // Settings
    const btnSettings = document.getElementById("btnSettings");
    if (btnSettings) btnSettings.addEventListener("click", openSettings);

    // Default active tab
    if (!document.querySelector(".tab.active")) {
      document.querySelector('.tab[data-tab="today"]')?.classList.add("active");
    }

    registerSW();
    render(document.querySelector(".tab.active")?.dataset.tab || "today");
  }

  document.addEventListener("DOMContentLoaded", init);
})();

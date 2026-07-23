(function () {
  "use strict";

  const todayKey = () => "cal-" + new Date().toISOString().slice(0, 10);
  const GOAL_KEY = "cal-goal";
  const PROTEIN_GOAL_KEY = "cal-protein-goal";
  const FAT_GOAL_KEY = "cal-fat-goal";
  const SALT_GOAL_KEY = "cal-salt-goal";
  const CARBS_GOAL_KEY = "cal-carbs-goal";

  const round1 = (n) => Math.round(n * 10) / 10;

  const el = {
    today: document.getElementById("today"),
    consumed: document.getElementById("consumed"),
    goalLabel: document.getElementById("goalLabel"),
    remaining: document.getElementById("remaining"),
    bar: document.getElementById("bar"),
    goal: document.getElementById("goal"),
    proteinConsumed: document.getElementById("proteinConsumed"),
    proteinGoalLabel: document.getElementById("proteinGoalLabel"),
    proteinRemaining: document.getElementById("proteinRemaining"),
    proteinBar: document.getElementById("proteinBar"),
    proteinGoal: document.getElementById("proteinGoal"),
    protein: document.getElementById("protein"),
    fatConsumed: document.getElementById("fatConsumed"),
    fatGoalLabel: document.getElementById("fatGoalLabel"),
    fatRemaining: document.getElementById("fatRemaining"),
    fatBar: document.getElementById("fatBar"),
    fatGoal: document.getElementById("fatGoal"),
    fat: document.getElementById("fat"),
    saltConsumed: document.getElementById("saltConsumed"),
    saltGoalLabel: document.getElementById("saltGoalLabel"),
    saltRemaining: document.getElementById("saltRemaining"),
    saltBar: document.getElementById("saltBar"),
    saltGoal: document.getElementById("saltGoal"),
    salt: document.getElementById("salt"),
    carbsConsumed: document.getElementById("carbsConsumed"),
    carbsGoalLabel: document.getElementById("carbsGoalLabel"),
    carbsRemaining: document.getElementById("carbsRemaining"),
    carbsBar: document.getElementById("carbsBar"),
    carbsGoal: document.getElementById("carbsGoal"),
    carbs: document.getElementById("carbs"),
    form: document.getElementById("foodForm"),
    name: document.getElementById("name"),
    calories: document.getElementById("calories"),
    entries: document.getElementById("entries"),
    empty: document.getElementById("empty"),
    timeline: document.getElementById("timeline"),
    timelineEmpty: document.getElementById("timelineEmpty"),
    avgCal: document.getElementById("avgCal"),
    avgProtein: document.getElementById("avgProtein"),
    avgCarbs: document.getElementById("avgCarbs"),
    avgFat: document.getElementById("avgFat"),
    avgSalt: document.getElementById("avgSalt"),
    chart: document.getElementById("chart"),
    weekEmpty: document.getElementById("weekEmpty"),
    totalsTabs: document.getElementById("totalsTabs"),
    totalsRange: document.getElementById("totalsRange"),
    totalsGrid: document.getElementById("totalsGrid"),
    totalsEmpty: document.getElementById("totalsEmpty"),
    exportExcel: document.getElementById("exportExcel"),
    clearDay: document.getElementById("clearDay"),
    backupData: document.getElementById("backupData"),
    restoreData: document.getElementById("restoreData"),
    restoreFile: document.getElementById("restoreFile"),
    scanBtn: document.getElementById("scanBtn"),
    themeToggle: document.getElementById("themeToggle"),
    scanModal: document.getElementById("scanModal"),
    scanClose: document.getElementById("scanClose"),
    scanVideo: document.getElementById("scanVideo"),
    scanVideoWrap: document.getElementById("scanVideoWrap"),
    scanStatus: document.getElementById("scanStatus"),
    barcodeInput: document.getElementById("barcodeInput"),
    barcodeLookup: document.getElementById("barcodeLookup"),
  };

  let entries = load(todayKey(), []);
  let goal = load(GOAL_KEY, 2000);
  let proteinGoal = load(PROTEIN_GOAL_KEY, 120);
  let fatGoal = load(FAT_GOAL_KEY, 70);
  let saltGoal = load(SALT_GOAL_KEY, 6);
  let carbsGoal = load(CARBS_GOAL_KEY, 250);

  function load(key, fallback) {
    try {
      const v = JSON.parse(localStorage.getItem(key));
      return v === null ? fallback : v;
    } catch (e) {
      return fallback;
    }
  }
  function save() {
    localStorage.setItem(todayKey(), JSON.stringify(entries));
    localStorage.setItem(GOAL_KEY, JSON.stringify(goal));
    localStorage.setItem(PROTEIN_GOAL_KEY, JSON.stringify(proteinGoal));
    localStorage.setItem(FAT_GOAL_KEY, JSON.stringify(fatGoal));
    localStorage.setItem(SALT_GOAL_KEY, JSON.stringify(saltGoal));
    localStorage.setItem(CARBS_GOAL_KEY, JSON.stringify(carbsGoal));
  }

  function render() {
    const total = entries.reduce((s, e) => s + e.calories, 0);
    el.consumed.textContent = total;
    el.goalLabel.textContent = goal;
    el.goal.value = goal;

    const pct = goal > 0 ? Math.min((total / goal) * 100, 100) : 0;
    el.bar.style.width = pct + "%";

    const over = total > goal;
    el.bar.style.background = over ? "var(--accent-2)" : "var(--accent)";
    el.consumed.style.color = over ? "var(--accent-2)" : "var(--accent)";

    const diff = goal - total;
    el.remaining.textContent = over
      ? Math.abs(diff) + " kcal over goal"
      : diff + " kcal remaining";

    const proteinTotal = entries.reduce((s, e) => s + (e.protein || 0), 0);
    el.proteinConsumed.textContent = proteinTotal;
    el.proteinGoalLabel.textContent = proteinGoal;
    el.proteinGoal.value = proteinGoal;

    const pPct = proteinGoal > 0 ? Math.min((proteinTotal / proteinGoal) * 100, 100) : 0;
    el.proteinBar.style.width = pPct + "%";

    const pDiff = proteinGoal - proteinTotal;
    el.proteinRemaining.textContent = pDiff >= 0
      ? pDiff + " g remaining"
      : Math.abs(pDiff) + " g over goal";

    const carbsTotal = entries.reduce((s, e) => s + (e.carbs || 0), 0);
    el.carbsConsumed.textContent = carbsTotal;
    el.carbsGoalLabel.textContent = carbsGoal;
    el.carbsGoal.value = carbsGoal;

    const cPct = carbsGoal > 0 ? Math.min((carbsTotal / carbsGoal) * 100, 100) : 0;
    el.carbsBar.style.width = cPct + "%";

    const cDiff = carbsGoal - carbsTotal;
    el.carbsRemaining.textContent = cDiff >= 0
      ? cDiff + " g remaining"
      : Math.abs(cDiff) + " g over goal";

    const fatTotal = round1(entries.reduce((s, e) => s + (e.fat || 0), 0));
    el.fatConsumed.textContent = fatTotal;
    el.fatGoalLabel.textContent = fatGoal;
    el.fatGoal.value = fatGoal;

    const fPct = fatGoal > 0 ? Math.min((fatTotal / fatGoal) * 100, 100) : 0;
    el.fatBar.style.width = fPct + "%";

    const fDiff = round1(fatGoal - fatTotal);
    el.fatRemaining.textContent = fDiff >= 0
      ? fDiff + " g remaining"
      : Math.abs(fDiff) + " g over goal";

    const saltTotal = round1(entries.reduce((s, e) => s + (e.salt || 0), 0));
    el.saltConsumed.textContent = saltTotal;
    el.saltGoalLabel.textContent = saltGoal;
    el.saltGoal.value = saltGoal;

    const sPct = saltGoal > 0 ? Math.min((saltTotal / saltGoal) * 100, 100) : 0;
    el.saltBar.style.width = sPct + "%";

    const sDiff = round1(saltGoal - saltTotal);
    el.saltRemaining.textContent = sDiff >= 0
      ? sDiff + " g remaining"
      : Math.abs(sDiff) + " g over goal";

    el.entries.innerHTML = "";
    entries.forEach((entry, i) => {
      const li = document.createElement("li");

      const name = document.createElement("span");
      name.textContent = entry.name;

      const kcal = document.createElement("span");
      kcal.className = "kcal";
      kcal.textContent = entry.calories + " kcal";

      const del = document.createElement("button");
      del.className = "del";
      del.type = "button";
      del.textContent = "×";
      del.setAttribute("aria-label", "Delete " + entry.name);
      del.addEventListener("click", () => {
        entries.splice(i, 1);
        save();
        render();
      });

      li.append(name, kcal);
      if (entry.protein) {
        const protein = document.createElement("span");
        protein.className = "protein-tag";
        protein.textContent = entry.protein + "g P";
        li.append(protein);
      }
      if (entry.carbs) {
        const carbs = document.createElement("span");
        carbs.className = "carbs-tag";
        carbs.textContent = entry.carbs + "g C";
        li.append(carbs);
      }
      if (entry.fat) {
        const fat = document.createElement("span");
        fat.className = "fat-tag";
        fat.textContent = entry.fat + "g F";
        li.append(fat);
      }
      if (entry.salt) {
        const salt = document.createElement("span");
        salt.className = "salt-tag";
        salt.textContent = entry.salt + "g S";
        li.append(salt);
      }
      li.append(del);
      el.entries.appendChild(li);
    });

    el.empty.style.display = entries.length ? "none" : "block";

    renderTimeline();
    renderWeek();
    renderTotals();
  }

  function collectPastDays() {
    const dayPrefix = "cal-";
    const today = new Date().toISOString().slice(0, 10);
    const days = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key || !key.startsWith(dayPrefix)) continue;
      const date = key.slice(dayPrefix.length);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) continue; // skip goal keys
      if (date === today) continue;

      let items;
      try {
        items = JSON.parse(localStorage.getItem(key));
      } catch (e) {
        continue;
      }
      if (!Array.isArray(items) || items.length === 0) continue;

      const calories = items.reduce((s, e) => s + (e.calories || 0), 0);
      const protein = items.reduce((s, e) => s + (e.protein || 0), 0);
      const carbs = items.reduce((s, e) => s + (e.carbs || 0), 0);
      const fat = round1(items.reduce((s, e) => s + (e.fat || 0), 0));
      const salt = round1(items.reduce((s, e) => s + (e.salt || 0), 0));
      days.push({ date, calories, protein, carbs, fat, salt, items });
    }

    days.sort((a, b) => (a.date < b.date ? 1 : -1));
    return days;
  }

  function renderTimeline() {
    const days = collectPastDays();

    el.timeline.innerHTML = "";
    days.forEach((d) => {
      const li = document.createElement("li");
      li.className = "timeline-day";

      const head = document.createElement("div");
      head.className = "timeline-head";

      const date = document.createElement("span");
      date.className = "day-date";
      date.textContent = new Date(d.date + "T00:00:00").toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
      });

      const cal = document.createElement("span");
      cal.className = "day-cal";
      cal.textContent = d.calories + " kcal";
      const toggle = document.createElement("span");
      toggle.className = "day-toggle";
      toggle.textContent = "▸";
      cal.appendChild(toggle);

      head.append(date, cal);

      const macros = document.createElement("div");
      macros.className = "timeline-macros";

      const barWrap = document.createElement("div");
      barWrap.className = "mini-bar-wrap";
      const bar = document.createElement("div");
      const over = goal > 0 && d.calories > goal;
      bar.className = "mini-bar " + (over ? "over" : "cal");
      const pct = goal > 0 ? Math.min((d.calories / goal) * 100, 100) : 0;
      bar.style.width = pct + "%";
      barWrap.appendChild(bar);

      const proteinNote = document.createElement("span");
      proteinNote.className = "protein-note";
      proteinNote.textContent = d.protein + "g P";

      const carbsNote = document.createElement("span");
      carbsNote.className = "carbs-note";
      carbsNote.textContent = d.carbs + "g C";

      const fatNote = document.createElement("span");
      fatNote.className = "fat-note";
      fatNote.textContent = d.fat + "g F";

      const saltNote = document.createElement("span");
      saltNote.className = "salt-note";
      saltNote.textContent = d.salt + "g S";

      macros.append(barWrap, proteinNote, carbsNote, fatNote, saltNote);

      const details = document.createElement("div");
      details.className = "day-details";
      d.items.forEach((item) => {
        const row = document.createElement("div");
        row.className = "detail-row";
        const n = document.createElement("span");
        n.className = "d-name";
        n.textContent =
          item.name +
          (item.protein ? " · " + item.protein + "g P" : "") +
          (item.carbs ? " · " + item.carbs + "g C" : "") +
          (item.fat ? " · " + item.fat + "g F" : "") +
          (item.salt ? " · " + item.salt + "g S" : "");
        const c = document.createElement("span");
        c.className = "d-cal";
        c.textContent = (item.calories || 0) + " kcal";
        row.append(n, c);
        details.appendChild(row);
      });

      li.append(head, macros, details);
      li.addEventListener("click", () => {
        li.classList.toggle("open");
        toggle.textContent = li.classList.contains("open") ? "▾" : "▸";
      });
      el.timeline.appendChild(li);
    });

    el.timelineEmpty.style.display = days.length ? "none" : "block";
  }

  function renderWeek() {
    const past = collectPastDays();
    const byDate = {};
    past.forEach((d) => { byDate[d.date] = d; });

    const today = new Date();
    const last7 = [];
    for (let i = 6; i >= 0; i--) {
      const dt = new Date(today);
      dt.setDate(today.getDate() - i);
      const key = dt.toISOString().slice(0, 10);
      let day = byDate[key];
      if (key === today.toISOString().slice(0, 10)) {
        // include today's live totals
        const cal = entries.reduce((s, e) => s + (e.calories || 0), 0);
        const prot = entries.reduce((s, e) => s + (e.protein || 0), 0);
        const carbs = entries.reduce((s, e) => s + (e.carbs || 0), 0);
        const fat = round1(entries.reduce((s, e) => s + (e.fat || 0), 0));
        const salt = round1(entries.reduce((s, e) => s + (e.salt || 0), 0));
        day = { date: key, calories: cal, protein: prot, carbs: carbs, fat: fat, salt: salt };
      }
      last7.push(day || { date: key, calories: 0, protein: 0, carbs: 0, fat: 0, salt: 0 });
    }

    const logged = last7.filter((d) => d.calories > 0);
    const avg = (key) =>
      logged.length
        ? Math.round(logged.reduce((s, d) => s + (d[key] || 0), 0) / logged.length)
        : 0;
    el.avgCal.textContent = avg("calories");
    el.avgProtein.textContent = avg("protein");
    el.avgCarbs.textContent = avg("carbs");
    el.avgFat.textContent = avg("fat");
    el.avgSalt.textContent = avg("salt");

    const maxCal = Math.max(goal || 0, ...last7.map((d) => d.calories), 1);

    el.chart.innerHTML = "";
    last7.forEach((d) => {
      const col = document.createElement("div");
      col.className = "chart-col";

      const val = document.createElement("span");
      val.className = "col-val";
      val.textContent = d.calories || "";

      const track = document.createElement("div");
      track.className = "bar-track";
      const bar = document.createElement("div");
      const over = goal > 0 && d.calories > goal;
      bar.className = "col-bar" + (d.calories === 0 ? " empty-day" : over ? " over" : "");
      bar.style.height = Math.round((d.calories / maxCal) * 100) + "%";
      bar.title =
        d.calories + " kcal · " + (d.protein || 0) + "g P · " +
        (d.carbs || 0) + "g C · " + (d.fat || 0) + "g F · " + (d.salt || 0) + "g S";
      track.appendChild(bar);

      const label = document.createElement("span");
      label.className = "col-label";
      label.textContent = new Date(d.date + "T00:00:00").toLocaleDateString(undefined, {
        weekday: "narrow",
      });

      col.append(val, track, label);
      el.chart.appendChild(col);
    });

    el.weekEmpty.style.display = logged.length ? "none" : "block";
  }

  /* ---------- Totals by month / 6 months / year ---------- */
  let totalsPeriod = "month";

  const pad2 = (n) => String(n).padStart(2, "0");
  const todayIso = () => new Date().toISOString().slice(0, 10);

  function periodStartIso(period) {
    const [y, m] = todayIso().split("-").map(Number);
    if (period === "year") return y + "-01-01";
    if (period === "6month") {
      let sm = m - 5;
      let sy = y;
      while (sm <= 0) {
        sm += 12;
        sy--;
      }
      return sy + "-" + pad2(sm) + "-01";
    }
    // month (current calendar month)
    return y + "-" + pad2(m) + "-01";
  }

  function daysInclusive(startIso, endIso) {
    const a = Date.parse(startIso + "T00:00:00Z");
    const b = Date.parse(endIso + "T00:00:00Z");
    return Math.round((b - a) / 86400000) + 1;
  }

  function addItems(totals, items) {
    totals.calories += items.reduce((s, e) => s + (e.calories || 0), 0);
    totals.protein += items.reduce((s, e) => s + (e.protein || 0), 0);
    totals.carbs += items.reduce((s, e) => s + (e.carbs || 0), 0);
    totals.fat += items.reduce((s, e) => s + (e.fat || 0), 0);
    totals.salt += items.reduce((s, e) => s + (e.salt || 0), 0);
  }

  function sumRange(startIso, endIso) {
    const totals = { calories: 0, protein: 0, carbs: 0, fat: 0, salt: 0, days: 0 };
    const today = todayIso();
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key || !key.startsWith("cal-")) continue;
      const date = key.slice("cal-".length);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) continue; // skip goal keys
      if (date < startIso || date > endIso) continue;
      if (date === today) continue; // today's live entries added below
      let items;
      try {
        items = JSON.parse(localStorage.getItem(key));
      } catch (e) {
        continue;
      }
      if (!Array.isArray(items) || items.length === 0) continue;
      addItems(totals, items);
      totals.days++;
    }
    if (today >= startIso && today <= endIso && entries.length) {
      addItems(totals, entries);
      totals.days++;
    }
    return totals;
  }

  function periodLabel(period) {
    if (period === "year") return "this year";
    if (period === "6month") return "the last 6 months";
    return "this month";
  }

  function renderTotals() {
    const startIso = periodStartIso(totalsPeriod);
    const endIso = todayIso();
    const totals = sumRange(startIso, endIso);
    const elapsed = daysInclusive(startIso, endIso);

    const fmtStart = new Date(startIso + "T00:00:00").toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    el.totalsRange.textContent =
      "Since " + fmtStart + " · " + totals.days + " day" + (totals.days === 1 ? "" : "s") + " logged";

    const metrics = [
      { key: "calories", label: "Calories", unit: "kcal", goal: goal, cls: "cal", dec: false },
      { key: "protein", label: "Protein", unit: "g", goal: proteinGoal, cls: "protein", dec: false },
      { key: "carbs", label: "Carbs", unit: "g", goal: carbsGoal, cls: "carbs", dec: false },
      { key: "fat", label: "Fat", unit: "g", goal: fatGoal, cls: "fat", dec: true },
      { key: "salt", label: "Salt", unit: "g", goal: saltGoal, cls: "salt", dec: true },
    ];

    el.totalsGrid.innerHTML = "";
    metrics.forEach((m) => {
      const consumed = m.dec ? round1(totals[m.key]) : Math.round(totals[m.key]);
      const goalTotal = m.dec ? round1(m.goal * elapsed) : Math.round(m.goal * elapsed);

      const card = document.createElement("div");
      card.className = "totals-item totals-" + m.cls;

      const val = document.createElement("span");
      val.className = "totals-val";
      val.textContent = consumed.toLocaleString() + " " + m.unit;

      const label = document.createElement("small");
      label.className = "totals-label";
      label.textContent = m.label;

      const goalNote = document.createElement("small");
      goalNote.className = "totals-goal";
      goalNote.textContent =
        m.goal > 0 ? "of " + goalTotal.toLocaleString() + " " + m.unit + " goal" : "no goal set";

      card.append(val, label, goalNote);
      el.totalsGrid.appendChild(card);
    });

    el.totalsGrid.style.display = totals.days ? "grid" : "none";
    el.totalsRange.style.display = totals.days ? "block" : "none";
    el.totalsEmpty.style.display = totals.days ? "none" : "block";
    el.totalsEmpty.textContent = "No data logged in " + periodLabel(totalsPeriod) + " yet.";
  }

  el.totalsTabs.addEventListener("click", (e) => {
    const btn = e.target.closest(".totals-tab");
    if (!btn) return;
    totalsPeriod = btn.getAttribute("data-period");
    el.totalsTabs.querySelectorAll(".totals-tab").forEach((b) => {
      b.classList.toggle("active", b === btn);
    });
    renderTotals();
  });

  el.today.textContent = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  el.form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = el.name.value.trim();
    const calories = parseInt(el.calories.value, 10);
    if (!name || isNaN(calories) || calories < 0) return;
    const proteinVal = parseInt(el.protein.value, 10);
    const protein = isNaN(proteinVal) || proteinVal < 0 ? 0 : proteinVal;
    const carbsVal = parseInt(el.carbs.value, 10);
    const carbs = isNaN(carbsVal) || carbsVal < 0 ? 0 : carbsVal;
    const fatVal = parseFloat(el.fat.value);
    const fat = isNaN(fatVal) || fatVal < 0 ? 0 : round1(fatVal);
    const saltVal = parseFloat(el.salt.value);
    const salt = isNaN(saltVal) || saltVal < 0 ? 0 : round1(saltVal);
    entries.push({ name, calories, protein, carbs, fat, salt });
    save();
    render();
    el.form.reset();
    el.name.focus();
  });

  el.goal.addEventListener("change", () => {
    const v = parseInt(el.goal.value, 10);
    goal = isNaN(v) || v < 0 ? 0 : v;
    save();
    render();
  });

  el.proteinGoal.addEventListener("change", () => {
    const v = parseInt(el.proteinGoal.value, 10);
    proteinGoal = isNaN(v) || v < 0 ? 0 : v;
    save();
    render();
  });

  el.carbsGoal.addEventListener("change", () => {
    const v = parseInt(el.carbsGoal.value, 10);
    carbsGoal = isNaN(v) || v < 0 ? 0 : v;
    save();
    render();
  });

  el.fatGoal.addEventListener("change", () => {
    const v = parseFloat(el.fatGoal.value);
    fatGoal = isNaN(v) || v < 0 ? 0 : round1(v);
    save();
    render();
  });

  el.saltGoal.addEventListener("change", () => {
    const v = parseFloat(el.saltGoal.value);
    saltGoal = isNaN(v) || v < 0 ? 0 : round1(v);
    save();
    render();
  });

  el.clearDay.addEventListener("click", () => {
    if (!entries.length || confirm("Clear all of today's entries?")) {
      entries = [];
      save();
      render();
    }
  });

  function csvCell(value) {
    const s = String(value == null ? "" : value);
    return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  }

  function exportToExcel() {
    const today = new Date().toISOString().slice(0, 10);
    // Gather all days: past days + today's live entries
    const allDays = collectPastDays();
    if (entries.length) {
      allDays.push({
        date: today,
        calories: entries.reduce((s, e) => s + (e.calories || 0), 0),
        protein: entries.reduce((s, e) => s + (e.protein || 0), 0),
        carbs: entries.reduce((s, e) => s + (e.carbs || 0), 0),
        fat: round1(entries.reduce((s, e) => s + (e.fat || 0), 0)),
        salt: round1(entries.reduce((s, e) => s + (e.salt || 0), 0)),
        items: entries,
      });
    }
    allDays.sort((a, b) => (a.date < b.date ? -1 : 1));

    if (!allDays.length) {
      alert("No data to export yet. Log some food first.");
      return;
    }

    const rows = [["Date", "Food", "Calories", "Protein (g)", "Carbs (g)", "Fat (g)", "Salt (g)"]];
    allDays.forEach((d) => {
      d.items.forEach((item) => {
        rows.push([d.date, item.name, item.calories || 0, item.protein || 0, item.carbs || 0, item.fat || 0, item.salt || 0]);
      });
      rows.push([d.date, "TOTAL", d.calories, d.protein, d.carbs, d.fat, d.salt]);
    });

    const csv = rows.map((r) => r.map(csvCell).join(",")).join("\r\n");
    // BOM so Excel reads UTF-8 correctly
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "calorie-tracker-" + today + ".csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  el.exportExcel.addEventListener("click", exportToExcel);

  /* ---------- Backup & Restore (device-to-device via JSON file) ---------- */
  // Only app data is included, so shared-origin keys from other GitHub Pages
  // projects on the same username.github.io domain are left untouched.
  const APP_KEY_RE = /^(cal-|wt-)/;

  function backupData() {
    const data = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && APP_KEY_RE.test(key)) {
        data[key] = localStorage.getItem(key);
      }
    }
    const payload = {
      app: "calorie-tracker",
      version: 1,
      exportedAt: new Date().toISOString(),
      data: data,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "calorie-tracker-backup-" + new Date().toISOString().slice(0, 10) + ".json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function restoreData(file) {
    const reader = new FileReader();
    reader.onload = () => {
      let payload;
      try {
        payload = JSON.parse(reader.result);
      } catch (e) {
        alert("That file isn't a valid backup (couldn't read JSON).");
        return;
      }
      if (!payload || payload.app !== "calorie-tracker" || typeof payload.data !== "object" || payload.data === null) {
        alert("That doesn't look like a Calorie Tracker backup file.");
        return;
      }
      const keys = Object.keys(payload.data).filter((k) => APP_KEY_RE.test(k));
      if (!keys.length) {
        alert("No Calorie Tracker data found in that backup.");
        return;
      }
      if (!confirm("Restore " + keys.length + " item(s)? This replaces the matching data on this device.")) {
        return;
      }
      keys.forEach((k) => {
        const v = payload.data[k];
        localStorage.setItem(k, typeof v === "string" ? v : JSON.stringify(v));
      });
      alert("Backup restored. Reloading…");
      location.reload();
    };
    reader.onerror = () => alert("Could not read that file.");
    reader.readAsText(file);
  }

  el.backupData.addEventListener("click", backupData);
  el.restoreData.addEventListener("click", () => el.restoreFile.click());
  el.restoreFile.addEventListener("change", () => {
    const file = el.restoreFile.files && el.restoreFile.files[0];
    if (file) restoreData(file);
    el.restoreFile.value = ""; // allow re-selecting the same file later
  });

  /* ---------- Barcode scanning + product lookup ---------- */
  let scanStream = null;
  let scanDetector = null;
  let scanRAF = null;
  let scanBusy = false;

  function setScanStatus(msg, kind) {
    el.scanStatus.textContent = msg;
    el.scanStatus.className = "scan-status" + (kind ? " " + kind : "");
  }

  async function openScanner() {
    el.scanModal.hidden = false;
    el.barcodeInput.value = "";
    setScanStatus("Point your camera at a barcode.");

    const hasDetector = "BarcodeDetector" in window;
    const hasCamera = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);

    if (!hasDetector || !hasCamera) {
      el.scanVideoWrap.classList.add("hidden");
      setScanStatus(
        !hasCamera
          ? "Camera not available here — enter the barcode number below."
          : "Live scanning isn't supported in this browser — enter the barcode number below.",
        "error"
      );
      el.barcodeInput.focus();
      return;
    }

    try {
      scanDetector = new window.BarcodeDetector({
        formats: ["ean_13", "ean_8", "upc_a", "upc_e", "code_128"],
      });
      scanStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      el.scanVideoWrap.classList.remove("hidden");
      el.scanVideo.srcObject = scanStream;
      await el.scanVideo.play();
      detectLoop();
    } catch (err) {
      el.scanVideoWrap.classList.add("hidden");
      setScanStatus(
        "Couldn't access the camera — enter the barcode number below.",
        "error"
      );
      el.barcodeInput.focus();
    }
  }

  async function detectLoop() {
    if (!scanDetector || !scanStream) return;
    try {
      const codes = await scanDetector.detect(el.scanVideo);
      if (codes && codes.length && !scanBusy) {
        const raw = codes[0].rawValue;
        if (raw) {
          stopCamera();
          lookupBarcode(raw);
          return;
        }
      }
    } catch (e) {
      /* transient detect errors are ignored */
    }
    scanRAF = requestAnimationFrame(detectLoop);
  }

  function stopCamera() {
    if (scanRAF) cancelAnimationFrame(scanRAF);
    scanRAF = null;
    if (scanStream) {
      scanStream.getTracks().forEach((t) => t.stop());
      scanStream = null;
    }
    el.scanVideo.srcObject = null;
  }

  function closeScanner() {
    stopCamera();
    scanDetector = null;
    el.scanModal.hidden = true;
  }

  async function lookupBarcode(code) {
    const barcode = String(code).trim();
    if (!/^\d{6,14}$/.test(barcode)) {
      setScanStatus("That doesn't look like a valid barcode number.", "error");
      return;
    }
    if (scanBusy) return;
    scanBusy = true;
    setScanStatus("Looking up " + barcode + "…");

    try {
      const res = await fetch(
        "https://world.openfoodfacts.org/api/v2/product/" +
          encodeURIComponent(barcode) +
          ".json?fields=product_name,brands,nutriments"
      );
      const data = await res.json();

      if (!data || data.status === 0 || !data.product) {
        setScanStatus("Product not found. Try entering it manually.", "error");
        scanBusy = false;
        return;
      }

      const p = data.product;
      const n = p.nutriments || {};
      const name =
        [p.brands, p.product_name].filter(Boolean).join(" ").trim() ||
        "Product " + barcode;
      const kcal = n["energy-kcal_100g"];
      const protein = n["proteins_100g"];
      const carbs = n["carbohydrates_100g"];
      const fat = n["fat_100g"];
      const salt = n["salt_100g"];

      el.name.value = name + " (per 100g)";
      if (kcal != null) el.calories.value = Math.round(kcal);
      if (protein != null) el.protein.value = Math.round(protein);
      if (carbs != null) el.carbs.value = Math.round(carbs);
      if (fat != null) el.fat.value = round1(fat);
      if (salt != null) el.salt.value = round1(salt);

      setScanStatus("Found: " + name + " — added to the form.", "success");
      scanBusy = false;
      setTimeout(() => {
        closeScanner();
        el.calories.focus();
      }, 900);
    } catch (e) {
      setScanStatus("Lookup failed (no connection?). Enter values manually.", "error");
      scanBusy = false;
    }
  }

  el.scanBtn.addEventListener("click", openScanner);
  el.scanClose.addEventListener("click", closeScanner);
  el.scanModal.addEventListener("click", (e) => {
    if (e.target === el.scanModal) closeScanner();
  });
  el.barcodeLookup.addEventListener("click", () => lookupBarcode(el.barcodeInput.value));
  el.barcodeInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      lookupBarcode(el.barcodeInput.value);
    }
  });

  /* ---------- Light / dark theme toggle ---------- */
  const THEME_KEY = "cal-theme";
  function currentTheme() {
    return document.documentElement.getAttribute("data-theme") === "light"
      ? "light"
      : "dark";
  }
  function applyTheme(theme) {
    if (theme === "light") {
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    el.themeToggle.textContent = theme === "light" ? "🌙" : "☀️";
    el.themeToggle.setAttribute(
      "aria-label",
      theme === "light" ? "Switch to dark theme" : "Switch to light theme"
    );
  }
  applyTheme(currentTheme());
  el.themeToggle.addEventListener("click", () => {
    const next = currentTheme() === "light" ? "dark" : "light";
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch (e) {}
    applyTheme(next);
  });

  render();
})();

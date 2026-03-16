const today = new Date().toISOString().slice(0, 10);

const storage = {
  workouts: "lifeos_workouts",
  studies: "lifeos_study",
  finances: "lifeos_finances",
  weights: "lifeos_weight",
  workoutDone: "lifeos_workout_done",
  studyDone: "lifeos_study_done",
  workoutMedia: "lifeos_workout_media",
  studyMedia: "lifeos_study_media",
};

let workouts = JSON.parse(localStorage.getItem(storage.workouts)) || [];
let studyLog = JSON.parse(localStorage.getItem(storage.studies)) || [];
let financeLog = JSON.parse(localStorage.getItem(storage.finances)) || [];
let weightHistory = JSON.parse(localStorage.getItem(storage.weights)) || [];
let workoutDone = JSON.parse(localStorage.getItem(storage.workoutDone)) || [];
let studyDone = JSON.parse(localStorage.getItem(storage.studyDone)) || [];
let workoutMedia = JSON.parse(localStorage.getItem(storage.workoutMedia)) || {};
let studyMedia = JSON.parse(localStorage.getItem(storage.studyMedia)) || {};

let currentWorkoutDayIndex = 0;
let currentStudyDayIndex = 0;

const svgImage = (label) =>
  `data:image/svg+xml;utf8,` +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#00e5ff"/>
          <stop offset="100%" stop-color="#7c3aed"/>
        </linearGradient>
      </defs>
      <rect width="320" height="180" rx="16" fill="#111d33"/>
      <rect x="12" y="12" width="296" height="156" rx="12" fill="url(#g)" opacity="0.15"/>
      <circle cx="80" cy="90" r="26" fill="url(#g)"/>
      <rect x="110" y="80" width="140" height="20" rx="10" fill="url(#g)"/>
      <text x="160" y="145" font-family="Syne, sans-serif" font-size="16" fill="#e2eaf7" text-anchor="middle">${label}</text>
    </svg>`
  );

function syncWindowState() {
  window.workouts = workouts;
  window.studyLog = studyLog;
  window.financeLog = financeLog;
  window.weightHistory = weightHistory;
}

function saveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function normalizeVideoUrl(url) {
  if (url.includes("youtube.com/watch?v=")) {
    const id = url.split("watch?v=")[1].split("&")[0];
    return `https://www.youtube.com/embed/${id}`;
  }
  if (url.includes("youtu.be/")) {
    const id = url.split("youtu.be/")[1].split("?")[0];
    return `https://www.youtube.com/embed/${id}`;
  }
  return url;
}

const workoutRoutine = [
  {
    day: "Segunda",
    title: "Peito + tríceps",
    items: [
      "Supino reto 4x8",
      "Supino inclinado 3x10",
      "Crucifixo máquina ou halter 3x12",
      "Crossover 3x12",
      "Tríceps pulley 3x10",
      "Tríceps francês 3x10",
    ],
    example:
      "Exemplo: supino reto. Deite no banco, pés firmes no chão, desça a barra até tocar o peito e empurre mantendo os cotovelos levemente fechados.",
    images: [
      { title: "Supino reto", src: svgImage("Supino reto") },
      { title: "Tríceps pulley", src: svgImage("Tríceps pulley") },
    ],
  },
  {
    day: "Terça",
    title: "Corrida + abdômen",
    items: [
      "Corrida 20–25 min (ritmo moderado)",
      "Elevação de pernas 3x12",
      "Abdominal máquina 3x12",
      "Prancha 3x30s",
    ],
    example:
      "Exemplo: prancha. Apoie antebraços e pontas dos pés no chão, mantenha o corpo alinhado e contraia o abdômen.",
    images: [
      { title: "Corrida", src: svgImage("Corrida") },
      { title: "Prancha", src: svgImage("Prancha") },
    ],
  },
  {
    day: "Quarta",
    title: "Costas + bíceps",
    items: [
      "Puxada na frente 4x8",
      "Remada curvada 3x10",
      "Remada baixa 3x10",
      "Pulldown 3x12",
      "Rosca direta 3x10",
      "Rosca alternada 3x10",
    ],
    example:
      "Exemplo: remada curvada. Incline o tronco, mantenha a coluna neutra e puxe a barra em direção ao umbigo.",
    images: [
      { title: "Remada", src: svgImage("Remada") },
      { title: "Rosca direta", src: svgImage("Rosca direta") },
    ],
  },
  {
    day: "Quinta",
    title: "Ombro + abdômen",
    items: [
      "Desenvolvimento halter 4x8",
      "Elevação lateral 3x12",
      "Elevação frontal 3x12",
      "Encolhimento 3x10",
      "Abdômen infra 3x12",
      "Prancha 3x40s",
    ],
    example:
      "Exemplo: elevação lateral. Levante os halteres até a linha dos ombros com cotovelos semiflexionados.",
    images: [
      { title: "Elevação lateral", src: svgImage("Elevação lateral") },
      { title: "Prancha", src: svgImage("Prancha") },
    ],
  },
  {
    day: "Sexta",
    title: "Perna (treino pesado)",
    items: [
      "Agachamento livre 4x8",
      "Leg press 3x10",
      "Cadeira extensora 3x12",
      "Mesa flexora 3x12",
      "Panturrilha em pé 4x12",
    ],
    example:
      "Exemplo: agachamento livre. Pés na largura dos ombros, desça até o quadril ficar abaixo do joelho e suba mantendo o tronco firme.",
    images: [
      { title: "Agachamento", src: svgImage("Agachamento") },
      { title: "Leg press", src: svgImage("Leg press") },
    ],
  },
  {
    day: "Sábado",
    title: "Corrida leve",
    items: [
      "Corrida 20–30 min (ritmo leve)",
      "Serve para condicionamento",
      "Queima de gordura",
      "Recuperação ativa",
    ],
    example:
      "Exemplo: corrida leve. Mantenha respiração confortável e ritmo constante sem ficar ofegante.",
    images: [{ title: "Corrida leve", src: svgImage("Corrida leve") }],
  },
  {
    day: "Domingo",
    title: "Descanso",
    items: ["Alongamento leve", "Caminhada opcional", "Hidratação e sono"],
    example:
      "Exemplo: alongamento. Segure cada posição por 20–30s sem dor.",
    images: [{ title: "Alongamento", src: svgImage("Alongamento") }],
  },
];

const studyRoutine = [
  {
    day: "Segunda",
    title: "Java",
    items: ["1h de prática guiada", "Revisão rápida de conceitos"],
    note: "Sessão sugerida: 10 min teoria, 40 min código, 10 min revisão.",
    example:
      "Exemplo: implemente uma classe `Pessoa` com atributos e um método `apresentar()`.",
    images: [{ title: "Java", src: svgImage("Java") }],
  },
  {
    day: "Terça",
    title: "Inglês",
    items: ["Leitura + vocabulário", "Escuta ativa"],
    note: "Use 30 min leitura e 30 min listening.",
    example:
      "Exemplo: assistir um vídeo curto e anotar 5 palavras novas.",
    images: [{ title: "Inglês", src: svgImage("Inglês") }],
  },
  {
    day: "Quarta",
    title: "Angular",
    items: ["Componentes básicos", "Bindings e diretivas"],
    note: "Crie um mini componente com input e lista.",
    example:
      "Exemplo: criar um componente `todo-list` com `*ngFor`.",
    images: [{ title: "Angular", src: svgImage("Angular") }],
  },
  {
    day: "Quinta",
    title: "Java",
    items: ["Orientação a objetos", "Exercícios práticos"],
    note: "Priorize problemas simples com console.",
    example:
      "Exemplo: criar um programa de lista de tarefas no console.",
    images: [{ title: "Java OO", src: svgImage("Java OO") }],
  },
  {
    day: "Sexta",
    title: "Inglês",
    items: ["Conversação (shadowing)", "Revisão de vocabulário"],
    note: "Fale em voz alta por 10–15 min.",
    example:
      "Exemplo: repetir frases e gravar sua voz.",
    images: [{ title: "Inglês fala", src: svgImage("Speaking") }],
  },
  {
    day: "Sábado",
    title: "Projeto prático (Java + Angular)",
    items: ["2h de implementação", "Testar e corrigir"],
    note: "Monte algo simples de ponta a ponta.",
    example:
      "Exemplo: criar uma lista de tarefas com backend simulado.",
    images: [{ title: "Projeto", src: svgImage("Projeto") }],
  },
  {
    day: "Domingo",
    title: "Descanso ou revisão leve",
    items: ["Revisar anotações", "Planejar a semana"],
    note: "No máximo 30 min.",
    example:
      "Exemplo: revisar 3 conceitos-chave da semana.",
    images: [{ title: "Revisão", src: svgImage("Revisão") }],
  },
];

function save(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function showToast(msg = "✅ Salvo com sucesso!") {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2800);
}

function initHeader() {
  const d = new Date();
  const opts = { weekday: "long", day: "numeric", month: "short" };
  document.getElementById("headerDate").textContent = d.toLocaleDateString(
    "pt-BR",
    opts
  );

  const hour = d.getHours();
  const msgs = [
    " Boa noite, Andreus. Hora de revisar o dia.",
    " Bom dia, Andreus. Vamos começar forte!",
    "☀️ Boa tarde, Andreus. Mantenha o foco.",
  ];
  const msg = hour < 12 ? msgs[1] : hour < 18 ? msgs[2] : msgs[0];
  document.getElementById("motivationMsg").textContent = msg;
}

function openTab(id, btn) {
  document.querySelectorAll("section").forEach((s) => s.classList.remove("active"));
  document.querySelectorAll("nav button").forEach((b) => b.classList.remove("nav-active"));
  const target = document.getElementById(id);
  if (target) target.classList.add("active");
  if (btn) btn.classList.add("nav-active");
  if (id === "dashboard") renderDashboard();
  if (id === "estudos") renderStudyPie();
  if (id === "peso") renderWeight();
}

function renderDayPicker(pickerId, data, onSelect) {
  const container = document.getElementById(pickerId);
  if (!container) return;
  container.innerHTML = "";
  data.forEach((entry, index) => {
    const btn = document.createElement("button");
    btn.className = "day-btn";
    btn.textContent = entry.day;
    btn.addEventListener("click", () => onSelect(index));
    container.appendChild(btn);
  });
}

function selectDay(pickerId, index) {
  const container = document.getElementById(pickerId);
  if (!container) return;
  const buttons = container.querySelectorAll(".day-btn");
  buttons.forEach((btn, idx) => {
    btn.classList.toggle("active", idx === index);
  });
}

function renderWorkoutDay(index) {
  const entry = workoutRoutine[index];
  if (!entry) return;
  currentWorkoutDayIndex = index;
  document.getElementById(
    "workoutDayTitle"
  ).textContent = `${entry.day} • ${entry.title}`;
  const list = document.getElementById("workoutDayList");
  list.innerHTML = "";
  entry.items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    list.appendChild(li);
  });
  if (entry.example) {
    const li = document.createElement("li");
    li.textContent = `Exemplo: ${entry.example}`;
    list.appendChild(li);
  }
  selectDay("workoutDayPicker", index);
  renderWorkoutMedia(entry, index);
  renderWorkoutDoneStatus();
  renderWorkoutDoneLog();
}

function renderStudyDay(index) {
  const entry = studyRoutine[index];
  if (!entry) return;
  currentStudyDayIndex = index;
  document.getElementById(
    "studyDayTitle"
  ).textContent = `${entry.day} • ${entry.title}`;
  const list = document.getElementById("studyDayList");
  list.innerHTML = "";
  entry.items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    list.appendChild(li);
  });
  const note = document.getElementById("studyDayNote");
  note.textContent = entry.note || "";
  if (entry.example) {
    const li = document.createElement("li");
    li.textContent = `Exemplo: ${entry.example}`;
    list.appendChild(li);
  }
  selectDay("studyDayPicker", index);
  renderStudyMedia(entry, index);
  renderStudyDoneStatus();
  renderStudyDoneLog();
}

function renderWorkoutMedia(entry, index) {
  const container = document.getElementById("workoutMedia");
  if (!container) return;
  container.innerHTML = "";
  const mediaImages = entry.images || [];
  const videoUrl = workoutMedia[index]?.video || "";
  mediaImages.forEach((img) => {
    const card = document.createElement("div");
    card.className = "media-card";
    card.innerHTML = `<img src="${img.src}" alt="${img.title}" /><div class="media-title">${img.title}</div>`;
    container.appendChild(card);
  });
  if (videoUrl) {
    const card = document.createElement("div");
    card.className = "media-card";
    card.innerHTML = `<iframe src="${videoUrl}" allowfullscreen></iframe><div class="media-title">Vídeo</div>`;
    container.appendChild(card);
  } else {
    const card = document.createElement("div");
    card.className = "media-card";
    card.innerHTML = `<div class="media-title">Sem vídeo ainda. Cole um link acima.</div>`;
    container.appendChild(card);
  }
}

function renderStudyMedia(entry, index) {
  const container = document.getElementById("studyMedia");
  if (!container) return;
  container.innerHTML = "";
  const mediaImages = entry.images || [];
  const videoUrl = studyMedia[index]?.video || "";
  mediaImages.forEach((img) => {
    const card = document.createElement("div");
    card.className = "media-card";
    card.innerHTML = `<img src="${img.src}" alt="${img.title}" /><div class="media-title">${img.title}</div>`;
    container.appendChild(card);
  });
  if (videoUrl) {
    const card = document.createElement("div");
    card.className = "media-card";
    card.innerHTML = `<iframe src="${videoUrl}" allowfullscreen></iframe><div class="media-title">Vídeo</div>`;
    container.appendChild(card);
  } else {
    const card = document.createElement("div");
    card.className = "media-card";
    card.innerHTML = `<div class="media-title">Sem vídeo ainda. Cole um link acima.</div>`;
    container.appendChild(card);
  }
}

function saveWorkoutVideo() {
  const input = document.getElementById("workoutVideoUrl");
  const url = normalizeVideoUrl(input.value.trim());
  if (!url) {
    showToast("⚠️ Cole um link de vídeo.");
    return;
  }
  workoutMedia[currentWorkoutDayIndex] = { video: url };
  saveToStorage(storage.workoutMedia, workoutMedia);
  renderWorkoutMedia(workoutRoutine[currentWorkoutDayIndex], currentWorkoutDayIndex);
  input.value = "";
  showToast("🎥 Vídeo salvo!");
}

function saveStudyVideo() {
  const input = document.getElementById("studyVideoUrl");
  const url = normalizeVideoUrl(input.value.trim());
  if (!url) {
    showToast("⚠️ Cole um link de vídeo.");
    return;
  }
  studyMedia[currentStudyDayIndex] = { video: url };
  saveToStorage(storage.studyMedia, studyMedia);
  renderStudyMedia(studyRoutine[currentStudyDayIndex], currentStudyDayIndex);
  input.value = "";
  showToast("🎥 Vídeo salvo!");
}

function markWorkoutDone() {
  const entry = workoutRoutine[currentWorkoutDayIndex];
  const key = `${today}-${entry.day}`;
  if (workoutDone.find((d) => d.key === key)) {
    showToast("✅ Já marcado hoje.");
    return;
  }
  workoutDone.push({
    key,
    date: today,
    day: entry.day,
    title: entry.title,
  });
  saveToStorage(storage.workoutDone, workoutDone);
  renderWorkoutDoneStatus();
  renderWorkoutDoneLog();
  showToast("🔥 Treino marcado!");
}

function markStudyDone() {
  const entry = studyRoutine[currentStudyDayIndex];
  const key = `${today}-${entry.day}`;
  if (studyDone.find((d) => d.key === key)) {
    showToast("✅ Já marcado hoje.");
    return;
  }
  studyDone.push({
    key,
    date: today,
    day: entry.day,
    title: entry.title,
  });
  saveToStorage(storage.studyDone, studyDone);
  renderStudyDoneStatus();
  renderStudyDoneLog();
  showToast("📘 Estudo marcado!");
}

function renderWorkoutDoneStatus() {
  const entry = workoutRoutine[currentWorkoutDayIndex];
  const status = document.getElementById("workoutDoneStatus");
  const key = `${today}-${entry.day}`;
  status.textContent = workoutDone.find((d) => d.key === key)
    ? "feito hoje"
    : "não feito hoje";
}

function renderStudyDoneStatus() {
  const entry = studyRoutine[currentStudyDayIndex];
  const status = document.getElementById("studyDoneStatus");
  const key = `${today}-${entry.day}`;
  status.textContent = studyDone.find((d) => d.key === key)
    ? "feito hoje"
    : "não feito hoje";
}

function renderWorkoutDoneLog() {
  const el = document.getElementById("workoutDoneLog");
  if (!el) return;
  const items = workoutDone.slice().reverse().slice(0, 8);
  if (!items.length) {
    el.innerHTML = '<div class="done-item"><strong>Sem histórico ainda.</strong></div>';
    return;
  }
  el.innerHTML = items
    .map(
      (item) =>
        `<div class="done-item"><strong>${item.day}</strong><span>${item.title} • ${item.date}</span></div>`
    )
    .join("");
}

function renderStudyDoneLog() {
  const el = document.getElementById("studyDoneLog");
  if (!el) return;
  const items = studyDone.slice().reverse().slice(0, 8);
  if (!items.length) {
    el.innerHTML = '<div class="done-item"><strong>Sem histórico ainda.</strong></div>';
    return;
  }
  el.innerHTML = items
    .map(
      (item) =>
        `<div class="done-item"><strong>${item.day}</strong><span>${item.title} • ${item.date}</span></div>`
    )
    .join("");
}

function saveWorkout() {
  const ex = document.getElementById("exercise").value;
  const sets = document.getElementById("sets").value;
  const reps = document.getElementById("reps").value;
  const w = document.getElementById("weight").value;
  if (!sets || !reps || !w) {
    showToast("⚠️ Preencha todos os campos.");
    return;
  }

  workouts.push({
    date: today,
    exercise: ex,
    sets: +sets,
    reps: +reps,
    weight: +w,
  });
  save(storage.workouts, workouts);
  syncWindowState();
  if (window.db) window.db.collection("workouts").add(workouts[workouts.length - 1]);
  renderWorkouts();
  updateStats();
  showToast(" Treino salvo!");
  document.getElementById("sets").value = "";
  document.getElementById("reps").value = "";
  document.getElementById("weight").value = "";
}

function renderWorkouts() {
  const el = document.getElementById("workoutLog");
  if (!workouts.length) {
    el.innerHTML =
      '<div class="empty"><div class="icon"></div>Nenhum treino registrado ainda.</div>';
    return;
  }
  el.innerHTML = [...workouts]
    .reverse()
    .slice(0, 12)
    .map(
      (w) => `
    <div class="log-item">
      <div>
        <div class="log-name">${w.exercise}</div>
        <div class="log-detail">${w.sets} séries × ${w.reps} reps — ${w.weight}kg</div>
      </div>
      <div style="display:flex; align-items:center; gap:8px;">
        <span class="tag tag-green"></span>
        <span class="log-date">${w.date}</span>
      </div>
    </div>`
    )
    .join("");
}

let timerCount = 0;
let timerInterval = null;
let timerRunning = false;

function startTimer() {
  if (timerRunning) return;
  timerRunning = true;
  timerInterval = setInterval(() => {
    timerCount += 1;
    const m = Math.floor(timerCount / 60).toString().padStart(2, "0");
    const s = (timerCount % 60).toString().padStart(2, "0");
    document.getElementById("timer").textContent = `${m}:${s}`;
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  timerRunning = false;
}

function resetTimer() {
  stopTimer();
  timerCount = 0;
  document.getElementById("timer").textContent = "00:00";
}

function saveStudy() {
  const type = document.getElementById("studyType").value;
  const hours = parseFloat(document.getElementById("studyHours").value);
  const note = document.getElementById("studyNote").value;
  if (!hours || hours <= 0) {
    showToast("⚠️ Informe as horas.");
    return;
  }

  studyLog.push({ date: today, type, hours, note });
  save(storage.studies, studyLog);
  syncWindowState();
  if (window.db) window.db.collection("studies").add(studyLog[studyLog.length - 1]);
  renderStudyLog();
  renderStudyPie();
  updateStats();
  showToast(" Sessão salva!");
  document.getElementById("studyHours").value = "";
  document.getElementById("studyNote").value = "";
}

function renderStudyLog() {
  const el = document.getElementById("studyLog");
  if (!studyLog.length) {
    el.innerHTML =
      '<div class="empty"><div class="icon"></div>Nenhuma sessão registrada.</div>';
    return;
  }
  el.innerHTML = [...studyLog]
    .reverse()
    .slice(0, 10)
    .map(
      (s) => `
    <div class="log-item">
      <div>
        <div class="log-name">${s.type}</div>
        <div class="log-detail">${s.note || "Sessão de estudo"}</div>
      </div>
      <div style="display:flex; align-items:center; gap:8px;">
        <span class="tag tag-blue">${s.hours}h</span>
        <span class="log-date">${s.date}</span>
      </div>
    </div>`
    )
    .join("");
}

let pieChart = null;
function renderStudyPie() {
  const totals = {};
  studyLog.forEach((s) => {
    totals[s.type] = (totals[s.type] || 0) + s.hours;
  });
  const labels = Object.keys(totals);
  const values = Object.values(totals);
  const colors = [
    "#00e5ff",
    "#22d3a5",
    "#a78bfa",
    "#fbbf24",
    "#f43f5e",
    "#fb923c",
    "#34d399",
  ];
  const ctx = document.getElementById("studyPieChart");
  if (pieChart) pieChart.destroy();
  if (!labels.length) return;
  pieChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels,
      datasets: [{ data: values, backgroundColor: colors, borderWidth: 0 }],
    },
    options: {
      plugins: {
        legend: { labels: { color: "#e2eaf7", font: { family: "Syne" } } },
      },
    },
  });
}

function saveFinance() {
  const label = document.getElementById("financeLabel").value.trim();
  const amount = parseFloat(document.getElementById("financeAmount").value);
  const type = document.getElementById("financeType").value;
  if (!label || !amount) {
    showToast("⚠️ Informe descrição e valor.");
    return;
  }
  financeLog.push({ date: today, label, amount, type });
  save(storage.finances, financeLog);
  syncWindowState();
  if (window.db) window.db.collection("finances").add(financeLog[financeLog.length - 1]);
  renderFinanceLog();
  showToast(" Lançamento salvo!");
  document.getElementById("financeLabel").value = "";
  document.getElementById("financeAmount").value = "";
}

function renderFinanceLog() {
  const el = document.getElementById("financeLog");
  if (!financeLog.length) {
    el.innerHTML =
      '<div class="empty"><div class="icon"></div>Nenhum lançamento registrado.</div>';
    return;
  }
  el.innerHTML = [...financeLog]
    .reverse()
    .slice(0, 12)
    .map(
      (f) => `
    <div class="log-item">
      <div>
        <div class="log-name">${f.label}</div>
        <div class="log-detail">${f.type === "entrada" ? "+" : "-"}R$ ${f.amount.toFixed(2)}</div>
      </div>
      <div style="display:flex; align-items:center; gap:8px;">
        <span class="tag tag-purple">${f.type}</span>
        <span class="log-date">${f.date}</span>
      </div>
    </div>`
    )
    .join("");
}

function saveWeight() {
  const w = parseFloat(document.getElementById("weightInput").value);
  if (!w) {
    showToast("⚠️ Informe o peso.");
    return;
  }

  weightHistory.push({ date: today, weight: w });
  save(storage.weights, weightHistory);
  syncWindowState();
  if (window.db) window.db.collection("weights").add(weightHistory[weightHistory.length - 1]);
  renderWeight();
  updateStats();
  showToast("⚖️ Peso salvo!");
  document.getElementById("weightInput").value = "";
}

let weightChart = null;
function renderWeight() {
  if (!weightHistory.length) return;
  const first = weightHistory[0].weight;
  const last = weightHistory[weightHistory.length - 1].weight;
  const delta = (last - first).toFixed(1);

  document.getElementById("weightFirst").textContent = `${first} kg`;
  document.getElementById("weightLast").textContent = `${last} kg`;
  const deltaEl = document.getElementById("weightDelta");
  deltaEl.textContent = `${delta > 0 ? "+" : ""}${delta} kg`;
  deltaEl.style.color = delta > 0 ? "var(--yellow)" : "var(--green)";

  const ctx = document.getElementById("weightChart");
  const labels = weightHistory.map((w) => w.date);
  const values = weightHistory.map((w) => w.weight);
  if (weightChart) weightChart.destroy();
  weightChart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Peso (kg)",
          data: values,
          borderColor: "#00e5ff",
          backgroundColor: "rgba(0,229,255,0.08)",
          pointBackgroundColor: "#00e5ff",
          tension: 0.4,
          fill: true,
        },
      ],
    },
    options: {
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: "#4a6080" }, grid: { color: "#1e3050" } },
        y: { ticks: { color: "#4a6080" }, grid: { color: "#1e3050" } },
      },
    },
  });
}

let weekChartInst = null;
function renderDashboard() {
  updateStats();
  renderStreakBar();

  const last7 = [];
  for (let i = 6; i >= 0; i -= 1) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const label = d.toLocaleDateString("pt-BR", { weekday: "short" });
    const hours = studyLog
      .filter((s) => s.date === key)
      .reduce((a, b) => a + b.hours, 0);
    last7.push({ label, hours });
  }

  const ctx = document.getElementById("weekChart");
  if (weekChartInst) weekChartInst.destroy();
  weekChartInst = new Chart(ctx, {
    type: "bar",
    data: {
      labels: last7.map((d) => d.label),
      datasets: [
        {
          label: "Horas",
          data: last7.map((d) => d.hours),
          backgroundColor: last7.map((d) =>
            d.hours > 0 ? "rgba(0,229,255,0.7)" : "rgba(30,48,80,0.8)"
          ),
          borderRadius: 6,
        },
      ],
    },
    options: {
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: "#4a6080" }, grid: { display: false } },
        y: {
          ticks: { color: "#4a6080" },
          grid: { color: "#1e3050" },
          beginAtZero: true,
        },
      },
    },
  });
}

function renderStreakBar() {
  const bar = document.getElementById("streakBar");
  bar.innerHTML = "";
  const activeDays = new Set([
    ...workouts.map((w) => w.date),
    ...studyLog.map((s) => s.date),
  ]);

  for (let i = 27; i >= 0; i -= 1) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const dayNum = d.getDate();
    const div = document.createElement("div");
    div.className =
      "streak-day" +
      (activeDays.has(key) ? " active" : "") +
      (key === today ? " today" : "");
    div.textContent = dayNum;
    bar.appendChild(div);
  }
}

function updateStats() {
  const totalStudy = studyLog.reduce((a, b) => a + b.hours, 0);
  document.getElementById("statStudy").textContent = `${totalStudy.toFixed(1)}h`;
  document.getElementById("statWorkouts").textContent = workouts.length;

  const activeDays = new Set([...workouts.map((w) => w.date), ...studyLog.map((s) => s.date)]);
  let streak = 0;
  let d = new Date();
  while (true) {
    const key = d.toISOString().slice(0, 10);
    if (activeDays.has(key)) {
      streak += 1;
      d.setDate(d.getDate() - 1);
    } else break;
  }
  document.getElementById("statStreak").textContent = streak;

  if (weightHistory.length) {
    document.getElementById("statWeight").textContent = `${
      weightHistory[weightHistory.length - 1].weight
    }kg`;
  }
}

const weekPlans = {
  balanced: [
    {
      day: "SEG",
      content: "Java — 1h30",
      tags: ["Estudo", "Backend"],
      tagClasses: ["tag-blue", "tag-purple"],
    },
    {
      day: "TER",
      content: "Treino de peito + bíceps",
      tags: ["Treino"],
      tagClasses: ["tag-green"],
    },
    {
      day: "QUA",
      content: "Angular — 1h + Inglês — 30min",
      tags: ["Estudo"],
      tagClasses: ["tag-blue"],
    },
    {
      day: "QUI",
      content: "Treino de costas + ombro",
      tags: ["Treino"],
      tagClasses: ["tag-green"],
    },
    {
      day: "SEX",
      content: "Spring Boot — 1h30",
      tags: ["Estudo"],
      tagClasses: ["tag-blue"],
    },
    {
      day: "SAB",
      content: "Treino de pernas + cardio",
      tags: ["Treino"],
      tagClasses: ["tag-green"],
    },
    {
      day: "DOM",
      content: "Projeto pessoal — 2h + Descanso",
      tags: ["Projeto", "Descanso"],
      tagClasses: ["tag-purple", "tag-green"],
    },
  ],
  study: [
    { day: "SEG", content: "Java — 2h", tags: ["Estudo"], tagClasses: ["tag-blue"] },
    { day: "TER", content: "Angular — 2h", tags: ["Estudo"], tagClasses: ["tag-blue"] },
    {
      day: "QUA",
      content: "Spring Boot — 1h30 + Inglês — 30min",
      tags: ["Estudo"],
      tagClasses: ["tag-blue"],
    },
    { day: "QUI", content: "Algoritmos — 2h", tags: ["Estudo"], tagClasses: ["tag-blue"] },
    { day: "SEX", content: "Projeto pessoal — 2h", tags: ["Projeto"], tagClasses: ["tag-purple"] },
    { day: "SAB", content: "Revisão semanal — 1h30", tags: ["Revisão"], tagClasses: ["tag-blue"] },
    { day: "DOM", content: "Descanso e leitura", tags: ["Descanso"], tagClasses: ["tag-green"] },
  ],
  training: [
    {
      day: "SEG",
      content: "Treino de peito + tríceps",
      tags: ["Treino"],
      tagClasses: ["tag-green"],
    },
    {
      day: "TER",
      content: "Corrida 5km + core",
      tags: ["Cardio"],
      tagClasses: ["tag-green"],
    },
    {
      day: "QUA",
      content: "Treino de costas + bíceps",
      tags: ["Treino"],
      tagClasses: ["tag-green"],
    },
    {
      day: "QUI",
      content: "Treino de ombro + abdômen",
      tags: ["Treino"],
      tagClasses: ["tag-green"],
    },
    {
      day: "SEX",
      content: "HIIT 30min + alongamento",
      tags: ["Cardio"],
      tagClasses: ["tag-green"],
    },
    {
      day: "SAB",
      content: "Treino de pernas pesado",
      tags: ["Treino"],
      tagClasses: ["tag-green"],
    },
    {
      day: "DOM",
      content: "Descanso ativo + caminhada",
      tags: ["Recuperação"],
      tagClasses: ["tag-green"],
    },
  ],
  recovery: [
    {
      day: "SEG",
      content: "Yoga ou alongamento — 30min",
      tags: ["Recuperação"],
      tagClasses: ["tag-green"],
    },
    {
      day: "TER",
      content: "Caminhada leve — 30min",
      tags: ["Ativo"],
      tagClasses: ["tag-green"],
    },
    {
      day: "QUA",
      content: "Inglês — 1h (foco leve)",
      tags: ["Estudo"],
      tagClasses: ["tag-blue"],
    },
    {
      day: "QUI",
      content: "Descanso total",
      tags: ["Descanso"],
      tagClasses: ["tag-green"],
    },
    {
      day: "SEX",
      content: "Revisão de projetos — 1h",
      tags: ["Planejamento"],
      tagClasses: ["tag-purple"],
    },
    {
      day: "SAB",
      content: "Mobilidade e recuperação",
      tags: ["Recuperação"],
      tagClasses: ["tag-green"],
    },
    {
      day: "DOM",
      content: "Planejamento da próxima semana",
      tags: ["Planejamento"],
      tagClasses: ["tag-purple"],
    },
  ],
};

function generateWeek() {
  const focus = document.getElementById("weekFocus").value;
  const plan = weekPlans[focus];
  const html = plan
    .map(
      (p) => `
    <div class="plan-item">
      <div class="plan-day">${p.day}</div>
      <div class="plan-content">${p.content}</div>
      <div class="plan-tags">
        ${p.tags
          .map(
            (t, i) => `<span class="tag ${p.tagClasses[i] || "tag-blue"}">${t}</span>`
          )
          .join("")}
      </div>
    </div>`
    )
    .join("");

  document.getElementById("weekPlan").innerHTML = `
    <div class="card">
      <h3><span class="icon"></span> Plano gerado</h3>
      ${html}
    </div>`;
}

function getWeekStart() {
  const d = new Date();
  d.setDate(d.getDate() - d.getDay());
  return d.toISOString().slice(0, 10);
}

window.getWeekStart = getWeekStart;

function runAnalysis() {
  if (typeof window.analyzeHabits === "function") {
    window.analyzeHabits();
  }
}

function init() {
  syncWindowState();
  initHeader();
  renderWorkouts();
  renderStudyLog();
  renderFinanceLog();
  renderDashboard();
  renderDayPicker("workoutDayPicker", workoutRoutine, renderWorkoutDay);
  renderDayPicker("studyDayPicker", studyRoutine, renderStudyDay);
  renderWorkoutDay(0);
  renderStudyDay(0);
}

init();

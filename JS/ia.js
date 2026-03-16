function analyzeHabits() {
  const analysisEl = document.getElementById("analysis");
  analysisEl.style.display = "block";
  analysisEl.className = "ai-box loading";
  analysisEl.innerHTML =
    '<div class="dots"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div> Analisando sua rotina...';

  const studyHours = (window.studyLog || []).reduce((sum, item) => sum + item.hours, 0);
  const workoutsThisWeek = (window.workouts || []).filter(
    (w) => w.date >= getWeekStart()
  ).length;
  const studyThisWeek = (window.studyLog || [])
    .filter((s) => s.date >= getWeekStart())
    .reduce((sum, item) => sum + item.hours, 0);
  const lastWeight =
    window.weightHistory && window.weightHistory.length
      ? window.weightHistory[window.weightHistory.length - 1].weight
      : null;

  let text = "";
  text += `• Estudo na semana: ${studyThisWeek.toFixed(1)}h\n`;
  text += `• Treinos na semana: ${workoutsThisWeek}\n`;
  text += `• Total estudado: ${studyHours.toFixed(1)}h\n`;
  text += lastWeight ? `• Último peso: ${lastWeight}kg\n\n` : "\n";

  if (studyThisWeek < 4) {
    text += "⚠️ Poucas horas de estudo. Tente pelo menos 5–6h na semana.\n";
  } else {
    text += "✅ Estudos consistentes. Continue nessa frequência.\n";
  }

  if (workoutsThisWeek < 3) {
    text += "⚠️ Treino abaixo do ideal. Busque 3–4 sessões semanais.\n";
  } else {
    text += "💪 Boa frequência de treino. Mantenha o ritmo.\n";
  }

  text += "\nAções sugeridas:\n";
  text += "• Defina um objetivo diário simples (1 bloco de estudo + 1 treino curto).\n";
  text += "• Registre tudo logo após concluir a atividade.\n";

  setTimeout(() => {
    analysisEl.className = "ai-box";
    analysisEl.textContent = text;
  }, 700);
}

window.analyzeHabits = analyzeHabits;

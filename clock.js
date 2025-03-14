const clock = document.getElementById("clock");
const dateElement = document.getElementById("date");
const timerContainer = document.getElementById("timerContainer");
let timers = [];
let globalInterval;

function updateClock() {
  const now = new Date();
  clock.innerText = formatTime(now);
  dateElement.innerText = formatDate(now);
}

function formatTime(date) {
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;
}

function formatDate(date) {
  const days = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
  return `${date.getFullYear()}년 ${String(date.getMonth() + 1).padStart(2, "0")}월 ${String(date.getDate()).padStart(2, "0")}일 (${days[date.getDay()]})`;
}

updateClock();
setInterval(updateClock, 1000);

document.getElementById("addTimerBtn").addEventListener("click", () => {
  const taskName = prompt("작업명을 입력하세요:");
  if (!taskName) return;
  timers.push({ id: Date.now(), taskName, time: 0, running: false, completed: false });
  renderTimers();
});

timerContainer.addEventListener("click", (event) => {
  const button = event.target;
  const timerCard = button.closest(".timer-card");

  if (!timerCard) return; // 🔹 부모 `.timer-card`가 없으면 함수 종료

  const id = parseInt(timerCard.dataset.id);
  const timer = timers.find((t) => t.id === id);

  if (!timer) return; // 🔹 timer가 존재하지 않으면 종료

  if (button.classList.contains("start-btn")) timer.running = true;
  if (button.classList.contains("stop-btn")) timer.running = false;
  if (button.classList.contains("reset-btn")) timer.time = 0;
  if (button.classList.contains("complete-btn")) {
    timer.completed = true;
    timer.running = false;
  }
  if (button.classList.contains("delete-btn")) timers = timers.filter((t) => t.id !== id);

  renderTimers();
});

function renderTimers() {
  timerContainer.innerHTML = "";
  timers.forEach((timer) => {
    const div = document.createElement("div");
    div.className = `timer-card ${timer.running ? "running" : ""} ${timer.completed ? "completed" : ""}`;
    div.dataset.id = timer.id;
    div.innerHTML = `
                <div class="timer-name">${timer.taskName}</div>
                <div class="timer-time">${formatTime(new Date(0, 0, 0, 0, 0, timer.time))}</div>
                <div class="timer-buttons">
                    ${
                      !timer.completed
                        ? `
                        <button class="start-btn">시작</button>
                        <button class="stop-btn">멈춤</button>
                        <button class="reset-btn">리셋</button>
                        <button class="complete-btn">완료</button>
                    `
                        : ""
                    }
                    <button class="delete-btn">삭제</button>
                </div>
            `;
    timerContainer.appendChild(div);
  });

  if (!globalInterval) {
    globalInterval = setInterval(() => {
      timers.forEach((timer) => {
        if (timer.running) timer.time++;
      });
      renderTimers();
    }, 1000);
  }
}

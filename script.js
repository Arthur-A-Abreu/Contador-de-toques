const countDisplay = document.querySelector("#tap-count");
const counterName = document.querySelector("#counter-name");
const addButton = document.querySelector("#add-button");
const undoButton = document.querySelector("#undo-button");
const resetButton = document.querySelector("#reset-button");

const STORAGE_KEY = "contador-toques";
let count = 0;
let counterTitle = "";

try {
  const savedState = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  count = Number.isSafeInteger(savedState.count) && savedState.count >= 0 ? savedState.count : 0;
  counterTitle = typeof savedState.title === "string" ? savedState.title : "";
} catch {
  count = 0;
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ count, title: counterTitle }));
  } catch {
    // O contador continua funcionando mesmo quando o navegador bloqueia o armazenamento.
  }
}

function updateDisplay() {
  countDisplay.value = count.toLocaleString("pt-BR");
  undoButton.disabled = count === 0;
  document.title = counterTitle ? `${counterTitle} | Contador` : "Contador | Toques";
  saveState();
}

function addTap() {
  if (count >= Number.MAX_SAFE_INTEGER) return;
  count += 1;
  updateDisplay();
  addButton.classList.remove("is-pressed");
  requestAnimationFrame(() => addButton.classList.add("is-pressed"));
}

addButton.addEventListener("click", addTap);

undoButton.addEventListener("click", () => {
  if (count === 0) return;
  count -= 1;
  updateDisplay();
});

resetButton.addEventListener("click", () => {
  if (count === 0) return;
  if (!window.confirm("Deseja zerar esta contagem?")) return;
  count = 0;
  updateDisplay();
});

counterName.value = counterTitle;
counterName.addEventListener("input", () => {
  counterTitle = counterName.value;
  updateDisplay();
});

document.addEventListener("keydown", (event) => {
  const isTyping = event.target instanceof HTMLElement && ["INPUT", "TEXTAREA"].includes(event.target.tagName);
  if (isTyping || event.repeat || event.altKey || event.ctrlKey || event.metaKey) return;

  if (event.code === "Space" || event.code === "NumpadAdd") {
    event.preventDefault();
    addTap();
  }
});

updateDisplay();
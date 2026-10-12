const passages = [
  "Learning JavaScript every day helps you become a better developer. Practice small projects, solve problems, and build something useful with your skills.",
  "Success comes from consistency and patience. Every line of code you write brings you one step closer to your goals. Keep learning and never give up.",
  "Web development combines creativity and logic. HTML creates structure, CSS adds style, and JavaScript makes websites interactive and powerful."
];

const textDisplay = document.querySelector("#textDisplay");
const typingInput = document.querySelector("#typingInput");
const timeDisplay = document.querySelector("#time");
const wpmDisplay = document.querySelector("#wpm");
const accuracyDisplay = document.querySelector("#accuracy");
const progressDisplay = document.querySelector("#progress");
const result = document.querySelector("#result");
const resultMessage = document.querySelector("#resultMessage");

let passage = "";
let started = false;
let finished = false;
let timeLeft = 60;
let timerId = null;

function loadPassage() {
  passage = passages[Math.floor(Math.random() * passages.length)];
  textDisplay.replaceChildren();

  [...passage].forEach((character, index) => {
    const span = document.createElement("span");
    span.textContent = character;

    if (index === 0) {
      span.classList.add("current");
    }

    textDisplay.appendChild(span);
  });
}

function updateStats() {
  const typed = typingInput.value;
  const spans = textDisplay.querySelectorAll("span");
  let correct = 0;

  spans.forEach((span, index) => {
    span.classList.remove("correct", "incorrect", "current");

    if (index < typed.length) {
      if (typed[index] === passage[index]) {
        span.classList.add("correct");
        correct++;
      } else {
        span.classList.add("incorrect");
      }
    } else if (index === typed.length && !finished) {
      span.classList.add("current");
    }
  });

  const elapsed = 60 - timeLeft;
  const minutes = Math.max(elapsed, 1) / 60;
  const words = typed.trim() ? typed.trim().split(/\s+/).length : 0;
  const wpm = elapsed === 0 ? 0 : Math.round(words / minutes);
  const accuracy = typed.length
    ? Math.round((correct / typed.length) * 100)
    : 100;

  wpmDisplay.innerHTML = `${wpm} <small>WPM</small>`;
  accuracyDisplay.textContent = `${accuracy}%`;
  progressDisplay.textContent =
    `${typed.length} characters typed`;
}

function startTimer() {
  if (started || finished) return;

  started = true;

  timerId = setInterval(() => {
    timeLeft--;
    timeDisplay.textContent = `${timeLeft}s`;
    updateStats();

    if (timeLeft <= 0) {
      endTest();
    }
  }, 1000);
}

function endTest() {
  clearInterval(timerId);
  finished = true;
  typingInput.disabled = true;

  updateStats();

  const finalWpm = Number.parseInt(wpmDisplay.textContent, 10) || 0;

  result.hidden = false;
  resultMessage.textContent =
    `Your typing speed is ${finalWpm} WPM with ${accuracyDisplay.textContent} accuracy. Keep practicing!`;
}

typingInput.addEventListener("input", () => {
  if (finished) return;

  startTimer();
  updateStats();

  if (typingInput.value.length >= passage.length) {
    endTest();
  }
});

function restartTest() {
  clearInterval(timerId);

  started = false;
  finished = false;
  timeLeft = 60;
  timerId = null;

  typingInput.value = "";
  typingInput.disabled = false;
  timeDisplay.textContent = "60s";
  wpmDisplay.innerHTML = '0 <small>WPM</small>';
  accuracyDisplay.textContent = "100%";
  progressDisplay.textContent = "0 characters typed";
  result.hidden = true;

  loadPassage();
  typingInput.focus();
}

document.querySelector("#restartButton").addEventListener("click", restartTest);
document.querySelector("#tryAgainButton").addEventListener("click", restartTest);

restartTest();
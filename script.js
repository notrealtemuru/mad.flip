const gridElement = document.getElementById("grid");
const movesElement = document.getElementById("moves");
const winModal = document.getElementById("win-modal");
const restartBtn = document.getElementById("restart-btn");

// 8 цветов по два раза = 16 карточек (4x4)
const baseColors = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#0ea5e9",
  "#6366f1",
  "#a855f7",
  "#ec4899",
];

let colors = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchedCount = 0;
let moves = 0;

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function setupGame() {
  // сбрасываем состояние
  gridElement.innerHTML = "";
  winModal.classList.add("hidden");
  firstCard = null;
  secondCard = null;
  lockBoard = false;
  matchedCount = 0;
  moves = 0;
  movesElement.textContent = moves;

  // готовим массив цветов
  colors = [...baseColors, ...baseColors]; // дублируем
  shuffle(colors);

  // создаём 16 карточек
  colors.forEach((color, index) => {
    const card = document.createElement("div");
    card.className = "card hidden-color";
    card.dataset.color = color;
    card.dataset.index = index;

    const inner = document.createElement("div");
    inner.className = "card-inner";
    // пока держим цвет в JS, отрисуем его только при открытии
    card.appendChild(inner);

    card.addEventListener("click", onCardClick);
    gridElement.appendChild(card);
  });
}

function onCardClick(e) {
  if (lockBoard) return;

  const card = e.currentTarget;
  if (card.classList.contains("matched")) return;
  if (card === firstCard) return;

  revealCard(card);

  if (!firstCard) {
    firstCard = card;
    return;
  }

  secondCard = card;
  moves++;
  movesElement.textContent = moves;

  checkForMatch();
}

function revealCard(card) {
  card.classList.remove("hidden-color");
  card.classList.add("revealed");

  const color = card.dataset.color;
  const inner = card.querySelector(".card-inner");
  inner.style.background = color;
}

function hideCard(card) {
  card.classList.add("hidden-color");
  card.classList.remove("revealed");

  const inner = card.querySelector(".card-inner");
  inner.style.background = "";
}

function checkForMatch() {
  const isMatch = firstCard.dataset.color === secondCard.dataset.color;

  if (isMatch) {
    disableMatchedCards();
  } else {
    unflipCards();
  }
}

function disableMatchedCards() {
  firstCard.classList.add("matched");
  secondCard.classList.add("matched");
  firstCard.classList.remove("revealed");
  secondCard.classList.remove("revealed");

  firstCard.removeEventListener("click", onCardClick);
  secondCard.removeEventListener("click", onCardClick);

  matchedCount += 2;
  resetTurn();

  if (matchedCount === colors.length) {
    // все карты найдены
    setTimeout(() => {
      winModal.classList.remove("hidden");
    }, 400);
  }
}

function unflipCards() {
  lockBoard = true;
  setTimeout(() => {
    hideCard(firstCard);
    hideCard(secondCard);
    resetTurn();
  }, 800);
}

function resetTurn() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

// рестарт
restartBtn.addEventListener("click", () => {
  setupGame();
});

setupGame();

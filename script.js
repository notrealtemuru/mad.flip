const gridElement = document.getElementById("grid");
const movesElement = document.getElementById("moves");
const winModal = document.getElementById("win-modal");
const restartBtn = document.getElementById("restart-btn");

// 8 картинок по два раза = 16 карточек
const baseImages = [
  "images/berserk-mad.png",
  "images/idk-mad.png",
  "images/just-mad.png",
  "images/kekw-mad.jpeg",
  "images/king-mad.jpeg",
  "images/mecho-mad.jpeg",
  "images/pizza-mad.jpeg",
  "images/xd-mad.jpeg",
];

let cardsData = [];
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
  gridElement.innerHTML = "";
  winModal.classList.add("hidden");
  firstCard = null;
  secondCard = null;
  lockBoard = false;
  matchedCount = 0;
  moves = 0;
  movesElement.textContent = moves;

  cardsData = [...baseImages, ...baseImages];
  shuffle(cardsData);

  cardsData.forEach((imgSrc, index) => {
    const card = document.createElement("div");
    card.className = "card hidden-color";
    card.dataset.image = imgSrc;
    card.dataset.index = index;

    const inner = document.createElement("div");
    inner.className = "card-inner";

    const img = document.createElement("img");
    img.src = imgSrc;
    img.alt = "card";
    img.className = "card-image";
    img.style.opacity = "0";

    inner.appendChild(img);
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

  const img = card.querySelector(".card-image");
  img.style.opacity = "1";
}

function hideCard(card) {
  card.classList.add("hidden-color");
  card.classList.remove("revealed");

  const img = card.querySelector(".card-image");
  img.style.opacity = "0";
}

function checkForMatch() {
  const isMatch = firstCard.dataset.image === secondCard.dataset.image;

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

  if (matchedCount === cardsData.length) {
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

restartBtn.addEventListener("click", () => {
  setupGame();
});

setupGame();

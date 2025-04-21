const icon_width = 79;
const icon_height = 79;
const num_icons = 9;
const indexes = [0, 0, 0];

// New variables for coins and betting
let availableCoins = 100; // Starting coins
let currentBet = 10; // Default bet amount

// DOM elements
const coinsDisplay = document.getElementById("coins-display");
const betDisplay = document.getElementById("bet-display");
const spinButton = document.getElementById("spin-button");
const decreaseBetButton = document.getElementById("decrease-bet");
const increaseBetButton = document.getElementById("increase-bet");

const roll = (reel, offset = 0) => {
  let delta = (offset + 2) * num_icons + Math.round(Math.random() * num_icons);

  const style = getComputedStyle(reel);
  const backgroundPosition = parseInt(
    style.backgroundPositionY.replace("px", "")
  );

  reel.style.transition = "none";
  reel.style.backgroundPositionY = "0px";
  reel.style.transition = "background-position-y 1.5s ease-out";
  reel.style.backgroundPositionY = `${
    backgroundPosition + delta * icon_height
  }px`;

  indexes[offset] = (indexes[offset] + (delta % num_icons)) % num_icons;
};

function rollAll() {
  const reels = document.querySelectorAll(".reel");

  spinButton.disabled = true;

  reels.forEach((reel, index) => {
    roll(reel, index);
  });

  setTimeout(() => {
    checkWin();
    spinButton.disabled = false;
  }, 1500);
}

function checkWin() {
  if (indexes[0] === indexes[1] && indexes[1] === indexes[2]) {
    const reward = currentBet * 5;
    availableCoins += reward;
    console.log(
      `%cYou win! 🎉 Reward: ${reward} coins`,
      "color: green; font-weight: bold;"
    );
  } else {
    console.log("%cYou lose! Try again.", "color: red; font-weight: bold;");
  }

  updateDisplays();
}

function setBet(amount) {
  if (amount > availableCoins || amount <= 0) {
    console.log("%cInvalid bet amount!", "color: orange; font-weight: bold;");
    return;
  }
  currentBet = amount;
  updateDisplays();
}

function updateDisplays() {
  coinsDisplay.textContent = `Available Coins: ${availableCoins}`;
  betDisplay.textContent = `Current Bet: ${currentBet}`;
}

spinButton.addEventListener("click", () => {
  if (currentBet > availableCoins) {
    console.log(
      "%cNot enough coins to spin! Adjust your bet.",
      "color: orange; font-weight: bold;"
    );
    return;
  }

  availableCoins -= currentBet;
  console.log(`%cSpinning... Bet: ${currentBet}`, "color: gray;");
  rollAll();
});

decreaseBetButton.addEventListener("click", () => {
  if (currentBet > 1) {
    setBet(currentBet - 1);
  }
});

increaseBetButton.addEventListener("click", () => {
  if (currentBet < availableCoins) {
    setBet(currentBet + 1);
  }
});

updateDisplays();

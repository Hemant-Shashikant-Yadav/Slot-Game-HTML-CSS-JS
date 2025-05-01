import {
  Application,
  Assets,
  Texture,
  Container,
  Graphics,
  TilingSprite,
  TextStyle,
  Text,
  Sprite,
} from "pixi.js";
import { gsap } from "gsap";

(async () => {
  const app = new Application();
  await app.init({
    background: "#1099bb",
    resizeTo: window,
    antialias: true,
    resolution: 1,
  });

  globalThis.__PIXI_APP__ = app;
  document.getElementById("pixi-container").appendChild(app.canvas);

  await Assets.load([
    "/assets/bg.jpeg",
    "/assets/reel.png",
    "/assets/mbg.jpeg",
    "/assets/back.png",
    "/assets/next.png",
    "/assets/spin.png",
  ]);

  const bgTextureDesktop = Texture.from("/assets/bg.jpeg");
  const bgTextureMobile = Texture.from("/assets/mbg.jpeg");
  const reelTexture = Texture.from("/assets/reel.png");
  const decreaseBetTexture = Texture.from("/assets/back.png");
  const increaseBetTexture = Texture.from("/assets/next.png");
  const spinButtonTexture = Texture.from("/assets/spin.png");

  const config = {
    width: reelTexture.width,
    height: 79 * 3,
    borderColor: "#000",
    borderColor2: "#d33928",
    maskColor: 0xffffff,
  };

  const iconHeight = 79;
  const numIcons = 9;
  const indexes = [0, 0, 0];
  let availableCoins = 100;
  let currentBet = 10;

  const centerTextStyle = new TextStyle({
    fontFamily: "Arial",
    fontSize: 40,
    fill: "#FFD700",
    stroke: "#000000",
    strokeThickness: 6,
    dropShadow: true,
    dropShadowColor: "#000000",
    dropShadowBlur: 8,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 4,
    align: "center",
  });

  const background = new Sprite(bgTextureDesktop);
  background.width = app.screen.width;
  background.height = app.screen.height;
  app.stage.addChild(background);

  const coinsDisplay = new Text(
    `Available Coins: ${availableCoins}`,
    centerTextStyle,
  );
  coinsDisplay.anchor.set(0.5);
  coinsDisplay.x = app.screen.width / 2;
  coinsDisplay.y = 150;

  const betDisplay = new Text(`Current Bet: ${currentBet}`, centerTextStyle);
  betDisplay.anchor.set(0.5);
  betDisplay.x = app.screen.width / 2;
  betDisplay.y = 200;

  app.stage.addChild(coinsDisplay, betDisplay);

  const updateDisplays = () => {
    coinsDisplay.text = `Available Coins: ${availableCoins}`;
    betDisplay.text = `Current Bet: ${currentBet}`;
  };

  const setBet = (amount) => {
    if (amount > availableCoins || amount <= 0) return;
    currentBet = amount;
    updateDisplays();
  };

  const createImageButton = (texture, x, y, onClick) => {
    const button = new Sprite(texture);
    button.anchor.set(0.5);
    button.interactive = true;
    button.buttonMode = true;
    button.on("pointerdown", onClick);
    app.stage.addChild(button);
    return button;
  };

  const decreaseBetButton = createImageButton(decreaseBetTexture, 0, 0, () => {
    if (currentBet > 1) setBet(currentBet - 1);
  });

  const spinButton = createImageButton(spinButtonTexture, 0, 0, () => {
    if (currentBet > availableCoins) return;
    availableCoins -= currentBet;
    rollAll();
  });

  const increaseBetButton = createImageButton(increaseBetTexture, 0, 0, () => {
    if (currentBet < availableCoins) setBet(currentBet + 1);
  });

  const roll = (tilingSprite, offset = 0) => {
    const delta =
      (offset + 2) * numIcons + Math.round(Math.random() * numIcons);
    gsap.to(tilingSprite.tilePosition, {
      y: `+=${delta * iconHeight}`,
      duration: 2.5,
      ease: "power2.out",
    });
    indexes[offset] = (indexes[offset] + (delta % numIcons)) % numIcons;
  };

  const showWinningText = (message) => {
    const winningTextStyle = new TextStyle({
      fontFamily: "Arial",
      fontSize: app.screen.width / 20,
      fill: "#FFD700",
      stroke: "#000000",
      strokeThickness: 8,
      dropShadow: true,
      dropShadowColor: "#000000",
      dropShadowBlur: 10,
      dropShadowAngle: Math.PI / 6,
      dropShadowDistance: 6,
      align: "center",
    });

    const winningText = new Text(message, winningTextStyle);
    winningText.anchor.set(0.5);
    winningText.x = app.screen.width / 2;
    winningText.y = app.screen.height / 2;
    app.stage.addChild(winningText);

    setTimeout(() => {
      app.stage.removeChild(winningText);
    }, 5000);
  };

  const checkWin = () => {
    if (indexes[0] === indexes[1] && indexes[1] === indexes[2]) {
      const reward = currentBet * 5;
      availableCoins += reward;
      showWinningText(`You Win! 🎉\nReward: ${reward} Coins`);
    }
    updateDisplays();
  };

  let reel1 = null;
  let reel2 = null;
  let reel3 = null;

  const rollAll = () => {
    spinButton.interactive = false;
    roll(reel1.tilingSprite, 0);
    roll(reel2.tilingSprite, 1);
    roll(reel3.tilingSprite, 2);
    setTimeout(() => {
      checkWin();
      spinButton.interactive = true;
    }, 1500);
  };

  const reelsContainer = new Container();
  app.stage.addChild(reelsContainer);

  const createReelContainer = (xOffset, width, height) => {
    const container = new Container();
    const tilingSprite = new TilingSprite({ texture: reelTexture });
    const mask = new Graphics()
      .rect(0, 0, config.width, config.height)
      .fill(config.maskColor);
    container.addChild(tilingSprite, mask);
    container.mask = mask;
    container.x = xOffset;
    container.width = width;
    container.height = height;
    return { container, tilingSprite };
  };

  const updateReelsSize = (isMobile) => {
    const reelWidth = isMobile ? config.width : config.width * 1.5;
    const reelHeight = isMobile ? config.height : config.height * 2;
    const reelSpacing = isMobile ? 10 : 20;

    reelsContainer.removeChildren();
    reel1 = createReelContainer(0, reelWidth, reelHeight);
    reel2 = createReelContainer(reelWidth + reelSpacing, reelWidth, reelHeight);
    reel3 = createReelContainer(
      (reelWidth + reelSpacing) * 2,
      reelWidth,
      reelHeight,
    );
    reelsContainer.addChild(reel1.container, reel2.container, reel3.container);
  };

  const updateButtonSizes = (isMobile) => {
    const spinScale = isMobile ? 0.24 : 0.37;
    const navScale = isMobile ? 0.15 : 0.2;
    const { width, height } = app.screen;

    decreaseBetButton.scale.set(navScale);
    spinButton.scale.set(spinScale);
    increaseBetButton.scale.set(navScale);

    decreaseBetButton.x = isMobile ? width / 2 - 150 : width / 2 - 220;
    decreaseBetButton.y = isMobile ? height - 200 : height - 100;
    spinButton.x = width / 2;
    spinButton.y = isMobile ? height - 200 : height - 100;
    increaseBetButton.x = isMobile ? width / 2 + 150 : width / 2 + 220;
    increaseBetButton.y = isMobile ? height - 200 : height - 100;
  };

  const resizeUI = () => {
    const { width, height } = app.screen;

    background.texture = width <= 768 ? bgTextureMobile : bgTextureDesktop;
    updateReelsSize(width <= 768);
    updateButtonSizes(width <= 768);

    background.width = width;
    background.height = height;

    reelsContainer.x = width / 2 - reelsContainer.width / 2;
    reelsContainer.y = height / 2 - reelsContainer.height / 2;
  };

  window.addEventListener("resize", resizeUI);
  resizeUI();

  const winButton = new Sprite(spinButtonTexture);
  winButton.anchor.set(0.5);
  winButton.scale.set(0.1);
  winButton.x = app.screen.width - 50;
  winButton.y = 50;
  winButton.interactive = true;
  winButton.buttonMode = true;
  winButton.on("pointerdown", () => {
    const reward = currentBet * 5;
    availableCoins += reward;
    showWinningText(`You Win! 🎉\nReward: ${reward} Coins`);
    updateDisplays();
  });
  app.stage.addChild(winButton);
})();

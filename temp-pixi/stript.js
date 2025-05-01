const app = new PIXI.Application(640, 360, {
    transparent: true,
    autoResize: true,
    antialias: true,
    resolution: 1,
});

document.body.appendChild(app.view);

globalThis.__PIXI_APP__ = app;

class Game {
    constructor(balance, stake, win) {
        this.balance = 500;
        this.stake = 1;
        this.win = 0;
        this.playing = false;
        this.addStake = function () {
            if (playerResources.stake >= 1 && playerResources.stake <= 2) {
                playerResources.stake++;
            }
        };
        this.minusStake = function minusStake() {
            if (playerResources.stake > 1) {
                playerResources.stake--;
            }
        };
        this.reduceBalance = function () {

            this.balance = this.balance - this.stake;
        }
    }
}

let playerResources = new Game();

const REEL_WIDTH = 90;
const SYMBOL_SIZE = 80;
let reels = [];
let anotherSlot = [];
let slotTextures = [];
let anotherSlotTextures = [];
let reelContainer;
let reel;


function onAssetsLoaded() {
    let u1 = PIXI.Texture.fromImage("./img/u1.png");
    let u2 = PIXI.Texture.fromImage("./img/u2.png");
    let u3 = PIXI.Texture.fromImage("./img/u3.png");
    let u4 = PIXI.Texture.fromImage("./img/u4.png");
    //Create different slot symbols.
    slotTextures = [
        u1,
        u2,
        u3,
        u4
    ];

    //container for footer items
    const UIfooterContainer = new PIXI.Container();

    // draw a rounded rectangle
    let graphicsTwo = new PIXI.Graphics();
    graphicsTwo.lineStyle(2, 0xFF00FF, 1);
    graphicsTwo.beginFill(0xFF00BB, 0.25);
    graphicsTwo.drawRoundedRect(255, 296, 120, 35, 15);
    graphicsTwo.endFill();

    //Create PIXI container to hold all app buttons
    const buttonsHolder = new PIXI.Container();
    buttonsHolder.x = 0;
    buttonsHolder.y = 0;


    const makeImageButton = (image, audioMP3, audioOGG, x, y, scale) => {
        const button = PIXI.Sprite.fromImage(image);
        button.interactive = true;
        button.buttonMode = true;
        buttonsHolder.addChild(button);
        button.x = x;
        button.y = y;
        button.scale.set(scale);
        return button;
    };
    //Add image sprite, sound, location and scale leftArrow button
    const leftArrow = makeImageButton(
        './img/back.png',
        'https://www.dropbox.com/s/1qj55ghc8bzv8h4/multimedia_button_click_006.mp3?dl=1',
        'https://www.dropbox.com/s/tyxkypl5qfv3rqh/multimedia_button_click_006.ogg?dl=1',
        220,
        296,
        0.05
    );
    //Add image sprite, sound, location and scale rightArrow button
    const rightArrow = makeImageButton(
        './img/next.png',
        'https://www.dropbox.com/s/1qj55ghc8bzv8h4/multimedia_button_click_006.mp3?dl=1',
        'https://www.dropbox.com/s/tyxkypl5qfv3rqh/multimedia_button_click_006.ogg?dl=1',
        380,
        296,
        0.05
    );

    const buttonActive = makeImageButton(
        './img/spin.png',
        '.https://www.dropbox.com/s/19ko1ucgfq5hfue/zapsplat_foley_money_pouch_fabric_coins_down_on_surface_006_15052.mp3?dl=1',
        '.https://www.dropbox.com/s/10w3je29js16ryu/zapsplat_foley_money_pouch_fabric_coins_down_on_surface_006_15052.ogg?dl=1',
        450,
        235,
        0.2
    );

    rightArrow.addListener("pointerdown", () => {
        playerResources.addStake();
        // pdate  PIXI stack text on screen
        stackText.text = playerResources.stake;
    });


    leftArrow.addListener("pointerdown", () => {
        playerResources.minusStake();
        UIfooterContainer.addChild(stackText);
        //update  PIXI text on screen
        stackText.text = playerResources.stake;
    });

    //check for event on spin button
    buttonActive.addListener('pointerdown', () => {
        startPlay();
        //Reduce balance on click depending on bet amount
        playerResources.reduceBalance();
        //Add changes on canvas environment
        balanceText.text = playerResources.balance;
        console.log(`button clicked`);
    });
    const margin = 50;

    //Build the reels
    reelContainer = new PIXI.Container();
    for (let i = 0; i < 6; i++) {
        const rc = new PIXI.Container();
        rc.x = i * REEL_WIDTH;
        reelContainer.addChild(rc);

        reel = {
            container: rc,
            symbols: [],
            position: 0,
            previousPosition: 0,
            blur: new PIXI.filters.BlurFilter()
        };

        //let newposition = reel.reelContainer.getChildIndex;
        reel.blur.blurX = 0;
        reel.blur.blurY = 0;
        rc.filters = [reel.blur];

        //Build the symbols
        for (let j = 0; j < 4; j++) {
            const symbol = new PIXI.Sprite(slotTextures[Math.floor(Math.random() * slotTextures.length)]);
            //Scale the symbol to fit symbol area.
            symbol.y = j * SYMBOL_SIZE;
            symbol.scale.x = symbol.scale.y = Math.min(SYMBOL_SIZE / symbol.width, SYMBOL_SIZE / symbol.height);
            symbol.x = Math.round((SYMBOL_SIZE - symbol.width) / 9);
            reel.symbols.push(symbol);
            rc.addChild(symbol);
        }
        reels.push(reel);
        console.log(reel);
        
    }
    console.log(reelContainer);
    app.stage.addChild(reelContainer);

    reelContainer.y = margin * 2.8;
    reelContainer.x = 50;

    const top = new PIXI.Graphics();
    top.beginFill(0xFF00BB, 0.25);
    top.drawRect(0, 0, app.screen.width, margin);


    const bottom = new PIXI.Graphics();
    bottom.beginFill(0, 1);
    bottom.drawRect(0, 240 + margin, app.screen.width, margin);


    const style = new PIXI.TextStyle({
        fontFamily: 'Arial',
        fontSize: 24,
        fontStyle: 'italic',
        fontWeight: 'bold',
        fill: ['#ffffff', '#00ff99'],
        stroke: '#4a1850',
        strokeThickness: 5,
        dropShadow: true,
        dropShadowColor: '#000000',
        dropShadowBlur: 4,
        dropShadowAngle: Math.PI / 6,
        dropShadowDistance: 6,
        wordWrap: true,
        wordWrapWidth: 300
    });

    //Stack Selector Text between arrow buttons
    let stackText = new PIXI.Text(`${playerResources.stake}`, style);
    stackText.x = (app.screen.width / 2 - 10);
    stackText.y = 295;
    UIfooterContainer.addChild(stackText);

    //Add balance text to the canvas
    let balanceText = new PIXI.Text(`${playerResources.balance}`, style);
    balanceText.x = 535;
    balanceText.y = 7;
    top.addChild(balanceText);

    app.stage.addChild(top);

    app.stage.addChild(UIfooterContainer);
    UIfooterContainer.addChild(
        bottom,
        graphicsTwo,
        buttonsHolder,
        buttonActive,
        stackText,
        );
    UIfooterContainer.x = 0;
    UIfooterContainer.y = 20;

    let running = false;

    //Function to start playing.
    function startPlay() {
        if (running) return;
        running = true;
        for (let i = 0; i < reels.length; i++) {
            const r = reels[i];
            const extra = Math.floor(Math.random() * 3);
            tweenTo(r, "position", r.position + 10 + i * 5 + extra, 2500 + i * 600 + extra * 600, backout(0.6), null, i == reels.length - 1 ? reelsComplete : null);
        }
    }

    //Reels done handler.
    function reelsComplete() {
        running = false;
    }


    app.ticker.add(delta => {
        //Update the slots.
        for (const r of reels) {
            //Update blur filter y amount based on speed.
            //This would be better if calculated with time in mind also. Now blur depends on frame rate.
            r.blur.blurY = (r.position - r.previousPosition) * 8;
            r.previousPosition = r.position;

            //Update symbol positions on reel.
            for (let j = 0; j < r.symbols.length; j++) {
                const s = r.symbols[j];
                const prevy = s.y;
                s.y = (r.position + j) % r.symbols.length * SYMBOL_SIZE - SYMBOL_SIZE;
                if (s.y < 0 && prevy > SYMBOL_SIZE) {
                    //Detect going over and swap a texture. 
                    //This should in proper product be determined from some logical reel.
                    s.texture = slotTextures[Math.floor(Math.random() * slotTextures.length)];
                    s.scale.x = s.scale.y = Math.min(SYMBOL_SIZE / s.texture.width, SYMBOL_SIZE / s.texture.height);
                    s.x = Math.round((SYMBOL_SIZE - s.width) / 2);
                }
            }
        }
    });
}


PIXI.loader
    .add("u1", "./img/u1.png")
    .add("u2", "./img/u2.png")
    .add("u3", "./img/u3.png")
    .add("u4", "./img/u4.png")
    .add("buttonActive", "./img/spin.png")
    .add("buttonDeactivated", "./img/reload.png")
    .add("coins", "./img/coins.png")
    .add("yellowBar", "./img/back.png")
    .add("blueBar", "./img/next.png")
    .add("background", "./img/bg2.png")
    .load(onAssetsLoaded);


//Very simple tweening utility function. This should be replaced with a proper tweening library in a real product.
const tweening = [];

function tweenTo(object, property, target, time, easing, onchange, oncomplete) {
    const tween = {
        object,
        property,
        propertyBeginValue: object[property],
        target,
        easing,
        time,
        change: onchange,
        complete: oncomplete,
        start: Date.now()
    };

    tweening.push(tween);
    return tween;
}
// Listen for animate update.
app.ticker.add(delta => {
    const now = Date.now();
    const remove = [];
    for (var i = 0; i < tweening.length; i++) {
        const t = tweening[i];
        const phase = Math.min(1, (now - t.start) / t.time);

        t.object[t.property] = lerp(t.propertyBeginValue, t.target, t.easing(phase));
        if (t.change) t.change(t);
        if (phase == 1) {
            t.object[t.property] = t.target;
            if (t.complete)
                t.complete(t);
            remove.push(t);
        }
    }
    for (var i = 0; i < remove.length; i++) {
        tweening.splice(tweening.indexOf(remove[i]), 1);
    }
});

//Basic lerp funtion.
function lerp(a1, a2, t) {
    return a1 * (1 - t) + a2 * t;
}


backout = amount => t => --t * t * ((amount + 1) * t + amount) + 1;

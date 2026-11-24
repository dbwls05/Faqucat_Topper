const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const yellowCatGif = document.getElementById('yellowCatGif');
const grayCatGif = document.getElementById('grayCatGif');

const images = {
    key_yellow: new Image(),
    key_gray: new Image(),
    box_open: new Image(),
    box_close: new Image(),
    yarn: new Image(),
    ground1: new Image(),
    ground2: new Image(),
    ground3: new Image(),
    ground4: new Image(),
    water1: new Image(),
    water2: new Image(),
    heart_full: new Image(),
    heart_empty: new Image(),
    stone1: new Image(),
    stone2: new Image(),
    stone3: new Image(),
    stone_small: new Image(),
    light: new Image()
};

images.key_yellow.src = 'img/열쇠.gif';
images.key_gray.src = 'img/열쇠_회색.png';
images.box_open.src = 'img/img_mirror/보물상자_open_거울.png';
images.box_close.src = 'img/img_mirror/보물상자_close_거울.png';
images.ground1.src = 'img/img_mirror/땅_long_거울.png';
images.ground2.src = 'img/img_mirror/땅_middle_거울.png';
images.ground3.src = 'img/img_mirror/땅_short_거울.png';
images.ground4.src = 'img/img_mirror/땅_거울.png';
images.yarn.src = 'img/털뭉치_보라.png';
images.water1.src = 'img/img_mirror/물_거울.png';
images.water2.src = 'img/img_mirror/물2_거울.png';
images.heart_full.src = "img/채워진하트.png";
images.heart_empty.src = "img/빈하트.png";
images.stone1.src = "img/img_mirror/돌막대1_거울.png";
images.stone2.src = "img/img_mirror/돌막대2_거울.png";
images.stone3.src = "img/img_mirror/돌막대3_거울.png";
images.stone_small.src = "img/장애물_돌.png";
images.light.src = "img/light.png";

const catImages = {
    yellow: {
        idleLeft: 'img/치즈냥_정지_왼쪽.png',
        idleRight: 'img/치즈냥_정지_오른쪽.png',
        moveLeft: 'img/치즈냥_걷기_왼쪽.gif',
        moveRight: 'img/치즈냥_걷기_오른쪽.gif'
    },
    gray: {
        idleLeft: 'img/회색냥_정지_왼쪽.png',
        idleRight: 'img/회색냥_정지_오른쪽.png',
        moveLeft: 'img/회색냥_걷기_왼쪽.gif',
        moveRight: 'img/회색냥_걷기_오른쪽.gif'
    }
};

function createInitialGameState() {
    return {
        yellowCat: { x: 50, y: 10, width: 90, height: 90, vx: 0, vy: 0, onGround: false, direction: 'right', isMoving: false },
        grayCat: { x: 1100, y: 10, width: 90, height: 90, vx: 0, vy: 0, onGround: false, direction: 'right', isMoving: false },
        platforms: [
            { x: 258, y: 120, width: 30, height: 30, image: 'stone3' },
            { x: 402, y: 75, width: 30, height: 30, image: 'stone3' },
            { x: 402, y: 400, width: 30, height: 30, image: 'stone3' },

            { x: 741, y: 121, width: 30, height: 30, image: 'stone3' },
            { x: 500, y: 270, width: 30, height: 30, image: 'stone3' },
            { x: 300, y: 550, width: 30, height: 30, image: 'stone3' },
            { x: 100, y: 300, width: 30, height: 30, image: 'stone3' },
            // 오른쪽
            { x: 960, y: 121, width: 30, height: 30, image: 'stone3' },
            { x: 1100, y: 270, width: 30, height: 30, image: 'stone3' },
            { x: 920, y: 420, width: 30, height: 30, image: 'stone3' },                    
        ],
        obstacles: [
            { x: 850, y: 480, width: 47, height: 25, image: 'stone_small' },
            { x: 1100, y: 480, width: 47, height: 25, image: 'stone_small' },                 
            { x: 400, y: 60, width: 97, height: 49, image: 'water1'},
            { x: 700, y: 60, width: 97, height: 49, image: 'water1'},
            { x: 300, y: 60, width: 97, height: 49, image: 'water1'},
            { x: 980, y: 60, width: 97, height: 49, image: 'water1'}
        ],
        keys: [
            { x: 100, y: 460, collected: false, color:'yellow', image: 'key_yellow' },
            { x: 730, y: 520, collected: false, color:'glay', image: 'key_gray' },
            { x: 100, y: 460, collected: false, color:'yellow', image: 'light' },
            { x: 730, y: 520, collected: false, color:'glay', image: 'light' }
        ],
        box: { x: 550, y: 80, opened: false },
        yarn: { x: 0, y: 0, visible: false },
        yellowTouchedYarn: false, 
        grayTouchedYarn: false,  
        keyInput: {},
        lives: 3,
        gravity: -0.6, // 중력을 음수로 (위로 끌어당김)
        jumpPower: 13, // 점프를 양수로 (아래로 점프)
        moveSpeed: 6,
        keysCollected: 0,
        running: true,
        stageCleared: false
    };
}

let game = createInitialGameState();

document.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    game.keyInput[key] = true;
    if (e.key.startsWith('Arrow')) {
        game.keyInput[e.key] = true;
    }
});

document.addEventListener('keyup', (e) => {
    const key = e.key.toLowerCase();
    game.keyInput[key] = false;
    if (e.key.startsWith('Arrow')) {
        game.keyInput[e.key] = false;
    }
});

function updateCat(cat, jumpKey, leftKey, rightKey) {
    cat.vx = 0;
    cat.isMoving = false;

    if (game.keyInput[leftKey]) {
        cat.vx = -game.moveSpeed;
        cat.direction = 'left';
        cat.isMoving = true;
    }
    if (game.keyInput[rightKey]) {
        cat.vx = game.moveSpeed;
        cat.direction = 'right';
        cat.isMoving = true;
    }

    // 점프: 천장에 붙어있을 때 아래로 점프
    if (game.keyInput[jumpKey] && cat.onGround) {
        cat.vy = game.jumpPower;
        cat.onGround = false;
    }

    cat.vy += game.gravity;
    cat.x += cat.vx;
    cat.y += cat.vy;

    if (cat.x < 0) cat.x = 0;
    if (cat.x + cat.width > canvas.width) cat.x = canvas.width - cat.width;

    cat.onGround = false;
    const platformOffset = 15;

    // 플랫폼 충돌: 위에서 아래로 떨어질 때 (vy > 0) 플랫폼 하단에 충돌
    game.platforms.forEach(platform => {
        if (cat.vy <= 0 && // 위로 올라갈 때
            cat.x + cat.width > platform.x &&
            cat.x < platform.x + platform.width &&
            cat.y <= platform.y + platform.height - platformOffset &&
            cat.y >= platform.y + platform.height - platformOffset - 20) {
            cat.y = platform.y + platform.height - platformOffset;
            cat.vy = 0;
            cat.onGround = true;
        }
    });

    // 천장 (원래의 바닥)을 새로운 바닥으로
    const ceilingY = 90;
    if (cat.y <= ceilingY) {
        cat.y = ceilingY;
        cat.vy = 0;
        cat.onGround = true;
    }
}

function updateCatGifPositions() {
    yellowCatGif.style.left = (game.yellowCat.x) + 'px';
    yellowCatGif.style.top = (game.yellowCat.y) + 'px';

    grayCatGif.style.left = (game.grayCat.x) + 'px';
    grayCatGif.style.top = (game.grayCat.y) + 'px';

    updateCatImage(game.yellowCat, yellowCatGif, 'yellow');
    updateCatImage(game.grayCat, grayCatGif, 'gray');
}

function updateCatImage(cat, gifElement, catType) {
    let newSrc = '';

    if (cat.isMoving) {
        if (cat.direction === 'left') {
            newSrc = catImages[catType].moveLeft;
        } else {
            newSrc = catImages[catType].moveRight;
        }
    } else {
        if (cat.direction === 'left') {
            newSrc = catImages[catType].idleLeft;
        } else {
            newSrc = catImages[catType].idleRight;
        }
    }

    if (gifElement.src !== newSrc && newSrc !== '') {
        gifElement.src = newSrc;
    }
}

function checkOverlap(cat, obj, width, height) {
    return cat.x < obj.x + width &&
        cat.x + cat.width > obj.x &&
        cat.y < obj.y + height &&
        cat.y + cat.height > obj.y;
}

function checkCollisions() {
    if (game.stageCleared) return;

    game.keys.forEach(key => {
        if (!key.collected) {
            const collector = key.color === 'yellow' ? game.yellowCat : game.grayCat;
            if (checkOverlap(collector, key, 30, 30)) {
                key.collected = true;
                game.keysCollected++;
            }
        }
    });

    if (!game.box.opened && game.keysCollected >= 4) {
        if (checkOverlap(game.yellowCat, game.box, 74, 46) ||
            checkOverlap(game.grayCat, game.box, 74, 46)) {
            game.box.opened = true;
            game.yarn.visible = true;
            game.yarn.x = 825;
            game.yarn.y = 350;
        }
    }

    if (game.yarn.visible) {
        if (checkOverlap(game.yellowCat, game.yarn, 40, 40)) {
            game.yellowTouchedYarn = true;
        }
        if (checkOverlap(game.grayCat, game.yarn, 40, 40)) {
            game.grayTouchedYarn = true;
        }

        if (game.yellowTouchedYarn && game.grayTouchedYarn) {
            game.yarn.visible = false;
            stageClear();
            return;
        }
    }

    game.obstacles.forEach(obstacle => {
        if (checkOverlap(game.yellowCat, obstacle, obstacle.width, obstacle.height) ||
            checkOverlap(game.grayCat, obstacle, obstacle.width, obstacle.height)) {

            game.lives--;

            if (game.lives > 0) {
                game.yellowCat.x = 50; game.yellowCat.y = 10; game.yellowCat.vy = 0;
                game.grayCat.x = 1100; game.grayCat.y = 10; game.grayCat.vy = 0;
            } else {
                gameOver();
            }
        }
    });
}

function update() {
    if (!game.running) return;

    updateCat(game.yellowCat, 'w', 'a', 'd');
    updateCat(game.grayCat, 'ArrowUp', 'ArrowLeft', 'ArrowRight');
    updateCatGifPositions();
    checkCollisions();
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    game.platforms.forEach(platform => {
        ctx.drawImage(images[platform.image], platform.x, platform.y, platform.width, platform.height);
    });

    game.keys.forEach(key => {
        if (!key.collected) {
            ctx.drawImage(images[key.image], key.x, key.y, 26, 40);
        }
    });

    game.obstacles.forEach(obstacle => {
        ctx.drawImage(images[obstacle.image], obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });

    const boxImg = game.box.opened ? images.box_open : images.box_close;
    const boxY = game.box.opened ? game.box.y + 30 : game.box.y;
    const boxHeight = game.box.opened ? 74 : 46;
    ctx.drawImage(boxImg, game.box.x, boxY, 74, boxHeight);

    if (game.yarn.visible) {
        ctx.drawImage(images.yarn, game.yarn.x, game.yarn.y, 50, 50);
    }

    ctx.restore();

    renderHearts();
}

function stageClear() {
    if (game.stageCleared) return;
    game.stageCleared = true;
    game.running = false;
    localStorage.setItem('stage6_clear', 'true'); 
    const popup = document.getElementById('popupBackground');
    popup.innerHTML = `
        <div class="clear-popup micro-5-regular">
            <h1 class="popup-title">GAME CLEAR</h1>
            <div class="clear-items">
                <div class="item"><img src="img/털뭉치_청록.png" alt="Item 1"></div>
                <div class="item"><img src="img/털뭉치_파랑.png" alt="Item 2"></div>
                <div class="item"><img src="img/털뭉치_보라.png" alt="Item 3"></div>
            </div>
            <div class="clear-btns">
                <button id="restartBtn">RESTART</button>
                <button id="nextBtn">NEXT</button>
            </div>
        </div>
    `;
    popup.style.display = 'flex';

    document.getElementById('restartBtn').addEventListener('click', () => {
        restartGame();
    });

    document.getElementById('nextBtn').addEventListener('click', () => {
        window.location.href = 'clearstage.html';
    });
}

function restartGame() {
    document.getElementById('popupBackground').style.display = 'none';
    game = createInitialGameState();
}

function showPausePopup() {
    game.running = false;
    const popup = document.getElementById('popupBackground');
    popup.innerHTML = `
        <div class="popup micro-5-regular">
            <button class="retry micro-5-regular" id="resumeBtn">RESUME</button>
            <button class="retry micro-5-regular" id="retryBtn2">RETRY</button>
            <button class="exit micro-5-regular" id="exitBtn2">EXIT</button>
        </div>
    `;
    popup.style.display = 'flex';

    document.getElementById('resumeBtn').addEventListener('click', () => {
        popup.style.display = 'none';
        popup.innerHTML = `
            <div class="clear-popup micro-5-regular">
                <h1 class="popup-title">GAME CLEAR</h1>
                <div class="clear-items">
                <div class="item"><img src="img/털뭉치_청록.png" alt="Item 1"></div>
                <div class="item"><img src="img/털뭉치_파랑.png" alt="Item 2"></div>
                <div class="item"><img src="img/털뭉치_보라.png" alt="Item 3"></div>
                </div>
                <div class="clear-btns">
                    <button id="restartBtn">RESTART</button>
                    <button id="nextBtn">NEXT</button>
                </div>
            </div>
        `;
        game.running = true;
    });

    document.getElementById('retryBtn2').addEventListener('click', () => {
        location.reload();
    });

    document.getElementById('exitBtn2').addEventListener('click', () => {
        location.href = 'index.html';
    });
}

document.getElementById('stopBtn').addEventListener('click', () => {
    showPausePopup();
});

document.getElementById('restartBtn').addEventListener('click', () => {
    restartGame();
});

document.getElementById('nextBtn').addEventListener('click', () => {
    window.location.href = "clearstage.html";
});

// 프레임률과 무관하게 같은 속도로 동작하도록 경과 시간 기준으로 update()를 호출한다.
// (기준: 1/60초마다 update 1회 x GAME_SPEED)
let speedAcc = 0;
let lastFrameTime = performance.now();
function gameLoop(now = performance.now()) {
    const elapsedFrames = Math.min(Math.max((now - lastFrameTime) / (1000 / 60), 0), 15); // 탭 비활성 등으로 인한 급점프 방지
    lastFrameTime = now;
    speedAcc += elapsedFrames * GAME_SPEED;
    while (speedAcc >= 1) {
        update();
        speedAcc -= 1;
    }
    render();
    requestAnimationFrame(gameLoop);
}

function renderHearts() {
    const heartContainer = document.getElementById("heartContainer");
    heartContainer.innerHTML = "";

    for (let i = 0; i < 3; i++) {
        const img = document.createElement("img");
        img.src = i < game.lives ? images.heart_full.src : images.heart_empty.src;
        heartContainer.appendChild(img);
    }
}

function gameOver() {
    game.running = false;
    const popup = document.getElementById('popupBackground');
    popup.innerHTML = `
        <div class="clear-popup micro-5-regular">
            <h1 class="popup-title" style="color:red;">GAME OVER</h1>
            <div class="clear-btns">
                <button id="restartBtn3">RESTART</button>
            </div>
        </div>
    `;
    popup.style.display = 'flex';
    document.getElementById('restartBtn3').addEventListener('click', restartGame);
}

gameLoop();

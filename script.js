// Board
let board;
let boardWidth = 750;
let boardHeight = 250;
let context;

// Dino
let dinoWidth = 88;
let dinoHeight = 94;
let dinoX = 50;
let dinoY = boardHeight - dinoHeight;
let dinoImg;

let dino = {
    x: dinoX,
    y: dinoY,
    width: dinoWidth,
    height: dinoHeight
}

// Cactus
let cactusArray = [];
let cactus1Width = 34;
let cactus2Width = 69;
let cactus3Width = 102;

let cactusHeight = 70;
let cactusX = 700;
let cactusY = boardHeight - cactusHeight;

let cactus1Img;
let cactus2Img;
let cactus3Img;

// Physics
let velocityX = -8; // Cactus moving left speed
let velocityY = 0;
let gravity = 0.4;

let gameOver = false;
let score = 0;

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    // Load Images (USING DIRECT LINKS NOW)
    dinoImg = new Image();
    dinoImg.src = "https://raw.githubusercontent.com/ImKennyYip/google-dino-game/master/img/dino.png";

    dinoImg.onload = function() {
        context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
    }

    cactus1Img = new Image();
    cactus1Img.src = "https://raw.githubusercontent.com/ImKennyYip/google-dino-game/master/img/cactus1.png";

    cactus2Img = new Image();
    cactus2Img.src = "https://raw.githubusercontent.com/ImKennyYip/google-dino-game/master/img/cactus2.png";

    cactus3Img = new Image();
    cactus3Img.src = "https://raw.githubusercontent.com/ImKennyYip/google-dino-game/master/img/cactus3.png";

    requestAnimationFrame(update);
    setInterval(placeCactus, 1000); 

    // Listeners
    document.addEventListener("keydown", moveDino);
    document.addEventListener("touchstart", moveDino); // Mobile touch support
}

function update() {
    requestAnimationFrame(update);
    
    if (gameOver) {
        return;
    }

    context.clearRect(0, 0, board.width, board.height);

    // Dino Physics
    velocityY += gravity;
    dino.y = Math.min(dino.y + velocityY, dinoY); 
    
    // Draw Dino (Check if image is loaded)
    if (dinoImg.complete) {
        context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
    }

    // Cactus Physics
    for (let i = 0; i < cactusArray.length; i++) {
        let cactus = cactusArray[i];
        cactus.x += velocityX;
        
        if (cactus.img && cactus.img.complete) {
             context.drawImage(cactus.img, cactus.x, cactus.y, cactus.width, cactus.height);
        }

        // Collision Check
        if (detectCollision(dino, cactus)) {
            gameOver = true;
            dinoImg.src = "https://raw.githubusercontent.com/ImKennyYip/google-dino-game/master/img/dino-dead.png";
            dinoImg.onload = function() {
                context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
            }
            
            // Game Over Text
            context.fillStyle = "black";
            context.font = "20px courier";
            context.fillText("Game Over", boardWidth/2 - 50, boardHeight/2);
            context.fillText("Tap or Press Space to Restart", boardWidth/2 - 140, boardHeight/2 + 30);
        }
    }

    // Score
    context.fillStyle = "black";
    context.font = "20px courier";
    score++;
    context.fillText(score, 5, 20);
}

function moveDino(e) {
    // Prevent scrolling on mobile
    if(e.type === "touchstart") {
        e.preventDefault(); 
    }

    if (gameOver) {
        if (e.code == "Space" || e.code == "ArrowUp" || e.type == "touchstart") {
            resetGame();
        }
        return;
    }

    if ((e.code == "Space" || e.code == "ArrowUp" || e.type == "touchstart") && dino.y == dinoY) {
        // Jump
        velocityY = -10;
    }
}

function placeCactus() {
    if (gameOver) {
        return;
    }

    let cactus = {
        img: null,
        x: cactusX,
        y: cactusY,
        width: null,
        height: cactusHeight
    }

    let placeCactusChance = Math.random(); 

    if (placeCactusChance > 0.90) { 
        cactus.img = cactus3Img;
        cactus.width = cactus3Width;
        cactusArray.push(cactus);
    }
    else if (placeCactusChance > 0.70) { 
        cactus.img = cactus2Img;
        cactus.width = cactus2Width;
        cactusArray.push(cactus);
    }
    else if (placeCactusChance > 0.50) { 
        cactus.img = cactus1Img;
        cactus.width = cactus1Width;
        cactusArray.push(cactus);
    }

    if (cactusArray.length > 5) {
        cactusArray.shift(); 
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&   
           a.x + a.width > b.x &&   
           a.y < b.y + b.height &&  
           a.y + a.height > b.y;    
}

function resetGame() {
    gameOver = false;
    score = 0;
    cactusArray = [];
    velocityY = 0;
    dino.y = dinoY;
    dinoImg.src = "https://raw.githubusercontent.com/ImKennyYip/google-dino-game/master/img/dino.png";
}


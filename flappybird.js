console.log("this change was done by Yashpreet ")


//board
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

//bird
let birdWidth = 34;
let birdHeight = 24;
let birdX = boardWidth/8;
let birdY = boardHeight/2;
let birdImg;
let bird = {
    x : birdX,
    y : birdY,
    width : birdWidth,
    height : birdHeight
}

//pipes
let pipeArray = [];
let pipeWidht = 64;  //widht/height ratio = 384/3072 = 1/8
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

//physics
let velocityX = -2; //pipes moving left speed
let velocityY = 0; //bird jump speed
let gravity = 0.4; //


let gameOver = false;
let collisionSound = new Audio("collision1.mp3");

let score = 0;
let scoreSound = new Audio("score.mp3");
window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");  //used for drawing on board 
    
    //load images
    birdImg = new Image();
    birdImg.src = "./flappybird.png";
    birdImg.onload = function() {
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    }

    topPipeImg = new Image();
    topPipeImg.src = "./toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "./bottompipe.png";


    requestAnimationFrame(update);
    setInterval(placePipes, 1500); //every 1.5sec
    document.addEventListener("keydown", moveBird);
}



    function update() {
        requestAnimationFrame(update);
        if (gameOver) {
            return;
        }
        context.clearRect(0, 0, board.width, board.height);
        
        //bird
        velocityY += gravity;
        //bird.y += velocityY;
        bird.y = Math.max(bird.y + velocityY, 0);
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

        if (bird.y>board.height) {
            gameOver= true;
        }

        //pipe
        for (let i = 0; i < pipeArray.length; i++) {
            let pipe= pipeArray[i];
            pipe.x += velocityX;
            context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);
            if (!pipe.passed && bird.x > pipe.x + pipe.width) {
                score += 0.5; // 0.5 because 2 pipes hence 0.5*2 = 1
                pipe.passed = true;
            }
            if (detectCollision(bird, pipe)) {
                gameOver = true;
                collisionSound.play();
            }
        }

        //clear pipes
        while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidht) {
            pipeArray.shift(); //removes first element from array
        }
        //score
        context.fillStyle ="black";
        context.font ="45px sans-serif";
        context.fillText(score, 5, 45);

        if (score) {
            scoreSound.play();
        }

        if (gameOver) {
            context.fillText("GAME OVER",43 , 330);
        }
    }

    function placePipes() {
        if (gameOver) {
            return;
        }
        let randomPipeY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2);
        let openingSpace= board.height/4;
        let topPipe = {
            img : topPipeImg,
            x : pipeX,
            y : randomPipeY,
            width : pipeWidht,
            height : pipeHeight,
            passed : false
        }
        pipeArray.push(topPipe);

        let bottompipe = {
            img : bottomPipeImg,
            x : pipeX,
            y : randomPipeY + pipeHeight + openingSpace,
            width : pipeWidht,
            height: pipeHeight,
            passed : false
        }
        pipeArray.push(bottompipe);
    }

    function moveBird(e) {
        if (e.code == "Space" || e.code == "ArrowUp") {
            //jump
            velocityY = -6;

            //restart game
            if (gameOver) {
                bird.y = bird.y;
                pipeArray = [];
                score = 0;
                gameOver = false;
            }
        }
    }

    function detectCollision(a, b) {
        return a.x < b.x + b.width &&
               a.x + a.width > b.x &&
               a.y < b.y + b.height&&
               a.y + a.height > b.y;
    }
    
    
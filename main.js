const ITEM_WIDTH = 40;
const ITEM_BETWEEN_WIDTH = 120;
const HOLE_HEIGHT = 80;
const TARGET_WIDTH = 40;
const TARGET_HEIGHT = TARGET_WIDTH;
const TARGET_SPEED = 2;
const RANDOM_BASE = 80;
const RANDOM_MAX = 100;
let canvas;
let context;
let itemX;
let upPressed = false;
let downPressed = false;
let rightPressed = false;
let leftPressed = false;

let targetX;
let targetY;
let items = new Array(10);
let score = 0;
let interval;

function gameStart() {
  // 描画コンテキストの取得
  canvas = document.getElementById('sample');
  context = canvas.getContext('2d');
  // 各種初期値設定
  itemX = canvas.width;
  targetX = 0;
  targetY = (canvas.height - ITEM_WIDTH) / 2;
  for (let i = 0; i < items.length; i++) {
    items[i] = getRandomInt();
  }

  // キー操作ハンドラー登録
  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);

  interval = setInterval(render, 10);
}

/** 描画フロー */
function render() {

  // 主人公の移動
  if (upPressed && targetY > 0) {
    targetY -= TARGET_SPEED;
  } else if (downPressed && targetY < canvas.height - ITEM_WIDTH) {
    targetY += TARGET_SPEED;
  } else if (leftPressed && targetX > 0) {
    targetX -= TARGET_SPEED;
  } else if (rightPressed && targetX < canvas.width - ITEM_WIDTH) {
    targetX += TARGET_SPEED;
  }

  // 障害物の移動
  if (itemX < 0 - ITEM_WIDTH) {
    document.getElementById('score').innerHTML = ++score;
    items.shift();
    items.push(getRandomInt());
    itemX += ITEM_BETWEEN_WIDTH;
  } else {
    itemX -= 1;
  }

  drawItems();
  drawTarget();
}

function keyDownHandler(e) {
  if (e.key == "Up" || e.key == "ArrowUp") {
    upPressed = true;
  } else if (e.key == "Down" || e.key == "ArrowDown") {
    downPressed = true;
  } else if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = true;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key == "Up" || e.key == "ArrowUp") {
    upPressed = false;
  } else if (e.key == "Down" || e.key == "ArrowDown") {
    downPressed = false;
  } else if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = false;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = false;
  }
}

/** 障害物描画 */
function drawItems() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = 'green';
  // ここに具体的な描画内容を指定する
  for (let i = 0; i < items.length; i++) {
    let item_height = items[i];
    // 障害物上側
    context.fillRect(ITEM_BETWEEN_WIDTH * i + itemX, 0, ITEM_WIDTH, item_height);
    // 障害物下側
    context.fillRect(ITEM_BETWEEN_WIDTH * i + itemX, HOLE_HEIGHT + item_height, ITEM_WIDTH, canvas.height - item_height);
    // 行き過ぎた（判定をスキップする）障害物
    let skip_item_count = Math.ceil((targetX - itemX - ITEM_BETWEEN_WIDTH) / ITEM_BETWEEN_WIDTH);

    // ゲームおーば判定
    if ((i > skip_item_count && targetX + TARGET_WIDTH > ITEM_BETWEEN_WIDTH * i + itemX + 1
      && (targetY < item_height - 2 || targetY + TARGET_HEIGHT > HOLE_HEIGHT + item_height + 2))
      ||
      ((i == skip_item_count && targetX > ITEM_BETWEEN_WIDTH * i + itemX + 1 && targetX < ITEM_BETWEEN_WIDTH * i + itemX + ITEM_WIDTH
        && (targetY < item_height - 2 || targetY + TARGET_HEIGHT > HOLE_HEIGHT + item_height + 2)))) {

      alert(`GAME OVER! Your Score is  ${score}.`);
      clearInterval(interval);
      document.location.reload();
    }
  }
}

/** 主人公描画 */
function drawTarget() {
  context.fillStyle = 'red';
  context.fillRect(targetX, targetY, TARGET_WIDTH, TARGET_HEIGHT);
}

/**
 * 障害物の長さを設定するため、乱数を生成する。
 * @returns 最小値：RANDOM_BASE, 最大値: RANDOM_BASE + RANDOM_MAX
 */
function getRandomInt() {
  return RANDOM_BASE + Math.floor(Math.random() * RANDOM_MAX);
}

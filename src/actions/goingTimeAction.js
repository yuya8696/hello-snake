import { reactive } from "vue";

export const sleep = (sec) => {
  return new Promise((resolve) => setTimeout(resolve, sec * 1000));
};

// ヘビを進める
const forwardSnake = (snake, snakeHeadIndex) => {
  // 体の最後尾を頭に持ってくる
  snake.bodyIndexes.shift();
  snake.bodyIndexes.push(snakeHeadIndex.value);

  // 頭を1マス移動
  switch (snake.direction) {
    case "←":
      snake.headPos.x--;
      break;
    case "↑":
      snake.headPos.y--;
      break;
    case "→":
      snake.headPos.x++;
      break;
    case "↓":
      snake.headPos.y++;
      break;
  }

  return snake;
};

export function goingTimeAction(
  isGameover,
  isGatheringMember,
  snake,
  snakeHeadIndex
) {
  const snakeUpdated = reactive({});
  // 時間を進める
  const timeGoes = async () => {
    if (isGameover.value) return;
    if (isGatheringMember.value) {
      await sleep(4);
    }
    snakeUpdated.value = forwardSnake(snake, snakeHeadIndex).value;

    // speedミリ秒後に自分自身を呼び出す
    setTimeout(timeGoes.bind(this), snake.speed);
  };

  timeGoes();

  return snakeUpdated;
}

export default { sleep, goingTimeAction };

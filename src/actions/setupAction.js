export const randomizeMemberIndex = (gridSize, memberIndex) => {
  // メンバーの位置をランダムに移動
  memberIndex.value = Math.floor(
    Math.random() * gridSize.value * gridSize.value
  ); // 0 〜 99 の乱数

  return memberIndex;
};

export function setupAction(snake) {
  // キー入力を受け取ってヘビの進行方向を変える（逆方向は不可）
  const onKeydown = (keyCode) => {
    switch (keyCode) {
      case 37: // 「←」キーが押された
        if (snake.direction !== "→") {
          snake.direction = "←";
        }
        break;

      case 38: // 「↑」キーが押された
        if (snake.direction !== "↓") {
          snake.direction = "↑";
        }
        break;

      case 39: // 「→」キーが押された
        if (snake.direction !== "←") {
          snake.direction = "→";
        }
        break;

      case 40: // 「↓」キーが押された
        if (snake.direction !== "↑") {
          snake.direction = "↓";
        }
        break;
    }
  };

  // キーボード入力のイベントをonKeydownメソッドに投げる
  document.onkeydown = (event) => {
    onKeydown(event.keyCode);
  };

  return snake;
}

export default { randomizeMemberIndex, setupAction };

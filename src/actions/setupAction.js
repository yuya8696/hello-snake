import { ref, onMounted, reactive, toRefs } from "vue";

let memberIndex = ref(0); // メンバーの位置インデックス

// ヘビに関するデータ
const snakeAsReactive = reactive({
  headPos: {
    x: 1,
    y: 3,
  }, // 初期位置
  bodyIndexes: [0], // 体の位置インデックスたち
  direction: "→", // 進行方向
  speed: 400, // 1マス進むのにかかる時間[ms]
});

export const randomizeMemberIndex = (gridSize) => {
  // メンバーの位置をランダムに移動
  memberIndex.value = Math.floor(
    Math.random() * gridSize.value * gridSize.value
  ); // 0 〜 99 の乱数

  return memberIndex;
};

export function setupAction(gridSize) {
  // キー入力を受け取ってヘビの進行方向を変える（逆方向は不可）
  const onKeydown = (keyCode) => {
    switch (keyCode) {
      case 37: // 「←」キーが押された
        if (snakeAsReactive.direction !== "→") {
          snakeAsReactive.direction = "←";
        }
        break;

      case 38: // 「↑」キーが押された
        if (snakeAsReactive.direction !== "↓") {
          snakeAsReactive.direction = "↑";
        }
        break;

      case 39: // 「→」キーが押された
        if (snakeAsReactive.direction !== "←") {
          snakeAsReactive.direction = "→";
        }
        break;

      case 40: // 「↓」キーが押された
        if (snakeAsReactive.direction !== "↑") {
          snakeAsReactive.direction = "↓";
        }
        break;
    }
  };

  // 初期化処理
  onMounted(() => {
    memberIndex = randomizeMemberIndex(gridSize);

    // キーボード入力のイベントをonKeydownメソッドに投げる
    document.onkeydown = (event) => {
      onKeydown(event.keyCode);
    };
  });

  const snake = toRefs(snakeAsReactive);

  return {
    memberIndex,
    snake,
  };
}

export default { randomizeMemberIndex, setupAction };

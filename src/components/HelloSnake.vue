<template>
  <div class="hellosnake">
    <p class="hellosnake__score">SCORE: {{ snake.bodyIndexes.length - 1 }}</p>

    <div class="hellosnake__map">
      <!-- セルを100個生成して、必要に応じてhead, body, memberクラスを付ける -->
      <div
        v-for="i in gridSize * gridSize"
        :key="i"
        :class="{
          cell: true,
          head: snakeHeadIndex === i - 1,
          ['body-' + (i - 1)]: snake.bodyIndexes.includes(i - 1),
          member: memberIndex === i - 1,
        }"
        :style="{
          ...memberIndexImage,
          ...snakeHeadImage,
          ...setSnakeBodyImage(i),
        }"
      >
        <!-- {{ i - 1 }} -->
      </div>
    </div>

    <!-- body: snake.bodyIndexes.includes(i - 1), -->

    <!-- 画像表示 -->
    <div v-if="isGatheringMember" class="hellosnake__image">
      <img src="../assets/logo.png" />
    </div>

    <p v-if="isGameover">
      GAME OVER<br />
      <button onclick="location.reload()">RETRY</button>
    </p>
  </div>
</template>

<script>
import { computed, onMounted, ref, reactive, toRefs } from "vue";

import { setupAction, randomizeMemberIndex } from "../actions/setupAction";
import gatheringMembersAction from "../actions/gatheringMembersAction";
import { goingTimeAction } from "../actions/goingTimeAction";

export default {
  name: "HelloSnake",
  setup() {
    let gridSize = ref(10); // 10 x 10 マス

    let memberIndex = ref(0); // メンバーの位置インデックス

    // ヘビに関するデータ
    const snake = reactive({
      headPos: {
        x: 1,
        y: 3,
      }, // 初期位置
      bodyIndexes: [0], // 体の位置インデックスたち
      direction: "→", // 進行方向
      speed: 400, // 1マス進むのにかかる時間[ms]
    });

    const isFrameout = computed(() => {
      const head = snake.headPos;
      return (
        head.x < 0 ||
        gridSize.value <= head.x ||
        head.y < 0 ||
        gridSize.value <= head.y
      );
    });

    const snakeHeadIndex = computed(() => {
      if (isFrameout.value) return null;
      return snake.headPos.y * gridSize.value + snake.headPos.x;
    });

    // メンバーを集めた？
    const isGatheringMember = computed(() => {
      return snakeHeadIndex.value === memberIndex.value;
    });

    // 自己衝突してる？
    const isSuicided = computed(() => {
      return snake.bodyIndexes.includes(snakeHeadIndex.value);
    });

    // ゲームオーバー？
    const isGameover = computed(() => {
      return isSuicided.value || isFrameout.value;
    });

    // 初期化処理
    onMounted(() => {
      // 1. メンバーの初期位置決定とキーボード入力定義
      memberIndex.value = randomizeMemberIndex(gridSize, memberIndex).value;
      snake.value = setupAction(snake).value;

      // 2. 時間経過によるスネークのアクション
      snake.value = goingTimeAction(
        isGameover,
        isGatheringMember,
        snake,
        snakeHeadIndex
      ).value;
    });

    // 3. メンバーを集めた時のアクション
    const {
      memberIndexUpdated,
      snakeUpdated,
      ImagePath,
    } = gatheringMembersAction(gridSize, memberIndex, snake, isGatheringMember);

    memberIndex.value = memberIndexUpdated.value;
    Object.assign(snake.bodyIndexes, snakeUpdated.bodyIndexes);

    const memberIndexImage = computed(() => ({
      "--member-index-image": `url(${ImagePath.member})`,
    }));

    const snakeHeadImage = computed(() => ({
      "--snake-head-image": `url(${ImagePath.head})`,
    }));

    const setSnakeBodyImage = (gridIndex) => {
      if (!snake.bodyIndexes.includes(gridIndex - 1)) return "";
      if (ImagePath.body.length === 0) return;

      // gridIndexの順番ごとに異なる画像をセットする
      console.log("target is " + snake.bodyIndexes.indexOf(gridIndex - 1));
      return {
        "background-image": `url(${
          ImagePath.body[snake.bodyIndexes.indexOf(gridIndex - 1)]
        })`,
      };
    };

    return {
      gridSize,
      memberIndex,
      snake,
      isFrameout,
      snakeHeadIndex,
      isGameover,
      isGatheringMember,
      memberIndexImage,
      snakeHeadImage,
      setSnakeBodyImage,
    };
  },
};
</script>

<style lang="scss">
/* グリッドレイアウト */
.hellosnake {
  position: relative;

  &__map {
    --grid-size: 10; /* 10 x 10 マス（CSS変数） */

    display: grid;
    grid-template-columns: repeat(var(--grid-size), 80px); /* 10列 幅80px */
    grid-template-rows: repeat(var(--grid-size), 80px); /* 10行 高さ80px */

    /* セルの色 */
    .cell {
      border: 1px solid white;
      background: whitesmoke;
    }

    /* ヘビの体の色 */
    // .cell.body {
    //   background-color: lightgray;
    // }

    /* フルーツの色 */
    .cell.member {
      background-image: var(--member-index-image);
    }

    /* ヘビの頭の色 */
    .cell.head {
      background-image: var(--snake-head-image);
    }
  }

  &__image {
    width: 800px;
    height: 800px;
    position: absolute;
    top: 200px;
    left: 0;
    // right: 0;
    // bottom: 0;
    margin: auto;
  }
}
</style>

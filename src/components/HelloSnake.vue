<template>
  <div class="hellosnake">
    <p class="hellosnake__score">
      SCORE: {{ (snake.bodyIndexes.length - 1) * 10 }}
    </p>

    <div v-if="isStart" class="hellosnake__start">
      <button class="hellosnake__start__btn" @click="startingGame()">
        START
      </button>
      <p></p>
      <div>
        <img :src="memberImages[0]" />
        <img :src="memberImages[1]" />
      </div>
      <p style="font-size: 30px">↑↑ このメンバーで始めまるよ ↑↑</p>
    </div>

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

    <!-- 画像表示 -->
    <div v-if="isGatheringMember" class="hellosnake__image">
      <img :src="memberImages[snake.bodyIndexes.length + 1]" />
    </div>

    <p v-if="isGameover" class="hellosnake__over">
      GAME OVER<br />
      <button onclick="location.reload()">RETRY</button>
    </p>
  </div>
</template>

<script>
import { computed, onMounted, ref, reactive, toRefs } from "vue";

import {
  setupAction,
  randomizeMemberIndex,
} from "../assets/scripts/setupAction";
import gatheringMembersAction from "../assets/scripts/gatheringMembersAction";
import { goingTimeAction } from "../assets/scripts/goingTimeAction";

import memberImages from "../assets//library/imagePaths";

export default {
  name: "HelloSnake",
  setup() {
    let isStart = ref(true);

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
      speed: 200, // 1マス進むのにかかる時間[ms]
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
      // メンバーの初期位置決定とキーボード入力定義
      memberIndex.value = randomizeMemberIndex(gridSize, memberIndex).value;
      snake.value = setupAction(snake).value;
    });

    const startingGame = () => {
      // 時間経過によるスネークのアクション
      snake.value = goingTimeAction(
        isGameover,
        isGatheringMember,
        snake,
        snakeHeadIndex
      ).value;
      isStart.value = false;
    };

    const {
      memberIndexUpdated,
      snakeUpdated,
      ImageFilePath,
    } = gatheringMembersAction(gridSize, memberIndex, snake, isGatheringMember);

    memberIndex.value = memberIndexUpdated.value;
    Object.assign(snake.bodyIndexes, snakeUpdated.bodyIndexes);

    const memberIndexImage = computed(() => ({
      "--member-index-image": `url(${ImageFilePath.member})`,
    }));

    const snakeHeadImage = computed(() => ({
      "--snake-head-image": `url(${ImageFilePath.head})`,
    }));

    const setSnakeBodyImage = (gridIndex) => {
      if (!snake.bodyIndexes.includes(gridIndex - 1)) return "";
      if (ImageFilePath.body.length === 0) return;

      // gridIndexの順番ごとに異なる画像をセットする
      console.log("target is " + snake.bodyIndexes.indexOf(gridIndex - 1));
      return {
        "background-image": `url(${
          ImageFilePath.body[snake.bodyIndexes.indexOf(gridIndex - 1)]
        })`,
        "background-position": "center center",
        "background-repeat": "no-repeat",
        "background-size": "cover",
      };
    };

    return {
      isStart,
      startingGame,
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
      memberImages,
    };
  },
};
</script>

<style lang="scss">
/* グリッドレイアウト */
.hellosnake {
  position: relative;

  &__start {
    position: absolute;
    width: 100vw;
    top: 200px;
    left: 0;
    margin: auto;
    font-size: 50px;
    text-align: center;

    &__btn {
      font-size: 50px;
      color: #fff;
      background-color: pink;
      border-radius: 100vh;
    }

    &__btn:hover {
      color: #fff;
      background: pink;
    }
  }

  &__map {
    --grid-size: 10; /* 10 x 10 マス（CSS変数） */

    display: grid;
    grid-template-columns: repeat(
      var(--grid-size),
      minmax(50px, 80px)
    ); /* 10列 幅80px */
    grid-template-rows: repeat(
      var(--grid-size),
      minmax(50px, 80px)
    ); /* 10行 高さ80px */

    align-items: stretch;
    justify-self: center;

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
      background-position: center center;
      background-repeat: no-repeat;
      background-size: cover;
    }

    /* ヘビの頭の色 */
    .cell.head {
      background-image: var(--snake-head-image);
      background-position: center center;
      background-repeat: no-repeat;
      background-size: cover;
    }
  }

  &__image {
    width: 800px;
    object-fit: cover;
    height: 800px;
    position: absolute;
    top: 200px;
    left: 0;
    // right: 0;
    // bottom: 0;
    margin: auto;
  }

  &__over {
    position: absolute;
    width: 100vw;
    top: 200px;
    left: 0;
    margin: auto;
    font-size: 50px;
    text-align: center;
  }
}
</style>

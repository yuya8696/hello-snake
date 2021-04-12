<template>
  <div class="hellosnake">
    <p class="hellosnake__score">
      SCORE: {{ snake.bodyIndexes.value.length - 1 }}
    </p>

    <div class="hellosnake__map">
      <!-- セルを100個生成して、必要に応じてhead, body, memberクラスを付ける -->
      <div
        v-for="i in gridSize * gridSize"
        :key="i"
        :class="{
          cell: true,
          head: snakeHeadIndex === i - 1,
          body: snake.bodyIndexes.value.includes(i - 1),
          member: memberIndex === i - 1,
        }"
      >
        <!-- {{ i - 1 }} -->
      </div>
    </div>

    <p v-if="isGameover">
      GAME OVER<br />
      <button onclick="location.reload()">RETRY</button>
    </p>
  </div>
</template>

<script>
import { computed, onMounted, ref, watch } from "vue";

import { setupAction, randomizeMemberIndex } from "../actions/setupAction";
import gatheringMembersAction from "../actions/gatheringMembersAction";

export default {
  name: "HelloSnake",
  setup() {
    let gridSize = ref(10); // 10 x 10 マス

    // 1. メンバーの初期位置決定とキーボード入力定義
    const { memberIndex, snake } = setupAction(gridSize);

    // 2. スネークの頭の位置確認
    const isFrameout = computed(() => {
      const head = snake.headPos.value;
      return (
        head.x < 0 ||
        gridSize.value <= head.x ||
        head.y < 0 ||
        gridSize.value <= head.y
      );
    });

    const snakeHeadIndex = computed(() => {
      if (isFrameout.value) return null;
      return snake.headPos.value.y * gridSize.value + snake.headPos.value.x;
    });

    // 3. メンバーを集めた時にスネーク長を増やし、次のメンバー位置を決定する
    const isGatheringMember = computed(() => {
      return snakeHeadIndex.value === memberIndex.value;
    });

    const { memberIndexUpdated, snakeUpdated } = gatheringMembersAction(
      gridSize,
      snake,
      isGatheringMember
    );

    memberIndex.value = memberIndexUpdated.value;
    Object.assign(snake.bodyIndexes.value, snakeUpdated.bodyIndexes.value);

    // 自己衝突してる？
    const isSuicided = computed(() => {
      return snake.bodyIndexes.value.includes(snakeHeadIndex.value);
    });

    // ゲームオーバー？
    const isGameover = computed(() => {
      return isSuicided.value || isFrameout.value;
    });

    // const growUpSnake = () => {
    //   snake.bodyIndexes.value.unshift(snake.bodyIndexes.value[0]);
    // };

    // ヘビを進める
    const forwardSnake = () => {
      // 体の最後尾を頭に持ってくる
      snake.bodyIndexes.value.shift();
      snake.bodyIndexes.value.push(snakeHeadIndex.value);

      // 頭を1マス移動
      switch (snake.direction.value) {
        case "←":
          snake.headPos.value.x--;
          break;
        case "↑":
          snake.headPos.value.y--;
          break;
        case "→":
          snake.headPos.value.x++;
          break;
        case "↓":
          snake.headPos.value.y++;
          break;
      }
    };

    // 時間を進める
    const timeGoes = () => {
      if (isGameover.value) return;
      forwardSnake();

      // speedミリ秒後に自分自身を呼び出す
      setTimeout(timeGoes.bind(this), snake.speed.value);
    };

    // 初期化処理
    onMounted(() => {
      // randomizeMemberIndex();
      // // キーボード入力のイベントをonKeydownメソッドに投げる
      // document.onkeydown = (event) => {
      //   onKeydown(event.keyCode);
      // };
      // 時間を動かし始める
      timeGoes();
    });

    // watch(isGatheringMember, (newValue) => {
    //   if (!newValue) return;
    //   growUpSnake();
    //   memberIndex.value = randomizeMemberIndex(gridSize).value;
    // });

    return {
      gridSize,
      memberIndex,
      snake,
      isFrameout,
      snakeHeadIndex,
      isGameover,
    };
  },
};
</script>

<style lang="scss">
/* グリッドレイアウト */
.hellosnake {
  &__map {
    --grid-size: 10; /* 10 x 10 マス（CSS変数） */

    display: grid;
    grid-template-columns: repeat(var(--grid-size), 100px); /* 10列 幅30px */
    grid-template-rows: repeat(var(--grid-size), 100px); /* 10行 高さ30px */

    /* セルの色 */
    .cell {
      border: 1px solid white;
      background: whitesmoke;
    }

    /* ヘビの体の色 */
    .cell.body {
      background-color: lightgray;
    }

    /* フルーツの色 */
    .cell.member {
      background-color: red;
    }

    /* ヘビの頭の色 */
    .cell.head {
      background-color: darkgray;
    }
  }
}
</style>

import { watch, ref, reactive } from "vue";
import { randomizeMemberIndex } from "../scripts/setupAction";
import { sleep } from "../scripts/goingTimeAction";

import memberImages from "../library/imagePaths";

export default function gatheringMembersAction(
  gridSize,
  memberIndex,
  snake,
  isGatheringMember
) {
  const memberIndexUpdated = ref(0);
  const snakeUpdated = reactive({});
  const ImageFilePath = reactive({
    member: "src/assets/images/ishida.jpg",
    head: "src/assets/images/fukumura.jpg",
    body: ["src/assets/images/ikuta.jpg"],
  });

  const growUpSnake = () => {
    snake.bodyIndexes.unshift(snake.bodyIndexes[0]);
    return snake;
  };

  const defineImages = () => {
    // メンバーの出現の順番あh配列の順番
    ImageFilePath.member = memberImages[snake.bodyIndexes.length + 1];

    // snakeの先頭はふくちゃんで固定
    ImageFilePath.head = memberImages[0];

    // 集めたメンバーをスネークの後方に足していく
    ImageFilePath.body.unshift(memberImages[snake.bodyIndexes.length]);
  };

  watch(isGatheringMember, async (newValue) => {
    if (!newValue) return;
    await sleep(3);

    // snakeの長さを増やす
    snakeUpdated.value = growUpSnake().value;

    // snakeの先頭とメンバー画像のファイルパス指定する
    defineImages();

    // 次のメンバーの表示位置を決める
    memberIndexUpdated.value = randomizeMemberIndex(
      gridSize,
      memberIndex
    ).value;
    await sleep(2);
  });

  return {
    memberIndexUpdated,
    snakeUpdated,
    ImageFilePath,
  };
}

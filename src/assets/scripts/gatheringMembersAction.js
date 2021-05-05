import { watch, ref, reactive } from "vue";
import { randomizeMemberIndex } from "../scripts/setupAction";
import { sleep } from "../scripts/goingTimeAction";

import imagePaths from "../library/imagePaths";

export default function gatheringMembersAction(
  gridSize,
  memberIndex,
  snake,
  isGatheringMember
) {
  const memberIndexUpdated = ref(0);
  const snakeUpdated = reactive({});
  const ImagePath = reactive({
    member: "src/assets/images/ishida.jpg",
    head: "src/assets/images/fukumura.jpg",
    body: ["src/assets/images/ikuta.jpg"],
  });

  const growUpSnake = () => {
    snake.bodyIndexes.unshift(snake.bodyIndexes[0]);
    return snake;
  };

  watch(isGatheringMember, async (newValue) => {
    if (!newValue) return;
    await sleep(3);

    // snakeの長さを増やす
    snakeUpdated.value = growUpSnake().value;

    // snakeの先頭とメンバー画像のファイルパス指定する
    ImagePath.member = imagePaths[snake.bodyIndexes.length + 1];
    ImagePath.head = imagePaths[snake.bodyIndexes.length];
    if (snake.bodyIndexes.length > 1) {
      ImagePath.body.push(imagePaths[snake.bodyIndexes.length - 1]);
      console.log("passed " + ImagePath.body);
    }
    console.log("ImagePath.body is " + ImagePath.body);

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
    ImagePath,
  };
}

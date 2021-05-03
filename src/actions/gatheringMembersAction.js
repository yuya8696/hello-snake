import { watch, ref, reactive } from "vue";
import { randomizeMemberIndex } from "../actions/setupAction";
import { sleep } from "../actions/goingTimeAction";

const imagePaths = [
  // スネークの頭の画像(初期値)
  "src/assets/cat.jpg",

  // スネークの体の画像（初期値）
  "src/assets/cat.jpg",

  // 集めるメンバーの画像
  "src/assets/inu.jpg",
  "src/assets/bird.jpg",
  "src/assets/dummy1.jpg",
  "src/assets/dummy2.jpg",
];

export default function gatheringMembersAction(
  gridSize,
  memberIndex,
  snake,
  isGatheringMember
) {
  const memberIndexUpdated = ref(0);
  const snakeUpdated = reactive({});
  const ImagePath = reactive({
    member: "src/assets/inu.jpg",
    head: "src/assets/cat.jpg",
    body: ["src/assets/cat.jpg"],
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

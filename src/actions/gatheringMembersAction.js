import { watch, ref, reactive } from "vue";
import { randomizeMemberIndex } from "../actions/setupAction";

export default function gatheringMembersAction(
  gridSize,
  snake,
  isGatheringMember
) {
  const memberIndexUpdated = ref(0);
  const snakeUpdated = reactive({
    bodyIndexes: [0], // 体の位置インデックスたち
  });

  const growUpSnake = () => {
    snake.bodyIndexes.value.unshift(snake.bodyIndexes.value[0]);
    return snake;
  };

  watch(isGatheringMember, (newValue) => {
    if (!newValue) return;
    snakeUpdated.bodyIndexes.value = growUpSnake().bodyIndexes.value;
    memberIndexUpdated.value = randomizeMemberIndex(gridSize).value;
  });

  return {
    memberIndexUpdated,
    snakeUpdated,
  };
}

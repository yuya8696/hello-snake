import { watch, ref, reactive } from "vue";
import { randomizeMemberIndex } from "../actions/setupAction";
import { sleep } from "../actions/goingTimeAction";

export default function gatheringMembersAction(
  gridSize,
  memberIndex,
  snake,
  isGatheringMember
) {
  const memberIndexUpdated = ref(0);
  const snakeUpdated = reactive({});

  const growUpSnake = () => {
    snake.bodyIndexes.unshift(snake.bodyIndexes[0]);
    return snake;
  };

  watch(isGatheringMember, async (newValue) => {
    if (!newValue) return;
    await sleep(3);
    snakeUpdated.value = growUpSnake().value;
    memberIndexUpdated.value = randomizeMemberIndex(
      gridSize,
      memberIndex
    ).value;
    await sleep(2);
  });

  return {
    memberIndexUpdated,
    snakeUpdated,
  };
}

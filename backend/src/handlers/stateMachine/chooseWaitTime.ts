const MIN_WAIT_TIME = 1;
const MAX_WAIT_TIME = 60;

export const main = async () => {
  const waitTime =
    MIN_WAIT_TIME + Math.floor(Math.random() * (MAX_WAIT_TIME - MIN_WAIT_TIME));
  return {
    waitTime: waitTime,
  };
};

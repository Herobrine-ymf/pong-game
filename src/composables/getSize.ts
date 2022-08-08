export default () => {
  return {
    ballDiameter: innerHeight * (config.ballDiameter / 820),
    bulletDiameter: innerHeight * (config.bulletDiameter / 820),
    boardWidth: innerHeight * (config.boardWidth / 820),
    boardHeight: innerHeight * (config.boardHeight / 820),
    boardBottom: innerHeight * (config.boardBottom / 820),
  };
};

export default {
  difficulty: 5,
  ballDiameter: 60,
  bulletDiameter: 20,
  boardWidth: 250,
  boardHeight: 20,
  boardBottom: 40,

  multiple: {
    diameter: 50,
    ballSpeed: 4,
    boardSpeed: 256,
    boardWidth: 25,
    boardHeight: 256,
    boardInterval: 40,

    timeOut: 500,
  },

  antiCheat: false,

  url: "/.netlify/functions/rank",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json;charset=UTF-8",
  },
};

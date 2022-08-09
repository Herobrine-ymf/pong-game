export default {
  difficulty: 5,
  ballDiameter: 60,
  bulletDiameter: 20,
  boardWidth: 250,
  boardHeight: 20,
  boardBottom: 40,

  antiCheat: false,

  url: "/.netlify/functions/rank",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json;charset=UTF-8",
  },
};

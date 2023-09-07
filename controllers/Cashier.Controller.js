import Game from "../models/games.js";

const getAllGamesByCashier = async (req, res) => {
  const { cashierID } = req.params;
  try {
    const games = await Game.find({ cashierID });
    res.status(200).json(games);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve games" });
  }
};


export { getAllGamesByCashier};

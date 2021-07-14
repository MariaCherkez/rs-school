import { Router } from "express";
import { Statistics } from "../models/statistics";
import {
  clearStatistics,
  getStatistics,
  getStatisticsByCard,
  getStatisticsById,
  updateStatistics,
} from "../database";

const router = Router();

router.get("/", async (req, res) => {
  const { id, cardId } = req.query;
  if (!id && !cardId) {
    const statistics = await getStatistics();
    res.json(statistics);
  } else if (id) {
    const statisticsId = id.toString();
    if (!statisticsId) return res.sendStatus(400);
    const statistics = await getStatisticsById(statisticsId);
    if (!statistics) return res.sendStatus(404);
    res.json(statistics);
  } else if (cardId) {
    const cId = cardId.toString();
    if (!cId) return res.sendStatus(400);
    const statistics = await getStatisticsByCard(cId);
    res.json(statistics);
  }
});

router.delete("/", async (req, res) => {
  try {
    await clearStatistics();
    return res.status(200).send("Statistics has been successfully removed");
  } catch (e) {
    return res.status(404).send(e);
  }
});

router.put("/", async (req, res) => {

  const data = req.body as Statistics;
  if (!data.cardId) return res.sendStatus(400);
  try {
    const resUpdate = await updateStatistics(data);
    if (resUpdate.modifiedCount)
      return res.status(200).send("Statistics has been successfully updated");
    return res.status(404).send("Statistics not found");
  } catch (e) {
    return res.status(400).send(e);
  }
});

export default router;

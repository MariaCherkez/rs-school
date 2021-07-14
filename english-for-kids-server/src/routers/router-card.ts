import { Router } from "express";
import { Card } from "../models/card";
import {
  getCategoryById,
  createCard,
  deleteCard,
  getCards,
  getCardById,
  updateCard,
  createStatistics,
  getCardsByCategory,
  deleteCardsByCategory,
} from "../database";
import { Statistics } from "../models/statistics";

const router = Router();

router.get("/", async (req, res) => {
  const { id, categoryId } = req.query;
  if (!id && !categoryId) {
    const cards = await getCards();
    res.json(cards);
  } else if (id) {
    const cardId = id.toString();
    if (!cardId) return res.sendStatus(400);
    const card = await getCardById(cardId);
    if (!card) return res.sendStatus(404);
    res.json(card);
  } else if (categoryId) {
    const catId = categoryId.toString();
    if (!catId) return res.sendStatus(400);
    const cards = await getCardsByCategory(catId);
    res.json(cards);
  }
});

router.delete("/", async (req, res) => {
  const { id, categoryId } = req.query;
  if (!id && !categoryId) {
    return res.sendStatus(400);
  } else if (id) {
    try {
      const deleteRes = await deleteCard(id.toString());
      if (deleteRes.deletedCount)
        return res.status(200).send("Card has been successfully removed");
      return res.sendStatus(404).send("Card not found");
    } catch (e) {
      return res.status(404).send(e);
    }
  } else if (categoryId) {
    try {
      const deleteRes = await deleteCardsByCategory(categoryId.toString());
      if (deleteRes.deletedCount)
        return res.status(200).send("Successfully removed");
      return res.sendStatus(404).send("not found");
    } catch (e) {
      return res.status(404).send(e);
    }
  }
});

router.post("/", async (req, res) => {
  const data = req.body as Card;
  if (
    !data.image ||
    !data.categoryId ||
    !data.audio ||
    !data.translate ||
    !data.word
  )
    return res.sendStatus(400);
  try {
    const insertRes = await createCard(data);
    if (insertRes.insertedCount) {
      const statistics = {
        cardId: insertRes.insertedId,
        train: 0,
        correct: 0,
        error: 0,
      };
      const insertStatistics = await createStatistics(statistics as Statistics);
      if (insertStatistics.insertedCount) {
        return res.status(200).send("Card has been successfully created");
      } else {
        throw new Error("Statisctics not created");
      }
    }
    throw new Error("Card not created");
  } catch (e) {
    return res.status(400).send(e);
  }
});

router.put("/", async (req, res) => {
  const data = req.body as Card;
  if (
    !data.image ||
    !data.categoryId ||
    !data.audio ||
    !data.translate ||
    !data.word
  )
    return res.sendStatus(400);
  const category = await getCategoryById(data.categoryId.toString());
  if (!category) {
    return res.status(400).send("Invalid category ID");
  }
  try {
    const resUpdate = await updateCard(data);
    if (resUpdate.modifiedCount)
      return res.status(200).send("Card has been successfully updated");
    return res.sendStatus(404).send("Card not found");
  } catch (e) {
    return res.status(400).send(e);
  }
});

export default router;

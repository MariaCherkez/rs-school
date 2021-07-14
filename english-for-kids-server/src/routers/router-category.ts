import { Router } from "express";
import { Category } from "../models/category";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  updateCategory,
} from "../database";

const router = Router();

router.get("/", async (req, res) => {
  const { id } = req.query;
  if (id) {
    const catId = id.toString();
    if (!catId) return res.sendStatus(400);
    const cat = await getCategoryById(catId);
    if (!cat) return res.sendStatus(404);
    res.json(cat);
  }
  const categories = await getCategories();
  res.json(categories);
});

router.delete("/:id", async (req, res) => {
  const catId = req.params.id.toString();
  if (!catId) {
    return res.sendStatus(400);
  }
  try {
    const deleteRes = await deleteCategory(catId);
    if (deleteRes.deletedCount)
      return res.status(200).send("Сategory has been successfully removed");
    return res.sendStatus(404).send("Category not found");
  } catch (e) {
    return res.status(404).send(e);
  }
});

router.post("/", async (req, res) => {
  const data = req.body as Category;
  if (!data.name) return res.sendStatus(400);
  try {
    const insertRes = await createCategory(data);
    if (insertRes.insertedCount)
      return res.status(200).send("Сategory has been successfully created");
    throw new Error("Category not created");
  } catch (e) {
    return res.status(400).send(e);
  }
});

router.put("/", async (req, res) => {
  const data = req.body as Category;

  if (!data.name || !data.image) return res.sendStatus(400);
  try {
    const resUpdate = await updateCategory(data);

    if (resUpdate.modifiedCount)
      return res.status(200).send("Сategory has been successfully updated");

    return res.status(404).send("Category not found");
  } catch (e) {
    return res.status(400).send(e);
  }
});

export default router;

 
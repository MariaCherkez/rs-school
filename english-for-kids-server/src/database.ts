import { Collection, MongoClient } from "mongodb";
import { Card } from "./models/card";
import { Category } from "./models/category";
import { Statistics } from "./models/statistics";

const ObjectId = require("mongodb").ObjectId;
const userName = "user";
const password = "0106116";
const url = `mongodb+srv://${userName}:${password}@cards.1mhs0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const nameDb = "Cards";
let client: MongoClient;
const collectionCards = "cards";
const collectionCategories = "categories";
const collectionStatistics = "statistics";

const getMongoInstance = async () => {
  client = await MongoClient.connect(url, { useUnifiedTopology: true });
  return client.db(nameDb);
};

const getCollection = async (name: string): Promise<Collection> => {
  const db = await getMongoInstance();
  return db.collection(name);
};

const getId = (id: string) => {
  let res;
  try {
    res = new ObjectId(id);
  } catch (e) {
    res = id;
  }
  return res;
};

/*Categories*/

export const getCategories = async () => {
  const collection = await getCollection(collectionCategories);
  const res = await collection.find().toArray();
  client.close();
  return res;
};

export const getCategoryById = async (_id: string) => {
  const collection = await getCollection(collectionCategories);
  const res = await collection.findOne({ _id: getId(_id) });
  client.close();
  return res;
};

export const createCategory = async (category: Category) => {
  const collection = await getCollection(collectionCategories);
  const res = await collection.insertOne(category);
  client.close();
  return res;
};

export const deleteCategory = async (_id: string) => {
  const collection = await getCollection(collectionCategories);
  const res = await collection.deleteOne({ _id: getId(_id) });
  client.close();
  return res;
};

export const updateCategory = async (category: Category) => {
  const collection = await getCollection(collectionCategories);

  const res = await collection.updateOne(
    { _id: getId(category._id.toString()) },
    { $set: { name: category.name, image: category.image } }
  );
  client.close();
  return res;
};

/* Cards */

export const getCards = async () => {
  const collection = await getCollection(collectionCards);
  const res = await collection.find().toArray();
  client.close();
  return res;
};

export const getCardsByCategory = async (categoryId: string) => {
  const collection = await getCollection(collectionCards);
  const res = await collection
    .find({ categoryId: getId(categoryId) })
    .toArray();
  client.close();
  return res;
};

export const getCardById = async (_id: string) => {
  const collection = await getCollection(collectionCards);
  const res = await collection.findOne({ _id: getId(_id) });
  client.close();
  return res;
};

export const createCard = async (card: Card) => {
  const collection = await getCollection(collectionCards);
  const res = await collection.insertOne(card);
  client.close();
  return res;
};

export const deleteCard = async (_id: string) => {
  const collection = await getCollection(collectionCards);
  const res = await collection.deleteOne({ _id: getId(_id) });
  client.close();
  return res;
};

export const updateCard = async (card: Card) => {
  const collection = await getCollection(collectionCards);

  const res = await collection.updateOne(
    { _id: getId(card._id.toString()) },
    {
      $set: {
        categoryId: card.categoryId,
        image: card.image,
        audio: card.audio,
        word: card.word,
        translate: card.translate,
      },
    }
  );
  client.close();
  return res;
};

/* Statistics */

export const getStatistics = async () => {
  const collection = await getCollection(collectionStatistics);
  const res = await collection.find().toArray();
  client.close();
  return res;
};

export const createStatistics = async (statistics: Statistics) => {
  const collection = await getCollection(collectionStatistics);
  const res = await collection.insertOne(statistics);
  client.close();
  return res;
};

export const getStatisticsById = async (_id: string) => {
  const collection = await getCollection(collectionStatistics);
  const res = await collection.findOne({ _id: getId(_id) });
  client.close();
  return res;
};

export const getStatisticsByCard = async (cardId: string) => {
  const collection = await getCollection(collectionStatistics);
  const res = await collection.findOne({ cardId: getId(cardId) });
  client.close();
  return res;
};

export const clearStatistics = async () => {
  const collection = await getCollection(collectionStatistics);
  const res = await collection.updateMany(
    {},
    {
      $set: {
        train: 0,
        correct: 0,
        error: 0,
      },
    }
  );
  client.close();
  return res;
};

export const updateStatistics = async (statistics: Statistics) => {
  const collection = await getCollection(collectionStatistics);
  const res = await collection.updateOne(
    { _id: getId(statistics._id.toString()) },
    {
      $set: {
        cardId: statistics.cardId,
        train: statistics.train,
        correct: statistics.correct,
        error: statistics.error,
      },
    }
  );

  client.close();
  return res;
};

export const deleteCardsByCategory = async (categoryId: string) => {
  const collection = await getCollection(collectionCards);
  const res = await collection.deleteMany({ categoryId: getId(categoryId) });

  client.close();
  return res;
};

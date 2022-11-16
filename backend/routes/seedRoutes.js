import express from 'express';
import Real from '../models/realModel.js';
import data from '../data.js';
import User from '../models/userModel.js';

const seedRouter = express.Router();

seedRouter.get('/', async (req, res) => {
  await Real.remove({});
  const createdReals = await Real.insertMany(data.reals);
  await User.remove({});
  const createdUsers = await User.insertMany(data.users);
  res.send({ createdReals, createdUsers });
});
export default seedRouter;
import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Real from '../models/realModel.js';
import { isAuth,  } from '../utils.js';

const realRouter = express.Router();

realRouter.get('/', async (req, res) => {
  const reals = await Real.find();
  res.send(reals);
});

realRouter.post(
  '/',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const newReal = new Real({
      name: 'sample name ' + Date.now(),
      slug: 'sample-name-' + Date.now(),
      image: '/images/p1.jpg',
      category: 'sample category',
      countInStock: 0,
      numReviews: 0,
      description: 'sample description',
    });
    const real = await newReal.save();
    res.send({ message: 'Real Created', real });
  })
);

realRouter.put(
  '/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const realId = req.params.id;
    const real = await Real.findById(realId);
    if (real) {
      real.name = req.body.name;
      real.slug = req.body.slug;
      real.image = req.body.image;
      real.images = req.body.images;
      real.category = req.body.category;
      real.countInStock = req.body.countInStock;
      real.description = req.body.description;
      await real.save();
      res.send({ message: 'Real Updated' });
    } else {
      res.status(404).send({ message: 'Real Not Found' });
    }
  })
);

realRouter.delete(
  '/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const real = await Real.findById(req.params.id);
    if (real) {
      await real.remove();
      res.send({ message: 'Real Deleted' });
    } else {
      res.status(404).send({ message: 'Real Not Found' });
    }
  })
);

realRouter.post(
  '/:id/reviews',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const realId = req.params.id;
    const real = await Real.findById(realId);
    if (real) {
      if (real.reviews.find((x) => x.name === req.user.name)) {
        return res
          .status(400)
          .send({ message: 'You already submitted a review' });
      }

      const review = {
        name: req.user.name,
        rating: Number(req.body.rating),
        comment: req.body.comment,
      };
      real.reviews.push(review);
      real.numReviews = real.reviews.length;
      real.rating =
        real.reviews.reduce((a, c) => c.rating + a, 0) /
        real.reviews.length;
      const updatedReal = await real.save();
      res.status(201).send({
        message: 'Review Created',
        review: updatedReal.reviews[updatedReal.reviews.length - 1],
        numReviews: real.numReviews,
        rating: real.rating,
      });
    } else {
      res.status(404).send({ message: 'real Not Found' });
    }
  })
);

// const PAGE_SIZE = 3;


realRouter.get(
  '/search',
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    // const pageSize = query.pageSize || PAGE_SIZE;
    // const page = query.page || 1;
    const category = query.category || '';


   const categoryFilter = category && category !== 'all' ? { category } : {};
   
    const reals = await Real.find({
      ...categoryFilter,
    })

    const countReals = await Real.countDocuments({
      ...categoryFilter,
    });
    res.send({
      reals,
      countReals,
      // page,
      // pages: Math.ceil(countReals / pageSize),
    });
  })
);

realRouter.get(
  '/categories',
  expressAsyncHandler(async (req, res) => {
    const categories = await Real.find().distinct('category');
    res.send(categories);
  })
);

realRouter.get('/slug/:slug', async (req, res) => {
  const real = await Real.findOne({ slug: req.params.slug });
  if (real) {
    res.send(real);
  } else {
    res.status(404).send({ message: 'Real Not Found' });
  }
});
realRouter.get('/:id', async (req, res) => {
  const real = await Real.findById(req.params.id);
  if (real) {
    res.send(real);
  } else {
    res.status(404).send({ message: 'Real Not Found' });
  }
});

export default realRouter;
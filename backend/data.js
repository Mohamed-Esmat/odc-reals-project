import bcrypt from 'bcryptjs';

const data = {
  users: [
    {
      name: 'mohamed',
      email: 'admin@example.com',
      password: bcrypt.hashSync('123456'),
    },
    {
      name: 'Ali',
      email: 'user@example.com',
      password: bcrypt.hashSync('123456'),
    },
  ],
  reals: [
    {
      // _id: '1',
      name: 'Tahrar',
      slug: 'fjfdnvkj jvndj',
      category: 'luxor',
      image: '/images/p1.jpg', 
      countInStock: 10,
      rating: 4.5,
      numReviews: 10,
      description: 'high quality resturant',
    },
    {
      // _id: '2',
      name: 'jfjfv jvnj',
      slug: 'v d vlkks',
      category: 'luxor',
      image: '/images/p1.jpg', 
      countInStock: 10,
      rating: 4.5,
      numReviews: 10,
      description: 'high quality resturant',
    },
    {
      // _id: '3',
      name: 'Luxor',
      slug: 'luxor  dnd',
      category: 'luxor',
      image: '/images/p1.jpg', 
      countInStock: 10,
      rating: 4.5,
      numReviews: 10,
      description: 'high quality resturant',
    },

    
    {
      // _id: '4',
      name: 'Luxor',
      slug: 'nfvjd',
      category: 'luxor',
      image: '/images/p1.jpg', 
      countInStock: 10,
      rating: 4.5,
      numReviews: 10,
      description: 'high quality resturant',

    },
  ],
};
export default data;
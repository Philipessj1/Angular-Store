import express from 'express';
import productsRouter from './products.js';

const router = express.Router();

//Products Router
router.use('/products', productsRouter);

export { router };
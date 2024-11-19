import express from "express";

import { productController } from "../controllers/productControllers.js";

const productsRouter = express.Router();

//POST route
//example: http://localhost:8800/api/products
productsRouter
  .route("/")
  .post((req, res) => productController.create(req, res));

// GET(All) route
// example: http://localhost:8800/api/products?page=0&perPage=2
productsRouter
  .route('/')
  .get((req, res) => productController.getall(req, res));

// GET(One) route
// example: http://localhost:8800/api/products/:id
productsRouter
  .route('/:id')
  .get((req, res) => productController.get(req, res));

// DELETE route
// example: http://localhost:8800/api/products/:id
productsRouter
  .route('/:id')
  .delete((req, res) => productController.delete(req, res));

//PUT route
//example: http://localhost:8800/api/products/:id
productsRouter
  .route("/:id")
  .put((req, res) => productController.update(req, res));

export default productsRouter;

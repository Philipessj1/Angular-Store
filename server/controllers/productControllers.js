import { Product as ProductModel } from "../models/Product.js";
import { v2 as cloudinary } from "cloudinary";

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const productController = {
  //CREATE
  create: async (req, res) => {
    try {
      const { name, price, image, rating } = req.body;

      //Upload img to cloudnary
      const imgUrl = await cloudinary.uploader.upload(image);

      //Product Object
      const product = {
        name,
        price,
        image: imgUrl.url,
        rating,
      };

      //Post product on DB
      const response = await ProductModel.create(product);

      //Return product posted with a successfull message
      res.status(201).json({ response, msg: "Product created successfully!" });
    } catch (error) {
      console.log(error);
    }
  },
  //GETALL
  getall: async (req, res) => {
    //get page and perPage from req.query
    const page = parseInt(req.query.page) || 0;
    const perPage = parseInt(req.query.perPage) || 10;

    const start = page * perPage;
    const end = start + perPage;

    try {
      //get products from DB
      const products = await ProductModel.find();

      //slice products to the amount requested
      const response = products.slice(start, end);

      //return products
      res.json({
        items: response,
        total: products.length,
        page,
        perPage,
        totalPages: Math.ceil(products.length / perPage),
      });
    } catch (error) {
      console.log(error);
    }
  },
  //GET
  get: async (req, res) => {
    try {
      //get id from req.params
      const id = req.params.id;

      //get the requested product by id on DB
      const product = await ProductModel.findById(id);

      //check if product exists
      if (!product) {
        res.status(404).json({ msg: "Product not Found" });
        return;
      }

      res.json(product);
    } catch (error) {
      console.log(error);
    }
  },
  delete: async (req, res) => {
    try {
      //get id from req.params
      const id = req.params.id;

      //delete the requested product by id on DB
      const deletedProduct = await ProductModel.findByIdAndDelete(id);

      //check if products exists
      if (!deletedProduct) {
        res.status(404).json({ msg: "Product not Found" });
        return;
      }

      //return the deleted product with a successfull message
      res
        .status(200)
        .json({ deletedProduct, msg: "Product deleted successfully" });
    } catch (error) {
      console.log(error);
    }
  },
  //UPDATE
  update: async (req, res) => {
    try {
      //get id from req.params
      const id = req.params.id;

      const { name, price, image, rating } = req.body;

      //Upload img to cloudnary
      const productImage = await ProductModel.findById(id);

      let imgUrl;

      if (productImage.image !== image) {
        imgUrl = await cloudinary.uploader.upload(image).url;
      } else {
        imgUrl = image;
      }

      //Product Object
      const product = {
        name,
        price,
        image: imgUrl,
        rating,
      };

      //Update the selected product on DB
      const updatedProduct = await ProductModel.findByIdAndUpdate(id, product);

      //check if products exists
      if (!updatedProduct) {
        res.status(404).json({ msg: "Product not Found" });
        return;
      }

      //return the updated product with a successfull message
      res
        .status(200)
        .json({ updatedProduct, msg: "Product updated successfully" });
    } catch (error) {
      console.log(error);
    }
  },
};

export { productController };

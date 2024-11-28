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
      const cloudRes = await cloudinary.uploader.upload(image);

      const img = {
        id: cloudRes.public_id,
        url: cloudRes.url,
      };

      //Product Object
      const product = {
        name,
        price,
        image: img,
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
      const slicedProducts = products.slice(start, end);

      // Map over the sliced products to transform the data and returns only the img
      const response = slicedProducts.map((data) => ({
        ...data._doc,
        image: data._doc.image.url,
      }));

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

      const response = {
        ...product._doc,
        image: product._doc.image.url
      }

      res.json(response);
    } catch (error) {
      console.log(error);
    }
  },
  //DELETE
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

      // Delete img asset on cloudinary
      cloudinary.uploader.destroy(deletedProduct.image.id);

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

      //check if products exists
      if (!productImage) {
        res.status(404).json({ msg: "Product not Found" });
        return;
      }

      let img;

      if (productImage.image !== image) {
        img = await cloudinary.uploader.upload(image);

        img = {
          id: img.public_id,
          url: img.url,
        };
      } else {
        img = image;
      }

      //Product Object
      const product = {
        name,
        price,
        image: img,
        rating,
      };

      //Update the selected product on DB
      const updatedProduct = await ProductModel.findByIdAndUpdate(id, product);

      //return the updated product with a successfull message
      res.status(200).json({
        updatedProduct,
        msg: "Product updated successfully",
      });
    } catch (error) {
      console.log(error);
    }
  },
};

export { productController };

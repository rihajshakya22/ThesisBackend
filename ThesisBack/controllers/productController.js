import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";

// @desc     Fetch all product
// @route   GET api/product
// @access   Public
const getProducts = asyncHandler(async (req, res) => {
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : "";

  const products = await Product.find({
    ...keyword,
  });

  res.json({ products });
});

const getProductsByColor = asyncHandler(async (req, res) => {
  const color = req.query.color;
  const products = await Product.find({
    color,
  });

  res.json({ products });
});

const getProductsByPrice = asyncHandler(async (req, res) => {
  const price = req.query.price;

  const products = await Product.find({ price: { $lte: price } });

  res.json({ products });
});

const getProductsByBrand = asyncHandler(async (req, res) => {
  const brand = req.query.brand;
  const products = await Product.find({
    brand,
  });

  res.json({ products });
});

const getProductsByAlphabetical = asyncHandler(async (req, res) => {
  var mysort = { name: req.query.alpha };

  const products = await Product.find().sort(mysort);

  res.json({ products });
});

const getProductsByNewAndOld = asyncHandler(async (req, res) => {
  var mysort = { createdAt: req.query.asc };

  const products = await Product.find().sort(mysort);

  res.json({ products });
});

const getProductWishlisted = asyncHandler(async (req, res) => {
  var wishList = req.user._id;
  // console.log(wishList);
  const products = await Product.find({ wishList: { user: wishList } });
  res.json({ products });
});

// @desc     Fetch all product
// @route   GET api/product/featured
// @access   Public
const getFeaturedProducts = asyncHandler(async (req, res) => {
  const pageSize = 3;

  const products = await Product.find().limit(pageSize);

  res.json({ products });
});

// @desc     Fetch single product
// @route    GET api/product/:id
// @access   Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc     Fetch single product
// @route    GET api/product/category/:id
// @access   Public
const getProductByCategoryId = asyncHandler(async (req, res) => {
  const products = await Product.find({ category: req.params.id });
  // .populate(
  //   "category",
  //   "name"
  // );

  if (products) {
    res.json({ products });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc     Delete a product
// @route    DELETE api/product/:id
// @access   Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.remove();
    res.json({ message: "Product Removed" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc     Create a product
// @route    POST api/products
// @access   Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const { name, weight, description, image, category, countInStock, code } =
    req.body;
  const product = new Product({
    name: name,
    weight: weight,
    user: req.user._id,
    image: image,
    category: category,
    countInStock: countInStock,
    numReviews: 0,
    description: description,
    code: code,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc     Update a product
// @route    PUT api/products/:id
// @access   Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const { name, weight, description, image, countInStock, code } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;
    product.weight = weight;
    product.description = description;
    product.image = image;
    product.code = code;
    product.countInStock = countInStock;
    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc     Create new review
// @route    POST api/products/:id/review
// @access   Private/Admin
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);
  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error("Product already reviewed");
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({
      message: "Review Added",
    });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc     update review
// @route    PUT api/products/:id/review
// @access   Private/Admin
const updateProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);
  if (product) {
    const alreadyReviewed = product.reviews.indexOf(
      product.reviews.find((r) => r.user.toString() === req.user._id.toString())
    );
    product.reviews.splice(alreadyReviewed, 1);

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({
      message: "Review Updated",
    });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc     delete review
// @route    DELETE api/products/:id/review
// @access   Private/Admin
const deleteProductReview = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.indexOf(
      product.reviews.find((r) => r.user.toString() === req.user._id.toString())
    );
    product.reviews.splice(alreadyReviewed, 1);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.length > 0
        ? product.reviews.reduce((acc, item) => item.rating + acc, 0) /
          product.reviews.length
        : 0;

    await product.save();
    res.status(201).json({
      message: "Review Removed",
    });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc     Add product to wishlist
// @route    POST /api/products/:id/wishlist
// @access   Public
const getProductToWishList = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    const alreadyAddedToWishlist = product.wishList.find(
      (r) => r.toString() === req.user._id.toString()
    );

    if (alreadyAddedToWishlist) {
      res.status(400);
      throw new Error("Product already added to wishlist");
    }

    const wishlist = req.user._id;

    product.wishList.push(wishlist);

    await product.save();
    res.status(201).json({
      message: "Product added to wishlist",
    });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc     Remove product to wishlist
// @route    POST /api/products/:id/remove
// @access   Public
const removeFromWishlist = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    let index = product.wishList.indexOf(req.user._id);
    product.wishList.splice(index, 1);
    await product.save();
    res.status(201).json({
      message: "Product removed from wishlist",
    });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc     Get product by wishlisted user
// @route    GET /api/products/wishlist
// @access   Public
const getWishlistedProductOfUser = asyncHandler(async (req, res) => {
  let wishList = req.user._id;
  console.log(wishList);
  const products = await Product.find({ wishList });

  res.json({ products });
});

// @desc     Get top rated product
// @route    GET /api/products/top
// @access   Public
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3);

  res.json(products);
});

export {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  getTopProducts,
  getProductByCategoryId,
  getFeaturedProducts,
  getProductsByColor,
  getProductsByBrand,
  getProductsByPrice,
  getProductsByAlphabetical,
  getProductsByNewAndOld,
  getProductToWishList,
  getProductWishlisted,
  removeFromWishlist,
  getWishlistedProductOfUser,
  updateProductReview,
  deleteProductReview,
};

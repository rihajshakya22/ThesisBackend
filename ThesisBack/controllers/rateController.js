import asyncHandler from "express-async-handler";
import Rate from "../models/rateModel.js";

// @desc     Fetch rate
// @route   GET api/rate
// @access   Public
const getRate = asyncHandler(async (req, res) => {
  const rates = await Rate.find();

  res.json({ rates });
});

// @desc     Add rate
// @route   POST api/rate
// @access   Private/Admin
const postRate = asyncHandler(async (req, res) => {
  const { price } = req.body;
  const goldRate = new Rate({
    rate: price,
  });
  const createdRate = await goldRate.save();
  res.status(201).json(createdRate);
});
// @desc     Update a rate
// @route    PUT api/rate/:id
// @access   Private/Admin
const updateRate = asyncHandler(async (req, res) => {
  const { price } = req.body;
  console.log(price);
  const goldRate = await Rate.findById(req.params.id);

  if (goldRate) {
    goldRate.rate = price;
    const updatedGoldRate = await goldRate.save();
    res.json(updatedGoldRate);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc     delete rate
// @route    DELETE api/rate/:id
// @access   Private/Admin
const deleteRate = asyncHandler(async (req, res) => {
  const user = await Rate.findById(req.params.id);

  if (user) {
    await user.remove();
    res.json({ message: "Rate Removed" });
  } else {
    res.status(404);
    throw new Error("Rate not found");
  }
});

export { getRate, postRate, updateRate, deleteRate };

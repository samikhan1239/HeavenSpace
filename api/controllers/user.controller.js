import Listing from "../models/listing.model.js";

export const test = (req, res) => {
  res.json({
    message: "Hello World!",
  });
};
export const getUserListings = async (req, res, next) => {
  if (req.user.id === req.params.id) {
    try {
      const listings = await Listing.find({ userRef: req.params.id });
      res.status(200).json(listings);
    } catch (error) {
      next(error);
    }
  } else {
    return next(errorHAndler(4011, "You can only view your own listings!"));
  }
};

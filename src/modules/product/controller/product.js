import { asyncHandler } from "../../../utils/errorhandling.js";
import cloudinary from "../../../utils/cloudinary.js";
import { nanoid } from "nanoid";
import subcategoryModel from "../../../../db/models/Subcategory.model.js";
import brandModel from "../../../../db/models/Brand.model.js";
import productModel from "../../../../db/models/Product.js";
import slugify from "slugify";
import userModel from "../../../../db/models/User.model.js";
import ApiFeatures from "../../../utils/apiFeatures.js";

export const createProduct = asyncHandler(async (req, res, next) => {
  const { name, categoryId, subcategoryId, brandId, price, discount } =
    req.body;
  if (!(await subcategoryModel.findOne({ _id: subcategoryId, categoryId }))) {
    return next(
      new Error(`In-valid category or subcategory Id`, { cause: 400 })
    );
  }
  if (!(await brandModel.findOne({ _id: brandId }))) {
    return next(new Error(`In-valid brand Id`, { cause: 400 }));
  }

  req.body.slug = slugify(name, {
    replacement: "-",
    trim: true,
    lower: true,
  });

  req.body.finalPrice = Number.parseFloat(
    price - price * ((discount || 0) / 100)
  ).toFixed(2);

  req.body.customId = nanoid();
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.files.mainImage[0].path,
    { folder: `${process.env.APP_NAME}/product/${req.body.customId}` }
  );
  req.body.mainImage = { secure_url, public_id };

  if (req.files.subImages) {
    req.body.subImages = [];
    for (const file of req.files.subImages) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        file.path,
        {
          folder: `${process.env.APP_NAME}/product/${req.body.customId}/subImages`,
        }
      );
      req.body.subImages.push({ secure_url, public_id });
    }
  }

  req.body.createdBy = req.user._id;
  const product = await productModel.create(req.body);
  if (!product) {
    return next(new Error("Fail to create this product", { cause: 400 }));
  }
  return res.status(201).json({ message: "Done", product });
});

export const productList = asyncHandler(async (req, res, next) => {
  const mongooseQuery = productModel.find();
  const apiFeatures = new ApiFeatures(mongooseQuery, req.query);
  apiFeatures.paginate().sort().search().select()
  // for (let i = 0; i < mongooseQuery.length; i++) {
  //   let calcRating = 0;
  //   for (let j = 0; j < mongooseQuery[i].review.length; j++) {
  //     calcRating += mongooseQuery[i].review[j].rating;
  //   }
  //   let avgrating = calcRating / mongooseQuery[i].review.length;
  //   const product = mongooseQuery[i].toObject();
  //   product.avgrating = avgrating;
  //   mongooseQuery[i] = product;
  // }
  const products = await apiFeatures.mongooseQuery;
  return res.status(200).json({ message: "done", products });
});

export const addToWishList = asyncHandler(async (req, res, next) => {
  if (!(await productModel.findById({ _id: req.params.productId }))) {
    new Error(`In-valid Product`, { cause: 400 });
  }

  await userModel.updateOne(
    { _id: req.user._id },
    {
      $addToSet: { wishlist: req.params.productId },
    }
  );

  return res.status(200).json({ message: "done" });
});

export const removeToWishList = asyncHandler(async (req, res, next) => {
  await userModel.updateOne(
    { _id: req.user._id },
    {
      $pull: { wishlist: req.params.productId },
    }
  );

  return res.status(200).json({ message: "done" });
});

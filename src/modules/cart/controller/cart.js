import cartModel from "../../../../db/models/Cart.js";
import productModel from "../../../../db/models/Product.js";
import { asyncHandler } from "../../../utils/errorhandling.js";

export const createCart = asyncHandler(async (req, res, next) => {
  const { productId, quantity } = req.body;
  const product = await productModel.findById(productId);
  if (!product) {
    return next(new Error("Invalid productId", { cause: 400 }));
  }

  if (product.stock < quantity || product.isDeleted) {
    return next(
      new Error(`Invalid product quantity, max available is ${product.stock}`, {
        cause: 400,
      })
    );
  }

  let cart = await cartModel.findOne({ userId: req.user._id });

  if (!cart) {
    // Create a new cart if one doesn't exist for the user
    cart = await cartModel.create({
      userId: req.user._id,
      products: [
        {
          productId,
          quantity,
        },
      ],
    });
  }

  let matchproduct = false;
  for (let i = 0; i < cart.products.length; i++) {
    if (cart.products[i].productId.toString() === productId.toString()) {
      cart.products[i].quantity = quantity;
      matchproduct = true;
      break;
    }
  }

  if (!matchproduct) {
    cart.products.push({ productId, quantity });
    await productModel.updateOne(
      { _id: productId },
      { $addToSet: { wishUserList: req.user._id } }
    );
  }

  await cart.save();

  return res.status(201).json({ message: "Done", cart });
});

async function deleteItemsFromCart(productsIds, userId) {
  const cart = await cartModel.updateOne(
    { userId: userId }, // Filter by userId
    {
      $pull: {
        products: {
          productId: {
            $in: productsIds, // Match productIds inside the $pull operation
          },
        },
      },
    }
  );
  return cart;
}

export const deleteItems = asyncHandler(async (req, res, next) => {
  const { productsIds } = req.body;
  const userId = req.user._id;
  const cart = await deleteItemsFromCart(productsIds, userId);

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  res.status(200).json({ message: "Items deleted successfully", cart });
});

async function clearCart(userId) {
  const cart = await cartModel.updateOne(
    { userId: userId },
    {
      $set: {
        products: [], // Use $set to clear the products array
      },
    }
  );
  return cart;
}

export const clearCartController  = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const cart = await clearCart(userId);
  if (!cart) {
    return next(new Error("Cart not found", { cause: 404 }));
  }

  res.status(200).json({ message: "Items deleted successfully", cart });
});

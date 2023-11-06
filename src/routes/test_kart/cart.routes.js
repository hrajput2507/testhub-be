import express from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import { add_to_cart, remove_from_cart, clear_cart, get_cart_items } from "../../controllers/test_kart/cart.controller.js";

const cart_router = express.Router();

cart_router.route("/add-to-cart").post(protect, add_to_cart);
cart_router.route("/remove-from-cart").delete(protect, remove_from_cart);
cart_router.route("/clear-cart").delete(protect, clear_cart);
cart_router.route("/get-cart-items").get(protect, get_cart_items);

export default cart_router;

const express = require("express");
const router = express.Router();
const productController = require("../Controllers/product-controller");
const {authMW} = require("../Utils/auth");
const authzMW = require("../Utils/authz");

// Public 
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);

// Protected
router.post("/", authMW, authzMW, productController.createProduct);
router.put("/:id", authMW, authzMW, productController.updateProduct);
router.delete("/:id", authMW, authzMW, productController.deleteProduct);

module.exports = router;

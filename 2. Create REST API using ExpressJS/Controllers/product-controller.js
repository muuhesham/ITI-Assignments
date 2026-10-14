const Product = require('../Models/product-model');

//CREATE PRODUCT-POST METHOD - PRIVATE
exports.createProduct = async (req, res, next)=> {
    try {
        const { name, description, price } = req.body;
        const product = await Product.create({
          name,
          description,
          price,
          createdBy: req.user.id,
        });
        if(!product){return res.status(400).json({message: "Product can't create"})}
        res.status(201).json({
          success: true,
          message: "Product Created",
          data: product,
        });
    } catch (err) {
        next(err);
    }
    
};

//READ PRODUCT-GET METHOD - PUBLIC
exports.getAllProducts = async (req, res, next)=>{
    try {
        const products = await Product.find();
        if(!products){return res.status(404).json({message: "Products not found"})};
        res.status(200).json({
            success: true,
            data: products
        })
    } catch (err) {
        next(err);
    }
};

exports.getProductById = async (req, res, next)=>{
    try {
        const {id} = req.params;
        const product = await Product.findById(id);
        if(!product){return res.status(404).json({message: "Product Not Found"})};
        res.status(200).json({
            success: true,
            data: product
        })
    } catch (err) {
        next(err);
    }
};

//UDPATE PRODUCT -PUT METHOD - PRIVATE
exports.updateProduct =async (req, res, next)=>{
    try {
        const {id} = req.params;
        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {new: true});
        if(!updatedProduct){return res.status(404).json({message: "Product not found"})};
        res.status(200).json({
            success: true,
            message: "Prdouct Updated",
            data: updatedProduct,
        })
    } catch (err) {
        next(err)
    }
};

//DELETE PRODUCT-DELETE METHOD-PRIVATE
exports.deleteProduct= async (req, res, next)=>{
    try {
        const {id} = req.params;
        const deleteProduct = await Product.findByIdAndDelete(id);
        if(!deleteProduct){return res.status(404).json({message: "Product not found"})};
        res.status(200).json({
            success: true,
            message: "Prdouct deleted",
        })
    } catch (err) {
        next(err)
    }
};
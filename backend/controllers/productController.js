const { validationResult } = require('express-validator');
const formidable = require('formidable');
const fs = require('fs').promises;
const path = require('path');
const Product = require('../models/productModel');



// Get all products
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json({ products });
    } catch (error) {
        console.error('Error retrieving products:', error);
        res.status(500).json({ error: 'Error retrieving products' });
    }
};

// Get a product by ID
exports.getProductById = async (req, res) => {
    const { productId } = req.params;

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const productWithModifiedImages = {
            ...product._doc,
            images: product.images.map((image) => {
                const imageFilename = image.split('\\').pop();
                const fullImagePath = `/uploads/${imageFilename}`;
                return fullImagePath;
            }),
        };

        res.status(200).json({ product: productWithModifiedImages });
    } catch (error) {
        console.error('Error retrieving product details:', error);
        res.status(500).json({ error: 'Error retrieving product details' });
    }
};

// Update a product by ID
exports.updateProductById = async (req, res) => {
    const { productId } = req.params;

    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.error('Error parsing form:', err);
            return res.status(500).json({ error: 'Error parsing form data' });
        }

        try {
            const product = await Product.findById(productId);

            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }

            const { name, detail } = fields;

            if (name) {
                product.name = name;
            }

            if (detail) {
                product.detail = detail;
            }

            const fileKeys = Object.keys(files);

            for (let i = 0; i < fileKeys.length; i++) {
                const fileKey = fileKeys[i];
                const file = files[fileKey];

                // Ensure file.name is available
                if (!file.name) {
                    return res.status(400).json({ error: 'File name is missing' });
                }

                const oldPath = file.path;
                const newPath = path.join(__dirname, '..', 'uploads', file.name);

                try {
                    await fs.promises.rename(oldPath, newPath);
                    product.images.push(newPath);
                } catch (renameError) {
                    console.error('Error renaming file:', renameError);
                    return res.status(500).json({ error: 'Error renaming files' });
                }
            }

            await product.save();
            res.status(200).json({ message: 'Product updated successfully' });
        } catch (error) {
            console.error('Error updating product:', error);
            res.status(500).json({ error: 'Error updating product' });
        }
    });
};

// Delete a product by ID
exports.deleteProductById = async (req, res) => {
    const { productId } = req.params;

    try {
        const deletedProduct = await Product.findByIdAndDelete(productId);

        if (!deletedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.status(200).json({ message: 'Product deleted successfully', deletedProduct });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Error deleting product' });
    }
};

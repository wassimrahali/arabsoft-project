const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const Product = require('../models/productModel'); // Assuming you have a Product model
const mongoose = require('mongoose');

const fileUpload = require('express-fileupload');
router.use(fileUpload());
const path = require('path');




router.post('/add', async (req, res) => {
    try {
        const { name, detail } = req.body;

        if (!name || !detail || !req.files || !req.files.image || req.files.image.size === 0) {
            return res.status(400).json({ error: 'Name, detail, and a valid image are required fields.' });
        }

        const uploadedFile = req.files.image;
        const uploadDir = './uploads';

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }

        const uniqueFilename = uuidv4();
        const newPath = `${uploadDir}/${uniqueFilename}_${uploadedFile.name}`;

        await uploadedFile.mv(newPath);

        const newProduct = new Product({
            name: name,
            detail: detail,
            image: newPath,
        });

        const savedProduct = await newProduct.save();

        res.status(201).json(savedProduct);
    } catch (error) {
        console.error('Error in file upload:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/all', async (req, res) => {
    try {
        const allProducts = await Product.find({}, 'name detail image');
        res.status(200).json(allProducts);
    } catch (error) {
        console.error('Error fetching all products:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




const fs = require('fs');


router.delete('/:productId', async (req, res) => {
    try {
        const productId = req.params.productId;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ error: 'Invalid product ID.' });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ error: 'Product not found.' });
        }

        // Ensure product.image is a string or a valid path
        const imagePath = Array.isArray(product.image) ? product.image[0] : product.image;

        const absolutePath = path.resolve(imagePath);
        console.log('Attempting to delete file:', absolutePath);

        // Check if the file exists using synchronous method
        if (fs.existsSync(absolutePath)) {
            // List directory contents for debugging
            const dirContents = await fs.promises.readdir(path.dirname(absolutePath));
            console.log('Directory contents:', dirContents);

            // Delete the image file asynchronously
            await fs.promises.unlink(absolutePath);

            // Remove the product from the database
            await product.deleteOne();

            res.status(200).json({ message: 'Product deleted successfully.' });
        } else {
            // File does not exist
            console.error('Error deleting product: File not found.');
            res.status(404).json({ error: 'Product image not found.' });
        }
    } catch (error) {
        console.error('Error deleting product:', error);

        // Check for specific error types and provide appropriate responses
        if (error.code === 'ENOENT') {
            // File not found error (image file)
            console.error('Error deleting product: File not found.');
            res.status(404).json({ error: 'Product image not found.' });
        }

        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.put('/:productId', async (req, res) => {
    try {
        const productId = req.params.productId;
        const { name, detail } = req.body;

        if (!name || !detail) {
            return res.status(400).json({ error: 'Name and detail are required fields.' });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ error: 'Product not found.' });
        }

        // Handle image update
        if (req.files && req.files.image && req.files.image.size !== 0) {
            const uploadedFile = req.files.image;
            const uploadDir = './uploads';

            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir);
            }

            // Remove the existing image file
            const existingImagePath = Array.isArray(product.image) ? product.image[0] : product.image;
            const existingAbsolutePath = path.resolve(existingImagePath);

            if (fs.existsSync(existingAbsolutePath)) {
                await fs.promises.unlink(existingAbsolutePath);
            }

            // Upload the new image
            const uniqueFilename = uuidv4();
            const newPath = `${uploadDir}/${uniqueFilename}_${uploadedFile.name}`;
            await uploadedFile.mv(newPath);

            // Update the product with the new image path
            product.image = newPath;
        }

        // Update name and detail
        product.name = name;
        product.detail = detail;

        // Save the updated product
        const updatedProduct = await product.save();

        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;

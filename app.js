const express = require('express');
const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const errorHandler = require('./middleware/errorHandler');
const connectDB = require('./config/dbConnection');

connectDB();
const app = express();


// Connect to database devicemanager
// mongoose.connect('mongodb://127.0.0.1:27017/Sample',{useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
//     console.log('Database connected');
// }).catch((err) => { console.log(err); })


app.use(express.json());
app.use(errorHandler);
// app.use(bodyParser.urlencoded({extended: false}));
app.use("/api/contacts",require("./routes/contactRoutes"));
app.use("/api/users",require("./routes/userRoutes"));





const port = process.env.PORT || 3000;

// Product schema
const productSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number
});

// Create Model
const Product = mongoose.model('Product',productSchema);

//Create Product
app.post('/api/product/new',async(req,res) => {
    const product = await Product.create(req.body);

    res.status(201).json({
        status: 'success',
        product
    });
});

//Get all products
app.get('/api/products',async(req,res) => {
    const products = await Product.find();

    res.status(200).json({
        status: 'success',
        products
    });
});

//Update product
app.put('/api/product/:id',async(req,res) => {
    let product = await Product.findById(req.params.id);

    if (!product) {
        return res.status(404).json({
            status: 'fail',
            message: 'No product found'
        });
    }

    product = await Product.findByIdAndUpdate(req.params.id,req.body,{new: true, useFindAndModify:true, runValidators: true});

    res.status(200).json({
        status: 'success',
        product
    });
});

//Delete product
app.delete('/api/product/:id',async(req,res) => {
    const product = await Product.findById(req.params.id);
    
    if(!product){
        return res.status(404).json({
            status: 'fail',
            message: 'No product found'
        });
    }

    await product.deleteOne();

    res.status(204).json({
        status: 'success',
        message: 'Product deleted successfully'
    });


});



app.listen(port,() => {
    console.log(`Server started at port ${port}`);
});
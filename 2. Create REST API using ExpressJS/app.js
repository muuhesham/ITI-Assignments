require("dotenv").config();

const express = require("express");
const db = require("./config/db");
const {errorhandler} = require("./Utils/error");
const morgan = require("morgan");
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const userRoutes = require('./Routes/user-routes');
const productRoutes = require('./Routes/product-routes');
const port = Number(process.env.PORT || 3000);
const app = express();

app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());
db();

app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use(errorhandler);

app.listen(port , ()=> {
    console.log(`THE SERVER RUNNING ON PORT ${port}`);
})
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");

const connectDB = require("./configDB");

//load envirnment variables .env
dotenv.config();

//Mongo db connection
connectDB();

//REST OBJECT
const app = express();

//middlewares
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

//ROUTES
app.use(require('./routes/UserRoutes'));
app.use(require('./routes/ProductRoutes'));

//PORT
const  PORT = process.env.PORT || 8080;

app.listen(PORT,()=>{
    console.log(`Node js server started on PORT : ${PORT} `.bgGreen.white);
})
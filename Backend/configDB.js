const mongoose = require('mongoose')
const colors = require('colors')

const connectDB = async () => {
    try{
    await mongoose.connect(process.env.MONGO_URL)
    console.log(`Database Connected ${mongoose.connection.host}`.bgBlue.white);
    }
   catch (error) {
    console.log(`Error in connecting DB ${error}`.bgRed,colors.white);
}
};

module.exports = connectDB;
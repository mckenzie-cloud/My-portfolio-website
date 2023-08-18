const mongoose = require('mongoose');

const connectDB = async () => {
    mongoose.set('strictQuery', true);
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Successfully connected to MongoDB ${conn.connection.host}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

module.exports = connectDB
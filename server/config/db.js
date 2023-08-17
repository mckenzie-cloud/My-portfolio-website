const mongoose = require('mongoose')

const connectDB = async () => {
    mongoose.set('strictQuery', false);

    mongoose.connection.on('connecting', () => {
        console.log(`Connecting....`);
    });

    mongoose.connection.on('error', (err) => {
        console.log(`Failed to connect - ${err}`);
    });

    mongoose.connection.on('connected', () => {
        console.log(`DB connection successful: -> ${mongoose.connection.host}`);
    });

    mongoose.connection.on('disconnected', () => {
        console.log(`Lost connection to the Database`);
    });
    
    await mongoose.connect(process.env.MONGODB_URI).catch(error => console.log(error));
}

module.exports = connectDB
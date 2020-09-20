const mongoose = require('mongoose');

module.exports.connectDB = async () => {
  const connection = await mongoose.connect(process.env.DB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });

  console.log(`MongoDB connected: ${connection.connection.host}`);
};

const mongoose = require("mongoose");
const {
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_IP,
  MONGO_PORT,
} = require("../config/config");

const mongoURL = `mongodb://hamzaejj:hyui@mongo:27017/hotel-booking?authSource=admin`;

async function connect() {
  await mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

module.exports = connect;

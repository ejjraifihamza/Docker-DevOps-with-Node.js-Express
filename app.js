const express = require("express");
const app = express();

const connect = require("./connection/connection");
const adminRouterForHotel = require("./routes/admin/hotel");
const adminRouterForOwner = require("./routes/admin/owner");
const adminRouterForCustomer = require("./routes/admin/customer");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/", adminRouterForHotel, adminRouterForOwner, adminRouterForCustomer);

const port = process.env.PORT || 3000;
connect()
  .catch((err) => {
    throw err;
  })
  .then(() => {
    app.listen(port, () => console.log(`Listen on port ${port}`));
  });

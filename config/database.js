//DATABASE CONNECTION
require("dotenv").config();
const mongoose = require("mongoose");

mongoose.connect(`mongodb+srv://uhasham71:G3yAcoQMgvTx5bZg@cluster0.0b8yos2.mongodb.net/?retryWrites=true`)
  .then(() => {
    console.log("Database Connected Successfully");
  })
  .catch((e) => {
    console.log(e);
  }); 
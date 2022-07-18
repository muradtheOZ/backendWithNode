const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userHandler = require("./routeHandler/userHandler");
const followListHandler = require("./routeHandler/followListHandler");
const PageHandler = require("./routeHandler/pageHandler");
const postHandler = require("./routeHandler/postHandler");
const newsFeedHandler = require("./routeHandler/newsFeedHandler");


// express app initialization
const app = express();
dotenv.config()
app.use(express.json());

// database connection with mongoose here I made it with cloud mongoDB with my cloud cluster
const username = "muradtheoz";

mongoose.connect(
  `mongodb+srv://${username}:${process.env.password}@${process.env.cluster}.mongodb.net/${process.env.dbname}?retryWrites=true&w=majority`, 
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connection successful"))
  .catch((err) => console.log(err));

// Local database connection with mongoose please comment above code and uncomment below code. if you want to use local database 

// mongoose
//   .connect("mongodb://localhost/api", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("connection successful"))
//   .catch((err) => console.log(err));

// application routes
app.use("/api", userHandler);
app.use("/api", followListHandler);
app.use("/api", PageHandler);
app.use("/api", postHandler);
app.use("/api", newsFeedHandler);

// default error handler
const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({ error: err });
}

app.use(errorHandler);

app.listen(5000, () => {
  console.log("app listening at port 5000");
});

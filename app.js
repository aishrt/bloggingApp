const express = require("express");
const routes = require("./routes");
const passport = require("passport");
const { jwtStrategy } = require("./config/passport");

let cors = require("cors");

require("dotenv").config();

const app = express();
app.use(express.json());

app.use(cors());

// jwt authentication
app.use(passport.initialize());
passport.use("jwt", jwtStrategy);

const port = process.env.REACT_APP_PORT;
app.listen(port, (req, res) => {
  console.log(`Server is listening at http://localhost:${port}`);
});

require("./config/config");
require("./routes/router")(app);

app.use("/", routes);

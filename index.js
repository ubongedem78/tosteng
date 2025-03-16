const express = require("express");
const app = express();
const { createServer } = require("http");
const server = createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const { readdirSync } = require("fs");
const path = require("path");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerOptions = require("./src/swagger");
const {
  errorHandler,
} = require("./src/middlewares/errorhandler.middleware.js");

app.use(express.json());
app.use(express.static(path.join(__dirname, "src")));
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerOptions));

readdirSync("./src/routes").map((routePath) => {
  if (routePath === "auth.route.js") {
    return app.use("/api/v1", require(`./src/routes/${routePath}`));
  }
  app.use("/api/v1", /* authenticate */ require(`./src/routes/${routePath}`));
});

app.get("/", (req, res) => {
  res.send("I AM WORKING BUT YOUVE GOTTA WORK TOO!");
});

const PORT = process.env.PORT || 3000;
app.use(errorHandler);

server.listen(PORT, () => {
  console.log(`tost Server is running on PORT: ${PORT}.`);
});

module.exports = io;

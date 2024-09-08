const express = require("express");
const app = express();
const path = require("path");
const sequelize = require("./config/mysql");
const cors = require("cors");
const PORT = process.env.PORT || 3500;
const corsOptions = require("./config/crosOption");
const redisClinet = require("./config/redis");
const http = require("http");
const userRouter = require("./route/userRoute");
const authenticateToken = require("./middleware/authentication");

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.urlencoded({ extended: false }));
app.use(cors(corsOptions));
app.use(express.json());

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("MySQL connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

testConnection();

sequelize.sync({ force: false }).then(() => {
  console.log("Database & tables created!");
});

// app.use(authenticateToken);
app.use(userRouter);

const server = http.createServer(app);

server.listen(PORT, () => console.log(`server is running on port ${PORT}`));

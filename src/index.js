import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

// dotenv configuration
dotenv.config({
  path: "./.env",
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("app is running::", process.env.PORT);
    });
  })
  .catch((err) => {
    console.log("app is not running::", err);
  });

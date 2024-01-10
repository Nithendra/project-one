import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// add here all middleware
// 1. to handle cors request- allowed source can be specify here
app.use(cors());
// 2. handle cookiesParser - to do CRUD op on cookies
app.use(cookieParser());
// 3. allow json -
app.use(express.json());
// 4. allow urlencoded -
app.use(express.urlencoded());
// 5. allow static - to add files in public folder
app.use(express.static("public"));

// import routers
import userRouter from "./routers/user.routers.js";

app.use("/api/v1/user", userRouter);

export { app };

import { requestAsycHandler } from "../utils/requestAsycHandler.js";

const registerUser = requestAsycHandler(async (req, res) => {
  console.log("registerUser-controller");
  res.status(200).json({
    message: "ok",
  });
});

export { registerUser };

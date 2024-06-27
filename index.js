import dotenv from "dotenv";
dotenv.config();
import express from "express";
import initApp from "./index.router.js";
const app = express();
const port = process.env.PORT || 5000;

initApp(app, express);
app.listen(port, () => {
  console.log(`app runing in port ----------- ${port}`);
});

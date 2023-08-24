import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import morgan from "morgan";
//set directory dirname
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "./config/.env") });
import express from "express";
import initApp from "./src/index.router.js";
import { golobalErrorHandler } from "./src/utils/errorHandling.js";
const app = express();
app.use(morgan("dev"));
initApp(app, express);

// not found middleware
app.use((req, res, next) => {
  next(new Error("In-valid Routing Plz check url  or  method", { cause: 404 }));
});
// global error middelware

app.use(golobalErrorHandler);

import connectDB from "../DB/connection.js";
import authRouter from "./module/auth/auth.router.js";
import bookRouter from "./module/book/book.router.js";

const initApp = (app, express) => {
  //convert Buffer Data into JSON
  app.use(express.json({}));
  //Setup API Routing
  app.use(`/auth`, authRouter);
  app.use(`/book`, bookRouter);

  // setup port and the baseUrl
  const port = process.env.PORT || 5000;
  connectDB()
    .then((res) => {
      console.log(`DB Connected successfully on .........`);

      app.listen(port, () =>
        console.log(`Example app listening on port ${port}!`)
      );
    })
    .catch((err) => console.log(` Fail to connect  DB.........${err} `));
};

export default initApp;

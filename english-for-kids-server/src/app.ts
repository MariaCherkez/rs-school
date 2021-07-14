import express = require('express');
import  path = require("path");
import  cors = require("cors");
 
import categories from "./routers/router-category";
import cards from "./routers/router-card";
import statistics from "./routers/router-statistics";

const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());
app.use(cors());

app.use(express.urlencoded({ extended: false }));

const serverPath = path.resolve(__dirname, "..");

app.use(/^(?!\/api\/)/, express.static(serverPath));
app.use(/^(?!\/api\/)/, (req:  express.Request, res: express.Response) => {
  if (req.url.includes("/favicon"))  {
    res.sendFile(serverPath + '/favicon.ico');
  }
  if (req.url.includes("/public")) 
  res.sendFile(serverPath + req.url);
  else  
    res.end('<h1>home</h1>');
});

app.use("/api/categories", categories);
app.use("/api/cards", cards);
app.use("/api/statistics", statistics);

app.listen(PORT, () => console.log("server started on 3000"));


/*import express from "express";

const PORT = process.env.PORT || 3000;
const app = express();
app.get("/", (req: express.Request, res: express.Response) => res.send("Hello World!"));
app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));

*/

/*doc: express.js.com*/
/*ctr + c*/
/*heroku*/
 
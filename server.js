import "dotenv/config";
import app from "./src/index.js";

const port = 3000;


app.listen(port, ()=>{
    console.log(`tasksmanager listening on port ${port}`);
    // console.log("DB URL:", process.env.DATABASE_URL);
})
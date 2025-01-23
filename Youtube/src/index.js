import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";
dotenv.config({
  path: "./.env",
});

connectDB()
  .then(() => {
    app.on("error", (err) => {
      console.log("Error :", err);
      throw err;
    });

    app.listen(process.env.PORT || 8010, () => {
      console.log("Server is running on ", process.env.PORT);
    });
  })
  .catch((err) => {
    console.log("Error in connection of database !!", err);
  });





















  
//you may use dynamic port as 0 using the port and get it as app.address().port

// const app = express
// require("dotenv").config({ path: './env'});
// ;(async()=>{
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//         application.on("error",()=>{
//             console.log("Err: ",error)
//             throw error
//         })
//         app.listen(process.env.PORT,()=>{
//             console.log(`App is listening on port ${process.env.PORT}`)
//         })
//     } catch (error) {
//         console.error("ERR: ",error)
//         throw error
//     }
// })()

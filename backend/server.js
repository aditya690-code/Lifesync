const app = require("./src/app");
const connectDB = require("./src/config/db.js");

// Connect to db
connectDB();

// Start the server
app.listen(8080, () => {
  console.log("http://localhost:8080/");
});

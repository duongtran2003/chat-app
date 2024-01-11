import mongoose from "mongoose";

async function connect() {
  if (!process.env.DB_CONNECTION) {
    console.log("No DB connection");
    return;
  }
  await mongoose.connect(process.env.DB_CONNECTION)
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((err) => {
    console.log(err);
  });
}

export {
  connect
}
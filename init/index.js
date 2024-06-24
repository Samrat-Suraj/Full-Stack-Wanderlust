const mongoose = require("mongoose");
const data = require("./data.js");
const listings = require("../model/listings.js");

main()
  .then((res) => {
    console.log("Connected To Database");
  })
  .catch((err) => console.log("Error Found", err));

async function main() {
  mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

async function insertdata() {
  await listings.deleteMany({});
  const modifiedData = data.map((obj) => ({
    ...obj,
    owner: "665b17bea3dccf04ebf7b9ff",
  }));
  await listings.insertMany(modifiedData);
  console.log("Done");
}

insertdata();

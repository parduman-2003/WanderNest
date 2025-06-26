const mongoose=require("mongoose");
const initData=require("./data.js");
const listing=require("../models/listing.js");
main().then(()=>{
    console.log("connected to DB");
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wonderlust');

 
}
initData.data = initData.data.map((obj) => ({
  ...obj,
  image: obj.image?.url || "/images/photo-1520250497591-112f2f40a3f4.avif",
  owner: "652d0081ae547c5d37e56b5f"
}));
let intidb= async ()=>{
   await listing.deleteMany({});
   
   await listing.insertMany(initData.data);
   console.log("data was initlized");
}

intidb();
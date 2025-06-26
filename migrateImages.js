const mongoose = require("mongoose");
const Listing = require("./models/listing");


mongoose.connect("mongodb://127.0.0.1:27017/wonderlust", {

})
  .then(async () => {
    console.log("Connected to DB");

    const listings = await Listing.find({});
    for (let listing of listings) {
      if (listing.image && typeof listing.image === "string") {

        console.log(`Updating: ${listing.title}`);
        listing.image = {
          url: listing.image,
          filename: "legacy"
        };
        await listing.save();
      }
    }

    console.log("✅ Migration complete.");
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

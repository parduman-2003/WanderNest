const Listing = require('./models/listing');

async function migrateImages() {
    const listings = await Listing.find({});

    for (let listing of listings) {
        if (typeof listing.image === 'string') {
            listing.image = {
                url: listing.image,
                filename: 'legacy'
            };
            await listing.save();
        }
    }

    console.log("Migration complete.");
}

migrateImages();

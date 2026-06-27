require('dotenv').config();

const mongoose = require('mongoose')
const Campground = require('../models/campground');
const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers')


const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/MoeYelpCamp'

mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Seeding..ENDED");
});


function sample(array) {
    const index = Math.floor(Math.random() * array.length);
    const element = array[index]
    return element;
}


const seedDB = async() => {
    await Campground.deleteMany({});
    for(let i = 0; i < 25; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20 ) + 10;
        const camp = new Campground ({
            author:'6a4022eb28be9d60f8f0e522',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Illum recusandae harum eveniet itaque at a deleniti sapiente repudiandae animi nemo laboriosam in modi suscipit dolore id, incidunt, tenetur cumque debitis.',
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            price,
            images:  [{
            url: 'https://res.cloudinary.com/dt4dettlr/image/upload/v1781802303/YelpCamp/mwomoystbd9rrqc9wae5.jpg',
             filename: 'YelpCamp/mwomoystbd9rrqc9wae5',
      
            },
            {
             url: 'https://res.cloudinary.com/dt4dettlr/image/upload/v1781802303/YelpCamp/z9az3b8nictcs6g5utjt.jpg',
            filename: 'YelpCamp/z9az3b8nictcs6g5utjt',
      
              },
             {
             url: 'https://res.cloudinary.com/dt4dettlr/image/upload/v1781802303/YelpCamp/hey0fjzl7kli1sseul4a.jpg',
             filename: 'YelpCamp/hey0fjzl7kli1sseul4a',
      
             },
            {
             url: 'https://res.cloudinary.com/dt4dettlr/image/upload/v1781802303/YelpCamp/hxfhbv88c5oqn11vysna.jpg',
            filename: 'YelpCamp/hxfhbv88c5oqn11vysna',
            }
            ]

        })
        await camp.save();
    }
}


seedDB().then(() => {
    mongoose.connection.close()
})





// delete
// loop
// random 1000
// new camp ground{}
// save
// function sample(array) {
//     const index = Math.floor(Math.random() * array.length);
//     const element = array[index]
//     return element
//     }
    //so we basically entered the math op into our array array[index]
    //and saved it to 'element', and we return it
    //the q: the array we passed up there, how are we going to use it?
    //I'm sorry, Code Rust!!!! 





// 

// const sample = array => array[Math.floor(Math.random() * array.length)]

// const seedDB = async() => {
//     await Campground.deleteMany({})
//     for(let i = 0; i < 50; i++) {
//         const random1000 = Math.floor(Math.random() * 1000)
//         const camp = new Campground ({
//             location: `${cities[random1000].city}, ${cities[random1000].state}`,
//             title: `${sample(descriptors)}, ${sample(places)}`
//         })
//         await camp.save();
//     }
// }

// seedDB();
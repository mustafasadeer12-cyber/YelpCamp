const mongoose = require('mongoose')
const Campground = require('../models/campground');
const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers')


mongoose.connect('mongodb://127.0.0.1:27017/MoeYelpCamp');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


function sample(array) {
    const index = Math.floor(Math.random() * array.length);
    const element = array[index]
    return element;
}


const seedDB = async() => {
    await Campground.deleteMany({});
    for(let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20 ) + 10;
        const camp = new Campground ({
            author:'6a20aad2869f198041ea0a7b',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image:`https://picsum.photos/400?random=${Math.random()}`,
            description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Illum recusandae harum eveniet itaque at a deleniti sapiente repudiandae animi nemo laboriosam in modi suscipit dolore id, incidunt, tenetur cumque debitis.',
            price
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
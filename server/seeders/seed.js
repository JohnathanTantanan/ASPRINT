const mongoose = require('mongoose');
const Community = require('../models/Community');
require('dotenv').config();

const communities = [
    {
        name: 'Rickity',
        description: 'This community is all about Rick!',
        banner: 'https://media.tenor.com/x8v1oNUOmg4AAAAM/rickroll-roll.gif',
        picture: 'https://media.tenor.com/x8v1oNUOmg4AAAAM/rickroll-roll.gif'
    },
    {
        name: 'Rizz',
        description: 'This community is all about Impeccable Rizz!',
        banner: 'https://media1.tenor.com/m/jSakpprrHBEAAAAC/shrek-smirk.gif',
        picture: 'https://media1.tenor.com/m/jSakpprrHBEAAAAC/shrek-smirk.gif'
    },
    {
        name: 'ChillGuy',
        description: 'This community is all about Chill Guy!',
        banner: 'https://media1.tenor.com/m/aey3fDl8n1AAAAAd/cool-guy-cool.gif',
        picture: 'https://media1.tenor.com/m/aey3fDl8n1AAAAAd/cool-guy-cool.gif'
    },
    {
        name: 'Sigma',
        description: 'This community is all about Sigma!',
        banner: 'https://media1.tenor.com/m/1mekY2yeGWkAAAAd/sigma.gif',
        picture: 'https://media1.tenor.com/m/1mekY2yeGWkAAAAd/sigma.gif'
    },
    {
        name: 'Tobey',
        description: 'This community is all about Bully Maguire!',
        banner: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZO4F0lKoa1G1MOrQ7b0hrCsSupq1XH9WtYw&s',
        picture: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZO4F0lKoa1G1MOrQ7b0hrCsSupq1XH9WtYw&s'
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        await Community.deleteMany({}); // Clear existing communities
        await Community.insertMany(communities);
        console.log('Database seeded successfully');
        mongoose.connection.close();
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDB();

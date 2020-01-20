const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArrays');
const { findConnections, sendMessage } = require('../websocket');

module.exports = {
    async index(req, res){
        const devs = await Dev.find();

        return res.json(devs);
    },

    async store(req, res){
        const { github_username, techs, latitude, longitude } = req.body;

        let dev = await Dev.findOne({ github_username });

        if(!dev){
            const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);
        
            let { name, avatar_url, bio } = apiResponse.data;  

            if(!name){
                name = apiResponse.data.login;
            }
        
            const techsArray = parseStringAsArray(techs);
        
            const location = {
                type: 'Point',
                coordinates: [longitude, latitude],
            };
        
            dev = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location,
            });

            // Filtar conexões que estão há no máximo 10k de distância
            // e que o novo dev tenha pelo menos uma das techs filtradas
            
            const sendSocketMessageTo = findConnections(
                {latitude, longitude},
                techsArray,
            );
            
            sendMessage(sendSocketMessageTo, 'new-dev', dev);
            
        }
    
        return res.json(dev);
    }
}
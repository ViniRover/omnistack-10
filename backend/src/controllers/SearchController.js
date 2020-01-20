const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArrays');

module.exports = {
    async index(req, res){
        //Buscar um dev no raio de 10km
        //Buscar um dev pelas suas tecnologias

        const { latitude, longitude, techs} = req.query;

        const techsArray = parseStringAsArray(techs);

        const devs = await Dev.find({
           techs: {
                $in: techsArray,
           },
           location:{
                $near:{
                    $geometry:{
                        type: 'Point',
                        coordinates: [longitude, latitude],
                    },
                    $maxDistance: 10000,
                }, 
           }, 
        });

        return res.json({ devs });
    }
}
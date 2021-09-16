const mongoose = require('mongoose')
const Category = require('../models/cats')

module.exports = async function (req,res,next){
    const {categoryId} = req.params

    if(!mongoose.Types.ObjectId.isValid(categoryId)){
        return res.status(400).json({
            error:'Product not found'
        })
    }
    try {
        let category = await Category.findById(categoryId)

        if(!category){
            return res.status(403).json({
                error:'Product not found'
            })

        }
        req.category = category
        next()
    } catch (error) {
        console.log(error)
        res.status(500).send("Server Error")
    }
}
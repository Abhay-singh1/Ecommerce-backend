const express = require('express')
const router = express.Router();

const Category = require('../models/cats')
const productById = require('../middleware/getProductId')
const auth = require('../middleware/auth')
const adminAuth = require('../middleware/adminAuth')

const {check, validationResult} = require('express-validator')

router.post('/',[
    check('name','Name is required').trim().not().isEmpty()
],auth,adminAuth, async(req,res)=>{
    const err = validationResult(req)
    if(!err.isEmpty()){
        return res.status(400).json({
            error:errors.array()[0].msg
        })
    }

    const {name} = req.body

    try {
        let category = await Category.findOne({name})
        if(category){
            return res.status(403).json({
                error:'Category exists!'
            })

        }
        const newCategory = await new Category({
            name
        })

        category = await newCategory.save()
        res.json(category)
    } catch (error) {
        console.log(error)
        res.status(500).send('Server Error')
    }
    res.send('ok')
})


router.get('/sell',async(req,res)=>{
    try {
        let products = await Category.find({})
        res.json(products)
    } catch (error) {
        console.log(error)
        res.status(500).send('Server Error')
    }
})

router.post('/:categoryId', productById, async(req,res)=>{
    res.json(req.category)
})

module.exports = router;
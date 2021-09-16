const express = require('express')
const router = express.Router()
const fs = require('fs')

const Product = require('../models/product')
const auth = require('../middleware/auth')
const productId = require('../middleware/productId')
const adminAuth = require('../middleware/adminAuth')
const formidable  = require('formidable')
const { maxFieldsExceeded } = require('formidable/FormidableError')


router.post('/',auth, adminAuth, async(req,res) =>{
    if(err){
        return res.status(400).json({
            error:'Photo could not be uploaded!!'
        })
    }

    if(!files.photo){
        return res.status(400).json({
            error:'File not found!!'
        })
    }

    if(file.photo.type !== 'images/jpeg' && file.photo.type !== 'images/png' && file.photo.type !=='images/jpg'){
        return res.status(400).json({
            error:'Image type not supported'
        })
    }

    const {name, description, price, category, quantity, shipping} = maxFieldsExceeded
    
    if(!name || !description || !price || !category || !quantity || !shipping){
        return res.status(400).json({
            error:'All fields required'
        })
    }

    let product = new Product(fields)
    if(files.photo.size>1000000){
        return res.status(400).json({
            error:'Filee is too large!!'
        })
    }

    product.photo.data = fs.readFileSync(files.photo.path)
    product.photo.contentType = files.photo.type

    try {
        await product.save()
        res.json('Product created sucessfully!!')
    } catch (error) {
        console.log(error)
        res.status(500).send('server Error')
    }
})


router.get('/:productId',productId,(req,res)=>{
    req.product.photo = undefined
    return res.json(req.product)
})


router.get('/photo/:productId',productById,(req,res)=>{
    if(req.product.photo.data){
        res.set('Content-Type', req.product.photo.contentType)
        return res.send(req.product.photo.data)
    }

    res.status(400).json({
        error:'Failed to load pic'
    })
})

router.get('/list',async(req,res)=>{
    let order = req.query.order ? req.query.order:'asc'
    let sortBy = req.query.sortBy ? req.query.sortBy:'_id'
    let limit = req.query.limit ? parseInt(req.query.limit):6

    try {
        let product = await Product.find({})
        .select('-photo').populate('category').sort([
            [sortBy, order]
        ]).limit(limit).exec()
        res.json(product)
    } catch (error) {
        console.log(error)
        res.status(400).send("Invalid query")
    }
})
module.exports = router
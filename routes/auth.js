const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const {check, validationResult} = require('express-validator')
const router = express.Router()

const User = require('../models/Users');
const auth = require('../middleware/auth')

router.post('/register',[
    check('name','Name is required').not().isEmpty(),
    check('email','A valid email is required!!').isEmail(),
    check('password','Password string should be more than 7 characters long!!').isLength({
        min:7
    })
],async(req,res)=>{
    const errors = validationResult(req)

    if (!errors.isEmpty()){
        return res.status(400).json({
            errors:errors.array()
        })
    }


    const {name,email, password} = req.body

    try {
        let user = await User.findOne({email})
        if(user){
            res.status(400).json({
                msg:'User exist'
            })
           
        } 

        user = new User({
            name, email, password
        })

        const encrypt = await bcrypt.genSalt(10)

        user.password = await bcrypt.hash(password,encrypt)
        await user.save()

        const payload ={
            user:{
                id:user.id
            }
        }

        jwt.sign(
            payload,
            process.env.JWT_SECRET,{
                expiresIn:360000
            },
            (err,token)=>{
                if(err){
                    console.log(err)
                }
                else{
                    res.json(token)
                }
            }
        )

    } catch (error) {
        console.log(error.message)
        res.status(500).send('Server Error')
    }
});

router.post('/login',[
    check('email','Please input an email').isEmail(),
    check('password','Password should be longer than 7 characters').exists()
],
    async(req,res)=>{
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                errors:errors.array()
            })
        }

        const {email,password} =req.body

        try {
            let user = await User.findOne({email})
            
            if(!user){
                return res.status(400).json({
                    errors:[{
                        msg:'Invalid!!!'
                    }]
                })
            }

            const match = await bcrypt.compare(password,user.password)

            if(!match){
                return res.status(400).json({
                    errors:[{
                        msg:'Invalid!!!'
                    }]
                })
            }
            const payload ={
                user:{
                    id:user.id
                }
            }

            jwt.sign(
                payload,
                process.env.JWT_SECRET,{
                    expiresIn:360000
                },(error,token)=>{
                    if(error){
                        console.log(error)
                    }
                    else{
                        res.json(token)
                    }
                }
            )

        } catch (error) {
            console.log(error.message)
            res.status(500).send('Server Error!!')
        }
    }
)


router.get('/',auth, async(req,res)=>{
    try {
        const user = await User.findById(req.user.id).select('-password')
        res.json(user)
    } catch (error) {
        console.log(error.message)
        res.status(500).send("Server Error!!")
    }
})

module.exports = router
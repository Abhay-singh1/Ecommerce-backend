const User = require('../models/Users')

module.exports = async function(req,res,next){
    try {
        const user = await User.findOne({
            _id: req.user.id
        })

        if (user.role ===0){
            return res.status(403).json({
                msg:'Access Denied for non-admin Users.'
            })
        }
        next()
    } catch (error) {
        console.log(error)
        res.status(500).send('Server Error!')
    }
}
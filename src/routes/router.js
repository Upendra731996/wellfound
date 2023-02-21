const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const {authentication}=require('../middleware/auth')
router.post('/userResister',userController.createUser)
router.get('/getUser',authentication,userController.getUser)
router.post('/login',userController.login)
router.put('/forgetPassowrd',authentication,userController.forgetPassowrd)
router.put('/updateUser/:userId',authentication,userController.updateUser)

module.exports = router;
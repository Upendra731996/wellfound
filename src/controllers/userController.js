const userModel = require('../models/userModel');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt')
const crypto = require('crypto');
const algorithm1 = 'aes-128-cbc';
const secret = 'mypassword'

function encrypt(stringtoencrypt){
    let encryptkey = crypto.createCipher(algorithm1, secret);
    let encryptstr = encryptkey.update(stringtoencrypt, 'utf8', 'hex')
    encryptstr = encryptstr + encryptkey.final('hex');
    return encryptstr
}

function decrypt(stringtodecrypt){
    let decryptkey = crypto.createDecipher(algorithm1, secret);
    let decryptstr = decryptkey.update(stringtodecrypt, 'hex', 'utf8')
    decryptstr = decryptstr + decryptkey.final('utf8');
    return decryptstr
}
//============

const createUser = async (req, res) => {
    try {
        let data = req.body;
        // let password=data.password
        let {password,phone,fullName,email}=data
        phone= encrypt(phone)
        
        fullName=encrypt(fullName)
        
        const hashPassword = await bcrypt.hash(password, 10);
        password = hashPassword;
        let obj={phone,email,password,fullName}
        let createData = await userModel.create(obj);
        return res.status(201).send({ status: true, data: createData });
    } catch (error) {
        return res.status(500).send({ status: false, msg: error.message });
    }}

//=================
const getUser = async (req, res) => {
    try {
        let userId = req.decoded.userId;
        let findUser = await userModel.findOne({_id:userId});
        findUser.fullName=decrypt(findUser.fullName)
        findUser.phone=decrypt(findUser.phone)
        return res.status(201).send({ status: true, data: findUser });
    } catch (error) {
        return res.status(500).send({ status: false, msg: error.message });
    }
};
//==========================================================================
const login = async function (req, res) {
    try {
        const data = req.body
        const { email, password } = data
        if (!email || !password)

            res.status(400).send({ status: false, message: "Credential must be present" }) 

        let user = await userModel.findOne({ email })
        console.log(data)
        if (!user) {
            return res.status(400).send({ status: false, message: "Invalid CREDD" });
        } 
       
        const matchPass = await bcrypt.compare(password, user.password);
        if(!matchPass){
            return res.status(400).send({ status: false, message: "Invalid CRED" });
        }

        const payload = {
            fullName: user.fullName,
            userId:user._id,
            email: user.email,
            phone: user.phone
        }
        const token = jwt.sign(payload, "LetsEndore", {expiresIn: '72h' });
        const finalData = { userId : user._id, token: token};
        res.status(201).send({ status: true, message: "User login successfully", data: finalData });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}
//===========================
const forgetPassowrd = async function (req, res) {
    try {
        const userId = req.decoded.userId
        
        const { currentPassword, newPassword } = req.body
        if (!currentPassword || !newPassword)
            return res.status(400).send({ status: false, message: "Current or New Password is Missing" })
        let user = await userModel.findOne({ _id: userId })
        const matchPass = await bcrypt.compare(currentPassword, user.password);
        if (!matchPass) {
            return res.status(400).send({ status: false, message: "Incorrect Password" });
        }
        const hashPassword = await bcrypt.hash(newPassword, 10);
        await userModel.findOneAndUpdate({ _id: userId }, { password: hashPassword }, { new: true })
        res.status(200).send({ status: true, message: "Password Update Successfully" });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}
//============================

let updateUser = async function (req, res) {
    try {
        let userId = req.params.userId
        let data = req.body


       
        let userData = await userModel.findOneAndUpdate({ _id: userId }, data, { new: true })
        if (!userData) { return res.status(404).send({ status: false, message: "no user found to update" }) }
        return res.status(200).send({ Status: true, message: "Update user profile is successful", data: userData })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}









module.exports = { createUser,getUser, login,forgetPassowrd, updateUser }










//=================================================

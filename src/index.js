const express=require('express')
const fs=require('fs')
const mongoose=require('mongoose')
const router=require('./routes/router')
const app= express()
app.use(express.json())



mongoose.connect("mongodb+srv://upendra:wvUNUF1FjJ02PCPH@cluster0.b8yrh4n.mongodb.net/wellfound?retryWrites=true&w=majority",
{useNewUrlParser: true})
.then(()=> console.log('mongoose is connected'))
.catch((err)=> console.log(err))
app.use('/',router)
app.listen(3000,()=> console.log("express is running on port 3000"))
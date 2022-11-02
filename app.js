
const express =require('express')
const app = express()
const mongoose = require('./db/conn')
const hbs = require('hbs')
const path = require('path')
const userModel =  require('./models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const SECRET_KEY = 'ndkenskcnksnckndkcndnkcnekwn'

const temppath = path.join(__dirname, './templates/views')
const partialspath = path.join(__dirname, './templates/partials')

app.set('view engine', 'hbs')
app.set('views', temppath)
hbs.registerPartials(partialspath)

app.use(express.json())
app.use(express.urlencoded({extended:false}))


app.get('/', (req,res)=>{
    res.render('index')
})
app.get('/login', (req,res)=>{
    res.render('login')
})
app.get('/register', (req,res)=>{
    res.render('register')
})

app.post('/register',  async(req,res)=>{
    const {username, email,password} =  req.body
    try {
        const existinguser = await userModel.findOne({email:email})
        if(existinguser){
            return res.json({status:400, message:"user already exists"})
        }
        if(password.length<8){
            
    return res.json({status:400, message:'password must be 8 cahracters long'})
        }
    
        const hashpassword = await bcrypt.hash(password,10)
    
        const newUser = await userModel.create({
            username:req.body.username,
            email:req.body.email,
            password:hashpassword,
        })
    
        const token =  jwt.sign({id:newUser._id},SECRET_KEY)
        const result = await newUser.save()
         res.json({status:201,message:'user created', data:result, token:token })
        // res.status(201).render('index')
       
    
    } catch (error) {
        console.log(error);
        return res.json({status:500, message:'something went wrong'})
    }
    })


    app.post('/login', async(req,res)=>{
        const {username, password} = req.body;
        try {
            const existinguser = await userModel.findOne({username:username})
            if(!existinguser){
                return res.json({status:400, message:"no user found with this data"})
            }
    
            const matchpassword = await bcrypt.compare(password, existinguser.password)
            if(!matchpassword){
                return res.json({status:400, message:"incorrect password"})
            }
    
            const token = jwt.sign({id:existinguser._id}, SECRET_KEY)
            return res.json({status:200, message:"logged in", data:existinguser, token:token})
        } catch (error) {
            console.log(error);
            return res.json({status:500, message:'something went wrong'})
        }
    }
)


app.listen(3000, ()=>{
    console.log('listening 3000');
})
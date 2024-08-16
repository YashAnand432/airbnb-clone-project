const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User.js');
const bcrypt = require('bcryptjs');
const brcyptSalt = bcrypt.genSaltSync(10);
const jwt = require('jsonwebtoken');
const jwtSecret = 'dfaksgerghsetuharghdfba';
const cookieParser = require('cookie-parser');
const imageDownloader = require('image-downloader');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

app.use(express.json());
app.use(cookieParser());
app.use('/uploads' , express.static('uploads'));
app.use(cors({
    credentials : true,
    origin : 'http://localhost:5173'
}));

console.log(process.env.MONGO_URL);

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Successfully connected to MongoDB');
})
.catch(err => {
    console.error('Connection error', err);
});

app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    // Simple validation
    if (!name || !email || !password) {
        return res.status(422).json({ error: 'All fields are required' });
    }

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(422).json({ error: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const user = new User({
            name,
            email,
            password: hashedPassword,
        });

        await user.save();
        res.status(201).json({ message: 'Registration successful' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(422).json({ error: 'Registration failed' });
    }
});


app.post('/login', async (req, res)=>{
    const {email, password} = req.body;
    const userDoc = await User.findOne({email});
    if(userDoc){
        const passIsOk = bcrypt.compareSync(password , userDoc.password);
        if(passIsOk){
            jwt.sign({email: userDoc.email , id:userDoc._id,
                name:userDoc.name} , jwtSecret , {}, (err,token)=>{
                if(err) throw err;
                res.cookie('token', token ).json(userDoc);
            });
        }
        else{
            res.status(401).json({error:'Login unsuccessful'});
        }
    }
    else{
        res.status(404).json({error : 'User not found'})
    }
});
app.get('/test', (req, res) =>{
    res.json('test ok')
});

app.get('/profile', (req, res)=>{
    const {token} = req.cookies;
    if(token){
        jwt.verify(token, jwtSecret, {} , async (err, user) => {
            if(err) return res.status(403).json({error: 'Inavalid Token'});
            const userDoc = await User.findById(user.id).select('name email _id');
            res.json(userDoc);
        });
    } else {
        res.json(null);
    }
});


app.post('/upload-by-link', async (req, res) => {
    const { link } = req.body;
    const newName = 'photo' + Date.now() + '.jpg';
    console.log('Received link:', link);
    try {
        await imageDownloader.image({
            url: link,
            dest: __dirname + '/uploads/' + newName,
        });
        console.log('Image downloaded successfully:', newName);
        res.json(newName);
    } catch (error) {
        console.error('Error downloading image:', error);
        res.status(500).json({ error: 'Image download failed' });
    }
});


const photosMiddleware = multer({dest : 'uploads/'});

app.post('/upload' , photosMiddleware.array('photos' , 100), (req, res) => {
    const uploadedFiles = req.files.map(file => {
        const ext = path.extname(file.originalname);
        const newPath = path.join('uploads', file.filename + ext);
        fs.renameSync(file.path, newPath);
        return newPath;
    });
  
    res.json(req.files);
});

app.post('/logout', (req, res) => {
    res.cookie('token', '').json(true);
});


app.listen(4000);

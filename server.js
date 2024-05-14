const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path'); 
const { stringify } = require('querystring');
const app = express();
const multer = require('multer');
const fs = require('fs');
const port = 3000;

const imagePath =  path.join(__dirname, 'image/icons8-person-48.png'); ;

app.use(express.static(__dirname));

// Define a route to serve the HTML file
app.get('/', async (req, res) => {
 // const filePath = path.join(__dirname, 'home.html');
  const recipesnames = null;
  const p = false;
  const recentRecipes = await reciepe.find().sort({ timestamp: -1 }).limit(3);
  const search = null;
  res.render('home',{recentRecipes,  recipesnames ,p , search});
 
});

app.get('/about',(req,res)=>{
  const filePath =path.join(__dirname,'about.html');
  res.sendFile(filePath);
})

app.get('/contact',(req,res)=>{
  const filePath = path.join(__dirname, 'contact.html');
  res.sendFile(filePath);
});

app.get('/registration', (req, res) => {
  renderIndex(res, null);
});

app.get('/login',(req,res)=>{
  renderlogin(res,null);
});

app.get('/profile', async(req, res) => {
 
  const username = req.query.username;
  const p = true;
  const image = await profile.findOne({username: username});
  const  recentRecipes = await reciepe.find({username: username}).sort({ timestamp: -1 }).limit(3);
  res.render('profile', { username ,image,recentRecipes,p});
});

app.get('/all_recipes',async(req,res)=>{
    const username = req.query.username;
    const p = false;
    const image = await profile.findOne({username: username});
    const  recentRecipes = await reciepe.find({username: username}).sort({ timestamp: -1 });
    res.render('profile',{username,image,recentRecipes,p});
});

app.get('/recipe', async (req,res)=>{
  const recipeId = req.query.id; // Assuming you are passing the recipe ID
  const recipe = await reciepe.findById(recipeId);
 
  res.render('recipe',{recipe});
});

app.get('/edit', async (req,res)=>{
  try {
    const prof = await profile.findOne({username: req.query.username});
    res.render('edit',{prof});
  } catch (error) {
    console.error(error);
    res.status(200).json({ error: 'Internal Server Error' });
  }
 
});


mongoose.connect('mongodb://localhost:27017/registration_detail', { useNewUrlParser: true, useUnifiedTopology: true });
const User = mongoose.model('User', {
  username: String,
  email: String,
  password: String
});

const profile = mongoose.model('profile',{
   username: String,
   data: Buffer,
   contentType: String
});

const reciepe = mongoose.model('reciepe',{
   username : String,
   data: Buffer,
   contentType: String,
   reciepe_name : String,
   ingredients : String,
   instructions : String,
   timestamp: { type: Date, default: Date.now }
});

const storage = multer.memoryStorage(); // Store the file in memory as a Buffer
const upload = multer({ storage: storage });

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/search', async(req,res)=>{
    try {
      const search = req.body.search;
      const recipesnames = await reciepe.find({reciepe_name: { $regex: new RegExp(search, 'i') } });
    
      const recentRecipes = await reciepe.find().sort({ timestamp: -1 }).limit(3);
      const p = true;
      res.render('home',{recentRecipes,recipesnames,p,search});
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.post('/registration', async (req, res) => {
  try {
    // Check if the username already exists
    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser) {
      const message ='Username already exists. Please choose a different username.';
      return renderIndex(res, message, false);
      //return res.status(400).send('Username already exists. Please choose a different username.');
    }
    if ( req.body.password != req.body.confirm_password) {
      const message = 'Passwords do not match';
      return renderIndex(res,message,false);
     // return res.status(400).send('Invalid input or passwords do not match.');
    }
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    });

    const imageBuffer = fs.readFileSync(imagePath);
    const fileName = imagePath.split('/').pop();
    const mimeType = getMimeType(fileName);

    // Create a new Image document
    const image = new profile({
      username: req.body.username,
      data: imageBuffer,
      contentType: mimeType,
    });

    await image.save();
    await user.save();

    const message = 'Registration successful!';
    return renderIndex(res, message, true);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const check = await User.findOne({ username, password });
    if(!check){
      const message="Invalid username or password";
      return renderlogin(res, message, false);
    }
    const message = "Successful Login!!!";
    return renderlogin(res,message,true,username);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/reciepe', upload.single('image'), async(req,res)=>{
    const check = User.findOne({username:req.query.username});
    if(!check){
      res.send("No such user exist. If you have edited the profile please log in again");
    }
    try{
      const reciepe1 = new reciepe({
        data: req.file.buffer,
        contentType: req.file.mimetype,
        username: req.query.username,
        reciepe_name : req.body.recipeName,
        ingredients : req.body.ingredients,
        instructions : req.body.instructions
     });
     await reciepe1.save();
     const username = req.query.username;
     const image = await profile.findOne({username: username});
     const recentRecipes = await reciepe.find({username: username}).sort({ timestamp: -1 }).limit(3);
     const p = true;
    res.render('profile', { username ,image,recentRecipes,p});
    }
    catch (error){
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
});

app.post('/edit', upload.single('image1'), async(req,res)=>{
  try{
   var  username = req.body.username;
   const password = req.body.password;
   const image = await profile.findById(req.query.id);
   const email = req.body.email;
   var recentRecipes= null;
   if(req.file){ 
      const { buffer, mimetype } = req.file; 
      await profile.findByIdAndUpdate(image._id,{data:buffer,contentType:mimetype});
   }
   if(password){
    await User.updateOne({username: image.username},{password:password});
   }
   if(email){
     await User.updateOne({username: image.username},{email:email});
   }
   if(username){
    const existingUser = await User.findOne({ username: username });
    if (existingUser) {
      const message ='Username already exists. Please choose a different username.';
      return res.status(400).send('Username already exists. Please choose a different username.');
    }
    const check = image.username;
    await User.updateOne({username: check},{username: username});  
    await profile.updateOne({username: check},{username: username});
    await reciepe.updateMany({username: check},{username: username});
   }
   
  if(username){  recentRecipes = await reciepe.find({username: username}).sort({ timestamp: -1 }).limit(3);}
  else{
     recentRecipes = await reciepe.find({username: image.username}).sort({ timestamp: -1 }).limit(3);
     username = image.username;
  }
   const p = true;
   res.redirect("/profile?" + 'username=' + username);
  // res.render('profile', {username,image,recentRecipes,p});
  }
  catch (error){
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

function renderIndex(res, message, redirect) {
  // Render the index.ejs page with or without the message
  res.render('registration', { message, redirect });
}

function renderlogin(res, message, redirect,username){
  res.render('login',{message,redirect,username});
}

function getMimeType(fileName) {
  const extension = fileName.split('.').pop().toLowerCase();

  const mimeTypeMap = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
  };

  return mimeTypeMap[extension] || 'application/octet-stream';
}

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

const express = require('express');
const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const cors = require('cors');
require('./DB/db');
const studentRouter = require('./routes/studentroutes');

const app = express();

const port =  process.env.PORT  || 3000;

const pathdirectory = path.join(__dirname,'../public');
const viewPath = path.join(__dirname,'../Templates/Views');
const partialPath = path.join(__dirname,'../Templates/Partials');


app.use(express.static(pathdirectory));
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/student',studentRouter);


app.set('view engine','hbs');
app.set('views',viewPath);
hbs.registerPartials(partialPath);



// app.get('',(req,res)=>{
//   res.render('index',{
//     data:'Ssup!'
//   })
// });



app.listen(port,()=>{
  console.log(`Server up on Port ${port}`);
});
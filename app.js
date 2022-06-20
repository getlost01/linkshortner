const express = require('express')
const shortId = require('shortid')
const createHttpError = require('http-errors')
const mongoose = require('mongoose')
require('dotenv').config()
const path = require('path')
const ShortUrl = require('./models/url.model')

const app = express()
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.listen(process.env.PORT || 3001, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});

    mongoose.connect(process.env.MONGO_CONNECTION_URL, {useNewUrlParser: true ,useUnifiedTopology: true});
    const connection=mongoose.connection;
    try{
        connection.once('open',()=>{
        console.log('Database connected.')
    })
    }
    catch(e){
        console.log("Connection Fails.")
    }


app.set('view engine', 'ejs')

app.get('/', async (req, res, next) => {
  res.render('index')
})

app.post('/create', async (req, res, next) => {
  try {
    // console.log(req.body)
    const url = req.body.url
    const expireDay = req.body.TimeDeletion
    const custom = req.body.custom
    const customUrl = req.body.customUrl
    const password = req.body.password
    const passwordValue = req.body.passwordValue
    var slug = ""
    // Check valid URL
    if (!url) {
      throw createHttpError.BadRequest('Provide a valid url')
    }

    // Expire time Set
    var temp = expireDay.split('-');
    var TimeDeletion= new Date(new Date().setFullYear(parseInt(temp[0]),parseInt(temp[1]),parseInt(temp[2])))

    // Check Custom
    if(custom === 'true')
    {
      const urlExists = await ShortUrl.findOne({ shortId:customUrl })
      if (urlExists) {
        throw createHttpError.BadRequest('Your custum url already exist try another one')
      }
      if(password === 'true'){
        if (customUrl === "") {
          throw createHttpError.BadRequest('Please enter a password of atleast 4 variable')
        }
      }
      slug = customUrl;
    }
    else
    {
       slug = shortId.generate()
    }

    // Check Password
    if(password === 'true')
    {
      if (passwordValue.length < 4) {
        throw createHttpError.BadRequest('Please enter a password of atleast 4 variable')
      }
    }

    const shortUrl = new ShortUrl({ url: url, shortId: slug ,TimeDeletion: TimeDeletion.setSeconds(0,0), custom, password, passwordValue})
    const result = await shortUrl.save()
    res.render('index', {
      short_url: `${req.headers.host}/${result.shortId}`,
    })
  } catch (error) {
    next(error)
  }
})

app.get('/:shortId', async (req, res, next) => {
  try {
    const { shortId } = req.params
    const result = await ShortUrl.findOne({ shortId })
    if (!result) {
      throw createHttpError.NotFound('Short url does not exist')
    }
    res.redirect(result.url)
    await result.updateOne({ count: result.count+1 })
  } catch (error) {
    next(error)
  }
})

app.use((req, res, next) => {
  next(createHttpError.NotFound())
})

app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.render('index', { error: err.message })
})

setInterval(()=>{
  var timeNow = new Date(new Date().setSeconds(0,0));
  var myquery = { TimeDeletion: timeNow};
  ShortUrl.deleteMany(myquery, function(err, obj) {
    if (err) throw err;
    console.log("some document deleted");
    console.log(timeNow);
  });
},60000);

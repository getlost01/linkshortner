const express = require('express')
const router = express.Router()
const shortId = require('shortid')
const createHttpError = require('http-errors')
const mongoose = require('mongoose')
const crypto = require("crypto")
require('dotenv').config()
const path = require('path')
const ShortUrl = require('./models/url.model')

const app = express()
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(router);

app.listen(process.env.PORT || 3001, function(){
  console.log("➡️ Url Shortner listening on port %d in %s mode 👍", this.address().port, app.settings.env);
});

    mongoose.connect(process.env.MONGO_CONNECTION_URL, {useNewUrlParser: true ,useUnifiedTopology: true});
    const connection=mongoose.connection;
    try{
        connection.once('open',()=>{
        console.log('Database connected. 👍')
    })
    }
    catch(e){
        console.log("Connection Fails. 👎")
    }


app.set('view engine', 'ejs')

app.get('/', async (req, res, next) => {
  res.render('index')
})

router.post('/create', async (req, res, next) => {
  try {
    // console.log(req.body)
    const url = req.body.url
    const expireDay = req.body.TimeDeletion
    const custom = req.body.custom
    const customUrl = req.body.customUrl
    const password = req.body.password
    var passwordValue = req.body.passwordValue
    var slug = ""
    var passwordHash = ""
    // Check valid URL
    if (!url) {
      throw createHttpError.BadRequest('Provide a valid url')
    }

    // Expire time Set
    var temp = expireDay.split('-');
    var TimeDeletion= new Date(new Date().setFullYear(parseInt(temp[0]),parseInt(temp[1]-1),parseInt(temp[2])))
    // var TimeDeletion= new Date(new Date().getTime()+2*60*1000)
    // Check Custom
    if(custom === 'true')
    {
      const urlExists = await ShortUrl.findOne({ shortId:customUrl })
      if (urlExists) {
        throw createHttpError.BadRequest('Your custum url already exist try another one')
      }
        if (customUrl === "") {
          throw createHttpError.BadRequest('Please provide a valid custom Short Url')
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
      let saltedPass = `${process.env.SALT_VAL}${passwordValue}${process.env.SALT_VAL}`
      passwordHash = crypto.createHash('sha256').update(saltedPass).digest("hex")
    }

    const shortUrl = new ShortUrl({ url: url, shortId: slug ,TimeDeletion: TimeDeletion.setMinutes(0,0,0), custom, password, passwordHash})
    const result = await shortUrl.save()
    var requiredLink = `${req.headers.host}/${result.shortId}`;
    res.render('create', {
      long_url: url,
      short_url: requiredLink,
      short_Id: slug,
      custom_link: custom,
      password: password,
      passwordValue: passwordValue,
      creationTime: new Date(new Date().setSeconds(0,0)),
      TimeDeletion: new Date(TimeDeletion.setSeconds(0,0))
    })
  } catch (error) {
    next(error)
  }
})

router.get('/:shortId', async (req, res, next) => {
  try {
    const { shortId } = req.params
    const result = await ShortUrl.findOne({ shortId })
    if (!result) {
      throw createHttpError.NotFound('Short url does not exist or expired')
    }
    if(result.password)
    {``
      res.render('password', {
        shortId: result.shortId
      })
      return
    }
    res.redirect(result.url)
    await result.updateOne({ count: result.count+1 })
  } catch (error) {
    next(error)
  }
})

app.post('/password/validate', async (req, res, next) => {
  try {
    const shortURL = req.body.url
    const passwordValue = req.body.passwordValue
    let saltedPass = `${process.env.SALT_VAL}${passwordValue}${process.env.SALT_VAL}`
    var passwordHash = crypto.createHash('sha256').update(saltedPass).digest("hex")
    var slug = shortURL.split("/")[1];
    const result = await ShortUrl.findOne({ shortId: slug })

    if(!result)
    {
      next(createHttpError.NotFound())
      return
    }
    if(result.passwordHash != passwordHash)
    {
      res.render('password', {
        err:"Wrong password, Please enter right one",
        shortId: result.shortId
      })
      return
    }
    res.redirect(result.url)
    await result.updateOne({ count: result.count+1 })
  } catch (error) {
    next(error)
  }
})

router.post('/details', async (req, res, next) => {
  try {
    const short_Id = req.body.short_Id
    const result = await ShortUrl.findOne({ shortId: short_Id})
    if (!result) {
      next(createHttpError.NotFound())
      return
    }
    res.render('details', {
      long_url: result.url,
      short_url: `${req.headers.host}/${result.shortId}`,
      short_Id: result.shortId,
      custom_link: result.custom,
      password: result.password,
      creationTime: result. TimeCreation,
      TimeDeletion: result.TimeDeletion,
      count: result.count
    })
  } catch (error) {
    next(error)
  }
})

router.post('/search-url', async (req, res, next) => {
  try {
    const ShortURL = req.body.ShortURL
    var temp = ShortURL.split('/')
    var short_Id = temp[temp.length-1];
    if(!short_Id)
    var short_Id = temp[temp.length-2];

    const result = await ShortUrl.findOne({ shortId: short_Id})
    if (!result) {
      next(createHttpError.NotFound())
      return
    }
    var longUrlShow = result.url;
    if(result.password === true)
    {
      longUrlShow = `This is password protected url, " Nothing to show 😅 "`
    }
    res.render('details', {
      long_url: longUrlShow,
      short_url: `${req.headers.host}/${result.shortId}`,
      creationTime: result. TimeCreation,
      TimeDeletion: result.TimeDeletion,
      count: result.count
    })
  } catch (error) {
    next(error)
  }
})

app.use((req, res, next) => {
  next(createHttpError.NotFound())
})

app.use((err, req, res, next) => {
  if(err.message === "Not Found")
  {
    res.render('error')
    res.status(err.status || 404)
    return
  }
  res.render('index', { error: err.message })
  res.status(err.status || 500)
})

setInterval(()=>{
  var timeNow = new Date(new Date().setSeconds(0,0));
  var myquery = { TimeDeletion: timeNow};
  ShortUrl.deleteMany(myquery, function(err, obj) {
    if (err) throw err;
    console.log("Some document deleted 🧐");
    console.log(timeNow);
  });
},60*60*1000);

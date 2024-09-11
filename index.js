const express = require('express')
// const stripe = require('stripe')('yqbb-adiz-lsdw-nfpc-mngu');////////////

const stripePublicKey = "pk_test_51P9x6FECVIMwlQ1bxa9Hk8fGox5VcpKINZYORTqWcbpueW0LyjoINcmOObEGGxYKBmn6mkLq8vcMwQlyAxH8QhzP00Hkyy6d37";

const handlebars = require('handlebars')
const exphbs = require('express-handlebars')
const csrf = require('csurf')
const flash = require('connect-flash')
const path = require('path')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)
const homeRoutes = require('./routes/home')
const addRoutes = require('./routes/add')
const coursesRoutes = require('./routes/courses')
const authRoutes = require('./routes/auth')
const ordersRoutes = require('./routes/orders')
const cardRoutes = require('./routes/card')
const varMiddleware = require('./middleware/variables')
const userMiddleware = require('./middleware/user')
const fileMiddleware = require('./middleware/file')
const errorHandler = require('./middleware/error')
const keys = require('./keys');



// const helpers = require('./utils/hbs-helpers');


const app = express()
const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  }
})

handlebars.registerHelper('ifeq', function(a, b, options) {
  if (`${a}` === `${b}`) {
      return options.fn(this);
  } else {
      return options.inverse(this);
  }
});

const store = new MongoStore({
  collection: 'sessions',
  uri: keys.MONGODB_URI
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'viewes')

app.use(express.static(path.join(__dirname, 'public')))
app.use('/files',express.static(path.join(__dirname, 'files')))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(session({
  secret: keys.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store
}))
app.use(fileMiddleware.single('courseFile'))
// app.use('/payments', customerRoutes);
app.use(csrf())
app.use(flash())
app.use(varMiddleware)
app.use(userMiddleware)



app.use('/', homeRoutes)
app.use('/courses', coursesRoutes)
app.use('/add', addRoutes)
app.use('/card', cardRoutes)
app.use('/orders', ordersRoutes)
app.use('/auth', authRoutes)

app.get('/app', function(req, res){
  Course.find({}, function(error, courses){
    if(error){
      res.status(500).end();
    } else {
      res.render('head.hbs',{
        stripePublicKey: stripePublicKey
      })
      res.render('card.hbs', {
        courses: courses
      })
    }
  })
})

app.use(errorHandler) 

const PORT = process.env.PORT || 3000
async function start() {
  try {
    // const url = `mongodb+srv://admin:${password}@cluster0.ffk3953.mongodb.net/shop`;
    await mongoose.connect(keys.MONGODB_URI)

    app.listen(PORT, () => {
      console.log(`Server is running on port  ${PORT}`)
    })
  } catch (err) {
    console.log(err)
  }
}
start()
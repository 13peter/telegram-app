const { Router } = require('express')
const Course = require('../models/course')
const auth = require('../middleware/auth')
const router = Router()

router.get('/', auth, (req, res) => {
  res.render('add', {
    title: 'Додати курс',
    isAdd: true
  })
})

router.post('/', auth, async (req, res) => {
  // const course = new Course(req.body.title, req.body.price, req.body.img)

  console.log(req.file.filename)


  const course = new Course({
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    img: req.body.img,
    userId: req.user._id,
    courseFile: req.file.filename
  })

  try {
    await course.save()
  } catch (err) {
    console.log(err)
  }

  res.redirect('/courses')
})

module.exports = router
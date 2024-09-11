const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  let title = 'Курсы'
  res.render('index', {
    title,
    isHome: true
  })
})

module.exports = router
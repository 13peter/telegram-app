const express = require('express')
const Course = require('../models/course')
const { populate } = require('../models/user')
const auth = require('../middleware/auth')
const router = express.Router()


router.get('/', async (req, res) => {
  try {
    
    const userAuthed = req.user ? req.user._id.toString() : null;

    const courses = await Course.find()
      .populate('userId', 'email name')
      .select('title description price img');

    res.render('courses', {
      title: 'Курсы',
      isCourses: true,
      userAuthed: userAuthed,
      courses: courses
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).send('Error fetching courses');
  }
});



router.post('/edit', auth, async (req, res) => {
  try {
    const { id } = req.body
    delete req.body.id
    await Course.findByIdAndUpdate(id, req.body)
    res.redirect('/courses')
  } catch (error) {
    console.error('Error updating course:', error)
    res.status(500).send('Error updating course')
  }
})

router.post('/remove', auth, async (req, res) => {
  try {
    await Course.deleteOne({ 
      _id: req.body.id,
      userId: req.user._id
     })
    res.redirect('/courses')
  } catch (err) {
    console.error('Error updating course:', error)
    res.status(500).send('Error updating course')
  }
  await Course.deleteOne({
    _id: req.body.id
  })
})

router.get('/:id', async (req, res) => {
  try {
    const userAuthed = req.user ? req.user._id.toString() : null;
    const course = await Course.findById(req.params.id)
    res.render('course', {
      title: `Курс ${course.title}`,
      course: course,
      userAuthed
    })
  } catch (error) {
    console.error('Error fetching course details:', error)
    res.status(500).send('Error fetching course details')
  }
})

router.get('/:id/edit', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
    res.render('course-edit', {
      title: `Kurs ${course.title}`,
      course: course,
      isAdd: true
    })
  } catch (error) {
    console.error('Error fetching course for editing:', error)
    res.status(500).send('Error fetching course for editing')
  }
})

module.exports = router
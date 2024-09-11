const { Router, json } = require('express')
const Course = require('../models/course')
const auth = require('../middleware/auth')
const router = Router()
const stripePublicKey = "pk_test_51P9x6FECVIMwlQ1bxa9Hk8fGox5VcpKINZYORTqWcbpueW0LyjoINcmOObEGGxYKBmn6mkLq8vcMwQlyAxH8QhzP00Hkyy6d37";
const stripeSecretKey = "sk_test_51P9x6FECVIMwlQ1b7jFA48a0Rt1L1WPMUq4xWR5UMSjlCMxuscm2YcaKUxoSi5zOPA9XMoCifgOsd58HHhlURwgr00TUUcVcS1";
const stripe = require('stripe')(stripeSecretKey)
const Order = require('../models/order'); 


function mapCartItems(cart) {
  return cart.items.map(c => {
    if (c.courseId != null) {
      return ({
        title: c.title,
        count: c.count,
        id: c.courseId._id,
        price: c.price,
        img: c.img,
        _id: c._id
      })
    }
  })
}

function computePrice(courses) {
  return courses.reduce((total, course) => {
    return total += course.price * course.count
  }, 0)
}

router.post('/add', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.body.id)
    if (!course) {
      throw new Error('Курс не найден')
    }
    console.log(JSON.stringify(course))
    await req.user.addToCart(course)
    res.status(200).json('Added')
  } catch (err) {
    console.error('Ошибка при добавлении курса в корзину:', err)
    res.status(500).json('Added error', err.message)
  }
})
router.delete('/remove-all', auth, async (req, res) => {
  try {
      await req.user.clearCart(); // Clear all items from the cart
      const user = await req.user.populate('cart.items.courseId');
      const courses = mapCartItems(user.cart);
      const cart = {
          courses,
          price: computePrice(courses)
      };
      res.status(200).json(cart); // Respond with the updated cart
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
  }
});

router.delete('/remove/:id', auth, async (req, res) => {
  await req.user.removeFromCart(req.params.id)
  const user = await req.user.populate('cart.items.courseId')
  const courses = mapCartItems(user.cart)
  const cart = {
    courses, price: computePrice(courses)
  }
  res.status(200).json(cart)
})
router.get('/count', auth, async (req, res) => {
  try {
    const user = req.user
    // const user = await req.user.populate('cart.items.courseId');
    const courses = mapCartItems(user.cart)
    res.status(200).json(courses)
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Internal Server Error' })
  }
})

router.get('/', async (req, res) => {
  try {
    const user = req.user
    const courses = mapCartItems(user.cart)

    res.render('card', {
      title: 'Кошик',
      courses: courses,
      isCard: true,
      stripePublicKey: stripePublicKey,
      price: computePrice(courses)
    })

  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' })
  }
})


router.post('/purchase', async function(req, res) {
  let total = 0;

  const user = await req.user;
  const courses = await mapCartItems(user.cart);

  courses.forEach(c => {
    total = total + c.price * c.count;
  });

  stripe.charges.create({
    amount: req.body.total,
    source: req.body.stripeTokenId,
    currency: 'uah'
  }).then(async function() {
    console.log('Charge Successful');

    const user = await req.user.populate('cart.items.courseId');

    const courses = user.cart.items.map(i => ({
      count: i.count,
      course: { ...i.courseId._doc }
    }));

    const order = new Order({
      user: {
        name: req.user.name,
        userId: req.user.id
      },
      courses: courses
    });

    await order.save();
    await req.user.clearCart();
  res.redirect('/orders');

    
  }).catch(function(error) {
    console.error('Charge Failed:', error);
    res.status(500).send("Charge Failed");
  });
});



module.exports = router

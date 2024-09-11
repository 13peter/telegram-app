// import 'mongoose';
// import { Schema } from 'mongoose';
const { Schema, model } = require('mongoose')
const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  name: String,
  password: {
    type: String,
    required: true
  },
  // resetToken: String,
  // resetTokenExp:Date,  vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
  cart: {
    items: [
      {
        title: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true
        },
        count: {
          type: Number,
          required: true,
          default: 1
        },
        img: {
          type: String,
          required: true,
          default: ''
        },
        courseId: {
          type: Schema.Types.ObjectId,
          ref: 'Course',
          required: true
        }
      }
    ]
  }
})

userSchema.methods.addToCart = function (course) {
  const items = [...this.cart.items]
  const idx = items.findIndex(c => {
    return c.courseId.toString() === course._id.toString()
  })
  if (idx >= 0) {
    items[idx].count = this.cart.items[idx].count + 1
  } else {
    items.push({
      title: course.title,
      price: course.price,
      courseId: course._id,
      img: course.img,
      count: 1
    })
  }

  this.cart = { items }
  return this.save()
}

userSchema.methods.removeFromCart = function (id) {
  let items = [...this.cart.items]
  const idx = items.findIndex(c => c.courseId.toString() === id.toString())

  if (items[idx].count === 1) {
    items = items.filter(c => c.courseId.toString() !== id.toString())
  } else {
    items[idx].count--
  }

  this.cart = { items }
  return this.save()
}

userSchema.methods.clearCart = function () {
  this.cart = { items: [] }
  return this.save()
}
module.exports = model('User', userSchema)
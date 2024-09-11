const { Schema, model } = require('mongoose');

const courseSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    img:{
        type:String,
    },

    userId:{
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    courseFile:{
        type:String,
    }
});

courseSchema.method('toClient', function(){
    const course = this.toObject()
    
    course.id = course._id
    delete course._id
    return course
})

module.exports = model('Course', courseSchema);


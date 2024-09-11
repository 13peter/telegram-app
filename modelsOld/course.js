const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises;
const path = require('path');


class Course {
    constructor(title, price, img) {
        this.title = title;
        this.price = price;
        this.img = img;
        this.id = uuidv4();
    }

    toJSON() {
        return {
            title: this.title,
            price: this.price,
            img: this.img,
            id: this.id
        };
    }

    async save() {
        try {
            const courses = await Course.getAll();
            courses.push(this.toJSON());
            await fs.writeFile(
                path.join(__dirname, '..', 'data', 'courses.json'),
                JSON.stringify(courses)
            );
        } catch (error) {
            console.error(error);
            throw error; // Propagate the error for handling externally
        }
    }

    static async getAll() {
        try {
            const content = await fs.readFile(path.join(__dirname, '..', 'data', 'courses.json'), 'utf-8');
            return JSON.parse(content);
        } catch (error) {
            console.error(error);
            throw error; // Propagate the error for handling externally
        }
    }

    static async getById(id){
       const courses = await Course.getAll()
       return courses.find(c => c.id === id)
    } 


    static async update(body){
        try{
            const courses = await Course.getAll();
            const index = courses.findIndex(c => c.id === body.id);
    
            if(index > -1){
                courses[index] = body
                await fs.writeFile(path.join(__dirname, '..', 'data', 'courses.json'),
                JSON.stringify(courses));
                return
            } 

            console.log(`index is wrong = ${index}`)
            
        } catch (error) {
            console.log(error);
        }
    } 
}

module.exports = Course;

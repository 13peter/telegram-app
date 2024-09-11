const path = require('path');
const fs = require('fs').promises;

const p = path.resolve(__dirname, '..', 'data', 'card.json');

class Card {
  static async add(course) {
    try {
      const card = await Card.fetch();

      const idx = card.courses.findIndex((c) => c.id === course.id);
      const candidate = card.courses[idx];

      if (candidate) {
        // Course already in the cart
        candidate.count++;
      } else {
        // Need to add the course to the cart
        course['count'] = 1;
        card.courses.push(course);
      }

      card.price += +course.price;

      await fs.writeFile(p, JSON.stringify(card));

      return card;
    } catch (error) {
      throw error;
    }
  }

  static async remove(id) {
    try {
      const card = await Card.fetch();

      const idx = card.courses.findIndex((c) => c.id === id);
      const course = card.courses[idx];

      if (!course) {
        throw new Error('Course not found in the card.');
      }

      if (course.count === 1) {
        // Delete course if count is 1
        card.courses = card.courses.filter((c) => c.id !== id);
      } else {
        // Decrease course count by 1
        card.courses[idx].count--;
      }

      card.price -= course.price;

      await fs.writeFile(p, JSON.stringify(card));

      return card;
    } catch (error) {
      throw error;
    }
  }

  static async removeAll(id) {
    try {
      const card = await Card.fetch();

      const idx = card.courses.findIndex((c) => c.id === id);
      const course = card.courses[idx];

      if (!course) {
        throw new Error('Course not found in the card.');
      }
      card.price -= course.price * card.courses[idx].count;
      card.courses = card.courses.filter((c) => c.id !== id);
      await fs.writeFile(p, JSON.stringify(card));

      return card;
    } catch (error) {
      throw error;
    }
  }
  
  static async fetch() {
    try {
      const content = await fs.readFile(p, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      // If the file doesn't exist or any other error occurs, return an empty card
      return { courses: [], price: 0 };
    }
  }
}

module.exports = Card;


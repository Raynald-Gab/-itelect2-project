'use strict';

const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    const password = bcrypt.hashSync('admin12345', 10);
    const memberPassword = bcrypt.hashSync('member12345', 10);

    await queryInterface.bulkInsert('Users', [
      {
        name: 'Admin User',
        email: 'admin@itelect2.test',
        password: password,
        role: 'admin',
        createdAt: now,
        updatedAt: now
      },
      {
        name: 'Member One',
        email: 'member1@itelect2.test',
        password: memberPassword,
        role: 'member',
        createdAt: now,
        updatedAt: now
      },
      {
        name: 'Member Two',
        email: 'member2@itelect2.test',
        password: memberPassword,
        role: 'member',
        createdAt: now,
        updatedAt: now
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', {
      email: {
        [Sequelize.Op.in]: [
          'admin@itelect2.test',
          'member1@itelect2.test',
          'member2@itelect2.test'
        ]
      }
    });
  }
};
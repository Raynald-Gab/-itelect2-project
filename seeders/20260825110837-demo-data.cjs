'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    const adminHash = await bcrypt.hash('admin12345', 10);
    const memberHash = await bcrypt.hash('member1234', 10);

    await queryInterface.bulkInsert('Users', [
      { name: 'Admin User', email: 'admin@itelect2.test', password: adminHash, role: 'admin', createdAt: now, updatedAt: now },
      { name: 'Member One', email: 'member1@itelect2.test', password: memberHash, role: 'member', createdAt: now, updatedAt: now },
      { name: 'Member Two', email: 'member2@itelect2.test', password: memberHash, role: 'member', createdAt: now, updatedAt: now }
    ]);

    const users = await queryInterface.sequelize.query(
      `SELECT id, email FROM "Users" ORDER BY id ASC;`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const adminId = users.find((u) => u.email === 'admin@itelect2.test').id;
    const member1Id = users.find((u) => u.email === 'member1@itelect2.test').id;
    const member2Id = users.find((u) => u.email === 'member2@itelect2.test').id;

    await queryInterface.bulkInsert('Tasks', [
      { title: 'Set up project repo', completed: true, userId: adminId, createdAt: now, updatedAt: now },
      { title: 'Write API documentation', completed: false, userId: adminId, createdAt: now, updatedAt: now },
      { title: 'Design database schema', completed: true, userId: member1Id, createdAt: now, updatedAt: now },
      { title: 'Build authentication routes', completed: false, userId: member1Id, createdAt: now, updatedAt: now },
      { title: 'Test delete endpoint', completed: false, userId: member2Id, createdAt: now, updatedAt: now }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Tasks', null, {});
    await queryInterface.bulkDelete('Users', null, {});
  }
};
'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', [
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password',
        role: 'admin',
        profilePicture: 'https://example.com/admin.jpg',
        bio: 'I am an admin user.',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Editor User',
        email: 'coach@example.com',
        password: 'password',
        role: 'coach',
        profilePicture: 'https://example.com/admin.jpg',
        bio: 'I am an admin user.',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Viewer User',
        email: 'client@example.com',
        password: 'password',
        role: 'client',
        profilePicture: 'https://example.com/admin.jpg',
        bio: 'I am an admin user.',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', {
      email: {
        [Sequelize.Op.in]: [
          'admin@example.com',
          'coach@example.com',
          'client@example.com'
        ]
      }
    }, {});
  }
};
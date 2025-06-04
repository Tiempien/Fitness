'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    // Users
    await queryInterface.bulkInsert('users', [
      {
        id: 1,
        name: 'Admin User',
        email: 'admin@example.com',
        password: '$2a$12$HC2nM4K/U6/0usqnJkWtu.Ij3Gtq354Oh6b7OfwIoflZUnebLQP7m',
        role: 'admin',
        profilePicture: 'https://example.com/admin.jpg',
        bio: 'I am an admin user.',
        isActive: true,
        createdAt: new Date('2025-05-01T18:02:40'),
        updatedAt: new Date('2025-05-01T18:02:40')
      },
      {
        id: 2,
        name: 'Coach Boke',
        email: 'coach@example.com',
        password: '$2a$12$HC2nM4K/U6/0usqnJkWtu.Ij3Gtq354Oh6b7OfwIoflZUnebLQP7m',
        role: 'coach',
        profilePicture: 'https://example.com/admin.jpg',
        bio: 'I am an admin user.',
        isActive: true,
        createdAt: new Date('2025-05-01T18:02:40'),
        updatedAt: new Date('2025-05-01T18:07:14')
      },
      {
        id: 3,
        name: 'Tiemen',
        email: 'client@example.com',
        password: '$2a$12$HC2nM4K/U6/0usqnJkWtu.Ij3Gtq354Oh6b7OfwIoflZUnebLQP7m',
        role: 'client',
        profilePicture: 'https://example.com/admin.jpg',
        bio: 'I am an admin user.',
        isActive: true,
        createdAt: new Date('2025-05-01T18:02:40'),
        updatedAt: new Date('2025-05-01T19:30:32')
      },
      {
        id: 4,
        name: 'Voornaam Achternaam',
        email: 'tiemenvanolst@hotmail.com',
        password: '$2a$12$HC2nM4K/U6/0usqnJkWtu.Ij3Gtq354Oh6b7OfwIoflZUnebLQP7m',
        role: 'client',
        profilePicture: null,
        bio: null,
        isActive: true,
        createdAt: new Date('2025-05-01T19:42:28'),
        updatedAt: new Date('2025-05-12T09:51:59')
      },
      {
        id: 5,
        name: 'Tiemen van Olst',
        email: 'tiemenvanolst2@hotmail.com',
        password: 'temporary_password',
        role: 'client',
        profilePicture: null,
        bio: null,
        isActive: true,
        createdAt: new Date('2025-05-03T12:04:23'),
        updatedAt: new Date('2025-05-03T12:04:23')
      }
    ], {});

    // CoachClients
    await queryInterface.bulkInsert('coachclients', [
      {
        id: 1,
        coachId: 2,
        clientId: 3,
        createdAt: new Date('2025-05-12T15:19:34'),
        updatedAt: new Date('2025-05-12T15:19:35')
      },
      {
        id: 2,
        coachId: 2,
        clientId: 4,
        createdAt: new Date('2025-05-12T15:38:34'),
        updatedAt: new Date('2025-05-12T15:38:34')
      }
    ], {});

    // Exercises
    await queryInterface.bulkInsert('exercises', [
      {
        id: 1,
        name: 'Squad',
        description: 'Squadd',
        instructionalVideoUrl: 'ad',
        createdAt: new Date('2025-05-12T12:54:55'),
        updatedAt: new Date('2025-05-12T13:15:16'),
        category: 'cardio',
        difficulty: 'beginner'
      },
      {
        id: 2,
        name: 'Cable rows',
        description: 'Cable rows',
        instructionalVideoUrl: '',
        createdAt: new Date('2025-05-12T13:13:25'),
        updatedAt: new Date('2025-05-14T11:34:06'),
        category: 'balance',
        difficulty: 'intermediate'
      },
      {
        id: 3,
        name: 'Bench Press 1',
        description: 'Dit is de normale benchprenc',
        instructionalVideoUrl: '',
        createdAt: new Date('2025-05-12T13:13:45'),
        updatedAt: new Date('2025-05-14T10:14:27'),
        category: 'flexibility',
        difficulty: 'advanced'
      },
      {
        id: 5,
        name: 'Test oefening',
        description: 'Test',
        instructionalVideoUrl: '',
        createdAt: new Date('2025-05-14T09:16:11'),
        updatedAt: new Date('2025-05-14T09:16:11'),
        category: 'cardio',
        difficulty: 'beginner'
      },
      {
        id: 6,
        name: 'Modal',
        description: 'a',
        instructionalVideoUrl: '',
        createdAt: new Date('2025-05-14T09:39:12'),
        updatedAt: new Date('2025-05-14T09:39:12'),
        category: 'strength',
        difficulty: 'beginner'
      }
    ], {});

    // WorkoutPlans
    await queryInterface.bulkInsert('workoutplans', [
      {
        id: 1,
        title: 'Test',
        description: 'Test',
        userId: 3,
        coachDescription: 'Test',
        createdAt: new Date('2025-05-12T17:59:24'),
        updatedAt: new Date('2025-05-12T17:59:24')
      }
    ], {});

    // WorkoutExercises
    await queryInterface.bulkInsert('workoutexercises', [
      {
        id: 1,
        reps: 10,
        sets: 3,
        restSeconds: 60,
        notes: 'a',
        workoutPlanId: 1,
        createdAt: new Date('2025-05-12T17:59:47'),
        updatedAt: new Date('2025-05-12T17:59:47'),
        exerciseId: 3,
        order: 1
      },
      {
        id: 3,
        reps: 10,
        sets: 3,
        restSeconds: 60,
        notes: 'Test',
        workoutPlanId: 1,
        createdAt: new Date('2025-05-13T13:22:05'),
        updatedAt: new Date('2025-05-13T13:22:05'),
        exerciseId: 1,
        order: 2
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('workoutexercises', null, {});
    await queryInterface.bulkDelete('workoutplans', null, {});
    await queryInterface.bulkDelete('exercises', null, {});
    await queryInterface.bulkDelete('coachclients', null, {});
    await queryInterface.bulkDelete('users', null, {});
  }
}; 
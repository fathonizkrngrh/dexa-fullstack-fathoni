'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Insert into users
    await queryInterface.bulkInsert('users', [{
      id: 1,
      email: 'hr.admin@example.com',
      password: '$2b$10$S1cq7FjH84OPI8sWz.bW8OiQRv5eT1ENY.uuLNd1Xk3kb7dSult3S',
      role: 'ADMIN',
      registered_by: 0,
      deleted: false,
      created_at: new Date('2025-05-30T16:49:06.000Z'),
      updated_at: new Date('2025-05-30T18:08:54.000Z')
    }]);

    // Insert into employees
    await queryInterface.bulkInsert('employees', [{
      user_id: 1,
      name: 'HR Admin',
      nik: 'HR001',
      position: 'Manager',
      department: 'HR',
      status: 'active',
      phone_number: '081234567890',
      address: 'Jl. HRD No.1, Jakarta',
      working_type: 'WFH',
      join_date: new Date('2025-05-30'),
      deleted: false,
      created_at: new Date('2025-05-30T16:49:08.000Z'),
      updated_at: new Date('2025-05-30T16:49:08.000Z')
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('employees', { user_id: 1 }, {});
    await queryInterface.bulkDelete('users', { id: 1 }, {});
  }
};

INSERT INTO dexa_employee.users (
        email,
        password,
        `role`,
        registered_by,
        deleted,
        created_at,
        updated_at
    )
VALUES (
        'hr.admin@example.com',
        '$2b$10$S1cq7FjH84OPI8sWz.bW8OiQRv5eT1ENY.uuLNd1Xk3kb7dSult3S',
        'ADMIN',
        0,
        0,
        '2025-05-30 16:49:06.0',
        '2025-05-30 18:08:54.0'
    );
    
INSERT INTO dexa_employee.employees (
        user_id,
        name,
        nik,
        `position`,
        department,
        status,
        phone_number,
        address,
        working_type,
        join_date,
        deleted,
        created_at,
        updated_at
    )
VALUES (
        1,
        'HR Admin',
        'HR001',
        'Manager',
        'HR',
        'active',
        '+6281234567890',
        'Jl. HRD No.1, Jakarta',
        'WFH',
        '2025-05-30',
        0,
        '2025-05-30 16:49:08.0',
        '2025-05-30 16:49:08.0'
    );
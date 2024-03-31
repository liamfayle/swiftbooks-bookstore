const pool = require('./db');
const bcrypt = require('bcrypt');


const initDB = async () => {
    const createUserTable = `
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            username VARCHAR(50) NOT NULL UNIQUE,
            email VARCHAR(100) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            active BOOLEAN NOT NULL,
            status VARCHAR(20) NOT NULL,
            external VARCHAR(128),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    `;


    const createBookTable = `
        CREATE TABLE IF NOT EXISTS books (
            id TEXT PRIMARY KEY -- google id of book
        );
    `;


    const createBooklistTable = `
        CREATE TABLE IF NOT EXISTS booklists (
            id SERIAL PRIMARY KEY,
            list_name VARCHAR(100) NOT NULL,
            is_public BOOLEAN DEFAULT FALSE,
            created_by_id INT REFERENCES users(id) ON DELETE CASCADE,
            created_by_username VARCHAR(50) NOT NULL,
            description TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

    const createBooklistBooksTable = `
        CREATE TABLE IF NOT EXISTS booklists_books (
            booklist_id INT REFERENCES booklists(id) ON DELETE CASCADE,
            book_id TEXT REFERENCES books(id) ON DELETE CASCADE,
            added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (booklist_id, book_id)
        );
    `;

    const createBooklistReviewsTable = `
        CREATE TABLE IF NOT EXISTS booklists_reviews (
            id SERIAL PRIMARY KEY,
            booklist_id INT REFERENCES booklists(id) ON DELETE CASCADE,
            user_id INT REFERENCES users(id) ON DELETE CASCADE,
            added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            content TEXT,
            stars INT NOT NULL,
            hidden BOOLEAN NOT NULL,
            username VARCHAR(100) NOT NULL
        );
    `;


    const createCartTable = `
        CREATE TABLE IF NOT EXISTS carts (
            user_id INT REFERENCES users(id) ON DELETE CASCADE,
            book_id TEXT REFERENCES books(id) ON DELETE CASCADE,
            quantity INT NOT NULL,
            added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (user_id, book_id)
        );
    `;

    const createOrderTable = `
        CREATE TABLE IF NOT EXISTS orders (
            id SERIAL PRIMARY KEY,
            user_id INT REFERENCES users(id) ON DELETE CASCADE,
            price FLOAT NOT NULL,
            first_name VARCHAR(100),
            last_name VARCHAR(100),
            email VARCHAR(100),
            phone VARCHAR(50),
            address VARCHAR(200),
            country VARCHAR(100),
            province VARCHAR(100),
            city VARCHAR(100),
            postal_code VARCHAR(20),
            added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

    const createOrderItemsTable = `
        CREATE TABLE IF NOT EXISTS order_items (
            order_id INT REFERENCES orders(id) ON DELETE CASCADE,
            book_id TEXT REFERENCES books(id) ON DELETE CASCADE,
            quantity INT NOT NULL,
            unit_price FLOAT NOT NULL,
            PRIMARY KEY (order_id, book_id)
        );
    `;


    try {
        await pool.query(createUserTable);
        await pool.query(createBookTable);
        await pool.query(createBooklistTable);
        await pool.query(createBooklistBooksTable);
        await pool.query(createBooklistReviewsTable);
        await pool.query(createCartTable);
        await pool.query(createOrderTable);
        await pool.query(createOrderItemsTable);
        console.log("Tables created successfully.");
    } catch (error) {
        console.error("Error creating tables", error);
    }
};


const resetDbTables = async () => {
    const dropTablesQueries = `
        DROP TABLE IF EXISTS order_items;
        DROP TABLE IF EXISTS orders;
        DROP TABLE IF EXISTS carts;
        DROP TABLE IF EXISTS booklists_reviews;
        DROP TABLE IF EXISTS booklists_books;
        DROP TABLE IF EXISTS booklists;
        DROP TABLE IF EXISTS books;
        DROP TABLE IF EXISTS users;
    `;

    try {
        await pool.query(dropTablesQueries);
        console.log("All tables dropped successfully.");
    } catch (error) {
        console.error("Error dropping tables", error);
    }
};



const fillDbWithTestData = async () => {
    try {
        // Insert data into the 'users' table
        const password1 = await bcrypt.hash('password', 10);
        const password2 = await bcrypt.hash('password', 10);
        const password3 = await bcrypt.hash('password', 10);
        const password4 = await bcrypt.hash('password', 10);
        const insertUsers = `
            INSERT INTO users (name, username, email, password, active, status)
            VALUES 
                ('Warren Howard', 'admin', 'user1@example.com', '${password1}', true, 'admin'),
                ('Stewart Gray', 'manager', 'user2@example.com', '${password2}', true, 'manager'),
                ('Olivia Johnston', 'active_user', 'user3@example.com', '${password3}', true, 'user'),
                ('William Bell', 'deactivated_user', 'user4@example.com', '${password4}', false, 'user');
        `;
        await pool.query(insertUsers);

        // Insert data into the 'books' table
        const insertBooks = `
            INSERT INTO books (id)
            VALUES 
                ('Yz8Fnw0PlEQC'),
                ('vtMyAQAAMAAJ'),
                ('A29JAAAAMAAJ'),
                ('ve0BAAAAQAAJ'),
                ('kMdaAAAAMAAJ'),
                ('fFIXAAAAYAAJ'),
                ('dyQ7AAAAYAAJ'),
                ('9C8DAAAAYAAJ'),
                ('8REWAAAAYAAJ'),
                ('RlwjNqpa9i0C'),
                ('f280CwAAQBAJ'); 
        `;
        await pool.query(insertBooks);

        // Insert data into the 'booklists' table
        const insertBooklists = `
            INSERT INTO booklists (list_name, is_public, created_by_id, created_by_username, description)
            VALUES 
                ('private list', false, 3, 'active_user', 'this is a description of my booklist'),
                ('public list 1', true, 3, 'active_user', 'this is a description of my booklist'),
                ('public list 2', true, 3, 'active_user', 'this is a description of my booklist'),
                ('public list 3', true, 2, 'manager', 'this is a description of my booklist'),
                ('private list 2', false, 2, 'manager', 'this is a description of my booklist');
        `;
        await pool.query(insertBooklists);

        // Insert data into the 'booklists_books' table
        const insertBooklistBooks = `
            INSERT INTO booklists_books (booklist_id, book_id)
            VALUES 
                (1, 'Yz8Fnw0PlEQC'),
                (1, 'vtMyAQAAMAAJ'),
                (1, 'A29JAAAAMAAJ'),
                (1, 'fFIXAAAAYAAJ'),

                (2, 'f280CwAAQBAJ'),
                (2, 'dyQ7AAAAYAAJ'),
                (2, 've0BAAAAQAAJ'),
                (2, '9C8DAAAAYAAJ'),

                (3, 'f280CwAAQBAJ'),
                (3, 'kMdaAAAAMAAJ'),
                (3, '8REWAAAAYAAJ'),
                (3, 'RlwjNqpa9i0C'),

                (4, 've0BAAAAQAAJ'),
                (4, 'dyQ7AAAAYAAJ');
        `;
        await pool.query(insertBooklistBooks);

        // Insert data into the 'booklists_reviews' table
        const insertBooklistReviews = `
            INSERT INTO booklists_reviews (booklist_id, user_id, content, stars, hidden, username)
            VALUES 
                (2, 2, 'Cool list', 5, false, 'manager'),
                (2, 3, 'i like this', 3, true, 'active_user'),

                (3, 4, 'Great booklist!', 5, false, 'deactivated_user'),

                (4, 3, 'i hate this list', 1, false, 'active_user');
        `;
        await pool.query(insertBooklistReviews);

        // Insert data into the 'carts' table
        const insertCarts = `
            INSERT INTO carts (user_id, book_id, quantity)
            VALUES 
                (3, 'Yz8Fnw0PlEQC', 1),
                (3, 'vtMyAQAAMAAJ', 2),
                (3, 'A29JAAAAMAAJ', 1),
                (3, 'fFIXAAAAYAAJ', 4),
                (3, 'f280CwAAQBAJ', 1),


                (2, 'kMdaAAAAMAAJ', 2),
                (2, 'f280CwAAQBAJ', 5),
                (2, 'A29JAAAAMAAJ', 7);
        `;
        await pool.query(insertCarts);

        // Insert data into the 'orders' table
        const insertOrders = `
            INSERT INTO orders (user_id, price, first_name, last_name, email, phone, address, country, province, city, postal_code)
            VALUES 
                (2, 19.99, 'John', 'Doe', 'john@example.com', '1234567890', '123 Main St', 'Country1', 'Province1', 'City1', 'A1A1A1'),
                (3, 29.99, 'Jane', 'Doe', 'jane@example.com', '0987654321', '456 Main St', 'Country2', 'Province2', 'City2', 'B2B2B2');
        `;
        await pool.query(insertOrders);

        // Insert data into the 'order_items' table
        const insertOrderItems = `
            INSERT INTO order_items (order_id, book_id, quantity, unit_price)
            VALUES 
                (1, 'RlwjNqpa9i0C', 1, 19.99),
                (2, 'dyQ7AAAAYAAJ', 1, 29.99);
        `;
        await pool.query(insertOrderItems);

        console.log("Data inserted successfully.");
    } catch (error) {
        console.error("Error inserting data", error);
    }
};



module.exports = { initDB, resetDbTables, fillDbWithTestData };

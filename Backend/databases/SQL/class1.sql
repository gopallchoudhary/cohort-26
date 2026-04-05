CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    email VARCHAR(322) NOT NULL UNIQUE,
    age INT CHECK(age > 12)
)

INSERT INTO users(name, email, age)
VALUES
('Omesh', 'omesh2@gmail.com', 25),
('Arpit', 'arpit2@gmail.com', 27),
('Soni', 'soni2@gmail.com', 29),
('Suraj', 'suraj2@gmail.com', 32)


SELECT * FROM users
WHERE age > 25 AND id > 4


CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    balance INT NOT NULL
)

INSERT INTO transactions (name, balance) 
VALUES 
('Hitesh', 5000),
('Subham', 5000)


SELECT * FROM transactions WHERE name = 'Hitesh'

UPDATE transactions SET balance = balance - 500 WHERE name = 'Hitesh'
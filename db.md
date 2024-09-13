# Database Schema

## 1. Students Table

| Column Name   | Data Type     | Description                              |
|---------------|---------------|------------------------------------------|
| id            | INT (PK)      | Unique student ID                       |
| name          | VARCHAR(100)  | Student's full name                      |
| email         | VARCHAR(255)  | Student's email address                 |
| password_hash | VARCHAR(255)  | Hashed password for login               |
| created_at    | TIMESTAMP     | Account creation timestamp              |
| updated_at    | TIMESTAMP     | Last account update timestamp           |

## 2. Halls Table

| Column Name   | Data Type     | Description                              |
|---------------|---------------|------------------------------------------|
| id            | INT (PK)      | Unique hall ID                           |
| name          | VARCHAR(100)  | Name of the hall                         |

## 3. Single_Tokens Table

| Column Name   | Data Type     | Description                                  |
|---------------|---------------|----------------------------------------------|
| id            | INT (PK)      | Unique token ID                              |
| student_id    | INT (FK)      | Foreign key to `Students.id` (token seller)  |
| hall_id       | INT (FK)      | Foreign key to `Halls.id`                    |
| token_date    | DATE          | Date for the token's availability            |
| meal_type     | ENUM('lunch', 'dinner') | Meal type (lunch or dinner)           |
| price         | DECIMAL       | Price per token (in cash)                    |
| status        | ENUM('available', 'requested', 'booked', 'expired') | Token status              |
| requested_by  | INT (FK)      | Foreign key to `Students.id` (buyer, nullable) |
| expires_at    | TIMESTAMP     | Expiration date/time of the token            |
| created_at    | TIMESTAMP     | Timestamp when the token was listed          |

## 4. Multiple_Tokens Table

| Column Name     | Data Type     | Description                                  |
|-----------------|---------------|----------------------------------------------|
| id              | INT (PK)      | Unique token ID                              |
| student_id      | INT (FK)      | Foreign key to `Students.id` (token seller)  |
| hall_id         | INT (FK)      | Foreign key to `Halls.id`                    |
| start_date      | DATE          | Start date for token availability            |
| start_meal_type | ENUM('lunch', 'dinner') | Meal type for the start date            |
| end_date        | DATE          | End date for token availability              |
| end_meal_type   | ENUM('lunch', 'dinner') | Meal type for the end date              |
| token_count     | INT           | Total number of tokens available            |
| price           | DECIMAL       | Price per token (in cash)                    |
| status          | ENUM('available', 'requested', 'booked', 'expired') | Token status              |
| requested_by    | INT (FK)      | Foreign key to `Students.id` (buyer, nullable) |
| expires_at      | TIMESTAMP     | Expiration date/time of the token            |
| created_at      | TIMESTAMP     | Timestamp when the token was listed          |

## 5. Requests Table

| Column Name  | Data Type     | Description                                  |
|--------------|---------------|----------------------------------------------|
| id           | INT (PK)      | Unique request ID                           |
| token_id     | INT (FK)      | Foreign key to `Single_Tokens.id` or `Multiple_Tokens.id` |
| buyer_id     | INT (FK)      | Foreign key to `Students.id` (requesting student) |
| quantity     | INT           | Number of tokens requested                  |
| status       | ENUM('pending', 'confirmed', 'rejected') | Request status                      |
| created_at   | TIMESTAMP     | Timestamp when the request was created       |

## 6. Transactions Table

| Column Name  | Data Type     | Description                                  |
|--------------|---------------|----------------------------------------------|
| id           | INT (PK)      | Unique transaction ID                       |
| token_id     | INT (FK)      | Foreign key to `Single_Tokens.id` or `Multiple_Tokens.id` |
| buyer_id     | INT (FK)      | Foreign key to `Students.id` (buyer)         |
| seller_id    | INT (FK)      | Foreign key to `Students.id` (seller)        |
| quantity     | INT           | Number of tokens transacted                 |
| total_price  | DECIMAL       | Total price for the transaction (in cash)    |
| created_at   | TIMESTAMP     | Timestamp when the transaction was created   |

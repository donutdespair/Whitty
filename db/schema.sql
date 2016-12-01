DROP TABLE IF EXISTS users;

CREATE TABLE users (
user_handle VARCHAR(25) PRIMARY KEY
);


DROP TABLE IF EXISTS poems;

CREATE TABLE poems (
  poem_id SERIAL PRIMARY KEY,
  poem_title VARCHAR(255),
  poem_text TEXT,
  handle VARCHAR(25) REFERENCES users(user_handle),
  note_text TEXT
);


-- psql -d whitman_db -f schema.sql

DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  user_handle VARCHAR(25) UNIQUE,
  password_digest VARCHAR(255)
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
--SELECT * FROM poems LEFT OUTER JOIN users ON (poems.handle=users.user_handle);



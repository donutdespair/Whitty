DROP TABLE IF EXISTS poems;

CREATE TABLE poems (
  poem_id SERIAL PRIMARY KEY,
  poem_title VARCHAR(255),
  poem_text TEXT,
  handle VARCHAR(255)
  note_text TEXT
);

DROP TABLE IF EXISTS responses;

CREATE TABLE responses (
  response_id SERIAL PRIMARY KEY,
  response_title TEXT,
  response_text TEXT,
  response_handle VARCHAR(255),
  original_responder_id INTEGER REFERENCES poems(poem_id)
);

DROP TABLE IF EXISTS original_poems;
CREATE TABLE original_poems (
  original_poem_id SERIAL PRIMARY KEY,
  original_poem_title VARCHAR(255),
  original_poem_text TEXT,
  author_handle VARCHAR(255)
);

DROP TABLE IF EXISTS critiques;
CREATE TABLE critiques (
  critique_id SERIAL PRIMARY KEY,
  critique_text TEXT,
  critic_handle VARCHAR(255),
  author_id INTEGER REFERENCES original_poems(original_poem_id)
);


-- psql -d whitman_db -f schema.sql

--INSERT INTO poems (poem_title,poem_text,handle,note_text) VALUES ('gods','MOAR TEXT AGAIN','carson','somenotes');
--INSERT INTO poems (poem_title,poem_text,handle,note_text) VALUES ('song of myseld','MOAR TEXT','jeff','notes');
--INSERT INTO responses (response_title,response_text, response_handle) VALUES ('gods','this response','jeff');
--INSERT INTO responses (response_title,response_text, response_handle) VALUES ('song of myself','this response','carson');
--INSERT INTO original_poems (original_poem_title,original_poem_text,author_handle) VALUES ('i am a poem','MOAR poem AGAIN','not carson');
--INSERT INTO original_poems (original_poem_title,original_poem_text,author_handle) VALUES ('cats','MOAR PEOM','cat');
--INSERT INTO critiques (critique_text, critic_handle) VALUES ('this response','jeff');
--INSERT INTO critiques (critique_text, critic_handle) VALUES ('this response','carson');
--SELECT poem_id, poem_title, poem_text, handle, note_text, responses.response_text, responses.response_handle FROM poems LEFT OUTER JOIN responses ON (responses.response_title=poems.poem_title);

--SELECT poem_id, responses.response_id, poem_title, poem_text, handle, note_text, responses.response_text, responses.response_handle FROM poems LEFT OUTER JOIN responses ON (poems.poem_id=responses.response_id);

--ALTER TABLE responses RENAME COLUMN id TO response_id;

--SELECT original_poem_id, original_poem_title, original_poem_text, author_handle, critiques.critique_text, critiques.critic_handle FROM original_poems LEFT OUTER JOIN critiques ON (original_poems.original_poem_id=critiques.critique_id);

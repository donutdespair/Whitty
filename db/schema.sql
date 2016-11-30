DROP TABLE IF EXISTS poems;

CREATE TABLE poems (
  poem_id SERIAL PRIMARY KEY,
  poem_title VARCHAR(255),
  poem_text TEXT,
  handle VARCHAR(255),
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

-- psql -d whitman_db -f schema.sql

INSERT INTO poems (poem_title,poem_text,handle,note_text) VALUES ('gods','MOAR TEXT AGAIN','carson','somenotes');
INSERT INTO poems (poem_title,poem_text,handle,note_text) VALUES ('song of myseld','MOAR TEXT','jeff','notes');
INSERT INTO responses (response_title,response_text, response_handle) VALUES ('gods','this response','jeff');
INSERT INTO responses (response_title,response_text, response_handle) VALUES ('song of myself','this response','carson');
--SELECT poem_id, poem_title, poem_text, handle, note_text, responses.response_text, responses.response_handle FROM poems LEFT OUTER JOIN responses ON (responses.response_title=poems.poem_title);

--SELECT poem_id, responses.response_id, poem_title, poem_text, handle, note_text, responses.response_text, responses.response_handle FROM poems LEFT OUTER JOIN responses ON (poems.poem_id=responses.response_id);

--ALTER TABLE responses RENAME COLUMN id TO response_id;

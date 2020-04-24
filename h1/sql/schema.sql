CREATE TABLE users (
  id          SERIAL PRIMARY KEY,
  username    VARCHAR(256) NOT NULL UNIQUE,
  email       VARCHAR(256) NOT NULL UNIQUE,
  password    VARCHAR(128) NOT NULL,
  admin       BOOLEAN DEFAULT false,
  created     TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
  updated     TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp
);
CREATE TABLE notebooks (
  id          SERIAL PRIMARY KEY,
  title       VARCHAR(256) NOT NULL,
  created     TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
  updated     TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
  user_id     INTEGER REFERENCES users(id) NOT NULL,
  UNIQUE(user_id, title)
);
CREATE TABLE sections (
  id          SERIAL PRIMARY KEY,
  title       VARCHAR(256) NOT NULL,
  created     TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
  updated     TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
  user_id     INTEGER REFERENCES users(id) NOT NULL,
  notebook_id INTEGER REFERENCES notebooks(id) NOT NULL,
  UNIQUE(notebook_id, title)
);
CREATE TABLE pages (
  id          SERIAL PRIMARY KEY,
  title       VARCHAR(256) NOT NULL,
  body        TEXT NOT NULL,  -- TODO: BYTEA instead of TEXT?
  created     TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
  updated     TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
  user_id     INTEGER REFERENCES users(id) NOT NULL,
  notebook_id INTEGER REFERENCES notebooks(id) NOT NULL,
  section_id  INTEGER REFERENCES sections(id) NOT NULL,
  UNIQUE(section_id, title)
);
-- TODO: Images
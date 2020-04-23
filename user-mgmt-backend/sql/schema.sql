CREATE TABLE users (
  id          SERIAL PRIMARY KEY,
  username    VARCHAR(256) NOT NULL UNIQUE,
  email       VARCHAR(256) NOT NULL UNIQUE,
  password    VARCHAR(128) NOT NULL,
  admin       BOOLEAN DEFAULT false,
  created     TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
  updated     TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp
);


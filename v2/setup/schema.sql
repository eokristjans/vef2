CREATE TABLE application (
  id serial primary key,
  nafn varchar(64) not null,
  netfang varchar(64) not null,
  simi int not null,
  kynning varchar(1000) not null,
  starf varchar(20) not null,
  created timestamp with time zone not null default current_timestamp,
  updated timestamp with time zone not null default current_timestamp,
  processed boolean NOT NULL DEFAULT false
);

CREATE TABLE appuser (
  id serial primary key,
  nafn varchar(64) not null,
  netfang varchar(64) not null,
  username varchar(64) not null unique,
  password varchar(64) not null,
  admin boolean NOT NULL DEFAULT false,
  created timestamp with time zone not null default current_timestamp,
  updated timestamp with time zone not null default current_timestamp
);


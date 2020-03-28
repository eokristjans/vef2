CREATE TABLE todo (
  id serial primary key,
  title varchar(128) not null,
  position int not null default 0,
  completed boolean not null DEFAULT false,
  due timestamp with time zone,
  created timestamp with time zone not null default current_timestamp,
  updated timestamp with time zone not null default current_timestamp
);

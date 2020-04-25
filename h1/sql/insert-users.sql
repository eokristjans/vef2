-- Insert default users
INSERT INTO 
  users 
    (username, email, password, admin) 
  VALUES
    ( 'matthias'
    , 'book@hi.is'
    , '$2a$12$jJkmyl9xPtV3nGqJJ9YbgejfbyU8dlQNeRWbIgQOb6RxmFTLE8XXe'
    , true
    );

INSERT INTO
  users
    (username, email, password, admin)
  VALUES
    ( 'kristjan'
    , 'kth130@hi.is'
    , '$2a$12$KJpUbfbVCDaWzgNoSgHiJOQ.4VTbDAD6wGT2.N64S.mR9z32CObJS'
    , false
    );
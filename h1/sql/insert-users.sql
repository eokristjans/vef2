-- Insert default users
INSERT INTO 
  users 
    (username, email, password, admin) 
  VALUES
    ( 'admin'
    , 'admin@example.org'
    , '$2b$11$S/0nSIFH6oLalwYB/6XW4u9IIP.IN5oug/K3b.ZF7F4NL1cWyw8R6'
    , true
    );

INSERT INTO
  users
    (username, email, password, admin)
  VALUES
    ( 'erling'
    , 'eok4@hi.is'
    , '$2b$11$pzXL.B8mMVOEAaGrtNa.KObIhJnpC6VBYsbNzF6F93TIUE/J2WLJ2'
    , false
    );
INSERT INTO 
  notebooks
    (user_id, title)
  VALUES
    (2, 'Háskóli Íslands - 2020');

INSERT INTO
  sections
    (user_id, notebook_id, title)
  VALUES
    (2, 1, 'Vefforritun 2');

INSERT INTO
  sections
    (user_id, notebook_id, title)
  VALUES
    (2, 1, 'Hugbúnaðarverkefni 2');

INSERT INTO
  pages
    (user_id, notebook_id, section_id, title, body)
  VALUES
    (2, 1, 1, 'OWASP', '# OWASP \n\n... TODO: figure out how to make new lines and add content.');
INSERT INTO
  pages
    (user_id, notebook_id, section_id, title, body)
  VALUES
    (2, 1, 1, 'React', '# React \n\n... TODO: figure out how to make new lines and add content.');
INSERT INTO
  pages
    (user_id, notebook_id, section_id, title, body)
  VALUES
    (2, 1, 2, 'Android Control Flow', '# Android Control Flow \n\n... TODO: figure out how to make new lines and add content.');
INSERT INTO
  pages
    (user_id, notebook_id, section_id, title, body)
  VALUES
    (2, 1, 2, 'Software Architecture', '# Software Architecture \n\n... TODO: figure out how to make new lines and add content.');

INSERT INTO 
  images
    (user_id, title, url)
  VALUES
    (2, 'Headphones', 'https://res.cloudinary.com/dixpjcgtc/image/upload/v1586294995/sae7ffotdajhfmy9cis7.jpg');
INSERT INTO 
  images
    (user_id, title, url)
  VALUES
    (2, 'Bread', 'https://res.cloudinary.com/dixpjcgtc/image/upload/v1586294996/mpmlyj8t2grfgbwp8cle.jpg');
INSERT INTO 
  images
    (user_id, title, url)
  VALUES
    (2, 'Camera', 'https://res.cloudinary.com/dixpjcgtc/image/upload/v1586294997/uqgzham4rusfnitmludh.jpg');
INSERT INTO 
  images
    (user_id, title, url)
  VALUES
    (2, 'Hairdryer', 'https://res.cloudinary.com/dixpjcgtc/image/upload/v1586294998/yuyy9xkxwihfo84laez3.jpg');
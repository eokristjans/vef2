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
  pages
    (user_id, notebook_id, section_id, title, body)
  VALUES
    (2, 1, 1, 'OWASP', '# OWASP ... TODO: figure out how to make new lines and add content.');

INSERT INTO
  pages
    (user_id, notebook_id, section_id, title, body)
  VALUES
    (2, 1, 1, 'React', '# React ... TODO: figure out how to make new lines and add content.');

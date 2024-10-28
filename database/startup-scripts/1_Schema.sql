CREATE TABLE categories (
  id int PRIMARY KEY,
  name varchar(100) NOT NULL UNIQUE,
  color varchar(7) NOT NULL,
  symbol varchar(2000) NOT NULL
);

CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  name varchar(100) NOT NULL UNIQUE
);

CREATE TABLE lists (
  id SERIAL PRIMARY KEY
);

CREATE TABLE quantifiable_items (
  id SERIAL PRIMARY KEY,
  list_id int NOT NULL,
  name varchar(100) NOT NULL,
  value varchar(20) NOT NULL,
  unit varchar(10),
  checked boolean NOT NULL,
  CONSTRAINT fk_list FOREIGN KEY (list_id) REFERENCES lists (id) ON DELETE CASCADE
);

CREATE TABLE shopping_lists (
  id SERIAL PRIMARY KEY,
  name varchar(100) NOT NULL,
  creationDate timestamp NOT NULL,
  updateDate timestamp NOT NULL
);

CREATE TABLE recipes (
  id SERIAL PRIMARY KEY,
  category_id int NOT NULL,
  list_id int NOT NULL,
  name varchar(100) NOT NULL,
  description text NOT NULL,
  image_src varchar(2048),
  creationDate timestamp NOT NULL,
  updateDate timestamp NOT NULL,
  CONSTRAINT fk_category FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE CASCADE,
  CONSTRAINT fk_list FOREIGN KEY (list_id) REFERENCES lists (id) ON DELETE CASCADE
);

CREATE INDEX recipes_name_id
  ON recipes(name, id);

CREATE TABLE shopping_sublists (
  id SERIAL PRIMARY KEY,
  shopping_list_id int NOT NULL,
  list_id int NOT NULL,
  recipe_id int,
  count numeric(2, 1) NOT NULL,
  CONSTRAINT fk_list FOREIGN KEY (list_id) REFERENCES lists (id) ON DELETE CASCADE,
  CONSTRAINT fk_shopping_list FOREIGN KEY (shopping_list_id) REFERENCES shopping_lists (id) ON DELETE CASCADE,
  CONSTRAINT fk_recipe FOREIGN KEY (recipe_id) REFERENCES recipes (id) ON DELETE CASCADE
);

CREATE TABLE recipes_tags (
  recipe_id int,
  tag_id int,
  PRIMARY KEY (recipe_id, tag_id),
  CONSTRAINT fk_recipe FOREIGN KEY (recipe_id) REFERENCES recipes (id) ON DELETE CASCADE,
  CONSTRAINT fk_tag FOREIGN KEY (tag_id) REFERENCES tags (id) ON DELETE CASCADE
);
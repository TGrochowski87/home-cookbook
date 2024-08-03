CREATE TABLE categories (
  id int NOT NULL,
  name varchar(100) NOT NULL,
  color varchar(7) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE tags (
  id int NOT NULL,
  name varchar(100) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE lists (
  id int NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE quantifiable_items (
  id int NOT NULL,
  list_id int,
  name varchar(100) NOT NULL,
  value varchar(20) NOT NULL,
  unit varchar(10),
  checked boolean NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_list FOREIGN KEY (list_id) REFERENCES lists (id) ON DELETE CASCADE
);

CREATE TABLE shopping_lists (
  id int NOT NULL,
  name varchar(100) NOT NULL,
  creationDate timestamp NOT NULL,
  updateDate timestamp NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE sublists (
  id int NOT NULL,
  shopping_list_id int,
  list_id int,
  name varchar(100),
  recipe_id int,
  count int NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_list FOREIGN KEY (list_id) REFERENCES lists (id) ON DELETE CASCADE,
  CONSTRAINT fk_shopping_list FOREIGN KEY (shopping_list_id) REFERENCES shopping_lists (id) ON DELETE CASCADE
);

CREATE TABLE recipes (
  id int NOT NULL,
  category_id int,
  list_id int,
  name varchar(100) NOT NULL,
  description text,
  image_src varchar(2048),
  PRIMARY KEY (id),
  CONSTRAINT fk_category FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE CASCADE,
  CONSTRAINT fk_list FOREIGN KEY (list_id) REFERENCES lists (id) ON DELETE CASCADE
);

CREATE TABLE recipes_tags (
  id int NOT NULL,
  recipe_id int,
  tag_id int,
  PRIMARY KEY (id),
  CONSTRAINT fk_recipe FOREIGN KEY (recipe_id) REFERENCES recipes (id) ON DELETE CASCADE,
  CONSTRAINT fk_tag FOREIGN KEY (tag_id) REFERENCES tags (id) ON DELETE CASCADE
);
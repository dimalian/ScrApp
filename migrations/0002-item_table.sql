-- rambler up

CREATE TABLE item (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TRIGGER tr_item_updated_at
  BEFORE UPDATE ON item
  FOR EACH ROW
  EXECUTE PROCEDURE set_updated_at_column();

-- rambler down

DROP TABLE item;

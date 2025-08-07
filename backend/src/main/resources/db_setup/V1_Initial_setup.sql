CREATE TABLE customer (
                          id BIGSERIAL PRIMARY KEY,
                          name TEXT NOT NULL,
                          email TEXT NOT NULL,
                          password TEXT NOT NULL,
                          gender TEXT NOT NULL,
                          age INT NOT NULL,
                          profile_image_id VARCHAR(36) UNIQUE
);

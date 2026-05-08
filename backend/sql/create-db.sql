DROP TABLE IF EXISTS users;
DROP TYPE IF EXISTS user_role;
CREATE TYPE user_role AS ENUM ('admin', 'talent', 'company');
CREATE TABLE users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    hashed_password TEXT NOT NULL,
    role user_role NOT NULL 
);
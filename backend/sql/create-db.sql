DROP TABLE IF exists cherry_picks;
DROP TABLE IF EXISTS talent_profiles;
DROP TABLE IF EXISTS company_profiles;
DROP TABLE IF EXISTS users;
DROP TYPE IF EXISTS user_role;

CREATE TYPE user_role AS ENUM ('admin', 'talent', 'company');

CREATE TABLE users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    hashed_password TEXT NOT NULL,
    role user_role NOT NULL
);

CREATE TABLE cherry_picks (
    user_id uuid NOT NULL REFERENCES users(id),
    pick_id uuid NOT NULL REFERENCES users(id),
    PRIMARY KEY (user_id, pick_id)
);

CREATE TABLE talent_profiles (
    user_id uuid PRIMARY KEY REFERENCES users(id),
    profile_data JSONB NOT NULL
);

CREATE TABLE company_profiles (
    user_id uuid PRIMARY KEY REFERENCES users(id),
    profile_data JSONB NOT NULL
);

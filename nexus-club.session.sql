-- @block
-- Create table for admin roles first
CREATE TABLE IF NOT EXISTS admin_roles (
    id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT
);

-- @block
-- Create table for admin credentials with role_id foreign key
CREATE TABLE IF NOT EXISTS admin_credits (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    prenom VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, -- Will store bcrypt hash, not plaintext
    telephone VARCHAR(20) NOT NULL,
    role_id INTEGER REFERENCES admin_roles(id)
);

-- @block
-- Create events table
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    date TIMESTAMP NOT NULL,
    location VARCHAR(255),
    image_url VARCHAR(255),
    video_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- @block
-- Create members table
CREATE TABLE members (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL,
    profile_picture_url VARCHAR(255),
    phone VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- @block
-- Remove members table (for dev/reset purposes)
DROP TABLE IF EXISTS members;
DROP TABLE IF EXISTS admin_credits;
DROP TABLE IF EXISTS admin_roles;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS projects;
drop table if exists announcements;

-- @block
-- Create projects table
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50),
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- @block
-- Insert admin roles
INSERT INTO admin_roles (role_name, description) VALUES
('president', 'President of the club'),
('VP', 'Vice president'),
('SG', 'Genaral Secretary');

-- @block
-- Correct typo: "UPDATE" was duplicated
UPDATE admin_roles
SET description = 'General secretary'
WHERE role_name = 'SG';

-- @block
-- View admin and their roles
SELECT ac.nom, ar.role_name FROM admin_credits ac
JOIN admin_roles ar ON ac.role_id = ar.id;

-- @block
-- Add support for multiple images per event
ALTER TABLE events ADD COLUMN image_urls TEXT[];

-- @block
ALTER TABLE projects ADD COLUMN site_url VARCHAR(255);

-- @block
-- i wanna see the name the role and the paswword of the admins
SELECT ac.nom, ar.role_name, ac.password FROM admin_credits ac
JOIN admin_roles ar ON ac.role_id = ar.id;


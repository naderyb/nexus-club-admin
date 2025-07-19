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
    password VARCHAR(255) NOT NULL,
    telephone VARCHAR(20) NOT NULL,
    role_id INTEGER REFERENCES admin_roles(id)
);

-- @block
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    date TIMESTAMP NOT NULL,
    location VARCHAR(255),
    image_url VARCHAR(255),  -- URL of the event image 
    video_url VARCHAR(255),  -- URL of the event video 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- @block
CREATE TABLE members (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL, -- e.g., "president", "member", etc.
    profile_picture_url VARCHAR(255),  -- URL of the member's profile picture
    phone VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- @block
DROP TABLE IF EXISTS members; -- Drop the table if it exists

-- @block
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50), 
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    image_url VARCHAR(255),  -- URL of the project image 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- @block
-- Insert roles
INSERT INTO admin_roles (role_name, description) VALUES
('president', 'President of the club'),
('VP', 'Vice president'),
('SG', 'Genaral Secretary');

-- @block
-- Insert admins with matching role_id
INSERT INTO admin_credits (nom, prenom, email, password, telephone, role_id) VALUES
('youb', 'mahmoud nader', 'youb.nader@gmail.com', '123456789', '+213 540 58 89 87', 1),
('boutaoui', 'selena', 'selenaboutaoui30@gmail.com', '12456789', '+213 669 02 37 13', 3),
('tabbi', 'mohamed kamel seif eddine', 'tabbiseif@gmail.com', '123456789', '+213 552 16 89 54', 2);

-- @block
ALTER table members add column phone varchar(20) not null; 
-- @block
INSERT INTO members (nom, phone, email, role) VALUES
('Youb Nader', '+213540588987', 'youb.nader@gmail.com', 'president'),
('Tabbi mohamed kamel seif eddin', '+213552168954', 'tabbiseif@gmail.com', 'vp'),
('Ouchaou Sara amylia', '+213561467647', 'ouchaousarah5@gmail.com', 'responsable com');
-- @block
-- Create the announcements table
CREATE TABLE IF NOT EXISTS announcements (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add index for better performance on queries (optional)
CREATE INDEX IF NOT EXISTS idx_announcements_created_at ON announcements (created_at);

-- @block
UPDATE admin_roles
UPDATE SET description = 'General secretary' WHERE role_name = 'SG';
-- @block
--show the data in the tables
SELECT ac.nom, ar.role_name FROM admin_credits ac
JOIN admin_roles ar ON ac.role_id = ar.id;

-- @block
ALTER TABLE events ADD COLUMN image_urls TEXT[];

-- @block
ALTER TABLE projects ADD COLUMN site_url VARCHAR(255); 

-- @block 
SELECT * FROM members;

-- @block
-- for verification purpose im going to delete from project where id = 1
DELETE FROM projects WHERE id = 4 RETURNING *; --

--how do i delete rows from a table in postgresql
-- @block
DELETE FROM members WHERE id = 6 RETURNING *; -- This will delete the row with id = 1 and return the deleted row

-- @block
-- change phone number 
UPDATE members
SET phone = '+213540588987' 
WHERE nom = 'Youb Nader'
RETURNING *; -- This will update the phone number for the member with the specified name and return the updated row
-- @block
INSERT INTO members (nom, phone, email, role) VALUES
('Tabbi mohamed kamel seif addine', '+213552168954', 'tabbiseif@gmail.com','vp'),
('Ouchaou Sara amylia', '+213561467647', 'ouchaousara5@gmail.com','responsable com');


-- @block
SELECT * from events;
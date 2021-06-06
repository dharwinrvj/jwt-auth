/*
database for express-auth-mysql
*/
--
-- database - nodelogin
--
CREATE DATABASE IF NOT EXISTS nodelogin;
USE nodelogin;
--
-- table for users
--
CREATE TABLE IF NOT EXISTS `users` (
	id int(11) NOT NULL AUTO_INCREMENT,
    name varchar(50) NOT NULL,
	email varchar(50) NOT NULL,
	password varchar(100) NOT NULL,
	CONSTRAINT PK_user_id PRIMARY KEY(id),
	CONSTRAINT UK_user_email UNIQUE(email)
);


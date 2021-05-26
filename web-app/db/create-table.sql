CREATE TABLE Users (
    Id                   SERIAL PRIMARY KEY,
	UserName             VARCHAR (40) NOT NULL,
    UserSurname          VARCHAR (40) NOT NULL,
    BirthDay             DATE    	  NOT NULL,
    Email                VARCHAR (60),
    Password         	 VARCHAR (40) NOT NULL,
    PhoneNumber          VARCHAR (11)
);

CREATE TABLE meetings
(
    id 			serial 		NOT NULL PRIMARY KEY,
    status 		boolean 	NOT NULL,
    user_id 	integer 	NOT NULL REFERENCES users (id)
		ON UPDATE CASCADE
        ON DELETE CASCADE,
    meeting_id 	integer 	NOT NULL REFERENCES meetingInform (id)
		ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE timetable
(
    id serial NOT NULL PRIMARY KEY,
    time_from timestamp without time zone NOT NULL,
    time_to timestamp without time zone NOT NULL,
    description character varying(256),
    status character varying(20),
    user_id integer
	REFERENCES users (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE friends
(
    id serial NOT NULL PRIMARY KEY,
    friend_id character varying(128),
    status character varying(20),
    user_id integer
        REFERENCES users (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE meetingInform (
    id       	serial	      NOT NULL PRIMARY KEY,
    time_from	timestamp,
    time_to   	timestamp
);


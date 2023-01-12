-- Statistics for country logins including idp and sp
-- CREATE TABLE IF NOT EXISTS statistics_country (
--     id SERIAL PRIMARY KEY,
--     date DATE NOT NULL,
--     sourceidp character varying(255) NOT NULL,
--     service character varying(255) NOT NULL,
--     countrycode character varying(2) NOT NULL,
-- 	country character varying(255) NOT NULL,
--     count int NOT NULL
-- );

-- CREATE INDEX IF NOT EXISTS statistics_country_i1 ON statistics_country (date);
-- CREATE INDEX IF NOT EXISTS statistics_country_i2 ON statistics_country (sourceidp);
-- CREATE INDEX IF NOT EXISTS statistics_country_i3 ON statistics_country (service);
-- CREATE INDEX IF NOT EXISTS statistics_country_i4 ON statistics_country (countrycode);
-- CREATE INDEX IF NOT EXISTS statistics_country_i5 ON statistics_country (country);
-- CREATE UNIQUE INDEX IF NOT EXISTS idx_statistics_country 
-- ON statistics_country(date, sourceidp, service, countrycode);

-- -- Statistics for country logins including idp,sp and hashed userid
-- CREATE TABLE IF NOT EXISTS statistics_country_hashed (
--     id SERIAL PRIMARY KEY,
--     date DATE NOT NULL,
--     hasheduserid character varying(255) NOT NULL,
--     sourceidp character varying(255) NOT NULL,
--     service character varying(255) NOT NULL,
--     countrycode character varying(2) NOT NULL,
-- 	country character varying(255) NOT NULL,
--     count int NOT NULL
-- );

-- CREATE INDEX IF NOT EXISTS statistics_country_hashed_i1 ON statistics_country_hashed (date);
-- CREATE INDEX IF NOT EXISTS statistics_country_hashed_i2 ON statistics_country_hashed (sourceidp);
-- CREATE INDEX IF NOT EXISTS statistics_country_hashed_i3 ON statistics_country_hashed (service);
-- CREATE INDEX IF NOT EXISTS statistics_country_hashed_i4 ON statistics_country_hashed (countrycode);
-- CREATE INDEX IF NOT EXISTS statistics_country_hashed_i5 ON statistics_country_hashed (country);
-- CREATE INDEX IF NOT EXISTS statistics_country_hashed_i6 ON statistics_country_hashed (hasheduserid);
-- CREATE UNIQUE INDEX IF NOT EXISTS idx_statistics_country_hashed 
-- ON statistics_country_hashed(date, hasheduserid, sourceidp, service, countrycode);

-- -- Statistics for country logins including userid
-- CREATE TABLE IF NOT EXISTS statistics_user_country (
-- id SERIAL PRIMARY KEY,
-- date DATE NOT NULL,
-- userid character varying(255) NOT NULL,
-- countrycode character varying(2) NOT NULL,
-- country character varying(255) NOT NULL,
-- count int NOT NULL
-- );

-- CREATE INDEX IF NOT EXISTS statistics_user_country_i1 ON statistics_user_country (date);
-- CREATE INDEX IF NOT EXISTS statistics_user_country_i2 ON statistics_user_country (userid);
-- CREATE INDEX IF NOT EXISTS statistics_user_country_i3 ON statistics_user_country (countrycode);
-- CREATE INDEX IF NOT EXISTS statistics_user_country_i4 ON statistics_user_country (country);
-- CREATE UNIQUE INDEX IF NOT EXISTS idx_statistics_user_country ON statistics_user_country(date, userid, countrycode);

CREATE TABLE IF NOT EXISTS community_info (
    id SERIAL PRIMARY KEY,
    name character varying(255) NOT NULL,
    description character varying(255) NOT NULL,
    source character varying(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS community (
    community_id INT,
    created DATE NOT NULL,
    PRIMARY KEY(community_id),
    CONSTRAINT fk_community
        FOREIGN KEY(community_id)
            REFERENCES community_info(id)
);


CREATE TABLE IF NOT EXISTS members (
    community_id INT,
    hasheduserid  character varying(1024) NOT NULL,
    status character varying(255) NOT NULL,
    CONSTRAINT fk_community
        FOREIGN KEY(community_id)
            REFERENCES community_info(id)
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_members ON members(community_id,hasheduserid);
CREATE INDEX IF NOT EXISTS community_i1 ON community (created);
CREATE INDEX IF NOT EXISTS community_info_i1 ON community_info (name);
CREATE UNIQUE INDEX IF NOT EXISTS idx_community_info ON community_info(name);

CREATE TABLE IF NOT EXISTS identityprovidersmap (
    id SERIAL PRIMARY KEY,
    entityid character varying(255) NOT NULL,
    name character varying(255) NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_identityprovidersmap ON identityprovidersmap(entityid);

CREATE TABLE IF NOT EXISTS serviceprovidersmap (
    id SERIAL PRIMARY KEY,
    identifier character varying(255) NOT NULL,
    name character varying(255) NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_serviceprovidersmap ON serviceprovidersmap(identifier);

CREATE TABLE IF NOT EXISTS country_codes (
    id SERIAL PRIMARY KEY,
    countrycode character varying(2) NOT NULL,
    country character varying(255) NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_country_codes ON country_codes(countrycode);
CREATE UNIQUE INDEX IF NOT EXISTS idxx_country_codes ON country_codes (country);

CREATE TABLE IF NOT EXISTS users (
    hasheduserid character varying(1024) NOT NULL,
    created DATE NOT NULL,
    status character varying(255) NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_users ON users(hasheduserid);

CREATE TABLE IF NOT EXISTS statistics_country_hashed (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    hasheduserid character varying(1024) NOT NULL,
    sourceidpid INT NOT NULL,
    serviceid INT NOT NULL,
    countryid INT NOT NULL,
    count INT NOT NULL,
    CONSTRAINT fk_idp
        FOREIGN KEY(sourceidpid)
            REFERENCES identityprovidersmap(id),
    CONSTRAINT fk_service
        FOREIGN KEY(serviceid)
            REFERENCES serviceprovidersmap(id),
    CONSTRAINT fk_country
        FOREIGN KEY(countryid)
            REFERENCES country_codes(id)
);

CREATE INDEX IF NOT EXISTS statistics_country_hashed_i1 ON statistics_country_hashed (hasheduserid);
CREATE INDEX IF NOT EXISTS statistics_country_hashed_i2 ON statistics_country_hashed (sourceidpid);
CREATE INDEX IF NOT EXISTS statistics_country_hashed_i3 ON statistics_country_hashed (serviceid);
CREATE INDEX IF NOT EXISTS statistics_country_hashed_i4 ON statistics_country_hashed (countryid);

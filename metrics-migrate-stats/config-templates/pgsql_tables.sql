CREATE TABLE IF NOT EXISTS environment_info (
    id SERIAL PRIMARY KEY,
    name character varying(255) NOT NULL,
    description character varying(255) NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_environment_info ON environment_info(name);

CREATE TABLE IF NOT EXISTS tenant_info (
    id SERIAL PRIMARY KEY,
    name character varying(255) NOT NULL,
    description character varying(255) NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_tenant_info ON tenant_info(name);

CREATE TABLE IF NOT EXISTS tenenv_info (
    id SERIAL PRIMARY KEY,
    name character varying(255) NOT NULL,
    description character varying(255) NOT NULL,
    tenant_id INT,
    CONSTRAINT fk_tenant
        FOREIGN KEY(tenant_id)
            REFERENCES tenant_info(id),
    env_id INT,
    CONSTRAINT fk_environment
        FOREIGN KEY(env_id)
            REFERENCES environment_info(id)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_tenenv_info ON tenenv_info(tenant_id, env_id);

CREATE TABLE IF NOT EXISTS community_info (
    id SERIAL PRIMARY KEY,
    name character varying(255) NOT NULL,
    description character varying(255) NOT NULL,
    source character varying(255) NOT NULL,
    tenenv_id INT,
    CONSTRAINT fk_tenenv
        FOREIGN KEY(tenenv_id)
            REFERENCES tenenv_info(id)

);

-- CREATE INDEX IF NOT EXISTS community_info_i1 ON community_info (name);
CREATE UNIQUE INDEX IF NOT EXISTS idx_community_info ON community_info(name, tenenv_id);

CREATE TABLE IF NOT EXISTS community (
    community_id INT,
    created DATE NOT NULL,
    updated DATE,
    status character varying(255) NOT NULL,
    PRIMARY KEY(community_id),
    CONSTRAINT fk_community
        FOREIGN KEY(community_id)
            REFERENCES community_info(id),
    tenenv_id INT NOT NULL,
    CONSTRAINT fk_tenenv
        FOREIGN KEY(tenenv_id)
            REFERENCES tenenv_info(id)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_community ON community(community_id, tenenv_id);

CREATE INDEX IF NOT EXISTS community_i1 ON community (created);
CREATE INDEX IF NOT EXISTS community_i1 ON community (created, tenenv_id);

CREATE TABLE IF NOT EXISTS members (
    community_id INT,
    hasheduserid  character varying(1024) NOT NULL,
    status character varying(255) NOT NULL,
    created DATE NOT NULL,
    updated DATE,
    CONSTRAINT fk_community
        FOREIGN KEY(community_id)
            REFERENCES community_info(id),
    tenenv_id INT,
    CONSTRAINT fk_tenenv
        FOREIGN KEY(tenenv_id)
            REFERENCES tenenv_info(id)
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_members ON members(community_id, hasheduserid, tenenv_id);

CREATE TABLE IF NOT EXISTS identityprovidersmap (
    id SERIAL PRIMARY KEY,
    entityid character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    tenenv_id INT,
    CONSTRAINT fk_tenenv
        FOREIGN KEY(tenenv_id)
            REFERENCES tenenv_info(id)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_identityprovidersmap ON identityprovidersmap(entityid, tenenv_id);

CREATE TABLE IF NOT EXISTS serviceprovidersmap (
    id SERIAL PRIMARY KEY,
    identifier character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    tenenv_id INT,
    CONSTRAINT fk_tenenv
        FOREIGN KEY(tenenv_id)
            REFERENCES tenenv_info(id)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_serviceprovidersmap ON serviceprovidersmap(identifier, tenenv_id);

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
    updated DATE,
    status character varying(255) NOT NULL,
    tenenv_id INT,
    CONSTRAINT fk_tenenv
        FOREIGN KEY(tenenv_id)
            REFERENCES tenenv_info(id)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_users ON users(hasheduserid, tenenv_id);

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
            REFERENCES country_codes(id),
    tenenv_id INT,
    CONSTRAINT fk_tenenv
        FOREIGN KEY(tenenv_id)
            REFERENCES tenenv_info(id),
    CONSTRAINT unique_row
        UNIQUE(date, hasheduserid, sourceidpid, serviceid, countryid, tenenv_id)
);

CREATE INDEX IF NOT EXISTS statistics_country_hashed_i1 ON statistics_country_hashed (hasheduserid);
CREATE INDEX IF NOT EXISTS statistics_country_hashed_i2 ON statistics_country_hashed (sourceidpid);
CREATE INDEX IF NOT EXISTS statistics_country_hashed_i3 ON statistics_country_hashed (serviceid);
CREATE INDEX IF NOT EXISTS statistics_country_hashed_i4 ON statistics_country_hashed (countryid);

CREATE TABLE IF NOT EXISTS statistics_raw (
  id SERIAL PRIMARY KEY,
  date timestamptz NOT NULL,
  type VARCHAR(25),
  event_identifier VARCHAR(255),
  source VARCHAR(255),
  tenenv_id INT NOT NULL,
  jsondata JSONB,
  CONSTRAINT fk_tenenv
        FOREIGN KEY(tenenv_id)
            REFERENCES tenenv_info(id),
  CONSTRAINT uniqueRaw
        UNIQUE(event_identifier, source, tenenv_id)
);

CREATE INDEX IF NOT EXISTS statistics_raw_i1 ON statistics_raw (date);
CREATE INDEX IF NOT EXISTS statistics_raw_i2 ON statistics_raw (source);
CREATE INDEX IF NOT EXISTS statistics_raw_i3 ON statistics_raw (type);

-- References dnh-d1/src/types.ts definitions


DROP TABLE IF EXISTS pdns;
CREATE TABLE pdns (
    id SERIAL PRIMARY KEY,
    rrname VARCHAR(255) NOT NULL,
    rrtype VARCHAR(255) NOT NULL,
    rdata TEXT NOT NULL,
    time_first TIMESTAMP NOT NULL,
    time_last TIMESTAMP NOT NULL,
    count INT NOT NULL,
    bailiwick VARCHAR(255)
);
CREATE INDEX IF NOT EXISTS idx_pdns_rrname ON pdns(rrname);

DROP TABLE IF EXISTS network;
CREATE TABLE network (
    id SERIAL PRIMARY KEY,
    cidr VARCHAR(255) NOT NULL,
    asn VARCHAR(32),
    time_first TIMESTAMP NOT NULL,
    time_last TIMESTAMP NOT NULL,
    city VARCHAR(255),
    country VARCHAR(255),
    comment TEXT,
    ref VARCHAR(255),
    time_registered TIMESTAMP NOT NULL,
    time_updated TIMESTAMP NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_network_cidr ON network(cidr);

DROP TABLE IF EXISTS asn;
CREATE TABLE asn (
    id SERIAL PRIMARY KEY,
    asn VARCHAR(32) NOT NULL,
    city VARCHAR(255),
    country VARCHAR(255),
    name VARCHAR(255),
    time_registered TIMESTAMP NOT NULL,
    time_updated TIMESTAMP NOT NULL,
    comment TEXT,
    ref VARCHAR(255)
);
CREATE INDEX IF NOT EXISTS idx_asn_asn ON asn(asn);

DROP TABLE IF EXISTS domain;
CREATE TABLE domain (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    time_first TIMESTAMP NOT NULL,
    time_last TIMESTAMP NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_domain_name ON domain(name);

DROP TABLE IF EXISTS ipaddress;
CREATE TABLE ipaddress (
    id SERIAL PRIMARY KEY,
    ip VARCHAR(255) NOT NULL,
    network VARCHAR(255),
    asn VARCHAR(32),
    FOREIGN KEY(network) REFERENCES network(cidr),
    FOREIGN KEY(asn) REFERENCES asn(asn)
);
CREATE INDEX IF NOT EXISTS idx_ipaddress_ip ON ipaddress(ip);

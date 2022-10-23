CREATE TABLE balance (
	id SERIAL,
	user_id STRING NOT NULL,
	coin_id INT8 NOT NULL,
	free FLOAT NOT NULL,
	total FLOAT NOT NULL,
	date_created TIMESTAMP NULL,
	date_updated TIMESTAMP NULL,
	PRIMARY KEY (id ASC),
	FOREIGN KEY (coin_id) REFERENCES coin (id)
);
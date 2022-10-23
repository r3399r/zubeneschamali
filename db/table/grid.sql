CREATE TABLE grid (
	id SERIAL,
	user_id STRING NOT NULL,
	lower_price FLOAT NOT NULL,
	upper_price FLOAT NOT NULL,
	grid_num INT8 NOT NULL,
	type STRING NOT NULL,
	pair_id INT8 NOT NULL,
	investment FLOAT NOT NULL,
	date_started TIMESTAMP NULL,
	date_stop TIMESTAMP NULL,
	profit FLOAT NULL,
	balance_base FLOAT NULL,
	balance_quote FLOAT NULL,
	date_created TIMESTAMP NULL,
	date_updated TIMESTAMP NULL,
	PRIMARY KEY (id ASC),
	FOREIGN KEY (pair_id) REFERENCES pair (id)
);
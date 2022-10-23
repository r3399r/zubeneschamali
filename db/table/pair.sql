CREATE TABLE pair (
	id SERIAL,
	quote_id INT8 NOT NULL,
	base_id INT8 NOT NULL,
	date_created TIMESTAMP NULL,
	date_updated TIMESTAMP NULL,
	PRIMARY KEY (id ASC),
	FOREIGN KEY (quote_id) REFERENCES coin (id),
	FOREIGN KEY (base_id) REFERENCES coin (id)
);
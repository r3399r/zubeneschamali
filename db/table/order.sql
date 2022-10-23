CREATE TABLE "order" (
	id SERIAL,
	grid_id INT8 NOT NULL,
	status STRING NOT NULL,
	date_created TIMESTAMP NULL,
	date_updated TIMESTAMP NULL,
	PRIMARY KEY (id ASC),
	FOREIGN KEY (grid_id) REFERENCES grid (id)
);
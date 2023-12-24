CREATE TABLE `sensors` (
    `id` INT(10) AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255),
    `location` VARCHAR(255),
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `datasensors` (
    `id` INT(10) AUTO_INCREMENT PRIMARY KEY,
    `ss_id` INT(10),
    `temp` INT(10),
    `humidity` INT(10),
    `light` INT(10),
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO sensors (name , location) VALUES ('PTIT', 'Ha Dong');
INSERT INTO sensors (name , location) VALUES ('Ho Guom', 'Ha Noi');
INSERT INTO sensors (name , location) VALUES ('Hoi An', 'Da Nang');
INSERT INTO sensors (name , location) VALUES ('Nguyen Hue', 'Ho Chi Minh');
INSERT INTO sensors (name , location) VALUES ('Van Mieu', 'Ha Noi');


-- SELECT fingerprint.id, fingerprint.id_finger FROM fingerprint INNER JOIN checkopened ON fingerprint.id_finger=checkopened.ss_id ORDER BY checkopened.created_at DESC;
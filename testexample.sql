CREATE TABLE `USER` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `name` varchar(20) NOT NULL,
    `age` int(3) NOT NULL,
    PRIMARY KEY (`id`)
);

INSERT INTO `USER` VALUES (1, 'siyeon', '23');
INSERT INTO `USER` VALUES (2, 'gildong', '25');
INSERT INTO `USER` VALUES (3, 'sujin', '30');

CREATE TABLE `posting` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `title` varchar(30) NOT NULL,
    `description` text,
    `created` datetime NOT NULL,
    `user_id` int(11) DEFAULT NULL,
    PRIMARY KEY (`id`)
);

INSERT INTO `posting` VALUES (1,'MySQL','MySQL is...','2018-01-01 12:10:11',1);
INSERT INTO `posting` VALUES (2,'Oracle','Oracle is ...','2018-01-03 13:01:10',1);
INSERT INTO `posting` VALUES (3,'SQL Server','SQL Server is ...','2018-01-20 11:01:10',2);
INSERT INTO `posting` VALUES (4,'PostgreSQL','PostgreSQL is ...','2018-01-23 01:03:03',3);
INSERT INTO `posting` VALUES (5,'MongoDB','MongoDB is ...','2018-01-30 12:31:03',1);
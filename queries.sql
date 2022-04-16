CREATE SCHEMA `splitwise` ;

CREATE TABLE `splitwise`.`users` (
  `id` VARCHAR(36) NOT NULL,
  `username` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`));
  
CREATE TABLE `splitwise`.`groupings` (
  `id` VARCHAR(36) NOT NULL,
  `groupname` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`));
  
CREATE TABLE `splitwise`.`usergroups` (
  `id` VARCHAR(36) NOT NULL,
  `userid` VARCHAR(36) NOT NULL,
  `groupid` VARCHAR(36) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `user_idx` (`userid` ASC) VISIBLE,
  INDEX `group_idx` (`groupid` ASC) VISIBLE,
  CONSTRAINT `user`
    FOREIGN KEY (`userid`)
    REFERENCES `splitwise`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `group`
    FOREIGN KEY (`groupid`)
    REFERENCES `splitwise`.`groupings` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

CREATE TABLE `splitwise`.`transactions` (
  `id` VARCHAR(36) NOT NULL,
  `paidby` VARCHAR(36) NOT NULL,
  `paidto` VARCHAR(36) NOT NULL,
  `details` VARCHAR(45) NOT NULL,
  `group` VARCHAR(36) NOT NULL,
  PRIMARY KEY (`id`));

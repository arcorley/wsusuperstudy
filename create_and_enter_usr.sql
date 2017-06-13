create table super_study.users (
`user_id` int(11) not null auto_increment,
`user_nm` varchar(255) not null,
`password` varchar(255) not null,
primary key (`user_id`)
) engine=innodb;

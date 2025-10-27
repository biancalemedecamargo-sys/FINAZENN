CREATE TABLE `debts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`amount` int NOT NULL,
	`interestRate` int NOT NULL DEFAULT 0,
	`minPayment` int NOT NULL DEFAULT 0,
	`dueDate` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `debts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `goals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`targetAmount` int NOT NULL,
	`currentAmount` int NOT NULL DEFAULT 0,
	`deadline` timestamp,
	`category` varchar(100),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `goals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `investments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`amount` int NOT NULL,
	`type` varchar(100) NOT NULL,
	`returnRate` int NOT NULL DEFAULT 0,
	`currentValue` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `investments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`description` varchar(255) NOT NULL,
	`amount` int NOT NULL,
	`type` enum('income','expense') NOT NULL,
	`category` varchar(100) NOT NULL,
	`date` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `transactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_params` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`caixa` int NOT NULL DEFAULT 0,
	`nomeUsuario` varchar(255),
	`mesesReserva` int NOT NULL DEFAULT 3,
	`metaPatrimonio` int NOT NULL DEFAULT 0,
	`taxaRetorno` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_params_id` PRIMARY KEY(`id`)
);

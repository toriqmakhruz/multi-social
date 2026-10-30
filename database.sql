-- ========================================================
-- Database Schema Multi Social untuk Hostinger MySQL (phpMyAdmin)
-- ========================================================

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Table: users
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NULL,
  `email` VARCHAR(191) NOT NULL UNIQUE,
  `emailVerified` DATETIME(3) NULL,
  `password` VARCHAR(191) NULL,
  `image` VARCHAR(191) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Table: accounts
DROP TABLE IF EXISTS `accounts`;
CREATE TABLE `accounts` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `type` VARCHAR(191) NOT NULL,
  `provider` VARCHAR(191) NOT NULL,
  `providerAccountId` VARCHAR(191) NOT NULL,
  `refresh_token` TEXT NULL,
  `access_token` TEXT NULL,
  `expires_at` INT NULL,
  `token_type` VARCHAR(191) NULL,
  `scope` VARCHAR(191) NULL,
  `id_token` TEXT NULL,
  `session_state` VARCHAR(191) NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `accounts_provider_providerAccountId_key` (`provider`, `providerAccountId`),
  CONSTRAINT `accounts_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Table: sessions
DROP TABLE IF EXISTS `sessions`;
CREATE TABLE `sessions` (
  `id` VARCHAR(191) NOT NULL,
  `sessionToken` VARCHAR(191) NOT NULL UNIQUE,
  `userId` VARCHAR(191) NOT NULL,
  `expires` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `sessions_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Table: verification_tokens
DROP TABLE IF EXISTS `verification_tokens`;
CREATE TABLE `verification_tokens` (
  `identifier` VARCHAR(191) NOT NULL,
  `token` VARCHAR(191) NOT NULL UNIQUE,
  `expires` DATETIME(3) NOT NULL,
  UNIQUE KEY `verification_tokens_identifier_token_key` (`identifier`, `token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Table: social_accounts
DROP TABLE IF EXISTS `social_accounts`;
CREATE TABLE `social_accounts` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `platform` ENUM('YOUTUBE', 'INSTAGRAM', 'FACEBOOK', 'TIKTOK') NOT NULL,
  `platformUserId` VARCHAR(191) NOT NULL,
  `platformUsername` VARCHAR(191) NOT NULL,
  `displayName` VARCHAR(191) NULL,
  `profileImage` TEXT NULL,
  `accessToken` TEXT NOT NULL,
  `refreshToken` TEXT NULL,
  `tokenExpiresAt` DATETIME(3) NULL,
  `isActive` TINYINT(1) NOT NULL DEFAULT 1,
  `metadata` TEXT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `social_accounts_platform_platformUserId_key` (`platform`, `platformUserId`),
  CONSTRAINT `social_accounts_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Table: posts
DROP TABLE IF EXISTS `posts`;
CREATE TABLE `posts` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `content` TEXT NOT NULL,
  `status` ENUM('DRAFT', 'SCHEDULED', 'PUBLISHING', 'PUBLISHED', 'FAILED') NOT NULL DEFAULT 'DRAFT',
  `scheduledAt` DATETIME(3) NULL,
  `publishedAt` DATETIME(3) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `posts_status_scheduledAt_idx` (`status`, `scheduledAt`),
  CONSTRAINT `posts_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Table: media_files
DROP TABLE IF EXISTS `media_files`;
CREATE TABLE `media_files` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `filename` VARCHAR(191) NOT NULL,
  `originalName` VARCHAR(191) NOT NULL,
  `mimeType` VARCHAR(191) NOT NULL,
  `size` INT NOT NULL,
  `url` VARCHAR(191) NOT NULL,
  `type` ENUM('IMAGE', 'VIDEO') NOT NULL,
  `width` INT NULL,
  `height` INT NULL,
  `duration` INT NULL,
  `tags` TEXT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  CONSTRAINT `media_files_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Table: post_media
DROP TABLE IF EXISTS `post_media`;
CREATE TABLE `post_media` (
  `id` VARCHAR(191) NOT NULL,
  `postId` VARCHAR(191) NOT NULL,
  `mediaId` VARCHAR(191) NOT NULL,
  `position` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  CONSTRAINT `post_media_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `post_media_mediaId_fkey` FOREIGN KEY (`mediaId`) REFERENCES `media_files` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Table: post_platforms
DROP TABLE IF EXISTS `post_platforms`;
CREATE TABLE `post_platforms` (
  `id` VARCHAR(191) NOT NULL,
  `postId` VARCHAR(191) NOT NULL,
  `socialAccountId` VARCHAR(191) NOT NULL,
  `platformPostId` VARCHAR(191) NULL,
  `status` ENUM('DRAFT', 'SCHEDULED', 'PUBLISHING', 'PUBLISHED', 'FAILED') NOT NULL DEFAULT 'DRAFT',
  `errorMessage` TEXT NULL,
  `publishedAt` DATETIME(3) NULL,
  `likes` INT NOT NULL DEFAULT 0,
  `comments` INT NOT NULL DEFAULT 0,
  `shares` INT NOT NULL DEFAULT 0,
  `views` INT NOT NULL DEFAULT 0,
  `reach` INT NOT NULL DEFAULT 0,
  `impressions` INT NOT NULL DEFAULT 0,
  `lastSyncAt` DATETIME(3) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `post_platforms_postId_socialAccountId_key` (`postId`, `socialAccountId`),
  CONSTRAINT `post_platforms_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `post_platforms_socialAccountId_fkey` FOREIGN KEY (`socialAccountId`) REFERENCES `social_accounts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Table: scheduled_jobs
DROP TABLE IF EXISTS `scheduled_jobs`;
CREATE TABLE `scheduled_jobs` (
  `id` VARCHAR(191) NOT NULL,
  `type` VARCHAR(191) NOT NULL,
  `payload` TEXT NOT NULL,
  `status` ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED') NOT NULL DEFAULT 'PENDING',
  `attempts` INT NOT NULL DEFAULT 0,
  `maxAttempts` INT NOT NULL DEFAULT 3,
  `runAt` DATETIME(3) NOT NULL,
  `startedAt` DATETIME(3) NULL,
  `completedAt` DATETIME(3) NULL,
  `error` TEXT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `scheduled_jobs_status_runAt_idx` (`status`, `runAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================================
-- DATA AWAL (DEMO USER ADMIN & AKUN SOSMED)
-- Password default: admin123 (hashed dengan bcrypt)
-- ========================================================
INSERT INTO `users` (`id`, `name`, `email`, `password`, `createdAt`, `updatedAt`)
VALUES ('admin_demo_id', 'Admin Multi Social', 'admin@multisocial.com', '$2a$12$e0L5Bw9HjC.9WjK6V/T.U.320b3sZ46p1H.d.6fF14z.ZzGZ2y/yW', NOW(), NOW())
ON DUPLICATE KEY UPDATE `email` = `email`;

INSERT INTO `social_accounts` (`id`, `userId`, `platform`, `platformUserId`, `platformUsername`, `displayName`, `accessToken`, `isActive`, `createdAt`, `updatedAt`)
VALUES
('soc_yt', 'admin_demo_id', 'YOUTUBE', 'demo_youtube_admin_demo_id', 'my_youtube_channel', 'YouTube Channel', 'demo_token_youtube', 1, NOW(), NOW()),
('soc_ig', 'admin_demo_id', 'INSTAGRAM', 'demo_instagram_admin_demo_id', 'multisocial_ig', 'Instagram Bisnis', 'demo_token_instagram', 1, NOW(), NOW()),
('soc_fb', 'admin_demo_id', 'FACEBOOK', 'demo_facebook_admin_demo_id', 'multisocial_fb', 'Facebook Page', 'demo_token_facebook', 1, NOW(), NOW()),
('soc_tt', 'admin_demo_id', 'TIKTOK', 'demo_tiktok_admin_demo_id', 'multisocial_tiktok', 'TikTok Creator', 'demo_token_tiktok', 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE `platform` = `platform`;

SET FOREIGN_KEY_CHECKS = 1;

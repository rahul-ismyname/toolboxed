-- MASTER SCHEMA (Turso/libSQL/SQLite Compatible)
-- Run this in your Turso SQL CLI or dashboard to initialize your database.

-- ==========================================
-- 1. INVOICES & VIRAL LOOPS
-- ==========================================

CREATE TABLE IF NOT EXISTS invoices (
    id TEXT PRIMARY KEY,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    data TEXT NOT NULL,
    title TEXT,
    description TEXT,
    is_public INTEGER DEFAULT 0, -- 0 = false, 1 = true
    views INTEGER DEFAULT 0,
    downloads INTEGER DEFAULT 0
);

-- ==========================================
-- 2. LINK SHORTENER
-- ==========================================

CREATE TABLE IF NOT EXISTS short_links (
    id TEXT PRIMARY KEY,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    original_url TEXT NOT NULL,
    short_code TEXT NOT NULL UNIQUE,
    clicks INTEGER DEFAULT 0
);

-- ==========================================
-- 3. TYPE RACER LEADERBOARD
-- ==========================================

CREATE TABLE IF NOT EXISTS type_racer_leaderboard (
    id TEXT PRIMARY KEY,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    username TEXT NOT NULL,
    wpm INTEGER NOT NULL,
    accuracy INTEGER NOT NULL,
    difficulty TEXT NOT NULL
);

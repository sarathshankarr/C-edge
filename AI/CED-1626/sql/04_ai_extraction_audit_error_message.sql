-- CED-1626: ai_extraction_audit gains an error_message column.
-- Closes a real gap: today a page-fetch/normalize failure (e.g. an
-- unreachable S3 URL, or a document too large to process) writes NO
-- audit row at all -- only startLotDocumentJob's/pollLotDocumentJob's
-- own LOGGER.error output, which isn't queryable. Purely additive
-- (one nullable column), no existing rows touched. Safe to run against
-- a live schema.

-- ============================================================
-- STEP 1: VERIFY the column does not already exist
-- ============================================================
SELECT COUNT(*) AS should_be_zero
FROM information_schema.COLUMNS
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'ai_extraction_audit'
  AND COLUMN_NAME = 'error_message';

-- ============================================================
-- STEP 2: add the column
-- ============================================================
ALTER TABLE ai_extraction_audit
  ADD COLUMN error_message VARCHAR(1000) NULL AFTER extraction_status;

-- ============================================================
-- STEP 3: VERIFY -- every existing row reads NULL, column exists
-- ============================================================
SELECT COUNT(*) AS total_rows,
       SUM(error_message IS NOT NULL) AS should_be_zero
FROM ai_extraction_audit;

/*
  # Create Storage Buckets for Files

  1. Storage Buckets
    - `applicants` - For storing applicant photos and resumes
    - `documents` - For storing documents and files

  2. Security
    - Enable public access with policies
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE name = 'applicants'
  ) THEN
    INSERT INTO storage.buckets (id, name, public) 
    VALUES ('applicants', 'applicants', true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE name = 'documents'
  ) THEN
    INSERT INTO storage.buckets (id, name, public) 
    VALUES ('documents', 'documents', true);
  END IF;
END $$;

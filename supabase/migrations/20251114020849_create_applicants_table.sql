/*
  # Create Applicants Table

  ## Description
  Creates the applicants table with all required fields for GIP and TUPAD programs,
  including proper constraints, indexes, and Row Level Security policies.

  ## Tables Created
  - `applicants` - Stores applicant information for both GIP and TUPAD programs

  ## Columns
  - `id` (uuid, primary key) - Unique identifier
  - `code` (text, unique, not null) - Applicant code (e.g., GIP-000001)
  - `first_name` (text, not null) - First name
  - `middle_name` (text) - Middle name
  - `last_name` (text, not null) - Last name
  - `extension_name` (text) - Name suffix (Jr, Sr, III, etc.)
  - `birth_date` (date, not null) - Birth date
  - `age` (integer, not null) - Calculated age
  - `place_of_birth` (text) - Place of birth
  - `residential_address` (text) - Residential address
  - `barangay` (text, not null) - Barangay
  - `contact_number` (text, not null) - Contact number
  - `telephone_number` (text) - Telephone number
  - `email` (text) - Email address
  - `school` (text) - School name
  - `civil_stats` (text) - Civil status (for GIP)
  - `gender` (text, not null) - Gender (MALE/FEMALE)
  - `primary_education` (text) - Primary education level
  - `primary_school_name` (text) - Primary school name
  - `secondary_education` (text) - Secondary education level
  - `secondary_school_name` (text) - Secondary school name
  - `tertiary_education` (text) - Tertiary education level
  - `tertiary_school_name` (text) - Tertiary school name
  - `educational_attainment` (text) - Educational attainment
  - `course` (text) - Course/degree
  - `beneficiary_name` (text) - Beneficiary name
  - `photo_file_name` (text) - Photo file name
  - `photo_file_data` (text) - Photo file data (base64)
  - `resume_file_name` (text) - Resume file name
  - `resume_file_data` (text) - Resume file data (base64)
  - `encoder` (text, not null) - Name of encoder
  - `status` (text, not null) - Application status
  - `program` (text, not null) - Program (GIP/TUPAD)
  - `id_type` (text) - ID type (for TUPAD)
  - `id_number` (text) - ID number (for TUPAD)
  - `occupation` (text) - Occupation (for TUPAD)
  - `civil_status` (text) - Civil status (for TUPAD)
  - `average_monthly_income` (text) - Average monthly income
  - `dependent_name` (text) - Dependent name
  - `relationship_to_dependent` (text) - Relationship to dependent
  - `archived` (boolean, default false) - Archive status
  - `archived_date` (date) - Archive date
  - `interviewed` (boolean, default false) - Interview status
  - `date_submitted` (date, not null) - Submission date
  - `created_at` (timestamptz, default now()) - Creation timestamp
  - `updated_at` (timestamptz, default now()) - Update timestamp

  ## Security
  - Enable Row Level Security (RLS)
  - Public read access for all authenticated users
  - Public insert access for all authenticated users
  - Public update access for all authenticated users
  - Public delete access for authenticated users

  ## Indexes
  - Index on `program` for faster filtering
  - Index on `status` for faster filtering
  - Index on `barangay` for faster filtering
  - Index on `code` for faster lookups
*/

-- Create applicants table
CREATE TABLE IF NOT EXISTS applicants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  first_name text NOT NULL,
  middle_name text,
  last_name text NOT NULL,
  extension_name text,
  birth_date date NOT NULL,
  age integer NOT NULL,
  place_of_birth text,
  residential_address text,
  barangay text NOT NULL,
  contact_number text NOT NULL,
  telephone_number text,
  email text,
  school text,
  civil_stats text,
  gender text NOT NULL,
  primary_education text,
  primary_school_name text,
  secondary_education text,
  secondary_school_name text,
  tertiary_education text,
  tertiary_school_name text,
  educational_attainment text,
  course text,
  beneficiary_name text,
  photo_file_name text,
  photo_file_data text,
  resume_file_name text,
  resume_file_data text,
  encoder text NOT NULL,
  status text NOT NULL,
  program text NOT NULL,
  id_type text,
  id_number text,
  occupation text,
  civil_status text,
  average_monthly_income text,
  dependent_name text,
  relationship_to_dependent text,
  archived boolean DEFAULT false,
  archived_date date,
  interviewed boolean DEFAULT false,
  date_submitted date NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_applicants_program ON applicants(program);
CREATE INDEX IF NOT EXISTS idx_applicants_status ON applicants(status);
CREATE INDEX IF NOT EXISTS idx_applicants_barangay ON applicants(barangay);
CREATE INDEX IF NOT EXISTS idx_applicants_code ON applicants(code);
CREATE INDEX IF NOT EXISTS idx_applicants_archived ON applicants(archived);

-- Enable Row Level Security
ALTER TABLE applicants ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Allow all authenticated users to perform all operations
CREATE POLICY "Allow all authenticated users to read applicants"
  ON applicants
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow all authenticated users to insert applicants"
  ON applicants
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow all authenticated users to update applicants"
  ON applicants
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all authenticated users to delete applicants"
  ON applicants
  FOR DELETE
  TO authenticated
  USING (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_applicants_updated_at ON applicants;
CREATE TRIGGER update_applicants_updated_at
  BEFORE UPDATE ON applicants
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

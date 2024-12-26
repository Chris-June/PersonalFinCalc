/*
  # Add loans table
  
  1. New Tables
    - `loans`
      - `id` (uuid, primary key)
      - `profile_id` (uuid, references profiles)
      - `name` (text)
      - `amount` (decimal)
      - `interest_rate` (decimal)
      - `term_months` (integer)
      - `monthly_payment` (decimal)
      - `start_date` (date)
      - Timestamps
  
  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

CREATE TABLE loans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  amount decimal NOT NULL DEFAULT 0,
  interest_rate decimal NOT NULL DEFAULT 0,
  term_months integer NOT NULL DEFAULT 0,
  monthly_payment decimal NOT NULL DEFAULT 0,
  start_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CHECK (amount >= 0),
  CHECK (interest_rate >= 0),
  CHECK (term_months > 0),
  CHECK (monthly_payment >= 0)
);

-- Enable RLS
ALTER TABLE loans ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own loans"
  ON loans FOR SELECT
  TO authenticated
  USING (profile_id = auth.uid());

CREATE POLICY "Users can manage own loans"
  ON loans FOR ALL
  TO authenticated
  USING (profile_id = auth.uid());
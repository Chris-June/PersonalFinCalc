/*
  # Add Calculator Data Storage

  1. New Tables
    - `calculator_data`
      - `id` (uuid, primary key)
      - `profile_id` (uuid, references profiles)
      - `calculator_type` (text: 'amortization', 'investment', 'loan')
      - `name` (text)
      - `input_data` (jsonb)
      - `result_data` (jsonb)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `calculator_data` table
    - Add policies for authenticated users to manage their own data
*/

CREATE TABLE calculator_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  calculator_type text NOT NULL CHECK (calculator_type IN ('amortization', 'investment', 'loan')),
  name text NOT NULL,
  input_data jsonb NOT NULL,
  result_data jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE calculator_data ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own calculator data"
  ON calculator_data FOR SELECT
  TO authenticated
  USING (profile_id = auth.uid());

CREATE POLICY "Users can manage own calculator data"
  ON calculator_data FOR ALL
  TO authenticated
  USING (profile_id = auth.uid());
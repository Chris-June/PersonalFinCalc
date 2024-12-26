/*
  # Add net worth history tracking

  1. New Tables
    - `net_worth_history`
      - `id` (uuid, primary key)
      - `profile_id` (uuid, references profiles)
      - `date` (date)
      - `total_assets` (decimal)
      - `total_liabilities` (decimal)
      - `net_worth` (decimal)
    - `financial_goals`
      - `id` (uuid, primary key)
      - `profile_id` (uuid, references profiles)
      - `name` (text)
      - `target_amount` (decimal)
      - `current_amount` (decimal)
      - `target_date` (date)
      - `type` (text)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

-- Create net worth history table
CREATE TABLE net_worth_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL DEFAULT CURRENT_DATE,
  total_assets decimal NOT NULL DEFAULT 0,
  total_liabilities decimal NOT NULL DEFAULT 0,
  net_worth decimal NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create financial goals table
CREATE TABLE financial_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  target_amount decimal NOT NULL DEFAULT 0,
  current_amount decimal NOT NULL DEFAULT 0,
  target_date date NOT NULL,
  type text NOT NULL CHECK (type IN ('asset', 'liability', 'net_worth')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE net_worth_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_goals ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own net worth history"
  ON net_worth_history FOR SELECT
  TO authenticated
  USING (profile_id = auth.uid());

CREATE POLICY "Users can manage own net worth history"
  ON net_worth_history FOR ALL
  TO authenticated
  USING (profile_id = auth.uid());

CREATE POLICY "Users can view own financial goals"
  ON financial_goals FOR SELECT
  TO authenticated
  USING (profile_id = auth.uid());

CREATE POLICY "Users can manage own financial goals"
  ON financial_goals FOR ALL
  TO authenticated
  USING (profile_id = auth.uid());
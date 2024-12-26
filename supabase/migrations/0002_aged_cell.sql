/*
  # Add transaction categories

  1. New Tables
    - `transaction_categories`
      - `id` (uuid, primary key)
      - `profile_id` (uuid, references profiles)
      - `name` (text)
      - `type` (text, either 'income' or 'expense')
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Changes
    - Add `category_id` to `transactions` table
    
  3. Security
    - Enable RLS on new table
    - Add policies for authenticated users
*/

-- Create transaction categories table
CREATE TABLE IF NOT EXISTS transaction_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('income', 'expense')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add category to transactions
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'transactions' 
    AND column_name = 'category_id'
  ) THEN
    ALTER TABLE transactions 
    ADD COLUMN category_id uuid REFERENCES transaction_categories(id);
  END IF;
END $$;

-- Enable RLS
ALTER TABLE transaction_categories ENABLE ROW LEVEL SECURITY;

-- Add RLS policies
CREATE POLICY "Users can view own transaction categories"
  ON transaction_categories FOR SELECT
  TO authenticated
  USING (profile_id = auth.uid());

CREATE POLICY "Users can manage own transaction categories"
  ON transaction_categories FOR ALL
  TO authenticated
  USING (profile_id = auth.uid());
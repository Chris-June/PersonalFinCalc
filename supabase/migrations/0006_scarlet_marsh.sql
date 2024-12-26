/*
  # Add Net Worth Calculator Type

  1. Changes
    - Add 'net-worth' as valid calculator type to calculator_data table
*/

ALTER TABLE calculator_data
DROP CONSTRAINT calculator_data_calculator_type_check,
ADD CONSTRAINT calculator_data_calculator_type_check
  CHECK (calculator_type IN ('amortization', 'investment', 'loan', 'net-worth'));
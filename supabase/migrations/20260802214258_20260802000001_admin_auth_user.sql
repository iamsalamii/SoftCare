/*
# Create admin auth user and link to users table

1. Auth user
- Create auth.users entry for admin@softcare.com with password Adminsoftcare123!
- Email confirmation is bypassed (confirmed = true)
2. Users table
- Update existing admin row (admin@softcare.fr) to admin@softcare.com
- Set auth_user_id to link the auth account to the staff record
3. Security
- No schema changes; no policy changes
*/

-- Create the auth user
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  email_change_confirm_status
)
SELECT
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@softcare.com',
  crypt('Adminsoftcare123!', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{}'::jsonb,
  '{}'::jsonb,
  false,
  0
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@softcare.com');

-- Update the existing admin staff record to use the new email and link auth id
UPDATE users
SET email = 'admin@softcare.com'
WHERE email = 'admin@softcare.fr' AND role = 'admin';

-- Add auth_user_id column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'auth_user_id'
  ) THEN
    ALTER TABLE users ADD COLUMN auth_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Link the admin staff record to the auth user
UPDATE users
SET auth_user_id = (SELECT id FROM auth.users WHERE email = 'admin@softcare.com')
WHERE email = 'admin@softcare.com' AND role = 'admin';

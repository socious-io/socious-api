-- Create enum type only if it does not exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'network_type') THEN
        CREATE TYPE network_type AS ENUM ('bsc', 'sepolia', 'cardano', 'midnight');
    END IF;
END$$;

-- Create table if not exists
CREATE TABLE IF NOT EXISTS wallets (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    address TEXT NOT NULL,
    network network_type NOT NULL,
    testnet boolean DEFAULT false,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TYPE  payment_source_type ADD VALUE 'CRYPTO_WALLET';
ALTER TYPE payment_service ADD VALUE 'CRYPTO';


ALTER TABLE payments 
ADD COLUMN crypto_currency_address text;

Before running the script:
Run the migration to add new columns into projects table.
Columns 'other_party_id', 'other_party_title' and 'other_party_url' are required for this script.
For testing purposes, you can insert a timestamp of 1-3 days ago at the idealist.js file in the const since. Without this timestamp, the script will require the last updated_at timestamp from the database from the idealist. If such record is not found, it will download records from idealist from its start.

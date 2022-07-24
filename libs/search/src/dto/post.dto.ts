export class PostsDTO {
  id: number;
  page_id: number;
  group_id: number;
  title: string;
  description: string;
  project_type: number;
  project_length: number;
  country_id: number;
  payment_type: number;
  payment_scheme: number;
  payment_currency: string;
  payment_range_lower: string;
  payment_range_higher: string;
  experience_level: number;
  project_status: number;
  other_party_id: string;
  other_party_url: string;
  other_party_title: string;
  other_party_updated: string;
  created_at: Date;
  updated_at: Date;
}

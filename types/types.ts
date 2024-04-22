export interface IAnswersEntity {
  answer?: string | null
  applicant_id: string
  created_at: Date
  id: string
  project_id: string
  question_id: string
  selected_option?: number | null
  updated_at?: Date
}
export interface IApplicantsEntity {
  attachment?: string | null
  closed_at?: Date | null
  cover_letter?: string | null
  created_at: Date
  cv_link?: string | null
  cv_name?: string | null
  deleted_at?: Date | null
  feedback?: string | null
  id: string
  offer_message?: string | null
  offer_rate?: number | null
  payment_rate?: number | null
  payment_type?: IPaymentType | null
  project_id: string
  share_contact_info?: boolean | null
  status?: IApplicantsStatusType | null
  updated_at?: Date
  user_id: string
}
export interface ICardsEntity {
  brand?: string | null
  created_at: Date
  cvc: string
  exp_month: number
  exp_year: number
  holder_name?: string | null
  id: string
  identity_id: string
  numbers: string
  updated_at?: Date
}
export interface IChatsEntity {
  created_at: Date
  created_by: string
  deleted_at?: Date | null
  description?: string | null
  id: string
  name: string
  participants?: string[] | null
  type?: IChatType
  updated_at?: Date
}
export interface IChatsParticipantsEntity {
  all_read?: boolean | null
  chat_id: string
  created_at: Date
  id: string
  identity_id: string
  joined_by?: string | null
  last_read_at?: Date | null
  last_read_id?: string | null
  muted_until?: Date | null
  type?: IChatMemberType | null
  updated_at?: Date
}
export interface ICommentsEntity {
  content: string
  created_at: Date
  id: string
  identity_id: string
  likes?: number | null
  post_id: string
  replied?: boolean | null
  reply_id?: string | null
  updated_at?: Date
}
export interface IConnectionsEntity {
  connected_at?: Date | null
  created_at: Date
  id: string
  relation_id: string
  requested_id: string
  requester_id: string
  status?: IConnectStatusType
  text?: string | null
  updated_at?: Date
}
export interface DeletedUsersEntity {
  deleted_at?: Date
  id: string
  reason?: string | null
  registered_at: Date
  user_id: string
  username?: string | null
}
export interface IDevicesEntity {
  created_at: Date
  id: string
  meta?: any | null
  token: string
  user_id: string
}
export interface IEmailsEntity {
  body: string
  body_type: string
  created_at: Date
  id: string
  info?: any | null
  options?: any | null
  service: IEmailServiceType
  subject: string
  to: string
}
export interface IEscrowsEntity {
  amount?: number | null
  created_at: Date
  currency?: IPaymentCurrencyType | null
  id: string
  mission_id?: string | null
  offer_id?: string | null
  payment_id: string
  project_id: string
  refound_at?: Date | null
  release_id?: string | null
  released_at?: Date | null
}
export interface IExperiencesEntity {
  created_at: Date
  description?: string | null
  end_at?: Date | null
  id: string
  org_id: string
  skills?: string[] | null
  start_at: Date
  title?: string | null
  user_id: string
}
export interface IFeedbacksEntity {
  content?: string | null
  created_at: Date
  id: string
  identity_id: string
  is_contest?: boolean | null
  mission_id: string
  project_id: string
}
export interface IFollowsEntity {
  created_at: Date
  follower_identity_id: string
  following_identity_id: string
  id: string
}
export interface IGeonamesEntity {
  admin1_code?: string | null
  admin2_code?: string | null
  asciiname: string
  cc2?: string[] | null
  country_code?: string | null
  created_at: Date
  feature_class?: string | null
  feature_code?: string | null
  fips_code?: string | null
  id: number
  iso_code?: string | null
  latlong?: any | null
  name: string
  population?: number | null
  timezone?: string | null
  updated_at?: Date
}

export interface IGeonamesAltEntity {
  alternate_name?: string | null
  geoname_id: number
  id: number
  is_colloquial?: boolean | null
  is_historic?: boolean | null
  is_preferred_name?: boolean | null
  is_short_name?: boolean | null
  iso_language?: string | null
}

export interface IIdentitiesEntity {
  created_at: Date
  id: string
  meta?: any | null
  type: IIdentityType
}
export interface IImpactPointsHistoryEntity {
  created_at: Date
  id: string
  identity_id: string
  mission_id?: string | null
  social_cause?: ISocialCausesType | null
  social_cause_category?: ISocialCausesCategoriesType | null
  total_points?: number
}
export interface IJobCategoriesEntity {
  created_at: Date
  hourly_wage_dollars?: number | null
  id: string
  name: string
  updated_at?: Date
}
export interface ILanguagesEntity {
  created_at: Date
  id: string
  level?: ILanguageLevelType | null
  name: string
  user_id: string
}
export interface ILikesEntity {
  comment_id?: string | null
  created_at: Date
  id: string
  identity_id: string
  post_id: string
}
export interface IMediaEntity {
  created_at: Date
  filename?: string | null
  id: string
  identity_id: string
  url?: string | null
}
export interface IMessagesEntity {
  chat_id: string
  created_at: Date
  deleted_at?: Date | null
  id: string
  identity_id: string
  media?: string | null
  replied?: boolean | null
  reply_id?: string | null
  text?: string | null
  updated_at?: Date
}

export interface IMissionsEntity {
  applicant_id?: string | null
  assignee_id: string
  assigner_id: string
  complete_at?: Date | null
  created_at: Date
  id: string
  offer_id: string
  project_id: string
  status: IMissionStatusType
  updated_at?: Date | null
}
export interface INotificationsEntity {
  created_at: Date
  data?: any | null
  id: string
  read_at?: Date | null
  ref_id: string
  type: INotificationType
  updated_at?: Date | null
  user_id: string
  view_at?: Date | null
}
export interface INotificationsSettingsEntity {
  created_at: Date
  email?: boolean | null
  id: string
  in_app?: boolean | null
  push?: boolean | null
  type: INotificationType
  updated_at?: Date
  user_id: string
}
export interface IOauthConnectsEntity {
  access_token: string
  created_at: Date
  expired_at?: Date | null
  id: string
  identity_id: string
  matrix_unique_id: string
  meta?: any | null
  provider: IOauthConnectedProvidersType
  refresh_token?: string | null
  status?: IUserStatusType | null
  updated_at?: Date
}
export interface IOffersEntity {
  applicant_id?: string | null
  assignment_total?: number | null
  created_at: Date
  due_date?: Date | null
  id: string
  offer_message?: string | null
  offer_rate?: number | null
  offerer_id: string
  project_id: string
  recipient_id: string
  status?: IOffersStatusType | null
  total_hours?: number | null
  updated_at?: Date
  weekly_limit?: number | null
}
export interface IOrgMembersEntity {
  created_at: Date
  id: string
  org_id: string
  user_id: string
}
export interface IOrganizationsEntity {
  address?: string | null
  verified_impact: boolean
  bio?: string | null
  city?: string | null
  country?: string | null
  cover_image?: string | null
  created_at: Date
  created_by?: string | null
  culture?: string | null
  description?: string | null
  email?: string | null
  followers?: number | null
  followings?: number | null
  geoname_id?: number | null
  id: string
  image?: string | null
  impact_score?: number
  mission?: string | null
  mobile_country_code?: string | null
  name?: string | null
  other_party_id?: string | null
  other_party_title?: string | null
  other_party_url?: string | null
  phone?: string | null
  search_tsv?: any | null
  shortname: string
  social_causes?: any | null
  status?: IOrgStatusType | null
  type?: IOrganizationType | null
  updated_at?: Date | null
  wallet_address?: string | null
  website?: string | null
}
export interface IOtpsEntity {
  code: number
  created_at: Date
  expired_at?: Date
  id: string
  purpose?: IOtpPurposeType
  type: IOtpType
  user_id?: string | null
  verified_at?: Date | null
}
export interface IPaymentsEntity {
  amount?: number | null
  canceled_at?: Date | null
  created_at: Date
  currency?: IPaymentCurrencyType | null
  id: string
  identity_id: string
  meta?: any | null
  service?: IPaymentServiceType | null
  source: string
  source_type?: IPaymentSourceType
  transaction_id?: string | null
  verified_at?: Date | null
}
export interface IPostsEntity {
  causes_tags?: any | null
  content?: string | null
  created_at: Date
  deleted_at?: Date | null
  hashtags?: string[] | null
  id: string
  identity_id: string
  identity_tags?: string[] | null
  likes?: number
  media?: string[] | null
  search_tsv?: any | null
  shared?: number | null
  shared_id?: string | null
  updated_at?: Date
}
export interface IProjectsEntity {
  causes_tags?: any | null
  city?: string | null
  commitment_hours_higher?: string | null
  commitment_hours_lower?: string | null
  country?: string | null
  created_at: Date
  deleted_at?: Date | null
  description?: string | null
  experience_level?: number | null
  expires_at?: Date | null
  geoname_id?: number | null
  id: string
  identity_id: string
  job_category_id?: string | null
  other_party_id?: string | null
  other_party_title?: string | null
  other_party_url?: string | null
  payment_currency?: string | null
  payment_range_higher?: string | null
  payment_range_lower?: string | null
  payment_scheme?: IPaymentSchemeType | null
  payment_type?: IPaymentType | null
  project_length?: IProjectLengthType | null
  project_type?: IProjectType | null
  remote_preference?: IProjectRemoteRreferenceType | null
  search_tsv?: any | null
  skills?: string[] | null
  status?: IProjectStatusType | null
  title?: string | null
  updated_at?: Date
  weekly_hours_higher?: string | null
  weekly_hours_lower?: string | null
}
export interface IQuestionsEntity {
  created_at: Date
  id: string
  options?: string[] | null
  project_id: string
  question: string
  required?: boolean | null
  updated_at?: Date
}
export interface ISearchHistoryEntity {
  body?: any | null
  created_at: Date
  deleted_at?: Date | null
  id: string
  identity_id?: string | null
  updated_at?: Date
}
export interface ISkillsEntity {
  created_at: Date
  id: string
  name: string
}

export interface IUsersEntity {
  address?: string | null
  proofspace_connect_id?: string | null
  avatar?: string | null
  bio?: string | null
  certificates?: string[] | null
  city?: string | null
  country?: string | null
  cover_image?: string | null
  created_at: Date
  deleted_at?: Date | null
  description_search?: string | null
  educations?: string[] | null
  email: string
  email_text?: string | null
  email_verified_at?: Date | null
  expiry_date?: Date | null
  first_name?: string | null
  followers?: number | null
  followings?: number | null
  geoname_id?: number | null
  goals?: string | null
  id: string
  impact_points?: number
  is_admin?: boolean | null
  language?: string | null
  last_name?: string | null
  mission?: string | null
  mobile_country_code?: string | null
  my_conversation?: string | null
  password?: string | null
  password_expired?: boolean | null
  phone?: string | null
  phone_verified_at?: Date | null
  remember_token?: string | null
  search_tsv?: any | null
  skills?: string[] | null
  social_causes?: any | null
  status: IUserStatusType
  updated_at?: Date
  username: string
  view_as?: number | null
  wallet_address?: string | null
  identity_verified: boolean
}

export interface IReportsEntity {
  id: string
}

export interface IChargeBody {
  currency: 'USD'
  service: 'STRIPE' | 'CRYPTO'
  amount: string
  meta: any
  source: string
  description?: string
  transfers?: any
  is_jp: boolean
  org_referrer?: string
  user_referrer?: string
  fee: number
}

export enum IUserStatusType {
  'ACTIVE' = 'ACTIVE',
  'INACTIVE' = 'INACTIVE',
  'SUSPEND' = 'SUSPEND'
}

export enum ISocialCausesType {
  'SOCIAL' = 'SOCIAL',
  'POVERTY' = 'POVERTY',
  'HOMELESSNESS' = 'HOMELESSNESS',
  'HUNGER' = 'HUNGER',
  'HEALTH' = 'HEALTH',
  'SUBSTANCE_ABUSE' = 'SUBSTANCE_ABUSE',
  'MENTAL' = 'MENTAL',
  'BULLYING' = 'BULLYING',
  'SECURITY' = 'SECURITY',
  'EDUCATION' = 'EDUCATION',
  'GENDER_EQUALITY' = 'GENDER_EQUALITY',
  'GENDER_BASED_VIOLENCE' = 'GENDER_BASED_VIOLENCE',
  'SEXUAL_VIOLENCE' = 'SEXUAL_VIOLENCE',
  'DOMESTIC_VIOLENCE' = 'DOMESTIC_VIOLENCE',
  'WATER_SANITATION' = 'WATER_SANITATION',
  'SUSTAINABLE_ENERGY' = 'SUSTAINABLE_ENERGY',
  'DECENT_WORK' = 'DECENT_WORK',
  'INEQUALITY' = 'INEQUALITY',
  'MINORITY' = 'MINORITY',
  'MULTICULTURALISM' = 'MULTICULTURALISM',
  'DIVERSITY_INCLUSION' = 'DIVERSITY_INCLUSION',
  'INDIGENOUS_PEOPLES' = 'INDIGENOUS_PEOPLES',
  'DISABILITY' = 'DISABILITY',
  'LGBTQI' = 'LGBTQI',
  'REFUGEE' = 'REFUGEE',
  'MIGRANTS' = 'MIGRANTS',
  'ORPHANS' = 'ORPHANS',
  'CHILD_PROTECTION' = 'CHILD_PROTECTION',
  'COMMUNITY_DEVELOPMENT' = 'COMMUNITY_DEVELOPMENT',
  'DEPOPULATION' = 'DEPOPULATION',
  'OVERPOPULATION' = 'OVERPOPULATION',
  'HUMAN_RIGHTS' = 'HUMAN_RIGHTS',
  'SUSTAINABILITY' = 'SUSTAINABILITY',
  'RESPONSIBLE_CONSUMPTION' = 'RESPONSIBLE_CONSUMPTION',
  'CLIMATE_CHANGE' = 'CLIMATE_CHANGE',
  'NATURAL_DISASTERS' = 'NATURAL_DISASTERS',
  'BIODIVERSITY' = 'BIODIVERSITY',
  'ANIMAL_RIGHTS' = 'ANIMAL_RIGHTS',
  'ARMED_CONFLICT' = 'ARMED_CONFLICT',
  'PEACEBUILDING' = 'PEACEBUILDING',
  'DEMOCRACY' = 'DEMOCRACY',
  'CIVIC_ENGAGEMENT' = 'CIVIC_ENGAGEMENT',
  'JUSTICE' = 'JUSTICE',
  'GOVERNANCE' = 'GOVERNANCE',
  'CRIME_PREVENTION' = 'CRIME_PREVENTION',
  'CORRUPTION' = 'CORRUPTION',
  'OTHER' = 'OTHER',
  'RURAL_DEVELOPMENT' = 'RURAL_DEVELOPMENT',
  'VEGANISM' = 'VEGANISM',
  'BLACK_LIVES_MATTER' = 'BLACK_LIVES_MATTER',
  'ISLAMOPHOBIA' = 'ISLAMOPHOBIA',
  'ANTI_SEMITISM' = 'ANTI_SEMITISM',
  'ABORTION' = 'ABORTION',
  'EUTHANASIA' = 'EUTHANASIA',
  'NEURODIVERSITY' = 'NEURODIVERSITY',
  'SUSTAINABLE_COMMUNITIES' = 'SUSTAINABLE_COMMUNITIES',
  'BIODIVERSITY_LIFE_BELOW_WATER' = 'BIODIVERSITY_LIFE_BELOW_WATER',
  'PEACE_JUSTICE' = 'PEACE_JUSTICE',
  'COLLABORATION_FOR_IMPACT' = 'COLLABORATION_FOR_IMPACT',
  'INNOVATION' = 'INNOVATION'
}
export enum ISocialCausesCategoriesType {
  'PEOPLE_RELATED' = 'PEOPLE_RELATED',
  'ANIMAL_RELATED' = 'ANIMAL_RELATED',
  'COMMUNITIES_RELATED' = 'COMMUNITIES_RELATED',
  'PLANET_RELATED' = 'PLANET_RELATED'
}
export enum ISdgType {
  'HEALTH' = 'HEALTH',
  'LIFE' = 'LIFE',
  'REDUCED_INEQUALITIES' = 'REDUCED_INEQUALITIES',
  'PEACE_JUSTICE' = 'PEACE_JUSTICE',
  'SUSTAINABLE_CITIES_COMMUNITIES' = 'SUSTAINABLE_CITIES_COMMUNITIES',
  'GENDER_EQUALITY' = 'GENDER_EQUALITY',
  'CLIMATE_ACTION' = 'CLIMATE_ACTION',
  'NO_POVERTY' = 'NO_POVERTY',
  'LIFE_BELOW_WATER' = 'LIFE_BELOW_WATER',
  'GOALS_PARTNERSHIPS' = 'GOALS_PARTNERSHIPS',
  'ZERO_HUNGER' = 'ZERO_HUNGER',
  'EDUCATION_QUALITY' = 'EDUCATION_QUALITY',
  'CLEAN_WATER_SANITATION' = 'CLEAN_WATER_SANITATION',
  'ENERGY' = 'ENERGY',
  'ECONOMIC_GROWTH' = 'ECONOMIC_GROWTH',
  'INDUSTRY_INNOVATION_INFRASTRUCTURE' = 'INDUSTRY_INNOVATION_INFRASTRUCTURE',
  'RESPONSIBLE_CONSUMPTION_PRODUCTION' = 'RESPONSIBLE_CONSUMPTION_PRODUCTION'
}
export enum IProjectType {
  'ONE_OFF' = 'ONE_OFF',
  'PART_TIME' = 'PART_TIME',
  'FULL_TIME' = 'FULL_TIME'
}
export enum IProjectStatusType {
  'DRAFT' = 'DRAFT',
  'EXPIRE' = 'EXPIRE',
  'ACTIVE' = 'ACTIVE'
}

export enum IProjectRemoteRreferenceType {
  'ONSITE' = 'ONSITE',
  'REMOTE' = 'REMOTE',
  'HYBRID' = 'HYBRID'
}
export enum IProjectLengthType {
  'LESS_THAN_A_DAY' = 'LESS_THAN_A_DAY',
  'LESS_THAN_A_MONTH' = 'LESS_THAN_A_MONTH',
  '1_3_MONTHS' = '1_3_MONTHS',
  '3_6_MONTHS' = '3_6_MONTHS',
  '6_MONTHS_OR_MORE' = '6_MONTHS_OR_MORE'
}
export enum IPaymentType {
  'VOLUNTEER' = 'VOLUNTEER',
  'PAID' = 'PAID'
}
export enum IPaymentSourceType {
  'CARD' = 'CARD',
  'CRYPTO_WALLET' = 'CRYPTO_WALLET'
}
export enum IPaymentServiceType {
  'STRIPE' = 'STRIPE',
  'CRYOTO' = 'CRYPTO'
}
export enum IPaymentSchemeType {
  'HOURLY' = 'HOURLY',
  'FIXED' = 'FIXED'
}
export enum IPaymentCurrencyType {
  'USD' = 'USD',
  'RWF' = 'RWF',
  'AUD' = 'AUD',
  'BDT' = 'BDT',
  'GTQ' = 'GTQ',
  'INR' = 'INR',
  'CHF' = 'CHF',
  'MXN' = 'MXN',
  'CAD' = 'CAD',
  'DOP' = 'DOP',
  'KRW' = 'KRW',
  'EUR' = 'EUR',
  'ZAR' = 'ZAR',
  'NPR' = 'NPR',
  'COP' = 'COP',
  'UYU' = 'UYU',
  'CRC' = 'CRC',
  'JPY' = 'JPY',
  'GBP' = 'GBP',
  'ARS' = 'ARS',
  'GHS' = 'GHS',
  'PEN' = 'PEN',
  'DKK' = 'DKK',
  'BRL' = 'BRL',
  'CLP' = 'CLP',
  'EGP' = 'EGP',
  'THB' = 'THB'
}
export enum IOtpType {
  'EMAIL' = 'EMAIL',
  'PHONE' = 'PHONE'
}
export enum IOtpPurposeType {
  'AUTH' = 'AUTH',
  'FORGET_PASSWORD' = 'FORGET_PASSWORD',
  'ACTIVATION' = 'ACTIVATION'
}
export enum IOrganizationType {
  'SOCIAL' = 'SOCIAL',
  'NONPROFIT' = 'NONPROFIT',
  'COOP' = 'COOP',
  'IIF' = 'IIF',
  'PUBLIC' = 'PUBLIC',
  'INTERGOV' = 'INTERGOV',
  'DEPARTMENT' = 'DEPARTMENT',
  'OTHER' = 'OTHER'
}
export enum IOrgStatusType {
  'ACTIVE' = 'ACTIVE',
  'INACTIVE' = 'INACTIVE',
  'SUSPEND' = 'SUSPEND'
}
export enum IOffersStatusType {
  'PENDING' = 'PENDING',
  'WITHDRAWN' = 'WITHDRAWN',
  'APPROVED' = 'APPROVED',
  'HIRED' = 'HIRED',
  'CLOSED' = 'CLOSED',
  'CANCELED' = 'CANCELED'
}
export enum IOauthConnectedProvidersType {
  'STRIPE' = 'STRIPE'
}
export enum INotificationType {
  'FOLLOWED' = 'FOLLOWED',
  'COMMENT_LIKE' = 'COMMENT_LIKE',
  'POST_LIKE' = 'POST_LIKE',
  'CHAT' = 'CHAT',
  'SHARE_POST' = 'SHARE_POST',
  'SHARE_PROJECT' = 'SHARE_PROJECT',
  'COMMENT' = 'COMMENT',
  'APPLICATION' = 'APPLICATION',
  'OFFER' = 'OFFER',
  'REJECT' = 'REJECT',
  'APPROVED' = 'APPROVED',
  'HIRED' = 'HIRED',
  'PROJECT_COMPLETE' = 'PROJECT_COMPLETE',
  'EMPLOYEE_CANCELED' = 'EMPLOYEE_CANCELED',
  'EMPLOYER_CANCELED' = 'EMPLOYER_CANCELED',
  'EMPLOYER_CONFIRMED' = 'EMPLOYER_CONFIRMED',
  'ASSIGNEE_CANCELED' = 'ASSIGNEE_CANCELED',
  'ASSIGNER_CANCELED' = 'ASSIGNER_CANCELED',
  'ASSIGNER_CONFIRMED' = 'ASSIGNER_CONFIRMED',
  'CONNECT' = 'CONNECT',
  'MEMBERED' = 'MEMBERED'
}
export enum IMissionStatusType {
  'ACTIVE' = 'ACTIVE',
  'COMPLETE' = 'COMPLETE',
  'CONFIRMED' = 'CONFIRMED',
  'CANCELED' = 'CANCELED',
  'KICKED_OUT' = 'KICKED_OUT'
}
export enum ILanguageLevelType {
  'BASIC' = 'BASIC',
  'CONVERSANT' = 'CONVERSANT',
  'PROFICIENT' = 'PROFICIENT',
  'FLUENT' = 'FLUENT',
  'NATIVE' = 'NATIVE'
}
export enum IIdentityType {
  'users' = 'users',
  'organizations' = 'organizations'
}
export enum IEmailServiceType {
  'SMTP' = 'SMTP',
  'SENDGRID' = 'SENDGRID',
  'TEST' = 'TEST'
}
export enum IConnectStatusType {
  'PENDING' = 'PENDING',
  'CONNECTED' = 'CONNECTED',
  'BLOCKED' = 'BLOCKED'
}
export enum IChatType {
  'CHAT' = 'CHAT',
  'GROUPED' = 'GROUPED',
  'CHANNEL' = 'CHANNEL'
}
export enum IChatMemberType {
  'MEMBER' = 'MEMBER',
  'ADMIN' = 'ADMIN'
}
export enum IApplicantsStatusType {
  'PENDING' = 'PENDING',
  'OFFERED' = 'OFFERED',
  'REJECTED' = 'REJECTED',
  'WITHDRAWN' = 'WITHDRAWN',
  'APPROVED' = 'APPROVED',
  'HIRED' = 'HIRED',
  'CLOSED' = 'CLOSED'
}

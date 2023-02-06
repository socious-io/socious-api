import {
  IImpactPointsHistoryEntity,
  IMissionsEntity,
  IOrganizationsEntity,
  IProjectsEntity,
  IJobCategoriesEntity,
  IOffersEntity
} from './types'

export interface IImpactPointHistoryAsso extends IImpactPointsHistoryEntity {
  mission?: IMissionsEntity | null
  project?: IProjectsEntity | null
  organization?: IOrganizationsEntity | null
  job_category?: IJobCategoriesEntity | null
  offer?: IOffersEntity | null
}

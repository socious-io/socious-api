import Router from '@koa/router';
import Project from '../models/project/index.js';
import Post from '../models/post/index.js';
import Org from '../models/organization/index.js';
import User from '../models/user/index.js';
import Applicant from '../models/applicant/index.js';
import Offer from '../models/offer/index.js';
import Mission from '../models/mission/index.js';
import {loginOptional} from '../utils/middlewares/authorization.js';

export const router = new Router();

router.get('/options', loginOptional, async (ctx) => {
  ctx.body = {
    projects: {
      filter_columns: Object.keys(Project.filterColumns),
      sort_columns: Project.sortColumns,
    },
    posts: {
      filter_columns: Object.keys(Post.filterColumns),
      sort_columns: Post.sortColumns,
    },
    organizations: {
      filter_columns: Object.keys(Org.filterColumns),
      sort_columns: Org.sortColumns,
    },
    users: {
      filter_columns: Object.keys(User.filterColumns),
      sort_columns: User.sortColumns,
    },
    applicants: {
      filter_columns: Object.keys(Applicant.filterColumns),
      sort_columns: Applicant.sortColumns,
    },
    missions: {
      filter_columns: Object.keys(Mission.filterColumns),
      sort_columns: Mission.sortColumns,
    },
    offers: {
      filter_columns: Object.keys(Offer.filterColumns),
      sort_columns: Offer.sortColumns,
    }
  };
});

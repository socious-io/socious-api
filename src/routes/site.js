import Router from '@koa/router';
import Project from '../models/project/index.js';
import Post from '../models/post/index.js';
import Org from '../models/organization/index.js';
import User from '../models/user/index.js';
import {
  loginOptional,
} from '../utils/middlewares/authorization.js';

export const router = new Router();

router.get('/options', loginOptional,  async (ctx) => {
  ctx.body = {
    projects: {
      filter_columns: Object.keys(Project.filterColumns),
      sort_columns: Project.sortColumns
    },
    posts: {
      filter_columns: Object.keys(Post.filterColumns),
      sort_columns: Post.sortColumns
    },
    organizations: {
      filter_columns: Object.keys(Org.filterColumns),
      sort_columns: Org.sortColumns
    },
    users: {
      filter_columns: Object.keys(User.filterColumns),
      sort_columns: User.sortColumns
    }
  }
});

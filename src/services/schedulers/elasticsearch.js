import { CronJob } from 'cron';
import { CRON_EVERY_HOUR } from './constants.js'
import elasticSearchProjectModel from '../elasticsearch/models/projects.js'


export default new CronJob(CRON_EVERY_HOUR, async () => {
  console.log(`Checking Project Indexes... Started at: ${new Date()}`);
  const { refreshedIndexes, count } = await elasticSearchProjectModel.refreshIndexes();
  console.log(`\tChecked ${count} Projects, Refreshed Indexes(${refreshedIndexes.length}) : ${refreshedIndexes}`);
  console.log(`Finished Checking Project Indexes... Ended at: ${new Date()}\n\n`);
});

import { CronJob } from 'cron';
import { CRON_DAILY_3AM } from './constants.js'
import { start as startIdealist } from '../idealist/index.js'
import { listProjects as startReliefWeb } from '../reliefweb/controller.js'

export default new CronJob(CRON_DAILY_3AM, async () => {
  console.log(`Job scrapers started at: ${new Date()}`);
  try {
    console.log('Starting Idealist scraper...');
    await startIdealist();
    console.log('Idealist scraper finished.');
  } catch (err) {
    console.log('Idealist scraper error:', err.message);
  }
  try {
    console.log('Starting ReliefWeb scraper...');
    await startReliefWeb();
    console.log('ReliefWeb scraper finished.');
  } catch (err) {
    console.log('ReliefWeb scraper error:', err.message);
  }
  console.log(`Job scrapers finished at: ${new Date()}\n\n`);
});

import { DataSource, QueryRunner } from "typeorm";

/**
 * Create a new query runner with the given data source.
 *
 * @remarks This serves as a quality of life wrapper leaving only the execution details
 * to the individual methods which needs to run within a transaction.
 *
 * @param dataSource - Data source to create a query runner under.
 * @param executor   - Executor method to run.
 *
 * @returns Result of the executor method.
 */
export async function transaction<R = any>(dataSource: DataSource, executor: TransactionExecutor<R>): Promise<R> {
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  try {
    const result = await executor(queryRunner);
    await queryRunner.commitTransaction();
    return result;
  } catch (err) {
    await queryRunner.rollbackTransaction();
    throw err;
  } finally {
    await queryRunner.release();
  }
}

type TransactionExecutor<R> = (queryRunner: QueryRunner) => Promise<R>;

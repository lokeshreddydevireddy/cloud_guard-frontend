/**
 * Background jobs — extend with cron / bullmq as needed.
 * Currently a placeholder that logs a heartbeat every 5 minutes so ops can
 * verify the worker is alive.
 */
export function startJobs() {
  const HEARTBEAT_MS = 5 * 60 * 1000;
  setInterval(() => {
    console.log(`[jobs] heartbeat ${new Date().toISOString()}`);
  }, HEARTBEAT_MS).unref();
}

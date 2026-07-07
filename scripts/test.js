const start = Date.now();

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function maybeFlakyFailure() {
  if (process.env.SIMULATE_FLAKY !== "1") {
    return false;
  }

  const configuredRate = Number.parseFloat(process.env.SIMULATE_FLAKY_RATE ?? "0.45");
  const failureRate = Number.isFinite(configuredRate)
    ? Math.min(Math.max(configuredRate, 0), 1)
    : 0.45;

  return Math.random() < failureRate;
}

async function main() {
  console.log("Test suite started...");

  for (let i = 1; i <= 6; i += 1) {
    await wait(650);
    console.log(`Test shard ${i}/6 complete`);
  }

  if (maybeFlakyFailure()) {
    console.error("Flaky timeout encountered in integration test.");
    process.exit(1);
  }

  console.log(`Tests complete in ${Date.now() - start}ms`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

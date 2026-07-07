const start = Date.now();

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Simulated downstream service used by the integration test.
// Locally it starts almost instantly. In CI (SIMULATE_FLAKY=1) its startup
// time jitters the way a shared runner's would; SIMULATE_FLAKY_RATE controls
// how often startup exceeds 100ms.
function startMockService() {
  let startupMs = 10;

  if (process.env.SIMULATE_FLAKY === "1") {
    const configuredRate = Number.parseFloat(process.env.SIMULATE_FLAKY_RATE ?? "0.3");
    const rate = Number.isFinite(configuredRate)
      ? Math.min(Math.max(configuredRate, 0), 0.95)
      : 0.3;
    const minMs = 60;
    const maxMs = (100 - minMs * rate) / (1 - rate);
    startupMs = minMs + Math.random() * (maxMs - minMs);
  }

  const service = { ready: false };
  const readyPromise = wait(startupMs).then(() => {
    service.ready = true;
  });
  service.whenReady = () => readyPromise;
  return service;
}

async function integrationTest() {
  const service = startMockService();

  // Give the service a moment to come up before connecting.
  await wait(100);

  if (!service.ready) {
    console.error(
      "Integration test failed: connection refused - service on port 8080 was not ready after 100ms."
    );
    process.exit(1);
  }

  console.log("Integration test complete (service ready)");
}

async function main() {
  console.log("Test suite started...");

  for (let i = 1; i <= 6; i += 1) {
    await wait(650);
    console.log(`Test shard ${i}/6 complete`);
  }

  await integrationTest();

  console.log(`Tests complete in ${Date.now() - start}ms`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

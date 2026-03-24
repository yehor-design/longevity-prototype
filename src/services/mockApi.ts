import { prototypeConfig } from "@/lib/prototype";

interface MockApiConfig {
  /** Minimum simulated latency in ms */
  minDelay?: number;
  /** Maximum simulated latency in ms */
  maxDelay?: number;
  /** Probability of simulated failure 0–1 */
  failureRate?: number;
}

interface MockApiResponse<T> {
  data: T | null;
  error: string | null;
  ok: boolean;
}

function randomDelay(min: number, max: number): Promise<void> {
  const ms = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Base mock API utility. Simulates async API behaviour with configurable
 * latency and optional failure simulation. All calls are purely client-side.
 */
export const mockApi = {
  async call<T>(
    dataFn: () => T,
    config: MockApiConfig = {}
  ): Promise<MockApiResponse<T>> {
    const {
      minDelay = prototypeConfig.mockApiDelay.min,
      maxDelay = prototypeConfig.mockApiDelay.max,
      failureRate = 0,
    } = config;

    await randomDelay(minDelay, maxDelay);

    if (failureRate > 0 && Math.random() < failureRate) {
      return { data: null, error: "Simulated server error", ok: false };
    }

    try {
      const data = dataFn();
      return { data, error: null, ok: true };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : "Unknown error",
        ok: false,
      };
    }
  },

  /** Simulate a successful void action (e.g. send OTP, update profile) */
  async action(config: MockApiConfig = {}): Promise<MockApiResponse<null>> {
    return mockApi.call(() => null, config);
  },
};

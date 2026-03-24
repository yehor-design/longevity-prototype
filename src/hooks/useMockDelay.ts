import { useState, useCallback } from "react";
import { prototypeConfig } from "@/lib/prototype";

/**
 * Provides a loading state that auto-resolves after a simulated API delay.
 * Used to add realistic async feel to prototype interactions.
 */
export function useMockDelay(
  customMin?: number,
  customMax?: number
) {
  const [loading, setLoading] = useState(false);

  const withDelay = useCallback(
    async <T>(fn: () => T | Promise<T>): Promise<T> => {
      const min = customMin ?? prototypeConfig.mockApiDelay.min;
      const max = customMax ?? prototypeConfig.mockApiDelay.max;
      const ms = Math.floor(Math.random() * (max - min + 1)) + min;

      setLoading(true);
      await new Promise((r) => setTimeout(r, ms));
      const result = await fn();
      setLoading(false);
      return result;
    },
    [customMin, customMax]
  );

  return { loading, withDelay };
}

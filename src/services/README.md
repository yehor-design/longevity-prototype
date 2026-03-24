# Mock API Service Layer

This directory contains the **client-side mock API infrastructure** for the DT Health prototype. There is no real backend — all data is simulated on the client.

## Structure

```
services/
├── mockApi.ts          # Base mock API utility with configurable latency
└── mockData/
    ├── users.ts        # Mock user profiles (patient, doctor, admin)
    └── index.ts        # Barrel export
```

## How to Use

```ts
import { mockApi } from "@/services/mockApi";
import { MOCK_PATIENT } from "@/services/mockData";

// Simulate an async data fetch with random latency
const result = await mockApi.call(() => MOCK_PATIENT);
if (result.ok) {
  console.log(result.data); // The mock patient object
}

// Simulate a void action (e.g. save, delete)
await mockApi.action({ failureRate: 0.1 }); // 10% chance of simulated error
```

## Adding Mock Data for New Flows

1. Create a new file in `mockData/` (e.g. `labResults.ts`)
2. Export typed mock objects that match the types in `src/types/`
3. Re-export from `mockData/index.ts`
4. Use via `mockApi.call(() => YOUR_MOCK_DATA)` in page components

## Configuration

Latency, failure rate, and other settings are controlled via `src/lib/prototype.ts`:

```ts
mockApiDelay: { min: 300, max: 800 }  // ms
```

## Important

- **Never add real network calls here** — this is a prototype only
- Keep mock data realistic (plausible names, dates, values)
- Follow the existing TypeScript interfaces in `src/types/`

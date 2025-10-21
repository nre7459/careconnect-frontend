import http from "k6/http";
import { check } from "k6";
import { BASE_URL, buildUrl } from "./config.js";

export const options = {
  scenarios: {
    heavy_ramp: {
      executor: "ramping-arrival-rate",
      startRate: __ENV.K6_HARDCORE_START_RATE ? parseInt(__ENV.K6_HARDCORE_START_RATE, 10) : 20,
      timeUnit: "1s",
      preAllocatedVUs: __ENV.K6_HARDCORE_PREALLOCATED ? parseInt(__ENV.K6_HARDCORE_PREALLOCATED, 10) : 50,
      maxVUs: __ENV.K6_HARDCORE_MAX_VUS ? parseInt(__ENV.K6_HARDCORE_MAX_VUS, 10) : 200,
      stages: [
        { target: __ENV.K6_HARDCORE_TARGET_RATE ? parseInt(__ENV.K6_HARDCORE_TARGET_RATE, 10) : 200, duration: "1m" },
        { target: __ENV.K6_HARDCORE_TARGET_RATE ? parseInt(__ENV.K6_HARDCORE_TARGET_RATE, 10) : 200, duration: "2m" },
        { target: (__ENV.K6_HARDCORE_TARGET_RATE ? parseInt(__ENV.K6_HARDCORE_TARGET_RATE, 10) : 200) * 2, duration: "1m" },
        { target: 0, duration: "30s" },
      ],
    },
  },
  thresholds: {
    http_req_duration: ["p(99)<1200", "avg<400"],
    http_req_failed: ["rate<0.02"],
  },
};

export default function hardcoreTest() {
  const response = http.get(buildUrl("/"));

  check(response, {
    "home status is 200": (res) => res.status === 200,
  });
}

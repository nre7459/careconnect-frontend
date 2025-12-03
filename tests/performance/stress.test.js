import http from "k6/http";
import { sleep, check } from "k6";
import { BASE_URL, buildUrl } from "./config.js";

export const options = {
  stages: [
    { duration: "30s", target: __ENV.K6_STRESS_TARGET ? parseInt(__ENV.K6_STRESS_TARGET, 10) : 50 },
    { duration: "1m", target: __ENV.K6_STRESS_TARGET ? parseInt(__ENV.K6_STRESS_TARGET, 10) : 50 },
    { duration: "30s", target: 0 },
  ],
  thresholds: {
    http_req_duration: ["p(95)<800"],
    checks: ["rate>0.98"],
  },
};

export default function stressTest() {
  const response = http.get(buildUrl("/"));

  check(response, {
    "home status is 200": (res) => res.status === 200,
  });

  sleep(__ENV.K6_SLEEP ? parseFloat(__ENV.K6_SLEEP) : 1);
}

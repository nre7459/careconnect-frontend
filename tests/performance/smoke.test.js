import http from "k6/http";
import { sleep, check } from "k6";
import { BASE_URL, PAGES, buildUrl } from "./config.js";

export const options = {
  vus: __ENV.K6_VUS ? parseInt(__ENV.K6_VUS, 10) : 5,
  duration: __ENV.K6_DURATION || "30s",
  thresholds: {
    http_req_duration: ["p(95)<500"],
    checks: ["rate>0.99"],
  },
};

export default function smokeTest() {
  PAGES.forEach((page) => {
    const response = http.get(buildUrl(page.path));

    check(response, {
      [`${page.name} status is 200`]: (res) => res.status === 200,
    });

    sleep(1);
  });
}

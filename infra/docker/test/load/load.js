import http from 'k6/http';
import { sleep, check } from 'k6';
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

export const options = {
  // discardResponseBodies: true,
  scenarios: {
    noLoad: {
      executor: 'constant-vus',
      exec: 'noLoad',
      vus: 50,
      duration: '15m',
    },
    failor: {
      executor: 'constant-vus',
      exec: 'error',
      vus: 30,
      duration: '15m',
    },
    refreshAccessToken: {
      executor: 'constant-vus',
      exec: 'refreshAccessToken',
      vus: 5,
      duration: '15m',
    },
    login: {
      executor: 'constant-vus',
      exec: 'login',
      vus: 1,
      duration: '15m',
    },
    breakingSlo: {
      executor: 'per-vu-iterations',
      exec: 'breakingSlo',
      vus: 50,
      iterations: 100,
      startTime: '2m',
      maxDuration: '1m',
    },
  },
};

export function setup() {
  const data = JSON.stringify({
    password: __ENV.USER_PASSWORD,
    email: __ENV.USER_EMAIL,
  });

  const res = http.post(
    'http://localhost:8080/auth/token?grant_type=password',
    data,
    { headers: { 'Content-Type': 'application/json' } },
  );

  if (res.status === 200) {
    return {
      accessToken: JSON.parse(res.body).access_token,
      refreshToken: JSON.parse(res.body).refresh_token,
    };
  }

  return {};
}

export function noLoad() {
  http.get('http://localhost:8080/auth/health');
}

export function login() {
  const data = JSON.stringify({
    password: __ENV.USER_PASSWORD,
    email: __ENV.USER_EMAIL,
  });

  const res = http.post(
    'http://localhost:8080/auth/token?grant_type=password',
    data,
    { headers: { 'Content-Type': 'application/json' } },
  );

  check(res, {
    'success login': (r) => {
      return r.status === 200;
    },
  });
}

export function refreshAccessToken({ refreshToken }) {
  const data = JSON.stringify({
    refresh_token: refreshToken,
  });

  const res = http.post(
    'http://localhost:8080/auth/token?grant_type=refresh_token',
    data,
    { headers: { 'Content-Type': 'application/json' } },
  );

  check(res, {
    'refresh access token': (r) => {
      return r.status === 200;
    },
  });
}

export function breakingSlo({ accessToken }) {
  http.get('http://localhost:8080/auth/user', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function error() {
  const expr = randomIntBetween(1, 4);
  switch (expr) {
    case 1:
      http.get('http://localhost:8080/auth/user');
      break;
    case 2:
      http.get('http://localhost:8080/auth/not-found');
      break;
    case 3:
      http.post(
        'http://localhost:8080/auth/token?grant_type=password',
        JSON.stringify({
          password: '',
          email: __ENV.USER_EMAIL,
        }),
        { headers: { 'Content-Type': 'application/json' } },
      );
      break;
    case 4:
      http.post(
        'http://localhost:8080/auth/token?grant_type=refresh_token',
        JSON.stringify({ refresh_token: 12345 }),
        { headers: { 'Content-Type': 'application/json' } },
      );
      break;
    default:
  }
}

// export function differentPath() {
//   const expr = randomIntBetween(1, 5);
//   switch (expr) {
//     case 1:
//       http.get('http://localhost:8080/httpbin/cache');
//       break;
//     case 2:
//       http.get('http://localhost:8080/httpbin/ip');
//     case 3:
//       http.get('http://localhost:8080/httpbin/headers');
//       break;
//     case 4:
//       http.get('http://localhost:8080/httpbin/user-agent');
//       break;
//     case 5:
//       http.get('http://localhost:8080/httpbin/image');
//       break;
//   }

//   const random = randomIntBetween(1, 7)
//   if (random == 1) {
//     http.get('http://localhost:8080/httpbin/status/500');
//     sleep(1); // sleep between 1
//   }
// }

// export function differentMethod() {
//   let payload;
//   let params;

//   payload = JSON.stringify({
//     content: 'aaa',
//   });

//   params = {
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   };

//   const expr = randomIntBetween(1, 5);
//   switch (expr) {
//     case 1:
//       http.post("http://localhost:8080/httpbin/post", payload, params);
//       break;
//     case 2:
//       http.patch("http://localhost:8080/httpbin/patch", payload, params);
//       break;
//     case 3:
//       http.del("http://localhost:8080/httpbin/delete", payload, params);
//       break;
//     case 4:
//       http.put("http://localhost:8080/httpbin/put", payload, params);
//       break;
//     case 5:
//       http.post("http://localhost:8080/httpbin/response-headers", payload, params);
//       break;
//     default:
//   }

// }

import { BASE_URL, TIMEOUT } from '../config';

/**
 * Standard API Client
 * Executes HTTP requests with timeout, error standardization, and JSON parsing.
 * 
 * @param {'GET'|'POST'|'PATCH'|'PUT'|'DELETE'} method
 * @param {string} endpoint - e.g. '/students/1' or full URL
 * @param {any} [body=null]
 * @returns {Promise<any>}
 * @throws {{ type: 'network'|'timeout'|'http', status: number, message: string }}
 */
export async function request(method, endpoint, body = null) {
  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT);

  try {
    const options = {
      method: method.toUpperCase(),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    };

    if (body && ['POST', 'PATCH', 'PUT'].includes(options.method)) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      let errMsg = `Lỗi máy chủ (${response.status})`;
      try {
        const errJson = await response.json();
        if (errJson && errJson.message) {
          errMsg = errJson.message;
        }
      } catch (_) {
        // ignore JSON parse error on non-ok responses
      }

      const error = {
        type: 'http',
        status: response.status,
        message: errMsg,
      };
      throw error;
    }

    // Parse JSON safely
    const text = await response.text();
    return text ? JSON.parse(text) : {};
  } catch (err) {
    if (err.type === 'http') {
      throw err;
    }
    if (err.name === 'AbortError') {
      throw {
        type: 'timeout',
        status: 0,
        message: 'Hết thời gian chờ kết nối đến máy chủ (10 giây).',
      };
    }
    throw {
      type: 'network',
      status: 0,
      message: 'Không thể kết nối tới máy chủ. Vui lòng kiểm tra mạng hoặc json-server.',
    };
  } finally {
    clearTimeout(timer);
  }
}

export default {
  request,
};

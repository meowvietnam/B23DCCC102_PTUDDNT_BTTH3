import { request } from './client';

/**
 * Student Service
 */

export function getById(id = 1) {
  return request('GET', `/students/${id}`);
}

export function update(id = 1, data = {}) {
  return request('PATCH', `/students/${id}`, data);
}

export function getAll() {
  return request('GET', '/students');
}

export default {
  getById,
  update,
  getAll,
};

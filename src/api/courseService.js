import { request } from './client';

/**
 * Course Service
 */

export function getAll() {
  return request('GET', '/courses');
}

export function getById(id) {
  return request('GET', `/courses/${id}`);
}

export function create(data) {
  return request('POST', '/courses', data);
}

export function update(id, data) {
  return request('PATCH', `/courses/${id}`, data);
}

export default {
  getAll,
  getById,
  create,
  update,
};

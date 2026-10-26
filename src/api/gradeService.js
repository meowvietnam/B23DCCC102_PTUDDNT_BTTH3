import { request } from './client';

/**
 * Grade Service
 */

export function getAll() {
  return request('GET', '/grades?_expand=course');
}

export function getById(id) {
  return request('GET', `/grades/${id}?_expand=course`);
}

export function create(data) {
  return request('POST', '/grades', data);
}

export function update(id, data) {
  return request('PATCH', `/grades/${id}`, data);
}

export default {
  getAll,
  getById,
  create,
  update,
};

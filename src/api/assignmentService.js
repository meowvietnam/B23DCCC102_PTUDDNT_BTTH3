import { request } from './client';

/**
 * Assignment Service
 */

export function getAll() {
  return request('GET', '/assignments?_expand=course&_sort=dueDate');
}

export function getById(id) {
  return request('GET', `/assignments/${id}?_expand=course`);
}

export function getByCourseId(courseId) {
  return request('GET', `/assignments?courseId=${courseId}`);
}

export function create(data) {
  return request('POST', '/assignments', data);
}

export function update(id, data) {
  return request('PATCH', `/assignments/${id}`, data);
}

export default {
  getAll,
  getById,
  getByCourseId,
  create,
  update,
};

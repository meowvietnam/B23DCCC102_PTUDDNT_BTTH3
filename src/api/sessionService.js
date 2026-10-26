import { request } from './client';

/**
 * Session Service (Timetable)
 */

export function getAll() {
  return request('GET', '/sessions?_expand=course');
}

export function getById(id) {
  return request('GET', `/sessions/${id}?_expand=course`);
}

export function getByCourseId(courseId) {
  return request('GET', `/sessions?courseId=${courseId}`);
}

export function create(data) {
  return request('POST', '/sessions', data);
}

export function update(id, data) {
  return request('PATCH', `/sessions/${id}`, data);
}

export default {
  getAll,
  getById,
  getByCourseId,
  create,
  update,
};

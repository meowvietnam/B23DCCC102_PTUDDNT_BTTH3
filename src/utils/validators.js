/**
 * Input validators
 */

/**
 * Validates new assignment inputs
 * @param {{ title: string, dueDate: string, courseId?: any }} data
 * @returns {{ isValid: boolean, errors: Object }}
 */
export function validateAssignment(data) {
  const errors = {};

  if (!data?.title || !data.title.trim()) {
    errors.title = 'Tiêu đề không được để trống';
  }

  if (!data?.dueDate) {
    errors.dueDate = 'Vui lòng chọn hạn nộp';
  } else {
    const dueTime = new Date(data.dueDate).getTime();
    if (isNaN(dueTime)) {
      errors.dueDate = 'Định dạng ngày hạn nộp không hợp lệ';
    } else if (dueTime < Date.now()) {
      errors.dueDate = 'Hạn nộp không được ở trong quá khứ';
    }
  }

  if (!data?.courseId) {
    errors.courseId = 'Vui lòng chọn môn học';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validates student profile updates
 * @param {{ fullName: string, email: string, phone: string }} data
 * @returns {{ isValid: boolean, errors: Object }}
 */
export function validateStudentProfile(data) {
  const errors = {};

  if (!data?.fullName || !data.fullName.trim()) {
    errors.fullName = 'Họ và tên không được để trống';
  }

  if (!data?.email || !data.email.trim()) {
    errors.email = 'Email không được để trống';
  } else if (!/\S+@\S+\.\S+/.test(data.email)) {
    errors.email = 'Địa chỉ email không hợp lệ';
  }

  if (!data?.phone || !data.phone.trim()) {
    errors.phone = 'Số điện thoại không được để trống';
  } else if (!/^[0-9+]{9,15}$/.test(data.phone.trim())) {
    errors.phone = 'Số điện thoại không hợp lệ (từ 9 đến 15 số)';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

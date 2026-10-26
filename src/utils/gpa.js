/**
 * Utility functions for GPA conversion and calculation
 */

/**
 * Converts 10-point scale grade to 4-point scale
 * @param {number} score10
 * @returns {{ scale4: number, letter: string }}
 */
export function toScale4(score10) {
  const score = Number(score10);
  if (isNaN(score)) return { scale4: 0, letter: 'F' };

  if (score >= 8.5) return { scale4: 4.0, letter: 'A' };
  if (score >= 8.0) return { scale4: 3.5, letter: 'B+' };
  if (score >= 7.0) return { scale4: 3.0, letter: 'B' };
  if (score >= 6.5) return { scale4: 2.5, letter: 'C+' };
  if (score >= 5.5) return { scale4: 2.0, letter: 'C' };
  if (score >= 5.0) return { scale4: 1.5, letter: 'D+' };
  if (score >= 4.0) return { scale4: 1.0, letter: 'D' };
  return { scale4: 0.0, letter: 'F' };
}

/**
 * Calculates cumulative GPA on a 4.0 scale with credit weights
 * Also calculates total accumulated credits (excluding courses with letter 'F')
 * @param {Array<Object>} grades
 * @param {Array<Object>} [courses=[]]
 * @returns {{ gpa: number, totalCredits: number, accumulatedCredits: number }}
 */
export function calcGpa(grades = [], courses = []) {
  if (!Array.isArray(grades) || grades.length === 0) {
    return { gpa: 0.0, totalCredits: 0, accumulatedCredits: 0 };
  }

  const courseMap = new Map();
  if (Array.isArray(courses)) {
    courses.forEach(c => courseMap.set(c.id, c));
  }

  let totalWeightedScore = 0;
  let totalCredits = 0;
  let accumulatedCredits = 0;

  grades.forEach(grade => {
    // Determine credits: from grade.course.credits, or mapped courses, or grade.credits, default 3
    const course = grade.course || courseMap.get(grade.courseId);
    const credits = course?.credits || grade.credits || 3;

    let scale4 = 0;
    if (grade.letter) {
      switch (grade.letter) {
        case 'A': scale4 = 4.0; break;
        case 'B+': scale4 = 3.5; break;
        case 'B': scale4 = 3.0; break;
        case 'C+': scale4 = 2.5; break;
        case 'C': scale4 = 2.0; break;
        case 'D+': scale4 = 1.5; break;
        case 'D': scale4 = 1.0; break;
        case 'F': scale4 = 0.0; break;
        default:
          scale4 = toScale4(grade.total).scale4;
      }
    } else if (grade.total !== undefined) {
      scale4 = toScale4(grade.total).scale4;
    }

    totalWeightedScore += scale4 * credits;
    totalCredits += credits;

    // Courses with F do not count towards accumulated credits
    if (scale4 > 0) {
      accumulatedCredits += credits;
    }
  });

  const gpa = totalCredits > 0 ? Number((totalWeightedScore / totalCredits).toFixed(2)) : 0.0;

  return {
    gpa,
    totalCredits,
    accumulatedCredits,
  };
}

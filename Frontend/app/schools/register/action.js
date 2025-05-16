'use client';

import axios from 'axios';

export async function registerOrganization(body) {
  try {
    const response = await axios.post('http://localhost:5000/api/organization/register', body, {
      headers: { 'Content-Type': 'application/json' },
    });

    const data = response.data;

    return {
      success: true,
      organizationId: data.organizationId || data.schoolId,
    };
  } catch (err) {
    return {
      success: false,
      error: err.response?.data?.message || err.message || 'Something went wrong with organization registration',
    };
  }
}

export async function registerClasses(classes, organizationId) {
  try {
    let classResults = [];

    for (const className of classes) {
      let type = 'primary';
      if (['Nursery', 'LKG', 'UKG'].includes(className)) {
        type = 'pre-primary';
      } else if (parseInt(className) >= 6 && parseInt(className) <= 8) {
        type = 'middle';
      } else if (parseInt(className) >= 9) {
        type = 'secondary';
      }

      const classData = {
        name: className,
        section: 'A',
        type,
        schoolId: organizationId,
      };

      try {
        const response = await axios.post('http://localhost:5000/api/classes', classData, {
          headers: { 'Content-Type': 'application/json' },
        });

        classResults.push(response.data);
      } catch (err) {
        console.error(`Failed to create class ${className}:`, err.response?.data || err.message);
        continue;
      }
    }

    if (classResults.length === 0) {
      throw new Error('Failed to create any classes');
    }

    return {
      success: true,
      classIds: classResults.map((c) => c._id),
      classResults,
    };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function registerAcademicYear(academicYear, organizationId) {
  try {
    const payload = {
      ...academicYear,
      schoolId: organizationId,
    };

    const response = await axios.post('http://localhost:5000/api/academics', payload, {
      headers: { 'Content-Type': 'application/json' },
    });

    const data = response.data;

    return {
      success: true,
      academicId: data.academicId || data._id,
    };
  } catch (err) {
    return {
      success: false,
      error: err.response?.data?.message || err.message || 'Something went wrong with academic year registration',
    };
  }
}

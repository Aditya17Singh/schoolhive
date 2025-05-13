'use client';

export async function registerSchool(body) {
  console.log(body, 'body');
  
  try {
    // Step 1: Register the school (organization)
    const schoolRes = await fetch(`http://localhost:5000/api/organization/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body), // Assuming body.school contains the organization data
    });
    const schoolData = await schoolRes.json();
    if (!schoolRes.ok) throw new Error(schoolData.message || 'Something went wrong with school registration');
    
    // Step 2: Register classes
    // Use the correct class creation route (POST /api/classes)
    const classRes = await fetch(`http://localhost:5000/api/classes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...body.classes, organization: schoolData.schoolId }), // Assuming body.classes contains the class data, and we link it to the school
    });
    const classData = await classRes.json();
    if (!classRes.ok) throw new Error(classData.message || 'Something went wrong with class registration');
    
    // Step 3: Register academic year
    const academicRes = await fetch(`http://localhost:5000/api/academics/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body.academic), // Assuming body.academic contains the academic year data
    });
    const academicData = await academicRes.json();
    if (!academicRes.ok) throw new Error(academicData.message || 'Something went wrong with academic year registration');
    
    return { success: true, schoolId: schoolData.schoolId, classId: classData.classId, academicId: academicData.academicId };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

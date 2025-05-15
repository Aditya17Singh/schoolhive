'use client';

// Modified action.js
export async function registerOrganization(body) {
  console.log('Registering organization:', body);

  try {
    const response = await fetch(`http://localhost:5000/api/organization/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Something went wrong with organization registration');

    return {
      success: true,
      organizationId: data.organizationId || data.schoolId,
      token: data.token // Store the authentication token returned from the API
    };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function registerClasses(classes, organizationId) {

  try {
    // Create an array to store the results of all class creations
    let classResults = [];

    // Process each class individually
    for (const className of classes) {
      // Determine the appropriate class type based on the class name
      let type = "primary"; // Default
      if (["Nursery", "LKG", "UKG"].includes(className)) {
        type = "pre-primary";
      } else if (parseInt(className) >= 6 && parseInt(className) <= 8) {
        type = "middle";
      } else if (parseInt(className) >= 9) {
        type = "secondary";
      }

      // Prepare data for class creation
      const classData = {
        name: className,
        section: "A",
        type: type,
        schoolId: organizationId
      };

      // Send the request to create this class
      const response = await fetch(`http://localhost:5000/api/classes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(classData),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(`Failed to create class ${className}:`, data);
        continue; // Continue with other classes even if one fails
      }

      classResults.push(data);
    }

    if (classResults.length === 0) {
      throw new Error('Failed to create any classes');
    }

    return {
      success: true,
      classIds: classResults.map(c => c._id),
      classResults: classResults
    };

  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function registerAcademicYear(academicYear, organizationId) {
  console.log('Registering academic year:', academicYear, 'for organization:', organizationId);

  try {
    // Update the payload to match what the backend expects
    const payload = {
      ...academicYear,
      schoolId: organizationId  // Ensure we're using schoolId instead of organization
    };

    const response = await fetch(`http://localhost:5000/api/academics`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || data.error || 'Something went wrong with academic year registration');

    return { success: true, academicId: data.academicId || data._id };
  } catch (err) {
    return { success: false, error: err.message };
  }
}
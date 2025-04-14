'use server';

export async function registerSchool(body) {
  try {
    const res = await fetch(`http://localhost:5000/api/schools/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Something went wrong');

    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

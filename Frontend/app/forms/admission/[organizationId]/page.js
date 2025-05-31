'use client'

import { useParams } from 'next/navigation'
import StudentForm from '@/components/application-form' 

export default function AdmissionPage() {
  const { organizationId } = useParams()

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Student Admission Form</h1>
      <StudentForm orgId={organizationId} />
    </div>
  )
}
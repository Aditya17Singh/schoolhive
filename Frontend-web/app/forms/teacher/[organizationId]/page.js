'use client'

import { useParams } from 'next/navigation'
import TeacherForm from '@/components/new-teacher'

export default function TeacherAdmissionPage() {
  const { organizationId } = useParams()

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Teacher Application Form</h1>
      <TeacherForm orgId={organizationId} />
    </div>
  )
}

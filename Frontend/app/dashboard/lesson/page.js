'use client';

import  { useState } from 'react';
import LessonList from "@/components/lessonList";
import LessonForm from "@/components/lessonForm";

const LessonPage = () => {
  const [editingLessonId, setEditingLessonId] = useState(null);

  return (
    <div>
      <LessonList />
      <LessonForm lessonId={editingLessonId} />
    </div>
  );
};

export default LessonPage;

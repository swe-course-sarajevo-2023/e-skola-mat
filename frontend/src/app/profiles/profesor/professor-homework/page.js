'use client';
import { useProtectedRoute } from '@/hooks';
import ProfessorHomeworkView from '@/views/professor-homework-view';

const Homework = () => {
	const ProtectedStudentView = useProtectedRoute(ProfessorHomeworkView);

	return <ProtectedStudentView />;
};

export default Homework;

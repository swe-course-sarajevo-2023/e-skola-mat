'use client';
import { useProtectedRoute } from '@/hooks';
import HomeworkView from '@/views/homework-view';

const Homework = ({ params }) => {
	const ProtectedStudentView = useProtectedRoute(HomeworkView);

	return <ProtectedStudentView id={params.id} />;
};

export default Homework;

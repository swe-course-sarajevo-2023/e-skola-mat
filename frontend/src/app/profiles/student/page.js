'use client';
import useProtectedRoute from '@/hooks/useProtectedRoute';
import StudentView from '@/views/student-view';

const Ucenik = () => {
	const ProtectedStudentView = useProtectedRoute(StudentView);

	return <ProtectedStudentView />;
};

export default Ucenik;

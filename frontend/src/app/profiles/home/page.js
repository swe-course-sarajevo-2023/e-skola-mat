'use client';
import useProtectedRoute from '@/hooks/useProtectedRoute';
import StudentHomeView from '@/views/student-home-view';

const StudentHome = () => {
	const ProtectedStudentView = useProtectedRoute(StudentHomeView);

	return <ProtectedStudentView />;
};

export default StudentHome;

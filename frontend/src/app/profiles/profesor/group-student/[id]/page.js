'use client';
import { useProtectedRoute } from '@/hooks';
import StudentGroupView from '@/views/group-student-view';

const Ucenik = ({ params }) => {
	const ProtectedStudentView = useProtectedRoute(StudentGroupView);

	return <ProtectedStudentView grupa={params.id} />;
};

export default Ucenik;

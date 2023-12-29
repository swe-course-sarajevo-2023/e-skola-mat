'use client';
import ProfessorGroupView from '@/views/professor-group-view';
import { useProtectedRoute } from '@/hooks';

const ProfessorGroup = ({ params }) => {
	const ProtectedStudentView = useProtectedRoute(ProfessorGroupView);

	return <ProtectedStudentView grupa={params.id} />;
};

export default ProfessorGroup;

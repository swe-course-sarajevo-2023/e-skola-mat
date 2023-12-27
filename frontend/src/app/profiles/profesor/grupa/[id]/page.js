'use client';
import ProfessorGroupView from '@/views/professor-group-view';
import { useProtectedRoute } from '@/hooks';

const ProfessorGroup = ({ params }) => {
	return <ProfessorGroupView grupa={params.id} />;
};

export default useProtectedRoute(ProfessorGroup);

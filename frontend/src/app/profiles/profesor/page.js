'use client';
import { useProtectedRoute } from '@/hooks';
import ProfesorHomepageView from '@/views/professor-homepage-view';

const ProfesorHomepage = () => {
	const ProtectedStudentView = useProtectedRoute(ProfesorHomepageView);

	return <ProtectedStudentView />;
};

export default ProfesorHomepage;

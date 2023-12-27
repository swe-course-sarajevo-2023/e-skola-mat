'use client';
import { useProtectedRoute } from '@/hooks';
import ProfesorHomepageView from '@/views/professor-homepage-view';

const ProfesorHomepage = () => {
	return <ProfesorHomepageView />;
};

export default useProtectedRoute(ProfesorHomepage);

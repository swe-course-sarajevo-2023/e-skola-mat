'use client';
import { useProtectedRoute } from '@/hooks';
import GroupsHomeworkView from '@/views/groups-homework-view';

const GroupsHomework = ({ params }) => {
	const ProtectedStudentView = useProtectedRoute(GroupsHomeworkView);

	return <ProtectedStudentView zadaca={params.id} />;
};

export default GroupsHomework;

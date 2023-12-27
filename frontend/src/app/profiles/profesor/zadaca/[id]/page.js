'use client';
import { useProtectedRoute } from '@/hooks';
import GroupsHomeworkView from '@/views/groups-homework-view';

const GroupsHomework = ({ params }) => {
	return <GroupsHomeworkView zadaca={params.id} />;
};

export default useProtectedRoute(GroupsHomework);

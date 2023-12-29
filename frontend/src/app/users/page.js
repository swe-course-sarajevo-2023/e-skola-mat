'use client';
import { useProtectedRoute } from '@/hooks';
import UsersView from '@/views/users-view';

const Users = () => {
	const ProtectedStudentView = useProtectedRoute(UsersView);

	return <ProtectedStudentView />;
};

export default Users;

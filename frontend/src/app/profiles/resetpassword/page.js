'use client';
import ResetPasswordView from '@/views/reset-password-view';
import { useProtectedRoute } from '@/hooks';

const ResetPassword = () => {
	const ProtectedStudentView = useProtectedRoute(ResetPasswordView);

	return <ProtectedStudentView />;
};
export default ResetPassword;

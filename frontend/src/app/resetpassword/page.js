'use client';
import ResetPasswordView from '@/views/reset-password-view';
import { useProtectedRoute } from '@/hooks';

const ResetPassword = () => {
	return <ResetPasswordView />;
};
export default useProtectedRoute(ResetPassword);

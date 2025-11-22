import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../../store/store';
import { loginWithGoogle } from '../../store/slices/auth.slice';
import { toast } from 'react-toastify';
import Icon from '../../components/Icon/Icon';

const LoginPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, error, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isAuthenticated && !isLoading && user) {
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 100);
    }
  }, [isAuthenticated, isLoading, user, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    const loadGoogleScript = () => {
      if (!(window as any).google) {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);

        script.onload = () => {
          initializeGoogleSignIn();
        };
      } else {
        initializeGoogleSignIn();
      }
    };

    const initializeGoogleSignIn = () => {
      const google = (window as any).google;
      if (!google) {
        console.error('Google Sign-In script chưa được load');
        return;
      }

      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

      if (!clientId || clientId === 'your-google-client-id') {
        console.error('VITE_GOOGLE_CLIENT_ID chưa được cấu hình');
        toast.error('Google Client ID chưa được cấu hình');
        return;
      }

      console.log('Initializing Google Sign-In with Client ID:', clientId.substring(0, 20) + '...');
      console.log('Current origin:', window.location.origin);

      google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
        ux_mode: 'popup'
      });

      const buttonElement = document.getElementById('google-signin-button');
      if (buttonElement) {
        google.accounts.id.renderButton(buttonElement, {
          theme: 'outline',
          size: 'large',
          width: 300,
          text: 'signin_with',
          locale: 'vi'
        });
      }
    };

    const handleCredentialResponse = async (response: { credential: string }) => {
      try {
        console.log('🔄 Processing Google login...');
        const result = await dispatch(loginWithGoogle(response.credential)).unwrap();
        console.log('✅ Login successful, user:', result);
        console.log('✅ Redux state updated, isAuthenticated should be true');

        setTimeout(() => {
          console.log('🔄 Navigating to home page...');
          console.log('🔄 Current auth state:', { isAuthenticated, user: user?.email });
          toast.success('Đăng nhập thành công!');
          navigate('/', { replace: true });
        }, 800);
      } catch (error: any) {
        console.error('❌ Login error:', error);
        toast.error(error || 'Đăng nhập thất bại');
      }
    };

    loadGoogleScript();
  }, [dispatch, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <Icon icon="mdi:calendar-check" size={64} className="mx-auto text-primary-500 mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Schedule 18
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Quản lý công việc cá nhân và nhóm
          </p>
        </div>

        <div className="space-y-4">
          <div id="google-signin-button" className="flex justify-center"></div>

          {isLoading && (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            </div>
          )}
        </div>

        <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-6">
          Bằng cách đăng nhập, bạn đồng ý với các điều khoản sử dụng của chúng tôi
        </p>
      </div>
    </div>
  );
};

export default LoginPage;


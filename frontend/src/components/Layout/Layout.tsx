import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { logout } from '../../store/slices/auth.slice';
import Icon from '../Icon/Icon';
import { useState } from 'react';

const Layout = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-[#222831]/95 dark:bg-gray-900">
      <aside className="w-64 bg-[#353E55] dark:bg-gray-800 shadow-lg text-white">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            Schedule 18
          </h1>
        </div>

        <nav className="px-4 space-y-2 ">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-900 focus:bg-gray-800 focus:border-l-4 dark:hover:bg-gray-700 transition-colors"
          >
            <Icon icon="mdi:calendar-check" size={20} />
            <span>Công việc cá nhân</span>
          </Link>

          <Link
            to="/projects"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-900 focus:bg-gray-800 focus:border-l-4 dark:hover:bg-gray-700 transition-colors"

          >
            <Icon icon="mdi:folder-multiple" size={20} />
            <span>Dự án nhóm</span>
          </Link>

          <Link
            to="/labels"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-900 focus:bg-gray-800 focus:border-l-4 dark:hover:bg-gray-700 transition-colors"
          >
            <Icon icon="mdi:label" size={20} />
            <span>Nhãn dán</span>
          </Link>

          <Link
            to="/profile"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-900 focus:bg-gray-800 focus:border-l-4 dark:hover:bg-gray-700 transition-colors"
          >
            <Icon icon="mdi:account" size={20} />
            <span>Hồ sơ</span>
          </Link>

          {user?.role === 'admin' && (
            <Link
              to="/admin"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-900 focus:bg-gray-800 focus:border-l-4 dark:hover:bg-gray-700 transition-colors"
            >
              <Icon icon="mdi:shield-crown" size={20} />
              <span>Quản trị</span>
            </Link>
          )}
        </nav>

        <div className="absolute bottom-0 w-64 p-4 border-t border-gray-900 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            {user?.picture ? (
              <img
                src={user.picture}
                alt={user.name}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium dark:text-white truncate">
                {user?.name}
              </p>
              <p className="text-xs dark:text-gray-400 truncate">
                {user?.email}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <Icon icon="mdi:logout" size={18} />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto text-white">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;


import { useEffect, useState } from 'react';
import { getUsers, toggleUserStatus, getStatistics, getSystemConfig, updateSystemConfig } from '../../services/admin.service';
import { toast } from 'react-toastify';
import Icon from '../../components/Icon/Icon';

const AdminDashboard = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [statistics, setStatistics] = useState<any>(null);
  const [config, setConfig] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'users' | 'statistics' | 'config'>('users');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [usersRes, statsRes, configRes] = await Promise.all([
        getUsers({ search: searchTerm }),
        getStatistics(),
        getSystemConfig()
      ]);
      setUsers(usersRes.users);
      setStatistics(statsRes);
      setConfig(configRes.config);
    } catch (error: any) {
      toast.error(error || 'Tải dữ liệu thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleUserStatus = async (userId: string, isActive: boolean) => {
    try {
      await toggleUserStatus(userId, !isActive);
      toast.success(`Đã ${!isActive ? 'Mở Khóa' : 'Khóa'} người dùng`);
      loadData();
    } catch (error: any) {
      toast.error(error || 'Thao tác thất bại');
    }
  };

  const handleUpdateConfig = async (data: any) => {
    try {
      await updateSystemConfig(data);
      toast.success('Cập nhật cấu hình thành công');
      loadData();
    } catch (error: any) {
      toast.error(error || 'Cập nhật cấu hình thất bại');
    }
  };

  if (isLoading && !statistics) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold dark:text-white mb-6">
        Quản trị hệ thống
      </h1>

      <div className="flex gap-4 mb-6 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 font-medium transition-colors ${activeTab === 'users'
            ? 'text-primary-600 border-b-2 border-primary-600'
            : 'text-gray-600 dark:text-gray-400'
            }`}
        >
          Người dùng
        </button>
        <button
          onClick={() => setActiveTab('statistics')}
          className={`px-4 py-2 font-medium transition-colors ${activeTab === 'statistics'
            ? 'text-primary-600 border-b-2 border-primary-600'
            : 'text-gray-600 dark:text-gray-400'
            }`}
        >
          Thống kê
        </button>
        <button
          onClick={() => setActiveTab('config')}
          className={`px-4 py-2 font-medium transition-colors ${activeTab === 'config'
            ? 'text-primary-600 border-b-2 border-primary-600'
            : 'text-gray-600 dark:text-gray-400'
            }`}
        >
          Cấu hình
        </button>
      </div>

      {activeTab === 'users' && (
        <div className="card">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Tìm kiếm người dùng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input max-w-md"
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Tên
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Vai trò
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Trạng thái
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {user.picture ? (
                          <img
                            src={user.picture}
                            alt={user.name}
                            className="w-8 h-8 rounded-full"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white text-sm">
                            {user.name.charAt(0)}
                          </div>
                        )}
                        <span className="font-medium text-gray-900 dark:text-white">
                          {user.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                      {user.email}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${user.role === 'admin'
                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                        {user.role === 'admin' ? 'Quản trị' : 'Người dùng'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${user.isActive
                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                        : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                        }`}>
                        {user.isActive ? 'Hoạt động' : 'Đã Khóa'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleUserStatus(user._id, user.isActive)}
                        className={`btn text-sm ${user.isActive ? 'btn-danger' : 'btn-primary'
                          }`}
                        disabled={user.role === 'admin'}
                      >
                        {user.isActive ? 'Khóa' : 'Mở khóa'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'statistics' && statistics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <Icon icon="mdi:account-group" size={24} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Tổng người dùng</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {statistics.users.total}
                </p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <Icon icon="mdi:check-circle" size={24} className="text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Tổng công việc</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {statistics.tasks.total}
                </p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                <Icon icon="mdi:folder-multiple" size={24} className="text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Tổng dự án</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {statistics.projects.total}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'config' && config && (
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Cấu hình hệ thống
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tên ứng dụng
              </label>
              <input
                type="text"
                defaultValue={config.appName}
                onBlur={(e) => handleUpdateConfig({ appName: e.target.value })}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Theme
              </label>
              <select
                defaultValue={config.theme}
                onChange={(e) => handleUpdateConfig({ theme: e.target.value })}
                className="input"
              >
                <option value="light">Sáng</option>
                <option value="dark">Tối</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Màu chủ đề
              </label>
              <input
                type="color"
                defaultValue={config.primaryColor}
                onChange={(e) => handleUpdateConfig({ primaryColor: e.target.value })}
                className="w-20 h-10 rounded"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;


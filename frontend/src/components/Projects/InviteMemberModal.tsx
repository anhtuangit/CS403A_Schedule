import { useState } from 'react';
import { inviteMemberByEmail } from '../../services/project.service';
import Icon from '../Icon/Icon';
import { toast } from 'react-toastify';

interface InviteMemberModalProps {
  projectId: string;
  onClose: () => void;
  onSuccess: () => void;
}

const InviteMemberModal = ({ projectId, onClose, onSuccess }: InviteMemberModalProps) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'viewer' | 'editor'>('editor');
  const [isInviting, setIsInviting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error('Vui lòng nhập email');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Email không hợp lệ');
      return;
    }

    setIsInviting(true);
    try {
      await inviteMemberByEmail(projectId, { email: email.trim(), role });
      toast.success('Đã gửi lời mời thành công');
      setEmail('');
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error || 'Gửi lời mời thất bại');
    } finally {
      setIsInviting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Mời thành viên
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <Icon icon="mdi:close" size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              placeholder="example@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Vai trò *
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="editor"
                  checked={role === 'editor'}
                  onChange={() => setRole('editor')}
                  className="w-4 h-4"
                />
                <div>
                  <span className="text-gray-900 dark:text-white font-medium">Biên tập viên</span>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Có thể tạo, chỉnh sửa và xóa task
                  </p>
                </div>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="viewer"
                  checked={role === 'viewer'}
                  onChange={() => setRole('viewer')}
                  className="w-4 h-4"
                />
                <div>
                  <span className="text-gray-900 dark:text-white font-medium">Người xem</span>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Chỉ có thể xem dự án
                  </p>
                </div>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              disabled={isInviting}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isInviting}
            >
              {isInviting ? 'Đang gửi...' : 'Gửi lời mời'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteMemberModal;


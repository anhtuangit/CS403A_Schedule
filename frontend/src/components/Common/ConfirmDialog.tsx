import Icon from '../Icon/Icon';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: 'danger' | 'warning' | 'info';
}

/**
 * Confirm Dialog Component
 */
const ConfirmDialog = ({
  isOpen,
  title,
  message,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  onConfirm,
  onCancel,
  type = 'warning'
}: ConfirmDialogProps) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'danger':
        return 'mdi:alert-circle';
      case 'warning':
        return 'mdi:alert';
      case 'info':
        return 'mdi:information';
      default:
        return 'mdi:alert';
    }
  };

  const getConfirmButtonClass = () => {
    switch (type) {
      case 'danger':
        return 'btn btn-danger';
      case 'warning':
        return 'btn btn-warning';
      case 'info':
        return 'btn btn-primary';
      default:
        return 'btn btn-primary';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
            type === 'danger' ? 'bg-red-100 dark:bg-red-900/20' :
            type === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900/20' :
            'bg-blue-100 dark:bg-blue-900/20'
          }`}>
            <Icon
              icon={getIcon()}
              size={24}
              className={
                type === 'danger' ? 'text-red-600 dark:text-red-400' :
                type === 'warning' ? 'text-yellow-600 dark:text-yellow-400' :
                'text-blue-600 dark:text-blue-400'
              }
            />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {message}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="btn btn-secondary"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={getConfirmButtonClass()}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;


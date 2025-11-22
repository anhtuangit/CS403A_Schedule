import { useState, useEffect, useRef } from 'react';
import { ProjectTask } from '../../services/project.service';
import { Label } from '../../services/task.service';
import { addComment, uploadProjectTaskFile, deleteProjectTaskAttachment } from '../../services/project.service';
import Icon from '../Icon/Icon';
import { toast } from 'react-toastify';

interface ProjectTaskModalProps {
  task?: ProjectTask | null;
  columnId: string;
  labels: Label[];
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  onTaskUpdate?: (updatedTask: ProjectTask) => void;
}

const ProjectTaskModal = ({ task, labels, onClose, onSave, onTaskUpdate }: ProjectTaskModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    detailedDescription: '',
    labels: [] as string[],
    subtasks: [] as any[],
    emailReminder: ''
  });
  const [comment, setComment] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [currentTask, setCurrentTask] = useState<ProjectTask | null>(task || null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (task) {
      setCurrentTask(task);
      setFormData({
        title: task.title,
        shortDescription: task.shortDescription || '',
        detailedDescription: task.detailedDescription || '',
        labels: task.labels.map(l => typeof l === 'string' ? l : l._id),
        subtasks: task.subtasks || [],
        emailReminder: task.emailReminder || ''
      });
    }
  }, [task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(formData);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddComment = async () => {
    if (!comment.trim() || !currentTask) return;
    try {
      const response = await addComment(currentTask._id, { content: comment });
      setComment('');
      toast.success('Thêm bình luận thành công');

      if (response.task) {
        setCurrentTask(response.task);
        if (onTaskUpdate) {
          onTaskUpdate(response.task);
        }
      }
    } catch (error: any) {
      toast.error(error || 'Thêm bình luận thất bại');
    }
  };

  const toggleLabel = (labelId: string) => {
    const currentLabels = formData.labels || [];
    if (currentLabels.includes(labelId)) {
      setFormData({ ...formData, labels: currentLabels.filter(id => id !== labelId) });
    } else {
      setFormData({ ...formData, labels: [...currentLabels, labelId] });
    }
  };

  const handleAddSubtask = () => {
    setFormData({
      ...formData,
      subtasks: [
        ...(formData.subtasks || []),
        { title: '', completed: false, order: (formData.subtasks?.length || 0) }
      ]
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!currentTask?._id) {
      toast.error('Vui lòng lưu task trước khi upload file');
      return;
    }

    setIsUploading(true);
    try {
      const result = await uploadProjectTaskFile(currentTask._id, file);
      setCurrentTask({
        ...currentTask,
        attachments: [...(currentTask.attachments || []), result.file]
      });
      if (onTaskUpdate) {
        onTaskUpdate({
          ...currentTask,
          attachments: [...(currentTask.attachments || []), result.file]
        });
      }
      toast.success('Upload file thành công!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Upload file thất bại');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeleteAttachment = async (attachmentUrl: string) => {
    if (!currentTask?._id) return;

    try {
      const result = await deleteProjectTaskAttachment(currentTask._id, attachmentUrl);
      setCurrentTask(result.task);
      if (onTaskUpdate) {
        onTaskUpdate(result.task);
      }
      toast.success('Xóa file thành công!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Xóa file thất bại');
    }
  };

  const getFileName = (url: string): string => {
    return url.split('/').pop() || url;
  };

  const getFileIcon = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) {
      return 'mdi:image';
    } else if (['pdf'].includes(ext || '')) {
      return 'mdi:file-pdf-box';
    } else if (['doc', 'docx'].includes(ext || '')) {
      return 'mdi:file-word-box';
    } else if (['xls', 'xlsx'].includes(ext || '')) {
      return 'mdi:file-excel-box';
    } else if (['zip', 'rar', '7z'].includes(ext || '')) {
      return 'mdi:folder-zip';
    }
    return 'mdi:file';
  };

  const groupedLabels = labels.reduce((acc, label) => {
    if (!acc[label.type]) {
      acc[label.type] = [];
    }
    acc[label.type].push(label);
    return acc;
  }, {} as Record<string, typeof labels>);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {task ? 'Chỉnh sửa task' : 'Thêm task mới'}
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
                Tiêu đề *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Mô tả ngắn
              </label>
              <input
                type="text"
                value={formData.shortDescription}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Mô tả chi tiết
              </label>
              <textarea
                value={formData.detailedDescription}
                onChange={(e) => setFormData({ ...formData, detailedDescription: e.target.value })}
                className="input"
                rows={4}
              />
            </div>
            {Object.entries(groupedLabels).map(([type, typeLabels]) => (
              <div key={type}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {type === 'task_type' ? 'Loại công việc' :
                    type === 'status' ? 'Trạng thái' :
                      type === 'difficulty' ? 'Độ khó' :
                        'Độ ưu tiên'}
                </label>
                <div className="flex flex-wrap gap-2">
                  {(typeLabels as Label[]).map((label: Label) => {
                    const isSelected = formData.labels?.includes(label._id);
                    return (
                      <button
                        key={label._id}
                        type="button"
                        onClick={() => toggleLabel(label._id)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md ${isSelected
                            ? 'text-white transform scale-105'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                        style={
                          isSelected
                            ? {
                              backgroundColor: label.color || '#3B82F6',
                              boxShadow: `0 4px 14px 0 ${(label.color || '#3B82F6')}40`
                            }
                            : {}
                        }
                      >
                        <Icon
                          icon={label.icon || 'mdi:label'}
                          size={16}
                          className={isSelected ? 'text-white' : ''}
                          style={isSelected ? {} : { color: label.color || '#3B82F6' }}
                        />
                        <span>{label.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Task con
                </label>
                <button
                  type="button"
                  onClick={handleAddSubtask}
                  className="btn btn-secondary text-sm"
                >
                  <Icon icon="mdi:plus" size={16} className="inline mr-1" />
                  Thêm task con
                </button>
              </div>
              {formData.subtasks?.map((subtask, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    checked={subtask.completed}
                    onChange={(e) => {
                      const subtasks = [...(formData.subtasks || [])];
                      subtasks[index] = { ...subtasks[index], completed: e.target.checked };
                      setFormData({ ...formData, subtasks });
                    }}
                    className="w-5 h-5"
                  />
                  <input
                    type="text"
                    value={subtask.title}
                    onChange={(e) => {
                      const subtasks = [...(formData.subtasks || [])];
                      subtasks[index] = { ...subtasks[index], title: e.target.value };
                      setFormData({ ...formData, subtasks });
                    }}
                    className="input flex-1"
                    placeholder="Nhập tên task con..."
                  />
                </div>
              ))}
            </div>
            {currentTask && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  File đính kèm
                </label>
                {currentTask.attachments && currentTask.attachments.length > 0 && (
                  <div className="space-y-2 mb-2">
                    {currentTask.attachments.map((attachment, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <Icon
                            icon={getFileIcon(getFileName(attachment))}
                            size={20}
                            className="text-gray-600 dark:text-gray-300 flex-shrink-0"
                          />
                          <a
                            href={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${attachment}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline truncate"
                          >
                            {getFileName(attachment)}
                          </a>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteAttachment(attachment)}
                          className="p-1 text-red-500 hover:text-red-700 transition-colors ml-2"
                          title="Xóa file"
                        >
                          <Icon icon="mdi:delete" size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="btn btn-secondary flex items-center gap-2 cursor-pointer"
                  >
                    <Icon icon="mdi:upload" size={16} />
                    {isUploading ? 'Đang upload...' : 'Thêm file'}
                  </label>
                </div>
              </div>
            )}
            {currentTask && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bình luận
                </label>
                <div className="space-y-2 mb-2">
                  {currentTask.comments?.map((comment, index) => (
                    <div key={index} className="bg-gray-100 dark:bg-gray-700 rounded p-3">
                      <div className="flex items-center gap-2 mb-1">
                        {comment.userId.picture ? (
                          <img
                            src={comment.userId.picture}
                            alt={comment.userId.name}
                            className="w-6 h-6 rounded-full"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center text-white text-xs">
                            {comment.userId.name.charAt(0)}
                          </div>
                        )}
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {comment.userId.name}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {comment.content}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Thêm bình luận..."
                    className="input flex-1"
                  />
                  <button
                    type="button"
                    onClick={handleAddComment}
                    className="btn btn-primary"
                  >
                    Gửi
                  </button>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary"
                disabled={isSaving}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSaving}
              >
                {isSaving ? 'Đang lưu...' : 'Lưu'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProjectTaskModal;


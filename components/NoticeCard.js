import Link from 'next/link';

const categoryColors = {
  Exam: 'bg-purple-100 text-purple-700',
  Event: 'bg-blue-100 text-blue-700',
  General: 'bg-gray-100 text-gray-700',
};

export default function NoticeCard({ notice, onDeleteClick }) {
  const isUrgent = notice.priority === 'Urgent';
  const dateStr = new Date(notice.publishDate).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div
      className={`bg-white rounded-xl border p-4 flex flex-col gap-3 shadow-sm ${
        isUrgent ? 'border-red-300 ring-1 ring-red-100' : 'border-gray-200'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${categoryColors[notice.category]}`}>
          {notice.category}
        </span>
        {isUrgent && (
          <span className="text-xs font-semibold px-2 py-1 rounded-full bg-red-600 text-white">
            Urgent
          </span>
        )}
      </div>

      <div>
        <h2 className="font-semibold text-gray-900 text-base line-clamp-1">{notice.title}</h2>
        <p className="text-sm text-gray-600 mt-1 line-clamp-3">{notice.body}</p>
      </div>

      <div className="mt-auto flex items-center justify-between pt-2 border-t border-gray-100">
        <span className="text-xs text-gray-500">{dateStr}</span>
        <div className="flex gap-2">
          <Link
            href={`/notices/edit/${notice.id}`}
            className="text-xs font-medium text-blue-600 hover:text-blue-800 px-2 py-1"
          >
            Edit
          </Link>
          <button
            onClick={onDeleteClick}
            className="text-xs font-medium text-red-600 hover:text-red-800 px-2 py-1"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
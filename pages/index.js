import { useEffect, useState } from 'react';
import Link from 'next/link';
import NoticeCard from '../components/NoticeCard';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

export default function Home() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchNotices = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/notices');
      if (!res.ok) throw new Error('Failed to load notices');
      setNotices(await res.json());
    } catch (err) {
      setError('Could not load notices. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleDeleteConfirmed = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/notices/${deleteTarget.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setNotices((prev) => prev.filter((n) => n.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      setError('Could not delete notice. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Notice Board</h1>
          <Link
            href="/notices/new"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            + Add Notice
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {error && (
          <div className="mb-4 bg-red-50 text-red-700 border border-red-200 rounded-lg px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-gray-500">Loading notices...</p>
        ) : notices.length === 0 ? (
          <p className="text-gray-500">No notices yet. Click &ldquo;Add Notice&rdquo; to create one.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {notices.map((notice) => (
              <NoticeCard key={notice.id} notice={notice} onDeleteClick={() => setDeleteTarget(notice)} />
            ))}
          </div>
        )}
      </main>

      <DeleteConfirmModal
        notice={deleteTarget}
        isDeleting={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirmed}
      />
    </div>
  );
}
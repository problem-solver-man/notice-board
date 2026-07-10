import { useState } from 'react';
import { useRouter } from 'next/router';

const categories = ['Exam', 'Event', 'General'];
const priorities = ['Normal', 'Urgent'];

function toDateInputValue(date) {
  if (!date) return '';
  return new Date(date).toISOString().split('T')[0];
}

export default function NoticeForm({ initialNotice, noticeId }) {
  const router = useRouter();
  const isEdit = Boolean(noticeId);

  const [form, setForm] = useState({
    title: initialNotice?.title || '',
    body: initialNotice?.body || '',
    category: initialNotice?.category || 'General',
    priority: initialNotice?.priority || 'Normal',
    publishDate: initialNotice?.publishDate ? toDateInputValue(initialNotice.publishDate) : toDateInputValue(new Date()),
  });
  const [errors, setErrors] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setSubmitting(true);

    try {
      const url = isEdit ? `/api/notices/${noticeId}` : '/api/notices';
      const method = isEdit ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrors(data.errors || [data.error || 'Something went wrong']);
        setSubmitting(false);
        return;
      }

      router.push('/');
    } catch (err) {
      setErrors(['Network error. Please try again.']);
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white rounded-xl border border-gray-200 p-6 space-y-4">
      <h1 className="text-xl font-bold text-gray-900">{isEdit ? 'Edit Notice' : 'Add Notice'}</h1>

      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          <ul className="list-disc list-inside">
            {errors.map((err, i) => <li key={i}>{err}</li>)}
          </ul>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <input type="text" name="title" value={form.title} onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Body</label>
        <textarea name="body" value={form.body} onChange={handleChange} rows={4}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select name="category" value={form.category} onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
          <select name="priority" value={form.priority} onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
            {priorities.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Publish Date</label>
        <input type="date" name="publishDate" value={form.publishDate} onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={() => router.push('/')}
          className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">
          Cancel
        </button>
        <button type="submit" disabled={submitting}
          className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60">
          {submitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Notice'}
        </button>
      </div>
    </form>
  );
}
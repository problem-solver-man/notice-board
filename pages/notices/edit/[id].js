import NoticeForm from '../../../components/NoticeForm';
import { prisma } from '../../../lib/prisma';

export default function EditNotice({ notice }) {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <NoticeForm initialNotice={notice} noticeId={notice.id} />
    </div>
  );
}

export async function getServerSideProps({ params }) {
  const id = parseInt(params.id, 10);
  if (isNaN(id)) return { notFound: true };

  const notice = await prisma.notice.findUnique({ where: { id } });
  if (!notice) return { notFound: true };

  return {
    props: {
      notice: {
        ...notice,
        publishDate: notice.publishDate.toISOString(),
        createdAt: notice.createdAt.toISOString(),
      },
    },
  };
}
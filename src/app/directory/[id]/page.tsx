import { redirect } from 'next/navigation';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function DirectoryBusinessRedirect({ params }: PageProps) {
  const { id } = await params;
  redirect(`/en/directory/${id}`);
}

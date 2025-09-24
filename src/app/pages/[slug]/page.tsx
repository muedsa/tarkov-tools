import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { UserDataProvider } from "./_components/user-data-context";

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const DynamicPostPage = dynamic(() =>
    import(`./${slug}.tsx`).catch(() => notFound())
  );
  return (
    <UserDataProvider>
      <DynamicPostPage />
    </UserDataProvider>
  );
}

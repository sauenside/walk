import { CategoryEditorRoute } from "@/routes/secret/category-editor";

type NewCategoryPageProps = {
  searchParams: Promise<{ parentId?: string }>;
};

export default async function NewCategoryPage({ searchParams }: NewCategoryPageProps) {
  const { parentId } = await searchParams;
  return <CategoryEditorRoute mode="create" parentId={parentId ?? null} />;
}

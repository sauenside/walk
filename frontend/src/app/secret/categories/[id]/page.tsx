import { CategoryEditorRoute } from "@/routes/secret/category-editor";

type CategoryPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { id } = await params;
  return <CategoryEditorRoute mode="edit" categoryId={id} />;
}

import { createFileRoute } from '@tanstack/react-router';
import ModulePlaceholder from '@/components/shared/ModulePlaceholder';

export const Route = createFileRoute('/admin/$slug')({
  component: AdminModuleCatchAll,
});

function AdminModuleCatchAll() {
  const { slug } = Route.useParams();

  // Capitalize slug for display (e.g., 'matters' -> 'Matters')
  const displayTitle = slug.charAt(0).toUpperCase() + slug.slice(1);

  return <ModulePlaceholder title={displayTitle} slug={slug} />;
}

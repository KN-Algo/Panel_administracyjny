import { FilePlus } from "lucide-react";
import { AdminPostForm } from '../components/layout/AdminPostForm.tsx';

export default function AdminAddPostPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <FilePlus className="h-6 w-6 text-muted-foreground" />
        <h2 className="text-2xl font-semibold">Dodaj post</h2>
      </div>
      <AdminPostForm />
    </div>
  );
}

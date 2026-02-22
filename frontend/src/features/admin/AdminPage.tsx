import { useNavigate } from 'react-router-dom';

export default function AdminPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('panel-auth');
    navigate('/panel');
  };

  return (
    <main className="min-h-screen bg-background px-4 py-10">
      <section className="mx-auto w-full max-w-5xl rounded-2xl border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-card-foreground">Panel administracyjny</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Tu bedzie  shadcn.
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-md border px-4 py-2 text-sm font-medium transition hover:bg-muted"
          >
            Wyloguj
          </button>
        </div>
      </section>
    </main>
  );
}
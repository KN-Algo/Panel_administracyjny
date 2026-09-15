import { useState } from "react";
import { Navigate } from "react-router-dom";
import { LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/features/admin/components/form/FormField";
import { ADMIN_PATHS } from "@/features/admin/config/paths";
import { useAdminAuth } from "./useAdminAuth";

export function LoginPage() {
  const { isAuthenticated, login } = useAdminAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (isAuthenticated) {
    return <Navigate to={ADMIN_PATHS.dashboard} replace />;
  }

  const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (username.trim().length < 3 || password.trim().length < 3) {
      setError("Podaj poprawny login i hasło (min. 3 znaki).");
      return;
    }

    login();
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <section className="w-full max-w-sm rounded-2xl border bg-card p-6 shadow-sm">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <div className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <LayoutDashboard className="size-5" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-card-foreground">
              Panel logowania
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Zaloguj się, aby przejść do panelu administracyjnego.
            </p>
          </div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <FormField label="Login">
            {(control) => (
              <Input
                {...control}
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Wpisz login"
                autoComplete="username"
                autoFocus
              />
            )}
          </FormField>

          <FormField label="Hasło">
            {(control) => (
              <Input
                {...control}
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Wpisz hasło"
                autoComplete="current-password"
              />
            )}
          </FormField>

          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full">
            Zaloguj
          </Button>
        </form>
      </section>
    </main>
  );
}

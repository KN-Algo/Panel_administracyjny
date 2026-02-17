# Contact Page - Integracja reCAPTCHA v3

## Co zostało zrobione

✅ Formularz kontaktowy z polami:

- Imię i Nazwisko (max 100 znaków)
- Adres e-mail (walidacja email)
- Temat (max 120 znaków)
- Wiadomość (max 2000 znaków)

✅ Integracja z backend API:

- `/src/api/sendContactMail.php` - wysyłka emaila
- `/src/api/recaptcha.php` - weryfikacja tokenu

✅ Podstawowa walidacja i obsługa błędów

## Co wymaga uzupełnienia - reCAPTCHA v3

### 1. Dodaj skrypt Google reCAPTCHA w `index.html`:

```html
<script src="https://www.google.com/recaptcha/api.js?render=TWÓJ_SITE_KEY"></script>
```

### 2. W pliku `ContactPage.tsx` odkomentuj i uzupełnij:

**Linia ~18-19:** Generowanie tokenu reCAPTCHA

```typescript
const recaptchaToken = await grecaptcha.execute("TWÓJ_SITE_KEY", {
  action: "submit",
});
```

**Linia ~21-25:** Weryfikacja tokenu

```typescript
const recaptchaResponse = await fetch("/src/api/recaptcha.php", {
  method: "POST",
  body: new FormData().append("token", recaptchaToken),
});
const recaptchaData = await recaptchaResponse.json();

if (!recaptchaData.success) {
  alert(t("contact.alert_robot_text"));
  setIsSubmitting(false);
  return;
}
```

### 3. Konfiguracja backend

Backend (`stara_strona/src/api/recaptcha.php`) wymaga:

- Plik `.env` z kluczem: `RECAPTCHA_SECRET=twój_secret_key`
- Composer dependencies już zainstalowane

### 4. Optional: SweetAlert2

Stara strona używała SweetAlert2 do ładnych alertów. Możesz dodać:

```bash
npm install sweetalert2
```

I zamienić `alert()` na `Swal.fire()` w ContactPage.tsx

## API Endpoints

### POST `/src/api/recaptcha.php`

**Body:** `token` (string)
**Response:**

```json
{
  "success": true/false,
  "message": "OK" | "Recaptcha failed"
}
```

### POST `/src/api/sendContactMail.php`

**Body:** FormData z `name`, `email`, `subject`, `message`
**Response:**

```json
{
  "icon": "success" | "warning" | "error",
  "title": "...",
  "message": "...",
  "data": { "code": 200 | 400 | 401 }
}
```

## Kontakt

Jeśli masz pytania odnośnie integracji, upewnij się że:

1. Stary backend PHP działa (`stara_strona/src/api/`)
2. Masz klucze reCAPTCHA (site key + secret key)
3. Plik `.env` w katalogu `stara_strona/` jest poprawnie skonfigurowany

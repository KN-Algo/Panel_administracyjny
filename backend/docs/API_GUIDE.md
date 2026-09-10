# Dokumentacja wewnętrzna projektu API

---

## Co nowego
- **Dodano moduł Team Members**: Wprowadzono pełną obsługę członków zespołu (Zarząd, Członkowie, Opiekunowie, Maskotka). Moduł posiada wbudowaną ochronę przed atakami XSS, inteligentne aktualizowanie relacji oraz system priorytetyzacji wyświetlania.

---

## 1. Moduł: Członkowie Zespołu

### Endpointy
- `GET /api/team-members` – Pobiera listę członków zespołu. Wyniki są zawsze domyślnie **posortowane rosnąco** według pola `sortOrder`.
  - **Filtrowanie (Opcjonalne Query Params):**
    - `?role=BOARD` (dostępne wartości Enum: `BOARD`, `MEMBER`, `SUPERVISOR`, `MASCOT`)
    - `?search=Kowalski` (wyszukuje po fragmencie imienia lub nazwiska, ignoruje wielkość liter)
    - Można je łączyć: `?role=MEMBER&search=kowal`
- `GET /api/team-members/{id}` – Zwraca szczegóły pojedynczego członka zespołu na podstawie jego ID. W przypadku braku osoby zwraca `404 Not Found`.
- `POST /api/team-members` – Tworzy nową osobę w zespole. Wymaga pełnego obiektu (body).
- `PUT /api/team-members/{id}` – Aktualizuje dane osoby. Backend używa inteligentnej aktualizacji. Wymaga pełnego obiektu, tak jak w przypadku `POST`.

### Jakie pola są wymagane w Payloadzie

**Wymagane:**
- `firstName` (max 50 znaków)
- `lastName` (max 50 znaków)
- `role` (`BOARD`, `MEMBER`, `SUPERVISOR`, `MASCOT`)
- `translations` – Tablica **musi** zawierać dokładnie 3 obiekty tłumaczeń dla sztywnych kodów językowych: `PL`, `EN`, `DE`. 
  - Wewnątrz każdego z nich wymagane są `languageCode` (np. "PL") oraz `displayedTitle` (np. "Wiceprezes").
  - Pole `description` jest opcjonalne, może zawierać znaczniki HTML.

**Opcjonalne, ale istotne:**
- `sortOrder` (Integer) – liczba sterująca kolejnością na froncie (np. `10` dla Prezesa, `20` dla Wiceprezesa). Brak podania tej wartości ustawi domyślnie `999`.
- `imageUrls` (Array) – tablica linków do zdjęć. Puste stringi i ataki XSS są filtrowane automatycznie.
- `socialLinks` (Object) – słownik par klucz-wartość. Obsługuje dowolne klucze (np. `"github": "link"`, `"linkedin": "link"`).

---

### Przykłady Żądań i Odpowiedzi (Request & Response)

#### 1. Tworzenie lub Aktualizacja (POST / PUT)
**Żądanie (Request Body):**
```json
{
  "firstName": "Jan",
  "lastName": "Kowalski",
  "role": "BOARD",
  "sortOrder": 10,
  "translations": [
    {
      "languageCode": "PL",
      "displayedTitle": "Prezes KN Algo",
      "description": "<p>Opis profilowy po polsku.</p>"
    },
    {
      "languageCode": "EN",
      "displayedTitle": "President of KN Algo",
      "description": "<p>Profile description in English.</p>"
    },
    {
      "languageCode": "DE",
      "displayedTitle": "Präsident KN Algo",
      "description": "<p>Profilbeschreibung auf Deutsch.</p>"
    }
  ],
  "imageUrls": [
    "/img/jan_nowy.webp"
  ],
  "socialLinks": {
    "linkedin": "[https://linkedin.com/in/jankowalski](https://linkedin.com/in/jankowalski)",
    "github": "[https://github.com/jan-kowalski](https://github.com/jan-kowalski)"
  }
}

```

**Oczekiwana Odpowiedź (Status 200 OK):**
Backend zwraca zapisany obiekt, wzbogacony o wygenerowane ID (`memberId` oraz `translationId`).

```json
{
  "memberId": 1,
  "firstName": "Jan",
  "lastName": "Kowalski",
  "role": "BOARD",
  "sortOrder": 10,
  "translations": [
    {
      "translationId": 1,
      "languageCode": "PL",
      "displayedTitle": "Prezes KN Algo",
      "description": "<p>Opis profilowy po polsku.</p>"
    },
    {
      "translationId": 2,
      "languageCode": "EN",
      "displayedTitle": "President of KN Algo",
      "description": "<p>Profile description in English.</p>"
    },
    {
      "translationId": 3,
      "languageCode": "DE",
      "displayedTitle": "Präsident KN Algo",
      "description": "<p>Profilbeschreibung auf Deutsch.</p>"
    }
  ],
  "imageUrls": [
    "/img/jan_nowy.webp"
  ],
  "socialLinks": {
    "github": "[https://github.com/jan-kowalski](https://github.com/jan-kowalski)",
    "linkedin": "[https://linkedin.com/in/jankowalski](https://linkedin.com/in/jankowalski)"
  }
}

```

#### 2. Pobieranie z filtrowaniem (GET)

**Żądanie:** `GET /api/team-members?role=BOARD&search=kowal`

**Oczekiwana Odpowiedź (Status 200 OK):**
Zwraca tablicę dopasowanych członków zespołu.

```json
{
  "memberId": 14,
  "firstName": "Jan",
  "lastName": "Kowalski",
  "role": "BOARD",
  "sortOrder": 10,
  "translations": [
    {
      "translationId": 42,
      "languageCode": "PL",
      "displayedTitle": "Prezes KN Algo",
      "description": "<p>Opis profilowy po polsku.</p>"
    },
    {
      "translationId": 43,
      "languageCode": "EN",
      "displayedTitle": "President of KN Algo",
      "description": "<p>Profile description in English.</p>"
    },
    {
      "translationId": 44,
      "languageCode": "DE",
      "displayedTitle": "Präsident KN Algo",
      "description": "<p>Profilbeschreibung auf Deutsch.</p>"
    }
  ],
  "imageUrls": [
    "/img/jan_nowy.webp"
  ],
  "socialLinks": {
    "github": "[https://github.com/jan-kowalski](https://github.com/jan-kowalski)",
    "linkedin": "[https://linkedin.com/in/jankowalski](https://linkedin.com/in/jankowalski)"
  }
}

```

#### 3. Błąd Walidacji - Braki w językach lub nieprawidłowa rola (GET / POST / PUT)

Jeśli frontend wyśle niekompletne dane (np. brakuje tłumaczenia DE, a podano nieobsługiwane FR) lub literówkę w parametrach.

**Oczekiwana Odpowiedź (Status 400 Bad Request):**

```json
{
  "timestamp": "2026-09-08T15:47:11.3073358",
  "status": 400,
  "error": "Bad Request",
  "message": "Team member validation failed.",
  "path": "/api/team-members",
  "validationErrors": {
    "translations.missing": "Missing required translation(s): DE",
    "translations.unsupported": "Unrecognized language(s) provided: FR"
  }
}

```
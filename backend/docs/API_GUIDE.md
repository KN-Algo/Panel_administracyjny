# Dokumentacja wewnętrzna projektu

---

## Co nowego
- Zmiana TempPost na Post: Od teraz wszystkie typy postów są obsługiwane przez klasy Posts.
- Projekty: Dodano endpointy do zarządzania zakładką "Projekty" (CRUD + filtrowanie po statusie).

---

## Endpointy

Wprowadzone zmiany wymusiły dostosowanie nazw ścieżek, oto one:
- GET /api/posts/content – Główny feed: Zwraca zwykłe posty i newsy. Odpowiedzią jest gotowa tablica.
- GET /api/posts/news – Tylko aktualności: Zwraca wyłącznie posty typu NEWS. Gotowa tablica.
- GET /api/posts/active-modal – Pobranie Popup-u: Zwraca jeden aktywny modal lub pustą odpowiedź, jeśli aktualnie nie ma żadnego do wyświetlenia.
- GET /api/posts/modals – Zarządzanie: Pobiera wszystkie modale (TEMP, TEMP_NEWS, TEMP_STANDARD) występujące w bazie danych.
- GET /api/posts/{id} – Widok szczegółów: Zwraca dane pojedynczego posta na podstawie jego ID.
- GET /api/posts – Zwraca obiekt zawierający klucz items oraz page (wszystkie posty).
- POST /api/posts – Tworzenie: Tworzy nowy post dowolnego typu. Wymaga pełnego obiektu (body) w ciele zapytania.
- PUT /api/posts/{id} – Aktualizacja: Nadpisuje istniejący wpis. Wymaga pełnego obiektu (body) w ciele zapytania.
- DELETE /api/posts/{id} – Usuwanie: Kasuje wpis z bazy danych.

---

## Jakie pola są wymagane

#### Dla zwykłych postów oraz aktualności (STANDARD, NEWS):

Wymagane:
- postType
- translations (Chodzi o dodanie tłumaczenia postu w co najmniej jednym języku, w którym wymagane są pola: languageCode, title, fullDescription)

#### Dla modali oraz ogłoszeń czasowych (TEMP, TEMP_STANDARD, TEMP_NEWS)

Wymagane:
- postType
- startsAt
- expiresAt
- eventDate
- translations (languageCode, title, fullDescription)

---

## Wgrywanie obrazów

#### Wgrywanie jednego pliku:

- Endpoint: POST /api/files/upload
- Format: multipart/form-data
- Klucz: file (typ: File)
- Odpowiedź (sukces): {"url": "/img/20260425_foto.jpg"}

#### Wgrywanie wielu plików naraz:

- Endpoint: POST /api/files/upload/batch
- Format: multipart/form-data
- Klucz: files (typ: File, użyjcie tego klucza wielokrotnie w jednym requeście dla każdego pliku).
- Odpowiedź: Dostaniecie obiekt z listą sukcesów i błędów. Musicie wyciągnąć url z listy successes

```JSON
{
  "successes": [ { "filename": "1.jpg", "url": "/img/1.jpg" } ],
  "errors": [ { "filename": "plik.txt", "error": "Zły format" } ]
}
```

## Przykładowy Payload

```JSON
{
  "postType": "TEMP",
  "eventDate": "2026-04-15T18:00:00",
  "startsAt": "2026-04-01T08:00:00",
  "expiresAt": "2026-04-16T23:59:59",
  "thumbnailUrl": "/img/thumb.jpg",
  "imageUrls": [
    "/img/galeria1.jpg",
    "/img/galeria2.jpg"
  ],
  "externalLink": "https://facebook.com/events/123",
  "translations": [
    {
      "languageCode": "pl",
      "title": "Wielkie spotkanie KN!",
      "shortDescription": "Wpadajcie na pizzę.",
      "fullDescription": "Spotykamy się w sali 301. Będzie super, miłego kodowania!"
    }
  ]
}
```

---

## Projekty (zakładka "Projekty")

### Endpointy

- GET /api/projects – Lista projektów. Opcjonalnie filtr: `?status=COMPLETED` lub `?status=UPCOMING`. Wynik to tablica projektów posortowana po `displayOrder` rosnąco, a następnie po `projectId` malejąco.
- GET /api/projects/{id} – Pobranie jednego projektu (admin view).
- POST /api/projects – Tworzenie projektu. Wymaga pełnego obiektu (body) w ciele zapytania.
- PUT /api/projects/{id} – Aktualizacja projektu. Nadpisuje istniejący wpis. Wymaga pełnego obiektu (body) w ciele zapytania.
- DELETE /api/projects/{id} – Usuwanie projektu. Odpowiedź: `204 No Content`.

### Jakie pola są wymagane

Wymagane:
- status (COMPLETED / UPCOMING)
- translations (co najmniej jedno tłumaczenie; wymagane pola: languageCode, title, description; pole translationId jest opcjonalne i przydaje się przy aktualizacji)

Opcjonalne:
- displayOrder (liczba; niższe wartości pojawiają się pierwsze)
- images (lista URL-i; max 50; każdy URL max 500 znaków). URL-e pochodzą z endpointów uploadu z sekcji "Wgrywanie obrazów".

### Pola odpowiedzi (ProjectResponseDto)

- projectId
- status
- displayOrder
- images
- translations (lista obiektów: translationId, languageCode, title, description)

### Przykładowy Payload (ProjectRequestDto)

```JSON
{
  "status": "COMPLETED",
  "displayOrder": 10,
  "images": [
    "/img/projekty/robot1.jpg",
    "/img/projekty/robot2.jpg"
  ],
  "translations": [
    {
      "languageCode": "pl",
      "title": "Nazwa projektu",
      "description": "<p>Opis projektu (HTML dozwolony).</p>"
    }
  ]
}
```

### Przykładowa Odpowiedź (ProjectResponseDto)

```JSON
{
  "projectId": 123,
  "status": "COMPLETED",
  "displayOrder": 10,
  "images": [
    "/img/projekty/robot1.jpg",
    "/img/projekty/robot2.jpg"
  ],
  "translations": [
    {
      "translationId": 456,
      "languageCode": "pl",
      "title": "Nazwa projektu",
      "description": "<p>Opis projektu (HTML dozwolony).</p>"
    }
  ]
}
```

### Błędy i walidacja

- 400 Bad Request: walidacja body (np. brak status lub pusta translations) lub niepoprawny parametr `status`.
- 404 Not Found: projekt nie istnieje (`Project not found: {id}`).

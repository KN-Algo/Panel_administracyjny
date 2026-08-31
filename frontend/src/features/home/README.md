# Home feature

Ten dokument jest mapą techniczną strony głównej i wskazówką dla kolejnych
zadań wykonywanych przez ludzi oraz agentów AI. Przed zmianą plików w tym
katalogu przeczytaj również [`../../shared/README.md`](../../shared/README.md),
ponieważ komponenty Home korzystają z publicznych prymitywów UI.

## Cel architektury

Pliki główne strony mają opisywać dane i kompozycję, a nie implementować duże
fragmenty JSX, animacje lub szczegóły stylowania.

- `HomePage.tsx` składa sekcje i wybiera dane aktualności.
- `HeroSection.tsx` dostarcza przetłumaczoną treść sekcji Hero.
- `AboutSection.tsx` definiuje właściwości kart About.
- Komponenty prezentacyjne znajdują się w tematycznych podkatalogach
  `components/about`, `components/hero` i `components/news`.
- Logika stanowa niezwiązana bezpośrednio z markupem znajduje się w `hooks`.
- Każdy komponent ma jawny, eksportowany interfejs propsów.

Nie przenoś komponentów Home do globalnego `shared`, dopóki nie staną się
rzeczywiście używane przez więcej niż jeden feature. Są to komponenty domenowe
strony głównej.

## Struktura

```text
home/
├── components/
│   ├── about/
│   │   ├── AboutCard.tsx
│   │   ├── AboutCardAnimation.tsx
│   │   ├── AboutCards.tsx
│   │   ├── AboutFooter.tsx
│   │   ├── AboutHeader.tsx
│   │   └── AboutSectionLayout.tsx
│   ├── hero/
│   │   ├── HeroAnimation.tsx
│   │   ├── HeroContent.tsx
│   │   └── HeroSectionLayout.tsx
│   └── news/
│       ├── NewsCard.tsx
│       └── NewsCarousel.tsx
├── hooks/
│   ├── useParticlesEngine.ts
│   ├── useReducedMotion.ts
│   └── useResponsiveCarousel.ts
├── AboutSection.tsx
├── HeroSection.tsx
├── HomePage.tsx
└── README.md
```

Strona jest dostępna pod `/` i jest renderowana wewnątrz publicznego
`Layout` zdefiniowanego w `src/routes/index.tsx`.

## Przepływ strony

`HomePage` renderuje elementy w stałej kolejności:

1. `HeroSection`
2. `AboutSection`
3. `NewsCarousel`

Kontener strony ma `overflow-x-hidden`. Jest to istotne, ponieważ przyciski
karuzeli są częściowo przesunięte poza jej obszar. Usunięcie tej reguły może
spowodować poziomy scrollbar.

## Hero

### Kompozycja

`HeroSection.tsx` pobiera klucze `home.title` i `home.motto` przez
`react-i18next`, a następnie składa:

```tsx
<HeroSectionLayout>
  <HeroAnimation />
  <HeroContent title={...} motto={...} />
</HeroSectionLayout>
```

Nie umieszczaj konfiguracji cząsteczek ani rozbudowanego JSX-a ponownie w
`HeroSection.tsx`.

### HeroSectionLayout

Odpowiada za element `<section>`, kolor tła, centrowanie, ukrywanie nadmiaru i
warstwy. Canvas ma bufor `48px` poza każdym widocznym bokiem Hero:

- `-mt-12` wsuwa górę pod navbar,
- `-mb-12` wsuwa dół pod sekcję About,
- `-mx-12` oraz `w-[calc(100%+6rem)]` rozszerzają lewą i prawą granicę poza
  viewport,
- `px-12 py-12` kompensuje rozszerzenie i zachowuje wcześniejsze położenie
  treści.

Publiczny navbar ma wysokość `120px`. Po rozszerzeniu obu pionowych granic
rzeczywista wysokość Hero wynosi `calc(100vh - 24px)`, ale dwa ujemne marginesy
sprawiają, że widoczna wysokość strony nadal odpowiada
`calc(100vh - 120px)` i nie przesuwa sekcji About.

Rozszerzenia są celowymi granicami animacji: cząsteczki są usuwane dopiero w
zamaskowanych obszarach, zamiast znikać dokładnie na widocznych krawędziach.
Navbar musi pozostać nad Hero (`z-50`), About nad Hero (`z-10`), a kontener
`HomePage` musi zachować `overflow-x-hidden`, aby poziomy bufor nie poszerzał
strony. Przed zmianą tych wartości sprawdź cały `Layout`, pozycję treści,
wysokość dokumentu oraz brak poziomego scrollbara.

### HeroContent

Przyjmuje dwa wymagane stringi:

| Prop | Znaczenie |
| --- | --- |
| `title` | Nagłówek pierwszego poziomu |
| `motto` | Tekst pod nagłówkiem |

Komponent korzysta z `ContentContainer`, `Heading` i `Text` z `@/shared`.
Warstwa treści ma `z-10`, dzięki czemu pozostaje nad animacją. Kontener używa
`cursor-default` i `select-none`, aby tekst nie zmieniał kursora ani nie był
zaznaczany podczas wielokrotnego wywoływania `push`; nie wyłącza to interakcji
`grab` ani `push`, ponieważ są nasłuchiwane na `window`.

### HeroAnimation i useParticlesEngine

`useParticlesEngine` jednorazowo inicjalizuje `@tsparticles/react` przy użyciu
pakietu `@tsparticles/slim`. Hook przyjmuje flagę `enabled`, zwraca `true`, gdy
silnik jest gotowy, i nie aktualizuje stanu po odmontowaniu komponentu.

`useReducedMotion` obserwuje systemowe ustawienie
`prefers-reduced-motion: reduce`. Gdy jest aktywne, silnik nie jest
inicjalizowany, a canvas cząsteczek nie jest renderowany. Tło i treść Hero są
niezależne od animacji, dlatego sekcja pozostaje kompletna również przy tym
ustawieniu albo przy problemie z inicjalizacją silnika.

`HeroAnimation` nie renderuje niczego przed zakończeniem inicjalizacji. Kolor
cząsteczek i połączeń jest odczytywany z `--color-brand-light`; fallback
znajduje się w `@/shared/styles/theme`.

Aktualna konfiguracja animacji i interakcji:

- limit 60 FPS,
- 48 cząsteczek poniżej `768px`, 84 poniżej `1024px` i 120 na desktopie,
- szybkość ruchu `1`,
- rozmiar od `1` do `3`,
- opacity od `0.3` do `0.6`,
- połączenia do odległości `120`, opacity `0.4`, szerokość `1`,
- tryb `grab` łączy cząsteczki z kursorem w promieniu `140px`,
- kliknięcie uruchamia `push` i dodaje 4 cząsteczki,
- użytkownik może wywoływać `push` bez ograniczenia liczby kliknięć, ale liczba
  cząsteczek renderowanych jednocześnie jest ograniczona do 240 na mobile, 360
  na tablecie i 1440 na desktopie; po osiągnięciu limitu najstarsze cząsteczki
  są usuwane,
- animacja pauzuje w nieaktywnej karcie i poza viewportem,
- obsługa ekranów Retina.

Limit aktywnych cząsteczek jest celowy. Obliczanie połączeń między nimi staje
się coraz droższe wraz ze wzrostem populacji, dlatego prawdziwie nieograniczona
liczba prowadzi do spadków płynności po intensywnym spamowaniu `push`. Nie
usuwaj limitu bez równoczesnej zmiany algorytmu lub wyłączenia połączeń dla
dużych populacji.

Interakcje są wykrywane na `window`, natomiast warstwa animacji ma
`pointer-events-none`. Dzięki temu ruch i kliknięcia nadal ożywiają tło, ale
canvas nie przechwytuje interakcji przeznaczonych dla treści. Treść ma wyższy
`z-index` i jest zawsze renderowana — nie istnieje ekran ładowania ani
obowiązkowe intro blokujące stronę.

Zmiany parametrów wpływają na wygląd i wydajność. Traktuj je jako zmianę
wizualną wymagającą sprawdzenia desktopu i urządzenia mobilnego.

## About

### Kompozycja

`AboutSection.tsx` jest właścicielem tłumaczeń i tablicy konfiguracji kart.
Powinien zawierać wyłącznie właściwości domenowe, na przykład:

```tsx
{
  icon: Code,
  title: t("home.about_tile1_title"),
  description: t("home.about_tile1_desc"),
  tone: "purple",
  delay: 0,
}
```

Nie przekazuj z tego pliku gotowego JSX-a ikony, klas Tailwinda ani stringów
gradientu. Wygląd wariantu należy zdefiniować wewnątrz komponentów About.

### Komponenty

| Komponent | Odpowiedzialność |
| --- | --- |
| `AboutSectionLayout` | Semantyczna sekcja, gradient tła i szerokość kontenera |
| `AboutHeader` | Tytuł, podtytuł i animowana linia dekoracyjna |
| `AboutCards` | Responsywna siatka 1/2/3 kolumny i mapowanie konfiguracji |
| `AboutCard` | Ikona, tytuł i opis pojedynczej karty |
| `AboutCardAnimation` | Powierzchnia, gradient hover, podniesienie i dekoracja |
| `AboutFooter` | Dolny panel tekstowy |

### Kontrakt AboutCard

| Prop | Typ/znaczenie |
| --- | --- |
| `icon` | Komponent `LucideIcon`, nie gotowy element JSX |
| `title` | Tytuł karty |
| `description` | Opis karty |
| `tone` | `purple`, `blue` albo `indigo` |
| `delay` | Opóźnienie przejścia w milisekundach |

`tone` jest semantycznym API. Mapy klas ikony i gradientu są celowo ukryte w
`AboutCard` i `AboutCardAnimation`. Dodając nowy wariant, rozszerz typ
`AboutCardTone` oraz obie kompletne mapy klas. Nie buduj nazw klas Tailwinda
dynamicznie z fragmentów, ponieważ skaner może ich nie wykryć.

Aktualne trzy karty mają opóźnienia `0`, `150` i `300` ms. Siatka pokazuje
jedną kolumnę na mobile, dwie od breakpointu `md` i trzy od `lg`.

## News

### Źródła danych i język

`HomePage.tsx` importuje:

- `@/data/news_pl.json`,
- `@/data/news_en.json`,
- `@/data/news_de.json`.

Dla języka `en` wybierany jest plik angielski, dla `de` niemiecki, a pozostałe
wartości korzystają z polskiego fallbacku. Kopia tablicy jest odwracana, aby
najnowsze elementy pojawiały się jako pierwsze. Nie używaj `reverse()`
bezpośrednio na zaimportowanej tablicy, ponieważ modyfikuje dane wejściowe.

Elementy mają typ `NewsItem` z `@/types`. Tytuł sekcji oraz etykieta przycisku
pochodzą z kluczy `home.news_title` i `home.read_more`.

### NewsCarousel

Jawny kontrakt komponentu:

| Prop | Znaczenie |
| --- | --- |
| `title` | Tytuł całej sekcji |
| `news` | Lista `NewsItem[]` w kolejności wyświetlania |
| `readMoreLabel` | Tekst CTA przekazywany do każdej karty |
| `previousSlideLabel` | Dostępna etykieta poprzedniej strzałki |
| `nextSlideLabel` | Dostępna etykieta następnej strzałki |
| `getSlideLabel` | Funkcja tworząca etykietę kropki dla numeru slajdu od `1` |

Karuzela zachowuje animację zanikania i skalowania przez 300 ms. Podczas
przejścia kolejne żądania zmiany slajdu są ignorowane. Nawigacja strzałkami
jest zapętlona w obie strony.

Breakpointy są zgodne z używanym układem Tailwind:

| Szerokość | Elementy na slajd |
| --- | --- |
| poniżej `768px` | 1 |
| `768px`–`1023px` | 2 |
| od `1024px` | 3 |

Przy zmianie breakpointu `useResponsiveCarousel` przelicza aktywny slajd tak,
aby zachować pierwszy wcześniej widoczny element. Anuluje też aktywny timer
przejścia. Timer jest czyszczony podczas odmontowania.

Jeżeli ostatni desktopowy slajd zawiera dokładnie dwie karty, karuzela centruje
je w kolumnach o maksymalnej szerokości `400px`.

### NewsCard

Karta ma stałą wysokość `580px`, obraz o wysokości `256px` z
`object-contain`, ograniczenie liczby linii tekstu oraz animację podniesienia
na hover. Te wartości utrzymują jednakową wysokość kart i stabilność karuzeli.

Kliknięcie prowadzi do `/events` i przekazuje przez stan React Routera:

```ts
{ eventId }
```

`eventId` jest wyciągany z części `link` znajdującej się po `#`. Zmiana formatu
linków w plikach JSON wymaga równoczesnej aktualizacji tej logiki i obsługi na
stronie Events.

## Tłumaczenia

Treść strony znajduje się w sekcji `home` plików:

- `src/i18n/pl.json`,
- `src/i18n/en.json`,
- `src/i18n/de.json`.

Dodając tekst widoczny dla użytkownika, dodaj klucz we wszystkich trzech
plikach. Nie umieszczaj nowej treści na stałe w komponentach prezentacyjnych.
Etykiety dostępności karuzeli są przekazywane przez propsy; obecnie
`HomePage.tsx` przekazuje angielskie wartości. Jeśli będą lokalizowane, należy
dodać odpowiadające klucze i18n zamiast przenosić `useTranslation` do
`NewsCarousel`.

## Zasady dla przyszłych zmian

1. Utrzymuj `HomePage`, `HeroSection` i `AboutSection` jako cienkie komponenty
   kompozycyjne.
2. Nowy duży fragment wizualny wydziel do komponentu w odpowiednim katalogu
   domenowym.
3. Logikę stanu, event listenery i timery wydzielaj do hooków, gdy nie są
   szczegółem pojedynczego elementu prezentacyjnego.
4. Eksportuj interfejs propsów i preferuj wymagane, jawne propsy.
5. Przekazuj wartości semantyczne, takie jak `tone`, zamiast klas CSS.
6. Zachowuj pełne, statyczne nazwy klas Tailwinda w mapach wariantów.
7. Korzystaj z publicznych prymitywów `@/shared`; nie importuj komponentów
   administratora z `components/ui`.
8. Nie przenoś wyboru danych językowych do komponentów prezentacyjnych.
9. Każdy listener i timer musi mieć cleanup.
10. Nie zmieniaj jednocześnie architektury i wyglądu, jeśli zadanie dotyczy
    wyłącznie refaktoryzacji.

## Lista kontroli regresji

Po każdej zmianie uruchom w katalogu `frontend`:

```bash
npm run lint
npm run typecheck
npm run build
```

Sprawdź także `git diff --check` w katalogu repozytorium oraz ręcznie stronę
`/` co najmniej w następujących stanach:

- desktop: szerokość od `1024px`, trzy aktualności,
- tablet: szerokość `768px`–`1023px`, dwie aktualności,
- mobile: szerokość poniżej `768px`, jedna aktualność,
- nawigacja karuzeli w przód, wstecz i przez kropki,
- zapętlenie z pierwszego na ostatni i z ostatniego na pierwszy slajd,
- zmiana języka między polskim, angielskim i niemieckim,
- link karty otwierający właściwe wydarzenie,
- hover kart About oraz widoczność treści nad cząsteczkami Hero,
- reakcja cząsteczek na kursor i dodawanie czterech po kliknięciu Hero,
- całkowity brak canvasa przy `prefers-reduced-motion: reduce`, przy zachowaniu
  tła, tytułu i motta Hero,
- zmiana szerokości okna podczas aktywnego slajdu karuzeli,
- brak poziomego scrollbara.

Build może zgłosić ostrzeżenie o chunku większym niż 500 kB. Nie jest to błąd
kompilacji ani odpowiedzialność komponentów Home; optymalizacja code splittingu
powinna być osobnym zadaniem.

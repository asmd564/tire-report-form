# Formularz raportu opon

Publiczny formularz webowy do zapisania raportu oceny stanu opon pojazdu. Projekt jest przygotowany jako MVP do zadania rekrutacyjnego: użytkownik z zewnątrz może dodać zgłoszenie, ale nie może podejrzeć, edytować ani usuwać zapisanych raportów.

## Live demo

- Live: `https://...`
- Repo: `https://github.com/...`

## Stack

- **React + Vite + TypeScript** — szybki setup, dobra czytelność i łatwy deploy na Vercel/Netlify.
- **React Hook Form + Zod** — prosta obsługa formularza i walidacji przy konkretnych polach.
- **Supabase** — szybka baza PostgreSQL + RLS, zgodnie z preferowanym stackiem z zadania.
- **Rozszerzony lokalny katalog marek/modeli i marek opon** — celowo bez dodatkowej zależności npm, żeby MVP było lekkie, przewidywalne i łatwe do sprawdzenia. Dla brakujących pozycji użytkownik może wybrać opcję ręcznego wpisania.

## Funkcjonalność

Formularz zbiera:

- dane pojazdu: marka i model wybierane z listy albo wpisywane ręcznie, VIN, opcjonalny email zgłaszającego,
- ocenę 4 kół: Przód-L, Przód-P, Tył-L, Tył-P,
- dla każdego koła: marka opony wybierana z listy albo wpisywana ręcznie, rozmiar, głębokość bieżnika, DOT, ocena 1–5, opcjonalne uwagi.

Dodatkowe usprawnienia UX:

- pola wyboru marki pojazdu, modelu i marki opony działają jak live search (można pisać i filtrować listę),
- po wyborze marki pojazdu lista modeli jest zawężana do tej marki,
- jeśli marki, modelu lub marki opony nie ma w katalogu, użytkownik może wybrać opcję ręcznego wpisania,
- rozmiar opony można wpisać samymi cyframi, np. `2055516`, a formularz automatycznie formatuje to do `205/55 R16`,
- na pierwszej karcie opony można zaznaczyć kopiowanie marki opony oraz/lub rozmiaru do wszystkich czterech kół, co przyspiesza wypełnianie typowych zgłoszeń,
- VIN jest automatycznie zamieniany na wielkie litery i usuwa niedozwolone znaki `I`, `O`, `Q`.

Po wysłaniu użytkownik dostaje jasny feedback: loading, success lub error. Po poprawnym zapisie formularz jest czyszczony i można szybko dodać kolejne zgłoszenie.

## Walidacja

Zaimplementowałem podstawową walidację po stronie formularza:

- VIN: 17 znaków, bez liter `I`, `O`, `Q`,
- rozmiar opony: format np. `205/55 R16`,
- DOT: ostatnie 4 cyfry, np. `2322`, z kontrolą tygodnia `01–53`,
- głębokość bieżnika: liczba w zakresie `0–20 mm`,
- ocena: liczba całkowita od `1` do `5`,
- pola ręczne korzystają z tej samej walidacji długości tekstu co pola wybierane z listy.

Niski bieżnik nie blokuje wysłania formularza. Pokazuję ostrzeżenie, ponieważ w zadaniu potraktowano to jako informację, a nie błąd blokujący.

## Struktura danych

Dla MVP użyłem jednej tabeli `tire_reports` z polem `tires` typu `jsonb`.

Katalogi wyboru znajdują się w pliku `src/lib/catalog.ts`, komponent live search w `src/components/SearchableSelect.tsx`, a logika kart opon i kopiowania wartości do wszystkich kół w `src/components/TireCard.tsx`. To świadome uproszczenie: nie pobieram list marek z zewnętrznego API, bo formularz ma działać szybko i stabilnie jako MVP. Katalog jest rozszerzony o popularne marki z rynku europejskiego, ale nie blokuje rzadkich przypadków — dla brakujących marek/modeli/opon dostępny jest ręczny wpis. W produkcji taki katalog można podpiąć pod bazę danych lub zewnętrzne źródło.

Powód użycia jednej tabeli: jedno wysłanie formularza = jeden raport, więc zapis w jednej tabeli upraszcza flow, unika problemu częściowego zapisu kilku tabel z publicznego klienta i jest wystarczający dla proof of conceptu.

Gdyby projekt miał wejść na produkcję, rozważyłbym normalizację do tabel `reports` + `tires` lub zapis przez RPC/Edge Function w transakcji.

## Bezpieczeństwo danych

Publiczny frontend używa wyłącznie Supabase `anon key`. Klucz `service_role` nie jest i nie powinien być używany w aplikacji frontendowej.

W Supabase włączone jest RLS:

- `anon` ma tylko `INSERT` do tabeli `tire_reports`,
- nie ma polityki `SELECT`, więc publiczny użytkownik nie może czytać raportów,
- nie ma polityki `UPDATE`, więc publiczny użytkownik nie może edytować raportów,
- nie ma polityki `DELETE`, więc publiczny użytkownik nie może usuwać raportów.

SQL znajduje się w pliku:

```bash
supabase/schema.sql
```

Jak łatwo zweryfikować zabezpieczenie:

```ts
await supabase.from('tire_reports').insert(payload); // powinno działać
await supabase.from('tire_reports').select('*');     // powinno być zablokowane przez RLS / brak uprawnień
await supabase.from('tire_reports').update({}).eq('id', id); // zablokowane
await supabase.from('tire_reports').delete().eq('id', id);   // zablokowane
```

## Świadome uproszczenia

- Brak panelu admina do odczytu zgłoszeń, bo zadanie wymagało publicznego formularza dodawania, a nie zarządzania raportami.
- Katalog marek i modeli jest rozszerzony, ale nadal nie jest pełną bazą wszystkich pojazdów; dlatego dodałem ręczny wpis jako bezpieczne obejście dla nietypowych przypadków.
- Walidacja JSONB w bazie jest podstawowa; pełna walidacja struktury odbywa się po stronie formularza.
- Brak antyspamu/CAPTCHA/rate limitingu — w produkcji dodałbym np. Turnstile lub zapis przez Edge Function.
- Brak testów automatycznych — przy produkcyjnej wersji dodałbym testy walidacji i e2e dla flow wysyłki.
- Brak uploadu zdjęć opon, bo nie było tego w zakresie zadania.

## Co zrobiłbym inaczej w produkcji

- Dodałbym autoryzowany panel dla pracowników do przeglądania raportów.
- Przeniósłbym zapis do Supabase Edge Function lub backendu, żeby mieć walidację po stronie serwera, rate limiting i lepszą kontrolę błędów.
- Rozszerzyłbym walidację DOT o pełny kod, a nie tylko ostatnie 4 cyfry produkcyjne.
- Dodałbym zarządzany katalog marek/modeli pojazdów oraz marek opon w panelu administracyjnym.
- Dodałbym logowanie błędów i monitoring.
- Dodałbym migracje oraz seed/testowe dane dla środowisk dev/staging.

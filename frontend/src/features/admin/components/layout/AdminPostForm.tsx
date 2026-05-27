import { useState } from 'react';
import { ImagePlus, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AdminFormTextEditor } from './AdminFormTextEditor';

type LangCode = 'pl' | 'en' | 'de';

interface Translation {
  languageCode: LangCode;
  title: string;
  shortDescription: string;
  fullDescription: string;
}

interface PostDraft {
  id: string;
  postType: string;
  eventDate: string;
  startsAt: string;
  expiresAt: string;
  thumbnailUrl: string;
  imageUrls: string[];
  externalLink: string;
  translations: Translation[];
}

const LANGS: { code: LangCode; label: string; name: string }[] = [
  { code: 'pl', label: 'PL', name: 'polski' },
  { code: 'en', label: 'EN', name: 'angielski' },
  { code: 'de', label: 'DE', name: 'niemiecki' },
];

const POST_TYPES = ['NEWS', 'EVENT', 'PROJECT', 'TEMP'];

const inputClass =
  'h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 dark:bg-input/30';

const labelClass = 'block text-sm font-medium mb-1';

export function AdminPostForm() {
  const [activeLang, setActiveLang] = useState<LangCode>('pl');

  const [postDraft, setPostDraft] = useState<PostDraft>({
    id: '',
    postType: 'TEMP',
    eventDate: '2026-04-15T18:00:00',
    startsAt: '2026-04-01T08:00:00',
    expiresAt: '2026-04-16T23:59:59',
    thumbnailUrl: '/img/thumb.jpg',
    imageUrls: ['/img/galeria1.jpg', '/img/galeria2.jpg'],
    externalLink: 'https://facebook.com/events/123',
    translations: [
      { languageCode: 'pl', title: '', shortDescription: '', fullDescription: '' },
      { languageCode: 'en', title: '', shortDescription: '', fullDescription: '' },
      { languageCode: 'de', title: '', shortDescription: '', fullDescription: '' },
    ],
  });

  const getTranslation = (lang: LangCode) =>
    postDraft.translations.find((t) => t.languageCode === lang)!;

  const updateTranslation = (
    lang: LangCode,
    field: keyof Omit<Translation, 'languageCode'>,
    value: string
  ) => {
    setPostDraft((prev) => ({
      ...prev,
      translations: prev.translations.map((t) =>
        t.languageCode === lang ? { ...t, [field]: value } : t
      ),
    }));
  };

  const updateField = <K extends keyof PostDraft>(field: K, value: PostDraft[K]) => {
    setPostDraft((prev) => ({ ...prev, [field]: value }));
  };

  const isTranslationComplete = (lang: LangCode) => {
    const t = getTranslation(lang);
    return (
      t.title.trim() !== '' &&
      t.shortDescription.trim() !== '' &&
      t.fullDescription.trim() !== ''
    );
  };

  const allTranslationsComplete = LANGS.every((l) => isTranslationComplete(l.code));
  const currentTranslation = getTranslation(activeLang);

  return (
    <div className="space-y-6">
      {/* General fields */}
      <div className="rounded-lg border bg-card p-4 space-y-3">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Dane ogólne
        </h3>

        {/* Left (dates) + divider + Right (meta) */}
        <div className="flex gap-4">
          <div className="shrink-0 w-56 space-y-3">
            <div>
              <label className={labelClass}>Data wydarzenia</label>
              <Input
                type="datetime-local"
                value={postDraft.eventDate}
                onChange={(e) => updateField('eventDate', e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Publikacja od</label>
              <Input
                type="datetime-local"
                value={postDraft.startsAt}
                onChange={(e) => updateField('startsAt', e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Wygasa</label>
              <Input
                type="datetime-local"
                value={postDraft.expiresAt}
                onChange={(e) => updateField('expiresAt', e.target.value)}
              />
            </div>
          </div>

          <div className="w-px self-stretch bg-border" />

          <div className="flex-1 space-y-3">
            <div>
              <label className={labelClass}>Typ posta</label>
              <select
                value={postDraft.postType}
                onChange={(e) => updateField('postType', e.target.value)}
                className={inputClass}
              >
                {POST_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>URL miniatury</label>
              <Input
                value={postDraft.thumbnailUrl}
                onChange={(e) => updateField('thumbnailUrl', e.target.value)}
                placeholder="/img/thumb.jpg"
              />
            </div>
            <div>
              <label className={labelClass}>Link zewnętrzny</label>
              <Input
                value={postDraft.externalLink}
                onChange={(e) => updateField('externalLink', e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>
        </div>

        {/* Gallery images — side by side */}
        <div className="border-t pt-3">
          <label className={labelClass}>Zdjęcia galerii</label>
          <div className="flex flex-wrap items-center gap-2">
            {postDraft.imageUrls.map((url, idx) => (
              <div key={idx} className="flex min-w-[180px] flex-1 items-center gap-1">
                <Input
                  value={url}
                  onChange={(e) => {
                    const updated = [...postDraft.imageUrls];
                    updated[idx] = e.target.value;
                    updateField('imageUrls', updated);
                  }}
                  placeholder="/img/galeria.jpg"
                />
                <button
                  type="button"
                  onClick={() =>
                    updateField(
                      'imageUrls',
                      postDraft.imageUrls.filter((_, i) => i !== idx)
                    )
                  }
                  className="shrink-0 text-xs text-muted-foreground transition-colors hover:text-destructive"
                >
                  Usuń
                </button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" disabled className="shrink-0">
              <ImagePlus />
              Dodaj zdjęcie
            </Button>
          </div>
        </div>
      </div>

      {/* Translation section */}
      <div className="rounded-lg border bg-card p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Tłumaczenia
          </h3>
          {allTranslationsComplete ? (
            <span className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400">
              <CheckCircle2 className="size-3.5" />
              Dodano tłumaczenia dla wszystkich języków
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <XCircle className="size-3.5 text-amber-500" />
              Brakuje tłumaczeń:{' '}
              {LANGS.filter((l) => !isTranslationComplete(l.code))
                .map((l) => l.name)
                .join(', ')}
            </span>
          )}
        </div>

        {/* Language tabs */}
        <div className="flex gap-1 border-b">
          {LANGS.map((lang) => {
            const complete = isTranslationComplete(lang.code);
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => setActiveLang(lang.code)}
                className={[
                  'relative -mb-px border-b-2 px-4 py-2 text-sm font-medium transition-colors',
                  activeLang === lang.code
                    ? 'border-primary text-foreground'
                    : 'border-transparent text-muted-foreground hover:text-foreground',
                ].join(' ')}
              >
                {lang.label}
                <span
                  className={[
                    'ml-1.5 inline-block size-1.5 rounded-full align-middle',
                    complete ? 'bg-green-500' : 'bg-amber-400',
                  ].join(' ')}
                />
              </button>
            );
          })}
        </div>

        {/* Translation fields for active language */}
        <div className="space-y-4">
          <div>
            <label className={labelClass}>
              Tytuł{' '}
              <span className="font-normal text-muted-foreground">({activeLang.toUpperCase()})</span>
            </label>
            <Input
              value={currentTranslation.title}
              onChange={(e) => updateTranslation(activeLang, 'title', e.target.value)}
              placeholder="Tytuł posta..."
            />
          </div>

          <div>
            <label className={labelClass}>
              Krótki opis{' '}
              <span className="font-normal text-muted-foreground">({activeLang.toUpperCase()})</span>
            </label>
            <Input
              value={currentTranslation.shortDescription}
              onChange={(e) => updateTranslation(activeLang, 'shortDescription', e.target.value)}
              placeholder="Krótki opis wyświetlany na liście postów..."
            />
          </div>

          <div>
            <label className={labelClass}>
              Pełny opis{' '}
              <span className="font-normal text-muted-foreground">({activeLang.toUpperCase()})</span>
            </label>
            <AdminFormTextEditor
              value={currentTranslation.fullDescription}
              onChange={(html) => updateTranslation(activeLang, 'fullDescription', html)}
            />
          </div>
        </div>

        {/* Per-language completion status */}
        <div className="flex flex-wrap gap-4 border-t pt-1">
          {LANGS.map((lang) => {
            const complete = isTranslationComplete(lang.code);
            const langLabel =
              lang.code === 'pl' ? 'polsku' : lang.code === 'en' ? 'angielsku' : 'niemiecku';
            return (
              <span
                key={lang.code}
                className={[
                  'text-xs',
                  complete ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground',
                ].join(' ')}
              >
                {complete
                  ? `✓ Dodano treść po ${langLabel}`
                  : `Nie dodano tekstu dla języka ${lang.name}`}
              </span>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => console.log('postDraft:', postDraft)}
        >
          Podgląd stanu (konsola)
        </Button>
        <Button type="button">Zapisz post</Button>
      </div>
    </div>
  );
}

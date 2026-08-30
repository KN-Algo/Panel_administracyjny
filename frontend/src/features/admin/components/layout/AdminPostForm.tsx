import { useRef, useState } from 'react';
import { Upload, Loader2, X, Star, Image as ImageIcon, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { AdminFormTextEditor } from './AdminFormTextEditor';

type LangCode = 'pl' | 'en' | 'de';

//typy zgodne z dokumentacja backendu
type PostType = 'STANDARD' | 'NEWS' | 'TEMP' | 'TEMP_STANDARD' | 'TEMP_NEWS';

interface Translation {
  languageCode: LangCode;
  title: string;
  shortDescription: string;
  fullDescription: string;
}

interface PostDraft {
  id: string;
  postType: PostType;
  eventDate: string;
  startsAt: string;
  expiresAt: string;
  thumbnailUrl: string;
  imageUrls: string[];
  //ten external link krystian chcial usunac ale w razie co jest zostawione tak jak bylo na danych przykladowych w dokumentacji
  //pozniej to pole do usuniecia ale niech zostanie bo nie przeszkadza
  externalLink: string;
  translations: Translation[];
}

const LANGS: { code: LangCode; label: string; name: string }[] = [
  { code: 'pl', label: 'PL', name: 'polski' },
  { code: 'en', label: 'EN', name: 'angielski' },
  { code: 'de', label: 'DE', name: 'niemiecki' },
];

const POST_TYPES: PostType[] = ['STANDARD', 'NEWS', 'TEMP', 'TEMP_STANDARD', 'TEMP_NEWS'];

// typy czasowe czyli modale i ogloszenia wymagają dat: startsAt, expiresAt, eventDate
const TEMP_TYPES: PostType[] = ['TEMP', 'TEMP_STANDARD', 'TEMP_NEWS'];
const isTempType = (type: PostType) => TEMP_TYPES.includes(type);

const inputClass =
  'h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 dark:bg-input/30';

const labelClass = 'block text-sm font-medium mb-1';

export function AdminPostForm() {
  const [activeLang, setActiveLang] = useState<LangCode>('pl');

  const [postDraft, setPostDraft] = useState<PostDraft>({
    id: '',
    postType: 'TEMP',
    eventDate: '',
    startsAt: '',
    expiresAt: '',
    thumbnailUrl: '',
    //imageUrls: ['/img/galeria1.jpg', '/img/galeria2.jpg'],
    //tutaj zostawiam sobie stare przykladowe dane testowe
    imageUrls: [],
    externalLink: '',
    translations: [
      { languageCode: 'pl', title: '', shortDescription: '', fullDescription: '' },
      { languageCode: 'en', title: '', shortDescription: '', fullDescription: '' },
      { languageCode: 'de', title: '', shortDescription: '', fullDescription: '' },
    ],
  });

  // przełącznik od nie wygasania posta
  const [noExpiry, setNoExpiry] = useState(false);

  // uploadowanie zdj
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

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

  // shortDescription jest opcjonalny wg dokumentacji no i ogl wymagane są tylko title + fullDescription
  const isTranslationComplete = (lang: LangCode) => {
    const t = getTranslation(lang);
    return t.title.trim() !== '' && t.fullDescription.trim() !== '';
  };

  const allTranslationsComplete = LANGS.every((l) => isTranslationComplete(l.code));
  const currentTranslation = getTranslation(activeLang);
  const showTempFields = isTempType(postDraft.postType);

  // upload zdjec tutaj (INDEKS W NAZWIE ZDJ NADAJE BACKEND)
  const appendImages = (urls: string[]) => {
    if (urls.length === 0) return;
    setPostDraft((prev) => ({ ...prev, imageUrls: [...prev.imageUrls, ...urls] }));
  };

  const uploadFiles = async (files: File[]) => {
    if (files.length === 0) return;
    setUploading(true);
    setUploadError(null);
    try {
      if (files.length === 1) {
        const fd = new FormData();
        fd.append('file', files[0]);
        const res = await fetch('/api/files/upload', { method: 'POST', body: fd });
        if (!res.ok) throw new Error(`Błąd wgrywania (${res.status})`);
        const data: { url: string } = await res.json();
        appendImages([data.url]);
      } else {
        const fd = new FormData();
        files.forEach((f) => fd.append('files', f));
        const res = await fetch('/api/files/upload/batch', { method: 'POST', body: fd });
        if (!res.ok) throw new Error(`Błąd wgrywania (${res.status})`);
        const data: {
          successes?: { filename: string; url: string }[];
          errors?: { filename: string; error: string }[];
        } = await res.json();
        appendImages((data.successes ?? []).map((s) => s.url));
        if (data.errors?.length) {
          setUploadError(
            `Nie wgrano: ${data.errors.map((e) => `${e.filename} (${e.error})`).join(', ')}`
          );
        }
      }
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Nie udało się wgrać zdjęć');
    } finally {
      setUploading(false);
    }
  };

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    void uploadFiles(Array.from(fileList));
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeImage = (idx: number) => {
    const url = postDraft.imageUrls[idx];
    setPostDraft((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== idx),
      // jeśli usuwamy zdjęcie ustawione jako miniatura to wybór miniatury musi sie wyczyscic
      thumbnailUrl: prev.thumbnailUrl === url ? '' : prev.thumbnailUrl,
    }));
  };

  return (
    <div className="flex items-start gap-6">
      {/* Główna sekcja */}
      <div className="min-w-0 flex-1 space-y-4">
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

          {/* zakładki z językami*/}
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

          {/* pola tłumaczeń */}
          <div className="space-y-4">
            <div>
              <label className={labelClass}>
                Tytuł{' '}
                <span className="font-normal text-muted-foreground">
                  ({activeLang.toUpperCase()})
                </span>
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
                <span className="font-normal text-muted-foreground">
                  ({activeLang.toUpperCase()}) — opcjonalnie
                </span>
              </label>
              <Input
                value={currentTranslation.shortDescription}
                onChange={(e) =>
                  updateTranslation(activeLang, 'shortDescription', e.target.value)
                }
                placeholder="Krótki opis wyświetlany na liście postów..."
              />
            </div>

            <div>
              <label className={labelClass}>
                Pełny opis - treść posta{' '}
                <span className="font-normal text-muted-foreground">
                  ({activeLang.toUpperCase()})
                </span>
              </label>
              <AdminFormTextEditor
                value={currentTranslation.fullDescription}
                onChange={(html) => updateTranslation(activeLang, 'fullDescription', html)}
              />
            </div>
          </div>

        </div>

        {/* przyciski zapisz post i roboczy podgląd stanu (???do usunięcia potem???)*/}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => console.log('postDraft:', postDraft, 'noExpiry:', noExpiry)}
          >
            Podgląd stanu (konsola)
          </Button>
          <Button type="button">Zapisz post</Button>
        </div>
      </div>

      {/* sidebar - dane ogólne */}
      <div className="w-64 shrink-0 rounded-lg border bg-card p-4 space-y-3">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Dane ogólne
        </h3>

        <div>
          <label className={labelClass}>Typ posta</label>
          <select
            value={postDraft.postType}
            onChange={(e) => updateField('postType', e.target.value as PostType)}
            className={inputClass}
          >
            {POST_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* pola dat tylko dla typów czasowych czyli TEMP, TEMP_STANDARD, TEMP_NEWS, tak jak w dokumentacji */}
        {showTempFields && (
          <>
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
          {/*wygaszanie postów - włącz/wyłącz*/}
            <div>
              <div className="mb-1 flex items-center justify-between gap-2">
                <label className={`${labelClass} mb-0`}>Wygasa</label>
                <label className="flex cursor-pointer items-center gap-1.5 text-xs text-muted-foreground">
                  <Switch size="sm" checked={noExpiry} onCheckedChange={setNoExpiry} />
                  Nie wygasa
                </label>
              </div>
              {noExpiry ? (
                <p className="text-xs text-muted-foreground">
                  Post nie będzie automatycznie wygaszany.
                </p>
              ) : (
                <Input
                  type="datetime-local"
                  value={postDraft.expiresAt}
                  onChange={(e) => updateField('expiresAt', e.target.value)}
                />
              )}
            </div>
          </>
        )}

        <div className="border-t pt-3">
          <label className={labelClass}>Zdjęcia</label>

          {/* strefa drag & drop do uploadowania zdj*/}
          <div
            role="button"
            tabIndex={0}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setIsDragging(false);
            }}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                fileInputRef.current?.click();
              }
            }}
            className={[
              'flex flex-col items-center justify-center gap-1 rounded-md border border-dashed px-3 py-4 text-center text-xs transition-colors outline-none',
              uploading ? 'cursor-wait' : 'cursor-pointer',
              isDragging
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-input text-muted-foreground hover:border-ring focus-visible:border-ring',
            ].join(' ')}
          >
            {uploading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Wgrywanie...
              </>
            ) : (
              <>
                <Upload className="size-4" />
                Przeciągnij zdjęcia lub kliknij, aby wybrać
              </>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              handleFiles(e.target.files);
              e.target.value = '';
            }}
          />

          {uploadError && (
            <p className="mt-1.5 text-xs text-destructive">{uploadError}</p>
          )}

          {/* podgląd wgranych zdjęć, mozna kliknac gwizdke zeby wybrać miniarurę do posta */}
          {postDraft.imageUrls.length > 0 && (
            <>
              <p className="mt-2 text-xs text-muted-foreground">
                Kliknij gwiazdkę, aby ustawić miniaturę.
              </p>
              <div className="mt-1.5 grid grid-cols-3 gap-1.5">
                {postDraft.imageUrls.map((url, idx) => {
                  const isThumbnail = postDraft.thumbnailUrl === url;
                  return (
                    <div
                      key={idx}
                      className={[
                        'group relative aspect-square overflow-hidden rounded-md border bg-muted',
                        isThumbnail ? 'ring-2 ring-primary ring-offset-1 ring-offset-card' : '',
                      ].join(' ')}
                    >
                      <ImageIcon className="absolute inset-0 m-auto size-5 text-muted-foreground/40" />
                      <img
                        src={url}
                        alt=""
                        className="relative h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.visibility = 'hidden';
                        }}
                      />
                      <button
                        type="button"
                        aria-label={isThumbnail ? 'Miniatura' : 'Ustaw jako miniaturę'}
                        aria-pressed={isThumbnail}
                        onClick={() => updateField('thumbnailUrl', url)}
                        className={[
                          'absolute left-0.5 top-0.5 flex size-4 items-center justify-center rounded bg-background/80 transition-opacity [&_svg]:size-3',
                          isThumbnail
                            ? 'text-primary opacity-100 [&_svg]:fill-primary'
                            : 'text-muted-foreground opacity-0 hover:text-primary group-hover:opacity-100',
                        ].join(' ')}
                      >
                        <Star />
                      </button>
                      <button
                        type="button"
                        aria-label="Usuń zdjęcie"
                        onClick={() => removeImage(idx)}
                        className="absolute right-0.5 top-0.5 flex size-4 items-center justify-center rounded bg-background/80 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100 [&_svg]:size-3"
                      >
                        <X />
                      </button>
                      {isThumbnail && (
                        <span className="absolute inset-x-0 bottom-0 bg-primary/85 py-0.5 text-center text-[10px] font-medium leading-none text-primary-foreground">
                          Miniatura
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

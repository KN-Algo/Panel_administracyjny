import { useTranslation } from 'react-i18next';

export default function ContactPage() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-4">{t('contact.page_title')}</h1>
      <p className="text-center text-gray-600">{t('contact.page_subtitle')}</p>
    </div>
  );
}

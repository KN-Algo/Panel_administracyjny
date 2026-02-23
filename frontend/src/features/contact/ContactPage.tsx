import { useTranslation } from "react-i18next";
import { useState } from "react";
import type { FormEvent } from "react";
import {
  User,
  Mail,
  MessageSquare,
  Send,
  Facebook,
  Instagram,
  Github,
  Linkedin,
  Mail as MailIcon,
} from "lucide-react";

export default function ContactPage() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Integracja z reCAPTCHA v3
      // const recaptchaToken = await grecaptcha.execute('SITE_KEY', {action: 'submit'});

      // TODO: Weryfikacja reCAPTCHA
      // const recaptchaResponse = await fetch('/src/api/recaptcha.php', {
      //   method: 'POST',
      //   body: new FormData().append('token', recaptchaToken)
      // });

      // Wysyłka wiadomości
      // pozdrawiam Cię misia
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("subject", formData.subject);
      formDataToSend.append("message", formData.message);

      const response = await fetch("/src/api/sendContactMail.php", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();

      // Alert success/error
      alert(`${data.title}\n${data.message}`);

      if (data.icon === "success") {
        setFormData({ name: "", email: "", subject: "", message: "" });
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Wystąpił błąd podczas wysyłania wiadomości.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section with Gradient */}
      <section
        className="py-20 text-center text-white relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #0b0c2a 0%, #1a1b3a 50%, #000424 100%)",
        }}
      >
        {/* Decorative circles */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-[#f8e9e5]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-[#f8e9e5]/10 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
            {t("contact.page_title")}
          </h1>
          <p className="text-lg md:text-xl text-gray-200">
            {t("contact.page_subtitle")}
          </p>
        </div>
      </section>

      {/* Form Section with Info Card */}
      <section className="py-16 -mt-10">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Contact Form - 2/3 width */}
            <div className="md:col-span-2">
              <form
                onSubmit={handleSubmit}
                className="bg-white rounded-2xl shadow-2xl p-8 md:p-10 transform transition-all hover:shadow-3xl"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {t("contact.form_header")}
                </h2>

                {/* Name */}
                <div className="mb-6 group">
                  <label
                    htmlFor="name"
                    className="block text-gray-700 font-semibold mb-2"
                  >
                    {t("contact.form_name")}
                  </label>
                  <div className="relative">
                    <User
                      className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                        focusedField === "name"
                          ? "text-[#000424]"
                          : "text-gray-400"
                      }`}
                    />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("name")}
                      onBlur={() => setFocusedField(null)}
                      required
                      maxLength={100}
                      className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#000424] focus:border-transparent transition-all"
                      placeholder={t("contact.placeholder_name")}
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="mb-6 group">
                  <label
                    htmlFor="email"
                    className="block text-gray-700 font-semibold mb-2"
                  >
                    {t("contact.form_email")}
                  </label>
                  <div className="relative">
                    <Mail
                      className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                        focusedField === "email"
                          ? "text-[#000424]"
                          : "text-gray-400"
                      }`}
                    />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                      required
                      maxLength={100}
                      className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#000424] focus:border-transparent transition-all"
                      placeholder={t("contact.placeholder_email")}
                    />
                  </div>
                </div>

                {/* Subject */}
                <div className="mb-6 group">
                  <label
                    htmlFor="subject"
                    className="block text-gray-700 font-semibold mb-2"
                  >
                    {t("contact.form_subject")}
                  </label>
                  <div className="relative">
                    <MessageSquare
                      className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                        focusedField === "subject"
                          ? "text-[#000424]"
                          : "text-gray-400"
                      }`}
                    />
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("subject")}
                      onBlur={() => setFocusedField(null)}
                      required
                      maxLength={120}
                      className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#000424] focus:border-transparent transition-all"
                      placeholder={t("contact.placeholder_subject")}
                    />
                  </div>
                </div>

                {/* Message */}
                <div className="mb-6 group">
                  <label
                    htmlFor="message"
                    className="block text-gray-700 font-semibold mb-2"
                  >
                    {t("contact.form_message")}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("message")}
                    onBlur={() => setFocusedField(null)}
                    required
                    maxLength={2000}
                    rows={6}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#000424] focus:border-transparent resize-none transition-all"
                    placeholder={t("contact.placeholder_message")}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-[#000424] to-[#1a1b3a] text-white py-4 px-6 rounded-xl font-semibold transition-all hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 group"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      {t("contact.alert_sending")}
                    </>
                  ) : (
                    <>
                      {t("contact.form_submit")}
                      <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Contact Info Card - 1/3 width */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-2xl shadow-2xl p-8 sticky top-24">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  {t("contact.info_header")}
                </h3>

                {/* Email */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 text-gray-700 mb-2">
                    <div className="bg-[#f8e9e5] p-2 rounded-lg">
                      <MailIcon className="w-5 h-5 text-[#000424]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-500">
                        {t("contact.info_email_label")}
                      </p>
                      <a
                        href="mailto:algo.pwr@gmail.com"
                        className="text-[#000424] hover:underline font-medium"
                      >
                        algo.pwr@gmail.com
                      </a>
                    </div>
                  </div>
                </div>

                <hr className="my-6 border-gray-200" />

                {/* Social Media */}
                <div>
                  <p className="text-sm font-semibold text-gray-500 mb-4">
                    {t("contact.info_follow_label")}
                  </p>
                  <div className="flex gap-3">
                    <a
                      href="https://www.facebook.com/kolo.naukowe.algo"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#f8e9e5] p-3 rounded-xl hover:bg-[#000424] hover:text-white transition-all hover:scale-110 group"
                    >
                      <Facebook className="w-5 h-5" />
                    </a>
                    <a
                      href="https://www.instagram.com/kn_algo/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#f8e9e5] p-3 rounded-xl hover:bg-[#000424] hover:text-white transition-all hover:scale-110 group"
                    >
                      <Instagram className="w-5 h-5" />
                    </a>
                    <a
                      href="https://github.com/KN-Algo"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#f8e9e5] p-3 rounded-xl hover:bg-[#000424] hover:text-white transition-all hover:scale-110 group"
                    >
                      <Github className="w-5 h-5" />
                    </a>
                    <a
                      href="https://linkedin.com/company/koło-naukowe-algo"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#f8e9e5] p-3 rounded-xl hover:bg-[#000424] hover:text-white transition-all hover:scale-110 group"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslations } from 'next-intl';

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const t = useTranslations('contact');
  const sectionRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });

  useEffect(() => {
    const isMobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      const title = formRef.current?.querySelector('h2');
      const subtitle = formRef.current?.querySelector('p');
      const form = formRef.current?.querySelector('form');
      const formInputs = form?.querySelectorAll('input, textarea, button');

      if (title) {
        gsap.from(title, {
          scrollTrigger: {
            trigger: formRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          },
          opacity: 0,
          y: isMobile ? 30 : 60,
          duration: isMobile ? 0.6 : 1,
          ease: 'power3.out'
        });
      }

      if (subtitle) {
        gsap.from(subtitle, {
          scrollTrigger: {
            trigger: formRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          },
          opacity: 0,
          y: isMobile ? 20 : 40,
          duration: isMobile ? 0.6 : 1,
          delay: 0.2,
          ease: 'power3.out'
        });
      }

      if (formInputs && formInputs.length > 0) {
        gsap.from(formInputs, {
          scrollTrigger: {
            trigger: form,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          },
          opacity: 0,
          y: isMobile ? 20 : 40,
          stagger: isMobile ? 0.05 : 0.1,
          duration: isMobile ? 0.5 : 0.8,
          delay: 0.3,
          ease: 'power3.out'
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section
      ref={sectionRef}
      className="min-h-screen px-6 py-16 relative flex items-center bg-background"
    >
      <div className="max-w-4xl mx-auto w-full px-4">
        <div ref={formRef}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-4 md:mb-6 text-primary">
            {t('title')}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-foreground/90 mb-8 max-w-3xl" style={{ textAlign: 'justify', margin: '0 auto 2rem auto' }}>
            {t('subtitle')}
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground/90 mb-2">
                  {t('form.name')} *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg transition-all"
                  style={{
                    backgroundColor: 'rgba(20, 20, 20, 0.8)',
                    border: '2px solid #b845ff',
                    color: '#ffffff',
                    fontSize: '16px',
                    outline: 'none',
                    boxShadow: '0 0 20px rgba(184, 69, 255, 0.3), inset 0 1px 3px rgba(184, 69, 255, 0.1)',
                    WebkitAppearance: 'none',
                    MozAppearance: 'none',
                    appearance: 'none',
                    WebkitTextFillColor: '#ffffff',
                    opacity: 1
                  }}
                  placeholder={t('form.namePlaceholder')}
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground/90 mb-2">
                  {t('form.email')} *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg transition-all"
                  style={{
                    backgroundColor: 'rgba(20, 20, 20, 0.8)',
                    border: '2px solid #b845ff',
                    color: '#ffffff',
                    fontSize: '16px',
                    outline: 'none',
                    boxShadow: '0 0 20px rgba(184, 69, 255, 0.3), inset 0 1px 3px rgba(184, 69, 255, 0.1)',
                    WebkitAppearance: 'none',
                    MozAppearance: 'none',
                    appearance: 'none',
                    WebkitTextFillColor: '#ffffff',
                    opacity: 1
                  }}
                  placeholder={t('form.emailPlaceholder')}
                />
              </div>
            </div>

            <div>
              <label htmlFor="company" className="block text-sm font-medium text-foreground/90 mb-2">
                {t('form.company')}
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg transition-all"
                style={{
                  backgroundColor: 'rgba(20, 20, 20, 0.8)',
                  border: '2px solid #b845ff',
                  color: '#ffffff',
                  fontSize: '16px',
                  outline: 'none',
                  boxShadow: '0 0 20px rgba(184, 69, 255, 0.3), inset 0 1px 3px rgba(184, 69, 255, 0.1)',
                  WebkitAppearance: 'none',
                  MozAppearance: 'none',
                  appearance: 'none',
                  WebkitTextFillColor: '#ffffff',
                  opacity: 1
                }}
                placeholder={t('form.companyPlaceholder')}
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-foreground/90 mb-2">
                {t('form.message')} *
              </label>
              <textarea
                id="message"
                name="message"
                required
                value={formData.message}
                onChange={handleChange}
                rows={6}
                className="w-full px-4 py-3 rounded-lg transition-all resize-none"
                style={{
                  backgroundColor: 'rgba(20, 20, 20, 0.8)',
                  border: '2px solid #b845ff',
                  color: '#ffffff',
                  fontSize: '16px',
                  outline: 'none',
                  boxShadow: '0 0 20px rgba(184, 69, 255, 0.3), inset 0 1px 3px rgba(184, 69, 255, 0.1)',
                  WebkitAppearance: 'none',
                  MozAppearance: 'none',
                  appearance: 'none',
                  WebkitTextFillColor: '#ffffff',
                  opacity: 1
                }}
                placeholder={t('form.messagePlaceholder')}
              />
            </div>

            <button
              type="submit"
              className="w-full md:w-auto px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300"
              style={{
                backgroundColor: '#b845ff',
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer',
                pointerEvents: 'auto',
                opacity: 1,
                fontSize: '18px',
                boxShadow: '0 4px 20px rgba(184, 69, 255, 0.4), 0 0 40px rgba(184, 69, 255, 0.2)',
                transform: 'translateY(0)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#9a2edb';
                e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 6px 30px rgba(184, 69, 255, 0.6), 0 0 60px rgba(184, 69, 255, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#b845ff';
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(184, 69, 255, 0.4), 0 0 40px rgba(184, 69, 255, 0.2)';
              }}
            >
              {t('form.submit')}
            </button>
          </form>

          <div className="mt-16 text-center">
            <p className="text-foreground/60 text-sm">
              {t('footer')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

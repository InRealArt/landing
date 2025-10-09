'use client'
import { useState } from 'react';
import { motion } from 'framer-motion';
import PhoneInput from 'react-phone-number-input';
import { toast } from 'sonner';
import { GamePage } from '@/types/game';
import { useLanguageStore } from '@/store/languageStore';
import { gameTranslations } from '@/locales/gameComponents';
import Button from '@/components/common/Button';
import { subscribeToNewsletter } from '@/actions/newsletterActions';
import 'react-phone-number-input/style.css';

interface GameRegistrationProps {
  game: GamePage;
}

export default function GameRegistration({ game }: GameRegistrationProps) {
  const { language } = useLanguageStore();
  const t = gameTranslations[language];
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    phone: '',
    acceptNewsletter: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = t.registration.errors.nameRequired;
    }
    
    if (!formData.email.trim()) {
      newErrors.email = t.registration.errors.emailRequired;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t.registration.errors.emailInvalid;
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = t.registration.errors.phoneRequired;
    }

    if (!formData.acceptNewsletter) {
      newErrors.newsletter = t.registration.errors.newsletterRequired;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Show validation errors toast
      toast.error(
        language === 'fr'
          ? 'Veuillez corriger les erreurs dans le formulaire'
          : 'Please fix the errors in the form',
        {
          duration: 5000,
          className: 'bg-red-50 dark:bg-red-900',
        }
      );
      return;
    }

    setLoading(true);

    try {
      // Subscribe to newsletter if accepted
      if (formData.acceptNewsletter) {
        const newsletterFormData = new FormData();
        newsletterFormData.append('email', formData.email);
        newsletterFormData.append('language', language);
        
        const newsletterResult = await subscribeToNewsletter(newsletterFormData);
        
        if (!newsletterResult.success) {
          console.warn('Newsletter subscription failed:', newsletterResult.message);
          // Continue with game registration even if newsletter fails
        }
      }

      // Register for the game
      const response = await fetch('/api/game-registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          phone: formData.phone,
          gameSlug: game.slug,
          artworkName: game.artwork.name,
          language: language,
          brevoListIdFr: game.brevoListIdFr,
          brevoListIdEn: game.brevoListIdEn,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setSuccess(true);
      setFormData({ email: '', name: '', phone: '', acceptNewsletter: false });
      
      // Show success toast
      toast.success(
        language === 'fr' 
          ? 'Inscription réussie ! Vérifiez votre email pour la confirmation.'
          : 'Registration successful! Check your email for confirmation.',
        {
          duration: 5000,
          className: 'bg-green-50 dark:bg-green-900',
        }
      );
    } catch (err) {
      console.error('Registration error:', err);
      const errorMessage = t.registration.errors.submitError;
      setErrors(prev => ({
        ...prev,
        submit: errorMessage
      }));
      
      // Show error toast
      toast.error(errorMessage, {
        duration: 5000,
        className: 'bg-red-50 dark:bg-red-900',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="registration-form" className="py-20 px-4 bg-background">
      <div className="max-w-xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
          {t.registration.title}
        </h2>

        {success ? (
          <div className="text-center p-6 bg-green-500/10 rounded-lg">
            <p className="text-green-500 font-semibold">
              {t.registration.success}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-grayText mb-2">
                {t.registration.fullName}
                <span className="text-red-400 ml-1">*</span>
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={`w-full px-4 py-4 rounded-lg border-2 ${
                  errors.name ? 'border-red-500' : 'border-gray-700'
                } bg-backgroundGrey focus:border-purple-500 focus:outline-none text-textColor placeholder-gray-400 font-unbounded`}
              />
              {errors.name && (
                <p className="text-red-400 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-grayText mb-2">
                {t.registration.email}
                <span className="text-red-400 ml-1">*</span>
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={`w-full px-4 py-4 rounded-lg border-2 ${
                  errors.email ? 'border-red-500' : 'border-gray-700'
                } bg-backgroundGrey focus:border-purple-500 focus:outline-none text-textColor placeholder-gray-400 font-unbounded`}
              />
              {errors.email && (
                <p className="text-red-400 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-grayText mb-2">
                {t.registration.phone}
                <span className="text-red-400 ml-1">*</span>
              </label>
              <PhoneInput
                international
                countryCallingCodeEditable={false}
                defaultCountry="FR"
                value={formData.phone}
                onChange={(value) => handleChange('phone', value || '')}
                className={`phone-input-container phone-input-container-simulator w-full ${
                  errors.phone ? 'border-red-500' : ''
                }`}
              />
              {errors.phone && (
                <p className="text-red-400 text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            <div>
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={formData.acceptNewsletter}
                  onChange={(e) => handleChange('acceptNewsletter', e.target.checked)}
                  className="mt-1 w-5 h-5 rounded border-2 border-gray-700 bg-backgroundGrey text-primary focus:ring-2 focus:ring-primary/50 cursor-pointer"
                />
                <span className="text-sm text-grayText group-hover:text-textColor transition-colors">
                  {t.registration.newsletter}
                  <span className="text-red-400 ml-1">*</span>
                </span>
              </label>
              {errors.newsletter && (
                <p className="text-red-400 text-sm mt-1">{errors.newsletter}</p>
              )}
            </div>

            {errors.submit && (
              <p className="text-red-400 text-sm text-center">{errors.submit}</p>
            )}

            <Button
              text={loading
                ? t.registration.registering
                : t.registration.register
              }
              type="submit"
              disabled={loading}
              additionalClassName="w-full bg-purpleColor hover:bg-purpleColor/90"
              center
            />
          </form>
        )}
        {/* Terms and Conditions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16"
        >
          <div className="max-w-3xl mx-auto p-8 rounded-xl bg-gradient-to-br from-background/90 to-background/50 backdrop-blur-sm border border-border/50 shadow-lg">
            <motion.h3 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="font-semibold text-lg mb-6 text-center"
            >
              {language === 'en' ? 'Terms & Conditions' : 'Termes et Conditions'}
            </motion.h3>
            <ul className="space-y-4 text-sm text-textColor/80">
              {game.termsAndConditions[language].map((term, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="flex items-start gap-3 group"
                >
                  <span className="w-1.5 h-1.5 mt-2 rounded-full bg-primary/50 group-hover:bg-primary transition-colors" />
                  <span className="group-hover:text-textColor transition-colors duration-300">{term}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

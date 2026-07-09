'use client'

import { useState } from 'react';
import { toast } from 'sonner';

export default function LeasingSimulatorForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    // TODO: Implement actual form submission logic
    console.log('Form submitted:', data);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success('Votre demande a été envoyée. Nous vous répondrons sous 48h.');
    setIsSubmitting(false);
    e.currentTarget.reset();
  };

  return (
    <section id="simulateur" className="py-40 bg-[var(--soft-gray)] dark:bg-[#1a1a1a] px-10">
      <div className="max-w-3xl mx-auto bg-white dark:bg-[#f5f5f5] p-12 md:p-16 shadow-sm border border-gray-50 dark:border-gray-700">
        <div className="text-center mb-16">
          <h3 className="serif text-4xl md:text-5xl italic mb-4 text-ink-black dark:text-[#000000]">
            Demander une simulation
          </h3>
          <p className="text-xs uppercase tracking-widest text-gray-400 dark:text-gray-600">
            Réponse sous 48h par un conseiller spécialisé.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <input
              type="text"
              name="company"
              placeholder="ENTREPRISE"
              required
              className="w-full border-b border-gray-200 dark:border-gray-400 py-3 text-xs uppercase tracking-widest outline-none focus:border-gold-accent transition-all bg-transparent text-ink-black dark:text-[#000000] placeholder-gray-300 dark:placeholder-gray-500"
            />
            <input
              type="text"
              name="siret"
              placeholder="SIRET"
              required
              className="w-full border-b border-gray-200 dark:border-gray-400 py-3 text-xs uppercase tracking-widest outline-none focus:border-gold-accent transition-all bg-transparent text-ink-black dark:text-[#000000] placeholder-gray-300 dark:placeholder-gray-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <input
              type="email"
              name="email"
              placeholder="EMAIL PROFESSIONNEL"
              required
              className="w-full border-b border-gray-200 dark:border-gray-400 py-3 text-xs uppercase tracking-widest outline-none focus:border-gold-accent transition-all bg-transparent text-ink-black dark:text-[#000000] placeholder-gray-300 dark:placeholder-gray-500"
            />
            <select
              name="budget"
              required
              className="w-full border-b border-gray-200 dark:border-gray-400 py-3 text-xs uppercase tracking-widest outline-none bg-transparent text-ink-black dark:text-[#000000] cursor-pointer"
            >
              <option value="" disabled selected>BUDGET ESTIMÉ</option>
              <option value="5000-15000">5 000€ - 15 000€</option>
              <option value="15000-50000">15 000€ - 50 000€</option>
              <option value="50000+">50 000€ +</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-cta w-full disabled:opacity-50 disabled:cursor-not-allowed dark:border-[#000000] dark:text-[#000000] dark:hover:bg-[#000000] dark:hover:text-white"
          >
            {isSubmitting ? 'Envoi en cours...' : 'Obtenir mon étude personnalisée'}
          </button>
        </form>
      </div>
    </section>
  );
}

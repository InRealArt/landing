'use client'

interface TabFilterProps {
  activeTab: string;
  tabs: string[];
  setActiveTab: (tab: string) => void;
  className?: string;
}

export default function TabFilter({ activeTab, tabs, setActiveTab, className = "" }: TabFilterProps) {
  return (
    <section className={`max-w-screen-2xl mx-auto px-10 mb-16 ${className}`} data-anim="annexe-tabs">
      <div className="flex flex-wrap gap-3">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 text-xs uppercase tracking-[0.3em] transition-all duration-300 border ${
              activeTab === tab
                ? "border-[var(--ink-black)] bg-[var(--ink-black)] text-white"
                : "border-[var(--border-light)] text-[var(--gray-text)] hover:border-[var(--ink-black)] hover:text-[var(--ink-black)]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </section>
  );
} 
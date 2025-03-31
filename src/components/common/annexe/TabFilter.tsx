'use client'

interface TabFilterProps {
  activeTab: string;
  tabs: string[];
  setActiveTab: (tab: string) => void;
  className?: string;
}

export default function TabFilter({ activeTab, tabs, setActiveTab, className = "" }: TabFilterProps) {
  return (
    <section className={`max-w-90 xl:max-w-screen-xl m-auto mb-12 ${className}`}>
      <div className="flex flex-wrap gap-3 justify-end">
        {tabs.map(tab => (
          <button
            key={tab}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab
                ? "bg-[#6358DC] text-white"
                : "bg-[#1E1E1E] text-white border border-white/10 hover:border-white/30"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
    </section>
  );
} 
'use client'

import { useLanguageStore } from '@/store/languageStore'
import {
  FormData,
  SectionHeader,
  RadioGroup,
  inputClass,
  labelClass,
  textareaClass,
} from './ArtistApplicationShared'

interface Props {
  form: FormData
  setForm: React.Dispatch<React.SetStateAction<FormData>>
  onChange: (key: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

export default function ArtistApplicationStep3({ form, setForm, onChange }: Props) {
  const { t } = useLanguageStore()
  const fp = 'joinInRealArt.artists.application.form'

  return (
    <div>
      <SectionHeader number="03" title={t(`${fp}.section3.title`)} />

      <div className="space-y-12">
        {/* Physical works radio */}
        <div>
          <p className={labelClass}>
            {t(`${fp}.section3.hasPhysicalWorks`)} *
          </p>
          <RadioGroup
            name="hasPhysicalWorks"
            value={form.hasPhysicalWorks}
            onChange={(v) => setForm((prev) => ({ ...prev, hasPhysicalWorks: v }))}
            labelYes={t(`${fp}.section3.yes`)}
            labelNo={t(`${fp}.section3.no`)}
          />
        </div>

        {/* Conditional: has works */}
        {form.hasPhysicalWorks === true && (
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
            <div>
              <label htmlFor="physicalWorksCount" className={labelClass}>
                {t(`${fp}.section3.physicalWorksCount`)}
              </label>
              <input
                id="physicalWorksCount"
                type="text"
                value={form.physicalWorksCount}
                onChange={onChange('physicalWorksCount')}
                placeholder={t(`${fp}.section3.physicalWorksCountPlaceholder`)}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="worksProducedPerYear" className={labelClass}>
                {t(`${fp}.section3.worksProducedPerYear`)}
              </label>
              <input
                id="worksProducedPerYear"
                type="text"
                value={form.worksProducedPerYear}
                onChange={onChange('worksProducedPerYear')}
                placeholder={t(`${fp}.section3.worksProducedPerYearPlaceholder`)}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="worksSoldLastYear" className={labelClass}>
                {t(`${fp}.section3.worksSoldLastYear`)}
              </label>
              <input
                id="worksSoldLastYear"
                type="text"
                value={form.worksSoldLastYear}
                onChange={onChange('worksSoldLastYear')}
                placeholder={t(`${fp}.section3.worksSoldLastYearPlaceholder`)}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="averageSellingPrice" className={labelClass}>
                {t(`${fp}.section3.averageSellingPrice`)}
              </label>
              <input
                id="averageSellingPrice"
                type="text"
                value={form.averageSellingPrice}
                onChange={onChange('averageSellingPrice')}
                placeholder={t(`${fp}.section3.averageSellingPricePlaceholder`)}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="annualRevenue" className={labelClass}>
                {t(`${fp}.section3.annualRevenue`)}
              </label>
              <input
                id="annualRevenue"
                type="text"
                value={form.annualRevenue}
                onChange={onChange('annualRevenue')}
                placeholder={t(`${fp}.section3.annualRevenuePlaceholder`)}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="worksSoldAnnually" className={labelClass}>
                {t(`${fp}.section3.worksSoldAnnually`)}
              </label>
              <input
                id="worksSoldAnnually"
                type="text"
                value={form.worksSoldAnnually}
                onChange={onChange('worksSoldAnnually')}
                placeholder={t(`${fp}.section3.worksSoldAnnuallyPlaceholder`)}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="seasonalPatterns" className={labelClass}>
                {t(`${fp}.section3.seasonalPatterns`)}
              </label>
              <input
                id="seasonalPatterns"
                type="text"
                value={form.seasonalPatterns}
                onChange={onChange('seasonalPatterns')}
                placeholder={t(`${fp}.section3.seasonalPatternsPlaceholder`)}
                className={inputClass}
              />
            </div>
          </div>
        )}

        {/* Conditional: no works */}
        {form.hasPhysicalWorks === false && (
          <div>
            <label htmlFor="canProduceWorks" className={labelClass}>
              {t(`${fp}.section3.canProduceWorks`)}
            </label>
            <textarea
              id="canProduceWorks"
              rows={4}
              value={form.canProduceWorks}
              onChange={onChange('canProduceWorks')}
              placeholder={t(`${fp}.section3.canProduceWorksPlaceholder`)}
              className={textareaClass}
            />
          </div>
        )}

        {/* Always visible metrics (once radio is answered) */}
        {form.hasPhysicalWorks !== null && (
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-10 pt-8 border-t border-borderColor">
            <div>
              <label htmlFor="directVsGalleryPercent" className={labelClass}>
                {t(`${fp}.section3.directVsGalleryPercent`)}
              </label>
              <input
                id="directVsGalleryPercent"
                type="text"
                value={form.directVsGalleryPercent}
                onChange={onChange('directVsGalleryPercent')}
                placeholder={t(`${fp}.section3.directVsGalleryPercentPlaceholder`)}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="salesChannels" className={labelClass}>
                {t(`${fp}.section3.salesChannels`)}
              </label>
              <input
                id="salesChannels"
                type="text"
                value={form.salesChannels}
                onChange={onChange('salesChannels')}
                placeholder={t(`${fp}.section3.salesChannelsPlaceholder`)}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="marketplacePresence" className={labelClass}>
                {t(`${fp}.section3.marketplacePresence`)}
              </label>
              <input
                id="marketplacePresence"
                type="text"
                value={form.marketplacePresence}
                onChange={onChange('marketplacePresence')}
                placeholder={t(`${fp}.section3.marketplacePresencePlaceholder`)}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="newsletterSubscribers" className={labelClass}>
                {t(`${fp}.section3.newsletterSubscribers`)}
              </label>
              <input
                id="newsletterSubscribers"
                type="text"
                value={form.newsletterSubscribers}
                onChange={onChange('newsletterSubscribers')}
                placeholder={t(`${fp}.section3.newsletterSubscribersPlaceholder`)}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="socialMediaFollowers" className={labelClass}>
                {t(`${fp}.section3.socialMediaFollowers`)}
              </label>
              <input
                id="socialMediaFollowers"
                type="text"
                value={form.socialMediaFollowers}
                onChange={onChange('socialMediaFollowers')}
                placeholder={t(`${fp}.section3.socialMediaFollowersPlaceholder`)}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="websiteUniqueVisitors" className={labelClass}>
                {t(`${fp}.section3.websiteUniqueVisitors`)}
              </label>
              <input
                id="websiteUniqueVisitors"
                type="text"
                value={form.websiteUniqueVisitors}
                onChange={onChange('websiteUniqueVisitors')}
                placeholder={t(`${fp}.section3.websiteUniqueVisitorsPlaceholder`)}
                className={inputClass}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

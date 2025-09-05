'use client'
import TranslatedText from './TranslatedText'

interface LeasingInfosProps {
  titleKey?: string
  descriptionKey?: string
  title?: string
  description?: string
}

const LeasingInfos = ({ 
  titleKey = 'leasing.infos.title',
  descriptionKey = 'leasing.infos.description',
  title, 
  description,
}: LeasingInfosProps) => {
  return (
    <section className="w-full max-w-90 xl:max-w-screen-xl m-auto mt-36">
      <div className="p-6 lg:p-10 border rounded-lg bg-cardBackground text-center">
        <TranslatedText
          as="h2"
          translationKey={titleKey}
          content={title}
          className="text-3xl lg:text-4xl bricolage-grotesque font-semibold mb-6"
          allowHtml={true}
        />
        <TranslatedText
          as="p"
          translationKey={descriptionKey}
          content={description}
          className="text-lg lg:text-xl leading-relaxed"
          allowHtml={true}
        />
      </div>
    </section>
  )
}

export default LeasingInfos

import TemplateDefault from "@/templates/Default"
export default function Loading() {
  return (
    <TemplateDefault>
      <section className="animate-pulse">
        <div className="container">
          <div className="flex flex-col gap-5">
            <h1 className="w-[100px] bg-gray-200 dark:bg-gray-900">&nbsp;</h1>
            <p className="w-[140px] bg-gray-200 dark:bg-gray-900">&nbsp;</p>
            <p className="w-[120px] bg-gray-200 dark:bg-gray-900">&nbsp;</p>
          </div>
        </div>
      </section>
    </TemplateDefault>
  )
}
export function TailwindIndicator() {
  if (process.env.NODE_ENV === "production") return null

  return (
    <div className="fixed bottom-1 left-1 z-50 flex h-6 w-6 items-center justify-center rounded-full bg-gray-800 p-3 font-mono text-xs text-white">
      <div className="block sm:hidden" title="xs: <=640px">
        xs
      </div>
      <div className="hidden sm:block md:hidden" title="sm: >=640px && <768px">
        sm
      </div>
      <div className="hidden md:block lg:hidden" title="md: >=768px && <1024px">
        md
      </div>
      <div
        className="hidden lg:block xl:hidden"
        title="lg: >=1024px && <1280px"
      >
        lg
      </div>
      <div
        className="hidden xl:block 2xl:hidden"
        title="xl: >=1280px && <1536px"
      >
        xl
      </div>
      <div className="hidden 2xl:block" title="2xl: >=1536px">
        2xl
      </div>
    </div>
  )
}

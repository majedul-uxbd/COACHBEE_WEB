import Link from "next/link"

export default function SiteFooter() {
  const author = {
    name: "Majedul",
    href: "https://github.com/majedul-uxbd",
  }
  return (
    <footer className="flex h-9 flex-row bg-accent items-center justify-center border-t ">
      All right reserved &copy;&nbsp;
      <Link
        className="text-muted-foreground hover:text-foreground hover:underline hover:underline-offset-4"
        href={author.href}
        target="_blank"
      >
        {author.name}
      </Link>
    </footer>
  )
}

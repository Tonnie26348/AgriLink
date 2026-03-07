import { Globe } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function LanguageSwitcher() {
  const { setLanguage, language } = useLanguage()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 px-2 h-9 rounded-full hover:bg-secondary/10">
          <Globe className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs font-bold uppercase">{language}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-32 border-border/40 shadow-elevated">
        <DropdownMenuItem onClick={() => setLanguage("en")} className="gap-2 cursor-pointer">
          <span className="text-xs font-medium">English</span>
          {language === "en" && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage("sw")} className="gap-2 cursor-pointer">
          <span className="text-xs font-medium">Kiswahili</span>
          {language === "sw" && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

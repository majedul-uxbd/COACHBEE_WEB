"use client";

import * as React from "react";
import { Globe } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { usePathname, useRouter } from "next/navigation";
import { useTranslation } from "@/app/i18n/client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

const Language = () => {
  const pathname = usePathname();
  const lng = pathname.split("/")[1];
  const router = useRouter();
  const { t } = useTranslation(lng, "Language");

  const handleLanguageChange = (selectedLanguage: string) => {
    // console.log("🚀 ~ Header.tsx:39 ~ selectedLanguage:", selectedLanguage);
    if (typeof window !== "undefined") {
      const currentUrl = window.location.href;

      // Replace /en/ with /ja/ or vice versa
      const updatedPathname = currentUrl.replace(
        /\/(en|bn)\//,
        `/${selectedLanguage}/`
      );

      router.push(updatedPathname);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <DropdownMenu>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Globe
                size={24}
                className="h-[1.2rem] w-[1.2rem]  cursor-pointer "
              />
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t("language")}</p>
          </TooltipContent>

          <DropdownMenuContent align="center" className="w-32">
            <DropdownMenuItem
              onClick={() => handleLanguageChange("en")}
              className={lng === "en" ? "font-semibold" : ""}
            >
              English
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleLanguageChange("bn")}
              className={lng === "bn" ? "font-semibold" : ""}
            >
              Bengali
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Tooltip>
    </TooltipProvider>
  );
};

export default Language;

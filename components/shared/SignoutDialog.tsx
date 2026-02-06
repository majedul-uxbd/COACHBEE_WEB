"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { handleSignOut } from "@/signOutHandler";
import { Loader2, LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTranslation } from "@/app/i18n/client";

const SignOutDialog = () => {
  const pathname = usePathname();
  const lng = pathname.split("/")[1];
  const { t } = useTranslation(lng, "Language");

  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    localStorage.removeItem("access_token");
    await handleSignOut({ lng });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type="button"
          className="text-red-400 w-full justify-start gap-2 font-semibold"
          size="sm"
          variant="outline"
        >
          <LogOut /> {t("logout")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle className="flex gap-2">{t("logout")}</DialogTitle>
          <DialogDescription>{t("logout_description")}</DialogDescription>
        </DialogHeader>

        <p>{t("logout_confirmation")}</p>

        <DialogFooter>
          <Button
            size="sm"
            className="flex justify-center gap-2 font-semibold w-full"
            onClick={handleClick}
            disabled={loading}
            variant="destructive"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t("logging_out")}
              </>
            ) : (
              <>{t("yes_log_out")}</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SignOutDialog;

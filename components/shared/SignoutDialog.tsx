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
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    localStorage.removeItem("access_token");
    await handleSignOut({ lng });
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <p
          className="text-red-400 w-full justify-start gap-2 font-semibold"
        >
          {t("logout")}
        </p>
      </DialogTrigger>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle className="flex gap-2">{t("logout")}</DialogTitle>
          <DialogDescription>{t("logout_description")}</DialogDescription>
        </DialogHeader>

        <p>{t("logout_confirmation")}</p>

        <DialogFooter className="w-full flex flex-row justify-between space-x-2">
          <Button
            className="w-1/2"
            type="button"
            variant='ghost'
            onClick={() => setIsDialogOpen(false)}
          >
            {t('cancel')}
          </Button>
          <Button
            size="sm"
            className="w-1/2"
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

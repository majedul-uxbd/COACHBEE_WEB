import { Loader2, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { handleSignOut } from "@/app/(auth)/logout/handleLogout";

const SignOutDialog = () => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    await handleSignOut();
    localStorage.clear();
    // router.push(`/login`);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <span className="cursor-pointer">Logout</span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex gap-2">
            <LogOut className="h-5 w-5" />
            <div className="flex items-center">Logging Out</div>
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="grid gap-4 py-4 text-lg">
          Are you sure you want to log out?
        </DialogDescription>
        <DialogFooter>
          <Button
            size="sm"
            className="flex gap-2 px-8 bg-red-500  text-white hover:bg-red-600 transition-colors"
            onClick={handleClick}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Logging out
              </>
            ) : (
              <>Yes, Logout</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SignOutDialog;

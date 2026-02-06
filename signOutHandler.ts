"use server"

import { signOut } from "@/auth"

interface HandleSignOutProps {
  lng: string
}

export async function handleSignOut({ lng }: HandleSignOutProps) {
  await signOut({
    redirectTo: `/crm/${lng}/login` ,
  })
}

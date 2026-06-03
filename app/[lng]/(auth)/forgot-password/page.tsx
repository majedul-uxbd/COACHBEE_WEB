import { SendOTPCard } from "@/components/card/SendOTPCard";

export default async function LoginPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-br from-[#E9EAFF] to-[#C1E0FF]">
      <div className="absolute inset-0 pointer-events-none">
        <div className="grid grid-cols-4 gap-20 rotate-[-20deg] opacity-10">
          {Array.from({ length: 40 }).map((_, i) => (
            <span
              key={i}
              className="text-9xl font-bold text-slate-600 whitespace-nowrap"
            >
              CRM
            </span>
          ))}
        </div>
      </div>

      {/* Foreground Content */}
      <div className="relative flex min-h-screen items-center justify-center">
        <SendOTPCard />
      </div>
    </div>
  );
}

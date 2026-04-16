"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type BillingButtonProps = {
  priceId?: string;
  label: string;
  className?: string;
  variant?: "default" | "outline" | "ghost";
};

export function BillingButton({ priceId, label, className, variant = "default" }: BillingButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    setLoading(true);

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });

      const data = await res.json().catch(() => null);

      if (res.status === 401) {
        router.push("/login?redirectTo=/pricing");
        return;
      }

      if (!res.ok || !data?.url) {
        throw new Error(data?.error || "Unable to start checkout");
      }

      window.location.href = data.url;
    } catch (error) {
      console.error(error);
      router.push("/login?redirectTo=/pricing");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button onClick={handleCheckout} disabled={loading} variant={variant} className={className}>
      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {label}
    </Button>
  );
}

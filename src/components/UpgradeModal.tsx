"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, Zap } from "lucide-react";
import { BillingButton } from "@/components/BillingButton";

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
}

export function UpgradeModal({ open, onClose }: UpgradeModalProps) {
  const [loading, setLoading] = useState(false);

  async function handleUpgrade() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else if (res.status === 401) window.location.href = "/login";
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md border-line bg-[rgba(248,242,233,0.98)] p-0">
        <DialogHeader>
          <div className="rounded-[1.75rem] border border-line bg-[#16313a] px-6 py-7 text-center text-white">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-[1.2rem] bg-[#f0e4d0] text-[#16313a]">
              <Zap className="h-7 w-7" />
            </div>
            <DialogTitle className="font-display text-4xl leading-none text-white">Upgrade to Pro</DialogTitle>
            <DialogDescription className="mx-auto mt-3 max-w-sm text-sm leading-6 text-white/72">
              You&apos;ve used your 5 free AI breakdowns this month. Upgrade when you want unlimited help and continuation support.
            </DialogDescription>
          </div>
        </DialogHeader>
        <div className="space-y-3 px-6 py-1">
          {[
            "Unlimited AI task breakdowns",
            "Make step easier (AI sub-steps)",
            "Email reminders to continue",
          ].map((f) => (
            <div key={f} className="flex items-center gap-3 rounded-[1.2rem] border border-line bg-white/75 px-4 py-3 text-sm text-ink">
              <CheckCircle className="h-4 w-4 flex-shrink-0 text-teal" />
              {f}
            </div>
          ))}
        </div>
        <div className="space-y-2 px-6 pb-6 pt-3">
          <BillingButton
            priceId={process.env.NEXT_PUBLIC_STRIPE_PRICE_YEARLY}
            label="Get Pro — $39/year"
            className="h-12 w-full rounded-full bg-clay text-white hover:bg-[#b45630]"
          />
          <Button
            onClick={handleUpgrade}
            disabled={loading}
            variant="outline"
            className="h-12 w-full rounded-full border-line bg-white/80 text-ink"
          >
            {loading ? "Loading..." : "Or choose $7.99/month"}
          </Button>
          <Button variant="ghost" onClick={onClose} className="w-full rounded-full text-ink-soft">
            Maybe later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

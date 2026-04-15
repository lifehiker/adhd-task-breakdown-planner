"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, Zap } from "lucide-react";

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
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <div className="w-12 h-12 rounded-xl bg-[#7c3aed] flex items-center justify-center mx-auto mb-2">
            <Zap className="w-7 h-7 text-white" />
          </div>
          <DialogTitle className="text-center">Upgrade to Pro</DialogTitle>
          <DialogDescription className="text-center">
            You've used your 5 free AI breakdowns this month. Upgrade for unlimited access.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2 my-4">
          {[
            "Unlimited AI task breakdowns",
            "Make step easier (AI sub-steps)",
            "Email reminders to continue",
          ].map((f) => (
            <div key={f} className="flex items-center gap-2 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-[#7c3aed] flex-shrink-0" />
              {f}
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <Button
            onClick={handleUpgrade}
            disabled={loading}
            className="w-full bg-[#7c3aed] hover:bg-[#6d28d9]"
          >
            {loading ? "Loading..." : "Get Pro — $7.99/month"}
          </Button>
          <Button variant="ghost" onClick={onClose} className="w-full text-gray-500">
            Maybe later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

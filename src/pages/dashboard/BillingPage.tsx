import { useState } from "react";
import { motion } from "framer-motion";
import { Download, CreditCard, CheckCircle, Clock, XCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { billingService } from "@/services";
import { MOCK_INVOICES } from "@/constants/mockData";
import { formatDate, formatCurrency } from "@/utils";
import { showToast } from "@/hooks";
import { cn } from "@/lib/utils";
import type { Invoice } from "@/types";

const STATUS_CONFIG = {
  paid: { label: "Paid", icon: CheckCircle, className: "text-green-600 bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800" },
  pending: { label: "Pending", icon: Clock, className: "text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800" },
  failed: { label: "Failed", icon: XCircle, className: "text-destructive bg-destructive/10 border-destructive/20" },
};

export default function BillingPage() {
  const [invoices] = useState<Invoice[]>(MOCK_INVOICES);
  const [showAddCard, setShowAddCard] = useState(false);
  const [cardForm, setCardForm] = useState({ number: "", expiry: "", cvc: "", name: "" });
  const [savedCard] = useState({ last4: "4242", brand: "Visa", expiry: "03/26" });
  const [isAdding, setIsAdding] = useState(false);

  const handleDownload = async (invoiceId: string) => {
    await billingService.downloadInvoice(invoiceId);
    showToast("Invoice downloaded!", "success");
  };

  const handleAddCard = async () => {
    if (!cardForm.number || !cardForm.expiry || !cardForm.cvc || !cardForm.name) {
      showToast("All fields required", "error");
      return;
    }
    setIsAdding(true);
    await billingService.updatePaymentMethod(cardForm);
    showToast("Payment method updated!", "success");
    setShowAddCard(false);
    setCardForm({ number: "", expiry: "", cvc: "", name: "" });
    setIsAdding(false);
  };

  const formatCardNumber = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    return digits.length >= 3 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Billing</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage payment methods and invoices</p>
      </div>

      {/* Payment method */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border bg-card p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-lg">Payment Method</h2>
          <Button variant="outline" size="sm" onClick={() => setShowAddCard(true)}>
            <Plus className="size-4 mr-1" />Update Card
          </Button>
        </div>

        <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/40 border">
          <div className="size-12 rounded-xl gradient-brand flex items-center justify-center shrink-0">
            <CreditCard className="size-6 text-white" />
          </div>
          <div>
            <div className="font-semibold">{savedCard.brand} ending in {savedCard.last4}</div>
            <div className="text-sm text-muted-foreground">Expires {savedCard.expiry}</div>
          </div>
          <Badge variant="outline" className="ml-auto text-green-600 border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
            <CheckCircle className="size-3 mr-1" />Primary
          </Badge>
        </div>
      </motion.div>

      {/* Invoices */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl border bg-card p-6">
        <h2 className="font-semibold text-lg mb-5">Invoice History</h2>
        <div className="divide-y">
          {invoices.map((inv) => {
            const statusCfg = STATUS_CONFIG[inv.status];
            const StatusIcon = statusCfg.icon;
            return (
              <motion.div key={inv.id} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{inv.description}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{formatDate(inv.date)}</div>
                </div>
                <div className="font-semibold text-sm">{formatCurrency(inv.amount / 100)}</div>
                <Badge className={cn("text-xs border flex items-center gap-1 shrink-0", statusCfg.className)}>
                  <StatusIcon className="size-3" />{statusCfg.label}
                </Badge>
                <Button variant="outline" size="sm" className="shrink-0 h-8" onClick={() => handleDownload(inv.id)}>
                  <Download className="size-3.5 mr-1" />PDF
                </Button>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Add Card Dialog */}
      <Dialog open={showAddCard} onOpenChange={setShowAddCard}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Update Payment Method</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="h-32 rounded-xl gradient-brand p-5 text-white">
              <div className="flex justify-between items-start mb-6">
                <span className="text-sm opacity-80">Credit Card</span>
                <CreditCard className="size-6 opacity-80" />
              </div>
              <div className="font-mono text-lg tracking-widest">
                {cardForm.number || "•••• •••• •••• ••••"}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Cardholder Name</Label>
              <Input placeholder="John Doe" value={cardForm.name} onChange={(e) => setCardForm({ ...cardForm, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Card Number</Label>
              <Input
                placeholder="1234 5678 9012 3456"
                value={cardForm.number}
                onChange={(e) => setCardForm({ ...cardForm, number: formatCardNumber(e.target.value) })}
                maxLength={19}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Expiry</Label>
                <Input
                  placeholder="MM/YY"
                  value={cardForm.expiry}
                  onChange={(e) => setCardForm({ ...cardForm, expiry: formatExpiry(e.target.value) })}
                  maxLength={5}
                />
              </div>
              <div className="space-y-2">
                <Label>CVC</Label>
                <Input placeholder="123" value={cardForm.cvc} onChange={(e) => setCardForm({ ...cardForm, cvc: e.target.value.replace(/\D/g, "").slice(0, 4) })} maxLength={4} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddCard(false)}>Cancel</Button>
            <Button onClick={handleAddCard} disabled={isAdding} className="gradient-brand text-white border-0 hover:opacity-90">
              {isAdding ? "Saving..." : "Save Card"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

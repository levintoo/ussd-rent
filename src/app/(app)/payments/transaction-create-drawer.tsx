"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { TransactionForm, type TenantOption } from "./transaction-form";

type Props = {
  tenants: TenantOption[];
};

export function TransactionCreateDrawer({ tenants }: Props) {
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>New transaction</Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Add transaction</SheetTitle>
        </SheetHeader>
        <div className="p-4">
          <TransactionForm tenants={tenants} onSuccess={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}

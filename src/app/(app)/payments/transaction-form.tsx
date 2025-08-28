"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createTransactionSchema, type CreateTransactionInput } from "./schema";
import { createTransactionAction } from "./action";

export type TenantOption = { id: string; label: string };

type Props = {
  tenants: TenantOption[];
  onSuccess?: () => void;
};

export function TransactionForm({ tenants, onSuccess }: Props) {
  const form = useForm<CreateTransactionInput>({
    resolver: zodResolver(createTransactionSchema),
    defaultValues: { tenantId: "", amount: 0, note: "" },
  });

  const [submitting, setSubmitting] = React.useState(false);

  async function onSubmit(values: CreateTransactionInput) {
    setSubmitting(true);
    const res = await createTransactionAction(values);
    if (res?.errors) {
      for (const [key, messages] of Object.entries(res.errors)) {
        for (const message of messages || []) {
          form.setError(key as keyof CreateTransactionInput, { message });
        }
      }
      setSubmitting(false);
      return;
    }
    form.reset();
    setSubmitting(false);
    onSuccess?.();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(
          onSubmit as SubmitHandler<CreateTransactionInput>
        )}
        className="grid gap-4"
      >
        <FormField
          control={form.control}
          name="tenantId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tenant</FormLabel>
              <FormControl>
                <select
                  className="border-input bg-transparent rounded-md h-9 px-3 py-1"
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                >
                  <option value="" disabled>
                    Select a tenant
                  </option>
                  {tenants.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Note</FormLabel>
              <FormControl>
                <Input placeholder="Optional" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-end">
          <Button type="submit" disabled={submitting}>
            Add Transaction
          </Button>
        </div>
      </form>
    </Form>
  );
}

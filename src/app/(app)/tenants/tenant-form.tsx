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
import { createTenantSchema, type CreateTenantInput } from "./schema";
import { createTenantAction } from "./action";

export type UnitOption = { id: string; label: string };

type TenantFormProps = {
  units: UnitOption[];
  onSuccess?: () => void;
};

export function TenantForm({ units, onSuccess }: TenantFormProps) {
  const form = useForm<CreateTenantInput>({
    resolver: zodResolver(createTenantSchema),
    defaultValues: { name: "", phone: "", unitId: "" },
  });

  const [submitting, setSubmitting] = React.useState(false);

  async function onSubmit(values: CreateTenantInput) {
    setSubmitting(true);
    const res = await createTenantAction(values);
    if (res?.errors) {
      for (const [key, messages] of Object.entries(res.errors)) {
        for (const message of messages || []) {
          form.setError(key as keyof CreateTenantInput, { message });
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
      <form onSubmit={form.handleSubmit(onSubmit as SubmitHandler<CreateTenantInput>)} className="grid gap-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Tenant name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input placeholder="e.g. +15551234567" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="unitId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Unit</FormLabel>
              <FormControl>
                <select
                  className="border-input bg-transparent rounded-md h-9 px-3 py-1"
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                >
                  <option value="" disabled>
                    Select a unit
                  </option>
                  {units.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.label}
                    </option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-end">
          <Button type="submit" disabled={submitting}>
            Create Tenant
          </Button>
        </div>
      </form>
    </Form>
  );
}

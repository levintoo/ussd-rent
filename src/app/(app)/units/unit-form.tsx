"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver, type SubmitHandler } from "react-hook-form";

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
import { createUnitSchema, type CreateUnitInput } from "./schema";
import { createUnitAction } from "./action";

type UnitFormProps = {
  onSuccess?: () => void;
};

export function UnitForm({ onSuccess }: UnitFormProps) {
  const form = useForm<CreateUnitInput>({
    resolver: zodResolver(createUnitSchema) as Resolver<CreateUnitInput>,
    defaultValues: {
      unitNumber: "",
      monthlyRent: 0,
    },
  });

  const [submitting, setSubmitting] = React.useState(false);

  async function onSubmit(values: CreateUnitInput) {
    setSubmitting(true);
    const res = await createUnitAction(values);
    if (res?.errors) {
      for (const [key, messages] of Object.entries(res.errors)) {
        for (const message of messages || []) {
          form.setError(key as keyof CreateUnitInput, { message });
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
        onSubmit={form.handleSubmit(onSubmit as SubmitHandler<CreateUnitInput>)}
        className="grid gap-4"
      >
        <FormField
          control={form.control}
          name="unitNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Unit Number</FormLabel>
              <FormControl>
                <Input placeholder="e.g. 2B" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="monthlyRent"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Monthly Rent</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-end">
          <Button type="submit" disabled={submitting}>
            Create Unit
          </Button>
        </div>
      </form>
    </Form>
  );
}

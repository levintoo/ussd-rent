"use client";

import * as React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipProps,
} from "recharts";
import type {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

export type TenantKpiDatum = { name: string; due: number; paid: number };
export type DailyNetDatum = { date: string; net: number };

const fmtCurrency = (n: number) =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(n);

function CurrencyTooltip({
  label,
  payload,
}: TooltipProps<ValueType, NameType>) {
  if (!payload || payload.length === 0) return null;
  return (
    <div className="bg-background/90 backdrop-blur rounded-md border shadow p-2 text-sm">
      <div className="text-muted-foreground mb-1">{String(label ?? "")}</div>
      {payload.map((p) => (
        <div key={String(p.dataKey)} className="flex items-center gap-2">
          <span
            className="inline-block size-2 rounded-sm"
            style={{ background: p.color }}
          />
          <span className="min-w-24 capitalize">
            {String(p.name ?? p.dataKey)}
          </span>
          <span className="font-medium">
            {fmtCurrency(Number(p.value ?? 0))}
          </span>
        </div>
      ))}
    </div>
  );
}

export function DashboardCharts({
  perTenant,
  daily,
}: {
  perTenant: TenantKpiDatum[];
  daily: DailyNetDatum[];
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="bg-muted/50 rounded-xl p-4">
        <div className="text-sm text-muted-foreground mb-3">
          Paid vs Due per Tenant
        </div>
        <div style={{ width: "100%", height: 320 }}>
          <ResponsiveContainer>
            <BarChart
              data={perTenant}
              margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
            >
              <defs>
                <linearGradient id="barPaid" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity={0.5} />
                </linearGradient>
                <linearGradient id="barDue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity={0.5} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12 }}
                interval={0}
                angle={-15}
                textAnchor="end"
                height={50}
                tickMargin={8}
              />
              <YAxis tickFormatter={(v) => fmtCurrency(Number(v))} width={80} />
              <Tooltip content={<CurrencyTooltip />} />
              <Legend />
              <Bar
                dataKey="due"
                name="Due"
                fill="url(#barDue)"
                radius={[6, 6, 0, 0]}
                barSize={24}
              />
              <Bar
                dataKey="paid"
                name="Paid"
                fill="url(#barPaid)"
                radius={[6, 6, 0, 0]}
                barSize={24}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="bg-muted/50 rounded-xl p-4">
        <div className="text-sm text-muted-foreground mb-3">
          Daily Net Transactions (This Month)
        </div>
        <div style={{ width: "100%", height: 320 }}>
          <ResponsiveContainer>
            <LineChart
              data={daily}
              margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
            >
              <defs>
                <linearGradient id="lineNet" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.3} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(v) => fmtCurrency(Number(v))} width={80} />
              <Tooltip content={<CurrencyTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="net"
                name="Net"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

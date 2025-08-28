"use client";

import {
  type LucideIcon,
} from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function NavMain({
  projects,
}: {
  projects: {
    name: string;
    url: string;
    icon: LucideIcon;
    active: boolean;
  }[];
}) {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Admin</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton className={cn(item.active && "bg-primary/10")} asChild>
              <Link href={item.url}>
                <item.icon className={cn(item.active && "text-primary")} />
                <span className={cn(item.active && "text-primary")}>{item.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
  
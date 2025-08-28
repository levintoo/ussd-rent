"use client";

import * as React from "react";
import {
  AudioWaveform,
  Command,
  Home,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Bed,
  UserRound,
  DollarSign,
} from "lucide-react";

import { NavUser } from "@/components/nav-user";
import { NavMain } from "@/components/nav-main";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  main: [
    {
      name: "Home",
      url: "/dashboard",
      icon: Home,
    },
    {
      name: "Units",
      url: "/units",
      icon: Bed,
    },
    {
      name: "Tenants",
      url: "/tenants",
      icon: UserRound,
    },
    {
      name: "Payments",
      url: "/payments",
      icon: DollarSign,
    }
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain projects={data.main} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

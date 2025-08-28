"use client";

import * as React from "react";
import { Home, Bed, UserRound, DollarSign } from "lucide-react";
import { usePathname } from "next/navigation";

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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

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
        active: pathname?.startsWith("/dashboard") ?? false,
      },
      {
        name: "Units",
        url: "/units",
        icon: Bed,
        active: pathname?.startsWith("/units") ?? false,
      },
      {
        name: "Tenants",
        url: "/tenants",
        icon: UserRound,
        active: pathname?.startsWith("/tenants") ?? false,
      },
      {
        name: "Payments",
        url: "/payments",
        icon: DollarSign,
        active: pathname?.startsWith("/payments") ?? false,
      },
    ],
  };

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

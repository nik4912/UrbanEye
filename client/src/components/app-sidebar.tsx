import * as React from "react"
import {
  GalleryVerticalEnd,
  SquareTerminal,
  Settings2,
  Edit3,
  CheckSquare,
  User2Icon,
  ClipboardList
} from "lucide-react"

import { useUser } from "@clerk/clerk-react"
import useStore from "@/store/store"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { title } from "process"
import { url } from "inspector"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser()
  const email = user?.primaryEmailAddress?.emailAddress ?? ""
  const userData = useStore((state) => state.userData)
  const isTeacher = userData?.role === "teacher"

  // Define the initial nav items
  const baseNavMain = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: SquareTerminal,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings2,
    },
    {
      title: "Profile",
      url: "/profile",
      icon: User2Icon,
    },
    {
      title: "Complaints",
      url: "/complaints",
      icon: ClipboardList, // Replace with the appropriate icon component
    },
    {
      title:"Create Complaints",
      url:"/create-complaints",
      icon: Edit3,
    }
  ]

  // If the user is a teacher, add teacher-only options.
  const teacherNav = isTeacher
    ? [
      {
        title: "Create Announcement",
        url: "/create-announcement",
        icon: Edit3,
      },
      {
        title: "Create Tasks",
        url: "/create-tasks",
        icon: CheckSquare,
      },
    ]
    : []

  const data = {
    user: {
      email: email,
      avatar: "/avatars/shadcn.jpg",
    },
    teams: [
      {
        name: "UrbanEYE",
        logo: GalleryVerticalEnd,
        plan: "Made by TOPGs",
      },
    ],
    navMain: [...baseNavMain, ...teacherNav],
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
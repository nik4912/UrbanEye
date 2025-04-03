import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Mail } from "@/Mail/components/mail"
import { accounts, mails } from "@/Mail/data"

export default function Dashboard() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-1 flex-col gap-4  pt-0">
          <div className="hidden flex-col md:flex">
            <Mail
              accounts={accounts}
              mails={mails}
              defaultLayout={[20, 32, 48]}  // added defaultLayout prop
              navCollapsedSize={4}
            />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

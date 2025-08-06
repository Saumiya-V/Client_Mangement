import AppSidebar from "@/components/sidebar/AppSidebar"
import { Outlet } from "@tanstack/react-router"
import { SidebarProvider } from "@/components/ui/sidebar"

const App = () => {
  return (
    <SidebarProvider>
      <div className="flex h-screen">
        {/* Sidebar with fixed width */}
        <div className="w-64 bg-gray-900 text-white">
          <AppSidebar />
        </div>

        {/* Main content */}
        <main className="flex-1 bg-gray-200 w-[1280px] p-6">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  )
}

export default App

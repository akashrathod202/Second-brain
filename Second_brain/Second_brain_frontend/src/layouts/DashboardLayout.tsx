import { Outlet } from "react-router-dom";
import Sidebar  from "../Components/sidebar/Sidebar";

export const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-slate-50">
        <Sidebar/>

        <main className="flex-1 min-w-0 ml-64">
        <Outlet/>
        </main>
    </div>
  )
}

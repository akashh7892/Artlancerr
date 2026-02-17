import { Outlet } from "react-router-dom";
import HirerSidebar from "../../components/common/HirerSidebar";

export default function HirerDashboard() {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#13161c" }}>
      <HirerSidebar />
      <main style={{ marginLeft: "248px", flex: 1, padding: "24px" }}>
        <Outlet />
      </main>
    </div>
  );
}

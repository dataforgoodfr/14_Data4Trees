import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { DashboardPopover } from "@widgets/DashboardPopover";
import { MapSidebar } from "@widgets/MapSidebar";
import { Header } from "@widgets/header";
import { Map } from "@widgets/map";

import { useAuth } from "@features/auth/";
import { getChartData } from "@features/charts/chartClient";

import { SidebarProvider } from "@shared/ui/sidebar";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@ui/resizable";

export interface MainPageProps {
  userData?: unknown;
}

export function MainPage() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<unknown | null>(null);

  useEffect(() => {
    getChartData("exampleData")
      .then((json) => setData(json.data))
      .catch((err) => console.error("fetchData error", err));
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <Header
        onLogin={() => navigate("/login")}
        onLogout={() => logout()}
        isAuthenticated={isAuthenticated}
      />

      {/* TODO: Integrate Sidebar with Resizable Panels smoothly: https://github.com/huntabyte/shadcn-svelte/discussions/1657 */}
      <ResizablePanelGroup
        direction="horizontal"
        className="bg-background"
      >
        <SidebarProvider>
          <ResizablePanel
            defaultSize={20}
            className="h-full"
          >
            <MapSidebar />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={80}>
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel defaultSize={10}>
                <div className="flex h-full items-center justify-center p-6">
                  <DashboardPopover
                    /** @ts-expect-error Need to type data */
                    graphData={data}
                    dataType="example"
                  />
                </div>
              </ResizablePanel>
              <ResizableHandle />
              <ResizablePanel defaultSize={90}>
                <Map />
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </SidebarProvider>
      </ResizablePanelGroup>
    </div>
  );
}

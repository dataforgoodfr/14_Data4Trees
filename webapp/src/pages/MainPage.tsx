import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { DashboardPopover } from "@widgets/DashboardPopover";
import { Map } from "@widgets/Map";
import { MapSidebar } from "@widgets/MapSidebar";
import { Header } from "@widgets/header";

import { useApi } from "@shared/hooks/useApi";
import { useAuth } from "@shared/hooks/useAuth";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@ui/resizable";
import { SidebarProvider } from "@ui/sidebar";

export interface MainPageProps {
  userData?: unknown;
}

export function MainPage() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const client = useApi();
  const [data, setData] = useState<unknown | null>(null);

  useEffect(() => {
    client
      .getData()
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

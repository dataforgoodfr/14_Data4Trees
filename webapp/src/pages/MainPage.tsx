import { useEffect, useState } from "react";

import { useApi } from "@providers";

import { Header } from "@components/Header";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@components/ui/resizable";

import { DashboardPopover, Map, MapSidebar } from "@widgets";

import { SidebarProvider } from "@ui/sidebar";

export interface MainPageProps {
  userData?: unknown;
}

export function MainPage() {
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
        onLogin={() => console.log("Login clicked")}
        onLogout={() => console.log("Logout clicked")}
        isLogin={false}
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

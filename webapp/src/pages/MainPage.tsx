import { useEffect, useState } from "react";

/**
 * @todo Don't respect FSD
 */
import { useApi } from "@app/providers";

import { DashboardPopover } from "@widgets/DashboardPopover";
import { Map } from "@widgets/Map";
import { MapSidebar } from "@widgets/MapSidebar";

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
  const client = useApi();
  const [data, setData] = useState<unknown | null>(null);

  useEffect(() => {
    client
      .getData()
      .then((json) => setData(json.data))
      .catch((err) => console.error("fetchData error", err));
  }, []);

  return (
    <>
      {/* TODO: Integrate Sidebar with Resizable Panels smoothly: https://github.com/huntabyte/shadcn-svelte/discussions/1657 */}
      <ResizablePanelGroup
        direction="horizontal"
        className="bg-background"
      >
        <SidebarProvider>
          <ResizablePanel
            defaultSize={20}
            className="h-full p-4"
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
    </>
  );
}

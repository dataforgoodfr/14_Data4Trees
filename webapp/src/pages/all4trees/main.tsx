import { MapAll4Trees } from "@widgets/map/map-all4trees";
import { MapSidebar } from "@widgets/map-sidebar";

import { SidebarProvider } from "@shared/ui/sidebar";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@ui/resizable";

export interface MainPageProps {
  userData?: unknown;
}

function MainPage() {
  return (
    <>
      {/* TODO: Integrate Sidebar with Resizable Panels smoothly: https://github.com/huntabyte/shadcn-svelte/discussions/1657 */}
      <ResizablePanelGroup
        className="bg-background"
        direction="horizontal"
      >
        <SidebarProvider>
          <ResizablePanel
            className="h-full"
            defaultSize={20}
          >
            <MapSidebar />
          </ResizablePanel>

          <ResizableHandle />

          <ResizablePanel defaultSize={80}>
            <MapAll4Trees />
          </ResizablePanel>
        </SidebarProvider>
      </ResizablePanelGroup>
    </>
  );
}

// Default export for lazy loading import
export default MainPage;

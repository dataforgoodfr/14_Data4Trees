import { MapSeed } from "@widgets/map/map-seed";

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
            <p>This is seed !</p>
          </ResizablePanel>

          <ResizableHandle />

          <ResizablePanel defaultSize={80}>
            <MapSeed />
          </ResizablePanel>
        </SidebarProvider>
      </ResizablePanelGroup>
    </>
  );
}

// Default export for lazy loading import
export default MainPage;

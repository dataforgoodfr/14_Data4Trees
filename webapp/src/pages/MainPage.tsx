import { DashboardPopover, Map, MapSidebar } from "@/widgets";
import { Header } from "@components";
import { useApi } from "@providers";
import { SidebarProvider } from "@ui/sidebar";
import { useEffect, useState } from "react";

import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useNavigate } from "react-router-dom";

export interface MainPageProps {
    userData?: unknown;
}

export function MainPage() {
    const navigate = useNavigate();
    const client = useApi();
    const [data, setData] = useState<unknown | null>(null);

    useEffect(() => {
        client.getData()
            .then((json) => setData(json.data))
            .catch((err) => console.error("fetchData error", err));
    }, []);

    return (
        <div className="flex flex-col h-screen">
            <Header
                onLogin={() => navigate('/login')}
                onLogout={() => console.log("Logout clicked")}
                isLogin={false} />

            {/* TODO: Integrate Sidebar with Resizable Panels smoothly: https://github.com/huntabyte/shadcn-svelte/discussions/1657 */}
            <ResizablePanelGroup
                direction="horizontal"
                className="bg-background"
            >
                <SidebarProvider>

                    <ResizablePanel defaultSize={20} className="h-full">
                        <MapSidebar />
                    </ResizablePanel>
                    <ResizableHandle />
                    <ResizablePanel defaultSize={80}>
                        <ResizablePanelGroup direction="vertical">
                            <ResizablePanel defaultSize={10}>
                                <div className="flex h-full items-center justify-center p-6">
                                    {/** @ts-expect-error Need to type data */}
                                    <DashboardPopover graphData={data} dataType="example" />
                                </div>
                            </ResizablePanel>
                            <ResizableHandle />
                            <ResizablePanel defaultSize={90}>
                                <Map />
                            </ResizablePanel>
                        </ResizablePanelGroup>
                    </ResizablePanel>
                </SidebarProvider >
            </ResizablePanelGroup>
        </div>
    );
}


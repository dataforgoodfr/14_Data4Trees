// @ts-ignore
import { createMap } from "coordo"
import { useEffect } from "react";
export interface MapProps {

}

export function Map({ }: MapProps) {

    useEffect(() => {
        createMap("#map");
    }, []);

    return (
        <div className="flex flex-col h-full items-center justify-center p-6">
            <h1 className="py-4 text-center text-foreground font-title-primary">Carte all4Trees</h1>
            <div id="map" style={{ width: "100%", height: "300px" }}></div>
        </div>
    );
}


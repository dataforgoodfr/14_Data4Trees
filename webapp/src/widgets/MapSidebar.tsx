import { useState } from "react"

import { Label } from "@ui/label"
import { RadioGroup, RadioGroupItem } from "@ui/radio-group"
import { Slider } from "@ui/slider"

export function MapSidebar() {
    const [value, setValue] = useState([10])

    return (
        <>
            <h3>Section de filtres</h3>
            <RadioGroup defaultValue="option-one">
                <div className="flex items-center gap-3">
                    <RadioGroupItem value="option-one" id="option-one" />
                    <Label htmlFor="option-one">Option Une</Label>
                </div>
                <div className="flex items-center gap-3">
                    <RadioGroupItem value="option-two" id="option-two" />
                    <Label htmlFor="option-two">Option Deux</Label>
                </div>
                <div className="mx-auto grid w-full max-w-xs gap-3">
                    <div className="flex items-center justify-between gap-2">
                        <Label htmlFor="slider-demo-temperature">Zoom</Label>
                        <span className="text-muted-foreground text-sm">
                            {value}
                        </span>
                    </div>
                    <Slider
                        id="slider-1"
                        value={value}
                        onValueChange={setValue}
                        max={100}
                        step={1}
                    />
                </div>
            </RadioGroup>
        </>
    )
}
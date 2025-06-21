import { GroupItem } from "@/lib/types";
import { useEffect, useMemo, useRef, useState } from "react";
import { Stage, Layer, Image as KonvaImage, Rect } from "react-konva";
import useImage from "use-image";


export default function CanvasViewer ({ svgString, boxes } : { svgString: string, boxes: { x: number, y: number, w: number, h: number, color?: string}[] }) {
    const stageRef = useRef(null);
    const [image] = useImage(`data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`);

    const handleWheel = (e: any) => {
        e.evt.preventDefault();

        const stage : any = stageRef.current;
        if (!stage) return;

        const oldScale = stage.scaleX();
        const pointer = stage.getPointerPosition();
        if (!pointer) return;

        const zoomFactor = e.evt.deltaY > 0 ? 0.9 : 1.1;
        const newScale = oldScale * zoomFactor;

        const mousePointTo = {
        x: (pointer.x - stage.x()) / oldScale,
        y: (pointer.y - stage.y()) / oldScale,
        };

        stage.scale({ x: newScale, y: newScale });

        const newPos = {
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
        };
        stage.position(newPos);

        stage.batchDraw();
    };

    return (
        <div className="w-full h-full overflow-hidden">
            <Stage
            width={1920}
            height={1080}
            onWheel={handleWheel}
            draggable
            ref={stageRef}
            scaleX={1}
            scaleY={1}
            offset={{ x: -300, y: -30 }}
            className="w-full h-full"
            >
            <Layer clearBeforeDraw>
                {image && <KonvaImage image={image} />}
                {boxes.map((r, i) => (
                <Rect
                    key={i}
                    x={r.x}
                    y={r.y}
                    width={r.w}
                    height={r.h}
                    stroke="blue"
                    strokeWidth={2}
                    dash={[6, 4]} // dashed border
                    cornerRadius={4} // rounded corners
                    fill={ "color" in r ? r.color : "rgba(255, 0, 0, 0.5)" } // light red transparent fill
                    shadowColor="black"
                    shadowBlur={4}
                    shadowOffset={{ x: 2, y: 2 }}
                    shadowOpacity={0.3}
                />
                ))}
            </Layer>
            </Stage>
        </div>
    );
};

import { ApiResponse, GroupItem, Messages, TreeBuilderNode } from "@/lib/types";
import CanvasViewer from "../components/CanvasViewer";
import { useEffect, useMemo, useState } from "react";
import { extractKeyId } from "@/lib/utils";
import axios from "axios";
import TreeBuilderResultsProps from "../components/sidebars/tree-builder-preview-sidebar";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import NextPageButton from "../components/NextButton";
import LoadingEffect from "../components/Loading";

interface PreBuilderProps {
    figmaUrl: string;
    svg: string;
    keepGroups: GroupItem[];
    onContinue: (tree: any) => void;
    onBackPressed: () => void;
    onHomePressed: () => void;
}

export default function TreebuilderResultsView({ 
    figmaUrl, 
    svg, 
    keepGroups, 
    onContinue,
    onBackPressed,
    onHomePressed
} : PreBuilderProps) {
    const [ isLoading, setIsLoading ] = useState<boolean>(false);
    const [ json, setJson ] = useState<any>(null);
    const [ focusElement, setFocusElement ] = useState<{x: number, y: number, w: number, h: number} | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
              
                const params = extractKeyId(figmaUrl);
                if (params == null) return;

                const checkedIds = keepGroups.filter(g => g.checked).map(g => g.id);
                const { fileKey, nodeId } = params;

                const response = await axios.post('https://moadelezz2-des2ract.hf.space/api/tree-builder', 
                    {"fileKey":fileKey,"nodeId":nodeId,"keep":checkedIds}, 
                    {headers: { 'Content-Type': 'application/json' },}
                )
                
                let responseJson = response.data;
                setJson(responseJson.data[0]);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [keepGroups]);    

    return (   
        <main className='w-full h-screen flex justify-start bg-white '>   
            <TreeBuilderResultsProps 
                projectTree={json} 
                setFocusElement={setFocusElement} 
                onBackClicked={onBackPressed}
                onHomeClicked={onHomePressed}
            />

            <div className="flex flex-col p-10 overflow-hidden">
                <div className="border-b-2 border-b-black/5 pb-2">
                    <h1 className="text-3xl font-semibold text-accent"> Layout Result </h1>
                    <h2 className="text-gray-500/70"> 
                    Before proceeding, take a moment to review the inferred layout based on your design.
                    If it doesn't match your expectations, you can return to your Figma file and manually group the elements as you prefer. Just remember to keep the group in the same step of the design for accurate interpretation.
                    </h2>
                </div>

                {
                    isLoading 
                    ? <LoadingEffect /> 
                    : <CanvasViewer svgString={svg} boxes={focusElement ? [focusElement] : []}/>
                }
                
            </div>

            <NextPageButton 
                disabled={json == null} 
                onClick={() => { onContinue(json) }}
            />
        </main>
    );
}
import { ApiResponse, GroupItem, Messages } from "@/lib/types";
import CanvasViewer from "../components/CanvasViewer";
import { useEffect, useMemo, useState } from "react";
import { extractKeyId } from "@/lib/utils";
import axios from "axios";
import RedundantGroupsToolbar from "../components/sidebars/redundant-groups-sidebar";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import LoadingEffect from "../components/Loading";
import NextPageButton from "../components/NextButton";

interface PreBuilderProps {
    figmaUrl: string;
    onContinue: (keep: GroupItem[], svg: string) => void;
    onBackPressed: () => void;
    onHomePressed: () => void;
}

export default function RedundantGroupsView({ 
    figmaUrl, 
    onContinue,
    onBackPressed,
    onHomePressed
} : PreBuilderProps) {
    const [ isLoading, setIsLoading ] = useState<boolean>(false);
    const [ redundantGroups, setRedundantGroups ] = useState<GroupItem[]>([]);
    const [ svg, setSvg ] = useState<string>('');

    const keepGroups = useMemo(() => {
        return redundantGroups.filter((group) => group.checked);
    }, [redundantGroups]);

    const onSelectionChange = (index: number, checked: boolean) => {        
        setRedundantGroups((prev) => {
            const newGroups = [...prev];
            newGroups[index].checked = checked;
            return newGroups;
        });
    };

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const params = extractKeyId(figmaUrl);
                if (params == null) return;

                const [responseJson, responseSvg] = await Promise.all([
                    axios.get('https://moadelezz2-des2ract.hf.space/api/filterGroups', { params }),
                    axios.get('https://moadelezz2-des2ract.hf.space/api/svg',{params}),
                ]);

                const data = (responseJson.data as ApiResponse).data as GroupItem[];
                setRedundantGroups(data);
                setSvg(responseSvg?.data as string);
            } catch (error) {
            console.error('Error fetching data:', error);
            // setJson({ error: 'Error fetching data' });
            } finally {
            setIsLoading(false);
            }
        };
        fetchData();
    }, [figmaUrl]);    

    return (   
        <main className='w-full h-screen flex justify-start bg-white '>   
            <RedundantGroupsToolbar 
                redundantGroups={redundantGroups} 
                onSelectionChange={onSelectionChange} 
                onBackButtonClicked={onBackPressed}
                onHomeButtonClicked={onHomePressed}
            />

            <div className="flex flex-col p-10 w-full overflow-hidden">
                <div className="border-b-2 border-b-black/5 pb-2">
                    <h1 className="text-3xl font-semibold text-accent"> Redundant Groups Detected </h1>
                    <h2 className="text-gray-500/70"> We have found some groups that have no visual meaning, and of course you can keep them. check all groups to keep</h2>
                </div>

                {
                    isLoading ?
                    <LoadingEffect />
                    :
                    <CanvasViewer svgString={svg} boxes={keepGroups.map((g) => ({x: g.x, y: g.y, w: g.width, h: g.height}))}/>
                }

            </div>
            
            <NextPageButton 
                disabled={svg.length == 0 || figmaUrl.length == 0} 
                onClick={() => { onContinue(keepGroups, svg) }}
            />
        </main>
    );
}
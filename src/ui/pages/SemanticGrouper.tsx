import axios from "axios";
import { useEffect, useState } from "react";
import CanvasViewer from "../components/CanvasViewer";

import { COLORS } from "@/lib/consts";
import LoadingEffect from "../components/Loading";
import NextPageButton from "../components/NextButton";
import SemanticGrouperToolbar from "../components/sidebars/semantic-grouper-sidebar";

interface SemanticGrouperProps {
    pageTree: any;
    svg: string;
    onContinue: (tree: any) => void;
    onBackPressed: () => void;
    onHomePressed: () => void;
}

export default function SemanticGrouperView({ 
    pageTree, 
    svg, 
    onContinue,
    onBackPressed,
    onHomePressed
} : SemanticGrouperProps) {
    const [ isLoading, setIsLoading ] = useState<boolean>(false);
    const [ json, setJson ] = useState<any>(null);
    const [ groups, setGroups ] = useState<{ [key: string]: any}>({});

    const extractGroupsFromTree = ( node: any ) : { [key: string]: any} => {
        const nodeMap : { [key: string]: any} = {};
        let colorIdx = 0;

        const traverse = (currentNode: any) => {
            if (currentNode.node_id) {
                
                const groupMatch = currentNode.node_id.toLocaleLowerCase().match(/^group_.*/);
                if (groupMatch) {
                    const groupId = groupMatch[0];
                    if ( !(groupId in nodeMap) ) {
                        nodeMap[groupId] = {"boxes": [], "checked": false, "color": COLORS[colorIdx % COLORS.length]};
                        colorIdx += 1
                    }
                    nodeMap[groupId]["boxes"].push({ 
                        x: currentNode.node.x, 
                        y: currentNode.node.y, 
                        w: currentNode.node.width, 
                        h: currentNode.node.height,
                        color: nodeMap[groupId]["color"]
                    });
                }
            }

            currentNode.children.forEach((child: any) => traverse(child));
        };

        traverse(node);
        return nodeMap;
    };

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await axios.post(
                    "https://kareemalaa1-semantic-grouper.hf.space/api/enhanced",
                    // "https://kareemalaa1-semantic-grouper.hf.space/api",
                    { data: pageTree },
                    {
                        headers: { "Content-Type": "application/json" },
                    }
                )

                setJson(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [pageTree]);    

    useEffect(() => {
        if (!json) return;
        const groups = extractGroupsFromTree(json);       
         
        setGroups(groups);
    }, [json]);

    const updateGroupInJson = (node: any, ids: string[], newGroupId: string | null): any => {
        if ( "node_id" in node && ids.includes(node.node_id.toLocaleLowerCase()) ) {
            return { ...node, node_id: newGroupId };
        } else if (node && typeof node === 'object' && 'children' in node) {
            return { ...node, children: node.children.map((child: any) => updateGroupInJson(child, ids, newGroupId)) };
        } else {
            return { ...node };
        }
    }

    const onToolbarSelectionChange = (key: string, checked: boolean) => {
        const nextGroups = { ...groups };
        nextGroups[key]["checked"] = checked;
        setGroups(nextGroups);
    }

    const deleteGroups = (keys: string[]) => {
        const updatedJson = updateGroupInJson(json, keys, null)
        setJson({...updatedJson});
    }

    const editGroups = (keys: string[], name: string) => {
        const updatedJson = updateGroupInJson(json, keys, name);
        setJson({...updatedJson});
    }
    
    const selectedGroupsBoundingBoxes = 
    Object.keys(groups)
    .filter(key => groups[key]["checked"])
    .flatMap(key => groups[key]["boxes"]);
    
    return (   
        <main className='w-full h-screen flex justify-start bg-white '>   
            <SemanticGrouperToolbar 
                similarGroups={groups} 
                onSelectionChange={onToolbarSelectionChange} 
                onGroupDelete={deleteGroups} 
                onGroupsMerge={editGroups}
                onBackButtonClicked={onBackPressed}
                onHomeButtonClicked={onHomePressed}
            />

            <div className="flex flex-col p-10 overflow-hidden">
                <div className="border-b-2 border-b-black/5 pb-2">
                    <h1 className="text-3xl font-semibold text-accent"> Potential Components </h1>
                    <h2 className="text-gray-500/70"> 
                        At this stage, we've identified several groups of similar components based on your page design.
                        Take a moment to review these groupings. You can modify or delete any group if it doesn't look appropriate or relevant to your layout.
                        Your feedback here will help ensure the final structure best reflects your design intent..
                    </h2>
                </div>
                {
                    isLoading ? <LoadingEffect /> : <CanvasViewer svgString={svg} boxes={selectedGroupsBoundingBoxes}/>
                }    
            </div>

            <NextPageButton 
                disabled={json === null} 
                onClick={() => { onContinue(json) }}
            />
        </main>
    );
}
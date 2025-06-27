import { TreeDataItem, TreeView } from "@/components/tree-view";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarSeparator } from "@/components/ui/sidebar";
import { Toggle } from "@/components/ui/toggle";
import { GroupItem, TreeBuilderNode } from "@/lib/types";
import { ArrowLeft, Check, Home, Pen } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import CommonSidebarHeader from "./common-header";
import CommonSidebarFooter from "./common-footer";


interface SemanticAssingerSidebarProps {
    projectTree: TreeBuilderNode;
    openSheet: () => void;
    setFocusElement: (element: TreeBuilderNode | null) => void;
    onBackClicked: () => void;
    onHomeClicked: () => void;
}

export default function SemanticAssignerSidebar({ 
    projectTree, 
    setFocusElement, 
    openSheet,
    onBackClicked,
    onHomeClicked   
} : SemanticAssingerSidebarProps) {
    const [ selected, setSelected ] = useState<string>('');
    const [ editMode, setEditMode ] = useState<boolean>(false);

    const changeSelection = (id: string, node: TreeBuilderNode) => {      
        setSelected(id);
        setFocusElement(node);  
        if (editMode) {
            openSheet();
        } 
    }

    const convertTree = (node: TreeBuilderNode, depth: number = 0, index: number = 0) : TreeDataItem => ({
        id: node.node.depth == "0" ? "-1" : node.node.depth,
        name: `${node.name === "TREE BUILDER GROUP" ? "Group" : node.name.slice(0, 15)} [${node.tag}]` ,
        children: node.node.type === "TEXT" ? [ { id: node.name + depth + index + "TEXT", name: node.node.characters.slice(0, 15) } ] 
        : node.children.map((child: TreeBuilderNode, index: number) => convertTree(child, depth + 1, index)),
        onClick: () => { changeSelection(node.node.depth, node) }
    });

    const viewData = useMemo(() => projectTree ? convertTree(projectTree) : null, [projectTree, selected, editMode]);    

    return (
        <div className="mr-5 w-fit">
            <SidebarProvider>
            <Sidebar className="transition-all min-w-fit px-0">
                <CommonSidebarHeader />

                <SidebarContent className="my-5 border-y-2 border-y-black/10 py-2">
                    <SidebarGroupContent className="overflow-y-scroll px-2">
                        <SidebarMenu>
                            <SidebarMenuItem>
                                {viewData && <TreeView 
                                    data={viewData} 
                                    initialSelectedItemId={selected}
                                />}
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarContent>
                

                <SidebarFooter>
                    <SidebarMenu>
                            <Toggle 
                            disabled={viewData === null || Object.keys(viewData).length === 0}
                            pressed={editMode}
                            onPressedChange={setEditMode}
                            className="bg-muted border-2 border-black/20 cursor-pointer" 
                            aria-label="Toggle italic">
                                <Pen /> Edit Class
                            </Toggle>
                    </SidebarMenu>

                    <CommonSidebarFooter 
                        onBackButtonClicked={onBackClicked}
                        onHomeButtonClicked={onHomeClicked}
                    />
                </SidebarFooter>
            </Sidebar>
            </SidebarProvider>
        </div>
    );
}
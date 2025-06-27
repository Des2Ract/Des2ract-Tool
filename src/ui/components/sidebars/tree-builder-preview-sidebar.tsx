import { TreeDataItem, TreeView } from "@/components/tree-view";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarProvider } from "@/components/ui/sidebar";
import { TreeBuilderNode } from "@/lib/types";
import { useMemo, useState } from "react";
import CommonSidebarFooter from "./common-footer";
import CommonSidebarHeader from "./common-header";


interface TreeBuilderResultsProps {
    projectTree: TreeBuilderNode | null;
    setFocusElement: (element: {x: number, y: number, w: number, h: number} | null) => void;
    onBackClicked: () => void;
    onHomeClicked: () => void;
}

export default function TreeBuilderResultsSidebar({ 
    projectTree, 
    setFocusElement,
    onBackClicked,
    onHomeClicked
} : TreeBuilderResultsProps) {

    const [ selected, setSelected ] = useState<string>('');

    const changeSelection = (id: string, element: {x: number, y: number, w: number, h: number}) => {
        if (id === selected) {
            setSelected('');
            setFocusElement(null);
        } else {
            setSelected(id);
            setFocusElement(element);
        }
    }

    const convertTree = (node: TreeBuilderNode, depth: number = 0, index: number = 0) : TreeDataItem => ({
        id: `${node.name}/${depth}/${index}`,
        name: `${node.name == "TREE BUILDER GROUP" ? "Group" : node.name.slice(0, 15)} [ ${(node.node.layout ?? "") == "ROWS" ? "Rows" : "Columns"} ]`,
        children: node.node.type === "TEXT" ? [ { id: node.name + depth + index + "TEXT", name: node.node.characters.slice(0, 15) } ] 
        : node.children.map((child, index) => convertTree(child, depth + 1, index)),
        onClick: () => { changeSelection(`${node.name}/${depth}/${index}`, { x: node.node.x, y: node.node.y, w: node.node.width, h: node.node.height }) }
    });

    const viewData = useMemo(() => projectTree ? convertTree(projectTree) : null, [projectTree, selected]);

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
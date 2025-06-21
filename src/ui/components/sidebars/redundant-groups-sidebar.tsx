import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from "@/components/ui/sidebar";
import { GroupItem } from "@/lib/types";
import { ArrowLeft, Home } from "lucide-react";
import CommonSidebarHeader from "./common-header";
import CommonSidebarFooter from "./common-footer";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface RedundantGroupsToolbarProps {
    redundantGroups: (GroupItem & { checked?: boolean })[];
    onSelectionChange: (index: number, checked: boolean) => void;
    onBackButtonClicked: () => void;
    onHomeButtonClicked: () => void;
}

export default function RedundantGroupsToolbar({ 
    redundantGroups, 
    onSelectionChange,
    onBackButtonClicked,
    onHomeButtonClicked
} : RedundantGroupsToolbarProps) {

    const [search, setSearch] = useState('');

    const filteredGroups = search.length > 0 ? 
    redundantGroups.filter(group => group.name.toLowerCase().includes(search.toLowerCase()))
    :
    redundantGroups;
    
    return (
        <div>
            <SidebarProvider>
            <Sidebar >
                <CommonSidebarHeader />

                <SidebarContent className="my-5 border-y-2 border-y-black/10 py-2">
                    <SidebarGroupContent className="overflow-y-scroll px-10">
                        <SidebarMenu className="flex flex-col gap-5">
                        {
                            filteredGroups
                            .sort((groupA, groupB) => groupA.name.localeCompare(groupB.name))
                            .map((group: GroupItem, index) => (
                                <SidebarMenuItem key={index} className="flex items-center gap-3">
                                    <Checkbox id={group.id} 
                                    checked={group.checked} 
                                    onClick={() => onSelectionChange(index, !group.checked)}
                                    className="border-black/30" 
                                    />
                                    <Label className="text-md" htmlFor={group.id}>{ group.name}</Label>
                                </SidebarMenuItem>
                            ))
                        }
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarContent>
                

                <SidebarFooter className="">
                    <SidebarGroup>
                        <Input 
                            type="text" 
                            className="focus-visible:outline-0 focus-visible:ring-0"
                            placeholder="Search By Name" 
                            value={search} 
                            onChange={(e) => setSearch(e.target.value)} 
                        />
                    </SidebarGroup>

                    <CommonSidebarFooter 
                        onBackButtonClicked={onBackButtonClicked}
                        onHomeButtonClicked={onHomeButtonClicked}
                    />
                </SidebarFooter>
            </Sidebar>
            </SidebarProvider>
        </div>
    );
}
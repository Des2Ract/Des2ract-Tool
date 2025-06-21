import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from "@/components/ui/sidebar";
import { GroupItem } from "@/lib/types";
import { ArrowLeft, Home, Merge, Pen, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from "react";
import CommonSidebarHeader from "./common-header";
import CommonSidebarFooter from "./common-footer";

interface RedundantGroupsToolbarProps {
    similarGroups: { [key: string] : any };
    onGroupDelete: (keys: string[]) => void;
    onGroupsMerge: (keys: string[], name: string) => void;
    onSelectionChange: (key: string, checked: boolean) => void;
    onBackButtonClicked: () => void;
    onHomeButtonClicked: () => void;
}

export default function SemanticGrouperToolbar({ 
    similarGroups, 
    onSelectionChange, 
    onGroupDelete, 
    onGroupsMerge,
    onBackButtonClicked,
    onHomeButtonClicked
} : RedundantGroupsToolbarProps) {
    const selectedKeys = Object.keys(similarGroups).filter((key: string) => similarGroups[key].checked);
    const [mergeCount, setMergeCount] = useState(0);

    return (
        <div>
            <SidebarProvider>
            <Sidebar >
                <CommonSidebarHeader />

                <SidebarContent className="my-5 border-y-2 border-y-black/10 py-2">
                    <SidebarGroupContent className="overflow-y-scroll px-10">
                        <SidebarMenu className="flex flex-col gap-5">
                        {
                            Object.keys(similarGroups).map((key: string, index: number) => (
                                <SidebarMenuItem key={index} className="flex items-center gap-3">
                                    <Checkbox 
                                    id={key} 
                                    checked={similarGroups[key].checked} 
                                    onClick={() => onSelectionChange(key, !similarGroups[key].checked)}
                                    className="border-black/30" 
                                    />
                                    <Label className="text-md" htmlFor={key}>{key}</Label>
                                </SidebarMenuItem>
                            ))
                        }
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarContent>
                

                <SidebarFooter className="flex flex-col gap-5">
                    <SidebarMenu className="flex flex-row justify-around gap-5">
                        <SidebarMenuItem className="w-full">        
                            <Dialog>
                                <DialogTrigger className="w-full" disabled={selectedKeys.length === 0}>
                                <SidebarMenuButton 
                                disabled={selectedKeys.length === 0}
                                className="bg-red-500 hover:bg-red-600/90 hover:text-white cursor-pointer items-center justify-center" asChild>
                                    <Button>
                                        <Trash2 /> Delete
                                    </Button>
                                </SidebarMenuButton>                            
                                </DialogTrigger>

                                <DialogContent>
                                    <DialogHeader>
                                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                                    <DialogDescription>
                                        This action cannot be undone. and the removed group will be permenantly deleted unless you redone the process
                                    </DialogDescription>
                                    </DialogHeader>

                                    <DialogFooter className="sm:justify-start">
                                    <DialogClose asChild>
                                        <Button 
                                        type="submit"
                                        onClick={() => onGroupDelete(selectedKeys)}
                                        className="bg-red-500 hover:bg-red-600/90 hover:text-white cursor-pointer items-center justify-center">Delete</Button>
                                    </DialogClose>
                                    </DialogFooter>

                                </DialogContent>
                            </Dialog>
                        </SidebarMenuItem>

                        <SidebarMenuItem className="w-full">        
                            <Dialog>
                                <DialogTrigger className="w-full" disabled={selectedKeys.length < 2}>
                                <SidebarMenuButton 
                                disabled={selectedKeys.length < 2}
                                className="bg-accent hover:bg-accent/90 hover:text-white cursor-pointer items-center justify-center" asChild>
                                    <Button>
                                        <Merge /> Merge
                                    </Button>
                                </SidebarMenuButton>                            
                                </DialogTrigger>

                                <DialogContent>
                                    <DialogHeader>
                                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                                    <DialogDescription>
                                        This action cannot be undone. and the merged groups can't be separated again
                                    </DialogDescription>
                                    </DialogHeader>
                                    
                                    <DialogFooter className="sm:justify-start">
                                    <DialogClose asChild>
                                        <Button 
                                        type="submit"
                                        onClick={() => {onGroupsMerge(selectedKeys, `Group_Merged_${mergeCount}`); setMergeCount(mergeCount + 1)}}
                                        className="bg-accent hover:bg-accent/90 hover:text-white cursor-pointer items-center justify-center">Merge</Button>
                                    </DialogClose>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </SidebarMenuItem>
                    </SidebarMenu>

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
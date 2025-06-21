import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { ArrowLeft, Home } from "lucide-react";

export default function CommonSidebarFooter({ onBackButtonClicked, onHomeButtonClicked }: { onBackButtonClicked?: () => void, onHomeButtonClicked?: () => void }) {
    return (
        <SidebarMenu className="flex flex-row justify-around py-2">
            <SidebarMenuItem>
                <SidebarMenuButton 
                    onClick={onBackButtonClicked}
                    disabled={onBackButtonClicked == null} 
                    className=" bg-black/5 hover:bg-black/10 transition-all items-center justify-center p-5"
                >
                    <ArrowLeft/> Back
                </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
                <SidebarMenuButton 
                    onClick={onHomeButtonClicked}
                    disabled={onHomeButtonClicked == null}
                    className=" bg-accent/20 hover:bg-accent/40 transition-all items-center justify-center p-5"
                >
                    <Home /> Home
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarProvider
} from "@/components/ui/sidebar";
import CommonSidebarFooter from "./common-footer";
import CommonSidebarHeader from "./common-header";

export default function DefaultSidebar({ onBackPressed, onHomePressed }: { onBackPressed?: () => void, onHomePressed?: () => void }) {
    return (
        <nav>
            <SidebarProvider>
                <Sidebar>
                    <CommonSidebarHeader />
                    <SidebarContent />

                    <SidebarFooter className="border-t-2 border-t-black/10">
                        <CommonSidebarFooter onBackButtonClicked={onBackPressed} onHomeButtonClicked={onHomePressed} />
                    </SidebarFooter>
                </Sidebar>
            </SidebarProvider>
        </nav>
    );
}
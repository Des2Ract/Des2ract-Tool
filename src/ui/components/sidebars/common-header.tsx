import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarHeader } from "@/components/ui/sidebar";
import React from "react";

export default function CommonSidebarHeader() {
    return (
        <SidebarHeader className="flex flex-col items-center text-center ">
            {(() => {
                const [logoPath, setLogoPath] = React.useState<string | null>(null);

                React.useEffect(() => {
                    window.electron.getAssetsPath().then((path: string) => {
                        setLogoPath(path + "\\logo.png");
                    });
                }, []);

                return (
                    <Avatar className="w-32 h-32">
                        {logoPath ? (
                            <AvatarImage src={logoPath} className="w-32 h-32" />
                        ) : (
                            <AvatarFallback>D2R</AvatarFallback>
                        )}
                    </Avatar>
                );
            })()}
            <div className="flex flex-col">
                <h1 className="text-black text-3xl font-bold"> Des<span className="text-accent">2</span>Ract</h1>
                <h2 className="text-gray-600/70">You Design We Develop</h2>    
            </div>    
        </SidebarHeader>
    );
}
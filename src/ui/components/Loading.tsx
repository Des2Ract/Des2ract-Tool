import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function LoadingEffect({ message } : { message?: string }) {
    const [logoPath, setLogoPath] = React.useState<string | null>(null);

    React.useEffect(() => {
        try {
            window.electron.getAssetsPath().then((path: string) => {
                setLogoPath(path + "\\loading.gif");
            });
        } catch (error) {
            setLogoPath("/src/assets/icon-loading.gif");
        }
    }, []);

    return (
        <div className="flex flex-col items-center justify-center h-full">
            <Avatar className="w-32 h-32">
                <AvatarImage src={logoPath ?? ""} className="w-32 h-32" />
                <AvatarFallback>D2R</AvatarFallback>
            </Avatar>

            <h1 className="animate-pulse">
                { message ? message : "In Progress Please Wait" }
            </h1>

            <div className="flex space-x-2 justify-center items-center h-20">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-ping"></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-ping delay-150"></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-ping delay-300"></div>
            </div>
        </div>
    );
}
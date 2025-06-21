import { Avatar, AvatarImage } from "@/components/ui/avatar";

export default function LoadingEffect() {
    return (
        <div className="flex flex-col items-center justify-center h-full">
            <Avatar className="w-100 h-100">
                <AvatarImage src="/src/assets/logo.png"/>
            </Avatar>

            <h1 className="animate-pulse">
                In Progress Please Wait
            </h1>

            <div className="flex space-x-2 justify-center items-center h-20">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-ping"></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-ping delay-150"></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-ping delay-300"></div>
            </div>
        </div>
    );
}
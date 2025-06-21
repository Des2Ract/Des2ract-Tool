import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function NextPageButton({disabled, onClick}: { disabled: boolean, onClick: () => void }) {
    return (
      <Button 
      disabled={disabled}  
      onClick={onClick}
      className='w-20 h-full hover:cursor-pointer
      rounded-none bg-sidebar hover:bg-black/5'>
        <ArrowRight className='text-black'/>
      </Button>
    );
}
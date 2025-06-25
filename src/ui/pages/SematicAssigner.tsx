import { Button } from "@/components/ui/button";
import { GroupItem, TreeBuilderNode } from "@/lib/types";
import { cn, extractKeyId } from "@/lib/utils";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import axios from "axios";
import { ArrowRight, Pen } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import CanvasViewer from "../components/CanvasViewer";
import SemanticAssignerSidebar from "../components/sidebars/semantic-assigner-sidebar";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import NextPageButton from "../components/NextButton";
import LoadingEffect from "../components/Loading";

interface PreBuilderProps {
    pageTree: any;
    svg: string;
    onContinue: (tree: any) => void;
    onBackPressed: () => void;
    onHomePressed: () => void;
}

const TAG_LIST = [
    "BUTTON",
    "INPUT",
    "FORM",
    "CARD",
    "LIST",
    "SVG",
    "ICON",
    "CHECKBOX",
    "LI",
    "A",
    "LABEL",
    "RADIO",
    "DROPDOWN",
    "NAVBAR",
    "FOOTER",
    "DIV"
].sort();

export default function SemanticAssignerView({ 
    pageTree, 
    svg, 
    onContinue,
    onBackPressed,
    onHomePressed
} : PreBuilderProps) {
    const [ isLoading, setIsLoading ] = useState<boolean>(false);
    const [ json, setJson ] = useState<any>(null);

    const [ focusElement, setFocusElement ] = useState<TreeBuilderNode | null>(null);
    const [ tagMods, setTagMods ] = useState<{[key: string]: string}>({});
    const [ selectedTag, setSelectedTag ] = useState<string>('');
 
    const focusElementBB = useMemo(() => {
        if (!focusElement) return null;
        return { x: focusElement.node.x, y: focusElement.node.y, w: focusElement.node.width, h: focusElement.node.height };
    }, [focusElement]);

    const [ open, setOpen ] = useState(false);
 
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {  
                console.log(pageTree);
                
                const response = await axios.post('https://AOZ2025-Semantic-Assigner.hf.space/predict', pageTree, {
                    headers: { 'Content-Type': 'application/json' },
                })
                
                setJson(response.data);                
                
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [pageTree]);    
    
    const updateTagInJson = (node: any, id: string, newTag: string): TreeBuilderNode => {
        if (node.node.id === id) {
            return { ...node, tag: newTag };
        } else if (node && typeof node === 'object' && 'children' in node) {
            return { ...node, children: node.children.map((child: any) => updateTagInJson(child, id, newTag)) };
        } else {
            return { ...node };
        }
    }

    const changeTagInJson = (id: string, tag: string) => {
        setJson((prev: any) => updateTagInJson(prev, id, tag) );
    }

    const editFocusGroup = () => {
        if (!focusElement) return;
        setTagMods({ ...tagMods, [focusElement.node.id]: selectedTag });
        changeTagInJson(focusElement.node.id, selectedTag);
        setOpen(false);
        setSelectedTag('');
    }

    useEffect(() => {
        setSelectedTag(focusElement?.tag || '');
    }, [focusElement]);

    return (   
        <main className='w-full h-screen flex justify-start bg-white '>   
            <SemanticAssignerSidebar 
                projectTree={json} 
                setFocusElement={setFocusElement} 
                openSheet={() => setOpen(true)}
                onHomeClicked={onHomePressed}
                onBackClicked={onBackPressed}
            />

            <div className="flex flex-col p-10 overflow-hidden">
                <div className="border-b-2 border-b-black/5 pb-2">
                    <h1 className="text-3xl font-semibold text-accent"> Refine Labels </h1>
                    <h2 className="text-gray-500/70"> 
                        We've automatically labeled all elements in your design based on the layout inferred in the previous step.
                        You can review and adjust these labels here, or go back and refine the layout to improve the results.
                    </h2>
                </div>

                {
                    isLoading 
                    ? <LoadingEffect /> :
                      <CanvasViewer svgString={svg} boxes={focusElementBB ? [focusElementBB] : []}/>
                }


                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetContent draggable side="bottom" className="border-r shadow-none .pointer-events-auto backdrop-blur-none bg-white">
                        <SheetHeader>
                        <SheetTitle>Modify <span className="text-accent">{focusElement?.name}</span></SheetTitle>
                        <SheetDescription>
                            <div className="flex justify-center gap-5 items-center">
                                <Select>
                                <SelectTrigger className="w-[180px]" disabled>
                                    <SelectValue placeholder={focusElement?.tag}/>
                                </SelectTrigger>
                                </Select>

                                <ArrowRight />

                                <Select value={selectedTag} onValueChange={setSelectedTag}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder={focusElement?.tag}/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                    <SelectLabel>Tag</SelectLabel>
                                    { TAG_LIST.map((tag) => <SelectItem key={tag} value={tag}>{tag}</SelectItem>) }
                                    </SelectGroup>
                                </SelectContent>
                                </Select>

                            </div>
                        </SheetDescription>
                        </SheetHeader>

                        <SheetFooter className="flex flex-row justify-end">
                            <Button className="w-64 cursor-pointer" onClick={() => setOpen(false)} >Cancel</Button>
                            <Button className="w-64 bg-accent hover:bg-accent/80 cursor-pointer" onClick={editFocusGroup}>Save</Button>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
            </div>
            

            <NextPageButton 
                disabled={json === null || isLoading}
                onClick={() => { onContinue(json) }}
            />
        </main>
    );
}
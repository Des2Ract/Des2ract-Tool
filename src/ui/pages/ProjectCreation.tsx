import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ProjectData, ProjectEntry, ReactFile } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { LogViewer } from '@patternfly/react-log-viewer';
import axios from "axios";
import { ArrowRight, Folder } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import LoadingEffect from "../components/Loading";

const windowsPathRegex = /^[a-zA-Z]:\\(?:[^<>:"/\\|?*\r\n]+\\)*[^<>:"/\\|?*\r\n]*$/;

const userPreferenceFormSchema = z.object({
    projectName: z
    .string()
    .trim()
    .min(1, { message: "Project name is required" })
    .refine((val) => val === val.trim(), {
        message: 'Name cannot contain leading or trailing spaces',
    })
    .refine((val) => /^[a-z0-9_-]+$/.test(val), {
        message: 'Name can only contain lowercase letters, numbers, hyphens, and underscores',
    }),
    location: z.string().regex(windowsPathRegex, { message: "Invalid path" })
                .min(1, { message: "Location is required" }),
})


type Phase = 
"Generating Code" | 
"User Preference" | 
"Installing Dependencies" | 
"Finished";


export default function ProjectCreationPage({ 
    designUrl, 
    designTree,
    figmaLink,
    onContinue
}: { 
    designUrl: string, 
    designTree: any,
    figmaLink: string,
    onContinue: (projectName: string) => void
}) {

    const [ phase, setPhase ] = useState<Phase>("Generating Code");
    const [ loading, setIsLoading ] = useState<boolean>(false);
    const [ generatedFiles, setGeneratedFiles ] = useState<ReactFile[]>([]);
    const [ logs, setLogs ] = useState<string[]>([]);

    const form = useForm<z.infer<typeof userPreferenceFormSchema>>({
        resolver: zodResolver(userPreferenceFormSchema),
        defaultValues: { projectName: "my-app", location: "C:\\Users\\MoA\\Desktop\\test-app\\temp" },
        disabled: phase !== "User Preference",
    })

    function onSubmit(values: z.infer<typeof userPreferenceFormSchema>) {
        setPhase("Installing Dependencies");
    }

    const generateReactCode = async () => {
        const response = await axios.post('http://localhost:3000/files', 
            { designTree }, 
        );

        const files = response.data as ReactFile[];
        setGeneratedFiles(files);
        setPhase("User Preference");
    }

    useEffect(() => {
        const updateLogs = (data: string) => {
            if (data.trim() == "Done") {
               setPhase(prev => "Finished");
               setLogs(prev => [...prev, "Done :)"])
               console.log("ok");
               
            } else {
                setLogs(prev => [...prev, data.trim()])    
            }
        }

        window.electron.onOutput(updateLogs)
        window.electron.onError(updateLogs)
    }, []);

    const installDependencies = async () => {
        const folderPath = form.getValues("location");
        const projectName = form.getValues("projectName");        
        await window.electron.createReactApp(folderPath, projectName, generatedFiles);
    }

    useEffect(() => {
        if (phase === "Generating Code") {
            generateReactCode();
        } else if (phase === "Installing Dependencies") {
            installDependencies();
        } else if (phase === "Finished") {
            const data : Project[] = JSON.parse(localStorage.getItem("projects") ?? "[]");
            localStorage.setItem( "projects", 
                JSON.stringify([
                    ...data, 
                    {
                        id: `${Date.now().toString()}-${form.getValues("projectName")}`,
                        name: form.getValues("projectName"),
                        path: `${form.getValues("location")}\\${form.getValues("projectName")}`,
                        creationDate: Date.now(),
                        figmaLink: figmaLink,
                    }
                ]
            ));
        }
    }, [phase]);

    const handleSelectFolder = async () => {
        const selectedPath = await window.electron.selectFolder();
        if (selectedPath) {
            form.setValue("location", selectedPath);            
        }
    };

    const [logoPath, setLogoPath] = useState<string | null>(null);
    
    useEffect(() => {
        try {
            window.electron.getAssetsPath().then((path: string) => {
                setLogoPath(path + "\\loading.gif");
            });
        } catch (error) {
            setLogoPath("/src/assets/icon-loading.gif");
        }
    }, []);

    return (
        <main className='w-full h-screen flex flex-col justify-center items-center gap-5 relative bg-white overflow-hidden'>
            <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_bottom_right,_#3B82F6_0%,_transparent_20%)] pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-full h-full bg-[linear-gradient(to_top_left,_#3B82F6_0%,_transparent_20%)] pointer-events-none"></div>

            {
                phase === "Generating Code" && ( <LoadingEffect message="Generating Code... Please Wait"/> )
            }
            

            {
                phase !== "Generating Code" && ( 
                    <div className="p-5 border-2 border-black/20 rounded-xl w-3/4 h-3/4 flex flex-col gap-5 py-5 ">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
                                <h1 className="text-center text-accent" style={{ fontSize: "1.875rem", fontWeight: "bold" }}> Project Info </h1>

                                <FormField
                                    control={form.control}
                                    name="projectName"
                                    render={({field}) => (
                                    <FormItem>
                                        <FormLabel> Project Name </FormLabel>
                                        <FormControl>
                                            <Input placeholder="Project Name" {...field} />
                                        </FormControl>
                                        <FormDescription />
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="location"
                                    render={({field: { value, onChange, ...fieldProps }}) => (
                                    <FormItem>
                                        <FormLabel> Location </FormLabel>
                                        <FormControl>
                                            <Button 
                                            {...fieldProps}
                                            type={"button"}
                                            onClick={handleSelectFolder} 
                                            variant="outline" 
                                            className="flex w-full hover:bg-black/5 justify-start gap-2 cursor-pointer">
                                                <Folder className="w-4 h-4" />
                                                {   value ? (
                                                        <span className="text-sm truncate max-w-xs">{value}</span>
                                                    ) :
                                                    (
                                                        <span className="text-sm text-muted-foreground">Select a folder</span>
                                                    )
                                                }
                                            </Button>
                                        </FormControl>
                                        <FormDescription />
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />

                                <Button disabled={phase !== "User Preference"} className="bg-accent hover:bg-accent/90 cursor-pointer" style={{ color: "white" }} type="submit">
                                    Generate Code
                                </Button>
                            </form>
                        </Form>
                        
                        <div className="h-full">
                            <LogViewer
                                hasLineNumbers

                                data={logs.join('\n')}
                                theme="light"
                                height="100%"
                                scrollToRow={logs.length - 1}
                            />                        
                        </div>
                    </div>
                )
            }

            {   phase == "Installing Dependencies" &&
                <Alert className="w-3/4 flex " variant={'default'}>
                    <Avatar>
                        <AvatarImage src={logoPath ?? ""} className="w-32 h-32" />
                        <AvatarFallback>D2R</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col ">
                        <AlertTitle>Your Project Is Being Created</AlertTitle>
                        <AlertDescription>
                            just take a seat we got this
                        </AlertDescription>
                    </div>
                </Alert>
            }

            {   phase == "Finished" &&
                <Alert className="w-3/4 flex " variant={'default'}>
                    <Avatar>
                        <AvatarImage src={logoPath ?? ""} className="w-32 h-32" />
                        <AvatarFallback>D2R</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col w-full">
                        <AlertTitle>Your Project Is Ready</AlertTitle>
                        <AlertDescription>
                            Congratulations, your project is ready and waiting for you
                        </AlertDescription>
                    </div>

                    <Button onClick={() => { onContinue(form.getValues("projectName")) }} className="bg-transparent hover:bg-accent/20">
                        <ArrowRight />
                    </Button>
                </Alert>
            }
        </main>
    )
}
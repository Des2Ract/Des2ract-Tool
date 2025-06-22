import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function extractKeyId(path: string | undefined) {
  if (!path) return null;

  const url = new URL(path);
  const pathParts = url.pathname.split('/');
  if (pathParts.length < 2) {
      return null;
  } 
  return {
    fileKey: pathParts[2],
    nodeId: url.searchParams.get('node-id') || ""
  };
}


export const formatFigmaName = (url:string) => {
  if (!url) return "Untitled Project";

  try {
    // Use the URL API to safely parse the link
    const path = new URL(url).pathname;

    // Split the path and get the last part, which is the file name
    const fileName = path.substring(path.lastIndexOf('/') + 1);

    // Decode characters like '%20', replace dashes, and return
    return decodeURIComponent(fileName).replace(/-/g, ' ');

  } catch (error) {
    // If the URL is invalid, return a fallback
    console.error("Invalid URL for Figma link:", url);
    return "Untitled Project";
  }
};

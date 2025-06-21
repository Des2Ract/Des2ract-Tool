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
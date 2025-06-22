export type ProjectData = {
  figmaLink?: string;
  json1?: { data: Record<string, unknown> };
  json2?: { data: Record<string, { tag?: string }> };
}

export interface Project {
  id: string;
  name: string;
  figmaLink: string;
  files: { [key: string]: string };
}

export type Node = {
  x: number;
  y: number;
  width: number;
  type: string;
  tag: string;
  height: number;
  id: string;
  depth: string;
  characters: string;
}

export type TreeBuilderNode = {
  id: string;
  base_tag: string;
  name: string;
  node: Node;
  children: TreeBuilderNode[];
  type: string;
  tag: string;
  node_id?: string;
}

export type GroupItem = {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  checked?: boolean;
  tag?: string;
}

export type JsonEditorProps = {
  step: number;
  onContinue: (json: unknown) => void;
  projectData: ProjectData;
  onReturnSelect: () => void;
}

export type ApiResponse = {
  data: GroupItem[] | TreeBuilderNode | unknown;
}


export const Messages = {
    "redundantGroups": "Redundant Groups Message",
}

export type ReactFile = {
    name: string;
    content: string;
    path: string;
}

export type ProjectEntry = {
    "name": string;
    "path": string;
}
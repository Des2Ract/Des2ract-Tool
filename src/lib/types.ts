export type ProjectData = {
  figmaLink?: string;
  json1?: { data: Record<string, unknown> };
  json2?: { data: Record<string, { tag?: string }> };
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
import { FC, useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ArrowBack from '@mui/icons-material/ArrowBack';

const JsonEditorContainer = styled.div`
  display: flex;
  padding: 20px;
  height: calc(100vh - 80px);
  background-color: #f8fafc;
  font-family: 'Inter', sans-serif;
`;

const Sidebar = styled.div`
  width: 400px;
  padding: 16px;
  border-right: 1px solid #e2e8f0;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  height: 96%;
`;

const SvgContainer = styled.div`
  flex: 1;
  padding: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: auto;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-left: 16px;
  max-width: 100%;
  max-height: 100%;
  
  & > div {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  svg {
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;
  }
`;

const SidebarItem = styled.div<{ selected: boolean }>`
  padding: 12px;
  margin: 6px 0;
  background-color: ${(props) => (props.selected ? '#f1f5f9' : 'transparent')};
  border: 1px solid ${(props) => (props.selected ? '#cbd5e1' : 'transparent')};
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 12px;

  &:hover {
    background-color: #f1f5f9;
    border-color: #cbd5e1;
  }
`;

const ContinueButton = styled.button`
  padding: 12px 24px;
  background-color: #4f46e5;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 20px;
  font-weight: 500;
  transition: all 0.2s ease;
  width: 50%;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

  align-self: center;

  &:hover {
    background-color: #4338ca;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const StepHeader = styled.h2`
  color: #1e293b;
  font-size: 1.5rem;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e2e8f0;
`;

const CheckboxInput = styled.input`
  width: 16px;
  height: 16px;
  accent-color: #4f46e5;
  cursor: pointer;
`;

const TagSelect = styled.select`
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid #cbd5e1;
  background-color: white;
  color: #334155;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 1;
  max-width: 120px;

  &:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2);
  }
`;

const GroupLabel = styled.span`
  font-size: 14px;
  color: #334155;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const JsonTextArea = styled.textarea`
  width: 100%;
  height: calc(100% - 60px);
  padding: 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-family: 'Fira Code', monospace;
  font-size: 14px;
  line-height: 1.5;
  resize: none;
  background-color: #f8fafc;
  color: #334155;
  margin-bottom: 16px;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2);
  }
`;

const SidebarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const CountBadge = styled.span`
  background-color: #e0e7ff;
  color: #4f46e5;
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;
`;

interface ProjectData {
  figmaLink?: string;
  json1?: { data: Record<string, unknown> };
  json2?: { data: Record<string, { tag?: string }> };
}

interface Node {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface TreeBuilderNode {
  base_tag: string;
  name: string;
  node: Node;
  children: TreeBuilderNode[];
  tag: string;
}

interface GroupItem {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  checked?: boolean;
  tag?: string;
}

interface JsonEditorProps {
  step: number;
  onContinue: (json: unknown) => void;
  projectData: ProjectData;
  onReturnSelect: () => void;
}

interface ApiResponse {
  data: GroupItem[] | TreeBuilderNode | unknown;
}

const JsonEditor: FC<JsonEditorProps> = ({ step, onContinue, projectData,onReturnSelect }) => {
  const [json, setJson] = useState<unknown>(null);
  const [svg, setSvg] = useState<string>('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [groups, setGroups] = useState<GroupItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const extractGroupsStep1 = (data: GroupItem[]): GroupItem[] => {
    return data.map((item) => ({
      id: item.id,
      x: item.x,
      y: item.y,
      width: item.width,
      height: item.height,
      checked: item.checked,
      tag: item.tag || 'div',
    }));
  };

  const extractAllNodes = (node: TreeBuilderNode, prefix: string = ''): GroupItem[] => {
    const groups: GroupItem[] = [];
    groups.push({
      id: `${prefix}${node.name}-${node.node.x}-${node.node.y}`,
      x: node.node.x,
      y: node.node.y,
      width: node.node.width,
      height: node.node.height,
      tag: node.tag || 'div',
    });
    node.children.forEach((child, index) => {
      groups.push(...extractAllNodes(child, `${prefix}${index}-`));
    });
    return groups;
  };

  const updateTagInJson = (node: TreeBuilderNode, targetId: string, newTag: string, prefix: string = ''): TreeBuilderNode => {
    const nodeId = `${prefix}${node.name}-${node.node.x}-${node.node.y}`;
    if (nodeId === targetId) {
      return { ...node, tag: newTag };
    }
    return {
      ...node,
      children: node.children.map((child, index) =>
        updateTagInJson(child, targetId, newTag, `${prefix}${index}-`),
      ),
    };
  };

  const appendGroupRectangles = (svgContent: string, groups: GroupItem[]): string => {
    const closingTagIndex = svgContent.lastIndexOf('</svg>');
    if (closingTagIndex === -1) {
      return svgContent;
    }
    const rects = groups
      .filter((group) => step === 2 || (step === 1))
      .map(
        (group) =>
          `<rect id="${group.id}" x="${group.x}" y="${group.y}" width="${group.width}" height="${
            group.height
          }" fill="none" stroke="black" stroke-width=${step===2 ? "0":"1"} />`,
      )
      .join('');
    return svgContent.slice(0, closingTagIndex) + rects + svgContent.slice(closingTagIndex);
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        let responseJson: ApiResponse | undefined;
        let responseSvg: ApiResponse | undefined;

        if (step === 1) {
          let fileKey: string | null = null;
          let nodeId: string | null = null;

          if (projectData.figmaLink) {
            const url = new URL(projectData.figmaLink);
            const pathParts = url.pathname.split('/');
            if (pathParts.length > 2) {
              fileKey = pathParts[2];
            }
            nodeId = url.searchParams.get('node-id') || null;
          }

          const params: Record<string, string> = {};
          if (fileKey) params.fileKey = fileKey;
          if (nodeId) params.nodeId = nodeId;

          [responseJson, responseSvg] = await Promise.all([
            axios.get('https://moadelezz2-des2ract.hf.space/api/filterGroups', { params }),
            axios.get('https://moadelezz2-des2ract.hf.space/api/svg',{params}),
          ]);
          
          const data = (responseJson.data as ApiResponse).data as GroupItem[];
          setJson(data);
          const extractedGroups = extractGroupsStep1(data);
          setGroups(extractedGroups);
          setSvg(appendGroupRectangles(responseSvg?.data as string, extractedGroups));
        } else if (step === 2) {
            let fileKey: string | null = null;
          let nodeId: string | null = null;

          if (projectData.figmaLink) {
            const url = new URL(projectData.figmaLink);
            const pathParts = url.pathname.split('/');
            if (pathParts.length > 2) {
              fileKey = pathParts[2];
            }
            nodeId = url.searchParams.get('node-id') || null;
          }

          const params: Record<string, string> = {};
          if (fileKey) params.fileKey = fileKey;
          if (nodeId) params.nodeId = nodeId;

          [responseJson, responseSvg] = await Promise.all([
            axios.post('https://AOZ2025-Semantic-Assigner.hf.space/predict', projectData.json1?.data, {
              headers: { 'Content-Type': 'application/json' },
            }),
            axios.get('https://moadelezz2-des2ract.hf.space/api/svg',{params}),
          ]);
          const data = responseJson.data as TreeBuilderNode;
          setJson(data);
          const extractedGroups = extractAllNodes(data);
          setGroups(extractedGroups);
          setSvg(appendGroupRectangles(responseSvg?.data as string, extractedGroups));
        } else if (step === 3) {
          // response = await axios.post('/api/step3', { json2: projectData.json2 });
          responseJson = { data: projectData.json2?.data || projectData.json2 || projectData.json1?.data };
          setJson((responseJson as ApiResponse).data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setJson({ error: 'Error fetching data' });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [step, projectData]);

  const handleCheckboxChange = (id: string) => {
    setGroups((prev: GroupItem[]) => {
      const newGroups = prev.map((group) =>
        group.id === id ? { ...group, checked: !group.checked } : group,
      );
      setJson(newGroups);
      setSvg((prevSvg) => appendGroupRectangles(prevSvg, newGroups));
      return newGroups;
    });
  };

  const handleTagChange = (id: string, newTag: string) => {
  setGroups((prev: GroupItem[]) =>
    prev.map((group) => (group.id === id ? { ...group, tag: newTag } : group)),
  );
  setJson((prev: unknown) => {
    if (prev && typeof prev === 'object' && 'children' in prev) {
      return updateTagInJson(prev as TreeBuilderNode, id, newTag);
    }
    return prev;
  });
};

  const handleContinue = async () => {
    setIsLoading(true);
    try {
      if (step === 1) {
        const checkedIds = groups.filter(g => g.checked).map(g => g.id);

        let fileKey: string | null = null;
        let nodeId: string | null = null;
        if (projectData.figmaLink) {
          const url = new URL(projectData.figmaLink);
          const pathParts = url.pathname.split('/');
          if (pathParts.length > 2) {
            fileKey = pathParts[2];
          }
          nodeId = url.searchParams.get('node-id') || null;
        }
        
        const response = await axios.post('https://moadelezz2-des2ract.hf.space/api/tree-builder', 
            {"fileKey":fileKey,"nodeId":nodeId,"keep":checkedIds}, 
            {headers: { 'Content-Type': 'application/json' },}
        )
        let responseJson = response.data;
        responseJson.data = responseJson.data[0];
        setJson(responseJson);
        onContinue(responseJson);
      } else if (step === 2) {
        onContinue(json);
      } else {
        onContinue(json);
      }
    } catch (error) {
      alert('Error processing data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleItemClick = (id: string) => {
    setSelectedId(id);
  };

  const getModifiedSvg = (): string => {
    if (!svg || !selectedId) return svg;
    const escapedId = selectedId.replace(/"/g, '\\"');
    return svg.replace(
      new RegExp(`id="${escapedId}"`, 'g'),
      `id="${escapedId}" style="fill: rgba(79, 70, 229, 0.2); stroke: #4f46e5; stroke-width: 2"`,
    );
  };

  const tagOptions = [
    'DIV', 'INPUT', 'BUTTON', 'NAVBAR', 'FOOTER', 'FORM', 
    'CARD', 'LIST', 'CHECKBOX', 'DROPDOWN', 'LABEL', 'P', 'A','LI'
  ];

  return (
    <JsonEditorContainer>
      {(() => {
        switch (step) {
          case 1:
            return (
              <>
                <Sidebar>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton onClick={onReturnSelect} sx={{ color: '#00000', mr: 1 }}>
                          <ArrowBack />
                        </IconButton>
                        <StepHeader>Step 1: Tree Builder</StepHeader>
                    </Box>
                  <SidebarHeader>
                    <span>Elements</span>
                    <CountBadge>{groups.filter(g => g.checked).length} selected</CountBadge>
                  </SidebarHeader>
                  {groups.map((group) => (
                    <SidebarItem
                      key={group.id}
                      selected={selectedId === group.id}
                      onClick={() => handleItemClick(group.id)}
                    >
                      <CheckboxInput
                        type="checkbox"
                        checked={!!group.checked}
                        onChange={() => handleCheckboxChange(group.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <GroupLabel>{group.id}</GroupLabel>
                    </SidebarItem>
                  ))}
                  <ContinueButton onClick={handleContinue} disabled={isLoading}>
                    {isLoading ? 'Processing...' : 'Continue'}
                  </ContinueButton>
                </Sidebar>
                <SvgContainer>
                  {isLoading ? (
                    <div>Loading SVG...</div>
                  ) : (
                    <div dangerouslySetInnerHTML={{ __html: getModifiedSvg() }} />
                  )}
                </SvgContainer>
              </>
            );
          case 2:
            return (
              <>
                <Sidebar>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton onClick={onReturnSelect} sx={{ color: '#00000', mr: 1 }}>
                          <ArrowBack />
                        </IconButton>
                        <StepHeader>Step 2: Semantic Assigner</StepHeader>
                    </Box>
                  <SidebarHeader>
                    <span>Elements</span>
                    <CountBadge>{groups.length} total</CountBadge>
                  </SidebarHeader>
                  {groups.map((group) => (
                    <SidebarItem
                      key={group.id}
                      selected={selectedId === group.id}
                      onClick={() => handleItemClick(group.id)}
                    >
                      <TagSelect
                        value={group.tag ?? 'DIV'}
                        onChange={(e) => handleTagChange(group.id, e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {tagOptions.map((tag) => (
                          <option key={tag} value={tag}>{tag}</option>
                        ))}
                      </TagSelect>
                      <GroupLabel>{group.id}</GroupLabel>
                    </SidebarItem>
                  ))}
                  <ContinueButton onClick={handleContinue} disabled={isLoading}>
                    {isLoading ? 'Processing...' : 'Continue'}
                  </ContinueButton>
                </Sidebar>
                <SvgContainer>
                  {isLoading ? (
                    <div>Loading SVG...</div>
                  ) : (
                    <div dangerouslySetInnerHTML={{ __html: getModifiedSvg() }} />
                  )}
                </SvgContainer>
              </>
            );
          case 3:
            return (
              <>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton onClick={onReturnSelect} sx={{ color: '#00000', mr: 1 }}>
                          <ArrowBack />
                        </IconButton>
                        <StepHeader>Step 3: Semantic Grouper</StepHeader>
                    </Box>
                  <JsonTextArea
                    value={json ? JSON.stringify(json, null, 2) : ''}
                    onChange={(e) => {
                      try {
                        setJson(JSON.parse(e.target.value));
                      } catch {
                        // Handle invalid JSON silently
                      }
                    }}
                    placeholder="Edit your JSON here..."
                  />
                  <ContinueButton onClick={handleContinue} disabled={isLoading}>
                    {isLoading ? 'Processing...' : 'Continue'}
                  </ContinueButton>
              </>
            );
          default:
            return (
              <div style={{ width: '100%', textAlign: 'center', padding: '40px' }}>
                <h2>Feasibility Check</h2>
                <p>No valid step provided</p>
              </div>
            );
        }
      })()}
    </JsonEditorContainer>
  );
};

export default JsonEditor;
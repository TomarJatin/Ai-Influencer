import { ToolInvocation } from 'ai';
import SearchWebTool from './SearchWebTool';

export type ToolProps = {
  tool: ToolInvocation;
};

export const toolComponents = {
  web_search: SearchWebTool,
};

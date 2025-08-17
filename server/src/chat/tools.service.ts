import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { tool, generateText, Tool } from 'ai';
import { z } from 'zod';
import { google } from '@ai-sdk/google';
import { getSearchAgentPrompt } from './prompt';

@Injectable()
export class ToolsService {
  constructor(private readonly prisma: PrismaService) {}
  websiteSearchTool(): Tool {
    return tool({
      description:
        'Use this tool to search the web, you must use this tool when you needed live information, or needed any information from internet',
      parameters: z.object({
        query: z.string().describe('Be specific about what you want to search'),
      }),
      execute: async ({ query }) => {
        try {
          const { text } = await generateText({
            model: google('gemini-2.0-flash', {
              useSearchGrounding: true,
            }),
            prompt: query,
            system: getSearchAgentPrompt(),
            maxSteps: 10,
          });
          return {
            success: true,
            data: text,
          };
        } catch (error) {
          return {
            success: false,
            error: error.message,
          };
        }
      },
    });
  }
  getTools() {
    return {
      web_search: this.websiteSearchTool(),
    };
  }
}

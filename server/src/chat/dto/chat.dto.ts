import { Message } from 'ai';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetChatsQueryDto {
  @IsOptional()
  @IsNumber()
  page: number = 1;

  @IsOptional()
  @IsNumber()
  limit: number = 10;
}

export class UpdateChatDto {
  @IsNotEmpty()
  @IsString()
  title: string;
}

export class MessageDto {
  @ApiProperty({ description: 'The message content and metadata' })
  @IsNotEmpty()
  message: Message;

  @ApiProperty({
    description:
      'Model to use in format: provider/model-name (e.g., openai/gpt-4o-mini, anthropic/claude-3-5-sonnet-20241022, google/gemini-1.5-pro)',
    example: 'openai/gpt-4o-mini',
  })
  @IsString()
  @IsNotEmpty()
  model: string;
}

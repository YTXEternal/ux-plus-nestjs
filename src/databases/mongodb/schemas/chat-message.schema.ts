import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ChatMessageDocument = ChatMessage & Document;

@Schema({ timestamps: true })
export class ChatMessage {
  @Prop({ required: true, index: true })
  session_id: string;

  @Prop({ required: true })
  role: 'user' | 'assistant';

  @Prop({ required: true })
  content: string;

  @Prop({ default: Date.now })
  create_time: Date;
}

export const ChatMessageSchema = SchemaFactory.createForClass(ChatMessage);

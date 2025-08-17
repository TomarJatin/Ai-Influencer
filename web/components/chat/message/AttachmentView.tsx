import { cn } from '@/lib/utils';
import React from 'react';
import { Message } from '@ai-sdk/react';
import Image from 'next/image';
import ImageView from './ImageView';
interface AttachmentViewProps {
  attachments: Message['experimental_attachments'];
}

const AttachmentView = ({ attachments }: AttachmentViewProps) => {
  if (!attachments?.length) return null;
  return (
    <div className='mt-2 flex flex-col gap-2'>
      {attachments.map((attachment, index) => (
        <div key={index} className={cn('flex items-center gap-2 rounded-lg py-2 text-sm')}>
          {attachment.contentType?.startsWith('image/') && attachment.url ? (
            <ImageView imageUrl={attachment.url} imageAlt={attachment.name!}>
              <Image
                unoptimized
                src={attachment.url}
                alt={attachment.name!}
                className='cursor-pointer rounded-lg border'
                width={100}
                height={100}
              />
            </ImageView>
          ) : attachment.url ? (
            <a href={attachment.url} target='_blank' rel='noopener noreferrer' className='hover:underline'>
              <span className='truncate'>{attachment.name}</span>
            </a>
          ) : (
            <span className='truncate'>{attachment.name}</span>
          )}
        </div>
      ))}
    </div>
  );
};

export default AttachmentView;

import InfluencerDetailPage from '@/components/influencer/InfluencerDetailPage';
import React from 'react';

interface PageProps {
  params: Promise<{ id: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { id } = await params;
  return <InfluencerDetailPage influencerId={id} />;
};

export default Page;

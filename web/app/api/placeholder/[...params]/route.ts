import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ params: string[] }> }
) {
  const { params: pathParams } = await params;
  const searchParams = request.nextUrl.searchParams;
  
  // Extract dimensions from path (e.g., "400/400")
  const [width = '400', height = '400'] = pathParams || [];
  const text = searchParams.get('text') || 'Placeholder';
  
  // Create a simple SVG placeholder
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <circle cx="50%" cy="40%" r="25%" fill="#e5e7eb"/>
      <text x="50%" y="70%" font-family="Arial, sans-serif" font-size="16" fill="#6b7280" text-anchor="middle">
        ${text}
      </text>
    </svg>
  `;

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000',
    },
  });
}

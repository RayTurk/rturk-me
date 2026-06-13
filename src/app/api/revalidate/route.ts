import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

const REVALIDATE_SECRET = process.env.REVALIDATION_SECRET || '';

export async function POST(request: NextRequest) {
  try {
    // Validate secret from header (sent by WordPress ISR webhook plugin)
    const headerSecret = request.headers.get('X-ISR-Secret');

    // Also support secret in body for backwards compatibility
    const body = await request.json();
    const secret = headerSecret || body.secret;

    if (!secret || secret !== REVALIDATE_SECRET) {
      return NextResponse.json(
        { error: 'Invalid secret' },
        { status: 401 }
      );
    }

    // Handle payload from WordPress ISR webhook plugin
    // Plugin sends: { type, post_id, post_type, paths, timestamp }
    const { paths } = body;

    // If paths array is provided (from webhook plugin), revalidate each path
    if (paths && Array.isArray(paths)) {
      for (const path of paths) {
        revalidatePath(path);
      }

      return NextResponse.json(
        {
          success: true,
          message: `Revalidated ${paths.length} path(s)`,
          paths,
          timestamp: new Date().toISOString(),
        },
        { status: 200 }
      );
    }

    // Fallback: handle simple { slug, type } payload
    const { slug, type } = body;

    if (!slug || !type) {
      return NextResponse.json(
        { error: 'Missing paths array or slug/type' },
        { status: 400 }
      );
    }

    const revalidatedPaths: string[] = [];

    switch (type) {
      case 'project':
        revalidatePath(`/work/${slug}`);
        revalidatePath('/work');
        revalidatedPaths.push(`/work/${slug}`, '/work');
        break;
      case 'post':
        revalidatePath(`/writing/${slug}`);
        revalidatePath('/writing');
        revalidatedPaths.push(`/writing/${slug}`, '/writing');
        break;
      default:
        return NextResponse.json(
          { error: `Invalid type: ${type}` },
          { status: 400 }
        );
    }

    // Always revalidate homepage
    if (!revalidatedPaths.includes('/')) {
      revalidatePath('/');
      revalidatedPaths.push('/');
    }

    return NextResponse.json(
      {
        success: true,
        message: `Revalidated ${revalidatedPaths.length} path(s)`,
        paths: revalidatedPaths,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Health check
export async function GET() {
  return NextResponse.json(
    { message: 'Revalidation endpoint is running' },
    { status: 200 }
  );
}

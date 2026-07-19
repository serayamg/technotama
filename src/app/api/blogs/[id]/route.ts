import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthUser, isAdmin } from '@/lib/auth-helper';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const blog = await prisma.blog.findUnique({
      where: { id }
    });

    if (!blog) {
      return NextResponse.json(
        { error: 'Blog post not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json(blog, { status: 200 });
  } catch (err: any) {
    console.error('[API ERROR] Failed to fetch blog details:', err);
    return NextResponse.json(
      { error: 'Internal server error occurred.' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser();
    if (!user || !isAdmin(user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized access.' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { title, category, content, summary } = body;

    const existing = await prisma.blog.findUnique({
      where: { id }
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Blog post not found.' },
        { status: 404 }
      );
    }

    const sanitizeHtml = (htmlStr: string) => {
      if (!htmlStr) return '';
      return htmlStr
        .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, '')
        .replace(/on\w+="[^"]*"/g, '')
        .replace(/javascript:/gi, '');
    };

    const updatedBlog = await prisma.blog.update({
      where: { id },
      data: {
        title: title !== undefined ? title.trim() : existing.title,
        category: category !== undefined ? category.trim() : existing.category,
        content: content !== undefined ? sanitizeHtml(content) : existing.content,
        summary: summary !== undefined ? summary.trim() : existing.summary
      }
    });

    console.log(`[AUDIT LOG] Blog post updated: id=${updatedBlog.id} title=${updatedBlog.title}`);

    return NextResponse.json(updatedBlog, { status: 200 });
  } catch (err: any) {
    console.error('[API ERROR] Failed to update blog:', err);
    return NextResponse.json(
      { error: 'Internal server error occurred.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser();
    if (!user || !isAdmin(user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized access.' },
        { status: 403 }
      );
    }

    const { id } = await params;

    const existing = await prisma.blog.findUnique({
      where: { id }
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Blog post not found.' },
        { status: 404 }
      );
    }

    await prisma.blog.delete({
      where: { id }
    });

    console.log(`[AUDIT LOG] Blog post deleted: id=${id} title=${existing.title}`);

    return NextResponse.json(
      { success: true, message: 'Blog post deleted successfully.' },
      { status: 200 }
    );
  } catch (err: any) {
    console.error('[API ERROR] Failed to delete blog:', err);
    return NextResponse.json(
      { error: 'Internal server error occurred.' },
      { status: 500 }
    );
  }
}

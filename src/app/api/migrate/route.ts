import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// This route should be removed after initial setup!
// Only use this once to run migrations on production
export async function GET(request: Request) {
  // Add a simple security check
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  
  if (secret !== process.env.JWT_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Run migrations
    const { stdout, stderr } = await execAsync('npx prisma migrate deploy');
    
    return NextResponse.json({
      success: true,
      message: 'Migrations completed',
      stdout,
      stderr
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stdout: error.stdout,
      stderr: error.stderr
    }, { status: 500 });
  }
}

// src/app/api/quick-add/route.ts
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const { type } = body;

    if (type === 'event') {
      const { name, date, location } = body;
      if (!name || !date || !location)
        return NextResponse.json({ error: 'Missing event data' }, { status: 400 });
      await pool.query(
        'INSERT INTO events (title, date, location) VALUES ($1, $2, $3)',
        [name, date, location]
      );
      return NextResponse.json({ message: 'Event created' }, { status: 201 });
    }

    if (type === 'project') {
      const { title, description } = body;
      if (!title || !description)
        return NextResponse.json({ error: 'Missing project data' }, { status: 400 });
      await pool.query('INSERT INTO projects (name, description) VALUES ($1, $2)', [title, description]);
      return NextResponse.json({ message: 'Project created' }, { status: 201 });
    }

    if (type === 'member') {
      console.log("Received body:", body);
      const { name, email, role } = body;
      if (!name || !email || !role)
        return NextResponse.json({ error: 'Missing member data' }, { status: 400 });
      console.log('Inserting member:', { name, email, role });
      await pool.query(
        'INSERT INTO members (nom, email, role) VALUES ($1, $2, $3)',
        [name, email, role]
      );
      return NextResponse.json({ message: 'Member created' }, { status: 201 });
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  } catch (err) {
    console.error('Quick-add error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

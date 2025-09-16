export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const start = url.searchParams.get("start");
    const end = url.searchParams.get("end");

    const pool = getPool();

    let sql = `
      SELECT patient_name, starts_at_utc, ends_at_utc
      FROM appointments
    `;
    const params: any[] = [];

    if (start && end) {
      sql += ` WHERE starts_at_utc < ? AND ends_at_utc > ?`;
      params.push(end, start);
    }
    sql += ` ORDER BY starts_at_utc ASC LIMIT 1000`;

    const [rows] = await pool.query(sql, params);

    const events = (rows as any[]).map((r: any, i: number) => ({
      id: `${r.patient_name}-${r.starts_at_utc}-${i}`,
      title: r.patient_name,
      start: r.starts_at_utc, // ← return exactly as DB has it
      end: r.ends_at_utc,
    }));

    return NextResponse.json(events);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to load appointments" },
      { status: 500 }
    );
  }
}

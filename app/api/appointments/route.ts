export const runtime = 'nodejs';
// app/api/appointments/route.ts
import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const start = url.searchParams.get("start"); // ISO string
    const end = url.searchParams.get("end");     // ISO string

    const pool = getPool();

    let sql = `
      SELECT patient_name, starts_at_utc, ends_at_utc
      FROM appointments
    `;
    const params: any[] = [];

    // Limit by visible range if provided (overlap)
    if (start && end) {
      sql += ` WHERE starts_at_utc < ? AND ends_at_utc > ?`;
      params.push(end, start);
    }
    sql += ` ORDER BY starts_at_utc ASC LIMIT 1000`;

    const [rows] = await pool.query(sql, params);

    // Return strings (UTC) so the client can convert to Date objects safely
    const events = (rows as any[]).map((r: any, i: number) => ({
      id: `${r.patient_name}-${r.starts_at_utc}-${i}`,
      title: r.patient_name,
      // append 'Z' because these columns are UTC (DATETIME w/o tz)
      start: `${r.starts_at_utc}Z`,
      end: `${r.ends_at_utc}Z`,
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

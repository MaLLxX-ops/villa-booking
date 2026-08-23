import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getTodayString, isDateBeforeToday, isValidDateString } from "@/lib/date-utils";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const villaId = url.searchParams.get("villa_id");
  const from = url.searchParams.get("from") || getTodayString();
  const to = url.searchParams.get("to") || from;

  if (!villaId || !isValidDateString(from) || !isValidDateString(to) || isDateBeforeToday(from) || to < from) {
    return NextResponse.json({ error: "Rentang tanggal tidak valid." }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) return NextResponse.json([]);
  const { data, error } = await supabase
    .from("villa_availability")
    .select("date,is_available,note")
    .eq("villa_id", villaId)
    .gte("date", from)
    .lte("date", to)
    .order("date");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
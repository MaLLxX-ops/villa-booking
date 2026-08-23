import { NextResponse } from "next/server";
import { getExchangeRates } from "@/lib/currency";

export const revalidate = 21600; // 6 hours

export async function GET() {
  try {
    const rates = await getExchangeRates();
    return NextResponse.json({
      success: true,
      base: "IDR",
      rates,
      timestamp: Date.now(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to retrieve exchange rates",
      },
      { status: 500 }
    );
  }
}

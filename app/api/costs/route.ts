import { NextResponse } from "next/server";
import costData from "@/data/costs-current.json";

export async function GET() {
  return NextResponse.json(costData);
}

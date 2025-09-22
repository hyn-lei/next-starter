import { NextRequest, NextResponse } from "next/server";
import * as fs from "node:fs";

export async function POST(req: NextRequest) {
  let data = await req.text();
  let jsonData = JSON.parse(data);
  // write data to file
  console.log(data);
  let date = new Date();
  let file = fs.createWriteStream(`contact-${date.getTime()}.txt`);
  file.write(data);
  file.end();

  return NextResponse.json({ result: "ok" });
}

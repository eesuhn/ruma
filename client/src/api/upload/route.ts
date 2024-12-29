import { irysUploader } from "@/lib/irys";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const contentType = req.headers.get("content-type");

  if (!contentType || !contentType.includes("multipart/form-data")) {
    return NextResponse.json(
      { error: "Content-Type must be multipart/form-data." },
      { status: 400 }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
  
    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded." },
        { status: 400 }
      );
    }
  
    const price = await irysUploader.getPrice(file.size);
    await irysUploader.fund(price);

    const receipt = await irysUploader.upload(
      Buffer.from(await file.arrayBuffer()),
      {
        tags: [
          {
            name: "Content-Type",
            value: file.type,
          },
          {
            name: "Filename",
            value: file.name,
          },
        ],
      }
    );

    const link = `https://gateway.irys.xyz/${receipt.id}`;
    console.log(`Uploaded to ${link}`);
    return NextResponse.json({ link });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed to upload file." }, { status: 500 });
  }
}
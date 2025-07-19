export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import client from "@/lib/db";
import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" }); // Load environment variables

// Log the environment variables for debugging
console.log("Twilio ENV check:", {
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
  TWILIO_PHONE: process.env.TWILIO_PHONE_NUMBER,
});

// Function to check if Twilio is properly configured
function isTwilioConfigured(sid?: string, token?: string, phone?: string) {
  return !!sid && !!token && !!phone;
}

export async function GET() {
  try {
    const res = await client.query(
      "SELECT * FROM announcements ORDER BY created_at DESC"
    );
    return NextResponse.json(res.rows);
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch announcements" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { title, content, visible } = await req.json();

    const insertQuery = `
      INSERT INTO announcements (title, content, visible)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const result = await client.query(insertQuery, [title, content, visible]);
    const announcement = result.rows[0];

    const members = await client.query("SELECT phone FROM members");
    const phones = members.rows.map((m) => m.phone);

    console.log("Phones to send SMS to:", phones);

    const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
    const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
    const TWILIO_PHONE = process.env.TWILIO_PHONE_NUMBER;

    // Log Twilio credentials to verify they are read correctly
    console.log("TWILIO ENV check:", {
      TWILIO_ACCOUNT_SID,
      TWILIO_AUTH_TOKEN,
      TWILIO_PHONE,
    });

    if (
      !isTwilioConfigured(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE)
    ) {
      console.warn("Twilio is not configured. Skipping SMS sending.");
      return NextResponse.json(announcement);
    }

    const twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

    await Promise.all(
      phones.map(async (to: string) => {
        try {
          console.log(`Sending SMS to: ${to}`);
          const msg = await twilioClient.messages.create({
            body: `📢 New Announcement: ${title} — ${content}`,
            from: TWILIO_PHONE,
            to,
          });
          console.log(`✅ SMS sent to ${to}: SID ${msg.sid}`);
        } catch (err: any) {
          console.error(`❌ Failed to send SMS to ${to}:`, err?.message);
        }
      })
    );

    return NextResponse.json(announcement);
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json(
      { error: "Failed to create announcement" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { title, content, visible } = await req.json();
    const id = req.nextUrl.searchParams.get("id"); // Ensure we retrieve the ID correctly

    if (!id)
      return NextResponse.json({ error: "ID required" }, { status: 400 });

    const updateQuery = `
        UPDATE announcements
        SET title = $1, content = $2, visible = $3
        WHERE id = $4
        RETURNING *
      `;
    const result = await client.query(updateQuery, [
      title,
      content,
      visible,
      id,
    ]);
    const updatedAnnouncement = result.rows[0];

    if (!updatedAnnouncement)
      return NextResponse.json(
        { error: "Announcement not found" },
        { status: 404 }
      );

    // Notify members via SMS
    const members = await client.query("SELECT phone FROM members");
    const phones = members.rows.map((m) => m.phone);

    const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
    const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
    const TWILIO_PHONE = process.env.TWILIO_PHONE_NUMBER;

    if (
      !isTwilioConfigured(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE)
    ) {
      console.warn("Twilio is not configured. Skipping SMS sending.");
    } else {
      const twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

      await Promise.all(
        phones.map(async (to: string) => {
          try {
            console.log(`Sending update SMS to: ${to}`);
            const msg = await twilioClient.messages.create({
              body: `📢 Announcement Updated: ${updatedAnnouncement.title} — ${updatedAnnouncement.content}`,
              from: TWILIO_PHONE,
              to,
            });
            console.log(`✅ SMS update sent to ${to}: SID ${msg.sid}`);
          } catch (err: any) {
            console.error(
              `❌ Failed to send update SMS to ${to}:`,
              err?.message
            );
          }
        })
      );
    }

    return NextResponse.json(updatedAnnouncement);
  } catch (error) {
    console.error("PUT error:", error);
    return NextResponse.json(
      { error: "Failed to update announcement" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    if (!id)
      return NextResponse.json({ error: "ID required" }, { status: 400 });

    const deleted = await client.query(
      "DELETE FROM announcements WHERE id = $1 RETURNING *",
      [id]
    );
    const announcement = deleted.rows[0];

    if (!announcement)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    const members = await client.query("SELECT phone FROM members");
    const phones = members.rows.map((m) => m.phone);

    const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
    const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
    const TWILIO_PHONE = process.env.TWILIO_PHONE_NUMBER;

    if (
      !isTwilioConfigured(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE)
    ) {
      console.warn("Twilio is not configured. Skipping SMS sending.");
    } else {
      const twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

      await Promise.all(
        phones.map(async (to: string) => {
          try {
            console.log(`Sending delete SMS to: ${to}`);
            const msg = await twilioClient.messages.create({
              body: `⚠️ Announcement Deleted: ${announcement.title}`,
              from: TWILIO_PHONE,
              to,
            });
            console.log(`✅ SMS delete sent to ${to}: SID ${msg.sid}`);
          } catch (err: any) {
            console.error(
              `❌ Failed to send delete SMS to ${to}:`,
              err?.message
            );
          }
        })
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete announcement" },
      { status: 500 }
    );
  }
}

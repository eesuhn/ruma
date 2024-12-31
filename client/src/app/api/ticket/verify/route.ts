import { VERIFICATION_PUBKEY } from "@/lib/constants";
import { getAttendeeAcc, getEventAcc } from "@/lib/program";
import { generateDataBytes } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import { sign } from "tweetnacl";

export async function POST(req: NextRequest) {
  try {
    const { payload } = await req.json();

    if (!payload) {
      return NextResponse.json(
        {
          error: "Payload required."
        },
        {
          status: 400,
        }
      );
    }

    const [attendeePda, eventPda, signature] = payload.split('-');

    const eventAcc = await getEventAcc(eventPda);

    if (!eventAcc) {
      return NextResponse.json(
        {
          error: "Event not found."
        },
        {
          status: 404,
        }
      );
    }

    const attendeeAcc = await getAttendeeAcc(attendeePda);

    if (!attendeeAcc) {
      return NextResponse.json(
        {
          error: "Attendee not found."
        },
        {
          status: 404,
        }
      );
    }

    if (eventAcc.attendees.includes(attendeePda)) {
      // check if signature is signed by the internal secret key
      const dataBytes = generateDataBytes(attendeePda, eventPda);
      const signatureBytes = new Uint8Array(Buffer.from(signature, 'hex'));
      const verified = sign.detached.verify(dataBytes, signatureBytes, VERIFICATION_PUBKEY);

      return verified
        ? NextResponse.json({
          verified: true,
          message: "Ticket verified successfully."
        })
        : NextResponse.json(
          {
            error: "Invalid ticket signature."
          },
          {
            status: 403,
          }
        );
    } else {
      return NextResponse.json(
        {
          error: "Attendee is not approved for this event."
        },
        {
          status: 403,
        }
      )
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to verify ticket.' },
      { status: 500 }
    );
  }
}
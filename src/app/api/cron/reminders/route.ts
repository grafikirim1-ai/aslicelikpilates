// Blanket reminders were unrelated to each member’s actual booked session.
// Re-enable only with member-specific scheduling and persistent delivery deduplication.
export async function GET() {
  return Response.json({ error: "Üyeye özel hatırlatma planlaması hazırlanıyor." }, { status: 503 });
}
export const POST = GET;

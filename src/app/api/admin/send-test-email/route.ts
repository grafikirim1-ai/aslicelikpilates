// Email testing must never provide a production bulk-mail or arbitrary-recipient relay.
export async function GET() { return Response.json({ error: "Bu özellik kapalı." }, { status: 410 }); }
export async function POST() { return Response.json({ error: "Bu özellik kapalı." }, { status: 410 }); }

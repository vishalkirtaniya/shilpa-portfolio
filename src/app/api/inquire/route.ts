// Placeholder endpoint for the contact form.
// TODO: forward `body` to your email / CRM provider (Resend, Postmark, Formspree, …).
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  if (!body?.name?.trim() || !body?.email?.trim() || !body?.message?.trim()) {
    return Response.json({ error: "Name, email and note are all required." }, { status: 400 });
  }

  console.log("[inquiry]", body);
  return Response.json({ ok: true });
}

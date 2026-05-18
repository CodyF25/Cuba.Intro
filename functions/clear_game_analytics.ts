import { createClientFromRequest } from "npm:@base44/sdk";

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const records = await base44.asServiceRole.entities.GameAnalytics.list("-created_date", 5000);

    await Promise.allSettled(
      records
        .filter((r) => r?.id)
        .map((r) => base44.asServiceRole.entities.GameAnalytics.delete(r.id))
    );

    return Response.json({ success: true, deleted: records.length });
  } catch (error) {
    return Response.json(
      { error: error.message || "Failed to clear game analytics." },
      { status: 500 }
    );
  }
});

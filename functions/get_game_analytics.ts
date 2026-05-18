import { createClientFromRequest } from "npm:@base44/sdk";

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const records = await base44.asServiceRole.entities.GameAnalytics.list(
      "-created_date",
      5000
    );

    return Response.json(records);
  } catch (error) {
    return Response.json(
      {
        error: error?.message || "Failed to load game analytics.",
      },
      { status: 500 }
    );
  }
});

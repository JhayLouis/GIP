import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const url = new URL(req.url);
    const pathSegments = url.pathname.split("/").filter(Boolean);
    const action = pathSegments[pathSegments.length - 1];

    if (action === "get-applicants" && req.method === "POST") {
      const { program } = await req.json();

      return new Response(
        JSON.stringify({
          success: true,
          message: "Backend endpoint ready for applicants retrieval",
          program,
          timestamp: new Date().toISOString(),
        }),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (action === "add-applicant" && req.method === "POST") {
      const applicant = await req.json();

      return new Response(
        JSON.stringify({
          success: true,
          message: "Backend endpoint ready for applicant creation",
          applicant: applicant,
          timestamp: new Date().toISOString(),
        }),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (action === "update-applicant" && req.method === "PUT") {
      const { id, data } = await req.json();

      return new Response(
        JSON.stringify({
          success: true,
          message: "Backend endpoint ready for applicant update",
          id,
          data,
          timestamp: new Date().toISOString(),
        }),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (action === "delete-applicant" && req.method === "DELETE") {
      const { id } = await req.json();

      return new Response(
        JSON.stringify({
          success: true,
          message: "Backend endpoint ready for applicant deletion",
          id,
          timestamp: new Date().toISOString(),
        }),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: false,
        message: "Backend handler ready but action not recognized",
      }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error";

    return new Response(
      JSON.stringify({
        success: false,
        message: "Backend error",
        error: errorMsg,
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});

import type { Handler } from "@netlify/functions";

export const handler: Handler = async (event) => {
  // Pesapal will hit this URL when a transaction status changes.
  // It may send query params like orderTrackingId, merchantReference, notificationType.
  console.log("PESAPAL IPN HIT:", {
    method: event.httpMethod,
    query: event.queryStringParameters,
    body: event.body,
  });

  return {
    statusCode: 200,
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      ok: true,
      function: "pesapal-ipn",
      received: {
        method: event.httpMethod,
        query: event.queryStringParameters,
      },
    }),
  };
};

import type { Handler } from "@netlify/functions";

function getBaseUrl() {
  const env = (process.env.PESAPAL_ENV || "sandbox").toLowerCase();
  // Pesapal docs: sandbox uses cybqa; live uses pay.pesapal.com :contentReference[oaicite:3]{index=3}
  return env === "live"
    ? "https://pay.pesapal.com/v3/api"
    : "https://cybqa.pesapal.com/pesapalv3/api";
}

async function getToken() {
  const base = getBaseUrl();

  const res = await fetch(`${base}/Auth/RequestToken`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      consumer_key: process.env.PESAPAL_CONSUMER_KEY,
      consumer_secret: process.env.PESAPAL_CONSUMER_SECRET,
    }),
  });

  const data = await res.json();
  if (!res.ok || !data?.token) {
    throw new Error(`Token error: ${JSON.stringify(data)}`);
  }
  return data.token as string;
}

export const handler: Handler = async () => {
  try {
    const token = await getToken();
    const base = getBaseUrl();

    // IMPORTANT: must be publicly reachable :contentReference[oaicite:4]{index=4}
    const ipnUrl =
      process.env.PESAPAL_IPN_LISTENER_URL ||
      "https://sportswave-campus.netlify.app/.netlify/functions/pesapal-ipn";

    const res = await fetch(`${base}/URLSetup/RegisterIPN`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        url: ipnUrl,
        ipn_notification_type: "GET",
      }),
    });

    const data = await res.json();

    return {
      statusCode: 200,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        ok: res.ok,
        ipnUrl,
        response: data,
        IMPORTANT_COPY_THIS_IPN_ID: data?.ipn_id,
      }),
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ok: false, error: err?.message || String(err) }),
    };
  }
};

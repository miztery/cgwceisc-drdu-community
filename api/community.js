
export default async function handler(req, res) {
  // Accept POST requests only
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed."
    });
  }

  const APP_SCRIPT_URL = process.env.APPS_SCRIPT_URL;

  if (!APP_SCRIPT_URL) {
    return res.status(500).json({
      success: false,
      message: "Apps Script URL is not configured."
    });
  }

  try {
    const response = await fetch(APP_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(req.body),
      redirect: "follow"
    });

    const responseText = await response.text();

    let result;

    try {
      result = JSON.parse(responseText);
    } catch {
      return res.status(502).json({
        success: false,
        message: "The Apps Script backend returned an invalid response.",
        details: responseText.slice(0, 500)
      });
    }

    return res.status(response.ok ? 200 : 502).json(result);

  } catch (error) {
    console.error("Community API error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to connect to the community backend."
    });
  }
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Only POST allowed" }),
    };
  }

  const { businessShortCode, passKey } = JSON.parse(event.body || '{}');

  if (!businessShortCode || !passKey) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing businessShortCode or passKey" }),
    };
  }

  function getTimestamp() {
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, '0');
    const day = String(now.getUTCDate()).padStart(2, '0');
    const hours = String((now.getUTCHours() + 3) % 24).padStart(2, '0');
    const minutes = String(now.getUTCMinutes()).padStart(2, '0');
    const seconds = String(now.getUTCSeconds()).padStart(2, '0');
    return `${year}${month}${day}${hours}${minutes}${seconds}`;
  }

  const timestamp = getTimestamp();
  const password = Buffer.from(businessShortCode + passKey + timestamp).toString("base64");

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ timestamp, password }),
  };
};

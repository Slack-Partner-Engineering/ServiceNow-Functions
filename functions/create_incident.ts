export default async ({ ctx, inputs, env }: any) => {
  
  const username = env["SERVICENOW_USERNAME"];
  const password = env["SERVICENOW_PW"];
  const instance = env["SERVICENOW_INSTANCE"]

  const response = await fetch(
    "https://" + instance + ".service-now.com/api/now/table/incident",
    {
      method: "POST",
      headers: {
        "Authorization": "Basic " + btoa(username + ":" + password),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
          "short_description": inputs.short_description,
          "urgency": inputs.urgency,
          "impact": inputs.impact,
      }),
    },
  )
    .then((response) => response.json())
    .then((data) => {
      return data;
    });

    return await {
      outputs: { ServiceNowResponse: JSON.stringify(response) },
    };
};
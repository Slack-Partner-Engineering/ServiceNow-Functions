export default async ({ ctx, inputs, env }: any) => {
  
    const username = env["SERVICENOW_USERNAME"];
    const password = env["SERVICENOW_PW"];
    const instance = env["SERVICENOW_INSTANCE"]
  
    const sysID = inputs.incident_number;

    const incidentResp = await fetch(
        "https://" + instance + ".service-now.com/api/now/table/incident/" +
        sysID,      
        {
        method: "PUT",
        headers: {
          "Authorization": "Basic " + btoa(username + ":" + password),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "status": "closed",
        }),
      },
    )
      .then((incidentResp) => incidentResp.json())
      .then((data) => {
        return data;
      });
  
      return await {
        outputs: { ServiceNowResponse: JSON.stringify(incidentResp) },
      };
  };
export default async ({ ctx, inputs, env }: any) => {
  const username = env["SERVICENOW_USERNAME"];
  const password = env["SERVICENOW_PW"];
  const instance = env["SERVICENOW_INSTANCE"];

  try {
    // this is needed as a query param to delete an incident
    const sysID = inputs.incident_number;

    let incidentResp = await fetch(
      "https://" + instance + ".service-now.com/api/now/table/incident/" +
        sysID,
      {
        method: "DELETE",
        headers: {
          "Authorization": "Basic " + btoa(username + ":" + password),
          "Content-Type": "application/json",
        },
      },
    );
    console.log('incidentResp from deleteIncident: ');
    console.log(incidentResp);
    if (incidentResp.body == null && incidentResp.status === 204) {
      return await {
        outputs: {
          ServiceNowResponse: "Sucessfully deleted record with sys_id: " +
            sysID,
        },
      };
    }
    return await {
      outputs: { ServiceNowResponse: incidentResp },
    };
  } catch (err) {
    console.error(err);
  }
};

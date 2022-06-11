export default async ({ ctx, inputs, env }: any) => {
  const username = env["SERVICENOW_USERNAME"];
  const password = env["SERVICENOW_PW"];
  const instance = env["SERVICENOW_INSTANCE"];

  const incidentResp = await fetch(
    "https://" + instance + ".service-now.com/api/now/table/incident",
    {
      method: "GET",
      headers: {
        "Authorization": "Basic " + btoa(username + ":" + password),
        "Content-Type": "application/json",
      },
    },
  )
    .then((incidentResp) => incidentResp.json())
    .then((data) => {
      return data;
    });

    console.log('esponse.result[1]')

    console.log(incidentResp.result[0])
    const numIncidents = incidentResp.result.length; 

    let formattedOutput = '';
    for (let i = 0; i < 10; i++){
        console.log('response.result[' + i + ']: ')
        console.log(incidentResp.result[i])
        formattedOutput += 'Incident number: ' + incidentResp.result[i].number + '\n' 
        + 'Description: ' + incidentResp.result[i].description + '\n' 
        + 'Urgency: ' + incidentResp.result[i].urgency + '\n'
        + 'Severity: ' + incidentResp.result[i].urgency + '\n'  + '\n'  
    }    

    console.log(formattedOutput)

    // let output = response
    // output = 'Link to Incident: ' + response.location.link


  return await {
    outputs: { ServiceNowResponse: formattedOutput },
  };
};

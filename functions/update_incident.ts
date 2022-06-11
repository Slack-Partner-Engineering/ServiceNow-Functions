import { SlackAPI } from "deno-slack-api/mod.ts";

export default async ({ token, inputs, env }: any) => {
  const username = env["SERVICENOW_USERNAME"];
  const password = env["SERVICENOW_PW"];
  const instance = env["SERVICENOW_INSTANCE"];
  const channel = env["INCIDENT_CHANNEL"];

  const incident_number = inputs.incident_number
  const client = SlackAPI(token, {});

  //sysID to use: 5be134f52f3301108d5093acf699b681
  //Number to use: INC0010037

  //a9a16740c61122760004fe9095b7ddca
  //INC0000047

  const getIncidentResp = await fetch(
    "https://" + instance + ".service-now.com/api/now/table/incident" + "?sysparm_query=number%3D" + incident_number + "&sysparm_limit=1",
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

    console.log('getIncidentResp inside update: ')
    console.log(getIncidentResp)
    // need first GET call to get the `sys_id` for the Incident Number which the user types in
  const sys_id = getIncidentResp.result[0].sys_id
  const url = "https://" + instance + ".service-now.com/api/now/table/incident/" + sys_id + '?sysparm_display_value=true'

  console.log('inputs.comments: ')
  console.log(inputs.comments)
  console.log('url: ')
  console.log(url)

  //API call to update incident
  const incidentResp = await fetch(
    url,
    {
      method: "PATCH",
      headers: {
        "Authorization": "Basic " + btoa(username + ":" + password),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "short_description": inputs.short_description,
        "priority": inputs.priority,
        "state": inputs.state,
        "comments": inputs.comments,
      }),
    },
  )
    .then((incidentResp) => incidentResp.json())
    .then((data) => {
      return data;
    });

  let incidentLink = "https://" + instance + ".service-now.com/nav_to.do?uri=task.do?sysparm_query=number=" + incident_number

  console.log(incidentResp)

  let incidentBlock = [];
  await incidentBlock.push({
    "type": "section",
    "text": {
      "type": "mrkdwn",
      "text":
        "*Incident Id:* " + "<" + `${incidentLink}` + "|" + `${incidentResp.result.number}` + ">" + "\n" +
        "*Incident Description:* " + `${incidentResp.result.short_description}` + "\n" +
        "*Incident Comments:* " + `${incidentResp.result.comments}` + "\n" +
        "*Incident Urgency:* " + `${incidentResp.result.urgency}` + "\n" +
        "*Incident Severity:* " + `${incidentResp.result.severity}` + "\n" +
        "*Incident State:* " + `${incidentResp.result.state}` + "\n" +
        "*Incident Priority:* " + `${incidentResp.result.priority}` + "\n" +
        "*Incident Caller:* " + `${incidentResp.result.caller_id.link}` + "\n" +
        "*Incident Assigned To:* " + `${incidentResp.result.assigned_to.link}` + "\n" +
        "*Incident Assignment Group:* " + `${incidentResp.result.assignment_group.link}` + "\n"
    },
  });

  const resp = await client.apiCall("chat.postMessage", {
    text: ``,
    channel: channel,
    blocks: incidentBlock,
  });


  return await {
    outputs: { ServiceNowResponse: "Please go to channel " + "#servicenow-incidents" + " to view all of your incidents." },
  };
};

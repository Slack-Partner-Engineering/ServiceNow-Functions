import { SlackAPI } from "deno-slack-api/mod.ts";

export default async ({ token, inputs, env }: any) => {
  try {
    const username = env["SERVICENOW_USERNAME"];
    const password = env["SERVICENOW_PW"];
    const instance = env["SERVICENOW_INSTANCE"];
  
    const incident_number = inputs.incident_number
    const channel = inputs.channel
    const client = SlackAPI(token, {});

    const incidentResp = await fetch(
      "https://" + instance + ".service-now.com/api/now/table/incident" + "?sysparm_query=number%3D" + incident_number + "&sysparm_limit=1&sysparm_display_value=true",
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

    let incidentLink = "https://" + instance + ".service-now.com/nav_to.do?uri=task.do?sysparm_query=number=" + incident_number

    // need to parse username

    const myArray = await incidentResp.result[0].assigned_to.link.split("/");
    let userID = myArray[7]

    const userInfo = await client.apiCall("users.info", {
      user: userID,
    });
    let user: any = await userInfo.user

    console.log('incidentResp: ')
    console.log(incidentResp)
    let incidentBlock = [];
    incidentBlock.push({
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text":
          "*Incident Id:* " + "<" + `${incidentLink}` + "|" + `${incidentResp.result[0].number}` + ">" + "\n" +
          "*Incident Short Description:* " + `${incidentResp.result[0].short_description}` + "\n" +
          "*Incident Comments:* " + `${incidentResp.result[0].comments}` + "\n" +
          "*Incident Urgency:* " + `${incidentResp.result[0].urgency}` + "\n" +
          "*Incident Severity:* " + `${incidentResp.result[0].severity}` + "\n" +
          "*Incident State:* " + `${incidentResp.result[0].state}` + "\n" +
          "*Incident Priority:* " + `${incidentResp.result[0].priority}` + "\n" +
          "*Incident Caller:* " + `${incidentResp.result[0].caller_id.link}` + "\n" + 
          "*Incident Assigned To:* " + `@${user.name}` + "\n"
      },
    });
    const resp = await client.apiCall("chat.postMessage", {
      text: ``,
      channel: channel,
      blocks: incidentBlock,
    });

    const channelInfoResp = await client.apiCall("conversations.info", {
      channel: channel,
    });
    let channelInfo: any = await channelInfoResp.channel

    return await {
      outputs: { ServiceNowResponse: `Please go to channel ` + `#${channelInfo.name}` + ` to view information about ${incidentResp.result[0].number}.` },
    };

  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
    } else {
      console.log('Unexpected error', err);
    }
  }

};

import { SlackAPI } from "deno-slack-api/mod.ts";

export default async ({ token, inputs, env }: any) => {
  try {

    const username = env["SERVICENOW_USERNAME"];
    const password = env["SERVICENOW_PW"];
    const instance = env["SERVICENOW_INSTANCE"];
    const channel = inputs.channel

    const client = SlackAPI(token, {});

    console.log(inputs)
    let requestBody = await JSON.stringify({
      "short_description": inputs.short_description,
      "state": inputs.state,
      "comments": inputs.comments,
      "assigned_to": inputs.assigned_to,
      "channel": inputs.channel,
    })

    console.log(requestBody)

    const incidentResp = await fetch(
      "https://" + instance + ".service-now.com/api/now/table/incident",
      {
        method: "POST",
        headers: {
          "Authorization": "Basic " + btoa(username + ":" + password),
          "Content-Type": "application/json",
        },
        body: requestBody
      },
    )
      .then((incidentResp) => incidentResp.json())
      .then((data) => {
        return data;
      });

    console.log(incidentResp)
    const incident_number = incidentResp.result.task_effective_number

    const userInfo = await client.apiCall("users.info", {
      user: inputs.assigned_to,
    });
    let user: any = await userInfo.user

    const authTest = await client.apiCall("auth.test", {});
    let curUser: any = await authTest.user


    const channelInfoResp = await client.apiCall("conversations.info", {
      channel: channel,
    });
    let channelInfo: any = await channelInfoResp.channel

    let incidentLink = "https://" + instance + ".service-now.com/nav_to.do?uri=task.do?sysparm_query=number=" + incident_number

    // must map state number with the actual state, i.e 1 == new, 2 == in progress, etc
    let curState;
    switch (incidentResp.result.state) {
      case 1:
        curState = "New";
        break;
      case 2:
        curState = "In Progress";
        break;
      case 3:
        curState = "On Hold";
        break;
      case 6:
        curState = "Resolved";
        break;
      case 7:
        curState = "Closed";
        break;
      case 8:
        curState = "Cancelled";
        break;
      default:
        curState = "In Progress"
    }

    //need to parse the assigned to, and 

    let incidentBlock = [];
    incidentBlock.push({
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text":
          "*Incident Id:* " + "<" + `${incidentLink}` + "|" + `${incidentResp.result.task_effective_number}` + ">" + "\n" +
          "*Incident Short Description:* " + `${incidentResp.result.short_description}` + "\n" +
          "*Incident Priority:* " + `${incidentResp.result.priority}` + "\n" +
          "*Incident State:* " + `${curState}` + "\n" +
          "*Incident Comments:* " + `${incidentResp.result.comments}` +
          "*Incident Caller:* " + `${curUser}` + "\n" +
          "*Incident Assigned To:* " + `@${user.name}` + "\n"
      },
    });

    const resp = await client.apiCall("chat.postMessage", {
      text: ``,
      channel: channel,
      blocks: incidentBlock,
    });

    return await {
      outputs: { ServiceNowResponse: "Please go to channel " + `#${channelInfo.name}` + " to view all of your incidents." },
    };

  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
    } else {
      console.log('Unexpected error', err);
    }
  }

};

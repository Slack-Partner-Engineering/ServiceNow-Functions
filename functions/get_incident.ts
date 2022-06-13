import { SlackAPI } from "deno-slack-api/mod.ts";
import { Blocks } from "../utils/get_blocks.ts";
import { State } from "../utils/get_state.ts";
import { User } from "../utils/get_user_info.ts";
import { Channel } from "../utils/channel_utils.ts";

export default async ({ token, inputs, env }: any) => {
  try {
    //needed for auth,
    const username = env["SERVICENOW_USERNAME"];
    const password = env["SERVICENOW_PW"];
    const instance = env["SERVICENOW_INSTANCE"];
    // Setting up helper functions
    let state = new State()
    let channelObj = new Channel()
    let user = new User();
    let block = new Blocks();

    // the channel to post incident info to
    const channel = inputs.channel
    const header = "Incident Info :information_source:";

    const incidentResp: any = await fetch(
      "https://" + instance + ".service-now.com/api/now/table/incident" + "?sysparm_query=number%3D" + inputs.incident_number + "&sysparm_limit=1&sysparm_display_value=true",
      {
        method: "GET",
        headers: {
          "Authorization": "Basic " + btoa(username + ":" + password),
          "Content-Type": "application/json",
        },
      },
    )
      .then((incidentResp) => incidentResp.json())

    // let assignedToID;
    // if (incidentResp.result[0].assigned_to) {
    //   const assignedTo = await incidentResp.result[0].assigned_to.link.split("/");
    //   assignedToID = assignedTo[7]
    // }

    // const callerInfo = await incidentResp.result[0].caller_id.link.split("/");
    // let callerID = callerInfo[7]
    //get user info so we can mention Slack Users directly in UI
    // let assignedToUser;
    // let user = new User();

    // if (assignedToID) {
    //   assignedToUser = await user.getUserInfo(token, assignedToID)
    //   console.log(assignedToUser)
    // } else {
    //   assignedToUser = 'N/A'
    // }
    // let callerUser: any = await user.getUserInfo(token, callerID)

    // console.log('incidentResp: ')
    // console.log(incidentResp)


    // Parse UserID to feed into getUserInfo
    let assignedToID: any, callerUser: any;
    const callerInfo = await incidentResp.result[0].caller_id.link.split("/");
    if (incidentResp.result[0].assigned_to === "") {
      console.log('no assigned to')
    } else {
      const assignedTo = await incidentResp.result[0].assigned_to.link.split("/");
      assignedToID = assignedTo[7]
    }

    let callerID = callerInfo[7]

    console.log('inputs: ')
    console.log(inputs)
    let isCallerSlackUser = await user.isSlackUser(token, callerID)
    console.log('isCallerSlackUser: ')
    console.log(isCallerSlackUser)

    if (isCallerSlackUser) {
      console.log('this should be a slack user')
      callerUser = await user.getUserInfo(token, callerID)
      callerUser = await callerUser.name
    } else {
      callerUser = await incidentResp.result[0].caller_id.display_value
    }
    console.log('callerUser: ')
    console.log(callerUser)

    // Grab userInfo to update the UI with Slack Users
    let assignedToUser, incidentBlock;

    if (assignedToID) {
      console.log(assignedToUser)
      assignedToUser = await user.getUserInfo(token, assignedToID)

    } else {
      assignedToUser = 'N/A'
    }

    //Get current state of the incident, make sure it looks nice in UI
    let curState = state.getStateFromString(incidentResp.result[0].state)

    //set the blocks to show in the UI
    const incident_number = incidentResp.result[0].task_effective_number
    let incidentLink = "https://" + instance + ".service-now.com/nav_to.do?uri=task.do?sysparm_query=number=" + incident_number

    //assign Block Kit blocks for a better UI experience, check if someone was assigned    
    if (!assignedToID) {
      incidentBlock = block.getBlocks(header, incidentResp.result[0].number, incidentResp.result[0].short_description,
        curState, incidentResp.result[0].comments, callerUser, assignedToUser, incidentLink)
    }
    else {
      incidentBlock = block.getBlocks(header, incidentResp.result[0].number, incidentResp.result[0].short_description,
        curState, incidentResp.result[0].comments, callerUser, assignedToUser.name, incidentLink)
    }

    let channelInfo: any = await channelObj.getChannelInfo(token, channel)
    await channelObj.postToChannel(token, channel, incidentBlock);

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

import { SlackAPI } from 'deno-slack-api/mod.ts';
import { Blocks } from "../utils/get_blocks.ts";
import { State } from "../utils/get_state.ts";
import { User } from "../utils/get_user_info.ts";
import { Channel } from "../utils/channel_utils.ts";
import { Auth } from "../utils/get_auth.ts";

export default async ({ token, inputs, env }: any) => {
  try {
    const instance = env["SERVICENOW_INSTANCE"];
    const auth = new Auth()
    const basicAuth = await auth.getBasicAuth(env)
    // the channel to post incident info to
    const channel = inputs.channel
    const header = "New Incident Created :memo:";

    //build the requestBody with our inputs from the UI
    let requestBody: any = {
      "short_description": inputs.short_description,
      "state": inputs.state,
      "caller_id": inputs.caller,
    }
    //only add optional fields to request body if they were filled in in the UI
    if (inputs.assigned_to) {
      requestBody.assigned_to = inputs.assigned_to
    }
    if (inputs.comments) {
      requestBody.comments = inputs.comments
    }

    //API request to create a new incident in ServiceNow
    const incidentResp: any = await fetch(
      "https://" + instance + ".service-now.com/api/now/table/incident",
      {
        method: "POST",
        headers: {
          "Authorization": basicAuth,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody)
      },
    )
    .then((incidentResp) => incidentResp.json())

    console.log('incidentResp:')
    console.log(incidentResp)
    console.log('after inc resp:')

    //get user info so we can mention Slack Users directly in UI
    let assignedToUser: any, callerUser: any;
    let user = new User();
    if (inputs.assigned_to){
      assignedToUser = await user.getUserInfo(token, inputs.assigned_to)
    } else {
      assignedToUser = 'N/A'
    }

    console.log('inputs: ')
    console.log(inputs)
    let isCallerSlackUser = await user.isSlackUser(token, inputs.caller)
    console.log('isCallerSlackUser: ')
    console.log(isCallerSlackUser)

    if (isCallerSlackUser) {
      console.log('this should be a slack user')
      callerUser = await user.getUserInfo(token, inputs.caller)
      callerUser = await callerUser.name
    } else {
      callerUser = inputs.caller
    }

    //Get current state of the incident, make sure it looks nice in UI
    let state = new State()
    let curState = state.getStateFromNum(incidentResp.result.state)
    let block = new Blocks();
    const incident_number = incidentResp.result.task_effective_number
    let incidentLink = "https://" + instance + ".service-now.com/nav_to.do?uri=task.do?sysparm_query=number=" + incident_number
    
    let incidentBlock;
    //assign Block Kit blocks for a better UI experience, check if someone was assigned    
    if (!assignedToUser){
      incidentBlock = block.getBlocks(header, incidentResp.result.number, incidentResp.result.short_description,
        curState, inputs.comments, callerUser, assignedToUser, incidentLink)
    }   
    else {
      incidentBlock = block.getBlocks(header, incidentResp.result.number, incidentResp.result.short_description,
        curState, inputs.comments, callerUser, assignedToUser.name, incidentLink)
    }

    //get channel name, and blocks to channel
    let channelObj = new Channel()
    let channelInfo: any = await channelObj.getChannelInfo(token, channel)
    await channelObj.postToChannel(token, channel, incidentBlock);

    //output modal once the function finishes running
    return await {
      outputs: { ServiceNowResponse: "Please go to channel " + `#${channelInfo.name}` + " to view your newly created incident " +
      `${incidentResp.result.number}` + "."},
    };

  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
    } else {
      console.log('Unexpected error', err);
    }
  }
};

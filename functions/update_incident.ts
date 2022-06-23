import { SlackAPI } from "deno-slack-api/mod.ts";
import { Blocks } from "../utils/get_blocks.ts";
import { State } from "../utils/get_state.ts";
import { User } from "../utils/get_user_info.ts";
import { Channel } from "../utils/channel_utils.ts";
import { Auth } from "../utils/get_auth.ts";

export default async ({ token, inputs, env }: any) => {
  //Setting necessary env variables
  const instance = env["SERVICENOW_INSTANCE"];
  // Setting up helper functions
  let state = new State()
  let channelObj = new Channel()
  let user = new User();
  let block = new Blocks();
  const auth = new Auth()
  const basicAuth = await auth.getBasicAuth(env)
  //Grabbing inputs from UI, setting up Slack API
  const channel = inputs.channel;
  const incident_number = inputs.incident_number;
  const header = "🔄 Updated Incident 🔄";
  let incidentLink = "https://" + instance + ".service-now.com/nav_to.do?uri=task.do?sysparm_query=number=" + incident_number

  //API call to look up incident to grab its SysID. We need this later on for the Update API call. 
  const getIncidentResp = await fetch(
    "https://" + instance + ".service-now.com/api/now/table/incident" + "?sysparm_query=number%3D" + incident_number + "&sysparm_limit=1",
    {
      method: "GET",
      headers: {
        "Authorization": basicAuth,
        "Content-Type": "application/json",
      },
    },
  )
    .then((getIncidentResp) => getIncidentResp.json())

  console.log('getIncidentResp inside update: ')
  console.log(getIncidentResp)

  //Get sysID. This is needed for PUT API call.
  const sys_id = getIncidentResp.result[0].sys_id

  console.log('inputs: ')
  console.log(inputs, sys_id)
  let requestBody: any = {}

  //Check for optional UI inputs. 
  if (inputs.short_description) {
    requestBody.short_description = inputs.short_description
  }
  if (inputs.state) {
    requestBody.state = inputs.state
  }
  if (inputs.comments) {
    requestBody.comments = inputs.comments
  }
  if (inputs.caller) {
    requestBody.caller_id = inputs.caller
  }
  if (inputs.assigned_to) {
    requestBody.assigned_to = inputs.assigned_to
  }

  let body = await JSON.stringify(requestBody)
  console.log('body: ')
  console.log(body)
  const urlWithSysParm = "https://" + instance + ".service-now.com/api/now/table/incident/" + sys_id + '?sysparm_display_value=true'
  // const url = "https://" + instance + ".service-now.com/api/now/table/incident/" + sys_id
  const updateIncResp = await fetch(
    urlWithSysParm,
    {
      method: "PUT",
      headers: {
        "Authorization": basicAuth,
        "Content-Type": "application/json",
      },
      body: body
    },
  )
    .then((updateIncResp) => updateIncResp.json())

  console.log(updateIncResp)
  //Get current state of the incident, make sure it looks nice in UI

  // Parse UserID to feed into getUserInfo
  let assignedToID:any, callerUser: any;
  const callerInfo = await updateIncResp.result.caller_id.link.split("/");
  if (updateIncResp.result.assigned_to === "") {
    console.log('no assigned to')
  } else {
    const assignedTo = await updateIncResp.result.assigned_to.link.split("/");
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
    callerUser = await user.getUserInfo(token, inputs.caller)
    callerUser = await callerUser.name
  } else {
    callerUser = await updateIncResp.result.caller_id.display_value
  }
  console.log('callerUser: ')
  console.log(callerUser)

  // Grab userInfo to update the UI with Slack Users
  let assignedToUser;

  let incidentBlock: any[];
  incidentBlock = [];

  if (assignedToID) {
    console.log(assignedToUser)
    assignedToUser = await user.getUserInfo(token, assignedToID)

  } else {
    assignedToUser = 'N/A'
  }

  let curState = state.getStateFromString(updateIncResp.result.state)

  //assign Block Kit blocks for a better UI experience, check if someone was assigned    
  if (!assignedToID) {
    incidentBlock = block.getBlocks(header, updateIncResp.result.number, updateIncResp.result.short_description,
      curState, updateIncResp.result.comments, callerUser, assignedToUser, incidentLink, incidentBlock)
  }
  else {
    incidentBlock = block.getBlocks(header, updateIncResp.result.number, updateIncResp.result.short_description,
      curState, updateIncResp.result.comments, callerUser, assignedToUser.name, incidentLink, incidentBlock)
  }
  let channelInfo: any = await channelObj.getChannelInfo(token, channel)
  await channelObj.postToChannel(token, channel, incidentBlock);

  return await {
    outputs: { ServiceNowResponse: `Please go to channel ` + `#${channelInfo.name}` + ` to view information about ${updateIncResp.result.number}.` },
  };
};

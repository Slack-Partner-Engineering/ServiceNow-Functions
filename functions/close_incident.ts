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
  //Setup Auth, can use either basic auth (easy, but not recommended for production purposes)
  //Setup Auth with Access Token. Must take a few steps to get ServiceNow access token. Steps provided in README.md
  // const bearerToken = "Bearer " + accessToken
  //ServiceNow Integer 7 maps out to "Closed"
  const closeState = "7";

  const header = ":negative_squared_cross_mark: Incident Closed :negative_squared_cross_mark:";
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


  let requestBody = await JSON.stringify({
    "close_code": inputs.close_code,
    "state": closeState,
    "close_notes": inputs.close_notes,
  })

  console.log('requestBody: ')
  console.log(requestBody)

  // const urlWithSysParm = "https://" + instance + ".service-now.com/api/now/table/incident/" + sys_id + '?sysparm_display_value=true'
  const url = "https://" + instance + ".service-now.com/api/now/table/incident/" + sys_id
  const updateIncResp = await fetch(
    url,
    {
      method: "PUT",
      headers: {
        "Authorization": basicAuth,
        "Content-Type": "application/json",
      },
      body: requestBody
    },
  )
    .then((updateIncResp) => updateIncResp.json())
  console.log(updateIncResp)


  // Parse UserID to feed into getUserInfo
  let assignedToID: any, callerUser: any;
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
    callerUser = await user.getUserInfo(token, callerID)
    callerUser = await callerUser.name
  } else {
    
    if (updateIncResp.result.caller_id.display_value) {
      console.log('geting the display_value for caller: ', updateIncResp.result.caller_id.display_value)
      callerUser = updateIncResp.result.caller_id.display_value
    } else {
      callerUser = await user.getSysUserFromServiceNow(updateIncResp.result.caller_id.value, instance, basicAuth)
    }
    // callerUser = await updateIncResp.result.caller_id.value
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
    assignedToUser = assignedToUser.name
  } else {
    assignedToUser = 'N/A'
  }

  let curState = state.getStateFromNum(closeState)
  console.log('cur state')
  console.log(curState)

  //assign Block Kit blocks for a better UI experience, check if someone was assigned    
  incidentBlock = block.getBlocks(header, getIncidentResp.result[0].number, getIncidentResp.result[0].short_description,
    curState, getIncidentResp.result[0].comments, callerUser, assignedToUser, incidentLink, incidentBlock)

  let channelInfo: any = await channelObj.getChannelInfo(token, channel)
  await channelObj.postToChannel(token, channel, incidentBlock);

  return await {
    outputs: { ServiceNowResponse: `Please go to channel ` + `#${channelInfo.name}` + ` to view information about ${getIncidentResp.result[0].number}.` },
  };
};

import { SlackAPI } from "deno-slack-api/mod.ts";
import { Blocks } from "../utils/get_blocks.ts";
import { State } from "../utils/get_state.ts";
import { User } from "../utils/get_user_info.ts";
import { Channel } from "../utils/channel_utils.ts";
import { Auth } from "../utils/get_auth.ts";

export default async ({ token, inputs, env, }: any) => {
  try {
    const instance = env["SERVICENOW_INSTANCE"];
    // Setting up helper functions
    let state = new State()
    let channelObj = new Channel()
    let user = new User();
    let block = new Blocks();
    const auth = new Auth()
    const basicAuth = await auth.getBasicAuth(env)
    // the channel to post incident info to
    const channel = inputs.channel
    const header = "Incident Info :information_source:";

    let url = "https://" + instance + ".service-now.com/api/now/table/incident?sysparm_query"


    console.log('before inputs caller')
    if (inputs.caller) {
      url = url.concat("=caller_id.user_name%3D" + inputs.caller)
    }
    if (inputs.incident_number) {
      url = url.concat("%5Enumber%3D" + inputs.incident_number)
    }     
    if (inputs.limit) {
      url = url.concat("&sysparm_limit=" + inputs.limit)
    }
    if (inputs.assignedTo) {
      url = url.concat("&sysparm_limit=" + inputs.limit)
    }
    // want to add this parameter to be able to see the work notes and comments in the UI
    url = url.concat("&sysparm_display_value=true")

    console.log('url: ')
    console.log(url)
    console.log('inputs: ')
    console.log(inputs)

    //what it's supposed to be
    //https://dev88853.service-now.com/api/now/table/incident?sysparm_query=user_name%3Dabraham.lincoln&sysparm_limit=10");
    //https://dev88853.service-now.com/api/now/table/incident?sysparm_query=user_name%3Dabraham.lincoln&sysparm_limit=3

    //mine U0368LRBZ44
    const incidentResp: any = await fetch(
      // "https://" + instance + ".service-now.com/api/now/table/incident" + "?sysparm_query=number%3D" + inputs.incident_number + "&sysparm_limit=1&sysparm_display_value=true",
      url,
      {
        method: "GET",
        headers: {
          "Authorization": basicAuth,
          "Content-Type": "application/json",
        },
      },
    )
      .then((incidentResp) => incidentResp.json())
    console.log('getResp: ')
    console.log(incidentResp)
    // Parse UserID to feed into getUserInfo
    let blocks: any[];
    blocks = [];
    console.log('typeof blocks')
    console.log(typeof blocks)
    for (let i = 0; i < incidentResp.result.length; i++) {
      let assignedToID: any, callerUser: any;
      const callerInfo = await incidentResp.result[i].caller_id.link.split("/");
      if (incidentResp.result[i].assigned_to === "") {
        console.log('no assigned to')
      } else {
        const assignedTo = await incidentResp.result[i].assigned_to.link.split("/");
        assignedToID = assignedTo[7]
      }

      let callerID = callerInfo[7]

      console.log('inputs: ')
      console.log(inputs)
      let isCallerSlackUser: boolean = await user.isSlackUser(token, callerID)
      console.log('isCallerSlackUser: ')
      console.log(isCallerSlackUser)

      if (isCallerSlackUser) {
        console.log('this should be a slack user')
        callerUser = await user.getUserInfo(token, callerID)
        callerUser = await callerUser.name
      } else {
        if (incidentResp.result[i].caller_id.display_value) {
          console.log('geting the display_value for caller: ', incidentResp.result[i].caller_id.display_value)
          callerUser = incidentResp.result[i].caller_id.display_value
        } else {
          callerUser = await user.getSysUserFromServiceNow(incidentResp.result[i].caller_id.value, instance, basicAuth)
        }
      }
      console.log('callerUser: ')
      console.log(callerUser)

      // Grab userInfo to update the UI with Slack Users
      let assignedToUser;

      if (assignedToID) {
        console.log(assignedToID)
        assignedToUser = await user.getUserInfo(token, assignedToID)

      } else {
        assignedToUser = 'N/A'
      }

      //Get current state of the incident, make sure it looks nice in UI
      let curState = state.getStateFromString(incidentResp.result[i].state)

      //set the blocks to show in the UI
      const incident_number = incidentResp.result[i].task_effective_number
      let incidentLink = "https://" + instance + ".service-now.com/nav_to.do?uri=task.do?sysparm_query=number=" + incident_number

      //assign Block Kit blocks for a better UI experience, check if someone was assigned    
      if (!assignedToID) {
        await block.getBlocks(header, incidentResp.result[i].number, incidentResp.result[i].short_description,
          curState, incidentResp.result[i].comments, callerUser, assignedToUser, incidentLink, blocks)
          await blocks

      } else {
        await block.getBlocks(header, incidentResp.result[i].number, incidentResp.result[i].short_description,
          curState, incidentResp.result[i].comments, callerUser, assignedToUser.name, incidentLink, blocks)
        await blocks
      }
    
    }

    let channelInfo: any = await channelObj.getChannelInfo(token, channel)
    await channelObj.postToChannel(token, channel, blocks);

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
//U03GLTFNLQH is kevin in homesite
//U0368LRBZ44 is horea in homesite
//U039XGZL5DW is horea in devrelsandbox
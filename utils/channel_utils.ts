import { SlackAPI } from 'deno-slack-api/mod.ts';

export class Channel {

  // This function returns the state - it converts from integer which is often returned 
  // from ServiceNow to the value which is more readable. For example - 6 means Resolved.
  async postToChannel(token: any, channel: any, incidentBlock: any) {
    console.log('postToChannel called in utils: ')

    const client = SlackAPI(token, {});

    const resp = await client.apiCall("chat.postMessage", {
      text: ``,
      channel: channel,
      blocks: incidentBlock,
    });

    return resp;
  }

  //returns channelInfo, such as channel name
  async getChannelInfo(token: any, channelID: any) {
    console.log('getChannelInfo called in utils: ')

    const client = SlackAPI(token, {});

    const channelInfoResp = await client.apiCall("conversations.info", {
      channel: channelID,
    });
    let channelInfo: any = await channelInfoResp.channel

    return channelInfo;
  }
}

    //TODO-channel-create-logic

    // let today: any = new Date();
    // let yyyy = today.getFullYear();
    // let mm = today.getMonth() + 1; // Months start at 0!
    // let dd = today.getDate();

    // if (dd < 10) dd = '0' + dd;
    // if (mm < 10) mm = '0' + mm;


    // today =  + dd + '-' + mm + '-' + yyyy;
    // console.log(today)

    //#incd-220525-5193-webapp-doses-gates-again example slack channel name

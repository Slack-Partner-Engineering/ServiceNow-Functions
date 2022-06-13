import { SlackAPI } from 'deno-slack-api/mod.ts';

export class User {

  // This function returns the state - it converts from integer which is often returned 
  // from ServiceNow to the value which is more readable. For example - 6 means Resolved.
  async getUserInfo(token:any, userID:any) {
    console.log('getUserInfo called in utils: ')
    console.log('userID: ')
    console.log(userID)

    const client = SlackAPI(token, {});

    const userInfoResp = await client.apiCall("users.info", {
      user: userID,
    });
    console.log('userInfoResp in get user info: ')
    console.log(userInfoResp)
    
    let user: any = await userInfoResp.user

    return user;
  }

  async isSlackUser(token:any, userID:any) {
    console.log('getUserInfo called in utils: ')
    console.log('userID: ')
    console.log(userID)

    const client = SlackAPI(token, {});

    const userInfoResp = await client.apiCall("users.info", {
      user: userID,
    });
    console.log('userInfoResp in get user info: ')
    console.log(userInfoResp)
    if (userInfoResp.error) {
      return false
    }
    
    return true;
  }
}

import { SlackAPI } from 'deno-slack-api/mod.ts';

export class User {

  // This function returns the state - it converts from integer which is often returned 
  // from ServiceNow to the value which is more readable. For example - 6 means Resolved.
  async getUserInfo(token:any, userID:any) {
    console.log('getUserInfo called in utils: ')
    console.log('userID: ')
    console.log(userID)
    console.log(token)

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

  async getSysUserFromServiceNow(sysUserID:any, instance: any, auth: any) {
   //API request to create a new incident in ServiceNow
   const incidentResp: any = await fetch(
    "https://" + instance + ".service-now.com/api/now/table/sys_user/" + sysUserID,
    {
      method: "GET",
      headers: {
        "Authorization": auth,
        "Content-Type": "application/json",
      },
    },
  )
    .then((incidentResp) => incidentResp.json())
  console.log('incedentResp: ')
  console.log(incidentResp)
  return incidentResp.result.name
  }
}

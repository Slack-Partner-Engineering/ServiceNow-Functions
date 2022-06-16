export class Auth {

  // This function returns the Auth string needed to Auth into ServiceNow APIs using Basic Auth.
  async getBasicAuth(env: any) {
    //needed for auth,
    const username = env["SERVICENOW_USERNAME"];
    const password = env["SERVICENOW_PW"];
    const instance = env["SERVICENOW_INSTANCE"];
    const basicAuth = await "Basic " + btoa(username + ":" + password);
    return basicAuth
  }

  // This function returns the Auth string needed to Auth into ServiceNow APIs using Bearer Auth.
  async getBearerAuth(env: any) {
    //needed for Bearer Auth
    const accessToken = env["ACCESS_TOKEN"];

    const bearerAuth = await "Bearer " + accessToken
    return bearerAuth
  }
}

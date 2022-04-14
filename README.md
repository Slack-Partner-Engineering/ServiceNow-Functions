Step 0: Clone this repo!

Step 1: Gather details from your ServiceNow developer account. First you must get a developer account here: https://developer.servicenow.com/dev.do

Step 2: Click on your Profile picture (top right), and select "Manage insance password."

![now_credentials](https://media.slack-github.com/user/2212/files/899f8480-b0d8-11ec-8434-13044b9d4ae8)

your SERVICENOW_INSTANCE is `Instance name`
your SERVICENOW_USERNAME should just be `admin` unless you or ServiceNow changed something as of March 31, 2022.
your SERVICENOW_PW should be there in your login credentials.

> If you want to run this is local mode, you will need to copy the `sample.env` file, rename it to `.env`, add your env variables, and then run `source .env` to set your variables. 

Save all those to a clipboard, since you will need to set them as env variables.

```bash
$ hermes-dev var add SERVICENOW_USERNAME [Ctrl+V] [Enter]
$ hermes-dev var add SERVICENOW_PW [Ctrl+V] [Enter]
$ hermes-dev var add SERVICENOW_INSTANCE [Ctrl+V] [Enter]
```

change this line in manifest to use your `SERVICENOW_INSTANCE`.

```
"outgoing_domains": ["dev99588.service-now.com"]
```

That's it, you're ready to deploy.

```bash
$ hermes-dev deploy
```

and then try it out!

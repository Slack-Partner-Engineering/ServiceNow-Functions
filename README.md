# 🤖 ServiceNew Functions 🤖

This project aims to speed up the time to understand & implement functions with the [beta Slack platform](https://api.slack.com/future/quickstart). It uses the beta platform to perform CRUD operations (Create, Read, Update, Delete) within Slack. 

# Steps 
1. [Clone the repo](#step-1-clone-the-repo)
2. [ServiceNow Configuration](#step-2-ServiceNow-configuration-basic-auth)
3. [Add Environmental Variables in Hermes](#step-3-add-environmental-variables-in-hermes)
4. [Deploy the App](#step-4-deploy-the-app)

## Step 1. Clone the Repo

```git clone git@slack-github.com:hporutiu/ServiceNow-Functions.git```

## Step 2. ServiceNow Configuration Basic Auth

First, we will learn Basic Auth since it is earlier. All we need is username and password. If you want to read how to use 
OAuth 2.0 to get an access token to make your API requests, find the section at the bottom.

* First, gather details from your ServiceNow developer account. First you must get a developer account here: https://developer.servicenow.com/dev.do

* Then click on your Profile picture (top right), and select "Manage insance password."

![now_credentials](https://media.slack-github.com/user/2212/files/899f8480-b0d8-11ec-8434-13044b9d4ae8)

* Your SERVICENOW_INSTANCE is `Instance name`
* Your SERVICENOW_USERNAME should just be `admin` unless you or ServiceNow changed something as of March 31, 2022.
* Your SERVICENOW_PW should be there in your login credentials.

> If you want to run this is local mode, you will need to copy the `sample.env` file, rename it to `.env`, add your env variables, and then run `source .env` to set your variables. 

Save all those to a clipboard, since you will need to set them as env variables.

## Step 3. Add Environmental Variables in Hermes
Now, we will need to add our env variables in Hermes. You will do so with the CLI. Make sure you are logged into the CLI first. If you haven't gotten the CLI installed, 
you can find the install script [here](https://api.slack.com/future/quickstart).

```bash
$ hermes-dev var add SERVICENOW_USERNAME [Ctrl+V] [Enter]
$ hermes-dev var add SERVICENOW_PW [Ctrl+V] [Enter]
$ hermes-dev var add SERVICENOW_INSTANCE [Ctrl+V] [Enter]
```

Now that we've added our env variables, we need to tell our Slack Function which domains that we will be sending requests to.
Change this line in your manifest file to use your `SERVICENOW_INSTANCE`.

```
"outgoing_domains": ["dev99588.service-now.com"]
```

## Step 4. Deploy the App

That's it, you're ready to deploy.

```bash
$ hermes-dev deploy
```

## Step 5. Run the Delete an Incident Function

[![DeleteInc](https://media.slack-github.com/user/2212/files/9eacf4d7-770c-422e-afbe-6976b51ba233)](https://media.slack-github.com/user/2212/files/d30f24ed-5aac-484d-b8fd-b47ef4764eec)


Great job! Now you should be able to find your shortcut in the shortcuts menu! Go ahead and try it out by clicking on the shortcut and filling in the form.

## 🎊 Conclusion 🎊 

Great job! You've learned how to develop your first Function with Slack's beta platform. Please file any issues you may have in this repo.

import { DefineFunction, Manifest, Schema } from "deno-slack-sdk/mod.ts";

export const GetIncident = DefineFunction({
  callback_id: "getIncident",
  title: "Find an Incident",
  description: "Get an Incident from your ServiceNow instance and post details to a channel.",
  source_file: "functions/get_incident.ts",
  input_parameters: {
    properties: {
      incident_number: {
        type: Schema.types.string,
        description: "The incident to find, for example: INC0000049",
      },
      channel: {
        type: Schema.slack.types.channel_id,
        description: "Select channel to post results in",
      },
    },
    required: ["incident_number", "channel"],
  },
  output_parameters: {
    properties: {
      ServiceNowResponse: {
        type: Schema.types.string,
        description: "",
      },
    },
    required: ["ServiceNowResponse"],
  },
});

export const UpdateIncident = DefineFunction({
  callback_id: "updateIncident",
  title: "Update an Incident",
  description: "Update an Incident from your ServiceNow instance and post details to a channel.",
  source_file: "functions/update_incident.ts",
  input_parameters: {
    properties: {
      incident_number: {
        type: Schema.types.string,
        description: "The incident to find, for example: INC0000049",
      },
      channel: {
        type: Schema.slack.types.channel_id,
        description: "Select channel to post results in",
      },
      short_description: {
        type: Schema.types.string,
        description: "the short description of the incident",
      },
      priority: {
        type: Schema.types.string,
        description: "What is the priority of the incident?",
      },
      state: {
        type: Schema.types.string,
        description: "State of incident. Closed, resolved, in progress, etc.",
      },
      comments: {
        type: Schema.types.string,
        description: "Comments for the incident",
      },
    },
    required: ["incident_number", "channel"],
  },
  output_parameters: {
    properties: {
      ServiceNowResponse: {
        type: Schema.types.string,
        description: "The API response from ServiceNow",
      },
    },
    required: ["ServiceNowResponse"],
  },
});

export const CreateIncident = DefineFunction({
  callback_id: "createIncident",
  title: "Create an Incident",
  description: "Create an Incident from your ServiceNow instance and post details to a channel.",
  source_file: "functions/create_incident.ts",
  input_parameters: {
    properties: {
      short_description: {
        type: Schema.types.string,
        description: "Short description of the incident",
      },
      state: {
        type: Schema.types.string,
        description:
          "State of the Incident. Possible values are: New, In Progress, On Hold, Resolved, Closed, Cancelled",
        default: "1",
        enum: ["1", "2", "3", "6", "7", "8"],
        choices: [{
          title: "New",
          value: "1",
        }, {
          title: "In Progress",
          value: "2",
        }, {
          title: "On Hold",
          value: "3",
        }, {
          title: "Resolved",
          value: "6",
        }, {
          title: "Closed",
          value: "7",
        }, {
          title: "Cancelled",
          value: "8",
        }],
      },
      comments: {
        type: Schema.types.string,
        description: "Comments for the incident",
      },
      assigned_to: {
        type: Schema.slack.types.user_id,
        description: "Select the user to assign this incident to. \n 🚨 If you assign someone, the state will be overwritten to In Progress 🚨",
      },
      channel: {
        type: Schema.slack.types.channel_id,
        description: "Select channel to post results in",
      },
    },
    required: ["channel", "short_description"],
  },
  output_parameters: {
    properties: {
      ServiceNowResponse: {
        type: Schema.types.string,
        description: "The API response from ServiceNow",
      },
    },
    required: ["ServiceNowResponse"],
  },
});

export default Manifest({
  name: "Horea Partner Eng",
  description: "Reverse a string",
  icon: "assets/icon.png",
  functions: [UpdateIncident, GetIncident, CreateIncident],
  outgoingDomains: ["dev88853.service-now.com"],
  botScopes: ["commands", "chat:write", "chat:write.public", "channels:read", "users:read"],
});


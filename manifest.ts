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
      caller: {
        type: Schema.types.string,
        description:
          "User who is affected by the ticket",
        default: "Abraham Lincoln",
        enum: ["abraham.lincoln", "adela.cervantsz", "aileen.mottern", "alejandra.prenatt"],
        choices: [{
          title: "Abraham Lincoln",
          value: "abraham.lincoln",
        }, {
          title: "Adela Cervantsz",
          value: "adela.cervantsz",
        }, {
          title: "Aileen Mottern",
          value: "aileen.mottern",
        }, {
          title: "Alejandra Prenatt",
          value: "alejandra.prenatt",
        }],
      },
      assigned_to: {
        type: Schema.slack.types.user_id,
        description: "User who is responisble for working on the incident",
      },
      limit: {
        type: Schema.types.string,
        description:
          "Maxiumum number of incidents to return",
        default: "3",
        enum: ["1", "3", "5", "10"],
        choices: [{
          title: "1",
          value: "1",
        }, {
          title: "3",
          value: "3",
        }, {
          title: "5",
          value: "5",
        }, {
          title: "10",
          value: "10",
        }],
      },
      channel: {
        type: Schema.slack.types.channel_id,
        description: "Select channel to post results in",
      },
    },
    required: ["channel"],
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
        description: "The incident to update, for example: INC0000049",
      },
      short_description: {
        type: Schema.types.string,
        description: "Short description of the incident",
      },
      state: {
        type: Schema.types.string,
        description:
          "State of the incident: New, In Progress, On Hold, Canceled",
        default: "1",
        enum: ["1", "2", "3", "8"],
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
          title: "Canceled",
          value: "8",
        }],
      },
      comments: {
        type: Schema.types.string,
        description: "Comments for the incident",
      },
      work_notes: {
        type: Schema.types.string,
        description: "Work notes for the incident",
      },
      assigned_to: {
        type: Schema.slack.types.user_id,
        description: "User who is responisble for working on the incident",
      },
      caller: {
        type: Schema.types.string,
        description:
          "User who is affected by the ticket",
        default: "Abraham Lincoln",
        enum: ["Abraham Lincoln", "Adela Cervantsz", "Aileen Mottern", "Alejandra Prenatt"],
        choices: [{
          title: "Abraham Lincoln",
          value: "Abraham Lincoln",
        }, {
          title: "Adela Cervantsz",
          value: "Adela Cervantsz",
        }, {
          title: "Aileen Mottern",
          value: "Aileen Mottern",
        }, {
          title: "Alejandra Prenatt",
          value: "Alejandra Prenatt",
        }],
      },
      channel: {
        type: Schema.slack.types.channel_id,
        description: "Select channel to post the update incident information in.",
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
          "State of the incident: New, In Progress, On Hold, Canceled",
        default: "1",
        enum: ["1", "2", "3", "8"],
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
          title: "Canceled",
          value: "8",
        }],
      },
      comments: {
        type: Schema.types.string,
        description: "Comments for the incident",
      },
      assigned_to: {
        type: Schema.slack.types.user_id,
        description: "User who is responisble for working on the incident",
      },
      caller: {
        type: Schema.types.string,
        description:
          "User who is affected by the ticket",
        default: "Abraham Lincoln",
        enum: ["Abraham Lincoln", "Adela Cervantsz", "Aileen Mottern", "Alejandra Prenatt"],
        choices: [{
          title: "Abraham Lincoln",
          value: "Abraham Lincoln",
        }, {
          title: "Adela Cervantsz",
          value: "Adela Cervantsz",
        }, {
          title: "Aileen Mottern",
          value: "Aileen Mottern",
        }, {
          title: "Alejandra Prenatt",
          value: "Alejandra Prenatt",
        }],
      },
      channel: {
        type: Schema.slack.types.channel_id,
        description: "Select channel to post the incident information in.",
      },
    },
    required: ["channel", "short_description", "caller", "state"],
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

export const CloseIncident = DefineFunction({
  callback_id: "closeIncident",
  title: "Close an Incident",
  description: "Close an Incident from your ServiceNow instance, with resolution code and close notes.",
  source_file: "functions/close_incident.ts",
  input_parameters: {
    properties: {
      incident_number: {
        type: Schema.types.string,
        description: "The incident to update, for example: INC0000049",
      },
      close_code: {
        type: Schema.types.string,
        description:
          "State of the incident: New, In Progress, On Hold, Canceled",
        default: "Closed/Resolved By Caller",
        enum: ["Solved (Work Around)", "Solved (Permanently)", "Solved Remotely (Work Around)", 
          "Solved Remotely (Permanently)", "Not Solved (Not Reproducible)", "Not Solved (Too Costly)", "Closed/Resolved By Caller" ],
        choices: [{
          title: "Solved (Work Around)",
          value: "Solved (Work Around)",
        }, {
          title: "Solved (Permanently)",
          value: "Solved (Permanently)",
        }, {
          title: "Solved Remotely (Work Around)",
          value: "Solved Remotely (Work Around)",
        }, {
          title: "Solved Remotely (Permanently)",
          value: "Solved Remotely (Permanently)",
        }, {
          title: "Not Solved (Not Reproducible)",
          value: "Not Solved (Not Reproducible)",
        }, {
          title: "Not Solved (Too Costly)",
          value: "Not Solved (Too Costly)",
        }, {
          title: "Closed/Resolved By Caller",
          value: "Closed/Resolved By Caller",
        }
      ],
      },
      close_notes: {
        type: Schema.types.string,
        description: "Comments for the incident",
      },
      channel: {
        type: Schema.slack.types.channel_id,
        description: "Select channel to post results in",
      },
    },
    required: ["channel", "incident_number", "close_notes", "close_code"],
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

export const ResolveIncident = DefineFunction({
  callback_id: "resolveIncident",
  title: "Resolve an Incident",
  description: "Resolve an Incident from your ServiceNow instance, with resolution code and close notes.",
  source_file: "functions/resolve_incident.ts",
  input_parameters: {
    properties: {
      incident_number: {
        type: Schema.types.string,
        description: "The incident to update, for example: INC0000049",
      },
      close_code: {
        type: Schema.types.string,
        description:
          "State of the incident: New, In Progress, On Hold, Canceled",
        default: "Closed/Resolved By Caller",
        enum: ["Solved (Work Around)", "Solved (Permanently)", "Solved Remotely (Work Around)", 
          "Solved Remotely (Permanently)", "Not Solved (Not Reproducible)", "Not Solved (Too Costly)", "Closed/Resolved By Caller" ],
        choices: [{
          title: "Solved (Work Around)",
          value: "Solved (Work Around)",
        }, {
          title: "Solved (Permanently)",
          value: "Solved (Permanently)",
        }, {
          title: "Solved Remotely (Work Around)",
          value: "Solved Remotely (Work Around)",
        }, {
          title: "Solved Remotely (Permanently)",
          value: "Solved Remotely (Permanently)",
        }, {
          title: "Not Solved (Not Reproducible)",
          value: "Not Solved (Not Reproducible)",
        }, {
          title: "Not Solved (Too Costly)",
          value: "Not Solved (Too Costly)",
        }, {
          title: "Closed/Resolved By Caller",
          value: "Closed/Resolved By Caller",
        }
      ],
      },
      close_notes: {
        type: Schema.types.string,
        description: "Resolution notes for the incident",
      },
      channel: {
        type: Schema.slack.types.channel_id,
        description: "Select channel to post results in",
      },
    },
    required: ["channel", "incident_number", "close_notes", "close_code"],
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
  name: "ServiceNow for Slack2",
  description: "Create, Update, Find, and Close ServiceNow Incidents all from Slack.",
  icon: "assets/icon.png",
  functions: [UpdateIncident, GetIncident, CreateIncident, ResolveIncident, CloseIncident],
  outgoingDomains: ["dev88853.service-now.com"],
  botScopes: ["commands", "chat:write", "chat:write.public", "channels:read", "users:read"],
});


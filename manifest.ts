import { DefineFunction, Manifest, Schema } from "deno-slack-sdk/mod.ts";

const ReverseFunction = DefineFunction({
  callback_id: "create_incident",
  title: "Create Incident",
  description: "Takes an incident description, severity, and impact, and creates it in ServiceNow.",
  source_file: "functions/create_incident.ts",
  input_parameters: {
    required: [],
    properties: {
      short_description: {
        type: "string"
      },
      urgency: {
        type: "number"
      },
      impact: {
        type: "number"
      },
    }
  },
  output_parameters: {
    required: ["ServiceNowResponse"],
    properties: {
      ServiceNowResponse: {
        type: Schema.types.string,
        description: "Details of the incident you've just created.",
      },
    },
  }  
});

export default Manifest({
  name: "ServiceNow Create Incident",
  description: "Create an incident in ServiceNow",
  icon: "assets/icon.png",
  functions: [ReverseFunction],
  outgoingDomains: ["dev99588.service-now.com"],
  botScopes: ["commands", "chat:write", "chat:write.public"],
});

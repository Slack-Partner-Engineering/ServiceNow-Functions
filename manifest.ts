export default {
  "_metadata": {
    "major_version": 2
  },
  "display_information": {
    "name": "Built By Horea Porutiu"
  },
  // Once Manifest APIs support this, we'll add it
  // "runtime_environment": "slack",
  "runtime": "deno1.19",
  "type":"hosted",
  // The CLI should still read this and update the icon, then remove if from what's sent to manifest APIs
  // We could have the deno-slack-builder make sure this file is included in the `output` path if helpful
  "icon": "assets/icon.png",
  "features": {
    "app_home": {
      "home_tab_enabled": false,
      "messages_tab_enabled": false,
      "messages_tab_read_only_enabled": false
    },
    "bot_user": {
      "display_name": "Create ServiceNow Incidentmay9"
    } 
  },
  "oauth_config": {
    "scopes": {
      "bot": [
        "commands",
        "chat:write",
        "chat:write.public"
      ]
    }
  },
  "functions": {
    "Create-An-Incident": {
      "title": "Create an incident",
      "description": "Create an incident in ServiceNow",
      "source_file": "functions/create_incident.ts",
      "input_parameters": {
        "required": [],
        "properties": {
          "short_description": {
            "type": "string"
          },
          "urgency": {
            "type": "string"
          },
          "impact": {
            "type": "string"
          },
        }
      },
      "output_parameters": {
        "required": [],
        "properties": {
          "ServiceNowResponse": {
            "type": "string"
          }
        }
      }
    },
    "Delete-An-Incident": {
      "title": "Delete an incident",
      "description": "Delete an incident in ServiceNow",
      "source_file": "functions/delete_incident.ts",
      "input_parameters": {
        "required": [],
        "properties": {
          "incident_number": {
            "type": "string"
          },
        }
      },
      "output_parameters": {
        "required": [],
        "properties": {
          "ServiceNowResponse": {
            "type": "string"
          }
        }
      }
    },
    "Get-Incidents": {
      "title": "Get all incidents",
      "description": "Get all incdients in an ServiceNow instance.",
      "source_file": "functions/get_incidents.ts",
      "input_parameters": {
        "required": [],
        "properties": {
        }
      },
      "output_parameters": {
        "required": [],
        "properties": {
          "ServiceNowResponse": {
            "type": "string"
          }
        }
      }
    },
    "Update-An-Incident": {
      "title": "Update an incident",
      "description": "Update a ServiceNow incident.",
      "source_file": "functions/update_incident.ts",
      "input_parameters": {
        "required": [],
        "properties": {
          "incident_number": {
            "type": "string"
          },
          "short_description": {
            "type": "string"
          },
          "urgency": {
            "type": "string"
          },
          "impact": {
            "type": "string"
          },
        }
      },
      "output_parameters": {
        "required": [],
        "properties": {
          "ServiceNowResponse": {
            "type": "string"
          }
        }
      }
    },
  },
  "outgoing_domains": ["dev88853.service-now.com"]
}
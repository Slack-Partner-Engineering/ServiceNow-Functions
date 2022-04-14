import {
  decode as base64Decode,
  encode as base64Encode,
} from 'https://deno.land/std@0.82.0/encoding/base64.ts';

export { base64Decode, base64Encode };

import type { FunctionHandler } from "deno-slack-sdk/types.ts";

// deno-lint-ignore no-explicit-any

export default async ({ ctx, inputs, env }: any) => {
  const username = env["SERVICENOW_USERNAME"];
  const password = env["SERVICENOW_PW"];
  const instance =  env["SERVICENOW_INSTANCE"]

  const auth = "Basic " + base64Encode(username + ":" + password);
  
  const response = await fetch(
    "https://" + instance + ".service-now.com/api/now/table/incident",
    {
      method: "POST",
      headers: {
        "Authorization": auth,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
          "short_description": inputs.short_description,
          "urgency": inputs.urgency,
          "impact": inputs.impact,
      }),
    },
  )
    .then((response) => response.json())
    .then((data) => {
      return data;
    });

    return await {
      outputs: { ServiceNowResponse: JSON.stringify(response) },
    };
};

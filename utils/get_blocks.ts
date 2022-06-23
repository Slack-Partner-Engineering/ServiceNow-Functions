export class Blocks {

  //builds the blocks to post to a channel. This is what the end user will see in Slack.

  getBlocks(header: any, number: any, shortDescription: any, curState: any, comments: any, caller: any, assignedTo: any, incidentLink: any, blocks: any) {
    console.log('getBlocks called in utils')

    console.log(caller)

    if (!comments) {
      console.log('no comments')
      comments = 'N/A'
    }
    if (!assignedTo) {
      console.log('no assignedTo')
      assignedTo = 'N/A'
    }

    blocks.push({
      "type": "header",
      "text": {
        "type": "plain_text",
        "text": header,
        "emoji": true
      }
    },
      {
        "type": "section",
        "fields": [
          {
            "type": "mrkdwn",
            "text": "*Incident:* " + "\n" + `${number}` + " :warning:"
          },
          {
            "type": "mrkdwn",
            "text": "*Short Description: *\n" + `${shortDescription}`
          }
        ]
      },
      {
        "type": "section",
        "fields": [
          {
            "type": "mrkdwn",
            "text": "*State:*\n" + `${curState}`
          },
          {
            "type": "mrkdwn",
            "text": "*Comments:*\n" + `${comments}`
          }
        ]
      },
      {
        "type": "section",
        "fields": [
          {
            "type": "mrkdwn",
            "text": "*Caller:*\n" + `${caller}`
          },
          {
            "type": "mrkdwn",
            "text": "*Assigned To:*\n" + `@${assignedTo}`
          }
        ]
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "<" + `${incidentLink}` + "|" + "View Incident" + ">"
        }
      });

    return blocks;
  }
}
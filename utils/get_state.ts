export class State {

  // This function returns the state - it converts from integer which is often returned 
  // from ServiceNow to the value which is more readable. For example - 6 means Resolved.

  //Additional Cases which may be useful later: 
  // case '6':
  //   //needs resolution notes if you choose it which will cause an error.
  //   curState = "Resolved ✅";
  //   break;
  // case '7':
  //   // if you choose this state, you must provide resolution code, close notes
  //   curState = "Closed 🆇";
  //   break;
  getStateFromNum(incidentState:any) {
    console.log('getState called in utils')
    console.log('incidentState: ')
    console.log(incidentState)
    let curState;
    switch (incidentState) {
      case '1':
        console.log('inside case 1')
        curState = "New ⚠️";
        break;
      case '2':
        console.log('inside case 2')
        curState = "In Progress 👷🏻";
        break;
      case '3':
        curState = "On Hold ✋🏼";
        break;
      case '7':
        curState = "Closed :negative_squared_cross_mark:";
        break;
      case '8':
        curState = "Cancelled ❌";
        break;
      default:
        console.log('def ********')
        curState = "New"
    }
    return curState;
  }

  getStateFromString(incidentState:any) {
    console.log('getState called in utils')
    console.log('incidentState: ')
    console.log(incidentState)
    let curState;
    switch (incidentState) {
      case 'New':
        console.log('inside case 1')
        curState = "New ⚠️";
        break;
      case 'In Progress':
        console.log('inside case 2')
        curState = "In Progress 👷🏻‍♂️";
        break;
      case 'On Hold':
        curState = "On Hold ✋🏼";
        break;
      case '8':
        curState = "Cancelled ❌";
        break;
      default:
        console.log('default case')
        curState = "New"
    }
    return curState;
  }
}

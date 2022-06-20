export class State {

  // This function returns the state - it converts from integer which is often returned 
  // from ServiceNow to the value which is more readable. For example - 6 means Resolved.

  getStateFromNum(incidentState: any) {
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
      case '6':
        curState = "Resolved ✅";
        break;
      case '7':
        curState = "Closed ❎";
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

  getStateFromString(incidentState: any) {
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
      case 'Resolved':
        console.log('inside case 2')
        curState = "Resolved ✅";
        break;
      case 'Closed':
        console.log('inside case 2')
        curState = "Closed ❎";
        break;  
      case 'On Hold':
        curState = "On Hold ✋🏼";
        break;
      case 'Canceled':
        curState = "Cancelled ❌";
        break;
      default:
        console.log('default case')
        curState = "New"
    }
    return curState;
  }
}

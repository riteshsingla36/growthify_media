import axios from "axios";
import { Inngest } from "inngest";
import { serve } from "inngest/next";

// Create a client to send and receive events
export const inngest = new Inngest({ name: "My App" });

const test = inngest.createFunction(
  { name: "Weekly digest email" }, // The name of your function, used for observability.
  { cron: "TZ=Asia/Kolkata 26 23 * * *" }, // The cron syntax for the function. TZ= is optional.

  // This function will be called on the schedule above
  async ({ step }) => {
    const res = await axios.post('/api/send_slack_message', {
        channelName: 'ritesh_kumar_emp_001',
        message: "This is an automated message send by the scheduler"
    })
    return res // You can write whatever you want here.
  }
);
  
// Create an API that hosts zero functions
export default serve(inngest, [test]);

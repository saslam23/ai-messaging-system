"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import {sendMessageAction} from "./actions/SendMessage";
Amplify.configure(outputs);


export default function App() {

const [to, setTo] = useState("");
const [body, setBody] = useState("");

const sendTheMessage = async () => {
    const result = await sendMessageAction({
      tenantId: "tenant123",
      to,
      channel: "SMS",
      body,
    });
    console.log("Queued:", result);

}

  return (
    <main>
<h1>Ai Chat Messaging System</h1>
     <>
    <div>Send Message component</div>
          <input placeholder="To" onChange={e => setTo(e.target.value)} />
          <br></br>
      <textarea placeholder="Message" onChange={e => setBody(e.target.value)} />
        <br></br>
    <button onClick={sendTheMessage}>Send Message</button>
    </>
     
    </main>
  );
}

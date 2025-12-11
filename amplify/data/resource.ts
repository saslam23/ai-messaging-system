import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { channel } from "diagnostics_channel";

/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any user authenticated via an API key can "create", "read",
"update", and "delete" any "Todo" records.
=========================================================================*/
const schema = a.schema({
  User:a.model({
    id:a.id(),
    tenantId:a.id(),
    email:a.string(),
    role:a.enum(["ADMIN","AGENT"])
  }).authorization((allow) => {
    return [allow.publicApiKey()];
  }),
  Contact: a
    .model({
      id: a.id(),
      tenantId:a.id(),
      name:a.string(),
      phone:a.string(),
      email:a.string(),
      channelPreference: a.enum(["SMS","EMAIL","WHATSAPP"]),
      groups: a.string().array(),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization((allow) => [allow.publicApiKey()]),
  Tenant: a.model({
    id:a.id(),
    name:a.string(),
    createdAt:a.datetime(),
    updatedAt: a.datetime(),
    users: a.belongsTo("User", "tenantId"), 
    contacts: a.belongsTo("Contact", "tenantId"),
    campaigns: a.belongsTo("Campaign", "tenantId"),
    messages: a.belongsTo("Message", "tenantId")
  }).authorization((allow) => {
    return [allow.publicApiKey()];
  }),
  Message: a.model({
    id:a.id(),
    tenantId:a.id(),
    to: a.string(),
    from:a.string(),
    channel: a.string(),

    body: a.string(),
    status: a.enum(["PENDING", "QUEUED", "SENT", "FAILED", "DELIVERED"]),
    createdAt: a.datetime(),
  }).authorization((allow) => {
    return [allow.publicApiKey()];
  }),
  Campaign: a.model({
    id:a.id(),
    tenantId:a.id(),
    name:a.string(),
    description:a.string(),
   status:a.enum(["DRAFT","ACTIVE", "PAUSED", "COMPLETED"]),
    createdAt:a.datetime(),
    updatedAt:a.datetime(),
  }).authorization((allow) => {
    return [allow.publicApiKey()];
  }),
  CampaignStep: a.model({
    id:a.id(),
    delayMinutes:a.integer(),
    messageTemplate: a.string(),
    channel: a.enum(["SMS","EMAIL","WHATSAPP"]),
  }).authorization((allow) => {
    return [allow.publicApiKey()];
  })
,
  OutboundQueue: a.model({
    id:a.id(),
    tenantId:a.id(),
    contactId:a.id(),
    channel:a.enum(["SMS","EMAIL","WHATSAPP"]),
    body:a.string(),
    scheduleFor:a.datetime(),
    createdAt:a.datetime(),
    processed:a.boolean(),
  }).authorization((allow) => {
     return [allow.publicApiKey()];
  }),
  WebhookLog:a.model({
    id:a.id(),
    tenantId:a.id(),
    provider:a.string(),
    eventType:a.string(),
    messageId:a.string(),
    payload:a.json(),
    receivedAt:a.datetime(),
  }).authorization((allow) => {
    return [allow.publicApiKey()];
  }),
  TenanSettings:a.model({
    id:a.id(),
    tenanId:a.id(),
    input:a.string(),
    output:a.string(),
    tone:a.string(),
    createdAt:a.datetime(),

  }).authorization((allow) => {
    return [allow.publicApiKey()];
  })
  ,

  AiMessageDraft:a.model({
    id:a.id(),
    tenantId:a.id(),
    input:a.string(),
    output:a.string(),
    tone:a.string(),
    createdAt:a.datetime(),
  }).authorization((allow) => {
    return [allow.publicApiKey()];
  })
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>

import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  /* ================================
      USER
  ==================================*/
  User: a
    .model({
      id: a.id(),
      tenantId: a.id(), // FK
      tenant: a.belongsTo("Tenant", "tenantId"),
      email: a.string(),
      role: a.enum(["ADMIN", "AGENT"]),
    })
    .authorization((allow) => [allow.publicApiKey()]),

  /* ================================
      CONTACT
  ==================================*/
  Contact: a
    .model({
      id: a.id(),
      tenantId:a.belongsTo("Tenant", "tenantId"),
 
      name: a.string(),
      phone: a.string(),
      email: a.string(),
      channelPreference: a.enum(["SMS", "EMAIL", "WHATSAPP"]),
      groups: a.string().array(),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization((allow) => [allow.publicApiKey()]),

  /* ================================
      TENANT (PARENT MODEL)
  ==================================*/
  Tenant: a
    .model({
      id: a.id(),
      name: a.string(),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),

      // Correct relationships
      users: a.hasMany("User", "tenantId"),
      contacts: a.hasMany("Contact", "tenantId"),
      campaigns: a.hasMany("Campaign", "tenantId"),
      messages: a.hasMany("Message", "tenantId"),
      outboundQueues: a.hasMany("OutboundQueue", "tenantId"),
      webhookLogs: a.hasMany("WebhookLog", "tenantId"),
      aiMessageDrafts: a.hasMany("AiMessageDraft", "tenantId"),
    })
    .authorization((allow) => [allow.publicApiKey()]),

  /* ================================
      MESSAGE
  ==================================*/
  Message: a
    .model({
      id: a.id(),
      tenantId: a.belongsTo("Tenant", "tenantId"),
      to: a.string(),
      from: a.string(),
      channel: a.string(),
      body: a.string(),
      status: a.enum(["PENDING", "QUEUED", "SENT", "FAILED", "DELIVERED"]),
      createdAt: a.datetime(),
    })
    .authorization((allow) => [allow.publicApiKey()]),

  /* ================================
      CAMPAIGN
  ==================================*/
  Campaign: a
    .model({
      id: a.id(),
      tenantId: a.belongsTo("Tenant", "tenantId"),
      name: a.string(),
      description: a.string(),
      status: a.enum(["DRAFT", "ACTIVE", "PAUSED", "COMPLETED"]),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization((allow) => [allow.publicApiKey()]),

  /* ================================
      CAMPAIGN STEP
  ==================================*/
  CampaignStep: a
    .model({
      id: a.id(),
      delayMinutes: a.integer(),
      messageTemplate: a.string(),
      channel: a.enum(["SMS", "EMAIL", "WHATSAPP"]),
    })
    .authorization((allow) => [allow.publicApiKey()]),

  /* ================================
      OUTBOUND QUEUE
  ==================================*/
  OutboundQueue: a
    .model({
      id: a.id(),
      tenantId: a.belongsTo("Tenant", "tenantId"),
      contactId: a.id(),
      channel: a.enum(["SMS", "EMAIL", "WHATSAPP"]),
      body: a.string(),
      scheduleFor: a.datetime(),
      createdAt: a.datetime(),
      processed: a.boolean(),
    })
    .authorization((allow) => [allow.publicApiKey()]),

  /* ================================
      WEBHOOK LOG
  ==================================*/
  WebhookLog: a
    .model({
      id: a.id(),
      tenantId: a.belongsTo("Tenant", "tenantId"),
      provider: a.string(),
      eventType: a.string(),
      messageId: a.string(),
      payload: a.json(),
      receivedAt: a.datetime(),
    })
    .authorization((allow) => [allow.publicApiKey()]),

  /* ================================
      TENANT SETTINGS
  ==================================*/
  TenantSettings: a
    .model({
      id: a.id(),
      tenantId:  a.belongsTo("Tenant", "tenantId"),
      input: a.string(),
      output: a.string(),
      tone: a.string(),
      createdAt: a.datetime(),
    })
    .authorization((allow) => [allow.publicApiKey()]),

  /* ================================
      AI MESSAGE DRAFT
  ==================================*/
  AiMessageDraft: a
    .model({
      id: a.id(),
      tenantId: a.belongsTo("Tenant", "tenantId"),
      input: a.string(),
      output: a.string(),
      tone: a.string(),
      createdAt: a.datetime(),
    })
    .authorization((allow) => [allow.publicApiKey()]),
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

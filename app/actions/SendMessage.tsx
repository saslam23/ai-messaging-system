"use server";
import { generateClient } from "aws-amplify/api";

const client = generateClient();

interface SendMessageInput {
  tenantId: string;
  to: string;
  channel: string;
  body: string;
}

export async function sendMessageAction({ tenantId, to, channel, body }: SendMessageInput) {
  return client.graphql({
    query: `
      mutation CreateOutboundQueueInput($tenantId: ID!, $to: String!, $channel: String!, $body: String!) {
        createOutboundQueue(
          tenantId: $tenantId, 
          to: $to,
          channel: $channel, 
          body: $body
        ) {
          id
          status
        }
      }
    `,
    variables: { tenantId, to, channel, body },
  });
}
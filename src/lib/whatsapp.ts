const GRAPH_API_VERSION = 'v20.0'

export async function sendWhatsAppMessage(
  to: string,
  message: string,
  phoneNumberId: string,
  accessToken: string
): Promise<void> {
  const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${phoneNumberId}/messages`

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body: message },
    }),
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(`WhatsApp API error ${res.status}: ${error}`)
  }
}

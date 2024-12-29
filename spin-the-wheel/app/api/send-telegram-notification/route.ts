import { NextResponse } from 'next/server'

const TELEGRAM_BOT_TOKEN = '7736818449:AAGDb6IhWiqOf3pecSnA-7wYJBuU__Vkqaw'
const TELEGRAM_CHANNEL_ID = '@withdrawsystem'

export async function POST(request: Request) {
  try {
    const { amount, type, address } = await request.json()

    const message = `New withdrawal request:
Amount: ${amount} ${type}
Address: ${address}`

    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`
    console.log('Sending request to:', url)

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHANNEL_ID,
        text: message,
      }),
    })

    const responseData = await response.json()
    console.log('Telegram API response:', responseData)

    if (!response.ok) {
      return NextResponse.json({ success: false, error: responseData.description || 'Unknown error' }, { status: response.status })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error sending Telegram notification:', error)
    return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 })
  }
}


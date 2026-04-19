import Anthropic from 'npm:@anthropic-ai/sdk'
import { createClient } from 'npm:@supabase/supabase-js'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const DAILY_LIMIT = 10

async function checkRateLimit(ip: string): Promise<boolean> {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )
  const windowStart = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

  const { data } = await supabase
    .from('ai_rate_limits')
    .select('id, calls')
    .eq('ip', ip)
    .eq('function_name', 'home-tips')
    .gte('window_start', windowStart)
    .order('window_start', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (data) {
    if (data.calls >= DAILY_LIMIT) return false
    await supabase.from('ai_rate_limits').update({ calls: data.calls + 1 }).eq('id', data.id)
  } else {
    await supabase.from('ai_rate_limits').insert({ ip, function_name: 'home-tips' })
  }
  return true
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim()
      ?? req.headers.get('x-real-ip')
      ?? 'unknown'

    const allowed = await checkRateLimit(ip)
    if (!allowed) {
      return new Response(
        JSON.stringify({ error: 'Daily limit reached. Try again tomorrow.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { type } = await req.json()

    const client = new Anthropic({ apiKey: Deno.env.get('ANTHROPIC_API_KEY') })

    const prompt = type === 'matchup'
      ? `Generate a single surprising or non-obvious Pokémon type matchup. Return ONLY valid JSON with no extra text:
{"atk":"<type>","def":"<type>","multiplier":<0|0.5|2|4>,"desc":"<one sentence flavor text>"}
Use lowercase type names (fire, water, grass, electric, ice, fighting, poison, ground, flying, psychic, bug, rock, ghost, dragon, dark, steel, fairy, normal). Pick something non-obvious that many players might not know.`
      : `Generate a single interesting Pokémon type trivia fact. Return ONLY valid JSON with no extra text:
{"fact":"<one specific, accurate, surprising sentence about type mechanics, history, or competitive strategy>"}
Make it specific and informative, not generic.`

    const msg = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 256,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = msg.content[0].type === 'text' ? msg.content[0].text : ''
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('No JSON in response')

    const parsed = JSON.parse(jsonMatch[0])

    return new Response(
      JSON.stringify(type === 'matchup' ? { matchup: parsed } : { fact: parsed.fact }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

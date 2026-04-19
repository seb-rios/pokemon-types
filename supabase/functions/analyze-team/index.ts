import Anthropic from 'npm:@anthropic-ai/sdk'
import { createClient } from 'npm:@supabase/supabase-js'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const DAILY_LIMIT = 3

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
    .eq('function_name', 'analyze-team')
    .gte('window_start', windowStart)
    .order('window_start', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (data) {
    if (data.calls >= DAILY_LIMIT) return false
    await supabase.from('ai_rate_limits').update({ calls: data.calls + 1 }).eq('id', data.id)
  } else {
    await supabase.from('ai_rate_limits').insert({ ip, function_name: 'analyze-team' })
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
        JSON.stringify({ error: 'Daily analysis limit reached. Try again tomorrow.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { team } = await req.json()

    const client = new Anthropic({ apiKey: Deno.env.get('ANTHROPIC_API_KEY') })

    const teamSummary = team.slots.map((slot: any, i: number) => ({
      slot: i + 1,
      pokemon: slot.pokemon_name,
      types: slot.pokemon_types,
      item: slot.item_name || 'none',
      moves: (slot.moves || []).map((m: any) => `${m.name} (${m.type}, ${m.category}, power: ${m.power ?? '—'})`),
      stats: slot.stats,
    }))

    const prompt = `You are a Pokémon team analyst. Analyze the following 6-Pokémon team and return a JSON object.

Team name: ${team.name}
Slots:
${JSON.stringify(teamSummary, null, 2)}

Return ONLY a valid JSON object with exactly these keys:
{
  "overall": "A 1-2 sentence overall summary of the team's strengths and weaknesses",
  "type_gaps": ["array of strings describing type coverage gaps or vulnerabilities"],
  "role_balance": { "attackers": number, "tanks": number, "support": number },
  "suggestions": [{ "slot": number, "pokemon": "name", "tip": "specific actionable tip" }],
  "synergy_notes": "A sentence about team synergy and how the Pokémon work together"
}

Be specific and concise. Focus on type coverage, stat balance, and move coverage.`

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    })

    const content = message.content[0]
    if (content.type !== 'text') throw new Error('Unexpected response type')

    const jsonMatch = content.text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('No JSON found in response')
    const analysis = JSON.parse(jsonMatch[0])

    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

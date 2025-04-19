// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4"

// Auth webhook fonksiyonu
// Bu fonksiyon, Supabase Auth olaylarını dinler ve kullanıcı kaydı sonrası profil oluşturma işlemini başlatır
Deno.serve(async (req) => {
  try {
    // CORS headers
    if (req.method === 'OPTIONS') {
      return new Response('ok', {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        }
      })
    }

    // Sadece POST isteklerini kabul et
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      })
    }

    // Webhook verilerini al
    const payload = await req.json()
    console.log('Auth webhook payload:', payload)

    // Sadece kullanıcı kaydı olaylarını işle
    if (payload.type !== 'signup') {
      return new Response(JSON.stringify({ message: 'Event ignored' }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      })
    }

    // Kullanıcı bilgilerini al
    const { user } = payload
    if (!user || !user.id || !user.email) {
      return new Response(JSON.stringify({ error: 'Invalid user data' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      })
    }

    // Kullanıcı meta verilerinden ad ve soyad bilgilerini al
    const firstName = user.user_metadata?.first_name || ''
    const lastName = user.user_metadata?.last_name || ''

    // Supabase istemcisini oluştur
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          persistSession: false,
        }
      }
    )

    // create-user-profile fonksiyonunu çağır
    const createProfileResponse = await fetch(
      `${Deno.env.get('SUPABASE_URL')}/functions/v1/create-user-profile`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
        },
        body: JSON.stringify({
          user_id: user.id,
          first_name: firstName,
          last_name: lastName,
          email: user.email,
        }),
      }
    )

    const profileResult = await createProfileResponse.json()
    console.log('Profile creation result:', profileResult)

    // Başarılı yanıt
    return new Response(JSON.stringify({
      success: true,
      message: 'User profile creation initiated',
      data: profileResult
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    })
  } catch (error) {
    // Genel hata durumu
    console.error('Unexpected error:', error)
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    })
  }
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/auth-webhook' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/

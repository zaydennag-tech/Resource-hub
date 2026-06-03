import { supabase } from '../../../supabaseClient'

export async function POST(req) {
  const { id } = await req.json()

  await supabase
    .from('documents')
    .update({ status: 'approved' })
    .eq('id', id)

  return Response.json({ success: true })
}
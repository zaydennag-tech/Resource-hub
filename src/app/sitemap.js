import { supabase } from '../supabaseClient'

export default async function sitemap() {
  const { data: docs } = await supabase
    .from('documents')
    .select('id')

  const baseUrl = 'http://localhost:3000'

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/documents`,
      lastModified: new Date(),
    },
    ...(docs || []).map((doc) => ({
      url: `${baseUrl}/documents/${doc.id}`,
      lastModified: new Date(),
    })),
  ]
}
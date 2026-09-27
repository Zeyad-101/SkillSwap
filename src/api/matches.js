import { supabase } from '../lib/supabaseClient.js'

export async function getSuggestedMatches(userId) {
  const { data: myProfile, error: profileErr } = await supabase
    .from('profiles')
    .select('can_teach_categories, wants_to_learn_categories')
    .eq('id', userId)
    .single()

  if (profileErr) throw profileErr
  if (!myProfile) return []

  const myWants = myProfile.wants_to_learn_categories || []
  const myTeaches = myProfile.can_teach_categories || []

  if (myWants.length === 0 || myTeaches.length === 0) return []

  const { data: others, error: othersErr } = await supabase
    .from('profiles')
    .select('*')
    .neq('id', userId)

  if (othersErr) throw othersErr

  const matches = []

  for (const person of others) {
    const theirTeaches = person.can_teach_categories || []
    const theirWants = person.wants_to_learn_categories || []

    const teachesMe = theirTeaches.filter(skill => myWants.includes(skill))
    const wantsFromMe = theirWants.filter(skill => myTeaches.includes(skill))

    if (teachesMe.length > 0 && wantsFromMe.length > 0) {
      const totalSkills = myWants.length + myTeaches.length
      const matchScore = (teachesMe.length + wantsFromMe.length) / (totalSkills || 1)
      
      matches.push({
        id: `${userId}_${person.id}`,
        user_id: userId,
        matched_user_id: person.id,
        match_score: matchScore,
        match_signal: `They teach ${teachesMe.join(', ')} and want your ${wantsFromMe.join(', ')}`,
        matched_profile: person
      })
    }
  }

  return matches.sort((a, b) => b.match_score - a.match_score)
}


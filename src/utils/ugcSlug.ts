export function generateUgcSlug(profile: {
  id: number
  pseudo: string | null
  name: string | null
  surname: string | null
}): string {
  const base =
    profile.pseudo ??
    [profile.name, profile.surname].filter(Boolean).join(' ') ??
    String(profile.id)
  const slug = base
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  return `${slug}-${profile.id}`
}

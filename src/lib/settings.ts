import homeData from '../content/settings/home.json';
import aboutData from '../content/settings/about.json';
import socialData from '../content/settings/social.json';

/**
 * Setting singleton (home, about, social) dibaca langsung dari JSON via import
 * agar ikut ter-bundle saat build — aman untuk runtime Cloudflare Workers
 * (createReader Keystatic butuh fs Node yang tidak tersedia di Workers).
 * Semua getter mengembalikan default aman kalau field belum pernah diisi lewat CMS.
 */

export interface HomeSettings {
  titleActive: string;
  titleRest: string;
  description: string;
}

export interface Experience {
  role: string;
  company: string;
  url: string | null;
  period: string;
  summary: string;
}

export interface AboutSettings {
  titleActive: string;
  titleRest: string;
  description: string;
  photo: string | null;
  experiences: Experience[];
}

export interface SocialSettings {
  email: string;
  github: string | null;
  twitter: string | null;
  linkedin: string | null;
  instagram: string | null;
  youtube: string | null;
  website: string | null;
}

export async function getHomeSettings(): Promise<HomeSettings> {
  const data = homeData as Partial<HomeSettings> | undefined;
  return {
    titleActive: data?.titleActive || 'Bonagus',
    titleRest:
      data?.titleRest || 'tempat ide tumbuh, catatan berkembang, dan pengetahuan terhubung.',
    description:
      data?.description ||
      'Developer & lifelong learner. Ini adalah digital garden saya — kumpulan catatan, esai, dan eksperimen yang terus berkembang.',
  };
}

export async function getAboutSettings(): Promise<AboutSettings> {
  const data = aboutData as Partial<AboutSettings> | undefined;
  return {
    titleActive: data?.titleActive || 'Bonagus',
    titleRest: data?.titleRest || '— developer, penulis, dan tukang kebun digital.',
    description:
      data?.description ||
      'Halo! Saya Bonagus. Ini adalah personal digital garden saya — tempat ide tumbuh, catatan berkembang, dan pengetahuan saling terhubung secara organik.',
    photo: data?.photo || null,
    experiences: (data?.experiences ?? []).map((e) => ({
      role: e.role,
      company: e.company,
      url: e.url,
      period: e.period,
      summary: e.summary,
    })),
  };
}

export async function getSocialSettings(): Promise<SocialSettings> {
  const data = socialData as Partial<SocialSettings> | undefined;
  return {
    email: data?.email || 'hello@bonagus.my.id',
    github: data?.github || 'https://github.com/bonagus',
    twitter: data?.twitter || null,
    linkedin: data?.linkedin || null,
    instagram: data?.instagram || null,
    youtube: data?.youtube || null,
    website: data?.website || null,
  };
}

/**
 * Daftar link sosial yang terisi saja, siap dirender jadi ikon/list.
 */
export async function getSocialLinks(): Promise<{ label: string; href: string; key: string }[]> {
  const s = await getSocialSettings();
  const links: { label: string; href: string; key: string }[] = [];
  if (s.email) links.push({ label: 'Email', href: `mailto:${s.email}`, key: 'email' });
  if (s.github) links.push({ label: 'GitHub', href: s.github, key: 'github' });
  if (s.twitter) links.push({ label: 'X', href: s.twitter, key: 'twitter' });
  if (s.linkedin) links.push({ label: 'LinkedIn', href: s.linkedin, key: 'linkedin' });
  if (s.instagram) links.push({ label: 'Instagram', href: s.instagram, key: 'instagram' });
  if (s.youtube) links.push({ label: 'YouTube', href: s.youtube, key: 'youtube' });
  if (s.website) links.push({ label: 'Website', href: s.website, key: 'website' });
  return links;
}

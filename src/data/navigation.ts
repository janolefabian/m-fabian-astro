export type SectionId = 'about' | 'services' | 'news' | 'contact';

export type NavItem = {
  label: string;
  href: string;
  section: SectionId;
  children?: Array<{ label: string; href: string }>;
};

export const navigation: NavItem[] = [
  {
    label: 'Über mich',
    href: '/ueber-mich',
    section: 'about',
    children: [
      { label: 'Profil', href: '/ueber-mich/profil' },
      { label: 'Referenzen', href: '/ueber-mich/referenzen' },
      { label: 'Kundenfeedback', href: '/ueber-mich/kundenfeedback' },
      { label: 'Verbindungen', href: '/ueber-mich/verbindungen' },
    ],
  },
  {
    label: 'Angebote',
    href: '/angebote',
    section: 'services',
    children: [
      { label: 'Führung', href: '/angebote/fuehrung' },
      { label: 'Teamwork', href: '/angebote/teamwork' },
      { label: 'Change', href: '/angebote/change' },
      { label: 'Moderation', href: '/angebote/moderation' },
    ],
  },
  { label: 'Aktuelles', href: '/aktuelles', section: 'news' },
  { label: 'Kontakt', href: '/kontakt', section: 'contact' },
];

export const sectionColors = {
  home: '#25aca4',
  about: '#25aca4',
  services: '#b87919',
  news: '#4f9c32',
  contact: '#c9343b',
  legal: '#555b61',
} as const;

export function getActiveSection(pathname: string): SectionId | undefined {
  return navigation.find((item) =>
    item.href === '/kontakt'
      ? pathname.startsWith('/kontakt')
      : pathname === item.href || pathname.startsWith(`${item.href}/`),
  )?.section;
}

export function getSectionNavigation(section?: string) {
  return navigation.find((item) => item.section === section)?.children ?? [];
}

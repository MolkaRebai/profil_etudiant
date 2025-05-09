import type { LucideIcon } from 'lucide-react';
import { Home, User, Smile, Search, Library, AlertTriangle, MessageCircle } from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  tooltip?: string;
}

export const navigationItems: NavItem[] = [
  {
    label: 'Accueil',
    href: '/',
    icon: Home,
    tooltip: 'Accueil',
  },
  {
    label: 'Profil',
    href: '/profil',
    icon: User,
    tooltip: 'Profil Étudiant',
  },
  {
    label: 'Suivi d\'humeur',
    href: '/humeur',
    icon: Smile,
    tooltip: 'Suivi d\'humeur',
  },
  {
    label: 'Trouver un thérapeute',
    href: '/therapeute',
    icon: Search,
    tooltip: 'Trouver un thérapeute',
  },
  {
    label: 'Ressources',
    href: '/ressources',
    icon: Library,
    tooltip: 'Bibliothèque de Ressources',
  },
  {
    label: 'Urgence',
    href: '/urgence',
    icon: AlertTriangle,
    tooltip: 'Support d\'Urgence',
  },
];

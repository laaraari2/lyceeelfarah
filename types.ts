import React from 'react';

export type Language = 'ar' | 'fr';
export type UserRole = 'admin' | 'teacher' | 'student' | null;

export interface NavItem {
  id: number;
  label: string;
  href: string;
}

export interface Stat {
  id: number;
  value: string;
  label: string;
  icon: React.ReactNode;
  customIcon?: string; // Added to support uploaded icons
}

export interface EducationalLevel {
  id: number;
  title: string;
  description: string;
  subLevels: string;
  image: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface TeacherMaterial {
  id: number;
  title: string;
  className: string;
  type: 'lesson' | 'exercise';
  fileName: string;
  date: string;
  fileUrl?: string; // رابط التحميل
}

// New Sections
export interface AboutContent {
  title: string;
  description: string;
  image: string;
  ctaText: string;
}

export interface RulesContent {
  title: string;
  items: string[];
}

export interface Club {
  id: number;
  name: string;
  description: string;
  icon: string;
}

export interface LifeContent {
  title: string;
  description: string;
  image: string;
  clubs?: Club[];
}

export interface NewsItem {
  id: number;
  title: string;
  date: string;
  summary: string;
  image: string;
  videoUrl?: string; // Optional video URL
}

export interface NewsContent {
  title: string;
  items: NewsItem[];
}

export interface LessonsPageContent {
  title: string;
  description: string;
}

export interface FooterContent {
  description: string;
  linksTitle: string;
  campusesTitle: string;
  newsletterTitle: string;
  newsletterText: string;
  copyrightText: string;
}

// Editable Content Structure
export interface SiteContent {
  navItems: NavItem[];
  hero: {
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    image?: string;
  };
  stats: Stat[];
  levels: {
    sectionTitle: string;
    items: EducationalLevel[];
  };
  about: AboutContent;
  rules: RulesContent;
  life: LifeContent;
  news: NewsContent;
  lessonsPage: LessonsPageContent;
  footer: FooterContent;
}

export type MultiLangContent = Record<Language, SiteContent>;
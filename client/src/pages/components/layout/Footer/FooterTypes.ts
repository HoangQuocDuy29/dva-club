export interface ContactInfo {
  address: string;
  phone: string;
  email?: string;
}

export interface SocialLink {
  url: string;
  label: string;
  type: "admin" | "fanpage" | "instagram" | "youtube";
  icon?: React.ComponentType;
}

export interface FooterProps {
  contactInfo?: ContactInfo;
  socialLinks?: SocialLink[];
  showCopyright?: boolean;
  copyrightText?: string;
}

export interface FooterConfig {
  clubName: string;
  description: string;
  logo: string;
  theme: "dark" | "light";
}

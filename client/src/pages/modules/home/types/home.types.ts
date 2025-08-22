export interface Player {
  id: number;
  name: string;
  position: string;
  height: string;
  avatar?: string;
  address: string;
}

export interface IntroSectionProps {
  title?: string;
  subtitle?: string;
  features?: string[];
}

export interface PlayersListProps {
  players?: Player[];
  showAll?: boolean;
}

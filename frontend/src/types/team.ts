export interface TeamMember {
  id: number;
  firstName: string;
  lastName: string;
  position?: string;
  image: string;
}

export interface TeamMemberDetails {
  id: number;
  bio?: string;
  interests?: string;
  socialMedia?: {
    instagram?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
}

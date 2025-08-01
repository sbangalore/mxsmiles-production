export interface TreatmentOption {
  id: string;
  name: string;
  usPrice: number;
  mexicoPrice: number;
  savings: number;
  savingsPercent: number;
  description: string;
  icon: string;
}

export interface TeamMember {
  id: string;
  name: string;
  title: string;
  speciality: string;
  education: string;
  experience: string;
  certifications: string[];
  imageUrl: string;
}

export interface Location {
  id: string;
  name: string;
  description: string;
  distance: string;
  walkTime: string;
  airportDistance: string;
  features: string[];
  imageUrl: string;
}

export const TREATMENT_OPTIONS: TreatmentOption[] = [
  {
    id: "implants",
    name: "Dental Implants",
    usPrice: 4500,
    mexicoPrice: 1200,
    savings: 3300,
    savingsPercent: 73,
    description: "Permanent tooth replacement with titanium implants. Same-day procedures available.",
    icon: "tooth"
  },
  {
    id: "crowns",
    name: "Crowns & Bridges",
    usPrice: 1200,
    mexicoPrice: 350,
    savings: 850,
    savingsPercent: 71,
    description: "High-quality porcelain and zirconia restorations with perfect color matching.",
    icon: "crown"
  },
  {
    id: "veneers",
    name: "Porcelain Veneers",
    usPrice: 1500,
    mexicoPrice: 450,
    savings: 1050,
    savingsPercent: 70,
    description: "Transform your smile with ultra-thin, custom-made porcelain veneers.",
    icon: "smile"
  },
  {
    id: "root-canal",
    name: "Root Canal Therapy",
    usPrice: 1800,
    mexicoPrice: 400,
    savings: 1400,
    savingsPercent: 78,
    description: "Pain-free endodontic treatment using advanced rotary techniques.",
    icon: "stethoscope"
  },
  {
    id: "all-on-4",
    name: "All-on-4 Implants",
    usPrice: 25000,
    mexicoPrice: 8500,
    savings: 16500,
    savingsPercent: 66,
    description: "Full arch restoration with just 4 implants. Teeth in a day procedure.",
    icon: "tooth"
  },
  {
    id: "orthodontics",
    name: "Orthodontics",
    usPrice: 6500,
    mexicoPrice: 2800,
    savings: 3700,
    savingsPercent: 57,
    description: "Invisalign and traditional braces with flexible payment options.",
    icon: "teeth-open"
  }
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "dr-rodriguez",
    name: "Dr. Carlos Rodriguez",
    title: "Lead Implant Specialist",
    speciality: "Implantology and Oral Surgery",
    education: "DDS from University of Southern California",
    experience: "15+ years experience",
    certifications: ["Board Certified", "ADA Member", "International Congress of Oral Implantologists"],
    imageUrl: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=300&fit=crop&crop=face"
  },
  {
    id: "dr-martinez",
    name: "Dr. Ana Martinez",
    title: "Cosmetic Dentistry Director",
    speciality: "Aesthetic Dentistry and Smile Design",
    education: "DDS from UCLA",
    experience: "12+ years experience",
    certifications: ["Aesthetic Dentistry Certified", "Smile Design Specialist", "Porcelain Veneer Expert"],
    imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=300&fit=crop&crop=face"
  },
  {
    id: "dr-garcia",
    name: "Dr. Miguel Garcia",
    title: "Endodontics Specialist",
    speciality: "Root Canal Therapy and Endodontics",
    education: "DDS, MS from University of Texas",
    experience: "10+ years experience",
    certifications: ["Endodontic Board Certified", "Microscopic Endodontics", "Rotary Endodontics"],
    imageUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=300&fit=crop&crop=face"
  }
];

export const LOCATIONS: Location[] = [
  {
    id: "los-algodones",
    name: "Los Algodones",
    description: "Molar City - World's dental capital",
    distance: "Just 7 miles from Yuma, Arizona",
    walkTime: "15-minute walk from US border",
    airportDistance: "Phoenix Sky Harbor: 3 hours",
    features: ["600+ dental clinics concentrated", "World's highest concentration of dentists", "Easy border crossing", "English-speaking staff"],
    imageUrl: "https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=400&h=300&fit=crop"
  },
  {
    id: "tijuana",
    name: "Tijuana",
    description: "Advanced medical tourism hub",
    distance: "20 minutes from San Diego",
    walkTime: "Easy border crossing via CBX",
    airportDistance: "San Diego Airport: 45 minutes",
    features: ["State-of-the-art facilities", "International airport access", "Modern medical district", "Comprehensive services"],
    imageUrl: "https://images.unsplash.com/photo-1512813195386-6cf811ad3542?w=400&h=300&fit=crop"
  }
];

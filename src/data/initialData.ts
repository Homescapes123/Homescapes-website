import { Project, Service, Testimonial, ProcessStep, FAQItem, BlogPost, InstagramPost, LeaderProfile } from '../types';
import hariomSrivastavaPhoto from '../assets/images/hariom_srivastava_founder_1785395029579.jpg';

// Fallback content until the site reads from the CMS, where the owner edits these profiles.
// Only details supplied by the studio belong here: Yashdeep Singh's photograph and full biography
// are added once provided.
export const INITIAL_LEADERSHIP: LeaderProfile[] = [
  {
    id: 'leader-hariom-srivastava',
    name: 'Hariom Srivastava',
    designation: 'Founder & Director',
    shortTitle: 'Founder',
    photo: hariomSrivastavaPhoto,
    quote: 'Our philosophy at Homescapes Studio is grounded in creating spaces that resonate with soul, elegance, and effortless luxury. Every villa, penthouse, or workspace we craft reflects the unique personality of its owner while maintaining absolute architectural integrity.',
    bio: "Under Hariom Srivastava's visionary leadership, Homescapes Studio is headquartered in Indira Nagar, Sugamau, Lucknow, and has spearheaded over 40 landmark luxury residential and commercial projects across Lucknow, Delhi NCR, Mumbai, Bengaluru, Hyderabad, and Goa.",
    highlights: [
      'Pan-India Turnkey Delivery',
      'VR 3D Spatial Walkthroughs',
      'Bespoke Indian & Italian Sourcing',
      '3-Year Craftsmanship Warranty'
    ]
  },
  {
    id: 'leader-yashdeep-singh',
    name: 'Yashdeep Singh',
    designation: 'Co-Founder & Director',
    shortTitle: 'Co-Founder',
    // Role-based only; replace with his own biography once supplied.
    bio: 'As Co-Founder & Director, Yashdeep Singh leads Homescapes Studio together with founder Hariom Srivastava from the studio in Indira Nagar, Sugamau, Lucknow.'
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    name: 'The Grand Horizon Penthouse',
    category: ['Residential', 'Luxury', 'Modern', 'Living Room'],
    location: 'Worli, Mumbai',
    area: '4,800 sq.ft.',
    style: 'Modern Indian Luxury',
    budget: '₹85,00,000+',
    completionYear: '2025',
    heroImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1600&auto=format&fit=crop',
    galleryImages: [
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=1200&auto=format&fit=crop'
    ],
    beforeImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200&auto=format&fit=crop',
    afterImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200&auto=format&fit=crop',
    description: 'A masterpiece penthouse overlooking the Arabian Sea, blending hand-carved Italian marble fireplaces with custom smoked teak paneling and champagne brass accents.',
    challenge: 'Integrating full architectural home automation into concrete structural shear walls without sacrificing clean sightlines or floor-to-ceiling perimeter acoustics.',
    solution: 'Designed floating dropped timber ceilings with invisible linear acoustic diffusers and motorized hidden wall pockets for continuous floor-to-ceiling glass exposure.',
    materialsUsed: ['Italian Calacatta Marble', 'Smoked Indian Teak', 'Brushed Champagne Brass', 'Bouclé Upholstery', 'Venetian Plaster'],
    client: 'Private Tech Venture Capitalist',
    featured: true
  },
  {
    id: 'proj-2',
    name: 'Villa Solaria Estate',
    category: ['Residential', 'Luxury', 'Minimal', 'Living Room'],
    location: 'Golf Course Road, Gurgaon',
    area: '8,200 sq.ft.',
    style: 'Warm Organic Minimalism',
    budget: '₹1,40,00,000+',
    completionYear: '2024',
    heroImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop',
    galleryImages: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=1200&auto=format&fit=crop'
    ],
    beforeImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1200&auto=format&fit=crop',
    afterImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop',
    description: 'A sprawling estate sanctuary utilizing micro-cement plaster, travertine colonnades, and floor-to-ceiling pivot glass portals that blur inside and outdoor courtyard living.',
    challenge: 'Maximizing natural light penetration in deep floor-plate living zones while shielding south-facing glass from harsh summer thermal glare.',
    solution: 'Engineered custom cantilevered teak shade fins paired with automated exterior solar screens linked to local weather sensors.',
    materialsUsed: ['Navona Travertine', 'Teak Wood Shading', 'Warm Micro-cement', 'Cast Bronze Fixtures'],
    client: 'Industrialist & Enterprise Founder',
    featured: true
  },
  {
    id: 'proj-3',
    name: 'Aurum Executive Headquarters',
    category: ['Commercial', 'Office', 'Modern', 'Luxury'],
    location: 'BKC, Mumbai',
    area: '12,500 sq.ft.',
    style: 'High-End Corporate Hospitality',
    budget: '₹2,10,00,000+',
    completionYear: '2025',
    heroImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1600&auto=format&fit=crop',
    galleryImages: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1200&auto=format&fit=crop'
    ],
    beforeImage: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1200&auto=format&fit=crop',
    afterImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1600&auto=format&fit=crop',
    description: 'A landmark corporate wealth office combining boutique hotel hospitality with high-security boardrooms and sound-isolated executive suites.',
    challenge: 'Constructing STC-60 acoustic rated boardrooms without compromising frameless curved glass architecture.',
    solution: 'Pioneered double-glazed curved laminated acoustic glass assemblies with concealed perimeter dampening gaskets.',
    materialsUsed: ['Nero Marquina Marble', 'Acoustic Wool Felt', 'Fluted Walnut Wall Paneling', 'Leather Trimmed Furniture'],
    client: 'Aurum Capital India',
    featured: true
  },
  {
    id: 'proj-4',
    name: 'Atelier Culinary Studio & Kitchen',
    category: ['Residential', 'Kitchen', 'Modern', 'Minimal'],
    location: 'Indiranagar, Bengaluru',
    area: '1,200 sq.ft.',
    style: 'Sculptural Monolithic Kitchen',
    budget: '₹32,00,000',
    completionYear: '2024',
    heroImage: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1600&auto=format&fit=crop',
    galleryImages: [
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600585152220-90363fe7e115?q=80&w=1200&auto=format&fit=crop'
    ],
    beforeImage: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?q=80&w=1200&auto=format&fit=crop',
    afterImage: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1200&auto=format&fit=crop',
    description: 'A monolithic kitchen island carved from a single block of honed Arabescato marble with touch-to-open flush walnut joinery and hidden appliance bays.',
    challenge: 'Engineering a 14-foot marble island with a 4-foot floating cantilever weight overhang.',
    solution: 'Concealed an internal structural steel T-frame anchored directly into the reinforced floor slab.',
    materialsUsed: ['Arabescato Corchia Marble', 'Burma Teak Joinery', 'Gaggenau Studio Appliances', 'Patinated Bronze Hardware'],
    client: 'Celebrity Residence',
    featured: true
  },
  {
    id: 'proj-5',
    name: 'Minimalist Teak Bedroom Sanctuary',
    category: ['Residential', 'Bedroom', 'Minimal', 'Modern'],
    location: 'Jubilee Hills, Hyderabad',
    area: '1,800 sq.ft.',
    style: 'Modern Minimalist Warmth',
    budget: '₹28,00,000',
    completionYear: '2025',
    heroImage: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=1600&auto=format&fit=crop',
    galleryImages: [
      'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1200&auto=format&fit=crop'
    ],
    beforeImage: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop',
    afterImage: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=1600&auto=format&fit=crop',
    description: 'A tranquil master suite wrapped in brushed teak slats, indirect dimmable architectural light coves, and custom linen soft furnishings.',
    challenge: 'Creating total dark out sleeping acoustics without heavy thermal drapes.',
    solution: 'Custom motorized recessed acoustic shutters integrated behind white linen sheer drapery layers.',
    materialsUsed: ['Indian Teak', 'Textured Raw Linen', 'Woven Silk Rugs', 'Soft Matte Lime Wash Paint'],
    client: 'Private Collector',
    featured: false
  },
  {
    id: 'proj-6',
    name: 'Assagao Heritage Villa Renovation',
    category: ['Residential', 'Luxury', 'Modern'],
    location: 'Assagao, Goa',
    area: '6,500 sq.ft.',
    style: 'Indo-Portuguese Modern Fusion',
    budget: '₹1,85,00,000',
    completionYear: '2024',
    heroImage: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=1600&auto=format&fit=crop',
    galleryImages: [
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop'
    ],
    description: 'Restoration of a heritage Indo-Portuguese villa preserving intricate laterite stone arches and terracotta roofs while introducing ultra-sleek architectural lighting.',
    challenge: 'Preserving historical stone masonry during mechanical & electrical upgrade.',
    solution: 'Engineered sub-floor conduit routing and micro-laser cut plaster patching done by Goan heritage artisans.',
    materialsUsed: ['Kota Stone & Teak Flooring', 'Italian Marble', 'Restored Laterite Masonry', 'Architectural Light Scapes'],
    client: 'Luxury Boutique Resort Owner',
    featured: false
  }
];

export const INITIAL_SERVICES: Service[] = [
  {
    id: 'serv-1',
    title: 'Residential Interiors',
    shortDescription: 'Comprehensive interior architectural transformation for high-end villas, luxury penthouses, and private estates.',
    fullDescription: 'Our signature residential design service handles everything from initial spatial layouts to custom furniture fabrication, artwork curation, and final styling. We translate your lifestyle into a refined sanctuary.',
    iconName: 'Home',
    features: ['Custom Spatial Planning', 'Bespoke Joinery & Millwork', 'Curated Art & Antiques Selection', 'Acoustic & Lighting Design'],
    deliverables: ['Full CAD Drawings', 'Material Sample Boxes', 'Lighting Schedules', 'On-Site Quality Direction'],
    estimatedTimeline: '8 - 16 Weeks',
    startingPrice: '₹2,50,000',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'serv-2',
    title: 'Commercial Interiors',
    shortDescription: 'Elevated corporate headquarters, private wealth offices, luxury boutiques, and luxury hospitality venues.',
    fullDescription: 'We create immersive commercial environments that communicate brand prestige while optimizing ergonomic flow, acoustic privacy, and workplace employee well-being.',
    iconName: 'Building2',
    features: ['Brand Identity Spatial Integration', 'Acoustic Isolation Engineering', 'Ergonomic Workstation Layouts', 'Public & Executive Separation'],
    deliverables: ['Building Code Compliance Plans', 'Furniture Procurement Matrix', '3D Walkthrough Renders', 'Turnkey Supervision'],
    estimatedTimeline: '12 - 24 Weeks',
    startingPrice: '₹4,50,000',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'serv-3',
    title: 'Modular Kitchens',
    shortDescription: 'Ergonomic, monolithic culinary environments crafted with Italian hardware, natural stone, and concealed appliance bays.',
    fullDescription: 'State-of-the-art kitchens designed for both culinary precision and high-end entertaining. Featuring concealed storage, integrated stone sinks, and touch-automated joinery.',
    iconName: 'ChefHat',
    features: ['Concealed Appliance Garages', 'Monolithic Stone Islands', 'Custom Drawer Organizers', 'Integrated Task Lighting'],
    deliverables: ['Plumbing & Electrical schematics', 'Cabinetry Elevation Drawings', 'Stone Slab Approval Inspection'],
    estimatedTimeline: '4 - 8 Weeks',
    startingPrice: '₹1,80,000',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'serv-4',
    title: 'Living Rooms & Lounges',
    shortDescription: 'Sophisticated living spaces centered around architectural fireplaces, custom seating layouts, and bespoke light art.',
    fullDescription: 'We transform living rooms into captivating spaces ideal for both serene quiet family evenings and high-profile social receptions.',
    iconName: 'Sofa',
    features: ['Custom Modular Seating Design', 'Acoustic Wall Treatment', 'Fireplace Architectural Surrounds', 'Curated Coffee Table Styling'],
    deliverables: ['Custom Upholstery Fabrics', 'Full Moodboard Presentations', 'Acoustic Engineering Specs'],
    estimatedTimeline: '4 - 6 Weeks',
    startingPrice: '₹1,50,000',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'serv-5',
    title: 'Bedroom & Suite Design',
    shortDescription: 'Ultra-luxurious master bedrooms, walk-in dressing rooms, and ensuite spa retreats designed for deep relaxation.',
    fullDescription: 'Master retreats featuring padded upholstered headboards, integrated climate controls, motorized blackout drapery, and marble spa bath suites.',
    iconName: 'Bed',
    features: ['Bespoke Upholstered Headboards', 'Custom Walk-In Closet Systems', 'Dimmable Circadian Lighting', 'Integrated Smart Blinds'],
    deliverables: ['Closet Millwork Elevations', 'Textile Sample Selection', 'Lighting Automation Map'],
    estimatedTimeline: '4 - 8 Weeks',
    startingPrice: '₹1,60,000',
    image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'serv-6',
    title: 'Office Interiors',
    shortDescription: 'Bespoke executive home offices and private library suites crafted with acoustic timber paneling and executive desks.',
    fullDescription: 'Quiet, inspiring private work environments designed for focus, seamless videoconferencing lighting, and high-security file storage.',
    iconName: 'Briefcase',
    features: ['Acoustic Zoom Studio Backdrops', 'Custom Desk Fabrication', 'Concealed Cable Routing', 'Ergonomic Leather Seating'],
    deliverables: ['AV & Lighting Integration Map', 'Custom Desk Technical Drawings'],
    estimatedTimeline: '3 - 6 Weeks',
    startingPrice: '₹1,20,000',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'serv-7',
    title: 'Space Planning & Layout',
    shortDescription: 'Architectural circulation flow optimization, wall adjustments, and floor plate zoning before construction.',
    fullDescription: 'Master space layout planning that unlocks hidden square footage, maximizes natural daylight paths, and improves functional movement throughout your property.',
    iconName: 'LayoutGrid',
    features: ['Demolition & Partition Plans', 'Furniture Scale Mockups', 'Circulation & Sightline Mapping'],
    deliverables: ['Architectural Floor Plans', 'Flow Analysis Reports'],
    estimatedTimeline: '2 - 4 Weeks',
    startingPrice: '₹80,000',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'serv-8',
    title: '3D Visualization & VR Walkthroughs',
    shortDescription: 'Photorealistic 8K renders and virtual reality interior walkthroughs before a single nail is driven.',
    fullDescription: 'Experience your future space with complete lighting fidelity, exact material textures, and sun angle simulations before committing to construction.',
    iconName: 'Eye',
    features: ['Photorealistic 8K Static Renders', '360 Virtual Reality Tours', 'Day/Night Lighting Simulations'],
    deliverables: ['Digital Render Portfolio', 'Interactive VR Headset File'],
    estimatedTimeline: '1 - 3 Weeks',
    startingPrice: '₹50,000',
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'serv-9',
    title: 'Complete Architectural Renovation',
    shortDescription: 'Full structural gut renovations, MEP engineering upgrades, and exterior facade modernizations.',
    fullDescription: 'End-to-end renovation services converting historic properties into modern architectural gems while navigating structural permitting and historic commissions.',
    iconName: 'Hammer',
    features: ['Structural Wall Removal Permits', 'HVAC & Electrical Modernization', 'Façade Restoration'],
    deliverables: ['Permit Ready Drawings', 'General Contractor Management'],
    estimatedTimeline: '16 - 32 Weeks',
    startingPrice: '₹5,00,000',
    image: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'serv-10',
    title: 'Turnkey Project Execution',
    shortDescription: 'Complete single-point responsibility covering design, procurement, white-glove installation, and final handover.',
    fullDescription: 'We handle every detail—contractor supervision, international logistics, white-glove furniture delivery, deep cleaning, and fresh floral placement. Just turn the key.',
    iconName: 'Key',
    features: ['100% On-Site Project Management', 'White-Glove Installation Crew', 'Final Styling & Floral Curation'],
    deliverables: ['Turnkey Keys & Operations Manual', 'Warranty Booklets'],
    estimatedTimeline: 'Varies',
    startingPrice: '₹3,50,000',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1000&auto=format&fit=crop'
  }
];

export const INITIAL_TESTIMONIALS: Testimonial[] = [];

export const INITIAL_PROCESS: ProcessStep[] = [
  {
    stepNumber: 1,
    title: 'Consultation',
    description: 'An in-depth dialogue exploring your vision, lifestyle requirements, architectural aesthetic preferences, timeline, and investment range.',
    iconName: 'MessageSquare',
    duration: '1 Week',
    deliverable: 'Initial Design Brief & Feasibility Report'
  },
  {
    stepNumber: 2,
    title: 'Site Visit & Laser Measurement',
    description: 'Comprehensive 3D laser scan of your property to capture millimetric structural dimensions, daylight vectors, and MEP hookups.',
    iconName: 'Ruler',
    duration: '1 Week',
    deliverable: 'As-Built CAD Floor Plans & Architectural Survey'
  },
  {
    stepNumber: 3,
    title: 'Concept Design & Moodboard',
    description: 'Curating spatial flow layouts, material tactile swatches, lighting concepts, and initial spatial volumetric direction.',
    iconName: 'Palette',
    duration: '2 - 3 Weeks',
    deliverable: 'Bespoke Concept Book & Physical Material Tray'
  },
  {
    stepNumber: 4,
    title: '3D Visualization',
    description: 'Generating photorealistic 8K renders and interactive VR walkthroughs showing exact materials, custom joinery, and lighting.',
    iconName: 'Box',
    duration: '2 - 3 Weeks',
    deliverable: 'Photorealistic 8K Renders & 360 VR Tour File'
  },
  {
    stepNumber: 5,
    title: 'Material & Furniture Selection',
    description: 'Visiting stone yards, reviewing wood finishes, selecting custom upholstery textiles, and finalizing technical fixture schedules.',
    iconName: 'Sparkles',
    duration: '2 Weeks',
    deliverable: 'Approved Specification Book & Fixed Cost Quotation'
  },
  {
    stepNumber: 6,
    title: 'Execution & Construction',
    description: 'Site management, coordination with general contractors, structural modifications, millwork fabrication, and electrical install.',
    iconName: 'Wrench',
    duration: '6 - 20 Weeks',
    deliverable: 'Bi-Weekly Progress Reports & Quality Audits'
  },
  {
    stepNumber: 7,
    title: 'Quality Check & Snagging',
    description: 'Rigorous 150-point inspection covering paint finishes, alignment, light dimming scenes, joinery tolerances, and acoustic seals.',
    iconName: 'CheckCircle',
    duration: '1 - 2 Weeks',
    deliverable: 'Zero-Defect Sign-Off Certificate'
  },
  {
    stepNumber: 8,
    title: 'Handover & White-Glove Styling',
    description: 'Deep cleaning, art placement, custom furniture installation, fresh floral styling, and welcoming you to your new home.',
    iconName: 'Key',
    duration: '1 Day',
    deliverable: 'Turnkey Property Keys & Operations Dossier'
  }
];

export const INITIAL_FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'What is the typical budget range for a Homescapes Studio project?',
    answer: 'Our full-scope interior design services typically start at ₹2,50,000 for single high-end rooms and ₹15,00,000+ for complete luxury residences or commercial headquarters. We work on a transparent fee structure with zero hidden markups.',
    category: 'Cost'
  },
  {
    id: 'faq-2',
    question: 'How long does a complete luxury interior renovation take from start to finish?',
    answer: 'A single space or modular kitchen project takes 6 to 10 weeks, while a full penthouse or villa transformation spans 16 to 28 weeks depending on custom millwork lead times and structural permit approvals.',
    category: 'Timeline'
  },
  {
    id: 'faq-3',
    question: 'How involved do I need to be in the day-to-day design process?',
    answer: 'We offer a turnkey experience. After initial concept approval and material selection, our dedicated project manager handles contractor management, procurement, customs logistics, and installation. You can be as hands-on or hands-off as you wish.',
    category: 'Design Process'
  },
  {
    id: 'faq-4',
    question: 'What happens during the initial design consultation?',
    answer: 'During our 60-minute private consultation (in-studio or virtual), our principal director reviews your architectural floor plans, discusses lifestyle preferences, budget allocations, aesthetic tastes, and outlines a custom roadmap for your project.',
    category: 'Consultation'
  },
  {
    id: 'faq-5',
    question: 'Where do you source your materials, marble, and custom furniture?',
    answer: 'We source directly from premier stone quarries in Makrana and Rajasthan, hand-picked Italian marble importers, certified Indian teak mills, and bespoke artisan joinery workshops across India to guarantee unmatched authenticity and longevity.',
    category: 'Materials'
  },
  {
    id: 'faq-6',
    question: 'Do you offer post-completion support and craftsmanship warranties?',
    answer: 'Yes. Every project includes our 3-Year Craftsmanship Warranty covering all bespoke joinery, custom furniture, and architectural finishes, along with a dedicated concierge line for any maintenance or adjustment requests.',
    category: 'Warranty'
  },
  {
    id: 'faq-7',
    question: 'Do you provide services across all cities in India?',
    answer: 'Yes! Headquartered in Indira Nagar, Sugamau, Lucknow, with 3 years of experience and 40+ completed projects, we provide complete architectural and interior design services across India including Lucknow, Mumbai, Delhi NCR, Bengaluru, Hyderabad, Pune, and Goa.',
    category: 'Design Process'
  }
];

export const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog-1',
    title: 'The Art of Tactile Warmth: Evolving Minimalist Luxury for 2026',
    slug: 'tactile-warmth-minimalist-luxury-2026',
    excerpt: 'Discover how raw linen, honed natural stone, and indirect warm light are replacing clinical sterile white boxes in modern architectural residences.',
    content: `
# The Art of Tactile Warmth: Evolving Minimalist Luxury

For years, minimalist architecture was defined by stark white plaster walls, polished cold concrete, and aggressive right angles. While pristine, these environments often felt more like contemporary galleries than lived-in homes.

In 2026, luxury interior design has undergone a quiet revolution towards **Tactile Warmth**—an approach that maintains clean architectural lines while infusing spaces with organic texture, emotional intimacy, and sensory depth.

## 1. Honed and Leathered Stone Surfaces
Instead of high-gloss polished marble that creates harsh light reflections, top international designers are choosing **honed, brushed, or leathered stone finishes**. Stones like *Calacatta Viola*, *Navona Travertine*, and *Saint Laurent Limestone* reveal their raw mineral veins and invite gentle touch.

## 2. Integrated Circadian Lighting & Cove Glare
Light is no longer just functional; it is sculptural. By concealing warm LED strips (2200K - 2700K) inside plaster shadow gaps and wall fluting, light washes gently down surfaces like liquid gold, eliminating harsh ceiling glare points.

## 3. The Natural Material Palette
- **Smoked European Oak**: Aged timber that brings grounding weight to living areas.
- **Bouclé and Heavy Slub Linen**: Soft, touchable upholstery that balances hard stone edges.
- **Patinated Bronze**: Metal hardware that ages gracefully, acquiring a rich hand-built patina over time.

When these elements harmonize, a home becomes more than an aesthetic statement—it becomes a sanctuary for deep calm and inspired living.
    `,
    category: 'Interior Trends',
    author: {
      name: 'Hariom Srivastava',
      role: 'Founder & Principal Director',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop'
    },
    publishedDate: 'February 12, 2026',
    readTime: '5 min read',
    coverImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200&auto=format&fit=crop',
    featured: true
  },
  {
    id: 'blog-2',
    title: 'Selecting Stone Slabs: A Guide to Calacatta, Travertine & Quartzite',
    slug: 'guide-to-luxury-stone-slabs',
    excerpt: 'An insider look into selecting book-matched marble slabs directly from Italian & Makrana quarries for high-impact kitchen islands and spa bathrooms.',
    content: `
# Selecting Stone Slabs: A Comprehensive Guide

A single block of rare natural stone can serve as the artistic anchor of an entire residence. However, selecting stone requires understanding mineral hardness, porosity, and vein patterning.

## Marble vs. Quartzite vs. Travertine

### Calacatta Marble & Makrana White
Quarried in Carrara and Rajasthan, Calacatta and Makrana marbles are prized for their dramatic veining set against warm ivory backgrounds. Ideal for master bath walls and opulent dining surfaces.

### Taj Mahal Quartzite
Unlike soft marble, natural quartzite is extremely dense and resistant to acidic etching. Taj Mahal offers soft warm gold veins with the durability required for active luxury kitchens.

### Navona Travertine
Characterized by natural gas pocket cavities that can be filled or left open for organic texture, travertine brings timeless architectural warmth to modern spaces.

## Book-Matching Perfection
When two adjacent slabs cut from the same block are opened like a book, their grain patterns mirror each other seamlessly. This creates mesmerizing geometric patterns on fireplace surrounds and full-height shower walls.
    `,
    category: 'Material Guide',
    author: {
      name: 'Ananya Sharma',
      role: 'Senior Interior Architect',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop'
    },
    publishedDate: 'January 28, 2026',
    readTime: '7 min read',
    coverImage: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1200&auto=format&fit=crop',
    featured: false
  },
  {
    id: 'blog-3',
    title: 'Acoustic Elegance: How Sound Defines High-End Interior Architecture',
    slug: 'acoustic-elegance-interior-architecture',
    excerpt: 'Why high ceiling open-plan luxury homes often suffer from unpleasant echo, and how concealed acoustic engineering restores acoustic serenity.',
    content: `
# Acoustic Elegance: Sound in High-End Interiors

You can design the most visually breathtaking living room, but if conversations echo harshly like inside a concrete station, the space fails as a home.

## The Science of Acoustic Softness
Glass, marble, and hardwood flooring have high sound reflection coefficients. To balance acoustics without cluttering room design:

1. **Micro-Perforated Timber Ceiling Panels**: Teak panels with microscopic laser perforations absorb echo while maintaining the rich visual appearance of wood.
2. **Heavy Linen & Velvet Window Treatments**: Motorized double drapes serve both thermal insulation and sound dampening.
3. **Concealed Wall Felt**: Installing wool felt behind floating wall plasterboard absorbs mid-frequency speech resonance.
    `,
    category: 'Architecture',
    author: {
      name: 'Rohan Verma',
      role: 'Lighting & Acoustic Specialist',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'
    },
    publishedDate: 'January 15, 2026',
    readTime: '4 min read',
    coverImage: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1200&auto=format&fit=crop',
    featured: false
  }
];

export const INITIAL_INSTAGRAM_POSTS: InstagramPost[] = [
  {
    id: 'ig-1',
    imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800&auto=format&fit=crop',
    likes: 1842,
    comments: 64,
    caption: 'Sunlight filtering through natural linen sheer drapes at The Grand Horizon Penthouse in Worli. #HomescapesStudio #LuxuryInteriors #MumbaiPenthouse',
    link: 'https://instagram.com'
  },
  {
    id: 'ig-2',
    imageUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=800&auto=format&fit=crop',
    likes: 2150,
    comments: 92,
    caption: 'Monolithic Arabescato marble island handcrafted for our Indiranagar culinary studio in Bengaluru. #KitchenDesign #CustomJoinery #BangaloreInteriors',
    link: 'https://instagram.com'
  },
  {
    id: 'ig-3',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop',
    likes: 3410,
    comments: 118,
    caption: 'Golden hour at Villa Solaria Estate on Golf Course Road. Indoor-outdoor living redefined. #GurgaonArchitecture #ModernIndianLuxury',
    link: 'https://instagram.com'
  },
  {
    id: 'ig-4',
    imageUrl: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=800&auto=format&fit=crop',
    likes: 1420,
    comments: 38,
    caption: 'Tranquil master bedroom suite in Jubilee Hills featuring natural teak and warm circadian light coves. #HyderabadDesign #BedroomInspiration',
    link: 'https://instagram.com'
  }
];

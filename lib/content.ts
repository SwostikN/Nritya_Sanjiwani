/* ============================================================
   CONTENT — ported verbatim from nritya-sanjiwani-v2.html.
   This is the temporary source of truth. Every export here
   becomes a database table once Supabase is wired in; the
   components read from the same shapes either way.
   ============================================================ */

/* ---------- shapes ---------- */
export type NavItem = [string, string];
export interface SiteInfo { email:string; phone:string; minAge:string; crisis:string; social:Record<string,string> }
export interface MethodItem   { n:string; deva:string; title:string; img:string; alt:string; body:string }
export interface StatItem     { f:string; l:string }
export interface PhaseItem    { tag:string; title:string; deva:string; img:string; alt:string; body:string }
export interface PartnerType  { title:string; body:string; cta:string; go:string }
export interface TakePartItem { role:string; deva:string; body:string; ask:string }
export interface Chapter      { n:string; title:string; body:string }
export interface ProgramBlock { tag:string; title:string; body:string }
export interface GalleryItem  { slot?:boolean; img?:string; cap?:string; alt?:string; r?:string }
export interface GalleryGroup { title:string; deva:string; cols:number; consent?:boolean; items:GalleryItem[] }
export interface JournalItem  { img:string; alt:string; meta:string; title:string; dek:string }
export interface SupportModel { title:string; body:string }
export interface PartnerItem  { name:string; role?:string; logo?:string; url?:string }
export interface PartnerGroup { label:string; items:PartnerItem[] }
export interface PartnersData { lede:string; note:string; groups:PartnerGroup[] }
/* No fallback list for this one: stories are never written into the
   code. They are added in the admin as each participant's signed
   consent arrives, and until then the section shows pending slots. */
export interface StoryItem    { quote:string; name?:string; role?:string; deva?:string; consent?:boolean }
export interface TimelineEvent{ when:string; where?:string; tag?:string; title:string; body:string; img?:string; alt?:string }
export interface LearnedItem  { n:string; title:string; body:string }
export interface ReflectionYear{ year:string; deva?:string; title?:string; summary?:string; stats?:StatItem[]; events?:TimelineEvent[]; learned?:LearnedItem[] }
export interface ReflectionData{ lede:string; note:string; years:ReflectionYear[] }

export const SITE: SiteInfo = {
  email:    "",              // e.g. "hello@nrityasanjiwani.org"
  phone:    "",              // e.g. "+977 ..."
  minAge:   "",              // e.g. "16"
  crisis:   "",              // local mental-health support line
  /* Empty until the real profiles are saved in the admin. There is no
     placeholder here on purpose: a blank field should make its row
     disappear, which is what the admin promises, not render a link
     that goes nowhere. */
  social: {}          // e.g. { Instagram: "https://instagram.com/..." }
};

/* ---------- image set (all verified, Wikimedia Commons) ---------- */
export const W = "https://upload.wikimedia.org/wikipedia/commons/";
export const IMG = {
  ghungroo : W+"thumb/3/3b/Kathak_Tatkar.jpg/1920px-Kathak_Tatkar.jpg",
  mudra    : W+"thumb/f/f7/Bharatnatym_Mudra_%2845%29.jpg/1920px-Bharatnatym_Mudra_%2845%29.jpg",
  mudra2   : W+"thumb/0/0d/Bharatnatym_Mudra_%2854%29.jpg/1920px-Bharatnatym_Mudra_%2854%29.jpg",
  ensemble : W+"thumb/0/0b/Kathak_dance_performance_at_the_Khajuraho_Dance_Festival_2026_003.jpg/1920px-Kathak_dance_performance_at_the_Khajuraho_Dance_Festival_2026_003.jpg",
  ensemble2: W+"thumb/0/0a/Kathak_dance_performance_at_the_Khajuraho_Dance_Festival_2026_124.jpg/1920px-Kathak_dance_performance_at_the_Khajuraho_Dance_Festival_2026_124.jpg",
  musicians: W+"0/00/Kathak_Performance.jpg",
  spin     : W+"thumb/b/b8/Kathak_Solo_Performance_%288%29.jpg/1920px-Kathak_Solo_Performance_%288%29.jpg",
  bells    : W+"thumb/8/8e/Dancing_bells_anklet_%28ghunghru%29%2C_India%2C_1800s%2C_gold_and_gilt_metal_-_Wallace_Collection_-_London%2C_UK_-_DSC06165.jpg/1920px-Dancing_bells_anklet_%28ghunghru%29%2C_India%2C_1800s%2C_gold_and_gilt_metal_-_Wallace_Collection_-_London%2C_UK_-_DSC06165.jpg",
  turn     : W+"thumb/a/ab/Kathak_Solo_Performance_%287%29.jpg/1920px-Kathak_Solo_Performance_%287%29.jpg",
  bw       : W+"thumb/7/75/Kathak_Solo_Performance_%285%29.jpg/1920px-Kathak_Solo_Performance_%285%29.jpg",
  workshop : W+"thumb/7/7f/UNESCO_Kathmandu_Dissemination_Workshop_-_Nepal_01.jpg/1920px-UNESCO_Kathmandu_Dissemination_Workshop_-_Nepal_01.jpg",
  community: W+"thumb/c/c7/Katamba_Newari_Cultural_Dance.jpg/1920px-Katamba_Newari_Cultural_Dance.jpg",
  portrait : W+"thumb/2/2c/Kathak_Solo_Performance_%2815%29.jpg/1920px-Kathak_Solo_Performance_%2815%29.jpg",
  standing : W+"thumb/e/ee/Kathak_Solo_Performance_%282%29.jpg/1920px-Kathak_Solo_Performance_%282%29.jpg"
};

/* ---------- content ---------- */
/* No Contact entry: /partner is the one door for getting in touch —
   it carries the form and the direct details, and the footer repeats
   those on every page. /contact redirects there. */
export const NAV: NavItem[] = [
  ["Our Story","story"],["Our Journey","reflection"],["The Program","program"],["Gallery","gallery"],
  ["Journal","journal"],["Partner","partner"]
];
export const FOOTER_NAV: NavItem[] = [
  ["Our Story","story"],["Our Journey","reflection"],["The Program","program"],["Gallery","gallery"],["Journal","journal"],
  ["Partner With Us","partner"],["Support","support"],["Apply","apply"]
];
export const MARQUEE: NavItem[] = [
  ["Movement","गति"],["Expression","अभिव्यक्ति"],["Connection","जोड"],["Community","समुदाय"],
  ["Storytelling","कथा"],["Access","पहुँच"],["Agency","सामर्थ्य"],["Culture","संस्कृति"]
];
export const PILLARS = ["Kathak","Somatic movement","Art","Storytelling","Professional counselling","Community"];
export const METHOD: MethodItem[] = [
  {n:"01",deva:"जोड",title:"Connect",img:IMG.ghungroo,alt:"Bare feet with ghungroo ankle bells during tatkar footwork.",
   body:"Movement, rhythm and body awareness. Learning that the body is a place you are allowed to be."},
  {n:"02",deva:"खोज",title:"Explore",img:IMG.mudra,alt:"A dancer's hands forming a mudra, face expressive.",
   body:"Emotion, story and expression. Finding what wants to be said, without needing the words for it."},
  {n:"03",deva:"सृजन",title:"Create",img:IMG.ensemble,alt:"A group of dancers performing together in formation.",
   body:"Collaboration, art and performance. Turning private experience into something shared."}
];
export const STATS: StatItem[] = [
  {f:"15–20",l:"Participants"},{f:"12–16",l:"Weeks"},{f:"3",l:"Phases"},
  {f:"1",l:"Collaborative performance"},{f:"Feb 2027",l:"Culminating performance"}
];
export const PHASES: PhaseItem[] = [
  {tag:"Phase 01",title:"Connect",deva:"जोड",img:IMG.ghungroo,alt:"Feet in ghungroo bells mid-footwork.",
   body:"Participants discover Kathak, rhythm, movement, and body awareness. The first weeks build comfort and trust before anything is asked of anyone."},
  {tag:"Phase 02",title:"Explore & Express",deva:"अभिव्यक्ति",img:IMG.mudra2,alt:"A dancer expressing emotion through hand gesture and gaze.",
   body:"Kathak, somatic movement, art, storytelling and guided emotional reflection come together, with professional counsellor support throughout."},
  {tag:"Phase 03",title:"Create & Share",deva:"सृजन",img:IMG.ensemble2,alt:"An ensemble of dancers performing a collaborative work on stage.",
   body:"Participants transform their experiences into a collaborative artistic work — authored by them, performed on their terms."}
];
export const PARTNER_TYPES: PartnerType[] = [
  {title:"Community Partners",body:"NGOs, community organisations and institutions who can help us reach communities with limited access to the arts.",cta:"Partner with us",go:"partner"},
  {title:"Professional Partners",body:"Counsellors, somatic practitioners, artists, facilitators and researchers who want to contribute their practice.",cta:"Collaborate with us",go:"partner"},
  {title:"Funding Partners",body:"Individuals, companies, foundations and CSR programs supporting the delivery and sustainability of the program.",cta:"Support the program",go:"support"}
];
export const TAKE_PART: TakePartItem[] = [
  {role:"Volunteer",deva:"स्वयंसेवक",body:"Help run sessions on the ground — setup, participant support, and the ordinary work that keeps a week going.",ask:"A few hours, most weeks"},
  {role:"Facilitate",deva:"सहजकर्ता",body:"Kathak practitioners, somatic movement teachers and artists who can lead or co-lead a session.",ask:"Practice experience"},
  {role:"Counsel",deva:"परामर्श",body:"Qualified counsellors to sit inside sessions and hold the closing reflection.",ask:"Registered practitioner"},
  {role:"Document",deva:"अभिलेख",body:"Photographers, videographers and writers to record the journey with care and consent.",ask:"Portfolio welcome"},
  {role:"Host a space",deva:"स्थान",body:"A hall, courtyard or room inside a community where a cohort can meet each week.",ask:"Kathmandu Valley"}
];
export const CHAPTERS: Chapter[] = [
  {n:"01",title:"The Beginning",body:"Nritya Sanjiwani began with a simple observation: the people who most need a space to express themselves are usually the furthest from one. Studios cost money. Stages ask for training. Between the two, an entire population never gets to find out what movement could do for them."},
  {n:"02",title:"The Idea",body:"Kathak is a storytelling form before it is a technical one. Every gesture is a sentence, every rhythm a punctuation. If the form is already a language, it can carry things a person is not ready to say out loud — and that is where its use goes far beyond performance."},
  {n:"03",title:"The First Journey",body:"The account of the first cohort — where it ran, who took part, what was made, and what the participants chose to keep private."},
  {n:"04",title:"What We Learned",body:"What the first journey changed about the structure, the pacing, and the role professional counsellors play inside a room where people are moving."},
  {n:"05",title:"Where We Are Going",body:"The 2026–27 community model takes the program into partner communities across the Kathmandu Valley: twelve to sixteen weeks, three phases, and a collaborative performance authored by the participants themselves."}
];
export const PROGRAM_BLOCKS: ProgramBlock[] = [
  {tag:"Overview",title:"What the program is",body:"A twelve-to-sixteen week arts and emotional well-being program delivered inside a partner community, ending in a collaborative performance."},
  {tag:"Community",title:"Who it is for",body:"Adults and young adults from communities with limited access to performing arts and creative well-being experiences. Recruitment runs through partner organisations."},
  {tag:"Duration",title:"Rhythm of the weeks",body:"One long session each week plus a shorter practice session, held at a time and place agreed with the partner organisation."},
  {tag:"Structure",title:"Inside a session",body:"Warm-up and breath · Kathak fundamentals · somatic exploration · art or storytelling response · closing circle. Counsellor present throughout."},
  {tag:"Curriculum",title:"What is taught",body:"Tatkar and basic footwork, hasta mudras, abhinaya as emotional expression, rhythm and taal, improvisation, and ensemble composition."},
  {tag:"Counselling",title:"Counsellor integration",body:"A qualified counsellor attends sessions, holds the closing reflection, and is available privately. They are part of the room, not a referral at the end of it."},
  {tag:"Somatic",title:"Somatic activities",body:"Grounding, breath work, body scanning and paired movement — building the body awareness that makes expressive work possible and safe."},
  {tag:"Art",title:"Art & storytelling",body:"Drawing, collage, and spoken or written narrative used as a second route to expression for participants who find movement difficult on a given day."},
  {tag:"Performance",title:"The final work",body:"A collaborative piece built from the participants' own material. Participation in the performance is invited, never required."},
  {tag:"Measurement",title:"What we measure",body:"Creative confidence · self-expression · body awareness · sense of belonging · access to performing arts · participant agency. We measure the journey, not just the performance."}
];
export const GALLERY: GalleryGroup[] = [
  {title:"Movement",deva:"गति",cols:3,items:[
    {img:IMG.ghungroo,cap:"Footwork and ghungroo",alt:"Feet wearing ghungroo bells during tatkar.",r:"r-4x5"},
    {img:IMG.mudra2,cap:"Hands in mudra",alt:"A dancer's hands held in a classical mudra.",r:"r-4x5"},
    {img:IMG.turn,cap:"A turn mid-spin",alt:"A dancer captured mid-turn, skirt flaring outward.",r:"r-4x5"}
  ]},
  {title:"People",deva:"मानिस",cols:3,consent:true,items:[
    {slot:true},{slot:true},{slot:true}
  ]},
  {title:"Process",deva:"प्रक्रिया",cols:2,items:[
    {img:IMG.workshop,cap:"Art response session",alt:"People viewing artwork on easels in a community space.",r:"r-3x2"},
    {img:IMG.community,cap:"In the community",alt:"A cultural dance performed outdoors surrounded by a community audience.",r:"r-3x2"}
  ]},
  {title:"Behind the Scenes",deva:"पर्दा पछाडि",cols:2,items:[
    {img:IMG.musicians,cap:"Live accompaniment",alt:"Musicians with tabla and sarangi accompanying a dancer.",r:"r-3x2"},
    {img:IMG.spin,cap:"Before a session",alt:"A dancer rehearsing on a stage.",r:"r-3x2"}
  ]}
];
export const JOURNAL: JournalItem[] = [
  {img:IMG.bells,alt:"Antique gold ghungroo ankle bells.",meta:"Essay",title:"Why Kathak?",
   dek:"A form built on storytelling, in a program built on people needing to be heard. The overlap is not a coincidence."},
  {img:IMG.mudra,alt:"A dancer's expressive hands and face.",meta:"Essay",title:"Can dance become a language for emotion?",
   dek:"What happens when the vocabulary of abhinaya is handed to someone with no training and a great deal to say."},
  {img:IMG.community,alt:"A community gathered around an outdoor performance.",meta:"Essay",title:"What does access to art really mean?",
   dek:"Access is not a free ticket. It is proximity, permission, and the assumption that this was always for you."},
  {img:IMG.bw,alt:"A black and white photograph of a Kathak dancer.",meta:"Notebook",title:"Behind Nritya Sanjiwani",
   dek:"How the program is designed, and the decisions that shaped who it is built for."}
];
export const INTERESTS = ["Community Partnership","Counselling / Professional Collaboration","Arts Collaboration",
  "Sponsorship / Funding","Volunteering","Media / Documentation","Other"];
export const SUPPORT_ITEMS = ["Professional facilitators","Counsellors","Transportation","Learning materials",
  "Venue","Costumes and props","Documentation","Final performance","Participant support"];
export const SUPPORT_MODELS: SupportModel[] = [
  {title:"Support a Session",body:"Cover the facilitators, counsellor and space for a single week of the program."},
  {title:"Support a Participant",body:"Carry one person's full journey — transport, materials, and their place in the performance."},
  {title:"Support a Phase",body:"Underwrite one of the three phases from first session to closing circle."},
  {title:"Support the Performance",body:"Fund the venue, production and documentation of the culminating collaborative work."},
  {title:"Become a Program Partner",body:"A longer commitment across cohorts, with involvement in how the program grows."}
];


/* =============================================================
   OUR JOURNEY — the record of what has already happened.
   Newest year first; add a new object to `years` each year.

   TO FILL IN: replace every "Month 2026", every place name and
   every "—" below with what actually happened. The wording of the
   event bodies is scaffolding — it describes what to write, not
   what happened. `learned` is written and can stay as it is.
   Delete `img` from an event and the row simply runs without one.
   ============================================================= */
export const REFLECTION: ReflectionData = {
  lede:"The 2026–27 community program is not a beginning. This is the record of the sessions, "+
       "workshops and performances that came before it — what we ran, where, and what each one "+
       "changed about the way we work.",
  note:"Dates, places and partners are listed openly. Participant names, portraits and stories appear "+
       "only where signed consent was given, and are left out everywhere else, deliberately.",
  years:[
    {
      year:"2026",
      deva:"पहिलो वर्ष",
      title:"The year the shape arrived.",
      summary:"Everything in 2026 was smaller than what is planned for 2026–27: fewer people, "+
              "borrowed rooms, and a schedule that bent around everyone else’s. It was also the year "+
              "the three-phase structure stopped being an idea and became something we had watched work.",
      stats:[
        {f:"—",l:"Sessions held"},
        {f:"—",l:"Participants"},
        {f:"—",l:"Communities"},
        {f:"—",l:"Facilitators & counsellors"},
        {f:"—",l:"Shared performances"}
      ],
      events:[
        {when:"Month 2026", where:"Place, Kathmandu Valley", tag:"First session",
         title:"The first open session",
         body:"Who came, what was taught, and how the room felt by the end. The first session is the one "+
              "people always ask about — keep the small detail rather than the headline.",
         img:IMG.ghungroo, alt:"Bare feet with ghungroo bells during tatkar footwork."},
        {when:"Month 2026", where:"Hosted by a partner organisation", tag:"Workshop",
         title:"A movement and storytelling workshop",
         body:"What the workshop covered, who co-led it, and what participants made or said by the close. "+
              "Note anything that changed the plan afterwards."},
        {when:"Month 2026", where:"Place", tag:"Community",
         title:"Weekly sessions inside the community",
         body:"The stretch of weekly sessions — where they ran, how attendance held across the weeks, and "+
              "what having a counsellor in the room made possible.",
         img:IMG.community, alt:"A community gathered around an outdoor cultural performance."},
        {when:"Month 2026", where:"Place", tag:"Art & story",
         title:"The art and storytelling week",
         body:"What participants drew, wrote or told, and why a second route to expression mattered for "+
              "people who found movement difficult on a given day."},
        {when:"Month 2026", where:"Venue", tag:"Performance",
         title:"The first shared performance",
         body:"Who performed, what they chose to show, and who came to watch. Say plainly which parts were "+
              "authored by the participants and which were not.",
         img:IMG.ensemble, alt:"An ensemble of dancers performing together on stage."}
      ],
      learned:[
        {n:"01", title:"Trust is the first curriculum",
         body:"Nothing expressive happened until people were comfortable simply standing in the room. The "+
              "weeks spent on rhythm and warm-up before anything was asked of anyone were not a slow start "+
              "— they were the reason the later weeks worked at all."},
        {n:"02", title:"The counsellor belongs inside the room",
         body:"A referral at the end of a session is not the same as someone who was present for it. A "+
              "counsellor in the room from the first minute changed what participants were willing to bring, "+
              "and it is now a fixed part of the design rather than a support service attached to it."},
        {n:"03", title:"Participation has to stay invited",
         body:"Wherever performance began to feel compulsory, attendance fell. Everything that faces outward "+
              "— the stage, the camera, the written story — is now offered and never required, and the "+
              "program has to work either way."},
        {n:"04", title:"Consent is a process, not a form",
         body:"People agreed to be photographed and then changed their minds, which is their right. Consent "+
              "is now revisited at each phase, and anything without a current yes stays off this site."}
      ]
    }
  ]
};

/* =============================================================
   PARTNERS — the organisations and people who walk with us.
   Each item: name (required) · role (one short line) ·
   logo (image URL, optional) · url (optional outbound link).
   With a logo it shows the mark; without one it sets the name in
   the display face. An empty group shows a quiet invitation
   instead of an empty shelf, so the page never looks unfinished.
   ============================================================= */
export const PARTNERS: PartnersData = {
  lede:"Nritya Sanjiwani runs on borrowed rooms, donated hours and people who said yes before there was "+
       "anything to show them. This is where we say so.",
  note:"Partners are named here with their permission. Community organisations whose members took part are "+
       "listed only where the community itself agreed to be identified.",
  groups:[
    {label:"Community Partners", items:[
      {name:"Partner name", role:"Host organisation · where sessions run"},
      {name:"Partner name", role:"Recruitment and community liaison"},
      {name:"Partner name", role:"Counselling support"},
      {name:"Partner name", role:"Documentation"}
    ]},
    {label:"Professional Collaborators", items:[]},
    {label:"Supporting Partners", items:[]},
    {label:"Spaces & Hosts", items:[]}
  ]
};

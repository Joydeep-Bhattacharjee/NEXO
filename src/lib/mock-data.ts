/* Synthetic mock data for the Nexo frontend MVP. All values fictional. */

export interface Game {
  id: string;
  name: string;
  slug: string;
  cover: string; // emoji placeholder for cover art
}

export interface User {
  id: string;
  handle: string;
  displayName: string;
  avatar: string; // emoji placeholder
  bio: string;
  gameTags: string[];
  followers: number;
  following: number;
  isLive?: boolean;
}

export interface Mask {
  id: string;
  realmSlug: string;
  displayName: string;
  avatar: string;
  respect: number;
  badges: string[];
}

export interface Post {
  id: string;
  authorType: "user" | "mask";
  authorId: string;
  kind: "clip" | "text" | "announcement" | "live";
  game: string;
  body: string;
  mediaLabel?: string; // placeholder for video thumb
  views?: number;
  reactions: { gg: number; skull: number; lol: number; brain: number };
  comments: number;
  postedAt: string; // ISO 8601
}

export interface Channel {
  id: string;
  name: string;
  type: "announcement" | "featured" | "text" | "voice" | "clips";
}

export interface Server {
  id: string;
  slug: string;
  name: string;
  icon: string;
  members: number;
  online: number;
  parentSlug?: string;
  channels: Channel[];
  joined: boolean;
}

export interface Message {
  id: string;
  channelId: string;
  author: string;
  avatar: string;
  body: string;
  time: string;
  isAI?: boolean;
  isVoiceNote?: boolean;
  reactions?: string[];
}

export interface Realm {
  slug: string;
  name: string;
  game: string;
  maskCount: number;
  threadsPerDay: number;
  description: string;
}

export interface RealmThread {
  id: string;
  realmSlug: string;
  maskName: string;
  maskAvatar: string;
  maskBadge?: string;
  title: string;
  body: string;
  type: "text" | "poll" | "raid";
  respect: number;
  comments: number;
  postedAt: string;
  expiresIn?: string; // raid threads
  aiSummary?: string; // archived raid threads
}

export interface ThreadComment {
  id: string;
  maskName: string;
  maskAvatar: string;
  maskBadge?: string;
  body: string;
  respect: number;
  depth: number;
  postedAt: string;
}

export interface Stream {
  id: string;
  streamer: string;
  streamerHandle: string;
  avatar: string;
  title: string;
  game: string;
  viewers: number;
  mode: "interactive" | "broadcast";
  tags: string[];
}

export interface Notification {
  id: string;
  kind: "reaction" | "reply" | "follow" | "live" | "mod";
  text: string;
  time: string;
  unread: boolean;
}

export interface DirectMessage {
  id: string;
  with: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
}

export const GAMES: Game[] = [
  { id: "g1", name: "Clash of Clans", slug: "coc", cover: "🏰" },
  { id: "g2", name: "Free Fire", slug: "free-fire", cover: "🔥" },
  { id: "g3", name: "PUBG / BGMI", slug: "pubg", cover: "🪂" },
  { id: "g4", name: "Pokémon GO", slug: "pokemon-go", cover: "⚡" },
  { id: "g5", name: "Valorant", slug: "valorant", cover: "🎯" },
  { id: "g6", name: "Minecraft", slug: "minecraft", cover: "⛏️" },
  { id: "g7", name: "eFootball", slug: "efootball", cover: "⚽" },
  { id: "g8", name: "Call of Duty Mobile", slug: "codm", cover: "🔫" },
  { id: "g9", name: "Mobile Legends", slug: "mlbb", cover: "🗡️" },
];

export const CURRENT_USER: User = {
  id: "u0",
  handle: "shadowstriker",
  displayName: "Shadow Striker",
  avatar: "🐺",
  bio: "TH15 | Crown 34k | Chattogram. Clips daily.",
  gameTags: ["Clash of Clans", "Valorant"],
  followers: 1284,
  following: 302,
};

export const USERS: User[] = [
  CURRENT_USER,
  {
    id: "u1",
    handle: "nafisplays",
    displayName: "Nafis Plays",
    avatar: "🦊",
    bio: "Free Fire heroic every season.",
    gameTags: ["Free Fire"],
    followers: 45210,
    following: 120,
    isLive: true,
  },
  {
    id: "u2",
    handle: "riakhtar",
    displayName: "Ria Akhtar",
    avatar: "🐯",
    bio: "Valorant Immortal. Jett main, sorry.",
    gameTags: ["Valorant"],
    followers: 30125,
    following: 210,
    isLive: true,
  },
  {
    id: "u3",
    handle: "tanvirgg",
    displayName: "Tanvir GG",
    avatar: "🦁",
    bio: "BGMI conqueror grind.",
    gameTags: ["PUBG / BGMI"],
    followers: 18540,
    following: 95,
  },
  {
    id: "u4",
    handle: "pixelpri",
    displayName: "Pixel Pri",
    avatar: "🐼",
    bio: "Cozy Minecraft builds + CoC base design.",
    gameTags: ["Minecraft", "Clash of Clans"],
    followers: 9210,
    following: 340,
  },
];

export const FEED_POSTS: Post[] = [
  {
    id: "p1",
    authorType: "user",
    authorId: "u2",
    kind: "clip",
    game: "Valorant",
    body: "1v4 clutch on Ascent. Sound on for the flick 🔊",
    mediaLabel: "clip · 0:24",
    views: 12800,
    reactions: { gg: 842, skull: 120, lol: 44, brain: 67 },
    comments: 156,
    postedAt: "2026-07-07T09:12:00Z",
  },
  {
    id: "p2",
    authorType: "mask",
    authorId: "m1",
    kind: "text",
    game: "Clash of Clans",
    body: "Unpopular opinion: root riders ruined war meta and I have 2900 war stars to back it up. Change my mind.",
    reactions: { gg: 210, skull: 89, lol: 156, brain: 302 },
    comments: 244,
    postedAt: "2026-07-07T08:40:00Z",
  },
  {
    id: "p3",
    authorType: "user",
    authorId: "u1",
    kind: "live",
    game: "Free Fire",
    body: "Heroic push final stretch — come through 🔴",
    views: 3210,
    reactions: { gg: 421, skull: 12, lol: 30, brain: 8 },
    comments: 89,
    postedAt: "2026-07-07T08:15:00Z",
  },
  {
    id: "p4",
    authorType: "user",
    authorId: "u3",
    kind: "clip",
    game: "PUBG / BGMI",
    body: "Last circle 1v3, pan only. I'm not even sorry.",
    mediaLabel: "clip · 0:41",
    views: 8450,
    reactions: { gg: 610, skull: 340, lol: 280, brain: 15 },
    comments: 97,
    postedAt: "2026-07-07T07:30:00Z",
  },
  {
    id: "p5",
    authorType: "user",
    authorId: "u4",
    kind: "announcement",
    game: "Clash of Clans",
    body: "📢 King of Chittagong: war league finals tonight 9 PM. Fill the roster in #war-room.",
    reactions: { gg: 96, skull: 2, lol: 4, brain: 11 },
    comments: 23,
    postedAt: "2026-07-07T06:00:00Z",
  },
  {
    id: "p6",
    authorType: "mask",
    authorId: "m2",
    kind: "clip",
    game: "Valorant",
    body: "Posting this anonymously because my friends watch this account. Ace with Classic only.",
    mediaLabel: "clip · 0:33",
    views: 5230,
    reactions: { gg: 480, skull: 60, lol: 120, brain: 40 },
    comments: 74,
    postedAt: "2026-07-06T22:10:00Z",
  },
];

export const SERVERS: Server[] = [
  {
    id: "s1",
    slug: "clash-of-clans-bd",
    name: "Clash of Clans BD",
    icon: "🏰",
    members: 48200,
    online: 3120,
    joined: true,
    channels: [
      { id: "c1", name: "announcements", type: "announcement" },
      { id: "c2", name: "featured", type: "featured" },
      { id: "c3", name: "general", type: "text" },
      { id: "c4", name: "war-room", type: "text" },
      { id: "c5", name: "base-design", type: "text" },
      { id: "c6", name: "voice-lounge", type: "voice" },
      { id: "c7", name: "clips", type: "clips" },
    ],
  },
  {
    id: "s2",
    slug: "king-of-chittagong",
    name: "King of Chittagong",
    icon: "👑",
    members: 2140,
    online: 186,
    parentSlug: "clash-of-clans-bd",
    joined: true,
    channels: [
      { id: "c8", name: "announcements", type: "announcement" },
      { id: "c9", name: "general", type: "text" },
      { id: "c10", name: "war-room", type: "text" },
    ],
  },
  {
    id: "s3",
    slug: "coc-masters",
    name: "CoC Masters",
    icon: "🛡️",
    members: 5320,
    online: 410,
    parentSlug: "clash-of-clans-bd",
    joined: false,
    channels: [
      { id: "c11", name: "announcements", type: "announcement" },
      { id: "c12", name: "general", type: "text" },
    ],
  },
  {
    id: "s4",
    slug: "free-fire-bd",
    name: "Free Fire BD",
    icon: "🔥",
    members: 91500,
    online: 8240,
    joined: true,
    channels: [
      { id: "c13", name: "announcements", type: "announcement" },
      { id: "c14", name: "general", type: "text" },
      { id: "c15", name: "squad-finder", type: "text" },
      { id: "c16", name: "voice-1", type: "voice" },
      { id: "c17", name: "clips", type: "clips" },
    ],
  },
  {
    id: "s5",
    slug: "valorant-south-asia",
    name: "Valorant South Asia",
    icon: "🎯",
    members: 33800,
    online: 2910,
    joined: true,
    channels: [
      { id: "c18", name: "announcements", type: "announcement" },
      { id: "c19", name: "general", type: "text" },
      { id: "c20", name: "lfg", type: "text" },
      { id: "c21", name: "voice-comp", type: "voice" },
      { id: "c22", name: "clips", type: "clips" },
    ],
  },
  {
    id: "s6",
    slug: "bgmi-arena",
    name: "BGMI Arena",
    icon: "🪂",
    members: 27600,
    online: 1830,
    joined: false,
    channels: [
      { id: "c23", name: "announcements", type: "announcement" },
      { id: "c24", name: "general", type: "text" },
    ],
  },
  {
    id: "s7",
    slug: "pokemon-go-dhaka",
    name: "Pokémon GO Dhaka",
    icon: "⚡",
    members: 6400,
    online: 240,
    joined: false,
    channels: [
      { id: "c25", name: "announcements", type: "announcement" },
      { id: "c26", name: "raids", type: "text" },
    ],
  },
];

export const MESSAGES: Message[] = [
  {
    id: "msg1",
    channelId: "c3",
    author: "Pixel Pri",
    avatar: "🐼",
    body: "Anyone tested the new equipment on queen charge? Worth the ore?",
    time: "10:42",
  },
  {
    id: "msg2",
    channelId: "c3",
    author: "Tanvir GG",
    avatar: "🦁",
    body: "Yeah it's cracked at level 18+. Below that stick with invisibility vial.",
    time: "10:44",
    reactions: ["🔥", "🧠"],
  },
  {
    id: "msg3",
    channelId: "c3",
    author: "Shadow Striker",
    avatar: "🐺",
    body: "@Adda summarize last 100 messages, I just woke up",
    time: "10:51",
  },
  {
    id: "msg4",
    channelId: "c3",
    author: "Adda",
    avatar: "✨",
    body: "Summary: The chat debated queen charge equipment (consensus: worth upgrading past level 18), planned Friday's war roster (9 confirmed, need 1 more), and Pixel Pri shared a new anti-3-star base layout — pinned in #base-design.",
    time: "10:51",
    isAI: true,
  },
  {
    id: "msg5",
    channelId: "c3",
    author: "Nafis Plays",
    avatar: "🦊",
    body: "",
    time: "10:58",
    isVoiceNote: true,
  },
  {
    id: "msg6",
    channelId: "c3",
    author: "Ria Akhtar",
    avatar: "🐯",
    body: "war roster: I'm in for Friday. put me mid.",
    time: "11:02",
    reactions: ["👑"],
  },
];

export const REALMS: Realm[] = [
  {
    slug: "coc-strategy",
    name: "CoC-Strategy",
    game: "Clash of Clans",
    maskCount: 12400,
    threadsPerDay: 86,
    description: "Attack strategy, base design, war meta. No account trading.",
  },
  {
    slug: "freefire-bd",
    name: "FreeFire-BD",
    game: "Free Fire",
    maskCount: 28100,
    threadsPerDay: 214,
    description: "Bangladesh Free Fire community. Bengali + English.",
  },
  {
    slug: "valorant-rank-therapy",
    name: "Valorant-Rank-Therapy",
    game: "Valorant",
    maskCount: 9800,
    threadsPerDay: 132,
    description: "Vent about ranked. Anonymous by design, for obvious reasons.",
  },
  {
    slug: "bgmi-comp",
    name: "BGMI-Comp",
    game: "PUBG / BGMI",
    maskCount: 7600,
    threadsPerDay: 64,
    description: "Competitive scrims, rosters, and meta talk.",
  },
];

export const MY_MASKS: Mask[] = [
  {
    id: "m1",
    realmSlug: "coc-strategy",
    displayName: "CrimsonGolem_47",
    avatar: "🗿",
    respect: 620,
    badges: ["✓ 5000+ trophies"],
  },
  {
    id: "m2",
    realmSlug: "valorant-rank-therapy",
    displayName: "VoidReyna_12",
    avatar: "🌑",
    respect: 140,
    badges: [],
  },
];

export const REALM_THREADS: RealmThread[] = [
  {
    id: "t1",
    realmSlug: "coc-strategy",
    maskName: "IronBarbarian_03",
    maskAvatar: "⚔️",
    maskBadge: "✓ Legend League",
    title: "TH16 patch drops tomorrow — what to hoard tonight?",
    body: "Sneak peeks confirm ore costs rising. Dump loot into heroes now or wait for the equipment rebalance?",
    type: "raid",
    respect: 480,
    comments: 213,
    postedAt: "2026-07-07T06:30:00Z",
    expiresIn: "17h",
  },
  {
    id: "t2",
    realmSlug: "coc-strategy",
    maskName: "CrimsonGolem_47",
    maskAvatar: "🗿",
    maskBadge: "✓ 5000+ trophies",
    title: "Definitive guide: hybrid attack timing at TH14 (with replays)",
    body: "After 300 wars, here's the exact timing windows for hybrid. 1) Siege placement at 0:05...",
    type: "text",
    respect: 892,
    comments: 156,
    postedAt: "2026-07-06T18:20:00Z",
  },
  {
    id: "t3",
    realmSlug: "coc-strategy",
    maskName: "SilentWizard_88",
    maskAvatar: "🧙",
    title: "Poll: best TH15 war base style?",
    body: "Ring base vs island core vs anti-2 spread. Vote and explain.",
    type: "poll",
    respect: 210,
    comments: 88,
    postedAt: "2026-07-06T12:10:00Z",
  },
  {
    id: "t4",
    realmSlug: "coc-strategy",
    maskName: "GoldRusher_21",
    maskAvatar: "💰",
    title: "[ARCHIVED RAID] Hero equipment priority after June patch",
    body: "24h discussion, 340 comments.",
    type: "raid",
    respect: 650,
    comments: 340,
    postedAt: "2026-07-04T10:00:00Z",
    aiSummary:
      "Consensus: upgrade heroes before walls. Giant gauntlet and frozen arrow first; rocket spear only if you run lalo. Ore should never sit unspent.",
  },
  {
    id: "t5",
    realmSlug: "valorant-rank-therapy",
    maskName: "VoidReyna_12",
    maskAvatar: "🌑",
    title: "Hardstuck Diamond 3 for four acts. It's the pistol rounds, right?",
    body: "Tracked 60 games: I win 38% of pistols. That's the whole story isn't it.",
    type: "text",
    respect: 96,
    comments: 47,
    postedAt: "2026-07-07T02:45:00Z",
  },
];

export const THREAD_COMMENTS: ThreadComment[] = [
  {
    id: "tc1",
    maskName: "StoneValkyrie_09",
    maskAvatar: "🪨",
    maskBadge: "✓ Mythic III",
    body: "Hoard dark elixir, not gold. Equipment rebalance always hits DE costs last — pattern held for 3 patches straight.",
    respect: 156,
    depth: 0,
    postedAt: "2026-07-07T06:45:00Z",
  },
  {
    id: "tc2",
    maskName: "CrimsonGolem_47",
    maskAvatar: "🗿",
    maskBadge: "✓ 5000+ trophies",
    body: "Can confirm — June patch left DE untouched while ore costs went +12%.",
    respect: 89,
    depth: 1,
    postedAt: "2026-07-07T07:02:00Z",
  },
  {
    id: "tc3",
    maskName: "NightGoblin_55",
    maskAvatar: "👺",
    body: "Counterpoint: sneak peeks literally show a DE storage level. They never add storage without a cost bump.",
    respect: 61,
    depth: 2,
    postedAt: "2026-07-07T07:15:00Z",
  },
  {
    id: "tc4",
    maskName: "IronBarbarian_03",
    maskAvatar: "⚔️",
    maskBadge: "✓ Legend League",
    body: "OP here — updating the thread body with the storage leak. Keep the receipts coming.",
    respect: 44,
    depth: 0,
    postedAt: "2026-07-07T07:40:00Z",
  },
];

export const STREAMS: Stream[] = [
  {
    id: "st1",
    streamer: "Nafis Plays",
    streamerHandle: "nafisplays",
    avatar: "🦊",
    title: "Heroic push final stretch — road to Grandmaster",
    game: "Free Fire",
    viewers: 3210,
    mode: "interactive",
    tags: ["bengali", "ranked"],
  },
  {
    id: "st2",
    streamer: "Ria Akhtar",
    streamerHandle: "riakhtar",
    avatar: "🐯",
    title: "Immortal ranked + VOD reviews for viewers",
    game: "Valorant",
    viewers: 1840,
    mode: "broadcast",
    tags: ["english", "coaching"],
  },
  {
    id: "st3",
    streamer: "Dhaka Drifters",
    streamerHandle: "dhakadrifters",
    avatar: "🚗",
    title: "Community raid hour — bring your squad",
    game: "Pokémon GO",
    viewers: 420,
    mode: "broadcast",
    tags: ["bengali", "casual"],
  },
];

export const NOTIFICATIONS: Notification[] = [
  { id: "n1", kind: "reaction", text: "Ria Akhtar and 41 others reacted 🔥 to your clip", time: "12m", unread: true },
  { id: "n2", kind: "reply", text: "Tanvir GG replied: \"that pan play was criminal\"", time: "34m", unread: true },
  { id: "n3", kind: "live", text: "Nafis Plays went live: Heroic push final stretch", time: "1h", unread: true },
  { id: "n4", kind: "follow", text: "Pixel Pri started following you", time: "3h", unread: false },
  { id: "n5", kind: "mod", text: "Your report in Free Fire BD was actioned. Thanks for keeping it clean.", time: "1d", unread: false },
];

export const DMS: DirectMessage[] = [
  { id: "d1", with: "Ria Akhtar", avatar: "🐯", lastMessage: "run duos later?", time: "09:20", unread: 2 },
  { id: "d2", with: "Squad: Night Owls", avatar: "🦉", lastMessage: "Tanvir: scrim at 10", time: "08:44", unread: 0 },
  { id: "d3", with: "Pixel Pri", avatar: "🐼", lastMessage: "sent the base link 🔗", time: "Yesterday", unread: 0 },
];

export const GAME_OF_LIFE_PROMPTS: { q: string; a: string }[] = [
  { q: "One game that changed you?", a: "Clash of Clans, 2014. Still chasing that first perfect war." },
  { q: "Squad or solo?", a: "Squad. Solo queue is character development." },
  { q: "Good citizen or menace in Online World?", a: "Good citizen with menace tendencies in final circles." },
];

export function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

export function getUser(id: string): User | undefined {
  return USERS.find((u) => u.id === id);
}

export function getMask(id: string): Mask | undefined {
  return MY_MASKS.find((m) => m.id === id);
}

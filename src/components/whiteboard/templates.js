// Compact diagram DSL -> Excalidraw element skeletons.
// Nodes sit on a grid (col, row); edges bind to node ids; groups are dashed boxes
// sized around their member nodes. Feed the result to convertToExcalidrawElements().
const COL = 340;
const ROW = 140;
const W = 210;
const H = 76;
const GROUP_PAD = 36;

// Colour language: clients yellow, LB/gateway purple, services blue, caches orange,
// databases green (cylinder), queues/streams pink, external/CDN grey.
const KINDS = {
  client: { bg: "#ffec99", stroke: "#f08c00", shape: "rectangle", round: true },
  lb: { bg: "#d0bfff", stroke: "#7048e8", shape: "rectangle", round: true },
  svc: { bg: "#a5d8ff", stroke: "#1971c2", shape: "rectangle", round: true },
  cache: { bg: "#ffd8a8", stroke: "#e8590c", shape: "rectangle", round: true },
  db: { bg: "#b2f2bb", stroke: "#2f9e44", shape: "rectangle", round: false },
  queue: { bg: "#fcc2d7", stroke: "#c2255c", shape: "rectangle", round: true },
  ext: { bg: "#dee2e6", stroke: "#495057", shape: "ellipse", round: false },
};

const EDGE = "#495057";
const RED = "#e03131";
const MUTED = "#868e96";

const node = ([id, kind, label, col, row]) => {
  const k = KINDS[kind];
  const x = col * COL;
  const y = row * ROW;
  const box = {
    type: k.shape,
    id,
    x,
    y,
    width: W,
    height: H,
    backgroundColor: k.bg,
    strokeColor: k.stroke,
    fillStyle: "solid",
    strokeWidth: 2,
    roundness: k.round ? { type: 3 } : null,
    label: { text: label, fontSize: 18, strokeColor: "#1e1e1e" },
  };
  if (kind !== "db") return [box];
  // Cylinder look: bottom ellipse behind the body, top ellipse cap over it.
  const cap = { type: "ellipse", width: W, height: 26, backgroundColor: k.bg, strokeColor: k.stroke, fillStyle: "solid", strokeWidth: 2 };
  return [{ ...cap, id: `${id}-base`, x, y: y + H - 13 }, box, { ...cap, id: `${id}-cap`, x, y: y - 13 }];
};

const GAP = 4;

// Point where the centre-to-centre line leaves a node, so arrows start/end on its outline.
const outline = (n, dx, dy) => {
  const hw = W / 2;
  const hh = H / 2;
  const t = KINDS[n.kind].shape === "ellipse"
    ? 1 / Math.hypot(dx / hw, dy / hh)
    : Math.min(hw / Math.abs(dx || 1e-9), hh / Math.abs(dy || 1e-9));
  const len = Math.hypot(dx, dy);
  return { x: n.cx + dx * t + (dx / len) * GAP, y: n.cy + dy * t + (dy / len) * GAP };
};

const edge = (nodes) => ([from, to, label, opts = {}], i) => {
  const a = nodes[from];
  const b = nodes[to];
  const dx = b.cx - a.cx;
  const dy = b.cy - a.cy;
  const s = outline(a, dx, dy);
  const e = outline(b, -dx, -dy);
  const arrow = {
    type: "arrow",
    id: `e${i}-${from}-${to}`,
    x: s.x,
    y: s.y,
    width: Math.abs(e.x - s.x),
    height: Math.abs(e.y - s.y),
    points: [[0, 0], [e.x - s.x, e.y - s.y]],
    start: { id: from },
    end: { id: to },
    strokeColor: opts.color || EDGE,
    strokeWidth: 2,
    strokeStyle: opts.dashed ? "dashed" : "solid",
    endArrowhead: "arrow",
  };
  if (label) arrow.label = { text: label, fontSize: 16, strokeColor: opts.color || "#343a40" };
  return arrow;
};

const diagram = ({ nodes, edges, groups = [], notes = [] }) => {
  const pos = Object.fromEntries(nodes.map(([id, , , col, row]) => [id, { x: col * COL, y: row * ROW }]));
  const byId = Object.fromEntries(
    nodes.map(([id, kind, , col, row]) => [id, { kind, cx: col * COL + W / 2, cy: row * ROW + H / 2 }])
  );
  const boxes = groups.flatMap(([label, ids]) => {
    const xs = ids.map((id) => pos[id].x);
    const ys = ids.map((id) => pos[id].y);
    const x = Math.min(...xs) - GROUP_PAD;
    const y = Math.min(...ys) - GROUP_PAD - 34;
    return [
      {
        type: "rectangle",
        id: `group-${label}`,
        x,
        y,
        width: Math.max(...xs) + W + GROUP_PAD - x,
        height: Math.max(...ys) + H + GROUP_PAD - y,
        backgroundColor: "transparent",
        strokeColor: MUTED,
        strokeStyle: "dashed",
        strokeWidth: 2,
        roundness: { type: 3 },
      },
      { type: "text", id: `group-label-${label}`, x: x + 16, y: y + 10, text: label, fontSize: 18, strokeColor: "#495057" },
    ];
  });
  const left = Math.min(...Object.values(pos).map((p) => p.x));
  const bottom = Math.max(...Object.values(pos).map((p) => p.y)) + H;
  const footnotes = notes.map((text, i) => ({
    type: "text",
    id: `note-${i}`,
    x: left,
    y: bottom + 80 + i * 32,
    text,
    fontSize: 18,
    strokeColor: "#495057",
  }));
  // Groups first so they render behind nodes and arrows.
  return [...boxes, ...nodes.flatMap(node), ...edges.map(edge(byId)), ...footnotes];
};

export const BLANK_ID = "blank";

export const BLANK = {
  id: BLANK_ID,
  title: "Blank canvas",
  description: "An empty whiteboard. Your drawing is saved in this browser and restored on reload.",
  talkingPoints: [
    "Pick a tool from the toolbar: rectangle, ellipse, diamond, arrow, line, text or pen.",
    "Drag an arrow onto a shape to bind it, so the edge follows when you move the box.",
    "Double-click a shape to type a label inside it; double-click empty space to add free text.",
    "Ctrl/Cmd+Z undoes, Ctrl/Cmd+Shift+Z redoes; hold Space (or two fingers) to pan, pinch or Ctrl+scroll to zoom.",
    "Export PNG or SVG below when you are done. The scene is embedded so it can be re-imported later.",
  ],
  scene: [],
};

export const TEMPLATES = [
  {
    id: "url-shortener",
    title: "URL Shortener",
    description: "Read-heavy redirect service: cache hot codes in front of the DB and mint unique IDs separately.",
    talkingPoints: [
      "Reads dwarf writes, so cache hot codes in Redis in front of the database.",
      "Generate unique IDs with a counter or a key-generation service, then base62-encode them.",
      "A 301 redirect is cached by browsers (fewer hits on you); a 302 lets you count every click.",
      "Keep the API tier stateless so you can scale it horizontally behind the load balancer.",
    ],
    scene: diagram({
      nodes: [
        ["client", "client", "Client", 0, 1],
        ["lb", "lb", "Load Balancer", 1, 1],
        ["app1", "svc", "App Server", 2, 0.5],
        ["app2", "svc", "App Server", 2, 1.5],
        ["redis", "cache", "Redis cache", 3, 0],
        ["pg", "db", "Postgres", 3, 1],
        ["keygen", "svc", "Key Gen Service", 3, 2],
      ],
      edges: [
        ["client", "lb", "POST"],
        ["lb", "app1"],
        ["lb", "app2"],
        ["app1", "redis", "GET /code"],
        ["app1", "pg", "miss"],
        ["app2", "pg", "save"],
        ["app2", "keygen", "new id"],
      ],
      groups: [["API tier (stateless)", ["app1", "app2"]]],
      notes: [
        "GET /code: cache hit, else DB lookup, then 301 redirect",
        "code = base62(id); 7 chars is about 3.5 trillion URLs",
      ],
    }),
  },
  {
    id: "rate-limiter",
    title: "Rate Limiter",
    description: "Gateway-level limiter with shared counters in Redis and rules loaded from a rules service.",
    talkingPoints: [
      "Token bucket allows bursts up to the bucket size; sliding-window counters give smoother, stricter limits.",
      "Keep counters in Redis and use an atomic script (INCR plus EXPIRE, or Lua) so concurrent gateways agree.",
      "Return 429 with Retry-After and rate-limit headers so well-behaved clients can back off.",
      "Decide the failure mode up front: fail open (availability) or fail closed (protection) if Redis is down.",
      "Pull rules from a rules service and cache them locally so a rule change does not need a deploy.",
    ],
    scene: diagram({
      nodes: [
        ["clients", "client", "Clients", 0, 1],
        ["gw", "lb", "API Gateway\n(rate limit check)", 1, 1],
        ["redis", "cache", "Redis counters\ntoken bucket / window", 2, 0],
        ["backend", "svc", "Backend Services", 2, 1],
        ["rules", "svc", "Rules Service", 2, 2],
        ["rulesdb", "db", "Rules DB", 3, 2],
        ["reject", "ext", "429 Too Many\nRequests", 0, 2],
      ],
      edges: [
        ["clients", "gw", "request"],
        ["gw", "redis", "check + decrement"],
        ["gw", "backend", "allowed"],
        ["gw", "rules", "load rules (cached)"],
        ["rules", "rulesdb", "read"],
        ["gw", "reject", "over limit", { dashed: true, color: RED }],
      ],
      notes: [
        "Token bucket: refill r tokens/s up to burst b; the check-and-decrement must be atomic (Lua script)",
        "Trade-off: fail open keeps the API up if Redis dies, fail closed protects the backend",
      ],
    }),
  },
  {
    id: "news-feed",
    title: "News Feed",
    description: "Twitter-style timeline: fan-out on write for most users, fan-out on read for celebrities.",
    talkingPoints: [
      "Fan-out on write pre-builds each follower's feed: reads are fast, writes are expensive for big accounts.",
      "Fan-out on read computes the feed at request time: cheap writes, slower and heavier reads.",
      "Hybrid: push for normal users, and pull-and-merge celebrity posts at read time.",
      "Store only post ids in the feed cache (e.g. a Redis list per user) and hydrate the posts on read.",
      "Use a queue so a celebrity post does not block the request; workers fan out asynchronously.",
    ],
    scene: diagram({
      nodes: [
        ["users", "client", "Users", 0, 1.5],
        ["gw", "lb", "API Gateway", 1, 1.5],
        ["post", "svc", "Post Service", 2, 0.5],
        ["feed", "svc", "Feed Service", 2, 2.5],
        ["postdb", "db", "Posts DB", 3, 0],
        ["queue", "queue", "Fan-out Queue", 3, 1.5],
        ["worker", "svc", "Fan-out Workers", 4, 1.5],
        ["graph", "db", "Follow Graph DB", 4, 0],
        ["cache", "cache", "Feed Cache\n(post ids per user)", 4, 2.5],
      ],
      edges: [
        ["users", "gw"],
        ["gw", "post", "new post"],
        ["gw", "feed", "read feed"],
        ["post", "postdb", "store"],
        ["post", "queue", "publish"],
        ["queue", "worker"],
        ["worker", "graph", "get followers"],
        ["worker", "cache", "push post id"],
        ["feed", "cache", "read (pre-built)"],
        ["feed", "post", "celebrity posts (pull)", { dashed: true }],
      ],
      groups: [["Async fan-out on write", ["queue", "worker"]]],
      notes: [
        "Hybrid: push for normal users, pull and merge celebrity posts at read time",
        "Trade-off: fan-out on write makes a 10M-follower post 10M cache writes",
      ],
    }),
  },
  {
    id: "chat-system",
    title: "Chat System",
    description: "WhatsApp-style messaging over persistent WebSocket connections with presence and offline push.",
    talkingPoints: [
      "Clients hold a WebSocket to a gateway; a session store maps each user to the gateway that holds their socket.",
      "Persist the message through a queue before acking, and deliver at-least-once; clients dedupe by message id.",
      "Per-conversation ordering comes from a monotonically increasing id (sequence or time-sortable id).",
      "Presence uses heartbeats with a TTL in Redis; do not broadcast every status flip to large contact lists.",
      "Offline users get a push notification via APNs/FCM and sync from the message store on reconnect.",
    ],
    scene: diagram({
      nodes: [
        ["alice", "client", "Client A", 0, 0.5],
        ["bob", "client", "Client B", 0, 2.5],
        ["gw1", "lb", "WebSocket\nGateway", 1, 0.5],
        ["gw2", "lb", "WebSocket\nGateway", 1, 2.5],
        ["chat", "svc", "Chat Service", 2, 1.5],
        ["presence", "svc", "Presence Service", 2, 3.5],
        ["queue", "queue", "Message Queue\n(Kafka)", 3, 0.5],
        ["push", "ext", "Push Notifications\n(APNs / FCM)", 3, 1.5],
        ["session", "cache", "Session Store\nuser to gateway", 3, 2.5],
        ["msgdb", "db", "Message Store\n(wide-column)", 4, 0.5],
      ],
      edges: [
        ["alice", "gw1", "send"],
        ["gw1", "chat"],
        ["chat", "queue", "persist"],
        ["queue", "msgdb", "write"],
        ["chat", "session", "find recipient"],
        ["chat", "gw2", "deliver"],
        ["gw2", "bob", "push over WS"],
        ["chat", "push", "if offline", { dashed: true }],
        ["gw2", "presence", "heartbeat"],
        ["presence", "session", "status"],
      ],
      groups: [["Stateful gateway tier", ["gw1", "gw2"]]],
      notes: [
        "Group chat: small groups fan out per member; very large groups go through the queue",
        "Message ids are per-conversation and increasing, which gives ordering and cheap dedupe",
      ],
    }),
  },
  {
    id: "notification-service",
    title: "Notification Service",
    description: "Event-driven fan-out to push, SMS and email with preferences, dedupe, retries and a dead-letter queue.",
    talkingPoints: [
      "Producers call one API; a queue decouples them from slow third-party providers.",
      "Check user preferences (opt-outs, quiet hours) before enqueueing, not in each worker.",
      "Dedupe with an idempotency key in a cache so a retried producer call does not send twice.",
      "Separate workers per channel scale independently and isolate a failing provider.",
      "Retry with exponential backoff and jitter; park exhausted messages in a dead-letter queue for inspection.",
    ],
    scene: diagram({
      nodes: [
        ["producers", "svc", "Producers\n(orders, auth, promos)", 0, 1],
        ["api", "lb", "Notification API", 1, 1],
        ["dedupe", "cache", "Dedupe Cache\n(idempotency key)", 2, 0],
        ["queue", "queue", "Notification Queue", 2, 1],
        ["prefs", "db", "Preferences DB", 2, 2],
        ["push", "svc", "Push Worker", 3, 0],
        ["sms", "svc", "SMS Worker", 3, 1],
        ["email", "svc", "Email Worker", 3, 2],
        ["apns", "ext", "APNs / FCM", 4, 0],
        ["sms-gw", "ext", "SMS Provider", 4, 1],
        ["mail-gw", "ext", "Email Provider", 4, 2],
        ["dlq", "queue", "Dead Letter Queue", 3, 3],
      ],
      edges: [
        ["producers", "api", "send(event)"],
        ["api", "dedupe", "seen key?"],
        ["api", "prefs", "opt-in / quiet hours"],
        ["api", "queue", "enqueue"],
        ["queue", "push"],
        ["queue", "sms"],
        ["queue", "email"],
        ["push", "apns"],
        ["sms", "sms-gw"],
        ["email", "mail-gw"],
        ["email", "dlq", "retries exhausted", { dashed: true, color: RED }],
      ],
      groups: [["Channel workers (scale independently)", ["push", "sms", "email"]]],
      notes: [
        "Delivery is at-least-once, so dedupe on an idempotency key to avoid double sends",
        "Retries use exponential backoff with jitter; the DLQ catches poison messages",
      ],
    }),
  },
  {
    id: "file-storage",
    title: "File Storage",
    description: "Dropbox/Drive-style sync: chunk and hash on the client, store blocks in an object store, metadata in a DB.",
    talkingPoints: [
      "Split files into blocks (around 4 MB), hash each one, and upload only blocks the server has not seen.",
      "Content-hash dedupe saves storage and makes resumable uploads and delta sync cheap.",
      "The metadata DB maps file version to an ordered list of block hashes; blocks live in object storage.",
      "A notification service (long poll or WebSocket) tells other devices to pull the new version.",
      "Serve downloads through a CDN, and resolve conflicts with version numbers (keep both copies).",
    ],
    scene: diagram({
      nodes: [
        ["client", "client", "Client\nSync Agent", 0, 1],
        ["gw", "lb", "API Gateway", 1, 1],
        ["cdn", "ext", "CDN", 2, 0],
        ["block", "svc", "Block Server\n(chunk + hash)", 2, 1],
        ["meta", "svc", "Metadata Service", 2, 2],
        ["notify", "svc", "Notification Service", 2, 3],
        ["store", "db", "Object Store\n(blocks)", 3, 0],
        ["metadb", "db", "Metadata DB\nfile to block list", 3, 2],
      ],
      edges: [
        ["client", "gw", "upload"],
        ["gw", "block"],
        ["block", "store", "put block"],
        ["gw", "meta", "commit version"],
        ["meta", "metadb", "write"],
        ["meta", "notify", "change event"],
        ["notify", "client", "sync push", { dashed: true }],
        ["store", "cdn", "origin"],
        ["client", "cdn", "download blocks"],
      ],
      groups: [["Content-addressed storage", ["cdn", "store"]]],
      notes: [
        "Blocks are named by their hash: identical blocks are stored once, edits upload only changed blocks",
        "Estimate: a 1 GB file at 4 MB blocks is about 256 blocks",
      ],
    }),
  },
  {
    id: "video-streaming",
    title: "Video Streaming",
    description: "YouTube-style pipeline: upload, async transcoding to many bitrates, CDN delivery, metadata and recommendations.",
    talkingPoints: [
      "Uploads trigger an async pipeline: a queue feeds transcoding workers that make many resolutions and codecs.",
      "Videos are cut into short segments (HLS/DASH) so the player can switch bitrate as bandwidth changes.",
      "Serve segments from a CDN; popular content stays at the edge and the object store is only the origin.",
      "Keep metadata (title, owner, counts) in a DB separate from the bytes, and cache hot reads.",
      "Recommendations are an offline/ML pipeline surfaced by a service; do not put it on the playback path.",
    ],
    scene: diagram({
      nodes: [
        ["creator", "client", "Creator", 0, 0.5],
        ["upload", "svc", "Upload Service", 1, 0.5],
        ["queue", "queue", "Transcode Queue", 2, 0.5],
        ["workers", "svc", "Transcoding Workers\n(240p to 4K)", 3, 0.5],
        ["store", "db", "Object Store\n(segments)", 4, 0.5],
        ["viewer", "client", "Viewer\n(Player)", 0, 2.5],
        ["cdn", "ext", "CDN", 3, 2.5],
        ["api", "svc", "Video API", 1, 3.5],
        ["metadb", "db", "Metadata DB", 2, 3.5],
        ["recs", "svc", "Recommendation\nService", 1, 4.5],
      ],
      edges: [
        ["creator", "upload", "upload"],
        ["upload", "queue", "job"],
        ["queue", "workers"],
        ["workers", "store", "write segments"],
        ["viewer", "cdn", "stream segments (HLS / DASH)"],
        ["cdn", "store", "origin fetch"],
        ["viewer", "api", "browse / search"],
        ["api", "metadb", "metadata"],
        ["api", "recs", "home feed"],
      ],
      groups: [["Async transcoding pipeline", ["queue", "workers"]]],
      notes: [
        "Adaptive bitrate: several renditions per video, and the player picks one per segment",
        "Trade-off: the CDN dominates egress cost, so cache hit ratio is the key lever",
      ],
    }),
  },
  {
    id: "ride-sharing",
    title: "Ride Sharing",
    description: "Uber-style dispatch: a geo index of live driver locations, matching, trips, payments and an event stream.",
    talkingPoints: [
      "Drivers ping their location every few seconds; keep the latest position in an in-memory geo index (Redis).",
      "Index by geohash or quadtree cell: query the rider's cell plus neighbours, then rank candidates by ETA.",
      "Matching offers the trip to a driver with a timeout and falls through to the next candidate.",
      "Stream location and trip events through Kafka for ETA, surge pricing and analytics without loading the hot path.",
      "Trips are a state machine in a durable DB; payments are charged after completion with idempotency keys.",
    ],
    scene: diagram({
      nodes: [
        ["rider", "client", "Rider App", 0, 0],
        ["driver", "client", "Driver App", 0, 2],
        ["gw", "lb", "API Gateway", 1, 1],
        ["match", "svc", "Matching Service", 2, 0],
        ["loc", "svc", "Location Service", 2, 2],
        ["geo", "cache", "Geo Index\n(geohash in Redis)", 3, 1],
        ["trip", "svc", "Trip Service", 3, 0],
        ["tripdb", "db", "Trips DB", 4, 0],
        ["pay", "svc", "Payment Service", 4, 1],
        ["kafka", "queue", "Kafka\n(location + trip events)", 3, 3],
        ["surge", "svc", "ETA & Surge\nPipeline", 4, 3],
      ],
      edges: [
        ["rider", "gw", "request ride"],
        ["driver", "gw", "location ping"],
        ["gw", "match"],
        ["gw", "loc"],
        ["match", "trip", "create trip"],
        ["match", "geo", "nearby drivers"],
        ["loc", "geo", "update cell"],
        ["loc", "kafka", "stream"],
        ["trip", "tripdb", "state"],
        ["trip", "pay", "charge"],
        ["kafka", "surge"],
      ],
      notes: [
        "Geohash prefix = cell: query the rider's cell and its 8 neighbours, then rank by ETA",
        "Estimate: 1M active drivers pinging every 4 s is about 250K location writes/s",
      ],
    }),
  },
  {
    id: "web-crawler",
    title: "Web Crawler",
    description: "Distributed crawler: a prioritised URL frontier, polite fetchers, parsing, URL-seen filtering and a content store.",
    talkingPoints: [
      "The frontier holds URLs to fetch with priority queues and one queue per host for politeness.",
      "Respect robots.txt and a per-host crawl delay; cache both robots.txt and DNS lookups.",
      "Parse pages for links, normalise them, and drop already-seen URLs with a Bloom filter backed by a store.",
      "A Bloom filter has no false negatives for 'seen' but a small false-positive rate, so a few pages are skipped.",
      "Also dedupe by content hash (near-duplicates via simhash) and keep the raw pages in a content store.",
    ],
    scene: diagram({
      nodes: [
        ["seeds", "ext", "Seed URLs", 0, 1],
        ["frontier", "queue", "URL Frontier\npriority + per-host", 1, 1],
        ["dns", "cache", "DNS Cache", 2, 0],
        ["fetch", "svc", "Fetchers", 2, 1],
        ["robots", "cache", "robots.txt Cache", 2, 2],
        ["web", "ext", "The Web", 3, 0],
        ["parser", "svc", "Parser\ntext + links", 3, 1],
        ["seen", "cache", "URL Seen Filter\n(Bloom filter)", 3, 2],
        ["content", "db", "Content Store", 4, 1],
      ],
      edges: [
        ["seeds", "frontier", "seed"],
        ["frontier", "fetch", "next URL"],
        ["fetch", "dns", "resolve"],
        ["fetch", "robots", "allowed?"],
        ["fetch", "web", "GET page"],
        ["fetch", "parser", "html"],
        ["parser", "content", "store page"],
        ["parser", "seen", "links"],
        ["seen", "frontier", "", { dashed: true }],
      ],
      groups: [["Fetcher pool", ["dns", "fetch", "robots"]]],
      notes: [
        "Politeness: one queue per host, honour robots.txt and crawl-delay",
        "Estimate: 1B pages/month is about 400 pages/s on average, so plan for several times that at peak",
      ],
    }),
  },
  {
    id: "distributed-cache",
    title: "Distributed Cache / KV Store",
    description: "Dynamo-style key-value store: consistent hashing, replication, gossip membership and an LSM storage engine.",
    talkingPoints: [
      "Consistent hashing with virtual nodes spreads keys evenly and remaps only about K/N keys when nodes change.",
      "Each key is replicated to N nodes; tune R and W so R + W > N for strong reads, or lower them for latency.",
      "Any node can coordinate a request: hash the key, find the owner and replicas, and wait for the quorum.",
      "Gossip spreads membership and failure detection without a central coordinator.",
      "Each node appends to a write-ahead log, buffers writes in a memtable, and flushes SSTables (LSM) with compaction.",
    ],
    scene: diagram({
      nodes: [
        ["clients", "client", "Clients", 0, 1],
        ["coord", "lb", "Coordinator\n(any node routes)", 1, 1],
        ["a", "svc", "Node A\n(owner)", 2, 0],
        ["b", "svc", "Node B\n(replica)", 3, 1],
        ["c", "svc", "Node C\n(replica)", 2, 2],
        ["wal", "queue", "Write-Ahead Log", 4, 0],
        ["lsm", "db", "LSM Storage\nmemtable + SSTables", 5, 0],
      ],
      edges: [
        ["clients", "coord", "get / put"],
        ["coord", "a", "hash(key)"],
        ["a", "b", "replicate"],
        ["a", "c", "replicate"],
        ["b", "c", "gossip", { dashed: true }],
        ["a", "wal", "1. append"],
        ["wal", "lsm", "2. flush"],
      ],
      groups: [["Hash ring (virtual nodes, N=3)", ["a", "b", "c"]]],
      notes: [
        "Quorum: with N=3, W=2 and R=2 every read overlaps the latest write (R + W > N)",
        "Trade-off: lower R or W for latency and availability, at the cost of stale reads",
      ],
    }),
  },
  {
    id: "ecommerce-checkout",
    title: "E-commerce Checkout",
    description: "Order flow with idempotent requests, the outbox pattern, Kafka events and a saga across inventory and payment.",
    talkingPoints: [
      "Send an idempotency key with checkout so a retried request returns the stored result instead of double charging.",
      "Write the order and an outbox row in one DB transaction; a relay publishes the event to Kafka (no dual-write bug).",
      "Use a saga: reserve inventory, charge payment, and run compensating steps (release stock, refund) on failure.",
      "Delivery is at-least-once, so every consumer must be idempotent.",
      "Reserve stock with a TTL so abandoned carts release inventory automatically.",
    ],
    scene: diagram({
      nodes: [
        ["client", "client", "Client", 0, 1],
        ["gw", "lb", "API Gateway", 1, 1],
        ["cart", "svc", "Cart Service", 2, 0],
        ["order", "svc", "Order Service\n(idempotency key)", 2, 1],
        ["orderdb", "db", "Orders DB\n+ outbox table", 2, 2],
        ["kafka", "queue", "Kafka\n(order events)", 3, 2],
        ["inv", "svc", "Inventory Service", 4, 1],
        ["invdb", "db", "Inventory DB", 5, 1],
        ["pay", "svc", "Payment Service", 4, 3],
        ["psp", "ext", "Payment Provider", 5, 3],
      ],
      edges: [
        ["client", "gw", "checkout"],
        ["gw", "cart"],
        ["gw", "order"],
        ["cart", "order", "cart snapshot"],
        ["order", "orderdb", "order + outbox (1 tx)"],
        ["orderdb", "kafka", "outbox relay"],
        ["kafka", "inv", "reserve stock"],
        ["inv", "invdb", "decrement"],
        ["kafka", "pay", "charge"],
        ["pay", "psp", "charge"],
        ["pay", "inv", "compensate", { dashed: true, color: RED }],
      ],
      groups: [["Saga steps (compensate on failure)", ["inv", "pay"]]],
      notes: [
        "Outbox: the order and its event commit together, so no event is lost and none is invented",
        "Trade-off: a saga is eventually consistent, so the UI shows 'processing' until it settles",
      ],
    }),
  },
  {
    id: "search-autocomplete",
    title: "Search Autocomplete",
    description: "Typeahead suggestions from a prefix trie, with an offline top-K build pipeline and edge caching.",
    talkingPoints: [
      "Store the top-K completions at every trie node so a lookup is O(length of prefix), not a subtree scan.",
      "Build the trie offline from query logs (aggregate counts, take top-K) and swap it in; do not update it per keystroke.",
      "Cache hot prefixes at the CDN/edge with a short TTL; most traffic is a few thousand popular prefixes.",
      "Shard the trie by prefix range and replicate shards for availability and read throughput.",
      "Filter unsafe terms and debounce on the client to cut requests.",
    ],
    scene: diagram({
      nodes: [
        ["user", "client", "User typing", 0, 1],
        ["edge", "ext", "Edge Cache\n(hot prefixes)", 1, 1],
        ["api", "lb", "Suggest API", 2, 1],
        ["trie", "cache", "Trie Service\n(sharded by prefix)", 3, 1],
        ["logs", "queue", "Query Logs\n(Kafka)", 1, 3],
        ["agg", "svc", "Top-K Aggregation\n(batch)", 2, 3],
        ["builder", "svc", "Trie Builder", 3, 3],
        ["snap", "db", "Trie Snapshots", 4, 3],
      ],
      edges: [
        ["user", "edge", "GET /suggest"],
        ["edge", "api", "miss"],
        ["api", "trie", "lookup prefix"],
        ["api", "logs", "log query", { dashed: true }],
        ["logs", "agg"],
        ["agg", "builder", "counts"],
        ["builder", "snap", "write"],
        ["snap", "trie", "load + swap"],
      ],
      groups: [["Offline build (batch)", ["logs", "agg", "builder", "snap"]]],
      notes: [
        "Each trie node keeps its top-K (say 5 to 10) completions, so a lookup never scans a subtree",
        "Trade-off: a batch rebuild is cheap but lags trending queries by minutes to hours",
      ],
    }),
  },
];

export const TEMPLATE_OPTIONS = [BLANK, ...TEMPLATES];

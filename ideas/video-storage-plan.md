# Video Storage Plan for Your Educational TikTok-Style App

Love this project idea! Let me put together a practical plan that scales from
"weekend hackathon" to "real users." I'll lay it out in phases so you don't
over-engineer early.

Before I dive in, let me ask a few things that'll shape the plan:While you
answer those, here's a general plan you can adapt. I'll structure it in 3
phases.

## Phase 1: MVP (Get it working fast)

**Stack recommendation:**

- **Storage**: Cloudflare R2 or Supabase Storage (both have generous free tiers)
- **Database**: Supabase (Postgres) — handles auth, metadata, and storage in one
  place
- **Video player**: `expo-video` (the new one, replacing `expo-av`)
- **CDN**: Cloudflare (free, automatic with R2) or Bunny.net ($0.01/GB, super
  cheap)

**Why this combo:** You get free egress with R2 (huge — most video bills are
bandwidth), Supabase gives you auth + DB + storage SDK out of the box, and
Bunny.net has cheap video-optimized delivery if R2 doesn't fit.

**Database schema (start simple):**

```
videos
  id (uuid)
  uploader_id
  title
  description
  category (math, science, history, etc.)
  duration_seconds
  storage_path        -- path in R2/Supabase
  thumbnail_path
  hls_manifest_url    -- for adaptive streaming (Phase 2)
  view_count
  like_count
  created_at
  status (processing, ready, failed)

user_video_views     -- for "don't show seen videos"
  user_id
  video_id
  watched_at
  watch_duration_pct  -- for ranking later

likes, comments, follows  -- standard social tables
```

## Phase 2: Upload Pipeline

**For your Expo app:**

```
User picks video → expo-image-picker
   ↓
Client-side compression → react-native-compressor
   ↓
Get presigned upload URL from your backend
   ↓
Direct multipart upload to R2/Supabase
   ↓
Trigger processing (webhook/edge function)
   ↓
Server transcodes → multiple qualities (480p, 720p)
   ↓
Generate thumbnail, store HLS manifest
   ↓
Update DB status to "ready"
```

**Key libraries:**

- `expo-image-picker` — pick from gallery or record
- `expo-camera` — if you want in-app recording
- `react-native-compressor` — compress before upload (huge win for upload times
  and storage costs)
- `expo-file-system` — chunked uploads with resume support

**Critical tip:** Always upload directly from client to storage using
**presigned URLs**. Never proxy video bytes through your backend — it'll explode
your server costs and bandwidth.

**Transcoding options (cheapest to most robust):**

1. **mux.com** — $0.04/min encoded, handles everything (transcode + HLS +
   delivery). Easiest, best for MVP.
2. **Cloudflare Stream** — $5/1000 min stored, $1/1000 min delivered. Very
   simple API.
3. **Self-hosted FFmpeg** on a cheap VPS — free but you maintain it
4. **Bunny Stream** — similar to Mux, often cheaper

For an educational app where videos might be longer (5-15 min lessons?), I'd
start with **Mux** or **Cloudflare Stream** to skip building a transcoding
pipeline yourself.

## Phase 3: The Endless Scroll Magic

This is what makes it feel like TikTok. The scrolling experience is 80%
client-side engineering.

**Use FlashList, not FlatList.** FlashList from Shopify is dramatically faster
for video feeds. Set it to vertical with `pagingEnabled` and snap-to-interval.

**Preloading strategy (the key to "no delay"):**

```
Currently visible: video N → playing
Next 2-3 videos:    N+1, N+2, N+3 → preloaded, paused
Previous 1 video:   N-1 → kept in memory
Everything else:    unloaded
```

**Implementation pattern with expo-video:**

- Maintain a pool of 3-5 video player instances
- As user scrolls, recycle players (the one that scrolled off becomes the next
  one to preload)
- Start downloading the next video's first segment as soon as current video
  starts playing
- Use HLS so playback can start from the first chunk (don't wait for full
  download)

**Feed API design:**

```
GET /api/feed?cursor=xyz&limit=10

Returns: array of video objects with:
  - signed CDN URLs (HLS manifest)
  - thumbnail URL
  - metadata (title, creator, likes)
  - next_cursor for pagination
```

Fetch the next batch when the user is 3-4 videos away from the end of the
current batch. Never let them hit the bottom.

**Recommendation logic for v1 (keep it dumb):**

- Mix of: trending in last 24h + random from user's interest categories + new
  uploads
- Filter out already-watched videos
- Save real ML ranking for v3 — early on, randomization + recency works fine

## Cost Estimate (rough, assuming Cloudflare R2 + Mux)

| Users | Storage         | Mux encoding | Mux delivery | Total/mo  |
| ----- | --------------- | ------------ | ------------ | --------- |
| 50    | ~$0 (free tier) | ~$2          | ~$1          | **~$3**   |
| 500   | ~$5             | ~$20         | ~$15         | **~$40**  |
| 5000  | ~$50            | ~$100        | ~$200        | **~$350** |

Cloudflare R2's $0 egress is your friend at scale. If you went pure Mux,
delivery costs would dominate.

## Recommended Path Forward

1. **Week 1**: Set up Supabase + R2, build basic upload flow with hardcoded
   transcoding (just store the original)
2. **Week 2**: Build the FlashList vertical feed with `expo-video`, get
   scrolling smooth with 3-5 hardcoded videos
3. **Week 3**: Wire up real upload → Mux → playback pipeline
4. **Week 4**: Add preloading, polish the scroll, add categories/likes

Want me to dive deeper into any specific part? I can write out the actual upload
code, the FlashList feed component, or the database schema in detail. Once you
answer those questions above I can also tailor the recommendations to your exact
situation.

# Free-Tier Plan: Educational TikTok-Style App

Perfect — user-generated content for 50-500 users on $0/month is totally doable.
Here's a plan tuned to those exact constraints.

## The Hard Truth About Free Tiers

Video is bandwidth-heavy, and most "free tiers" hate bandwidth. So the strategy
is: **pick services that are generous on egress** and **make videos small** so
you stay under limits. With 500 users watching educational content (longer than
TikTok, lower scroll velocity), this is achievable.

## Recommended Stack

| Layer              | Service                     | Free tier                                                  | Why                                                |
| ------------------ | --------------------------- | ---------------------------------------------------------- | -------------------------------------------------- |
| Database + Auth    | **Supabase**                | 500MB DB, 50K monthly active users, unlimited API requests | Best free tier for full backend                    |
| Video storage      | **Cloudflare R2**           | 10GB storage, **zero egress fees forever**                 | Egress is what kills free tiers; R2 doesn't charge |
| Video delivery     | **Cloudflare CDN**          | Free, automatic with R2                                    | Global edge, fast in Indonesia                     |
| Transcoding        | **FFmpeg on a free worker** | Free with limits                                           | See below — this is the tricky part                |
| App framework      | **Expo (managed)**          | Free                                                       | You already picked this                            |
| Push notifications | **Expo Push**               | Free                                                       | Built-in                                           |

**The killer combo here is R2 + Cloudflare CDN.** Most services charge
$0.05-0.09 per GB of egress. With 500 users watching ~10 videos/day at 5MB each,
that's ~750GB/month of egress. On AWS that'd be $60+. On R2 it's **$0**.

## The Transcoding Problem (and how to dodge it)

Free transcoding services don't really exist for video. You have three realistic
options:

**Option A: Skip transcoding entirely (recommended for v1)**

- Force compression on the client before upload using `react-native-compressor`
- Upload only one quality (e.g., 720p, ~2-5MB per minute)
- Skip HLS, just serve the MP4 directly
- Tradeoff: no adaptive bitrate, but for educational content on wifi this is
  fine

**Option B: Cloudflare Stream**

- Not free, but $5/month for 1000 minutes stored. If you must have HLS, this is
  cheapest.
- Skip for v1, consider for v2.

**Option C: Self-hosted FFmpeg on Oracle Cloud Free Tier**

- Oracle gives you 4 ARM cores + 24GB RAM forever free
- Run a Node.js + FFmpeg worker that pulls jobs from a Supabase queue
- More work to set up but truly free
- Recommended once you outgrow Option A

**My recommendation: start with Option A.** Get the app working, validate the
idea, then upgrade.

## Database Schema (Supabase)

```sql
-- Users table is auto-created by Supabase Auth
-- Add a profile table for app-specific fields
profiles
  id (uuid, FK to auth.users)
  username
  display_name
  bio
  avatar_url
  created_at

videos
  id (uuid)
  uploader_id (FK to profiles)
  title
  description
  category (text) -- math, science, history, coding, languages, etc.
  duration_seconds
  storage_key (text) -- path in R2
  thumbnail_key
  width, height
  view_count (int, default 0)
  like_count (int, default 0)
  status (text) -- 'uploading', 'ready', 'failed'
  created_at

video_views -- so you don't show seen videos again
  user_id
  video_id
  watch_duration_seconds
  completed (bool)
  watched_at

likes
  user_id, video_id, created_at (composite PK)

follows
  follower_id, following_id, created_at

comments
  id, video_id, user_id, text, created_at
```

**Important Supabase tip:** Use **Row Level Security (RLS) policies** for auth.
Don't build a backend API — let Supabase be your backend. The Expo app talks
directly to Supabase using the JS SDK with the user's auth token, and RLS
enforces "users can only edit their own videos" etc.

## Upload Flow (the cost-saver path)

```
1. User picks/records video in Expo app
       ↓
2. Compress aggressively on device (react-native-compressor)
   - Target: 720p, ~1-2 Mbps bitrate
   - Cap duration at 3-5 minutes for v1
       ↓
3. Generate thumbnail on device (expo-video-thumbnails)
       ↓
4. Get presigned upload URL from Supabase Edge Function
   (Edge function uses R2 S3-compatible API to mint URL)
       ↓
5. Upload video + thumbnail directly from device → R2
   (use expo-file-system for resumable uploads)
       ↓
6. Insert row into 'videos' table with status='ready'
       ↓
7. Done — video is live
```

**Why this works on free tier:**

- No backend server needed (Supabase Edge Functions are free, 500K
  invocations/month)
- No transcoding costs
- R2 storage is 10GB free — at ~5MB per minute, that's ~2000 minutes of content
- Zero egress fees on playback

## The Endless Scroll Implementation

Here's where you'll spend most of your client-side effort. The "no delay" feel
comes from **preloading**, not from the network being fast.

**Library choices:**

- `@shopify/flash-list` — much faster than FlatList for video feeds
- `expo-video` — the new player (NOT `expo-av`, which is being deprecated)
- Configure FlashList with `pagingEnabled` and snap behavior

**Preloading strategy:**

```
Window of 5 videos in memory at any time:
  [N-1]  [N]  [N+1]  [N+2]  [N+3]
   prev  now   next   next   next
  ready playing ready ready start-loading

When user swipes:
  - N-1 is unloaded
  - N becomes N-1
  - N+1 becomes N (auto-plays)
  - N+4 starts loading
```

**Key implementation tips:**

1. **Use a pool of `expo-video` player instances**, not one per item. Recycle
   them as the user scrolls. Creating/destroying players is expensive.

2. **Start playback before full download.** MP4 with `moov` atom at the start
   (FFmpeg flag `-movflags faststart`) lets the browser/player start playing as
   soon as the first chunk arrives. Make sure your compression step does this.

3. **Fetch feed in batches of 10-15 videos.** When the user is 3 videos away
   from the end, fetch the next batch. Never let them hit the bottom.

4. **Pause off-screen videos.** Use FlashList's `viewabilityConfig` to detect
   which video is visible and pause all others.

## Feed Algorithm (v1, keep it simple)

For 50-500 users you don't need ML. A simple SQL query is plenty:

```sql
-- Get videos for user X
SELECT v.* FROM videos v
WHERE v.status = 'ready'
  AND v.id NOT IN (
    SELECT video_id FROM video_views WHERE user_id = $1
  )
ORDER BY
  -- Mix recency + popularity
  (v.like_count * 10 + v.view_count) /
  EXTRACT(EPOCH FROM (NOW() - v.created_at))/3600 DESC
LIMIT 15;
```

This gives you a "trending recent" feed. Add category filters once users pick
interests.

## Critical: Watch Your Free Tier Limits

| Resource                       | Free limit       | Risk                                                   |
| ------------------------------ | ---------------- | ------------------------------------------------------ |
| R2 storage                     | 10 GB            | ~2000 min @ 720p — fine for v1, monitor                |
| R2 Class A operations (writes) | 1M/month         | Plenty                                                 |
| R2 Class B operations (reads)  | 10M/month        | **Watch this** — every video segment fetch counts      |
| Supabase DB                    | 500 MB           | Way more than enough for metadata                      |
| Supabase Edge Functions        | 500K invocations | Plenty                                                 |
| Supabase egress                | 5 GB/month       | **Don't** route video through Supabase — keep it on R2 |

The R2 read operations limit is the one to watch. With 500 users watching 10
videos/day, you'd hit ~150K ops/month — well under the 10M limit. You're safe.

## Build Order (4-week plan)

**Week 1 — Foundation**

- Set up Supabase project, define schema, enable RLS
- Set up Cloudflare R2 bucket, generate API tokens
- Bootstrap Expo app with Supabase client + auth flow (sign up/log in)

**Week 2 — Upload**

- Video picker + camera screen
- Client-side compression (`react-native-compressor`)
- Thumbnail generation
- Edge function for presigned URLs
- Direct upload to R2
- "My videos" screen showing your uploads

**Week 3 — Feed**

- FlashList vertical feed with `expo-video`
- Player pool implementation
- Preloading next 2-3 videos
- Pause off-screen videos
- Pagination + infinite scroll

**Week 4 — Social + Polish**

- Like, comment, follow
- Profile pages
- Categories / topic filters (educational angle!)
- Watch tracking (so feed doesn't repeat videos)

## Educational App Specific Suggestions

Since this isn't pure entertainment TikTok, lean into the education angle:

- **Categories as first-class citizens** — let users pick interests on signup,
  filter the feed
- **Longer videos OK** — up to 5 min instead of 1 min, since lessons need depth
- **Saved/Watch later list** — students will want this
- **Series support** — let creators link videos as a sequence (lesson 1, 2, 3)
- **Chapter markers** in longer videos using video timestamps
- **Quiz/comprehension cards** at the end of videos (could be a v2 feature, but
  a great differentiator)

## What I'd Skip for v1

- HLS / adaptive bitrate (overkill for now)
- Real-time features (live streaming, real-time comments)
- Push notifications (do in v2)
- ML recommendations (way premature)
- DMs / chat (scope creep)
- Video editing in-app (use what the OS provides)

---

Want me to dive into any specific piece? I can write out the actual code for:

- The presigned upload URL Edge Function
- The compression + upload flow in Expo
- The FlashList feed with player pool
- The Supabase RLS policies

Or if you want, I can put this whole plan into a markdown doc you can save to
your project.

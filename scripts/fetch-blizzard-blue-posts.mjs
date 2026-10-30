import fs from 'fs';
import https from 'https';

const url = 'https://us.forums.blizzard.com/en/wow/groups/blizzard-tracker/posts.json';
const body = await new Promise((resolve, reject) => {
  https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0', Accept: 'application/json' } }, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => resolve(data));
  }).on('error', reject);
});
const parsed = JSON.parse(body);
const strip = (html) => html
  .replace(/<br\s*\/?>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&hellip;/g, '…')
  .replace(/&amp;/g, '&')
  .replace(/&quot;/g, '"')
  .replace(/&#39;|&apos;/g, "'")
  .replace(/&nbsp;/g, ' ')
  .replace(/\s+/g, ' ')
  .trim()
  .replace(/^\[[^\]]+\]\s*/, '');
const posts = parsed.posts.map((post) => ({
  id: post.id,
  topicId: post.topic_id,
  title: post.topic_title,
  excerpt: strip(post.excerpt || ''),
  createdAt: post.created_at,
  url: `https://us.forums.blizzard.com${post.url}`,
  author: post.name || post.username,
  userTitle: post.user_title || 'Blizzard',
  avatar: post.avatar_template?.startsWith('http') ? post.avatar_template.replace('{size}', '96') : `https://us.forums.blizzard.com${(post.avatar_template || '').replace('{size}', '96')}`,
})).filter((post) => post.title && !/^About the /i.test(post.title) && /forever/i.test(`${post.title} ${post.excerpt}`));
fs.writeFileSync('src/data/blizzard-blue-posts.json', JSON.stringify({ source: url, fetchedAt: new Date().toISOString(), posts }, null, 1));
console.log(`saved ${posts.length} posts`);

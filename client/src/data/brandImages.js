// Client-side copy of brand/editorial image URLs (Unsplash).
// Mirrors the choices in server/src/data/products.js for shared visuals.

const img = (id, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const pageImages = {
  hero: img('photo-1504674900247-0877df9cc836', 1800),
  aboutMain: img('photo-1490645935967-10de6ba17061', 1000),
  aboutSecondary: img('photo-1556910103-1c02745aae4d', 700),
  storyPrimary: img('photo-1414235077428-338989a2e8c0', 1000),
  storySecondary: img('photo-1476224203421-9ac39bcb3327', 800),
  storyTertiary: img('photo-1498837167922-ddd27525d352', 800),
  cta: img('photo-1546069901-ba9599a7e63c', 700),
  contact: img('photo-1466637574441-749b8f19452f', 900),
  catIrani: img('photo-1603360946369-dc9bb6258143', 700),
  catStews: img('photo-1590301157890-4810ed352733', 700),
  catRice: img('photo-1631515243349-e0cb75fb8d3a', 700),
  catDaily: img('photo-1563379926898-05f4575a45d8', 700),
  catLight: img('photo-1607532941433-304659e8198a', 700),
  catSides: img('photo-1540420773420-3366772f4999', 700),
};

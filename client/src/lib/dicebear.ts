const styleMap = {
  'profile': 'big-smile',
  'event': 'shapes',
  'badge': 'rings',
};

export function getRandomDicebearLink(style: keyof typeof styleMap) {
  return `https://api.dicebear.com/9.x/${styleMap[style]}/jpg?seed=${Math.random()}`;
}
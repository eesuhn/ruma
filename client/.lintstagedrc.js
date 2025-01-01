import path from 'path';

const buildEslintCommand = (filenames) =>
  `next lint --fix --file ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(' --file ')}`;

export default {
  'src/**/*.{js,jsx,ts,tsx}': [buildEslintCommand],
  'src/**/*.{js,jsx,ts,tsx,md,html,css}': 'prettier . -w',
};

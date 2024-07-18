// global.d.ts
declare module '*.scss' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.mp4';
declare module '*.mp3';
declare module '*.svg';
declare module '*.md';
declare module '*.mdx';

interface Window {
  Calendly: any;
  docsearch: any;
}
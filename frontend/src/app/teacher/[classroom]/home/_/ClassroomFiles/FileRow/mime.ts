import {
  IconBook,
  IconBullet,
  IconCode,
  IconData,
  IconFormatBullets,
  IconImage,
  IconLanguageMarkdown,
  IconMusic,
  IconPack,
  IconPlay,
  IconPoster,
} from "@tolokoban/ui";

type Icon = typeof IconBullet;

/**
 * The first rule whose regular expression matches the mime type gives the icon.
 */
const RULES: Array<[RegExp, Icon]> = [
  [/^image\//, IconImage],
  [/^audio\//, IconMusic],
  [/^video\//, IconPlay],
  [/^application\/pdf$/, IconBook],
  [/^text\/markdown$/, IconLanguageMarkdown],
  [/presentation|powerpoint/, IconPoster],
  [/spreadsheet|excel|^text\/csv$/, IconData],
  [/zip|tar|rar|7z|compressed/, IconPack],
  [/html|xml|json|javascript|typescript|python|x-sh/, IconCode],
  [/^text\/|document|word|rtf/, IconFormatBullets],
];

export function getMimeIcon(mime: string): Icon {
  return RULES.find(([pattern]) => pattern.test(mime))?.[1] ?? IconBullet;
}

# Frontend styles guide

Reference for writing UI code in `frontend/`. Keep it up to date so the code
does not need to be rescanned to learn the conventions.

## The purpose of this application

This application helps teacher display exercices to students.
Teachers can do statistics with students anwers.

## Stack

- React + TypeScript, bundled with rspack.
- UI toolkit: `@tolokoban/ui` (theme, `Theme.classNames`, base components).
- Styling: **CSS Modules** (`Xxx.module.css`) with native CSS nesting.
- Font: `dosis` (see `src/fonts/dosis.css`), root font size `max(12px, 2.2vmin)`.
- Units: prefer `em` for spacing, padding, radius and gaps.
- For typeguards, always use the `@tolokoban/type-guards` library.
- We use `oxlint` for linting and `oxfmt` for formatting.

## Notifications

There is a global oject `Notif` to deal with temporary notifications.
It's defined in file 'frontend/src/components/Notification/manager.tsx'.

## Imports

Imports must be grouped in three sections separated by a blank line:

1. External libraries
2. Internal `*.ts` or `*.tsx` files
3. `*.css`, `*.json`, images, etc.

Each section must be sorted alphabetically.

## Component layout

Each component lives in its own folder:

```
src/ui/comp/UiButton/
├── index.ts              # re-exports the component
├── UiButton.tsx
├── UiButton.module.css
└── translation/          # optional i18n strings
```

Component pattern:

```tsx
import { Theme } from "@tolokoban/ui";
import Styles from "./MyComp.module.css";

const $ = Theme.classNames;

export interface MyCompProps {
  className?: string;
  children: React.ReactNode;
}

export function MyComp({ className, children }: MyCompProps) {
  return <div className={$.join(className, Styles.myComp)}>{children}</div>;
}
```

- Always accept an optional `className` and merge it with `$.join(...)`.
- Root CSS class is the camelCase component name (`div.layoutSection`).
- Style inner elements through the root selector with nesting (`> header`, `> div`)
  rather than creating many extra classes.
- When a button is needed, use one of existing `<UiButton* />`.
- Use the property `footer` as soon as there is need of buttons.
- Put only one component definition per file.
- If a component is only used in another component, it must be defined in a subfolder of the folder of that parent component.
- If the body of a component definition is more that 30 non-empty lines, create a file `hooks.ts` and move all the hooks and handlers in it to make the component definition shorter.

## Colors (theme variables)

Never hardcode colors: use the theme CSS variables from `@tolokoban/ui`.
Every background color has a matching foreground `on-` variable.

- Palettes: `primary`, `secondary`, `tertiary`, `neutral`, `error`.
- Shades: `-1` (darkest) … `-9` (lightest), e.g. `--theme-color-primary-5`.
- Pair them: `background: var(--theme-color-primary-5); color: var(--theme-color-on-primary-5);`
- App-specific extras (in `src/index.css`): `--theme-color-screen`,
  `--theme-color-primary`, `--theme-color-primary-light`, `--theme-color-primary-dark`.
- Page background: `neutral-1`.

Typical usage (see `LayoutSection`):

| Element         | Background   |
| --------------- | ------------ |
| Section header  | `primary-5`  |
| Section body    | `primary-3`  |
| Section footer  | `primary-2`  |

## Spacing & shapes

- Small padding: `.125em .5em`; normal padding: `.5em`; gaps: `1em`.
- Border radius: `.25em`.
- Vertical margin between sections: `1em 0`.

## Translations

The translations must be kept close to the components that use them, as much as possible.
For typical definition, see `frontend/src/ui/comp/UiInputRoles/translation`.
We use translations with this hook: `const tr = useTranslation()`.

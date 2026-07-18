# Frontend accessibility and RTL checklist

- entire journey is keyboard reachable with visible focus and logical order in RTL;
- controls have programmatic names; icons are hidden or labelled by function;
- form errors identify the field and recovery, not color alone; status changes use an appropriate live region;
- text/background and focus contrast meet WCAG AA; 200% zoom and 320 CSS px do not lose function;
- seat states use label/pattern/icon plus color and expose row/number/state/price to assistive technology;
- countdown does not announce every second; warnings are polite and cancellation remains possible;
- dialogs trap/restore focus; route changes move focus to the page heading;
- Persian numbers/dates/currency remain understandable and mixed UUID/email text has correct direction isolation;
- prefers-reduced-motion disables nonessential animation; pointer targets are at least 44×44 CSS px;
- successful, declined, timeout, offline, empty and loading states have clear Persian text.

Verify with browser keyboard, axe/Lighthouse and at least one screen reader walkthrough. Automated checks
do not replace the manual seat-map and checkout journey.

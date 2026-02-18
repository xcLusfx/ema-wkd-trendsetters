/* eslint-disable */
/* global WebImporter */

/**
 * Transformer for WKND Trendsetters website cleanup
 * Purpose: Remove navigation, footer, and non-content elements
 * Applies to: wknd-trendsetters.site (all templates)
 * Generated: 2026-02-18
 *
 * SELECTORS EXTRACTED FROM:
 * - Captured DOM during migration workflow (cleaned.html)
 * - Page structure analysis from page migration workflow
 */

const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform',
};

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove navigation (captured DOM: div.nav.secondary-nav)
    WebImporter.DOMUtils.remove(element, [
      '.nav.secondary-nav',
      '.w-nav-overlay',
      '.nav-mobile-menu-button',
    ]);

    // Remove footer (captured DOM: footer.footer.inverse-footer)
    WebImporter.DOMUtils.remove(element, [
      'footer.footer',
    ]);

    // Remove inline SVG data URIs used as decorative icons
    // (captured DOM: multiple img elements with data:image/svg+xml;base64 src)
    const svgIcons = element.querySelectorAll('img[src^="data:image/svg+xml"]');
    svgIcons.forEach((icon) => {
      // Only remove small decorative icons, not content images
      const parent = icon.closest('.icon, .icon-small, .icon-medium, .nav-logo-icon, .button-icon, .dropdown-icon');
      if (parent) {
        icon.remove();
      }
    });
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove remaining non-content elements
    WebImporter.DOMUtils.remove(element, [
      'noscript',
      'link',
      'source',
    ]);

    // Clean up tracking/interaction attributes
    const allElements = element.querySelectorAll('*');
    allElements.forEach((el) => {
      el.removeAttribute('data-w-id');
      el.removeAttribute('data-wf-domain');
    });
  }
}

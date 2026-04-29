/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: WKND Trendsetters section breaks and section metadata.
 * Purpose: Insert <hr> section breaks and Section Metadata blocks based on template sections.
 * Applies to: wknd-trendsetters.site (all templates with 2+ sections)
 *
 * SELECTORS EXTRACTED FROM:
 * - Captured DOM during migration workflow (cleaned.html)
 * - Page structure analysis from page-templates.json
 *
 * DOM section elements found in cleaned.html (in order):
 *   1. <header class="section utility-overflow-hidden secondary-section"> (hero)
 *   2. <section class="section"> (features/columns)
 *   3. <section class="section secondary-section"> (cards/articles)
 *   4. <section class="section inverse-section"> (tabs)
 *   5. <section class="section secondary-section"> (accordion/faq)
 *   6. <section class="section"> (cta/columns)
 *
 * All 6 section-level elements share the CSS class "section" and are selected
 * with "header.section, section.section" (from template.sectionSelector).
 * Template sections are matched to DOM elements by position (index).
 */

const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform',
};

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const { template } = payload || {};
    const sections = template && template.sections;

    if (!sections || sections.length < 2) {
      return;
    }

    const document = element.ownerDocument;

    // Collect all section-level DOM elements in document order.
    // Selector from captured DOM: header.section and section.section
    const sectionSelector = (template && template.sectionSelector) || 'header.section, section.section';
    const sectionElements = [...element.querySelectorAll(sectionSelector)];

    // Pair template sections with DOM elements by index (1:1, in order)
    const count = Math.min(sections.length, sectionElements.length);

    // Process in reverse order to avoid DOM position shifts when inserting elements
    for (let i = count - 1; i >= 0; i--) {
      const definition = sections[i];
      const domElement = sectionElements[i];

      // Insert Section Metadata block when section has a style
      if (definition.style) {
        const sectionMetadata = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: {
            style: definition.style,
          },
        });
        // Append as last child of the section element
        domElement.append(sectionMetadata);
      }

      // Insert <hr> before every section except the first
      if (i > 0) {
        const hr = document.createElement('hr');
        domElement.before(hr);
      }
    }
  }
}

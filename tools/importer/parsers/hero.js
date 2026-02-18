/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero block
 *
 * Source: https://wknd-trendsetters.site
 * Base Block: hero
 *
 * Block Structure (from block library example):
 * - Row 1: Background/hero images
 * - Row 2: Content (heading, subheading, CTAs)
 *
 * Source HTML Pattern:
 * <header class="section utility-overflow-hidden secondary-section">
 *   <div class="container small-container">
 *     <h1>Heading</h1>
 *     <p class="subheading">Description</p>
 *     <div class="button-group">
 *       <a class="button w-button">CTA1</a>
 *       <a class="button secondary-button w-button">CTA2</a>
 *     </div>
 *   </div>
 *   <div class="w-layout-grid">
 *     <img class="image cover-image" />
 *     <img class="image cover-image" />
 *   </div>
 * </header>
 *
 * Generated: 2026-02-18
 */
export default function parse(element, { document }) {
  // Extract heading
  const heading = element.querySelector('h1, h2, .h1-heading');

  // Extract description/subheading
  const description = element.querySelector('.subheading, p:not(.button-group p)');

  // Extract CTA buttons
  const ctaLinks = Array.from(
    element.querySelectorAll('.button-group a.button, .button-group a.w-button'),
  );

  // Extract hero images (grid images, not SVG icons)
  const heroImages = Array.from(
    element.querySelectorAll('.w-layout-grid img.cover-image, .w-layout-grid img.image'),
  );

  // Build cells array matching hero block structure
  const cells = [];

  // Row 1: Images (if present)
  if (heroImages.length > 0) {
    cells.push(heroImages);
  }

  // Row 2: Content (heading + description + CTAs in single cell)
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (description) contentCell.push(description);
  contentCell.push(...ctaLinks);
  cells.push(contentCell);

  // Create block
  const block = WebImporter.Blocks.createBlock(document, { name: 'Hero', cells });

  // Replace original element
  element.replaceWith(block);
}

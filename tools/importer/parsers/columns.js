/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns block
 *
 * Source: https://wknd-trendsetters.site
 * Base Block: columns
 *
 * Block Structure (from block library example):
 * - Each row has N columns of content
 *
 * Source HTML Patterns:
 * Pattern 1 - Feature grid (4 columns, 2 rows):
 * <div class="w-layout-grid grid-layout desktop-4-column">
 *   <div class="flex-horizontal">icon + <p>text</p></div>
 *   ... (8 items total)
 * </div>
 *
 * Pattern 2 - CTA columns (2 columns, 1 row):
 * <div class="w-layout-grid grid-layout desktop-4-column">
 *   <div>heading + description</div>
 *   <div>buttons</div>
 * </div>
 *
 * Generated: 2026-02-18
 */
export default function parse(element, { document }) {
  // Detect column count from CSS classes
  const is4Col = element.classList.contains('desktop-4-column')
    || element.querySelector('.desktop-4-column');
  const gridElement = element.classList.contains('w-layout-grid')
    ? element
    : element.querySelector('.w-layout-grid');

  if (!gridElement) return;

  // Get direct children as column items
  const children = Array.from(gridElement.querySelectorAll(':scope > div, :scope > a'));

  const cells = [];

  if (is4Col && children.length > 4) {
    // Feature grid pattern: split into rows of 4
    const colCount = 4;
    for (let i = 0; i < children.length; i += colCount) {
      const row = [];
      for (let j = i; j < Math.min(i + colCount, children.length); j += 1) {
        // Extract text content from each feature item
        const p = children[j].querySelector('p');
        row.push(p || children[j]);
      }
      cells.push(row);
    }
  } else {
    // Standard columns: each child is a column
    const row = children.map((child) => child);
    cells.push(row);
  }

  // Create block
  const block = WebImporter.Blocks.createBlock(document, { name: 'Columns', cells });

  // Replace original element
  element.replaceWith(block);
}

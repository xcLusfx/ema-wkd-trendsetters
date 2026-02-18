/* eslint-disable */
/* global WebImporter */

/**
 * Parser for tabs block
 *
 * Source: https://wknd-trendsetters.site
 * Base Block: tabs
 *
 * Block Structure (from block library example):
 * - 2 columns per row: tab label | tab content
 * - Multiple rows (one per tab)
 *
 * Source HTML Pattern:
 * <div class="w-tabs">
 *   <div class="w-tab-menu">
 *     <a class="w-tab-link">Tab Label</a>
 *     ...
 *   </div>
 *   <div class="w-tab-content">
 *     <div class="w-tab-pane">
 *       <h3>Heading</h3>
 *       <img class="cover-image" />
 *     </div>
 *     ...
 *   </div>
 * </div>
 *
 * Generated: 2026-02-18
 */
export default function parse(element, { document }) {
  // Find tab labels
  const tabLabels = Array.from(
    element.querySelectorAll('.w-tab-menu a.w-tab-link, .w-tab-menu .tab-menu-link-transparent'),
  );

  // Find tab panes
  const tabPanes = Array.from(
    element.querySelectorAll('.w-tab-content .w-tab-pane'),
  );

  if (tabLabels.length === 0 || tabPanes.length === 0) return;

  const cells = [];

  tabLabels.forEach((label, index) => {
    const pane = tabPanes[index];
    if (!pane) return;

    // Extract label text
    const labelText = label.textContent.trim();

    // Extract pane content (heading + image)
    const heading = pane.querySelector('h3, h2, h4, [class*="heading"]');
    const img = pane.querySelector('img.cover-image, img.image, img');

    // Build content cell
    const contentCell = document.createElement('div');
    if (heading) {
      const h3 = document.createElement('h3');
      h3.textContent = heading.textContent.trim();
      contentCell.append(h3);
    }
    if (img) {
      const p = document.createElement('p');
      const imgClone = img.cloneNode(true);
      p.append(imgClone);
      contentCell.append(p);
    }

    cells.push([labelText, contentCell]);
  });

  // Create block
  const block = WebImporter.Blocks.createBlock(document, { name: 'Tabs', cells });

  // Replace original element
  element.replaceWith(block);
}

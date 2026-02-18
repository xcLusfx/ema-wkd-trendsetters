/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards block
 *
 * Source: https://wknd-trendsetters.site
 * Base Block: cards
 *
 * Block Structure (from block library example):
 * - 2 columns per row: image | text content
 * - Multiple rows (one per card)
 *
 * Source HTML Pattern:
 * <div class="w-layout-grid grid-layout tablet-1-column">
 *   <a class="utility-link-content-block">
 *     <div class="w-layout-grid">
 *       <img class="cover-image" />
 *       <div>
 *         <div class="tag">Category</div>
 *         <div class="paragraph-sm">Read time</div>
 *         <h3 class="h4-heading">Title</h3>
 *         <p>Description</p>
 *         <div>Read</div>
 *       </div>
 *     </div>
 *   </a>
 *   ...
 * </div>
 *
 * Generated: 2026-02-18
 */
export default function parse(element, { document }) {
  // Find all card items (article links)
  const cardLinks = Array.from(
    element.querySelectorAll('a.utility-link-content-block, :scope > a'),
  );

  if (cardLinks.length === 0) return;

  const cells = [];

  cardLinks.forEach((card) => {
    // Extract image
    const img = card.querySelector('img.cover-image, img');

    // Extract tag/category
    const tag = card.querySelector('.tag div, .tag');

    // Extract read time
    const readTime = card.querySelector('.paragraph-sm');

    // Extract title
    const title = card.querySelector('h3, .h4-heading, h4');

    // Extract description
    const desc = card.querySelector('p');

    // Extract link text
    const linkHref = card.getAttribute('href') || '#';

    // Build image cell
    const imageCell = img || '';

    // Build text cell with tag, read time, title, description, and link
    const textContainer = document.createElement('div');
    if (tag && readTime) {
      const meta = document.createElement('p');
      meta.textContent = `${tag.textContent.trim()} · ${readTime.textContent.trim()}`;
      textContainer.append(meta);
    }
    if (title) {
      const strong = document.createElement('p');
      const bold = document.createElement('strong');
      bold.textContent = title.textContent.trim();
      strong.append(bold);
      textContainer.append(strong);
    }
    if (desc) {
      const p = document.createElement('p');
      p.textContent = desc.textContent.trim();
      textContainer.append(p);
    }
    const linkP = document.createElement('p');
    const a = document.createElement('a');
    a.href = linkHref;
    a.textContent = 'Read';
    linkP.append(a);
    textContainer.append(linkP);

    cells.push([imageCell, textContainer]);
  });

  // Create block
  const block = WebImporter.Blocks.createBlock(document, { name: 'Cards', cells });

  // Replace original element
  element.replaceWith(block);
}

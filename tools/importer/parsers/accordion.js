/* eslint-disable */
/* global WebImporter */

/**
 * Parser for accordion block
 *
 * Source: https://wknd-trendsetters.site
 * Base Block: accordion
 *
 * Block Structure (from block library example):
 * - 2 columns per row: question/title | answer/content
 * - Multiple rows (one per accordion item)
 *
 * Source HTML Pattern:
 * <div class="accordion transparent-accordion w-dropdown">
 *   <div class="w-dropdown-toggle">
 *     <div class="paragraph-lg">Question text</div>
 *   </div>
 *   <nav class="accordion-content w-dropdown-list">
 *     <div class="rich-text w-richtext">
 *       <p>Answer text</p>
 *     </div>
 *   </nav>
 * </div>
 *
 * Generated: 2026-02-18
 */
export default function parse(element, { document }) {
  // Find all accordion items
  const accordionItems = Array.from(
    element.querySelectorAll('.accordion.w-dropdown, .w-dropdown'),
  );

  if (accordionItems.length === 0) return;

  const cells = [];

  accordionItems.forEach((item) => {
    // Extract question/title from toggle
    const questionEl = item.querySelector('.paragraph-lg, .w-dropdown-toggle div:not(.dropdown-icon)');
    const question = questionEl ? questionEl.textContent.trim() : '';

    // Extract answer/content from dropdown list
    const answerEl = item.querySelector('.w-richtext p, .accordion-content p, .w-dropdown-list p');
    const answer = answerEl ? answerEl.textContent.trim() : '';

    if (question) {
      cells.push([question, answer]);
    }
  });

  // Create block
  const block = WebImporter.Blocks.createBlock(document, { name: 'Accordion', cells });

  // Replace original element
  element.replaceWith(block);
}

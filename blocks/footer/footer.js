import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  // strip button classes from all footer links
  footer.querySelectorAll('.button').forEach((button) => {
    button.className = '';
    const buttonContainer = button.closest('.button-container');
    if (buttonContainer) {
      buttonContainer.className = '';
    }
  });

  // build flat grid: brand+social column + link columns
  const sections = footer.querySelectorAll('.section');
  const grid = document.createElement('div');
  grid.className = 'footer-grid';

  // brand+social column from first section
  if (sections.length > 0) {
    const brandCol = document.createElement('div');
    brandCol.className = 'footer-brand';
    const brandWrapper = sections[0].querySelector('.default-content-wrapper');
    if (brandWrapper) {
      while (brandWrapper.firstChild) brandCol.append(brandWrapper.firstChild);
    }
    grid.append(brandCol);
  }

  // link columns from second section
  if (sections.length > 1) {
    const wrapper = sections[1].querySelector('.default-content-wrapper');
    if (wrapper) {
      let currentColumn = null;
      [...wrapper.children].forEach((child) => {
        if (child.tagName === 'H3') {
          currentColumn = document.createElement('div');
          currentColumn.className = 'footer-column';
          grid.append(currentColumn);
          currentColumn.append(child);
        } else if (currentColumn) {
          currentColumn.append(child);
        }
      });
    }
  }

  // replace all sections with the flat grid
  footer.textContent = '';
  footer.append(grid);

  block.append(footer);
}

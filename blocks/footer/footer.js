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

  // restructure link columns into a grid
  const sections = footer.querySelectorAll('.section');
  if (sections.length > 1) {
    const columnsSection = sections[sections.length - 1];
    const wrapper = columnsSection.querySelector('.default-content-wrapper');
    if (wrapper) {
      const columnsGrid = document.createElement('div');
      columnsGrid.className = 'footer-columns';
      let currentColumn = null;

      [...wrapper.children].forEach((child) => {
        if (child.tagName === 'H3') {
          currentColumn = document.createElement('div');
          currentColumn.className = 'footer-column';
          columnsGrid.append(currentColumn);
          currentColumn.append(child);
        } else if (currentColumn) {
          currentColumn.append(child);
        }
      });

      wrapper.append(columnsGrid);
    }
  }

  block.append(footer);
}

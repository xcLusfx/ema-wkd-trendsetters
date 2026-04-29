/* eslint-disable */
/* global WebImporter */

import cleanupTransform from './transformers/wknd-trendsetters-cleanup.js';
import sectionsTransform from './transformers/wknd-trendsetters-sections.js';
import heroParser from './parsers/hero.js';
import columnsParser from './parsers/columns.js';
import cardsParser from './parsers/cards.js';
import tabsParser from './parsers/tabs.js';
import accordionParser from './parsers/accordion.js';

const template = {
  name: 'homepage',
  sectionSelector: 'header.section, section.section',
  sections: [
    { name: 'hero', style: 'secondary' },
    { name: 'features', style: '' },
    { name: 'articles', style: 'secondary' },
    { name: 'tabs', style: 'inverse' },
    { name: 'faq', style: 'secondary' },
    { name: 'cta', style: '' },
  ],
  blocks: [
    {
      name: 'hero',
      instances: ['header.section'],
    },
    {
      name: 'columns',
      instances: [
        'section.section > .container > .w-layout-grid.desktop-4-column',
        'section.section:last-of-type > .container > .w-layout-grid',
      ],
    },
    {
      name: 'cards',
      instances: ['section.section.secondary-section > .container > .w-layout-grid.grid-layout.tablet-1-column'],
    },
    {
      name: 'tabs',
      instances: ['section.section.inverse-section .w-tabs'],
    },
    {
      name: 'accordion',
      instances: ['section.section.secondary-section .accordion'],
    },
  ],
};

const parsers = {
  hero: heroParser,
  columns: columnsParser,
  cards: cardsParser,
  tabs: tabsParser,
  accordion: accordionParser,
};

export default {
  transformDOM: ({ document, url }) => {
    const main = document.body;

    // Run cleanup transformer (beforeTransform)
    cleanupTransform('beforeTransform', main, { template });

    // Run block parsers
    template.blocks.forEach((blockDef) => {
      const parser = parsers[blockDef.name];
      if (!parser) return;

      blockDef.instances.forEach((selector) => {
        const elements = [...main.querySelectorAll(selector)];
        elements.forEach((el) => {
          try {
            parser(el, { document });
          } catch (e) {
            console.warn(`Parser ${blockDef.name} failed on element:`, e.message);
          }
        });
      });
    });

    // Run sections transformer (afterTransform)
    sectionsTransform('afterTransform', main, { template });

    // Run cleanup transformer (afterTransform)
    cleanupTransform('afterTransform', main, { template });

    return main;
  },

  generateDocumentPath: ({ document, url }) => {
    let path = new URL(url).pathname;
    if (path === '/' || path === '') {
      path = '/index';
    }
    path = path.replace(/\/$/, '');
    return path;
  },
};

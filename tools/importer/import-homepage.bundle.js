var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/transformers/wknd-trendsetters-cleanup.js
  var TransformHook = {
    beforeTransform: "beforeTransform",
    afterTransform: "afterTransform"
  };
  function transform(hookName, element, payload) {
    var _a;
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        ".navbar",
        ".nav.secondary-nav",
        ".w-nav-overlay",
        ".nav-mobile-menu-button"
      ]);
      const skipLink = element.querySelector('a[href="#main-content"]');
      if (skipLink) ((_a = skipLink.closest("div, p")) == null ? void 0 : _a.remove()) || skipLink.remove();
      WebImporter.DOMUtils.remove(element, [
        "footer.footer",
        "footer.inverse-footer"
      ]);
      const svgIcons = element.querySelectorAll('img[src^="data:image/svg+xml"]');
      svgIcons.forEach((icon) => {
        const parent = icon.closest(".icon, .icon-small, .icon-medium, .nav-logo-icon, .button-icon, .dropdown-icon");
        if (parent) {
          icon.remove();
        }
      });
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "noscript",
        "link",
        "source"
      ]);
      const allElements = element.querySelectorAll("*");
      allElements.forEach((el) => {
        el.removeAttribute("data-w-id");
        el.removeAttribute("data-wf-domain");
      });
    }
  }

  // tools/importer/transformers/wknd-trendsetters-sections.js
  var TransformHook2 = {
    beforeTransform: "beforeTransform",
    afterTransform: "afterTransform"
  };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const { template: template2 } = payload || {};
      const sections = template2 && template2.sections;
      if (!sections || sections.length < 2) {
        return;
      }
      const document = element.ownerDocument;
      const sectionSelector = template2 && template2.sectionSelector || "header.section, section.section";
      const sectionElements = [...element.querySelectorAll(sectionSelector)];
      const count = Math.min(sections.length, sectionElements.length);
      for (let i = count - 1; i >= 0; i--) {
        const definition = sections[i];
        const domElement = sectionElements[i];
        if (definition.style) {
          const sectionMetadata = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: {
              style: definition.style
            }
          });
          domElement.append(sectionMetadata);
        }
        if (i > 0) {
          const hr = document.createElement("hr");
          domElement.before(hr);
        }
      }
    }
  }

  // tools/importer/parsers/hero.js
  function parse(element, { document }) {
    const heading = element.querySelector("h1, h2, .h1-heading");
    const description = element.querySelector(".subheading, p:not(.button-group p)");
    const ctaLinks = Array.from(
      element.querySelectorAll(".button-group a.button, .button-group a.w-button")
    );
    const heroImages = Array.from(
      element.querySelectorAll(".w-layout-grid img.cover-image, .w-layout-grid img.image")
    );
    const cells = [];
    if (heroImages.length > 0) {
      cells.push(heroImages);
    }
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (description) contentCell.push(description);
    contentCell.push(...ctaLinks);
    cells.push(contentCell);
    const block = WebImporter.Blocks.createBlock(document, { name: "Hero", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns.js
  function parse2(element, { document }) {
    const is4Col = element.classList.contains("desktop-4-column") || element.querySelector(".desktop-4-column");
    const gridElement = element.classList.contains("w-layout-grid") ? element : element.querySelector(".w-layout-grid");
    if (!gridElement) return;
    const children = Array.from(gridElement.querySelectorAll(":scope > div, :scope > a"));
    const cells = [];
    if (is4Col && children.length > 4) {
      const colCount = 4;
      for (let i = 0; i < children.length; i += colCount) {
        const row = [];
        for (let j = i; j < Math.min(i + colCount, children.length); j += 1) {
          const p = children[j].querySelector("p");
          row.push(p || children[j]);
        }
        cells.push(row);
      }
    } else {
      const row = children.map((child) => child);
      cells.push(row);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "Columns", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards.js
  function parse3(element, { document }) {
    const cardLinks = Array.from(
      element.querySelectorAll("a.utility-link-content-block, :scope > a")
    );
    if (cardLinks.length === 0) return;
    const cells = [];
    cardLinks.forEach((card) => {
      const img = card.querySelector("img.cover-image, img");
      const tag = card.querySelector(".tag div, .tag");
      const readTime = card.querySelector(".paragraph-sm");
      const title = card.querySelector("h3, .h4-heading, h4");
      const desc = card.querySelector("p");
      const linkHref = card.getAttribute("href") || "#";
      const imageCell = img || "";
      const textContainer = document.createElement("div");
      if (tag && readTime) {
        const meta = document.createElement("p");
        meta.textContent = `${tag.textContent.trim()} \xB7 ${readTime.textContent.trim()}`;
        textContainer.append(meta);
      }
      if (title) {
        const strong = document.createElement("p");
        const bold = document.createElement("strong");
        bold.textContent = title.textContent.trim();
        strong.append(bold);
        textContainer.append(strong);
      }
      if (desc) {
        const p = document.createElement("p");
        p.textContent = desc.textContent.trim();
        textContainer.append(p);
      }
      const linkP = document.createElement("p");
      const a = document.createElement("a");
      a.href = linkHref;
      a.textContent = "Read";
      linkP.append(a);
      textContainer.append(linkP);
      cells.push([imageCell, textContainer]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "Cards", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs.js
  function parse4(element, { document }) {
    const tabLabels = Array.from(
      element.querySelectorAll(".w-tab-menu a.w-tab-link, .w-tab-menu .tab-menu-link-transparent")
    );
    const tabPanes = Array.from(
      element.querySelectorAll(".w-tab-content .w-tab-pane")
    );
    if (tabLabels.length === 0 || tabPanes.length === 0) return;
    const cells = [];
    tabLabels.forEach((label, index) => {
      const pane = tabPanes[index];
      if (!pane) return;
      const labelText = label.textContent.trim();
      const heading = pane.querySelector('h3, h2, h4, [class*="heading"]');
      const img = pane.querySelector("img.cover-image, img.image, img");
      const contentCell = document.createElement("div");
      if (heading) {
        const h3 = document.createElement("h3");
        h3.textContent = heading.textContent.trim();
        contentCell.append(h3);
      }
      if (img) {
        const p = document.createElement("p");
        const imgClone = img.cloneNode(true);
        p.append(imgClone);
        contentCell.append(p);
      }
      cells.push([labelText, contentCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "Tabs", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion.js
  function parse5(element, { document }) {
    const accordionItems = Array.from(
      element.querySelectorAll(".accordion.w-dropdown, .w-dropdown")
    );
    if (accordionItems.length === 0) return;
    const cells = [];
    accordionItems.forEach((item) => {
      const questionEl = item.querySelector(".paragraph-lg, .w-dropdown-toggle div:not(.dropdown-icon)");
      const question = questionEl ? questionEl.textContent.trim() : "";
      const answerEl = item.querySelector(".w-richtext p, .accordion-content p, .w-dropdown-list p");
      const answer = answerEl ? answerEl.textContent.trim() : "";
      if (question) {
        cells.push([question, answer]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "Accordion", cells });
    element.replaceWith(block);
  }

  // tools/importer/import-homepage.js
  var template = {
    name: "homepage",
    sectionSelector: "header.section, section.section",
    sections: [
      { name: "hero", style: "secondary" },
      { name: "features", style: "" },
      { name: "articles", style: "secondary" },
      { name: "tabs", style: "inverse" },
      { name: "faq", style: "secondary" },
      { name: "cta", style: "" }
    ],
    blocks: [
      {
        name: "hero",
        instances: ["header.section"]
      },
      {
        name: "columns",
        instances: [
          "section.section > .container > .w-layout-grid.desktop-4-column",
          "section.section:last-of-type > .container > .w-layout-grid"
        ]
      },
      {
        name: "cards",
        instances: ["section.section.secondary-section > .container > .w-layout-grid.grid-layout.tablet-1-column"]
      },
      {
        name: "tabs",
        instances: ["section.section.inverse-section .w-tabs"]
      },
      {
        name: "accordion",
        instances: ["section.section.secondary-section .accordion"]
      }
    ]
  };
  var parsers = {
    hero: parse,
    columns: parse2,
    cards: parse3,
    tabs: parse4,
    accordion: parse5
  };
  var import_homepage_default = {
    transformDOM: ({ document, url }) => {
      const main = document.body;
      transform("beforeTransform", main, { template });
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
      transform2("afterTransform", main, { template });
      transform("afterTransform", main, { template });
      return main;
    },
    generateDocumentPath: ({ document, url }) => {
      let path = new URL(url).pathname;
      if (path === "/" || path === "") {
        path = "/index";
      }
      path = path.replace(/\/$/, "");
      return path;
    }
  };
  return __toCommonJS(import_homepage_exports);
})();

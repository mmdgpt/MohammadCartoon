import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CATALOG_PRODUCTS,
  COMPANY_AWARDS,
  COMPANY_INFO,
  DEPARTMENT_CONTACTS,
  IMAGES,
  PRODUCT_GROUPS,
  GROUP_PRODUCTS_PER_PAGE,
  buildPaginatedGroupPages,
  getPaginatedPagesForGroup,
  getProductGroupPageRoute,
  getVariantEffectiveMedia,
  getVisibleProductVariants,
  isVariantSpecVisible,
  hasAnyVisibleVariantSpec,
  buildProductMessengerLinks,
  parseCatalogRoute,
  getGroupProducts,
  getAdjacentProducts,
  filterCatalogProducts,
  calculateOrderEstimate,
  toPersianDigits,
  buildPdfCatalogManifest,
  getPdfPageIdForRoute,
  normalizeWhatsappNumber,
  getProductWhatsappNumber,
} from './catalogData';
import {
  getDefaultCatalogState,
  addProductToState,
  updateProductInState,
  deleteProductFromState,
  createBlankProduct,
  updateCategoryWhatsappInState,
  setGlobalMessengerEnabledInState,
  setProductMessengerEnabledInState,
  exportCatalogBackupJson,
  parseCatalogBackupJson,
} from './catalogStore';

test('catalogStore default state has updated Cover h2 title and supports full product CRUD, custom WhatsApp/Eitaa/Rubika consultation numbers and toggles, per-category pagination, backup export/import, and dynamic PDF manifest', () => {
  const initial = getDefaultCatalogState();
  assert.equal(
    initial.elements.cover.heroTitle,
    'کاتالوگ محصولات شرکت کارتن محمد'
  );
  assert.equal(initial.products.length, 20);
  assert.deepEqual(initial.elements.productPage.messengers, {
    whatsapp: true,
    eitaa: true,
    rubika: true,
  });

  // Verify WhatsApp normalization and per-product / per-category WhatsApp resolution
  assert.equal(normalizeWhatsappNumber('09161234567'), '989161234567');
  assert.equal(normalizeWhatsappNumber('۰۹۳۹۶۴۱۰۲۷۶'), '989396410276');
  assert.equal(normalizeWhatsappNumber('+98 912-345-6789'), '989123456789');

  const withCartonWhatsapp = updateCategoryWhatsappInState(
    initial,
    'cartons',
    '09165554433'
  );
  const cartonProd = withCartonWhatsapp.products.find(
    (p) => p.groupId === 'cartons'
  )!;
  assert.equal(
    getProductWhatsappNumber(cartonProd, withCartonWhatsapp.groups),
    '989165554433'
  );

  // Verify 3 messengers (WhatsApp, Eitaa, Rubika) links use the configured phone number
  const links = buildProductMessengerLinks(
    cartonProd,
    cartonProd.variants[0].label,
    withCartonWhatsapp.groups,
    withCartonWhatsapp.elements.contactPage.whatsappNumber,
    withCartonWhatsapp.elements.productPage.messengers
  );
  assert.equal(links.length, 3);
  assert.deepEqual(
    links.map((l) => l.id),
    ['whatsapp', 'eitaa', 'rubika']
  );
  assert.ok(links[0].href.includes('wa.me/989165554433'));
  assert.ok(links[1].href.includes('eitaa.com'));
  assert.ok(links[1].href.includes('09165554433'));
  assert.ok(links[2].href.includes('rubika.ir/09165554433'));
  assert.ok(links.every((l) => l.enabled));

  // Verify global and per-product messenger activation/deactivation toggles
  const withRubikaDisabled = setGlobalMessengerEnabledInState(
    withCartonWhatsapp,
    'rubika',
    false
  );
  const linksAfterGlobalToggle = buildProductMessengerLinks(
    withRubikaDisabled.products.find((p) => p.id === cartonProd.id)!,
    cartonProd.variants[0].label,
    withRubikaDisabled.groups,
    withRubikaDisabled.elements.contactPage.whatsappNumber,
    withRubikaDisabled.elements.productPage.messengers
  );
  assert.deepEqual(
    linksAfterGlobalToggle.filter((l) => l.enabled).map((l) => l.id),
    ['whatsapp', 'eitaa']
  );

  const withProductOverride = setProductMessengerEnabledInState(
    withRubikaDisabled,
    cartonProd.id,
    'eitaa',
    false
  );
  const linksAfterProdToggle = buildProductMessengerLinks(
    withProductOverride.products.find((p) => p.id === cartonProd.id)!,
    cartonProd.variants[0].label,
    withProductOverride.groups,
    withProductOverride.elements.contactPage.whatsappNumber,
    withProductOverride.elements.productPage.messengers
  );
  assert.deepEqual(
    linksAfterProdToggle.filter((l) => l.enabled).map((l) => l.id),
    ['whatsapp']
  );

  const blank = createBlankProduct('boxes');
  const withAdded = addProductToState(initial, blank);
  assert.equal(withAdded.products.length, 21);

  // Verify separate pagination per category (8 products per page)
  assert.equal(GROUP_PRODUCTS_PER_PAGE, 8);
  const boxesPages = getPaginatedPagesForGroup(
    'boxes',
    withAdded.products,
    withAdded.groups
  );
  const cartonsPages = getPaginatedPagesForGroup(
    'cartons',
    withAdded.products,
    withAdded.groups
  );
  const sheetsPages = getPaginatedPagesForGroup(
    'sheets',
    withAdded.products,
    withAdded.groups
  );
  assert.equal(boxesPages.length, 2);
  assert.equal(boxesPages[0].groupPageNum, 1);
  assert.equal(boxesPages[0].products.length, 8);
  assert.equal(boxesPages[0].routeHash, '#/g/boxes');
  assert.equal(boxesPages[1].groupPageNum, 2);
  assert.equal(boxesPages[1].products.length, 1);
  assert.equal(boxesPages[1].routeHash, '#/g/boxes/2');
  assert.equal(cartonsPages.length, 1);
  assert.equal(cartonsPages[0].groupPageNum, 1);
  assert.equal(sheetsPages.length, 1);
  assert.equal(sheetsPages[0].groupPageNum, 1);
  assert.equal(
    getProductGroupPageRoute(blank.id, withAdded.products),
    '#/g/boxes/2'
  );

  // Dynamic PDF manifest reflects the newly added product and its interactive pages
  const dynamicManifest = buildPdfCatalogManifest(
    withAdded.products,
    withAdded.groups
  );
  assert.ok(dynamicManifest.pages.length > 128);
  assert.ok(dynamicManifest.routeToPdfId[`#/p/${blank.id}`]);
  assert.ok(dynamicManifest.routeToPdfId['#/g/boxes/2']);

  const edited = {
    ...blank,
    name: 'جعبه اختصاصی تست',
    image: '/custom.png',
    schematicImage: '/custom-schematic.png',
    whatsappNumber: '09351112233',
    variants: blank.variants.map((v, idx) =>
      idx === 1
        ? {
            ...v,
            image: '/variant-2-sample.png',
            schematicImage: '/variant-2-schematic.png',
          }
        : v
    ),
  };
  const withUpdated = updateProductInState(withAdded, edited);
  const found = withUpdated.products.find((p) => p.id === blank.id);
  assert.equal(found?.name, 'جعبه اختصاصی تست');
  assert.equal(found?.image, '/custom.png');
  assert.equal(found?.schematicImage, '/custom-schematic.png');
  assert.equal(
    getProductWhatsappNumber(found!, withUpdated.groups),
    '989351112233'
  );

  // Verify per-variant media resolution (variant 1 falls back to product media, variant 2 uses its own media)
  assert.deepEqual(getVariantEffectiveMedia(found!, found!.variants[0]), {
    image: '/custom.png',
    schematicImage: '/custom-schematic.png',
  });
  assert.deepEqual(getVariantEffectiveMedia(found!, found!.variants[1]), {
    image: '/variant-2-sample.png',
    schematicImage: '/variant-2-schematic.png',
  });

  // Verify Backup Export & Import round-trip
  const backupJson = exportCatalogBackupJson(withUpdated);
  const restored = parseCatalogBackupJson(backupJson);
  assert.equal(restored.products.length, 21);
  const restoredProd = restored.products.find((p) => p.id === blank.id);
  assert.equal(restoredProd?.name, 'جعبه اختصاصی تست');
  assert.equal(restoredProd?.whatsappNumber, '09351112233');

  const withDeleted = deleteProductFromState(withUpdated, blank.id);
  assert.equal(withDeleted.products.length, 20);
});

test('catalog contains all 3 required main product categories (boxes, cartons, sheets)', () => {
  assert.equal(PRODUCT_GROUPS.length, 3);
  assert.deepEqual(
    PRODUCT_GROUPS.map((g) => g.id),
    ['boxes', 'cartons', 'sheets']
  );
});

test('boxes group includes all 8 requested box types (استندی، لاک باتم، ته قفلی، کیبوردی، فانتزی، درب دارویی، هولدر، سینی و کفی)', () => {
  const boxes = getGroupProducts('boxes');
  assert.equal(boxes.length, 8);
  const names = boxes.map((b) => b.name).join(' | ');
  assert.ok(names.includes('استندی'));
  assert.ok(names.includes('لاک باتم'));
  assert.ok(names.includes('ته قفلی'));
  assert.ok(names.includes('کیبوردی'));
  assert.ok(names.includes('فانتزی'));
  assert.ok(names.includes('درب دارویی'));
  assert.ok(names.includes('هولدر'));
  assert.ok(names.includes('سینی و کفی'));
});

test('cartons group includes all 6 requested carton types (3 و 5 لایه معمولی و دایکاتی، پستی، ذغال، میوه و صیفی‌جات، خرما)', () => {
  const cartons = getGroupProducts('cartons');
  assert.equal(cartons.length, 6);
  const names = cartons.map((c) => c.name).join(' | ');
  assert.ok(names.includes('معمولی'));
  assert.ok(names.includes('دایکاتی'));
  assert.ok(names.includes('پستی'));
  assert.ok(names.includes('ذغال'));
  assert.ok(names.includes('میوه و صیفی‌جات'));
  assert.ok(names.includes('خرما'));
});

test('sheets group includes all 6 requested flute types (E, B, C, CB, CE, BE)', () => {
  const sheets = getGroupProducts('sheets');
  assert.equal(sheets.length, 6);
  const ids = sheets.map((s) => s.id);
  assert.deepEqual(ids, [
    'sheet-flute-e',
    'sheet-flute-b',
    'sheet-flute-c',
    'sheet-flute-cb',
    'sheet-flute-ce',
    'sheet-flute-be',
  ]);
});

test('parseCatalogRoute resolves cover, menu, groups, group-detail, product, and autostart', () => {
  assert.deepEqual(parseCatalogRoute('#/cover'), { page: 'cover' });
  assert.deepEqual(parseCatalogRoute('', '?autostart=1'), { page: 'menu' });
  assert.deepEqual(parseCatalogRoute('#/menu'), { page: 'menu' });
  assert.deepEqual(parseCatalogRoute('#/groups/2'), { page: 'groups', pageNum: 2 });
  assert.deepEqual(parseCatalogRoute('#/g/1/0/1'), {
    page: 'group-detail',
    groupId: 'boxes',
    pageNum: 1,
  });
  assert.deepEqual(parseCatalogRoute('#/g/sheets/1'), {
    page: 'group-detail',
    groupId: 'sheets',
    pageNum: 1,
  });
  assert.deepEqual(parseCatalogRoute('#/p/sheet-flute-cb'), {
    page: 'product',
    productId: 'sheet-flute-cb',
  });
});

test('filterCatalogProducts searches across Persian and English flute and box keywords', () => {
  const cbResults = filterCatalogProducts('فلوت CB');
  assert.ok(cbResults.some((p) => p.id === 'sheet-flute-cb'));

  const mailerResults = filterCatalogProducts('کیبوردی', 'boxes');
  assert.equal(mailerResults.length, 1);
  assert.equal(mailerResults[0].id, 'box-mailer');
});

test('getAdjacentProducts returns previous and next items within the same category', () => {
  const adj = getAdjacentProducts('box-lock-bottom');
  assert.equal(adj.prev?.id, 'box-stand');
  assert.equal(adj.next?.id, 'box-snap-lock');
});

test('calculateOrderEstimate computes tiered bulk discounts and custom print surcharges', () => {
  const base = calculateOrderEstimate({
    productId: 'box-mailer',
    variantId: 'mailer-s',
    quantity: 500,
    customPrint: false,
  });
  assert.equal(base.isValidQuantity, true);
  assert.equal(base.discountPercent, 0);
  assert.equal(base.unitPrice, 11500);
  assert.equal(base.totalPrice, 11500 * 500);

  const bulk = calculateOrderEstimate({
    productId: 'box-mailer',
    variantId: 'mailer-s',
    quantity: 2000,
    customPrint: true,
  });
  assert.equal(bulk.discountPercent, 9);
  assert.ok(bulk.totalPrice > 0);
});

test('toPersianDigits converts Latin digits to Persian numerals and verifies company info & awards', () => {
  assert.equal(toPersianDigits('1405-09'), '۱۴۰۵-۰۹');
  assert.equal(CATALOG_PRODUCTS.length, 20);
  assert.equal(IMAGES.logo, '/assets/aistudio/Logo_-2_copy-3_0faf4749.png');
  assert.equal(COMPANY_AWARDS.length, 4);
  assert.deepEqual(
    COMPANY_AWARDS.map((a) => a.year),
    ['۱۳۹۵', '۱۳۹۶', '۱۳۹۷', '۱۳۹۸']
  );
  assert.equal(DEPARTMENT_CONTACTS.length, 6);
  assert.ok(COMPANY_INFO.address.includes('دزفول'));
  assert.ok(COMPANY_INFO.aboutText.includes('۱۳۸۰'));
});

test('buildPdfCatalogManifest builds all 128 interactive PDF pages (#pdf-0..#pdf-127) with full internal anchor mapping for variants, photo mode, and spec tables', () => {
  const manifest = buildPdfCatalogManifest();
  assert.equal(manifest.pages.length, 128);
  assert.equal(manifest.pages[0].pdfId, 'pdf-0');
  assert.equal(manifest.pages[27].pdfId, 'pdf-27');
  assert.equal(getPdfPageIdForRoute('#/cover'), 'pdf-0');
  assert.equal(getPdfPageIdForRoute('#/menu'), 'pdf-1');
  assert.equal(getPdfPageIdForRoute('#/about'), 'pdf-2');
  assert.equal(getPdfPageIdForRoute('#/groups/1'), 'pdf-3');
  assert.equal(getPdfPageIdForRoute('#/g/boxes'), 'pdf-4');
  assert.equal(getPdfPageIdForRoute('#/g/cartons'), 'pdf-5');
  assert.equal(getPdfPageIdForRoute('#/g/sheets'), 'pdf-6');
  assert.equal(getPdfPageIdForRoute('#/p/box-stand'), 'pdf-7');
  assert.equal(getPdfPageIdForRoute('#/p/box-stand?v=0'), 'pdf-7');
  assert.equal(getPdfPageIdForRoute('#/p/box-stand?v=1'), 'pdf-28');
  assert.equal(getPdfPageIdForRoute('#/p/box-stand?mode=photo'), 'pdf-31');
  assert.equal(getPdfPageIdForRoute('#/p/box-stand?modal=spec'), 'pdf-32');
  assert.equal(getPdfPageIdForRoute('#/p/sheet-flute-be'), 'pdf-26');
  assert.equal(getPdfPageIdForRoute('#/contact'), 'pdf-27');
});

test('variant and technical spec visibility helpers toggle entered fields ON/OFF, persist through backup, and update PDF manifest', () => {
  const initial = getDefaultCatalogState();
  const targetProduct = initial.products.find((p) => p.id === 'box-stand')!;

  // By default all variants and all 7 spec fields are ON
  assert.equal(getVisibleProductVariants(targetProduct).length, 4);
  assert.equal(isVariantSpecVisible(targetProduct.variants[0], 'grammage'), true);
  assert.equal(isVariantSpecVisible(targetProduct.variants[0], 'jointType'), true);
  assert.equal(hasAnyVisibleVariantSpec(targetProduct.variants[0]), true);

  // Turn off variant 1 completely, hide grammage & minOrder on variant 0, and hide all specs on variant 2
  const updatedProduct = {
    ...targetProduct,
    variants: targetProduct.variants.map((v, idx) => {
      if (idx === 0) {
        return {
          ...v,
          showSubLabel: false,
          specsVisibility: { grammage: false, minOrder: false },
        };
      }
      if (idx === 1) {
        return { ...v, enabled: false };
      }
      if (idx === 2) {
        return {
          ...v,
          specsVisibility: {
            grammage: false,
            thickness: false,
            weightCapacity: false,
            dimensions: false,
            printType: false,
            minOrder: false,
            jointType: false,
          },
        };
      }
      return v;
    }),
  };

  assert.equal(getVisibleProductVariants(updatedProduct).length, 3);
  assert.equal(isVariantSpecVisible(updatedProduct.variants[0], 'grammage'), false);
  assert.equal(isVariantSpecVisible(updatedProduct.variants[0], 'minOrder'), false);
  assert.equal(isVariantSpecVisible(updatedProduct.variants[0], 'thickness'), true);
  assert.equal(hasAnyVisibleVariantSpec(updatedProduct.variants[0]), true);
  assert.equal(hasAnyVisibleVariantSpec(updatedProduct.variants[2]), false);

  // Persist through state update and backup export/import
  const updatedState = updateProductInState(initial, updatedProduct);
  const restored = parseCatalogBackupJson(exportCatalogBackupJson(updatedState));
  const restoredProduct = restored.products.find((p) => p.id === 'box-stand')!;
  assert.equal(getVisibleProductVariants(restoredProduct).length, 3);
  assert.equal(restoredProduct.variants[0].showSubLabel, false);
  assert.equal(isVariantSpecVisible(restoredProduct.variants[0], 'grammage'), false);
  assert.equal(restoredProduct.variants[1].enabled, false);

  // PDF manifest excludes the disabled variant's extra page
  const manifest = buildPdfCatalogManifest(restored.products, restored.groups);
  assert.equal(manifest.pages.length, 127);
  assert.equal(manifest.routeToPdfId['#/p/box-stand?v=1'], undefined);
  assert.ok(manifest.routeToPdfId['#/p/box-stand?v=2']);
});

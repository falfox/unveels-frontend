import { formations } from "../api/virtual-assistant-attributes/formation";
import { textures } from "../api/attributes/texture";
import { skin_types } from "../api/virtual-assistant-attributes/skin_type";
import { skin_concerns } from "../api/attributes/skin_concern";
import { hair_types } from "../api/virtual-assistant-attributes/hair_type";
import { hair_concerns } from "../api/virtual-assistant-attributes/hair_concern";
import { fragrance_notes } from "../api/virtual-assistant-attributes/fragrance_note";
import { materials } from "../api/virtual-assistant-attributes/material";
import { shapes } from "../api/virtual-assistant-attributes/shape";
import { fabrics } from "../api/virtual-assistant-attributes/fabric";
import { ProductRequest } from "../types/productRequest";

const findCategoryIdsByProduct = (
  products: ProductRequest[],
  categories: Category[],
): number[] => {
  const foundIds: number[] = [];

  // Fungsi rekursif untuk mencari id sub_category atau category
  const searchCategory = (
    product: ProductRequest,
    category: Category,
  ): number | null => {
    // Cek apakah category saat ini adalah sub_category yang dicari
    if (category.name === product.sub_category) {
      return category.id;
    }
    // Cek children_data untuk kategori atau sub_kategori yang sesuai
    for (const child of category.children_data) {
      const result = searchCategory(product, child);
      if (result !== null) {
        return result;
      }
    }
    // Jika tidak menemukan sub_category, tetapi kategori utama cocok
    if (category.name === product.category) {
      return category.id;
    }
    return null; // Kembalikan null jika tidak ada kecocokan
  };

  // Iterasi setiap produk untuk menemukan id kategori atau sub kategori
  products.forEach((product) => {
    for (const category of categories) {
      const categoryId = searchCategory(product, category);
      if (categoryId !== null) {
        foundIds.push(categoryId);
        break; // Hentikan pencarian jika sudah menemukan id
      }
    }
  });

  return foundIds;
};

// Fungsi untuk mencari ID berdasarkan label dalam koleksi
function findIdByLabel(
  collection: { label: string; value: string }[],
  label: string,
): string | null {
  const item = collection.find((item) => item.label === label);
  return item ? item.value : null;
}

const createMagentoQuery = (product: ProductRequest, categoryId: number) => {
  const formationId = product.formation
    ? findIdByLabel(formations, product.formation)
    : null;
  const textureId = product.texture
    ? findIdByLabel(textures, product.texture)
    : null;
  const skinTypeId = product.skin_type
    ? findIdByLabel(skin_types, product.skin_type)
    : null;
  const skinConcernId = product.skin_concern
    ? findIdByLabel(skin_concerns, product.skin_concern)
    : null;
  const hairTypeId = product.hair_type
    ? findIdByLabel(hair_types, product.hair_type)
    : null;
  const hairConcernId = product.hair_concern
    ? findIdByLabel(hair_concerns, product.hair_concern)
    : null;
  const fragranceNoteId = product.fragrance_note
    ? findIdByLabel(fragrance_notes, product.fragrance_note)
    : null;
  const materialId = product.material
    ? findIdByLabel(materials, product.material)
    : null;
  const shapeId = product.shape ? findIdByLabel(shapes, product.shape) : null;
  const fabricId = product.fabric
    ? findIdByLabel(fabrics, product.fabric)
    : null;

  const queryParts = [
    `searchCriteria[filter_groups][0][filters][0][field]=category_id`,
    `searchCriteria[filter_groups][0][filters][0][value]=${categoryId}`,
    `searchCriteria[filter_groups][0][filters][0][condition_type]=eq`,
  ];

  // Add optional fields if present
  if (formationId) {
    queryParts.push(
      `searchCriteria[filter_groups][1][filters][0][field]=formation`,
      `searchCriteria[filter_groups][1][filters][0][value]=${formationId}`,
      `searchCriteria[filter_groups][1][filters][0][condition_type]=eq`,
    );
  }
  if (textureId) {
    queryParts.push(
      `searchCriteria[filter_groups][2][filters][0][field]=texture`,
      `searchCriteria[filter_groups][2][filters][0][value]=${textureId}`,
      `searchCriteria[filter_groups][2][filters][0][condition_type]=eq`,
    );
  }
  if (skinTypeId) {
    queryParts.push(
      `searchCriteria[filter_groups][3][filters][0][field]=skin_type`,
      `searchCriteria[filter_groups][3][filters][0][value]=${skinTypeId}`,
      `searchCriteria[filter_groups][3][filters][0][condition_type]=eq`,
    );
  }
  if (skinConcernId) {
    queryParts.push(
      `searchCriteria[filter_groups][4][filters][0][field]=skin_concern`,
      `searchCriteria[filter_groups][4][filters][0][value]=${skinConcernId}`,
      `searchCriteria[filter_groups][4][filters][0][condition_type]=eq`,
    );
  }
  if (hairTypeId) {
    queryParts.push(
      `searchCriteria[filter_groups][5][filters][0][field]=hair_type`,
      `searchCriteria[filter_groups][5][filters][0][value]=${hairTypeId}`,
      `searchCriteria[filter_groups][5][filters][0][condition_type]=eq`,
    );
  }
  if (hairConcernId) {
    queryParts.push(
      `searchCriteria[filter_groups][6][filters][0][field]=hair_concern`,
      `searchCriteria[filter_groups][6][filters][0][value]=${hairConcernId}`,
      `searchCriteria[filter_groups][6][filters][0][condition_type]=eq`,
    );
  }
  if (fragranceNoteId) {
    queryParts.push(
      `searchCriteria[filter_groups][7][filters][0][field]=fragrance_note`,
      `searchCriteria[filter_groups][7][filters][0][value]=${fragranceNoteId}`,
      `searchCriteria[filter_groups][7][filters][0][condition_type]=eq`,
    );
  }
  if (materialId) {
    queryParts.push(
      `searchCriteria[filter_groups][8][filters][0][field]=material`,
      `searchCriteria[filter_groups][8][filters][0][value]=${materialId}`,
      `searchCriteria[filter_groups][8][filters][0][condition_type]=eq`,
    );
  }
  if (shapeId) {
    queryParts.push(
      `searchCriteria[filter_groups][9][filters][0][field]=shape`,
      `searchCriteria[filter_groups][9][filters][0][value]=${shapeId}`,
      `searchCriteria[filter_groups][9][filters][0][condition_type]=eq`,
    );
  }
  if (fabricId) {
    queryParts.push(
      `searchCriteria[filter_groups][10][filters][0][field]=fabric`,
      `searchCriteria[filter_groups][10][filters][0][value]=${fabricId}`,
      `searchCriteria[filter_groups][10][filters][0][condition_type]=eq`,
    );
  }

  // Return the constructed query
  return queryParts.join("&");
};

// Integrating the findCategoryIdsByProduct function
export const generateMagentoQueries = (
  products: ProductRequest[],
  categories: Category[],
) => {
  const categoryIds = findCategoryIdsByProduct(products, categories);

  return products.map((product, index) => {
    const categoryId = categoryIds[index]; // Get corresponding category ID for each product
    return createMagentoQuery(product, categoryId); // Generate Magento query with category ID
  });
};

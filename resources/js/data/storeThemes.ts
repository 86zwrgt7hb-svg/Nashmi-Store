import { getImageUrl } from '@/utils/image-helper';
// Base theme data without thumbnails
const baseThemeData = [
  {
    id: 'gadgets',
    name: 'Blue Wave',
    description: 'Modern single-column layout with blue accents | تصميم عصري بتخطيط عمود واحد وألوان زرقاء',
    imagePath: '/storage/placeholder/themes/gadgets.png'
  },
  {
    id: 'fashion',
    name: 'Rose Starter',
    description: 'Elegant design with soft pink tones | تصميم أنيق بألوان وردية ناعمة',
    imagePath: '/storage/placeholder/themes/fashion.png'
  },
  {
    id: 'home-decor',
    name: 'Amber Classic',
    description: 'Warm classic design with orange earthy tones | تصميم كلاسيكي دافئ بألوان برتقالية',
    imagePath: '/storage/placeholder/themes/home-decor.png'
  },
  {
    id: 'bakery',
    name: 'Ivory Starter',
    description: 'Clean elegant design with cream and beige tones | تصميم أنيق بألوان كريمية وبيج',
    imagePath: '/storage/placeholder/themes/bakery.png'
  },
  {
    id: 'supermarket',
    name: 'Green Fresh',
    description: 'Vibrant layout with fresh green colors | تصميم حيوي بألوان خضراء منعشة',
    imagePath: '/storage/placeholder/themes/supermarket.png'
  },
  {
    id: 'car-accessories',
    name: 'Dark Bold',
    description: 'Professional dark theme with red accents | تصميم احترافي داكن بلمسات حمراء',
    imagePath: '/storage/placeholder/themes/car-accessories.png'
  },
  {
    id: 'toy',
    name: 'Violet Fun',
    description: 'Playful colorful design with purple tones | تصميم مرح بألوان بنفسجية زاهية',
    imagePath: '/storage/placeholder/themes/toy.png'
  }
];
// Function to get store themes with proper thumbnail URLs
export function getStoreThemes() {
  return baseThemeData.map(theme => ({
    ...theme,
    thumbnail: getImageUrl(theme.imagePath)
  }));
}
// Export static version for backward compatibility
export const storeThemes = getStoreThemes();

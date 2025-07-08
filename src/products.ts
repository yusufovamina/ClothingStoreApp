export type Product = {
  id: string;
  title: string;
  category: string;
  price: number;
  oldPrice?: number;
  rating: number;
  image: any;
  description: string;
  sizes: string[];
  colors: string[];
  reviews?: number;
};

export const products: Product[] = [
  {
    id: '1',
    title: 'Modern Light Clothes',
    category: 'T-Shirt',
    price: 212.99,
    oldPrice: 250.00,
    rating: 5.0,
    image: require('../assets/images/2.png'),
    description: 'A modern, lightweight t-shirt perfect for everyday wear. Breathable and stylish.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#000', '#E5C9A8', '#D9D9D9'],
  },
  {
    id: '2',
    title: 'Light Dress Bless',
    category: 'Dress modern',
    price: 162.99,
    oldPrice: 190.99,
    rating: 5.0,
    image: require('../assets/images/1.png'),
    description: 'Its simple and elegant shape makes it perfect for those who want minimalist clothes.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#000', '#E5C9A8', '#D9D9D9'],
  },
  {
    id: '3',
    title: 'Classic Polo Shirt',
    category: 'Polo',
    price: 99.99,
    oldPrice: 120.00,
    rating: 4.5,
    image: { uri: 'https://imagescdn.simons.ca/images/9659-29624105-10-A1_3/embroidered-logo-classic-polo.jpg?__=9' },
    description: 'A timeless polo shirt for a smart-casual look. Available in multiple colors.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#000', '#E5C9A8', '#D9D9D9'],
  },
  {
    id: '4',
    title: 'Elegant Summer Dress',
    category: 'Dress',
    price: 180.00,
    oldPrice: 210.00,
    rating: 4.8,
    image: { uri: 'https://fashion-nora.com/cdn/shop/files/Summer-Dress-Flutter-Sleeve-Flowy-Elegant-Dress-Sundresses-Fashion-Nora_grande.webp?v=1716549063' },
    description: 'A breezy summer dress for all occasions. Comfortable and chic.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#000', '#E5C9A8', '#D9D9D9'],
  },
]; 
export interface Category {
  id: string;
  name: string;
  nameEn: string;
  slug: string;
  apiEndpoint: string;
  image: string;
  description: string;
  color: string;
}

export const categories: Category[] = [
  {
    id: 'women',
    name: 'پوشاک زنانه',
    nameEn: "Women's Fashion",
    slug: 'women-31229',
    apiEndpoint: 'fashion/women-31229',
    image: 'https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=2400&h=1600',
    description: 'آخرین مدل‌های پوشاک، کیف و کفش زنانه',
    color: 'from-pink-500 to-rose-500',
  },
  {
    id: 'men',
    name: 'پوشاک مردانه',
    nameEn: "Men's Fashion",
    slug: 'men-31225',
    apiEndpoint: 'fashion/men-31225',
    image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=2400&h=1600',
    description: 'تنوع بی‌نظیر در لباس، کفش و اکسسوری مردانه',
    color: 'from-blue-500 to-indigo-500',
  },
  {
    id: 'boys',
    name: 'پوشاک پسرانه',
    nameEn: "Boys' Fashion",
    slug: 'boys-31221',
    apiEndpoint: 'fashion/boys-31221',
    image: 'https://images.pexels.com/photos/1648377/pexels-photo-1648377.jpeg?auto=compress&cs=tinysrgb&w=2400&h=1600',
    description: 'لباس‌های شیک و راحت برای پسران',
    color: 'from-cyan-500 to-blue-500',
  },
  {
    id: 'girls',
    name: 'پوشاک دخترانه',
    nameEn: "Girls' Fashion",
    slug: 'girls-31223',
    apiEndpoint: 'fashion/girls-31223',
    image: 'https://images.pexels.com/photos/3662770/pexels-photo-3662770.jpeg?auto=compress&cs=tinysrgb&w=2400&h=1600',
    description: 'مدل‌های زیبا و رنگارنگ برای دختران',
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'luggage',
    name: 'کیف و چمدان',
    nameEn: 'Luggage & Bags',
    slug: 'luggage-and-bags',
    apiEndpoint: 'luggage-and-bags',
    image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=2400&h=1600',
    description: 'کیف، کوله‌پشتی و چمدان برای سفر و روزمره',
    color: 'from-amber-500 to-orange-500',
  },
  {
    id: 'latest',
    name: 'جدیدترین محصولات',
    nameEn: 'Latest Products',
    slug: 'fashion',
    apiEndpoint: 'fashion',
    image: 'https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg?auto=compress&cs=tinysrgb&w=2400&h=1600',
    description: 'تازه‌ترین محصولات فشن و پوشاک',
    color: 'from-green-500 to-teal-500',
  },
];

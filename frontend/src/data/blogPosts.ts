export interface BlogPost {
  title: string;
  date: string;
  author: string;
  summary: string;
  image: string;
}

export const blogPosts: BlogPost[] = [
  {
    title: 'Welcome to PJ Money Power Blog',
    date: 'August 19, 2025',
    author: 'PJ Money Power Team',
    summary: 'Stay tuned for financial tips, company news, and updates about our services. We are committed to empowering your financial journey!',
    image: '/blog1.jpg',
  },
  {
    title: 'How to Improve Your Credit Score',
    date: 'August 18, 2025',
    author: 'Finance Expert',
    summary: 'Learn actionable steps to boost your credit score and secure better loan offers. Our experts share proven strategies for financial health.',
    image: '/blog2.jpg',
  },
  // Add more posts as needed
];

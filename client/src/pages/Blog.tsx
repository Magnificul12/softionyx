import { useState } from 'react';

const blogPosts = [
  {
    id: 1,
    title: 'The Future of Cloud Computing in 2024',
    category: 'Cloud Solutions',
    author: 'John Doe',
    date: '2024-01-15',
    excerpt: 'Exploring the latest trends and innovations in cloud computing...',
    tags: ['Cloud', 'AWS', 'Technology'],
  },
  {
    id: 2,
    title: 'Best Practices for React Development',
    category: 'Web Development',
    author: 'Jane Smith',
    date: '2024-01-10',
    excerpt: 'Learn the essential best practices for building scalable React applications...',
    tags: ['React', 'JavaScript', 'Frontend'],
  },
  {
    id: 3,
    title: 'Cybersecurity Threats in 2024',
    category: 'Cybersecurity',
    author: 'Mike Johnson',
    date: '2024-01-05',
    excerpt: 'Understanding the evolving landscape of cybersecurity threats...',
    tags: ['Security', 'Cybersecurity', 'Threats'],
  },
  {
    id: 4,
    title: 'AI and Machine Learning Trends',
    category: 'AI & Data',
    author: 'Sarah Williams',
    date: '2024-01-01',
    excerpt: 'Discover the latest trends in artificial intelligence and machine learning...',
    tags: ['AI', 'Machine Learning', 'Data Science'],
  },
];

const categories = ['All', 'Cloud Solutions', 'Web Development', 'Cybersecurity', 'AI & Data', 'DevOps', 'Mobile'];

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredPosts = selectedCategory === 'All'
    ? blogPosts
    : blogPosts.filter(post => post.category === selectedCategory);

  return (
    <div className="pt-32 pb-20 min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] -z-10 animate-grid"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-transparent to-transparent -z-10"></div>
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <div className="animate-in">
            <h1 className="text-5xl md:text-7xl font-medium text-white tracking-tighter mb-6">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">Blog</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto font-light">Insights, tutorials, and updates from our team</p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-12 relative z-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white/[0.02] border border-white/5 text-slate-400 hover:text-white hover:border-indigo-500/20'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="group card-glow p-6 rounded-2xl glass border border-white/5 hover:border-indigo-500/30 hover:bg-white/[0.05] transition-all duration-500 backdrop-blur-md cursor-pointer relative overflow-hidden"
              >
                <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="h-48 rounded-lg bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 mb-4 flex items-center justify-center group-hover:scale-105 transition-transform duration-500 relative z-10 shadow-lg">
                  <span className="iconify text-6xl text-indigo-400/50 group-hover:text-indigo-300 group-hover:scale-110 transition-all duration-300" data-icon="lucide:file-text" data-width="64"></span>
                </div>
                <div className="text-xs text-indigo-400 mb-2 font-medium">{post.category}</div>
                <h3 className="text-xl font-medium text-white mb-2">{post.title}</h3>
                <p className="text-slate-400 text-sm mb-4 font-light">{post.excerpt}</p>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                  <span>{post.author}</span>
                  <span>{new Date(post.date).toLocaleDateString()}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 text-xs rounded bg-slate-900/50 border border-white/5 text-slate-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

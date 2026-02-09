import { Link } from 'react-router-dom';
import { FiCalendar, FiUser, FiArrowRight, FiTag } from 'react-icons/fi';
import './Blog.css';

const blogPosts = [
    {
        id: 1,
        title: 'Understanding Heart Health: Prevention Tips for a Healthier Life',
        excerpt: 'Learn about the key factors that contribute to heart health and discover practical tips to prevent cardiovascular diseases.',
        category: 'Cardiology',
        author: 'Dr. Sarah Johnson',
        date: '2024-01-15',
        readTime: '5 min read',
        image: null,
    },
    {
        id: 2,
        title: 'The Importance of Regular Health Checkups',
        excerpt: 'Regular health checkups can help detect potential health issues early. Find out why preventive care matters.',
        category: 'General Health',
        author: 'Dr. Michael Chen',
        date: '2024-01-10',
        readTime: '4 min read',
        image: null,
    },
    {
        id: 3,
        title: 'Managing Stress: Tips for Mental Wellness',
        excerpt: 'Stress can impact both mental and physical health. Discover effective strategies for managing stress in daily life.',
        category: 'Mental Health',
        author: 'Dr. Emily Rodriguez',
        date: '2024-01-05',
        readTime: '6 min read',
        image: null,
    },
    {
        id: 4,
        title: "Children's Nutrition: Building Healthy Eating Habits",
        excerpt: 'Good nutrition is essential for growing children. Learn how to encourage healthy eating habits from an early age.',
        category: 'Pediatrics',
        author: 'Dr. Lisa Park',
        date: '2024-01-02',
        readTime: '5 min read',
        image: null,
    },
    {
        id: 5,
        title: 'Sports Injuries: Prevention and Recovery',
        excerpt: 'Whether you are a professional athlete or weekend warrior, learn how to prevent common sports injuries and recover effectively.',
        category: 'Orthopedics',
        author: 'Dr. James Wilson',
        date: '2023-12-28',
        readTime: '7 min read',
        image: null,
    },
    {
        id: 6,
        title: 'Skin Care in Winter: Protecting Your Skin',
        excerpt: 'Cold weather can be harsh on your skin. Discover dermatologist-approved tips for winter skin care.',
        category: 'Dermatology',
        author: 'Dr. Maria Garcia',
        date: '2023-12-20',
        readTime: '4 min read',
        image: null,
    },
];

const categories = ['All', 'Cardiology', 'General Health', 'Mental Health', 'Pediatrics', 'Orthopedics', 'Dermatology'];

function Blog() {
    return (
        <div className="blog-page">
            <section className="page-header">
                <div className="container">
                    <h1>Health Blog</h1>
                    <p>Stay informed with the latest health tips, news, and insights from our experts.</p>
                </div>
            </section>

            <section className="blog-content section">
                <div className="container">
                    {/* Categories */}
                    <div className="blog-categories">
                        {categories.map((cat) => (
                            <button key={cat} className={`blog-category ${cat === 'All' ? 'active' : ''}`}>
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Blog Grid */}
                    <div className="blog-grid">
                        {blogPosts.map((post) => (
                            <article key={post.id} className="blog-card">
                                <div className="blog-card__image">
                                    <div className="blog-card__image-placeholder">
                                        <FiTag size={32} />
                                        <span>{post.category}</span>
                                    </div>
                                </div>
                                <div className="blog-card__content">
                                    <div className="blog-card__category">{post.category}</div>
                                    <h2 className="blog-card__title">
                                        <Link to={`/blog/${post.id}`}>{post.title}</Link>
                                    </h2>
                                    <p className="blog-card__excerpt">{post.excerpt}</p>
                                    <div className="blog-card__meta">
                                        <span className="blog-card__author">
                                            <FiUser size={14} /> {post.author}
                                        </span>
                                        <span className="blog-card__date">
                                            <FiCalendar size={14} /> {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </span>
                                    </div>
                                    <Link to={`/blog/${post.id}`} className="blog-card__link">
                                        Read More <FiArrowRight />
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Blog;

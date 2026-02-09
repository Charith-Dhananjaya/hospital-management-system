import { FiStar, FiMessageCircle } from 'react-icons/fi';
import './Testimonials.css';

const testimonials = [
    {
        id: 1,
        name: 'John Richardson',
        role: 'Patient',
        rating: 5,
        text: 'The care I received at Legion Healthcare was exceptional. Dr. Johnson and her team went above and beyond to ensure my recovery. The facilities are modern and the staff is incredibly professional.',
        department: 'Cardiology',
    },
    {
        id: 2,
        name: 'Amanda Smith',
        role: 'Patient',
        rating: 5,
        text: 'I was nervous about my surgery, but the orthopedic team made me feel comfortable and confident. The follow-up care was thorough and I am now fully recovered. Highly recommend!',
        department: 'Orthopedics',
    },
    {
        id: 3,
        name: 'Robert Chen',
        role: 'Patient',
        rating: 5,
        text: 'Bringing my children here has been a great experience. Dr. Rodriguez is wonderful with kids and always takes the time to explain everything. The pediatric department is fantastic.',
        department: 'Pediatrics',
    },
    {
        id: 4,
        name: 'Sarah Williams',
        role: 'Patient',
        rating: 4,
        text: 'The dermatology team helped me with a condition I had struggled with for years. Their expertise and patience made all the difference. Thank you for giving me my confidence back!',
        department: 'Dermatology',
    },
    {
        id: 5,
        name: 'Michael Thompson',
        role: 'Patient',
        rating: 5,
        text: 'The emergency room staff saved my life. Their quick response and expert care during a critical situation was remarkable. I cannot thank them enough.',
        department: 'Emergency',
    },
    {
        id: 6,
        name: 'Jennifer Davis',
        role: 'Patient',
        rating: 5,
        text: 'From my first consultation to my follow-up appointments, every interaction has been professional and caring. Legion Healthcare truly puts patients first.',
        department: 'General Medicine',
    },
];

function Testimonials() {
    return (
        <div className="testimonials-page">
            <section className="page-header">
                <div className="container">
                    <h1>Patient Testimonials</h1>
                    <p>Hear from our patients about their experiences at Legion Healthcare Center.</p>
                </div>
            </section>

            <section className="testimonials-content section">
                <div className="container">
                    <div className="testimonials-grid">
                        {testimonials.map((testimonial) => (
                            <div key={testimonial.id} className="testimonial-card">
                                <div className="testimonial-card__quote">
                                    <FiMessageCircle size={32} />
                                </div>
                                <p className="testimonial-card__text">"{testimonial.text}"</p>
                                <div className="testimonial-card__rating">
                                    {[...Array(5)].map((_, i) => (
                                        <FiStar
                                            key={i}
                                            className={i < testimonial.rating ? 'filled' : ''}
                                        />
                                    ))}
                                </div>
                                <div className="testimonial-card__footer">
                                    <div className="testimonial-card__avatar">
                                        {testimonial.name.charAt(0)}
                                    </div>
                                    <div className="testimonial-card__info">
                                        <span className="testimonial-card__name">{testimonial.name}</span>
                                        <span className="testimonial-card__dept">{testimonial.department}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Testimonials;

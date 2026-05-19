import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FaShoppingCart, FaStar, FaCheck, FaShieldAlt, 
    FaBolt, FaThermometerHalf, FaMobileAlt, FaBatteryFull,
    FaRegHeart, FaChevronRight, FaStarHalfAlt
} from 'react-icons/fa';
import API from '../../services/api';
import Breadcrumb from '../../components/common/Breadcrumb';
import SafeImage from '../../components/common/SafeImage';
import { useCart } from '../../context/CartContext';
import ProductCard from '../../components/product/ProductCard';

const ProductDetailsPage = () => {
    const { slug } = useParams();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const { addToCart } = useCart();
    const [addedToCart, setAddedToCart] = useState(false);

    const addToCartHandler = () => {
        addToCart(product, 1);
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
    };

    useEffect(() => {
        fetchProduct();
        window.scrollTo(0, 0);
    }, [slug]);

    const fetchProduct = async () => {
        try {
            const { data } = await API.get(`/products/slug/${slug}`);
            setProduct(data);
            setSelectedImage(0);

            if (data.category) {
                const categoryId = typeof data.category === 'object' ? data.category._id : data.category;
                const { data: relatedData } = await API.get(`/products?category=${categoryId}`);
                const relatedArray = Array.isArray(relatedData.products) ? relatedData.products : (Array.isArray(relatedData) ? relatedData : []);
                setRelatedProducts(relatedArray.filter(p => p._id !== data._id).slice(0, 5));
            }

            setLoading(false);
        } catch (error) {
            console.error('Error fetching product details:', error);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-[#F8FAFC] min-h-screen py-24 flex flex-col items-center justify-center font-sans">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-brand-600 rounded-full animate-spin mb-4"></div>
                <p className="text-slate-500 font-medium">Loading premium product details...</p>
            </div>
        );
    }
    
    if (!product) {
        return (
            <div className="bg-[#F8FAFC] min-h-screen py-24 flex justify-center items-start font-sans">
                <div className="text-center bg-white p-12 rounded-[24px] shadow-sm max-w-md w-full mx-4 border border-slate-100">
                    <h2 className="text-3xl font-bold text-slate-800 mb-3">Product not found</h2>
                    <p className="text-slate-500 mb-8">This item might be unavailable or removed.</p>
                    <Link to="/" className="inline-block px-8 py-3.5 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition-colors shadow-md">
                        Back to Store
                    </Link>
                </div>
            </div>
        );
    }

    // Breadcrumb logic
    const breadcrumbItems = [{ label: 'Home', link: '/' }];
    if (product.category) {
        const cat = typeof product.category === 'object' ? product.category : null;
        if (cat) {
            breadcrumbItems.push({ label: 'Categories', link: '/categories' });
            breadcrumbItems.push({ label: cat.name, link: `/category/${cat.slug}` });
        }
    }
    if (product.make) {
        const mk = typeof product.make === 'object' ? product.make : null;
        if (mk) breadcrumbItems.push({ label: mk.name });
    }
    breadcrumbItems.push({ label: product.name });

    const allImages = [product.image, ...(product.images || [])].filter(Boolean);

    // Mock Features based on product category/name
    const mockFeatures = [
        { title: "Power Delivery", value: "45W", icon: <FaBolt />, desc: "Ultra-fast charging capability" },
        { title: "Universal Compatibility", value: "Multi-Device", icon: <FaMobileAlt />, desc: "Works with all modern smartphones" },
        { title: "Smart Protection", value: "Built-in", icon: <FaShieldAlt />, desc: "Prevents over-charge and short-circuits" },
        { title: "Temperature Control", value: "Active", icon: <FaThermometerHalf />, desc: "Maintains optimal operating temp" },
    ];

    const rating = product.rating || 4.8;
    const numReviews = product.numReviews || 124;

    return (
        <div className="bg-[#F8FAFC] min-h-screen pb-24 font-sans text-slate-900">
            {/* Top Breadcrumb */}
            <div className="container mx-auto px-4 max-w-7xl pt-6 pb-4">
                <Breadcrumb items={breadcrumbItems} />
            </div>

            <div className="container mx-auto px-4 max-w-7xl">
                {/* Main Product Section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-16 mb-16">
                    
                    {/* Left: Image Gallery (Takes 7 columns on Desktop) */}
                    <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4 lg:gap-6">
                        {/* Thumbnail Strip */}
                        {allImages.length > 1 && (
                            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto md:max-h-[600px] hide-scrollbar pb-2 md:pb-0 md:w-24 flex-shrink-0">
                                {allImages.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`w-20 h-20 md:w-full md:h-24 flex-shrink-0 rounded-[16px] overflow-hidden border-2 transition-all p-2 bg-white flex items-center justify-center ${
                                            selectedImage === index
                                                ? 'border-brand-600 shadow-sm'
                                                : 'border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100'
                                        }`}
                                    >
                                        <SafeImage
                                            src={img}
                                            alt={`${product.name} ${index + 1}`}
                                            className="max-w-full max-h-full object-contain mix-blend-multiply"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                        
                        {/* Main Image View */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4 }}
                            className="bg-white rounded-[24px] shadow-sm border border-slate-100 p-8 flex-1 aspect-square md:aspect-auto md:h-[600px] flex items-center justify-center relative overflow-hidden group"
                        >
                            {/* Badges */}
                            <div className="absolute top-6 left-6 flex flex-col gap-2 z-10">
                                {product.countInStock > 0 ? (
                                    <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                        In Stock ({product.countInStock})
                                    </span>
                                ) : (
                                    <span className="bg-red-100 text-red-700 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                                        Out of Stock
                                    </span>
                                )}
                                {Math.random() > 0.5 && (
                                    <span className="bg-brand-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm inline-block w-max">
                                        Best Seller
                                    </span>
                                )}
                            </div>

                            <button className="absolute top-6 right-6 w-12 h-12 bg-slate-50 hover:bg-white rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 transition-all shadow-sm hover:shadow-md z-10">
                                <FaRegHeart size={20} />
                            </button>

                            <SafeImage
                                src={allImages[selectedImage]}
                                alt={product.name}
                                className="max-h-[85%] max-w-[85%] object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700 ease-out"
                            />
                        </motion.div>
                    </div>

                    {/* Right: Product Details (Takes 5 columns on Desktop) */}
                    <div className="lg:col-span-5 flex flex-col">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            <div className="mb-6">
                                {/* Brand Label */}
                                {product.make && (
                                    <span className="text-slate-500 font-bold tracking-widest text-[11px] uppercase mb-3 block">
                                        {typeof product.make === 'object' ? product.make.name : product.make}
                                    </span>
                                )}
                                
                                {/* Title */}
                                <h1 className="text-3xl md:text-[40px] leading-[1.1] font-bold text-[#0F172A] mb-4 tracking-tight">
                                    {product.name}
                                </h1>
                                
                                {/* Rating */}
                                <div className="flex items-center gap-3 text-sm mb-6">
                                    <div className="flex text-amber-400 gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <FaStar key={i} className={i < Math.floor(rating) ? 'text-amber-400' : 'text-slate-200'} size={16} />
                                        ))}
                                    </div>
                                    <span className="font-semibold text-slate-700">{rating}</span>
                                    <span className="text-slate-400 hover:text-brand-600 cursor-pointer underline decoration-slate-300 underline-offset-4 transition-colors">
                                        ({numReviews} reviews)
                                    </span>
                                </div>

                                {/* Price block */}
                                <div className="flex items-end gap-4 mb-6">
                                    <div className="text-4xl md:text-5xl font-bold text-[#0F172A] tracking-tighter">
                                        ₹{product.price.toLocaleString()}
                                    </div>
                                    <div className="flex flex-col pb-1">
                                        <span className="text-slate-400 line-through font-medium">₹{(product.price * 1.25).toLocaleString()}</span>
                                        <span className="text-orange-500 font-bold text-sm">Save 25%</span>
                                    </div>
                                </div>
                            </div>

                            <hr className="border-slate-200 mb-6" />

                            {/* Compatibility Box */}
                            <div className="bg-blue-50/50 border border-blue-100 rounded-[20px] p-5 mb-8">
                                <h3 className="font-bold text-slate-800 text-[15px] mb-3 flex items-center gap-2">
                                    <FaCheck className="text-brand-600" /> Compatible With:
                                </h3>
                                <div className="flex flex-wrap items-center gap-2 mb-3">
                                    <span className="bg-white border border-blue-100 text-blue-800 px-3 py-1.5 rounded-lg text-sm font-semibold shadow-sm">
                                        {product.model ? (typeof product.model === 'object' ? product.model.name : product.model) : "Multiple Devices"}
                                    </span>
                                    {product.compatibleModels && product.compatibleModels.slice(0, 2).map((model, i) => (
                                        <span key={i} className="bg-white border border-blue-100 text-slate-600 px-3 py-1.5 rounded-lg text-sm font-medium shadow-sm">
                                            {typeof model === 'object' ? model.name : model}
                                        </span>
                                    ))}
                                </div>
                                {(product.compatibleModels?.length > 2 || !product.model) && (
                                    <button className="text-brand-600 text-sm font-semibold hover:underline">
                                        See all supported models
                                    </button>
                                )}
                            </div>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                                <button
                                    onClick={addToCartHandler}
                                    disabled={product.countInStock === 0}
                                    className={`flex-1 h-14 rounded-full font-bold text-lg transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                                        addedToCart
                                            ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                                            : 'bg-brand-600 text-white hover:bg-brand-700 hover:-translate-y-1 hover:shadow-brand-600/30'
                                    }`}
                                >
                                    {addedToCart ? <><FaCheck /> Added</> : <><FaShoppingCart /> Add to Cart</>}
                                </button>
                                <button
                                    disabled={product.countInStock === 0}
                                    className="flex-1 h-14 rounded-full font-bold text-lg transition-all shadow-md flex items-center justify-center gap-2 bg-[#FF8A00] text-white hover:bg-[#E67A00] hover:-translate-y-1 hover:shadow-[#FF8A00]/30 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Buy Now
                                </button>
                            </div>

                            {/* Logistics info */}
                            <div className="grid grid-cols-2 gap-4 bg-white rounded-[20px] p-5 border border-slate-100 shadow-sm">
                                <div className="flex flex-col">
                                    <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Delivery</span>
                                    <span className="text-slate-800 font-bold text-sm">Free next-day delivery</span>
                                </div>
                                <div className="flex flex-col border-l border-slate-100 pl-4">
                                    <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Returns</span>
                                    <span className="text-slate-800 font-bold text-sm">7 Days Replacement</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="mb-16">
                    <h2 className="text-2xl font-bold text-[#0F172A] mb-8">Premium Features</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        {mockFeatures.map((feat, index) => (
                            <motion.div 
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-100 hover:shadow-md hover:border-brand-200 transition-all group"
                            >
                                <div className="w-12 h-12 bg-slate-50 text-brand-600 rounded-2xl flex items-center justify-center text-xl mb-5 group-hover:scale-110 group-hover:bg-brand-50 transition-all">
                                    {feat.icon}
                                </div>
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{feat.title}</h4>
                                <h3 className="text-lg font-bold text-slate-800 mb-2">{feat.value}</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">{feat.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Specifications & Description */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mb-16">
                    {/* Description text */}
                    <div>
                        <h2 className="text-2xl font-bold text-[#0F172A] mb-6">Product Description</h2>
                        <div className="prose prose-slate max-w-none text-slate-600">
                            <p className="text-lg leading-relaxed mb-4">{product.description}</p>
                            <p className="leading-relaxed">
                                Experience ultimate performance with the new {product.name}. Designed to perfectly complement your {product.model ? (typeof product.model === 'object' ? product.model.name : product.model) : 'device'}, this premium accessory ensures long-lasting durability and optimal functionality. Manufactured with the highest quality standards.
                            </p>
                        </div>
                    </div>

                    {/* Specifications Table */}
                    {product.specifications && Object.keys(product.specifications).length > 0 && (
                        <div>
                            <h2 className="text-2xl font-bold text-[#0F172A] mb-6">Technical Specifications</h2>
                            <div className="bg-white rounded-[24px] border border-slate-200 overflow-hidden shadow-sm">
                                <table className="w-full text-left border-collapse">
                                    <tbody>
                                        {Object.entries(product.specifications).map(([key, value], index) => (
                                            <tr key={key} className={index % 2 === 0 ? 'bg-slate-50/50' : 'bg-white'}>
                                                <th className="py-4 px-6 text-sm font-semibold text-slate-700 border-b border-slate-100 w-1/3">
                                                    {key}
                                                </th>
                                                <td className="py-4 px-6 text-sm text-slate-600 border-b border-slate-100">
                                                    {value}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

                {/* Customer Reviews Section */}
                <div className="mb-20">
                    <h2 className="text-2xl font-bold text-[#0F172A] mb-8">Customer Reviews</h2>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                        {/* Rating summary */}
                        <div className="md:col-span-4 bg-white p-8 rounded-[24px] border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
                            <div className="text-6xl font-bold text-[#0F172A] tracking-tighter mb-2">{rating}</div>
                            <div className="flex text-amber-400 text-xl gap-1 mb-2">
                                <FaStar /><FaStar /><FaStar /><FaStar /><FaStarHalfAlt />
                            </div>
                            <p className="text-slate-500 font-medium mb-6">Based on {numReviews} reviews</p>
                            <button className="w-full py-3.5 border-2 border-slate-200 rounded-xl font-bold text-slate-700 hover:border-brand-600 hover:text-brand-600 transition-colors">
                                Write a Review
                            </button>
                        </div>

                        {/* Review Cards */}
                        <div className="md:col-span-8 space-y-4">
                            {[1, 2].map((review) => (
                                <div key={review} className="bg-white p-6 rounded-[20px] border border-slate-100 shadow-sm">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h4 className="font-bold text-slate-800">John Doe</h4>
                                            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                                                <FaCheck size={10} /> Verified Buyer
                                            </span>
                                        </div>
                                        <div className="flex text-amber-400 text-sm gap-0.5">
                                            <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                                        </div>
                                    </div>
                                    <h5 className="font-bold text-slate-800 mb-2">Excellent quality, works perfectly</h5>
                                    <p className="text-slate-600 text-sm leading-relaxed mb-4">
                                        I was skeptical at first, but this product exceeded my expectations. The build quality is premium, and it perfectly matches the aesthetics of my phone. Fast delivery too!
                                    </p>
                                    <button className="text-slate-400 text-xs font-semibold hover:text-slate-700 transition-colors flex items-center gap-1">
                                        Helpful? (12)
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Related Products Carousel */}
                {relatedProducts.length > 0 && (
                    <div className="mb-12">
                        <div className="flex justify-between items-end mb-8">
                            <h2 className="text-2xl font-bold text-[#0F172A]">Frequently Bought Together</h2>
                            <button className="hidden md:flex items-center gap-2 text-brand-600 font-semibold hover:underline">
                                View All <FaChevronRight size={12} />
                            </button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                            {relatedProducts.map((relatedProduct) => (
                                <div key={relatedProduct._id} className="h-full">
                                    <ProductCard product={relatedProduct} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Mobile Sticky CTA */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 pb-safe flex gap-3 z-40 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
                <div className="flex-1 flex flex-col justify-center pl-2">
                    <span className="text-xs text-slate-500 font-medium">Total Price</span>
                    <span className="text-xl font-bold text-slate-900">₹{product.price.toLocaleString()}</span>
                </div>
                <button
                    onClick={addToCartHandler}
                    disabled={product.countInStock === 0}
                    className="flex-[1.5] h-14 bg-brand-600 text-white rounded-full font-bold shadow-md shadow-brand-600/20 disabled:opacity-50"
                >
                    Add to Cart
                </button>
            </div>
        </div>
    );
};

export default ProductDetailsPage;

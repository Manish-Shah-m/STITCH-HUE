
// for navbar 

window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});
document.querySelector('.hamburger').addEventListener('click', function() {
    document.querySelector('.nav-links').classList.toggle('active');
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function() {
        if (window.innerWidth <= 768) {
            document.querySelector('.nav-links').classList.remove('active');
        }
    });
});

// Close mobile menu when resizing to desktop
window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
        document.querySelector('.nav-links').classList.remove('active');
    }
});





// for API 
   // Elements
   const productsContainer = document.getElementById('products-container');
   const categoryTabs = document.querySelectorAll('.category-tab');
   const spinner = document.getElementById('spinner');
   const errorMessage = document.getElementById('error-message');
   const loadMoreBtn = document.getElementById('load-more');
   
   let currentCategory = 'all';
   let allProducts = [];
   let displayedProducts = 8; // Initial number of products to display
   
   // Fetch products from API
   async function fetchProducts() {
       spinner.style.display = 'block';
       errorMessage.style.display = 'none';
       
       try {
           const response = await fetch('https://fakestoreapi.com/products');
           if (!response.ok) throw new Error('Failed to fetch products');
           
           allProducts = await response.json();
           renderProducts();
       } catch (error) {
           console.error('Error:', error);
           errorMessage.style.display = 'block';
           spinner.style.display = 'none';
       }
   }
   
   // Render products based on current category and display limit
   function renderProducts() {
       productsContainer.innerHTML = '';
       
       // Filter products by category
       const filteredProducts = currentCategory === 'all' 
           ? allProducts 
           : allProducts.filter(product => product.category === currentCategory);
       
       // Get products to display
       const visibleProducts = filteredProducts.slice(0, displayedProducts);
       
       // Create and append product cards
       visibleProducts.forEach(product => {
           const hasDiscount = Math.random() < 0.7;
           const discountPercent = hasDiscount ? Math.floor(Math.random() * 46) + 5 : 0;
           const originalPrice = hasDiscount 
               ? (product.price / (1 - discountPercent/100)).toFixed(2) 
               : product.price;
           
           const productCard = document.createElement('div');
           productCard.className = 'col-md-3';
           productCard.innerHTML = `
               <div class="product-card">
                   ${hasDiscount ? `<span class="sale-badge">${discountPercent}% Off</span>` : ''}
                   <div class="product-image-container">
                       <img src="${product.image}" alt="${product.title}">
                   </div>
                   <div class="product-info">
                       <div>
                           <p class="product-category">${product.category}</p>
                           <h3 class="product-title">${product.title}</h3>
                           <div class="product-rating">
                               <span class="rating-stars">${getStarRating(product.rating.rate)}</span>
                               <span class="rating-count">(${product.rating.count})</span>
                           </div>
                       </div>
                       <p class="product-price">
                           $${product.price}
                           ${hasDiscount ? `<span class="original-price">$${originalPrice}</span>` : ''}
                       </p>
                   </div>
               </div>
           `;
           
           productsContainer.appendChild(productCard);
       });
       
       // Update UI state
       spinner.style.display = 'none';
       loadMoreBtn.style.display = visibleProducts.length >= filteredProducts.length ? 'none' : 'inline-flex';
   }
   
   // Generate star rating HTML
   function getStarRating(rating) {
       const fullStars = Math.floor(rating);
       const hasHalfStar = rating % 1 >= 0.5;
       const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
       
       return '★'.repeat(fullStars) + 
              (hasHalfStar ? '½' : '') + 
              '☆'.repeat(emptyStars);
   }
   
   // Set up event listeners
   categoryTabs.forEach(tab => {
       tab.addEventListener('click', () => {
           categoryTabs.forEach(t => t.classList.remove('active'));
           tab.classList.add('active');
           currentCategory = tab.getAttribute('data-category');
           displayedProducts = 8;
           renderProducts();
       });
   });
   
   loadMoreBtn.addEventListener('click', () => {
       displayedProducts += 4;
       renderProducts();
   });
   
   // Initialize
   fetchProducts();
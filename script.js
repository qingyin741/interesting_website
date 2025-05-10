// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // DOM 元素
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const websitesGrid = document.getElementById('websitesGrid');
    const categoryTabs = document.querySelectorAll('.tab-btn');
    
    // 创建网站卡片
    function createWebsiteCard(site) {
        const card = document.createElement('div');
        card.className = 'website-card';
        card.setAttribute('data-category', site.category);
        
        const tagsHtml = site.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
        
        card.innerHTML = `
            <div class="card-header">
                <img src="https://via.placeholder.com/60" alt="${site.name} Icon" class="site-icon">
                <h3>${site.name}</h3>
            </div>
            <p class="description">${site.description}</p>
            <div class="card-footer">
                <div class="tags">
                    ${tagsHtml}
                </div>
                <a href="${site.url}" target="_blank" class="visit-btn">访问 <i class="fas fa-external-link-alt"></i></a>
            </div>
        `;
        
        websitesGrid.appendChild(card);
    }
    
    // 分类过滤功能
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // 移除所有标签的活动状态
            categoryTabs.forEach(t => t.classList.remove('active'));
            // 添加当前标签的活动状态
            this.classList.add('active');
            
            const category = this.getAttribute('data-category');
            filterWebsites(category);
        });
    });
    
    // 过滤网站
    function filterWebsites(category) {
        const cards = document.querySelectorAll('.website-card');
        
        cards.forEach(card => {
            if (category === 'all' || card.getAttribute('data-category') === category) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    // 搜索功能
    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    searchInput.addEventListener('input', debounce(performSearch, 300));
    
    // 防抖函数
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func.apply(this, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // 执行搜索
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            // 如果搜索词为空，重置为显示所有
            const activeTab = document.querySelector('.tab-btn.active');
            const activeCategory = activeTab.getAttribute('data-category');
            filterWebsites(activeCategory);
            return;
        }
        
        const cards = document.querySelectorAll('.website-card');
        
        cards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('.description').textContent.toLowerCase();
            const tags = Array.from(card.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase());
            
            // 如果标题、描述或标签中包含搜索词，则显示
            if (
                title.includes(searchTerm) || 
                description.includes(searchTerm) || 
                tags.some(tag => tag.includes(searchTerm))
            ) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    }
    
});

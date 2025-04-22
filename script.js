// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // DOM 元素
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const websitesGrid = document.getElementById('websitesGrid');
    const categoryTabs = document.querySelectorAll('.tab-btn');
    const addSiteBtn = document.getElementById('addSiteBtn');
    const addSiteModal = document.getElementById('addSiteModal');
    const closeModal = document.querySelector('.close');
    const addSiteForm = document.getElementById('addSiteForm');
    
    // 本地存储键
    const STORAGE_KEY = 'interestingWebsites';
    
    // 初始化网站数据
    let websitesData = getStoredWebsites();
    
    // 从本地存储加载网站数据
    function getStoredWebsites() {
        const storedData = localStorage.getItem(STORAGE_KEY);
        if (storedData) {
            return JSON.parse(storedData);
        }
        return []; // 如果没有存储数据，返回空数组
    }
    
    // 保存网站数据到本地存储
    function saveWebsites() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(websitesData));
    }
    
    // 渲染存储的网站
    function renderStoredWebsites() {
        // 只渲染用户添加的网站
        websitesData.forEach(site => {
            createWebsiteCard(site);
        });
    }
    
    // 渲染存储的网站
    renderStoredWebsites();
    
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
    
    // 添加网站模态框
    addSiteBtn.addEventListener('click', function() {
        addSiteModal.style.display = 'block';
    });
    
    // 关闭模态框
    closeModal.addEventListener('click', function() {
        addSiteModal.style.display = 'none';
    });
    
    // 点击模态框外部关闭
    window.addEventListener('click', function(event) {
        if (event.target === addSiteModal) {
            addSiteModal.style.display = 'none';
        }
    });
    
    // 提交添加网站表单
    addSiteForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 获取表单数据
        const siteName = document.getElementById('siteName').value.trim();
        const siteUrl = document.getElementById('siteUrl').value.trim();
        const siteDescription = document.getElementById('siteDescription').value.trim();
        const siteCategory = document.getElementById('siteCategory').value;
        const siteTags = document.getElementById('siteTags').value.split(',')
            .map(tag => tag.trim())
            .filter(tag => tag !== '');
        
        // 创建新网站对象
        const newSite = {
            name: siteName,
            url: siteUrl,
            description: siteDescription,
            category: siteCategory,
            tags: siteTags
        };
        
        // 添加到数据数组
        websitesData.push(newSite);
        
        // 保存到本地存储
        saveWebsites();
        
        // 创建并添加到网格
        createWebsiteCard(newSite);
        
        // 重置表单并关闭模态框
        addSiteForm.reset();
        addSiteModal.style.display = 'none';
        
        // 通知用户
        alert('网站已成功添加！');
    });
}); 
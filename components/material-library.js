/* 底部材质库样式 */
.material-library {
    height: 200px;
    background-color: var(--secondary-bg);
    border-top: 1px solid var(--border-color);
    display: flex;
    flex-shrink: 0;
}

.material-library .sidebar {
    width: 200px;
    padding: 10px 0;
    border-right: 1px solid var(--border-color);
    overflow-y: auto;
    flex-shrink: 0;
}

.material-library .sidebar .tree-item {
    padding: 8px 15px;
    cursor: pointer;
    color: var(--text-muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: flex;
    align-items: center;
    border-radius: 4px;
}

.material-library .sidebar .tree-item:hover {
    background-color: var(--tree-hover-bg);
    color: var(--text-color);
}

.material-library .sidebar .tree-item.active {
    background-color: var(--tree-active-bg);
    color: var(--text-color);
    font-weight: bold;
}

.material-library .sidebar .tree-item .icon {
    margin-right: 8px;
    color: var(--folder-icon-color);
}

.material-library .sidebar .tree-item .arrow-icon {
    margin-right: 5px;
    font-size: 10px;
    width: 12px;
    text-align: center;
}

.material-library .material-grid {
    flex-grow: 1;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 10px;
    padding: 10px;
    overflow-y: auto;
    overflow-x: hidden;
}

.material-library .material-card {
    background-color: var(--tertiary-bg);
    border: 1px solid var(--border-color);
    border-radius: 6px;
    padding: 8px;
    text-align: center;
    cursor: grab;
    transition: border-color 0.2s ease-in-out, transform 0.1s;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    height: 100px;
    box-sizing: border-box;
}

.material-library .material-card:hover {
    border-color: var(--material-card-hover-border);
    transform: scale(1.02);
}

.material-library .material-card:active {
    cursor: grabbing;
}

.material-library .material-card.dragging {
    opacity: 0.5;
}

.material-library .material-card .sphere-preview {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-bottom: 5px;
    flex-shrink: 0;
    box-shadow: inset -5px -5px 10px rgba(0,0,0,0.5);
}

/* 材质球颜色 */
.sphere-gray { background: radial-gradient(circle at 30% 30%, #e0e0e0, #888888); }
.sphere-red { background: radial-gradient(circle at 30% 30%, #ff6b6b, #b30000); }
.sphere-blue { background: radial-gradient(circle at 30% 30%, #6b9cff, #004d99); }
.sphere-yellow { background: radial-gradient(circle at 30% 30%, #fffb8f, #e0a800); }
.sphere-black { background: radial-gradient(circle at 30% 30%, #555, #000); }
.sphere-green { background: radial-gradient(circle at 30% 30%, #90ee90, #228b22); }
.sphere-glossy-white { background: radial-gradient(circle at 30% 30%, #fff, #ccc); }

.material-library .material-card .material-name {
    font-size: 12px;
    color: var(--text-muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
}

// 材质库数据
const materialData = {
    categories: [
        { id: 'all', name: '所有材质', expanded: true },
        { id: 'decoration', name: '公共区装修', expanded: false, parent: 'all' },
        { id: 'device', name: '设备材质', expanded: false, parent: 'all' },
        { id: 'special', name: '特殊材质', expanded: false, parent: 'all' }
    ],
    materials: [
        { id: 'mat1', name: '装修地面', color: 'gray', category: 'decoration' },
        { id: 'mat2', name: '地砖', color: 'gray2', category: 'decoration' },
        { id: 'mat3', name: '栏杆-玻璃', color: 'black', category: 'decoration' },
        { id: 'mat4', name: '白色灯光', color: 'white', category: 'decoration' },
        { id: 'mat5', name: '消防红色', color: 'red', category: 'special' },
        { id: 'mat6', name: '安全出口', color: 'green', category: 'special' },
        { id: 'mat7', name: '警示黄', color: 'yellow', category: 'special' },
        { id: 'mat8', name: '海洋蓝', color: 'blue', category: 'device' }
    ]
};

// 材质颜色映射
const colorMap = {
    'gray': '#888888',
    'gray2': '#999999',
    'black': '#000000',
    'white': '#cccccc',
    'red': '#b30000',
    'green': '#228b22',
    'yellow': '#e0a800',
    'blue': '#004d99'
};

// 材质球颜色类名映射
const sphereClassMap = {
    'gray': 'sphere-gray',
    'gray2': 'sphere-gray',
    'black': 'sphere-black',
    'white': 'sphere-glossy-white',
    'red': 'sphere-red',
    'green': 'sphere-green',
    'yellow': 'sphere-yellow',
    'blue': 'sphere-blue'
};

// 渲染材质库目录
function renderMaterialCategories() {
    const container = document.getElementById('material-categories');
    if (!container) return;

    materialData.categories.forEach(cat => {
        const item = document.createElement('div');
        item.className = 'tree-item';
        if (cat.id === 'all') item.classList.add('active');
        item.dataset.id = cat.id;
        item.innerHTML = `
            <span class="arrow-icon">${cat.expanded ? '▼' : '▶'}</span>
            <span class="icon">📂</span>
            ${cat.name}
        `;

        item.addEventListener('click', () => {
            document.querySelectorAll('.material-library .sidebar .tree-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            renderMaterialGrid(cat.id);
        });

        container.appendChild(item);
    });
}

// 渲染材质卡片
function renderMaterialGrid(categoryId) {
    const container = document.getElementById('material-grid');
    if (!container) return;

    const materials = categoryId === 'all'
        ? materialData.materials
        : materialData.materials.filter(m => m.category === categoryId);

    container.innerHTML = '';

    materials.forEach(mat => {
        const card = document.createElement('div');
        card.className = 'material-card';
        card.draggable = true;
        card.dataset.material = mat.color;
        card.dataset.id = mat.id;
        card.dataset.name = mat.name;

        card.innerHTML = `
            <div class="sphere-preview ${sphereClassMap[mat.color] || 'sphere-gray'}"></div>
            <div class="material-name">${mat.name}</div>
        `;

        // 拖拽事件
        card.addEventListener('dragstart', (e) => {
            const materialData = {
                id: mat.id,
                name: mat.name,
                color: mat.color
            };
            e.dataTransfer.setData('application/json', JSON.stringify(materialData));
            e.dataTransfer.effectAllowed = 'copy';
            card.classList.add('dragging');
        });

        card.addEventListener('dragend', () => {
            card.classList.remove('dragging');
        });

        // 点击事件
        card.addEventListener('click', () => {
            // 通知父页面选中的材质
            if (window.parent !== window) {
                window.parent.postMessage({ type: 'material-selected', material: mat }, '*');
            }
        });

        container.appendChild(card);
    });
}

// 初始化材质库
document.addEventListener('DOMContentLoaded', () => {
    renderMaterialCategories();
    renderMaterialGrid('all');
});
/* 左侧场景树样式 */
.scene-graph {
    width: 280px;
    background-color: var(--secondary-bg);
    border-right: 1px solid var(--border-color);
    padding: 15px;
    box-sizing: border-box;
    overflow-y: auto;
    flex-shrink: 0;
}

.scene-graph h2 {
    font-size: 16px;
    color: var(--text-color);
    margin-top: 0;
    margin-bottom: 15px;
    border-bottom: 1px solid var(--border-color);
    padding-bottom: 10px;
}

.scene-node {
    padding: 6px 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    color: var(--text-muted);
    font-size: 13px;
    user-select: none;
    border-radius: 4px;
}

.scene-node:hover {
    color: var(--text-color);
    background-color: var(--tree-hover-bg);
}

.scene-node.active {
    color: var(--accent-color);
    background-color: var(--tree-active-bg);
}

.scene-node .toggle {
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 4px;
    flex-shrink: 0;
}

.scene-node .toggle::before {
    content: '';
    width: 0;
    height: 0;
    border-left: 4px solid #8a8a9f;
    border-top: 3px solid transparent;
    border-bottom: 3px solid transparent;
    transition: transform 0.15s;
}

.scene-node.expanded > .toggle::before {
    transform: rotate(90deg);
}

.scene-node .type-icon {
    margin-right: 6px;
    font-size: 14px;
    width: 18px;
    text-align: center;
}

/* 节点类型图标颜色 */
.scene-node .type-icon.obj { color: #3498db; }
.scene-node .type-icon.group { color: #f1c40f; }
.scene-node .type-icon.mesh { color: #2ecc71; }

/* 节点数据 */
const sceneTreeData = {
    nodes: [
        {
            id: 'device1',
            name: '出站检票机(E3A)',
            type: 'obj',
            expanded: true,
            children: [
                {
                    id: 'obj002',
                    name: 'Object002',
                    type: 'group',
                    expanded: true,
                    children: [
                        { id: 'mesh1', name: 'Mesh', type: 'mesh' },
                        { id: 'mesh2', name: 'Mesh_1', type: 'mesh' },
                        { id: 'mesh3', name: 'Mesh_2', type: 'mesh' }
                    ]
                },
                {
                    id: 'obj003',
                    name: 'Object003',
                    type: 'group',
                    expanded: false,
                    children: [
                        { id: 'mesh4', name: 'Mesh', type: 'mesh' },
                        { id: 'mesh5', name: 'Mesh_1', type: 'mesh' }
                    ]
                },
                {
                    id: 'obj004',
                    name: 'Object004',
                    type: 'group',
                    expanded: false,
                    children: [
                        { id: 'mesh6', name: 'Mesh', type: 'mesh' },
                        { id: 'mesh7', name: 'Mesh_1', type: 'mesh' }
                    ]
                },
                {
                    id: 'obj005',
                    name: 'Object005',
                    type: 'group',
                    expanded: false,
                    children: [
                        { id: 'mesh8', name: 'Mesh', type: 'mesh' }
                    ]
                }
            ]
        }
    ]
};

// 节点类型图标映射
const typeIcons = {
    obj: '📦',
    group: '📁',
    mesh: '◇'
};

// 渲染场景树
function renderSceneTree() {
    const container = document.getElementById('scene-tree-container');
    if (!container) return;

    const buildNode = (node, level = 0) => {
        const div = document.createElement('div');
        div.className = 'scene-node';
        if (node.expanded) div.classList.add('expanded');
        div.style.paddingLeft = (level * 24) + 'px';
        div.dataset.id = node.id;

        // 展开/收起箭头
        const toggle = document.createElement('span');
        toggle.className = 'toggle';
        div.appendChild(toggle);

        // 类型图标
        const icon = document.createElement('span');
        icon.className = `type-icon ${node.type}`;
        icon.textContent = typeIcons[node.type] || '•';
        div.appendChild(icon);

        // 节点名称
        const name = document.createElement('span');
        name.textContent = node.name;
        div.appendChild(name);

        // 点击事件
        div.addEventListener('click', () => {
            // 切换选中状态
            document.querySelectorAll('.scene-node').forEach(n => n.classList.remove('active'));
            div.classList.add('active');

            // 通知父页面选中的节点
            if (window.parent !== window) {
                window.parent.postMessage({ type: 'node-selected', node: node }, '*');
            }
        });

        // 展开/收起事件
        if (node.children && node.children.length > 0) {
            div.addEventListener('click', (e) => {
                if (e.target.classList.contains('toggle') || e.target === div) {
                    div.classList.toggle('expanded');
                }
            });
        }

        return div;
    };

    const render = (nodes, parent) => {
        nodes.forEach(node => {
            const nodeEl = buildNode(node, node.level || 0);
            parent.appendChild(nodeEl);
            if (node.children && node.expanded) {
                node.children.forEach(c => { c.level = (node.level || 0) + 1; });
                render(node.children, parent);
            }
        });
    };

    container.innerHTML = '';
    render(sceneTreeData.nodes, container);
}

// 页面加载完成后渲染
document.addEventListener('DOMContentLoaded', renderSceneTree);
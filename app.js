(function () {
    const faceCN = {
      front:"正面",
      top:"顶部",
      left:"左侧",
      back:"背面",
      bottom:"底部",
      right:"右侧"
    };

    const defaultState = {
      front:{materialName:"出站检票机-外壳", color:"#bfc1bc", nodeTitle:"出站检票机-外壳", path:"Object002 / Mesh", roughness:"0.86", metalness:"0.00", opacity:"1.00", transparent:"是", type:"物理(Physical)", side:"双面(DoubleSide)"},
      top:{materialName:"白色灯光", color:"#ffffff", nodeTitle:"顶部饰板", path:"Object002 / Mesh_1", roughness:"0.86", metalness:"0.00", opacity:"1.00", transparent:"是", type:"物理(Physical)", side:"双面(DoubleSide)"},
      left:{materialName:"世誉-玻璃", color:"#1b1b1f", nodeTitle:"左侧面板", path:"Object002 / Mesh_2", roughness:"0.86", metalness:"0.00", opacity:"1.00", transparent:"是", type:"物理(Physical)", side:"双面(DoubleSide)"},
      back:{materialName:"装饰地面", color:"#c9c9c5", nodeTitle:"背部外壳", path:"Object003 / Mesh", roughness:"0.86", metalness:"0.00", opacity:"1.00", transparent:"是", type:"物理(Physical)", side:"双面(DoubleSide)"},
      bottom:{materialName:"警示黄", color:"#f0d93a", nodeTitle:"底部结构", path:"Object003 / Mesh_1", roughness:"0.86", metalness:"0.00", opacity:"1.00", transparent:"是", type:"物理(Physical)", side:"双面(DoubleSide)"},
      right:{materialName:"消隐蓝", color:"#4f8fe9", nodeTitle:"右侧面板", path:"Object004 / Mesh", roughness:"0.86", metalness:"0.00", opacity:"1.00", transparent:"是", type:"物理(Physical)", side:"双面(DoubleSide)"}
    };

    const state = JSON.parse(JSON.stringify(defaultState));
    let selectedFace = null;
    let selectedMeshEl = null;

    const meshNodes = Array.from(document.querySelectorAll(".tree-row.mesh"));
    const faceEls = Array.from(document.querySelectorAll(".face"));
    const folderNodes = Array.from(document.querySelectorAll(".tree-node[data-folder]"));
    const propPanel = document.getElementById("propPanel");
    const emptyState = document.getElementById("emptyState");

    const selectedBall = document.getElementById("selectedBall");
    const selectedMaterialName = document.getElementById("selectedMaterialName");
    const selectedFaceTag = document.getElementById("selectedFaceTag");
    const selectedNodeName = document.getElementById("selectedNodeName");
    const selectedNodePath = document.getElementById("selectedNodePath");
    const colorPicker = document.getElementById("colorPicker");
    const colorText = document.getElementById("colorText");
    const roughnessRange = document.getElementById("roughnessRange");
    const roughnessValue = document.getElementById("roughnessValue");
    const metalnessRange = document.getElementById("metalnessRange");
    const metalnessValue = document.getElementById("metalnessValue");
    const tipsText = document.getElementById("tipsText");

    function renderFace(faceKey){
      const item = state[faceKey];
      const ball = document.getElementById("ball-" + faceKey);
      const name = document.getElementById("name-" + faceKey);
      const path = document.getElementById("path-" + faceKey);
      if (ball) ball.style.background = item.color;
      if (name) name.textContent = item.materialName;
      if (path) path.textContent = item.path;
    }

    function renderAllFaces(){
      Object.keys(state).forEach(renderFace);
    }

    function showPanel(){
      emptyState.style.display = "none";
      propPanel.classList.add("visible");
    }

    function hidePanel(){
      propPanel.classList.remove("visible");
      emptyState.style.display = "flex";
    }

    function resetActiveStyles(){
      meshNodes.forEach(n => n.classList.remove("active"));
      faceEls.forEach(f => f.classList.remove("active"));
    }

    function syncPanel(faceKey){
      const item = state[faceKey];
      selectedFaceTag.textContent = faceCN[faceKey];
      selectedNodeName.textContent = item.nodeTitle;
      selectedNodePath.textContent = item.path;
      selectedBall.style.background = item.color;
      selectedMaterialName.textContent = item.materialName;
      colorPicker.value = item.color;
      colorText.value = item.color.toUpperCase();
      roughnessRange.value = item.roughness;
      roughnessValue.textContent = Number(item.roughness).toFixed(2);
      metalnessRange.value = item.metalness;
      metalnessValue.textContent = Number(item.metalness).toFixed(2);
      tipsText.textContent = "当前已选中" + faceCN[faceKey] + "节点，可编辑颜色、粗糙度、金属度，也可拖拽材质直接替换。";
    }

    function selectFace(faceKey, meshEl){
      selectedFace = faceKey;
      if (meshEl) {
        selectedMeshEl = meshEl;
        state[faceKey].nodeTitle = meshEl.dataset.nodeTitle || state[faceKey].nodeTitle;
        state[faceKey].path = meshEl.dataset.path || state[faceKey].path;
      }
      resetActiveStyles();
      const faceEl = document.querySelector('.face[data-face="' + faceKey + '"]');
      if (faceEl) faceEl.classList.add("active");
      if (meshEl) {
        meshEl.classList.add("active");
      } else if (selectedMeshEl && selectedMeshEl.dataset.face === faceKey) {
        selectedMeshEl.classList.add("active");
      } else {
        const firstMatch = document.querySelector('.tree-row.mesh[data-face="' + faceKey + '"]');
        if (firstMatch) {
          firstMatch.classList.add("active");
          selectedMeshEl = firstMatch;
          state[faceKey].nodeTitle = firstMatch.dataset.nodeTitle || state[faceKey].nodeTitle;
          state[faceKey].path = firstMatch.dataset.path || state[faceKey].path;
        }
      }
      renderFace(faceKey);
      syncPanel(faceKey);
      showPanel();
    }

    // 节点树展开/收起
    folderNodes.forEach(node => {
      const row = node.querySelector(":scope > .tree-row.folder");
      if (!row) return;
      row.addEventListener("click", function () {
        node.classList.toggle("collapsed");
      });
    });

    // Mesh节点点击
    meshNodes.forEach(node => {
      node.addEventListener("click", function (e) {
        if (e.target.closest(".tree-btns")) return;
        e.stopPropagation();
        const faceKey = node.dataset.face;
        selectFace(faceKey, node);
      });
    });

    // 节点显隐按钮
    document.querySelectorAll(".tree-btn.visibility").forEach(btn => {
      btn.addEventListener("click", function(e){
        e.stopPropagation();
        const row = this.closest(".tree-row.mesh");
        const faceKey = row.dataset.face;
        this.classList.toggle("hidden");
        const faceEl = document.querySelector('.face[data-face="' + faceKey + '"]');
        if(faceEl){
          faceEl.classList.toggle("hidden-face");
        }
      });
    });

    // 节点聚焦按钮
    document.querySelectorAll(".tree-btn.focus").forEach(btn => {
      btn.addEventListener("click", function(e){
        e.stopPropagation();
        const row = this.closest(".tree-row.mesh");
        const faceKey = row.dataset.face;
        this.classList.toggle("focus");
        const faceEl = document.querySelector('.face[data-face="' + faceKey + '"]');
        if(faceEl){
          faceEl.classList.toggle("focused-face");
        }
      });
    });

    // 材质搜索
    const materialSearch = document.getElementById("materialSearch");
    if(materialSearch){
      materialSearch.addEventListener("input", function(){
        const kw = this.value.toLowerCase();
        document.querySelectorAll(".asset").forEach(asset =>{
          const name = asset.dataset.name || "";
          asset.style.display = name.toLowerCase().includes(kw) ? "flex" : "none";
        });
      });
    }

    // 面点击和拖拽
    faceEls.forEach(face => {
      face.addEventListener("click", function () {
        const faceKey = face.dataset.face;
        selectFace(faceKey);
      });

      face.addEventListener("dragover", function (e) {
        e.preventDefault();
        face.classList.add("drop-over");
        const faceKey = face.dataset.face;
        // 实时预览：显示该面信息，左侧节点高亮
        previewFace(faceKey);
      });

      face.addEventListener("dragleave", function () {
        face.classList.remove("drop-over");
        // 离开时恢复之前选中的面
        if (selectedFace) {
          selectFace(selectedFace);
        } else {
          hidePanel();
        }
      });

      face.addEventListener("drop", function (e) {
        e.preventDefault();
        face.classList.remove("drop-over");
        const raw = e.dataTransfer.getData("text/plain");
        if (!raw) return;
        const data = JSON.parse(raw);
        const faceKey = face.dataset.face;
        state[faceKey].materialName = data.name;
        state[faceKey].color = data.color;
        renderFace(faceKey);
        selectFace(faceKey);
      });
    });

    // 实时预览函数
    function previewFace(faceKey) {
      const item = state[faceKey];
      // 显示面板
      emptyState.style.display = "none";
      propPanel.classList.add("visible");
      // 更新面板内容
      selectedFaceTag.textContent = faceCN[faceKey];
      selectedNodeName.textContent = item.nodeTitle;
      selectedNodePath.textContent = item.path;
      selectedBall.style.background = item.color;
      selectedMaterialName.textContent = item.materialName;
      colorPicker.value = item.color;
      colorText.value = item.color.toUpperCase();
      roughnessRange.value = item.roughness;
      roughnessValue.textContent = Number(item.roughness).toFixed(2);
      metalnessRange.value = item.metalness;
      metalnessValue.textContent = Number(item.metalness).toFixed(2);
      tipsText.textContent = "预览：拖拽到此处将应用「" + item.materialName + "」材质";
      // 高亮左侧对应节点
      resetActiveStyles();
      const meshEl = document.querySelector('.tree-row.mesh[data-face="' + faceKey + '"]');
      if (meshEl) meshEl.classList.add("active");
      faceEls.forEach(f => f.classList.remove("active"));
      face.classList.add("active");
    }

    // 材质资产拖拽
    document.querySelectorAll(".asset").forEach(asset => {
      asset.addEventListener("dragstart", function (e) {
        e.dataTransfer.setData("text/plain", JSON.stringify({
          name: asset.dataset.name,
          color: asset.dataset.color
        }));
      });

      asset.addEventListener("dblclick", function () {
        if (!selectedFace) return;
        state[selectedFace].materialName = asset.dataset.name;
        state[selectedFace].color = asset.dataset.color;
        renderFace(selectedFace);
        syncPanel(selectedFace);
      });
    });

    // 颜色选择器
    colorPicker.addEventListener("input", function () {
      if (!selectedFace) return;
      state[selectedFace].color = colorPicker.value;
      renderFace(selectedFace);
      syncPanel(selectedFace);
    });

    colorText.addEventListener("change", function () {
      if (!selectedFace) return;
      let v = colorText.value.trim();
      if (!v.startsWith("#")) v = "#" + v;
      if (/^#[0-9a-fA-F]{6}$/.test(v)) {
        state[selectedFace].color = v;
        renderFace(selectedFace);
        syncPanel(selectedFace);
      } else {
        colorText.value = state[selectedFace].color.toUpperCase();
      }
    });

    // 粗糙度
    roughnessRange.addEventListener("input", function () {
      if (!selectedFace) return;
      state[selectedFace].roughness = roughnessRange.value;
      roughnessValue.textContent = Number(roughnessRange.value).toFixed(2);
    });

    // 金属度
    metalnessRange.addEventListener("input", function () {
      if (!selectedFace) return;
      state[selectedFace].metalness = metalnessRange.value;
      metalnessValue.textContent = Number(metalnessRange.value).toFixed(2);
    });

    // 材质库目录 - 点击展开/收起 + 筛选
    document.querySelectorAll(".lib-folder .folder-item").forEach(item => {
      item.addEventListener("click", function (e) {
        e.stopPropagation();
        const folder = this.closest(".lib-folder");
        const isClickingSame = this.classList.contains("active");
        const folderName = folder.dataset.folder;

        // 切换 active 状态
        document.querySelectorAll(".lib-folder .folder-item").forEach(i => i.classList.remove("active"));
        this.classList.add("active");

        // 筛选对应材质的文件夹
        document.querySelectorAll(".asset").forEach(asset => {
          if (folderName === "all") {
            asset.style.display = "flex";
          } else {
            asset.style.display = asset.dataset.folder === folderName ? "flex" : "none";
          }
        });

        // 展开/收起文件夹
        folder.classList.toggle("collapsed");
      });
    });

    // 默认展开"所有材质"文件夹
    document.querySelector('.lib-folder[data-folder="all"]')?.classList.remove("collapsed");

    // 场景按钮
    document.getElementById("saveBtn").addEventListener("click", function () {
      // 收集当前所有面的材质配置
      const config = {
        faces: state,
        timestamp: new Date().toISOString()
      };
      console.log("保存配置:", config);
      // 模拟保存到本地存储
      localStorage.setItem("deviceMaterialConfig", JSON.stringify(config));
      alert("已保存设备材质配置");
    });

    document.getElementById("importBtn").addEventListener("click", function () {
      // 创建一个隐藏的文件输入框
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".json";
      input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = function(event) {
            try {
              const config = JSON.parse(event.target.result);
              if (config.faces) {
                // 恢复配置
                Object.keys(config.faces).forEach(key => {
                  if (state[key]) {
                    state[key] = { ...state[key], ...config.faces[key] };
                  }
                });
                renderAllFaces();
                alert("已导入材质配置");
              }
            } catch(err) {
              alert("导入失败：文件格式错误");
            }
          };
          reader.readAsText(file);
        }
      };
      input.click();
    });

    document.getElementById("exportBtn").addEventListener("click", function () {
      const config = {
        faces: state,
        timestamp: new Date().toISOString()
      };
      const blob = new Blob([JSON.stringify(config, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "device-material-config.json";
      a.click();
      URL.revokeObjectURL(url);
      alert("已导出设备材质配置");
    });

    document.getElementById("clearBtn").addEventListener("click", function () {
      if (confirm("确定要清空场景吗？此操作不可恢复。")) {
        // 重置所有面的配置
        Object.keys(state).forEach(key => {
          state[key] = {
            materialName: "无",
            color: "#808080",
            nodeTitle: "",
            path: "",
            roughness: "0.5",
            metalness: "0.0"
          };
        });
        // 清空贴图
        Object.keys(mapData).forEach(key => {
          mapData[key] = null;
        });
        // 更新UI
        document.querySelectorAll(".map-preview").forEach(preview => {
          preview.innerHTML = '<span class="map-placeholder">无</span>';
          preview.classList.remove("has-img");
        });
        renderAllFaces();
        alert("已清空场景");
      }
    });

    // 编辑按钮
    const editButtons = document.querySelectorAll(".tool-group:nth-child(2) .tool-btn-container .btn");
    editButtons.forEach(btn => {
      btn.addEventListener("click", function() {
        const text = btn.textContent;
        switch(text) {
          case "撤销":
            alert("撤销操作");
            break;
          case "重做":
            alert("重做操作");
            break;
          case "复制":
            if (selectedFace) {
              // 复制当前面的材质到剪贴板
              const copyData = { ...state[selectedFace] };
              localStorage.setItem("materialCopy", JSON.stringify(copyData));
              alert("已复制材质: " + copyData.materialName);
            } else {
              alert("请先选择一个面");
            }
            break;
          case "删除":
            if (selectedFace) {
              if (confirm("确定要删除当前材质吗？")) {
                state[selectedFace].materialName = "无";
                state[selectedFace].color = "#808080";
                renderFace(selectedFace);
                alert("已删除材质");
              }
            } else {
              alert("请先选择一个面");
            }
            break;
          case "锁定/解锁":
            alert("锁定/解锁功能");
            break;
          case "隐藏/显示":
            if (selectedFace) {
              const faceEl = document.querySelector('.face[data-face="' + selectedFace + '"]');
              faceEl.classList.toggle("hidden-face");
              alert("切换显隐状态");
            } else {
              alert("请先选择一个面");
            }
            break;
          case "聚焦":
            if (selectedFace) {
              const faceEl = document.querySelector('.face[data-face="' + selectedFace + '"]');
              faceEl.classList.add("focused-face");
              setTimeout(() => faceEl.classList.remove("focused-face"), 1500);
              alert("已聚焦到: " + selectedFace);
            } else {
              alert("请先选择一个面");
            }
            break;
        }
      });
    });

    // 视图按钮
    const viewButtons = document.querySelectorAll(".tool-group:nth-child(3) .tool-btn-container .btn");
    viewButtons.forEach(btn => {
      btn.addEventListener("click", function() {
        const text = btn.textContent;
        switch(text) {
          case "重置相机":
            alert("重置相机");
            break;
          case "锁定相机":
            alert("锁定相机");
            break;
          case "锁定Y轴":
            alert("锁定Y轴");
            break;
          case "裁剪平面":
            alert("裁剪平面");
            break;
        }
      });
    });

    // 贴图预览弹窗
    const mapModal = document.getElementById("mapModal");
    const modalImg = document.getElementById("modalImg");
    const modalTitle = document.getElementById("modalTitle");
    const modalClose = document.getElementById("modalClose");
    const modalReset = document.getElementById("modalReset");
    const modalConfirm = document.getElementById("modalConfirm");
    let currentMapType = null;
    const mapData = {
      colorMap: null,
      normalMap: null,
      roughMap: null,
      metalMap: null,
      emissiveMap: null,
      opacityMap: null,
      envMap: null
    };

    const mapNames = {
      colorMap: "颜色贴图",
      normalMap: "法线贴图",
      roughMap: "粗糙贴图",
      metalMap: "金属贴图",
      emissiveMap: "自发光贴图",
      opacityMap: "透明贴图",
      envMap: "环境贴图"
    };

    // 点击回显打开弹窗
    document.querySelectorAll(".map-preview").forEach(preview => {
      preview.addEventListener("click", function() {
        currentMapType = this.dataset.map;
        modalTitle.textContent = mapNames[currentMapType] || "贴图预览";

        if (mapData[currentMapType]) {
          modalImg.src = mapData[currentMapType];
          // 有贴图时显示设置按钮
          document.getElementById("modalSetting").style.display = "inline-flex";
          // 隐藏设置面板
          document.getElementById("modalSettings").classList.remove("show");
        } else {
          modalImg.src = "";
          document.getElementById("modalSetting").style.display = "none";
        }
        mapModal.classList.add("show");
      });
    });

    // 点击弹窗中的设置按钮展开/收起配置面板
    const settingBtn = document.getElementById("modalSetting");
    settingBtn.addEventListener("click", function(e) {
      e.preventDefault();
      e.stopPropagation();
      const panel = document.getElementById("modalSettings");
      if (panel.style.display === "none" || panel.style.display === "") {
        panel.style.display = "block";
      } else {
        panel.style.display = "none";
      }
    });

    // 环境贴图的设置按钮点击 - 打开UV配置弹窗
    document.querySelectorAll(".map-setting-btn").forEach(btn => {
      btn.addEventListener("click", function(e) {
        e.stopPropagation();
        const mapType = this.dataset.map;
        currentMapType = mapType;
        modalTitle.textContent = mapNames[mapType] || "贴图设置";
        modalImg.src = mapData[mapType] || "";
        document.getElementById("modalSetting").style.display = "inline-flex";
        document.getElementById("modalSettings").style.display = "none";
        mapModal.classList.add("show");
      });
    });

    // 关闭弹窗
    modalClose.addEventListener("click", function() {
      mapModal.classList.remove("show");
    });

    mapModal.addEventListener("click", function(e) {
      if (e.target === mapModal) {
        mapModal.classList.remove("show");
      }
    });

    // 重置
    modalReset.addEventListener("click", function() {
      if (currentMapType && mapData[currentMapType]) {
        mapData[currentMapType] = null;
        const preview = document.getElementById("preview-" + currentMapType);
        preview.innerHTML = '<span class="map-placeholder">无</span>';
        preview.classList.remove("has-img");
        modalImg.src = "";
      }
    });

    // 选择文件
    document.getElementById("fileInput").addEventListener("change", function(e) {
      if (e.target.files && e.target.files[0] && currentMapType) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = function(event) {
          mapData[currentMapType] = event.target.result;
          const preview = document.getElementById("preview-" + currentMapType);
          preview.innerHTML = '<img src="' + mapData[currentMapType] + '">';
          preview.classList.add("has-img");
          modalImg.src = mapData[currentMapType];
          // 显示弹窗中的设置按钮
          document.getElementById("modalSetting").style.display = "inline-flex";
          // 显示对应贴图的设置按钮
          const settingBtn = document.querySelector('.map-setting-btn[data-map="' + currentMapType + '"]');
          if (settingBtn) settingBtn.style.display = "block";
        };
        reader.readAsDataURL(file);
      }
    });

    // 确定
    modalConfirm.addEventListener("click", function() {
      mapModal.classList.remove("show");
    });

    // UV配置按钮 - 环境贴图专用
    document.getElementById("uvConfigBtn").addEventListener("click", function() {
      currentMapType = "envMap";
      modalTitle.textContent = "环境贴图 - UV配置";
      if (mapData["envMap"]) {
        modalImg.src = mapData["envMap"];
        document.getElementById("modalSetting").style.display = "inline-flex";
      } else {
        modalImg.src = "";
        document.getElementById("modalSetting").style.display = "none";
      }
      document.getElementById("modalSettings").style.display = "none";
      mapModal.classList.add("show");
    });

    // 材质贴图面板底部的贴图设置按钮
    const toggleBtn = document.getElementById("uvSettingToggle");
    const panel = document.getElementById("uvSettingPanel");
    if (toggleBtn) {
      toggleBtn.addEventListener("click", function() {
        console.log("贴图设置按钮点击了");
        if (panel.style.display === "none" || panel.style.display === "") {
          panel.style.display = "block";
        } else {
          panel.style.display = "none";
        }
      });
    } else {
      console.log("按钮不存在");
    }

    // 初始化
    renderAllFaces();

    const firstRoot = document.querySelector('.tree-node[data-folder]');
    if (firstRoot) firstRoot.classList.remove("collapsed");
    const subFolders = document.querySelectorAll('.tree-node[data-folder] .tree-node[data-folder]');
    subFolders.forEach(node => node.classList.remove("collapsed"));
  })();
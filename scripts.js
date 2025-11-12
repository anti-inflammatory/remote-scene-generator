// 点击 "开始体验" 按钮滚动到体验入口部分
function scrollToExperience() {
  const experienceSection = document.getElementById('experience');
  if (experienceSection) {
    // 平滑滚动到体验入口部分
    experienceSection.scrollIntoView({ behavior: 'smooth' });
    
    // 可选：为体验入口添加高亮效果
    experienceSection.style.transition = 'all 0.5s ease';
    experienceSection.style.boxShadow = '0 0 20px rgba(0, 150, 255, 0.5)';
    
    // 3秒后移除高亮效果
    setTimeout(() => {
      experienceSection.style.boxShadow = 'none';
    }, 3000);
  }
}

document.addEventListener('DOMContentLoaded', function() {
  // 为开始体验按钮添加点击事件
  const startButton = document.getElementById('startButton');
  if (startButton) {
    startButton.addEventListener('click', scrollToExperience);
  }

  // 获取DOM元素
  const uploadContainer = document.getElementById('uploadContainer');
  const uploadPlaceholder = document.querySelector('.upload-placeholder');
  const fileInfo = document.getElementById('fileInfo');
  const fileName = document.getElementById('fileName');
  const imageUpload = document.getElementById('imageUpload');
  const removeImageBtn = document.getElementById('removeImage');
  const sceneDescription = document.getElementById('sceneDescription');
  const generateBtn = document.getElementById('generateBtn');
  const emptyState = document.getElementById('emptyState');
  const loadingState = document.getElementById('loadingState');
  const resultContent = document.getElementById('resultContent');
  const inputImageResult = document.getElementById('inputImageResult');
  const generatedImage = document.getElementById('generatedImage');
  const downloadBtn = document.getElementById('downloadBtn');
  const regenerateBtn = document.getElementById('regenerateBtn');
  
  let uploadedImageFile = null;
  
  // 初始化显示状态
  if (loadingState) loadingState.style.display = 'none';
  if (resultContent) resultContent.style.display = 'none';
  if (emptyState) emptyState.style.display = 'flex';
  if (fileInfo) fileInfo.style.display = 'none';
  
  // 上传区域点击事件
  if (uploadContainer) {
    uploadContainer.addEventListener('click', function() {
      if (imageUpload) imageUpload.click();
    });
  }
  
  // 拖拽功能 - 修复事件处理
  if (uploadContainer) {
    uploadContainer.addEventListener('dragover', function(e) {
      e.preventDefault();
      e.stopPropagation();
      this.classList.add('dragover');
    });
    
    uploadContainer.addEventListener('dragleave', function(e) {
      e.preventDefault();
      e.stopPropagation();
      this.classList.remove('dragover');
    });
    
    uploadContainer.addEventListener('drop', function(e) {
      e.preventDefault();
      e.stopPropagation();
      this.classList.remove('dragover');
      
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleImageUpload(e.dataTransfer.files[0]);
      }
    });
  }
  
  // 文件选择变化
  if (imageUpload) {
    imageUpload.addEventListener('change', function() {
      if (this.files && this.files[0]) {
        handleImageUpload(this.files[0]);
      }
    });
  }
  
  // 移除图片按钮事件监听
  if (removeImageBtn) {
    removeImageBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      resetImageUpload();
    });
  }
  
  // 输入框变化检查
  if (sceneDescription) {
    sceneDescription.addEventListener('input', checkInputs);
  }
  
  // 生成按钮点击
  if (generateBtn) {
    generateBtn.addEventListener('click', generateImage);
  }
  
  // 重新生成按钮
  if (regenerateBtn) {
    regenerateBtn.addEventListener('click', generateImage);
  }
  
  // 下载按钮
  if (downloadBtn) {
    downloadBtn.addEventListener('click', downloadImage);
  }
  
  // 处理图片上传
  function handleImageUpload(file) {
    // 验证文件类型
    if (!file.type.match('image.*')) {
      alert('请上传图像文件 (JPG, PNG 等)');
      return;
    }
    
    // 验证文件大小
    if (file.size > 5 * 1024 * 1024) {
      alert('文件大小不能超过5MB');
      return;
    }
    
    uploadedImageFile = file;
    
    const reader = new FileReader();
    reader.onload = function(e) {
      // 保存文件数据但不显示图片
      if (inputImageResult) {
        inputImageResult.src = e.target.result; // 保存到结果区域
      }
      
      // 显示文件信息
      if (uploadPlaceholder && fileInfo && fileName) {
        uploadPlaceholder.style.display = 'none';
        fileInfo.style.display = 'flex';
        fileName.textContent = file.name;
      }
      
      checkInputs();
    };
    reader.readAsDataURL(file);
  }
  
  // 重置图片上传
  function resetImageUpload() {
    uploadedImageFile = null;
    if (imageUpload) imageUpload.value = '';
    
    // 恢复上传提示
    if (uploadPlaceholder && fileInfo) {
      uploadPlaceholder.style.display = 'flex';
      fileInfo.style.display = 'none';
    }
    
    checkInputs();
  }
  
  // 检查输入是否完整
  function checkInputs() {
    if (generateBtn) {
      if (uploadedImageFile && sceneDescription && sceneDescription.value.trim() !== '') {
        generateBtn.disabled = false;
      } else {
        generateBtn.disabled = true;
      }
    }
  }
  




function generateImage() {
  // 显示加载状态
  if (emptyState) emptyState.style.display = 'none';
  if (loadingState) loadingState.style.display = 'flex';
  if (resultContent) resultContent.style.display = 'none';
  
  // 创建FormData对象
  const formData = new FormData();
  formData.append('image', uploadedImageFile);  // 上传的布局图像
  formData.append('description', sceneDescription.value.trim());  // 文字描述
  
  // 发送到后端 API
  fetch('http://125.217.95.75/generate', {  // 替换后端 API 地址！！！！！！！
    method: 'POST',
    body: formData,
  })
  .then(response => response.json())  // 解析响应
  .then(data => {
    if (data.success) {
      // 显示生成的图像
      if (generatedImage) generatedImage.src = data.generatedImageUrl;
      
      // 显示结果（包括上传的图像和生成的图像）
      if (loadingState) loadingState.style.display = 'none';
      if (resultContent) resultContent.style.display = 'block';
      
      // 设置下载链接
      if (downloadBtn) {
        downloadBtn.onclick = function() {
          const a = document.createElement('a');
          a.href = data.generatedImageUrl;
          a.download = 'generated-image.png';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        };
      }
    } else {
      console.error('生成图像失败:', data.message);
      alert('生成过程中出现错误，请重试');
      
      // 恢复状态
      if (loadingState) loadingState.style.display = 'none';
      if (emptyState) emptyState.style.display = 'flex';
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('请求失败，请稍后再试');
    
    // 恢复状态
    if (loadingState) loadingState.style.display = 'none';
    if (emptyState) emptyState.style.display = 'flex';
  });
}


});

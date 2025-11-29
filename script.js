// 简单的交互效果
document.addEventListener('DOMContentLoaded', function() {
    // 为所有工具卡片添加点击效果
    const toolCards = document.querySelectorAll('.tool-card');
    
    toolCards.forEach(card => {
        card.addEventListener('click', function() {
            // 添加点击反馈
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });

    // 为标签添加点击效果
    const tags = document.querySelectorAll('.tag');
    tags.forEach(tag => {
        tag.addEventListener('click', function(e) {
            e.stopPropagation(); // 防止触发卡片点击
            console.log('Tag clicked:', this.textContent);
            // 这里可以添加标签筛选功能
        });
    });

    // 打字机效果（可选）
    const mainTitle = document.querySelector('.main-title');
    if (mainTitle) {
        const originalText = mainTitle.textContent;
        mainTitle.textContent = '';
        let i = 0;
        
        function typeWriter() {
            if (i < originalText.length) {
                mainTitle.textContent += originalText.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        }
        
        // 延迟启动打字机效果
        setTimeout(typeWriter, 500);
    }

    // 添加随机闪烁效果
    setInterval(() => {
        const randomCard = toolCards[Math.floor(Math.random() * toolCards.length)];
        randomCard.style.boxShadow = '0 0 30px rgba(0, 255, 0, 0.8)';
        setTimeout(() => {
            randomCard.style.boxShadow = '';
        }, 200);
    }, 3000);
});


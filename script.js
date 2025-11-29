// 图表绘制函数
function drawChart(canvasId, data, color = '#9b59b6') {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.offsetWidth;
    const height = canvas.height = canvas.offsetHeight;
    
    ctx.clearRect(0, 0, width, height);
    
    if (!data || data.length === 0) return;
    
    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);
    const range = maxValue - minValue || 1;
    
    const barWidth = width / data.length;
    const padding = 2;
    
    data.forEach((value, index) => {
        const barHeight = ((value - minValue) / range) * (height - 10);
        const x = index * barWidth;
        const y = height - barHeight - 5;
        
        ctx.fillStyle = color;
        ctx.fillRect(x + padding, y, barWidth - padding * 2, barHeight);
    });
}

// 生成随机数据用于图表
function generateChartData(count = 15, min = 0, max = 100) {
    return Array.from({ length: count }, () => 
        Math.floor(Math.random() * (max - min + 1)) + min
    );
}

// 获取比特币价格
async function fetchBitcoinPrice() {
    try {
        const response = await fetch('https://api.coindesk.com/v1/bpi/currentprice.json');
        const data = await response.json();
        const price = Math.floor(data.bpi.USD.rate_float);
        return price;
    } catch (error) {
        console.error('获取比特币价格失败:', error);
        // 返回模拟数据
        return 45000 + Math.floor(Math.random() * 5000);
    }
}

// 获取访问人数
function getVisitorCount() {
    let count = localStorage.getItem('visitorCount');
    if (!count) {
        count = Math.floor(Math.random() * 1000) + 500;
        localStorage.setItem('visitorCount', count);
    } else {
        count = parseInt(count) + 1;
        localStorage.setItem('visitorCount', count);
    }
    return count;
}

// 获取音乐数据（模拟）
function getMusicData() {
    let musicCount = localStorage.getItem('musicCount');
    if (!musicCount) {
        musicCount = Math.floor(Math.random() * 200) + 50;
        localStorage.setItem('musicCount', musicCount);
    }
    return parseInt(musicCount);
}

// 更新所有仪表板数据
async function updateDashboard() {
    // 音乐面板
    const musicCount = getMusicData();
    document.getElementById('musicValue').textContent = musicCount;
    const musicChartData = generateChartData(15, 20, 80);
    drawChart('musicChart', musicChartData, '#9b59b6');
    
    // 比特币价格面板
    const bitcoinPrice = await fetchBitcoinPrice();
    document.getElementById('bitcoinValue').textContent = `$${bitcoinPrice.toLocaleString()}`;
    const bitcoinChartData = generateChartData(15, bitcoinPrice - 2000, bitcoinPrice + 2000);
    drawChart('bitcoinChart', bitcoinChartData, '#9b59b6');
    
    // 访问人数面板
    const visitorCount = getVisitorCount();
    document.getElementById('visitorValue').textContent = visitorCount.toLocaleString();
    const visitorChartData = generateChartData(15, visitorCount - 100, visitorCount + 100);
    drawChart('visitorChart', visitorChartData, '#9b59b6');
}

// 简单的交互效果
document.addEventListener('DOMContentLoaded', function() {
    // 初始化仪表板
    updateDashboard();
    
    // 每30秒更新一次数据
    setInterval(updateDashboard, 30000);
    
    // 窗口大小改变时重新绘制图表
    window.addEventListener('resize', () => {
        setTimeout(updateDashboard, 100);
    });
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


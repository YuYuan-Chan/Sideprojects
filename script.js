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

// 设置 Apple Music 链接
function setAppleMusic() {
    const urlInput = document.getElementById('appleMusicUrl');
    const iframe = document.getElementById('appleMusicFrame');
    const placeholder = document.getElementById('musicPlaceholder');
    const musicValue = document.getElementById('musicValue');
    
    if (!urlInput || !iframe) return;
    
    let musicUrl = urlInput.value.trim();
    
    // 如果没有输入，尝试从 localStorage 读取
    if (!musicUrl) {
        musicUrl = localStorage.getItem('appleMusicUrl');
    }
    
    if (!musicUrl) {
        alert('请输入 Apple Music 链接');
        return;
    }
    
    // 转换 Apple Music 链接为嵌入格式
    // 如果用户输入的是 music.apple.com 链接，转换为 embed.music.apple.com
    if (musicUrl.includes('music.apple.com') && !musicUrl.includes('embed.music.apple.com')) {
        musicUrl = musicUrl.replace('music.apple.com', 'embed.music.apple.com');
    }
    
    // 保存到 localStorage
    localStorage.setItem('appleMusicUrl', musicUrl);
    
    // 设置 iframe
    iframe.src = musicUrl;
    iframe.style.display = 'block';
    if (placeholder) placeholder.style.display = 'none';
    
    // 更新显示
    if (musicValue) {
        musicValue.textContent = 'Playing';
    }
    
    // 尝试获取播放列表中的歌曲数量（需要用户授权）
    // 这里只是显示一个示例数字
    setTimeout(() => {
        if (musicValue) {
            musicValue.textContent = 'Apple Music';
        }
    }, 1000);
}

// 初始化 Apple Music
function initAppleMusic() {
    const savedUrl = localStorage.getItem('appleMusicUrl');
    const iframe = document.getElementById('appleMusicFrame');
    const placeholder = document.getElementById('musicPlaceholder');
    
    if (savedUrl && iframe) {
        iframe.src = savedUrl;
        iframe.style.display = 'block';
        if (placeholder) placeholder.style.display = 'none';
    } else {
        if (iframe) iframe.style.display = 'none';
        if (placeholder) placeholder.style.display = 'flex';
    }
}

// 从 TradingView API 获取比特币实时价格
let bitcoinPriceHistory = [];
async function fetchBitcoinPrice() {
    try {
        // 使用多个 API 源以确保可靠性
        // 方法1: CoinGecko API
        try {
            const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true');
            const data = await response.json();
            if (data.bitcoin && data.bitcoin.usd) {
                const price = Math.floor(data.bitcoin.usd);
                bitcoinPriceHistory.push(price);
                if (bitcoinPriceHistory.length > 15) {
                    bitcoinPriceHistory.shift();
                }
                return price;
            }
        } catch (e) {
            console.log('CoinGecko API 失败，尝试备用方案');
        }
        
        // 方法2: Binance API
        try {
            const binanceResponse = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT');
            const binanceData = await binanceResponse.json();
            if (binanceData.price) {
                const price = Math.floor(parseFloat(binanceData.price));
                bitcoinPriceHistory.push(price);
                if (bitcoinPriceHistory.length > 15) {
                    bitcoinPriceHistory.shift();
                }
                return price;
            }
        } catch (e) {
            console.log('Binance API 失败');
        }
        
        // 方法3: CoinCap API
        try {
            const coinCapResponse = await fetch('https://api.coincap.io/v2/assets/bitcoin');
            const coinCapData = await coinCapResponse.json();
            if (coinCapData.data && coinCapData.data.priceUsd) {
                const price = Math.floor(parseFloat(coinCapData.data.priceUsd));
                bitcoinPriceHistory.push(price);
                if (bitcoinPriceHistory.length > 15) {
                    bitcoinPriceHistory.shift();
                }
                return price;
            }
        } catch (e) {
            console.log('CoinCap API 失败');
        }
        
        // 如果所有 API 都失败，使用历史数据或默认值
        if (bitcoinPriceHistory.length > 0) {
            return bitcoinPriceHistory[bitcoinPriceHistory.length - 1];
        }
        return 90000; // 默认值
    } catch (error) {
        console.error('获取比特币价格失败:', error);
        return bitcoinPriceHistory.length > 0 ? bitcoinPriceHistory[bitcoinPriceHistory.length - 1] : 90000;
    }
}

// 更新访问人数（使用不蒜子，但也可以显示图表）
function updateVisitorChart() {
    // 等待不蒜子加载完成
    setTimeout(() => {
        const visitorCountEl = document.getElementById('busuanzi_value_site_pv');
        if (visitorCountEl) {
            const count = parseInt(visitorCountEl.textContent) || 0;
            // 生成基于实际访问量的图表数据
            const chartData = generateChartData(15, Math.max(0, count - 100), count + 100);
            drawChart('visitorChart', chartData, '#9b59b6');
        } else {
            // 如果不蒜子还没加载，使用默认数据
            const chartData = generateChartData(15, 0, 100);
            drawChart('visitorChart', chartData, '#9b59b6');
        }
    }, 2000);
}

// 更新所有仪表板数据
async function updateDashboard() {
    // 比特币价格面板
    const bitcoinPrice = await fetchBitcoinPrice();
    const bitcoinValueEl = document.getElementById('bitcoinValue');
    if (bitcoinValueEl) {
        bitcoinValueEl.textContent = `$${bitcoinPrice.toLocaleString()}`;
    }
    
    // 绘制比特币价格趋势图
    if (bitcoinPriceHistory.length > 0) {
        drawChart('bitcoinChart', bitcoinPriceHistory, '#9b59b6');
    } else {
        // 如果没有历史数据，生成一些示例数据
        const chartData = generateChartData(15, bitcoinPrice - 2000, bitcoinPrice + 2000);
        drawChart('bitcoinChart', chartData, '#9b59b6');
    }
    
    // 更新访问人数图表
    updateVisitorChart();
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化 Apple Music
    initAppleMusic();
    
    // 初始化仪表板
    updateDashboard();
    
    // 每10秒更新一次比特币价格
    setInterval(() => {
        updateDashboard();
    }, 10000);
    
    // 窗口大小改变时重新绘制图表
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            updateDashboard();
        }, 200);
    });
    
    // 为所有工具卡片添加点击效果
    const toolCards = document.querySelectorAll('.tool-card');
    
    toolCards.forEach(card => {
        card.addEventListener('click', function() {
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
            e.stopPropagation();
            console.log('Tag clicked:', this.textContent);
        });
    });

    // 打字机效果
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
        
        setTimeout(typeWriter, 500);
    }

    // 随机闪烁效果
    setInterval(() => {
        if (toolCards.length > 0) {
            const randomCard = toolCards[Math.floor(Math.random() * toolCards.length)];
            randomCard.style.boxShadow = '0 0 30px rgba(0, 255, 0, 0.8)';
            setTimeout(() => {
                randomCard.style.boxShadow = '';
            }, 200);
        }
    }, 3000);
});

// 数字动画函数
function animateNumber(elementId, targetValue, duration = 2000, prefix = '', suffix = '') {
    const element = document.getElementById(elementId);
    if (!element) return;

    const startValue = parseFloat(element.textContent.replace(/[^0-9.]/g, '')) || 0;
    const endValue = parseFloat(targetValue.toString().replace(/[^0-9.]/g, '')) || 0;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // 使用缓动函数
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = startValue + (endValue - startValue) * easeOutQuart;

        if (prefix === '$') {
            element.textContent = prefix + Math.floor(currentValue).toLocaleString() + suffix;
        } else {
            element.textContent = prefix + Math.floor(currentValue).toLocaleString() + suffix;
        }

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            if (prefix === '$') {
                element.textContent = prefix + Math.floor(endValue).toLocaleString() + suffix;
            } else {
                element.textContent = prefix + Math.floor(endValue).toLocaleString() + suffix;
            }
        }
    }

    requestAnimationFrame(update);
}

// 完整的交易图表绘制函数
let bitcoinPriceHistory = [];
let bitcoinVolumes = [];
let lastBitcoinPrice = 0;
let priceUpdateInterval = null;

function drawTradingChart() {
    const canvas = document.getElementById('bitcoinChart');
    if (!canvas || !bitcoinPriceHistory.length) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.offsetWidth;
    const height = canvas.height = canvas.offsetHeight;

    ctx.clearRect(0, 0, width, height);

    const data = bitcoinPriceHistory;
    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);
    const range = maxValue - minValue || 1;
    const basePrice = data[0] || minValue;

    const leftPadding = 50;
    const rightPadding = 10;
    const topPadding = 30;
    const bottomPadding = 20;
    const chartWidth = width - leftPadding - rightPadding;
    const chartHeight = height - topPadding - bottomPadding;

    // 深色背景
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, width, height);

    // 绘制网格
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;

    // 水平网格
    for (let i = 0; i <= 4; i++) {
        const y = topPadding + (chartHeight / 4) * i;
        ctx.beginPath();
        ctx.moveTo(leftPadding, y);
        ctx.lineTo(width - rightPadding, y);
        ctx.stroke();
    }

    // 垂直网格
    const timeLabels = ['08:00', '10:00', '12:00', '14:00', '16:00'];
    for (let i = 0; i < timeLabels.length; i++) {
        const x = leftPadding + (chartWidth / (timeLabels.length - 1)) * i;
        ctx.beginPath();
        ctx.moveTo(x, topPadding);
        ctx.lineTo(x, height - bottomPadding);
        ctx.stroke();

        // 时间标签
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.font = '11px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(timeLabels[i], x, height - 5);
    }

    // 水平参考线（虚线）
    const midY = topPadding + chartHeight / 2;
    ctx.strokeStyle = 'rgba(135, 206, 250, 0.5)';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(leftPadding, midY);
    ctx.lineTo(width - rightPadding, midY);
    ctx.stroke();
    ctx.setLineDash([]);

    // 计算K线数据（OHLC）
    const candles = [];
    for (let i = 0; i < data.length; i++) {
        const currentPrice = data[i];
        const prevPrice = i > 0 ? data[i - 1] : currentPrice;
        
        // 模拟开高低收数据
        const open = prevPrice;
        const close = currentPrice;
        const high = Math.max(open, close) + Math.abs(close - open) * 0.4;
        const low = Math.min(open, close) - Math.abs(close - open) * 0.4;
        
        candles.push({ open, high, low, close });
    }
    
    // 绘制K线图（蜡烛图）
    const candleWidth = chartWidth / candles.length * 0.7;
    const candleSpacing = chartWidth / candles.length;
    
    candles.forEach((candle, index) => {
        const x = leftPadding + index * candleSpacing + candleSpacing / 2;
        const isBullish = candle.close >= candle.open;
        
        // 计算Y坐标
        const highY = topPadding + chartHeight - ((candle.high - minValue) / range) * chartHeight;
        const lowY = topPadding + chartHeight - ((candle.low - minValue) / range) * chartHeight;
        const openY = topPadding + chartHeight - ((candle.open - minValue) / range) * chartHeight;
        const closeY = topPadding + chartHeight - ((candle.close - minValue) / range) * chartHeight;
        
        // 绘制上下影线
        ctx.strokeStyle = isBullish ? '#3b82f6' : '#ff69b4'; // 蓝色上涨，粉色下跌
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, highY);
        ctx.lineTo(x, lowY);
        ctx.stroke();
        
        // 绘制蜡烛实体
        const bodyTop = Math.min(openY, closeY);
        const bodyBottom = Math.max(openY, closeY);
        const bodyHeight = Math.max(bodyBottom - bodyTop, 2);
        
        if (isBullish) {
            // 上涨：蓝色实心
            ctx.fillStyle = '#3b82f6'; // 蓝色
            ctx.fillRect(x - candleWidth / 2, bodyTop, candleWidth, bodyHeight);
            ctx.strokeStyle = '#60a5fa';
        } else {
            // 下跌：粉色实心
            ctx.fillStyle = '#ff69b4'; // 粉色
            ctx.fillRect(x - candleWidth / 2, bodyTop, candleWidth, bodyHeight);
            ctx.strokeStyle = '#ff8cc8';
        }
        
        // 绘制边框
        ctx.lineWidth = 1;
        ctx.strokeRect(x - candleWidth / 2, bodyTop, candleWidth, bodyHeight);
    });

    // 价格标注
    ctx.font = '11px Arial';
    ctx.textAlign = 'left';

    const significantPoints = [];
    for (let i = 1; i < data.length - 1; i++) {
        const prev = data[i - 1];
        const curr = data[i];
        const next = data[i + 1];

        if ((curr > prev && curr > next) || (curr < prev && curr < next)) {
            significantPoints.push({ index: i, price: curr });
        }
    }

    // 限制标注数量
    const step = Math.max(1, Math.floor(significantPoints.length / 15));
    significantPoints.forEach((point, idx) => {
        if (idx % step !== 0 && significantPoints.length > 15) return;

        const x = leftPadding + (chartWidth / (data.length - 1)) * point.index;
        const normalizedValue = (point.price - minValue) / range;
        const y = topPadding + chartHeight - (normalizedValue * chartHeight);

        const percentChange = ((point.price - basePrice) / basePrice) * 100;
        const percentText = percentChange >= 0 ?
            `+${percentChange.toFixed(1)}%` :
            `${percentChange.toFixed(1)}%`;

        // 标注线
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + 25, y - 12);
        ctx.stroke();

        // 标注文本
        ctx.fillStyle = '#ffffff';
        const priceText = basePrice.toFixed(1);
        ctx.fillText(`${priceText} (${percentText})`, x + 30, y - 12);
    });

    // 右侧价格刻度
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '11px Arial';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 4; i++) {
        const price = minValue + (range / 4) * (4 - i);
        const y = topPadding + (chartHeight / 4) * i;
        ctx.fillText(price.toFixed(1), width - 5, y + 4);
    }

    // 更新价格信息
    if (data.length > 0) {
        const open = data[0];
        const close = data[data.length - 1];
        const high = maxValue;
        const low = minValue;
        const change = close - open;
        const changePercent = ((change / open) * 100);

        document.getElementById('chartOpen').textContent = open.toFixed(2);
        document.getElementById('chartHigh').textContent = high.toFixed(2);
        document.getElementById('chartLow').textContent = low.toFixed(2);
        document.getElementById('chartClose').textContent = close.toFixed(2);

        const changeEl = document.getElementById('chartChange');
        const changeText = `${change >= 0 ? '+' : ''}${change.toFixed(2)} (${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%)`;
        changeEl.textContent = changeText;
        changeEl.style.color = change >= 0 ? '#ffffff' : '#888888';
    }
}

// 绘制成交量图表
function drawVolumeChart() {
    const canvas = document.getElementById('volumeChart');
    if (!canvas || !bitcoinVolumes.length) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.offsetWidth;
    const height = canvas.height = canvas.offsetHeight;

    ctx.clearRect(0, 0, width, height);

    const volumes = bitcoinVolumes;
    const maxVolume = Math.max(...volumes) || 1;
    const leftPadding = 50;
    const rightPadding = 10;

    volumes.forEach((volume, index) => {
        const x = leftPadding + ((width - leftPadding - rightPadding) / volumes.length) * index;
        const barWidth = (width - leftPadding - rightPadding) / volumes.length * 0.8;
        const barHeight = (volume / maxVolume) * height;

        // 根据价格变化决定颜色（简化：随机或基于趋势）
        const isUp = index > 0 && bitcoinPriceHistory[index] >= bitcoinPriceHistory[index - 1];
        ctx.fillStyle = isUp ? '#ffffff' : '#888888';
        ctx.fillRect(x, height - barHeight, barWidth, barHeight);
    });
}

// 绘制VPVR（成交量分布）
function drawVPVR() {
    const canvas = document.getElementById('vpvrChart');
    if (!canvas || !bitcoinPriceHistory.length || !bitcoinVolumes.length) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.offsetWidth;
    const height = canvas.height = canvas.offsetHeight;

    ctx.clearRect(0, 0, width, height);

    // 计算价格区间的成交量
    const priceLevels = 20;
    const maxPrice = Math.max(...bitcoinPriceHistory);
    const minPrice = Math.min(...bitcoinPriceHistory);
    const priceRange = maxPrice - minPrice || 1;

    const volumeByPrice = new Array(priceLevels).fill(0);

    bitcoinPriceHistory.forEach((price, index) => {
        const level = Math.floor(((price - minPrice) / priceRange) * (priceLevels - 1));
        if (level >= 0 && level < priceLevels) {
            volumeByPrice[level] += bitcoinVolumes[index] || 0;
        }
    });

    const maxVolume = Math.max(...volumeByPrice) || 1;
    const barWidth = width * 0.6;

    volumeByPrice.forEach((volume, level) => {
        const y = (height / priceLevels) * level;
        const barHeight = height / priceLevels;
        const barLength = (volume / maxVolume) * width;

        // 白色表示买入，灰色表示卖出（简化处理）
        ctx.fillStyle = level < priceLevels / 2 ? '#ffffff' : '#888888';
        ctx.fillRect(width - barLength, y, barLength, barHeight);
    });
}

// 从 TradingView API 获取比特币实时价格
async function fetchBitcoinPrice() {
    try {
        // 使用多个 API 源以确保可靠性
        // 方法1: CoinGecko API（最快）
        try {
            const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true', {
                cache: 'no-cache'
            });
            const data = await response.json();
            if (data.bitcoin && data.bitcoin.usd) {
                const price = parseFloat(data.bitcoin.usd);
                return price;
            }
        } catch (e) {
            console.log('CoinGecko API 失败，尝试备用方案');
        }

        // 方法2: Binance API（实时性最好）
        try {
            const binanceResponse = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT', {
                cache: 'no-cache'
            });
            const binanceData = await binanceResponse.json();
            if (binanceData.price) {
                const price = parseFloat(binanceData.price);
                return price;
            }
        } catch (e) {
            console.log('Binance API 失败');
        }

        // 方法3: CoinCap API
        try {
            const coinCapResponse = await fetch('https://api.coincap.io/v2/assets/bitcoin', {
                cache: 'no-cache'
            });
            const coinCapData = await coinCapResponse.json();
            if (coinCapData.data && coinCapData.data.priceUsd) {
                const price = parseFloat(coinCapData.data.priceUsd);
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

// 实时更新比特币价格和图表
async function updateBitcoinPrice() {
    const price = await fetchBitcoinPrice();

    // 添加到历史记录
    bitcoinPriceHistory.push(price);
    // 保持最近60个数据点（1分钟的数据，每秒更新）
    if (bitcoinPriceHistory.length > 60) {
        bitcoinPriceHistory.shift();
    }

    // 模拟成交量（实际应该从API获取）
    const volume = Math.random() * 1000000 + 500000;
    bitcoinVolumes.push(volume);
    if (bitcoinVolumes.length > 60) {
        bitcoinVolumes.shift();
    }

    // 更新价格显示
    const bitcoinValueEl = document.getElementById('bitcoinValue');
    const bitcoinStat = document.getElementById('bitcoinStat');

    if (bitcoinValueEl) {
        const currentPrice = parseFloat(bitcoinValueEl.textContent.replace(/[^0-9.]/g, '')) || price;
        const newPrice = price;

        // 价格变化指示
        if (lastBitcoinPrice > 0) {
            if (newPrice > lastBitcoinPrice) {
                bitcoinValueEl.style.color = '#ffffff'; // 白色表示上涨
            } else if (newPrice < lastBitcoinPrice) {
                bitcoinValueEl.style.color = '#888888'; // 灰色表示下跌
            } else {
                bitcoinValueEl.style.color = '#ffffff'; // 白色表示无变化
            }
        }

        // 平滑更新价格数字
        if (typeof gsap !== 'undefined') {
            gsap.to({ value: currentPrice }, {
                value: newPrice,
                duration: 0.5,
                ease: 'power2.out',
                onUpdate: function() {
                    bitcoinValueEl.textContent = `$${Math.floor(this.targets()[0].value).toLocaleString()}`;
                }
            });
        } else {
            // 如果 GSAP 未加载，直接更新
            bitcoinValueEl.textContent = `$${Math.floor(price).toLocaleString()}`;
        }
    }

    // 更新统计数字
    if (bitcoinStat) {
        bitcoinStat.textContent = `$${Math.floor(price).toLocaleString()}`;
    }

    // 实时更新所有图表
    drawTradingChart();
    drawVolumeChart();
    drawVPVR();

    lastBitcoinPrice = price;
}

// 启动实时更新
function startBitcoinPriceUpdates() {
    // 立即更新一次
    updateBitcoinPrice();

    // 每秒更新一次
    if (priceUpdateInterval) {
        clearInterval(priceUpdateInterval);
    }
    priceUpdateInterval = setInterval(updateBitcoinPrice, 1000);
}

// 更新所有仪表板数据
async function updateDashboard() {
    // 比特币价格由实时更新函数处理，这里不需要单独更新
    // 启动实时更新
    startBitcoinPriceUpdates();
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化 GSAP 动画
    if (typeof gsap !== 'undefined') {
        initGSAPAnimations();
    }

    // 初始化仪表板（启动实时比特币价格更新）
    updateDashboard();

    // 窗口大小改变时重新绘制图表
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            drawTradingChart();
            drawVolumeChart();
            drawVPVR();
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

    // 随机闪烁效果 - 简化为极简风格
    setInterval(() => {
        if (toolCards.length > 0) {
            const randomCard = toolCards[Math.floor(Math.random() * toolCards.length)];
            randomCard.style.borderColor = '#ffffff';
            setTimeout(() => {
                randomCard.style.borderColor = '';
            }, 200);
        }
    }, 3000);
});

// GSAP 动画初始化
function initGSAPAnimations() {
    // 检查 GSAP 是否加载
    if (typeof gsap === 'undefined') {
        console.warn('GSAP not loaded');
        return;
    }

    // 注册 ScrollTrigger 插件
    if (typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }

    // Hero 标题动画
    gsap.from('.hero-title', {
        scrollTrigger: {
            trigger: '.hero-section',
            start: 'top 80%',
            toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 100,
        duration: 1.2,
        ease: 'power3.out'
    });

    // Hero 按钮动画
    gsap.from('.hero-buttons', {
        scrollTrigger: {
            trigger: '.hero-section',
            start: 'top 80%',
            toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out'
    });

    // Portfolio 标题动画
    gsap.from('.portfolio-title', {
        scrollTrigger: {
            trigger: '.portfolio-section',
            start: 'top 80%',
            toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 80,
        duration: 1,
        ease: 'power3.out'
    });

    // Portfolio 项目动画
    gsap.utils.toArray('.portfolio-item').forEach((item, index) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            x: -100,
            duration: 0.8,
            ease: 'power3.out',
            delay: index * 0.1
        });
    });

    // Stats 卡片动画
    gsap.utils.toArray('.stat-card').forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            scale: 0.8,
            duration: 0.8,
            ease: 'back.out(1.7)',
            delay: index * 0.15
        });
    });

    // Dashboard 卡片动画
    gsap.utils.toArray('.dashboard-card').forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 50,
            duration: 0.8,
            ease: 'power3.out',
            delay: index * 0.1
        });
    });

    // 项目卡片悬停动画增强
    document.querySelectorAll('.portfolio-item').forEach(item => {
        const title = item.querySelector('.portfolio-item-title');
        const desc = item.querySelector('.portfolio-item-desc');
        const arrow = item.querySelector('.portfolio-item-arrow');

        item.addEventListener('mouseenter', () => {
            gsap.to(title, {
                x: 10,
                duration: 0.4,
                ease: 'power2.out'
            });
            gsap.to(desc, {
                x: 10,
                opacity: 1,
                duration: 0.4,
                ease: 'power2.out'
            });
            gsap.to(arrow, {
                x: 0,
                opacity: 1,
                duration: 0.4,
                ease: 'power2.out'
            });
        });

        item.addEventListener('mouseleave', () => {
            gsap.to(title, {
                x: 0,
                duration: 0.4,
                ease: 'power2.out'
            });
            gsap.to(desc, {
                x: 0,
                opacity: 0.7,
                duration: 0.4,
                ease: 'power2.out'
            });
            gsap.to(arrow, {
                x: -30,
                opacity: 0,
                duration: 0.4,
                ease: 'power2.out'
            });
        });
    });

    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target && typeof gsap !== 'undefined') {
                gsap.to(window, {
                    duration: 1.5,
                    scrollTo: {
                        y: target,
                        offsetY: 80
                    },
                    ease: 'power3.inOut'
                });
            }
        });
    });
}
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

// 图表绘制函数（优化为折线图，更适合实时数据）
function drawChart(canvasId, data, color = '#ff69b4') {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.offsetWidth;
    const height = canvas.height = canvas.offsetHeight;
    
    ctx.clearRect(0, 0, width, height);
    
    if (!data || data.length < 2) return;
    
    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);
    const range = maxValue - minValue || 1;
    
    // 绘制蓝色背景
    ctx.fillStyle = '#1e3a8a'; // 深蓝色背景
    ctx.fillRect(0, 0, width, height);
    
    // 绘制背景网格（更亮的白色，在蓝色背景上更明显）
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
        const y = (height / 4) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }
    
    // 绘制垂直网格线
    for (let i = 0; i <= 4; i++) {
        const x = (width / 4) * i;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
    }
    
    // 绘制折线图（粉色）
    ctx.strokeStyle = '#ff69b4'; // 粉色
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    data.forEach((value, index) => {
        const x = (width / (data.length - 1)) * index;
        const normalizedValue = (value - minValue) / range;
        const y = height - (normalizedValue * (height - 20)) - 10;
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    
    ctx.stroke();
    
    // 填充区域（粉色半透明）
    ctx.fillStyle = 'rgba(255, 105, 180, 0.3)'; // 粉色半透明
    ctx.lineTo(width, height - 10);
    ctx.lineTo(0, height - 10);
    ctx.closePath();
    ctx.fill();
    
    // 绘制数据点（粉色）
    ctx.fillStyle = '#ff69b4'; // 粉色
    data.forEach((value, index) => {
        const x = (width / (data.length - 1)) * index;
        const normalizedValue = (value - minValue) / range;
        const y = height - (normalizedValue * (height - 20)) - 10;
        
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // 添加白色外圈
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.stroke();
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

    // 更新统计数字（模拟歌曲数量）
    const musicStat = document.getElementById('musicStat');
    if (musicStat) {
        animateNumber('musicStat', Math.floor(Math.random() * 200) + 50);
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
let lastBitcoinPrice = 0;
let priceUpdateInterval = null;

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

    // 更新价格显示
    const bitcoinValueEl = document.getElementById('bitcoinValue');
    const bitcoinStat = document.getElementById('bitcoinStat');

    if (bitcoinValueEl) {
        const currentPrice = parseFloat(bitcoinValueEl.textContent.replace(/[^0-9.]/g, '')) || price;
        const newPrice = price;

        // 价格变化指示
        if (lastBitcoinPrice > 0) {
            if (newPrice > lastBitcoinPrice) {
                bitcoinValueEl.style.color = '#00ff88'; // 绿色表示上涨
            } else if (newPrice < lastBitcoinPrice) {
                bitcoinValueEl.style.color = '#ff4444'; // 红色表示下跌
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

    // 实时更新图表（粉色线条）
    if (bitcoinPriceHistory.length > 1) {
        drawChart('bitcoinChart', bitcoinPriceHistory, '#ff69b4');
    }

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

// 更新访问人数（使用不蒜子，但也可以显示图表）
function updateVisitorChart() {
    // 等待不蒜子加载完成
    setTimeout(() => {
        const visitorCountEl = document.getElementById('busuanzi_value_site_pv');
        if (visitorCountEl) {
            const count = parseInt(visitorCountEl.textContent) || 0;
            // 更新统计数字
            const visitorStat = document.getElementById('visitorStat');
            if (visitorStat && count > 0) {
                animateNumber('visitorStat', count);
            }
            // 生成基于实际访问量的图表数据
            const chartData = generateChartData(15, Math.max(0, count - 100), count + 100);
            drawChart('visitorChart', chartData, '#00ff88');
        } else {
            // 如果不蒜子还没加载，使用默认数据
            const chartData = generateChartData(15, 0, 100);
            drawChart('visitorChart', chartData, '#00ff88');
        }
    }, 2000);
}

// 更新所有仪表板数据
async function updateDashboard() {
    // 比特币价格由实时更新函数处理，这里不需要单独更新
    // 启动实时更新
    startBitcoinPriceUpdates();
}

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
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out',
        delay: 0.8
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

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化 GSAP 动画
    if (typeof gsap !== 'undefined') {
        initGSAPAnimations();
    }

    // 初始化 Apple Music
    initAppleMusic();

    // 初始化统计数字动画
    setTimeout(() => {
        const musicStat = document.getElementById('musicStat');
        if (musicStat && musicStat.textContent === '0') {
            animateNumber('musicStat', Math.floor(Math.random() * 200) + 50);
        }
    }, 500);

    // 初始化仪表板（启动实时比特币价格更新）
    updateDashboard();

    // 窗口大小改变时重新绘制图表
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            updateDashboard();
        }, 200);
    });

    // 作品集项目点击交互
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    portfolioItems.forEach(item => {
        item.addEventListener('click', function() {
            const projectId = this.getAttribute('data-project');

            // 移除所有活动状态
            portfolioItems.forEach(i => i.classList.remove('active'));

            // 添加活动状态
            this.classList.add('active');

            // 可以在这里添加项目详情显示逻辑
            console.log('Selected project:', projectId);

            // 平滑滚动到项目详情区域（如果有）
            // 或者显示项目详情模态框
        });
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
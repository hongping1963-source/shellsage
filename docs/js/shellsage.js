class ShellSage {
    constructor() {
        this.initializeScrolling();
    }

    initializeScrolling() {
        const terminalBody = document.querySelector('.terminal-body');
        const scrollContent = document.querySelector('.terminal-scroll');
        
        if (terminalBody && scrollContent) {
            // 设置初始滚动位置
            terminalBody.scrollTop = 0;
            
            // 添加平滑滚动动画
            let scrollPos = 0;
            const scrollSpeed = 0.5; // 调整滚动速度
            
            function animate() {
                scrollPos += scrollSpeed;
                if (scrollPos >= scrollContent.scrollHeight / 2) {
                    scrollPos = 0;
                }
                terminalBody.scrollTop = scrollPos;
                requestAnimationFrame(animate);
            }
            
            animate();
        }
    }
}

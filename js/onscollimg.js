

    /**
    * By Alvaro Trigo 
    * Follow me on Twitter: https://twitter.com/imac2
    */
     (function(){
        init();
    
        var g_containerInViewport;
        function init(){
            setStickyContainersSize();
            bindEvents();
        }
    
        function bindEvents(){
            window.addEventListener("wheel", wheelHandler);        
        }
    
        function setStickyContainersSize(){
            document.querySelectorAll('.sticky-container').forEach(function(container){
                const stikyContainerHeight = (container.querySelector('main').offsetWidth + window.innerHeight);
                container.setAttribute('style', 'height: ' + stikyContainerHeight + 'px');
            });
        }
    
        function isElementInViewport (el) {
            const rect = el.getBoundingClientRect();
            return rect.top <= 0 && rect.bottom > document.documentElement.clientHeight;
        }
        // alert(document.documentElement.clientHeight);
        function wheelHandler(evt){
            
            const containerInViewPort = Array.from(document.querySelectorAll('.sticky-container')).filter(function(container){
                return isElementInViewport(container);
            })[0];
    
            if(!containerInViewPort){
                return;
            }
    
            var isPlaceHolderBelowTop = containerInViewPort.offsetTop < document.documentElement.scrollTop;
            var isPlaceHolderBelowBottom = containerInViewPort.offsetTop + containerInViewPort.offsetHeight > document.documentElement.scrollTop;
            let g_canScrollHorizontally = isPlaceHolderBelowTop && isPlaceHolderBelowBottom;
    
            if(g_canScrollHorizontally){
                containerInViewPort.querySelector('main').scrollLeft += evt.deltaY;
            }
        }
    })();



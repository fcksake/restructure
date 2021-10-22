$(document).ready(function(){
                $('.tab-button').click(function(){
                    $("div.work-item").fadeOut(200);
          $("div.work-item").fadeIn('slow');
                });
                });

var TxtRotate = function(el, toRotate, period) {
  this.toRotate = toRotate;
  this.el = el;
  this.loopNum = 0;
  this.period = parseInt(period, 10) || 2000;
  this.txt = '';
  this.tick();
  this.isDeleting = false;
};

TxtRotate.prototype.tick = function() {
  var i = this.loopNum % this.toRotate.length;
  var fullTxt = this.toRotate[i];

  if (this.isDeleting) {
    this.txt = fullTxt.substring(0, this.txt.length - 1);
  } else {
    this.txt = fullTxt.substring(0, this.txt.length + 1);
  }

  this.el.innerHTML = '<span class="wrap">'+this.txt+'</span>';

  var that = this;
  var delta = 200 - Math.random() * 100;

  if (this.isDeleting) { delta /= 2; }

  if (!this.isDeleting && this.txt === fullTxt) {
    delta = this.period;
    this.isDeleting = true;
  } else if (this.isDeleting && this.txt === '') {
    this.isDeleting = false;
    this.loopNum++;
    delta = 100;
  }

  setTimeout(function() {
    that.tick();
  }, delta);
};


window.onload = function() {
  var elements = document.getElementsByClassName('txt-rotate');
  for (var i=0; i<elements.length; i++) {
    var toRotate = elements[i].getAttribute('data-rotate');
    var period = elements[i].getAttribute('data-period');
    if (toRotate) {
      new TxtRotate(elements[i], JSON.parse(toRotate), period);
    }
  }
  // INJECT CSS
  var css = document.createElement("style");
  css.type = "text/css";
  css.innerHTML = ".txt-rotate > .wrap { border-right: 0.08em solid #666 }";
  document.body.appendChild(css);
};

// Tabing Script
   
  filterSelection("all")
function filterSelection(c) {
  var x, i;
  x = document.getElementsByClassName("item-grid");
  if (c == "all") {
    c = "";
  } 
  for (i = 0; i < x.length; i++) {
    w3RemoveClass(x[i], "show");
    if (x[i].className.indexOf(c) > -1) { w3AddClass(x[i], "show"); }
  }
}

function w3AddClass(element, name) {
  var i, arr1, arr2;
  arr1 = element.className.split(" ");
  arr2 = name.split(" ");
  for (i = 0; i < arr2.length; i++) {
    if (arr1.indexOf(arr2[i]) == -1) {element.className += " " + arr2[i];}
  }
}

function w3RemoveClass(element, name) {
  var i, arr1, arr2;
  arr1 = element.className.split(" ");
  arr2 = name.split(" ");
  for (i = 0; i < arr2.length; i++) {
    while (arr1.indexOf(arr2[i]) > -1) {
      arr1.splice(arr1.indexOf(arr2[i]), 1);     
    }
  }
  element.className = arr1.join(" ");
}

// Add active class to the current button (highlight it)
var btnContainer = document.getElementById("portfolio-content");
var btns = btnContainer.getElementsByClassName("tab-button");
for (var i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", function(){
    var current = document.getElementsByClassName("active");
    current[0].className = current[0].className.replace(" active", "");
    this.className += " active";
  });
}


 class FancyNav {
      constructor ({ btns, nav, highlightColor, backgroundColor, strokeWidth }) {
        this.btns = btns
        this.nav = nav
        this.highlightColor = highlightColor
        this.strokeWidth = strokeWidth
        this.backgroundColor = backgroundColor
        this.transparent = this.alphaFromColor(highlightColor, 0)
    }

    render () {
        const svg = Snap(this.nav.clientWidth, this.nav.clientHeight)
        this.svgBtns = this.btns.map(btn => this.renderSVGBtns(btn, svg))

        const btnBBox = this.svgBtns[0].getBBox()
        this.offset = this.svgBtns[1].getBBox().cx - btnBBox.cx
        this.magicPath = this.renderMagicPath(svg, btnBBox)
    this.circumference = 2 * Math.PI * btnBBox.r1 // assume circle

    this.setCurrent()
    this.bindBtnEvents()
    this.nav.appendChild(svg.node)
}

renderSVGBtns (btn, svg) {
    // Hide html btns
    btn.style.opacity = 0
    const x = btn.offsetLeft + btn.offsetWidth / 2
    const y = btn.offsetTop + btn.offsetHeight / 2
    const r = btn.offsetHeight / 2 // assume circle

    const outerCircle = svg
    .circle(x, y, r)
    .attr({
        fill: this.transparent,
        stroke: this.highlightColor,
        strokeWidth: 2
    })
    const innerCircle = svg
    .circle(x, y, r / 4)
    .attr({
        fill: this.highlightColor,
        stroke: this.transparent,
        strokeWidth: 0,
        class: 'hoverIndicator',
        transform: 's0,0'
    })

    return svg.group(outerCircle, innerCircle)
}

renderMagicPath (svg, btnBBox) {
    const pathSegments = [
    `M${btnBBox.cx},${btnBBox.y2}`
    ].concat(
      this.svgBtns.reduce((acc, b, index, arr) => {
        const res = [
          `a${btnBBox.r1},${btnBBox.r1},0,0,0,0,-${btnBBox.height}`, // left circle
          `a${btnBBox.r1},${btnBBox.r1},0,0,0,0,${btnBBox.height}` // right circle
          ]
          if (index < arr.length - 1) {
          res.push(`l${this.offset},0`) // path to next circle, not on last one
      }
      return acc.concat(res)
  }, [])
      )

    return svg
    .path(pathSegments.join(' '))
    .attr({
        stroke: this.highlightColor,
        strokeWidth: this.strokeWidth,
        strokeLinecap: 'round',
        fill: this.transparent
    })
}

setCurrent () {
    const pathLength = Snap.path.getTotalLength(this.magicPath.attr('d')) // fixes length in Firefox
    // strokeDasharray: `${this.circumference - this.strokeWidth / 4}, ${pathLength}`,
    this.magicPath.attr({
      strokeDasharray: `${this.circumference - this.strokeWidth / 4}, ${pathLength}`,
      strokeDashoffset: 0
  })
}

goToIndex (index) {
    const dashOffset = -index * (this.circumference + this.offset)
    Snap.animate(this.removePx(this.magicPath.attr('strokeDashoffset')), dashOffset, v => {
      this.magicPath.attr({ strokeDashoffset: v })
  }, 600, mina.easeinout )
}

bindBtnEvents () {
    this.btns.forEach((btn, index) => {
      btn.addEventListener('click', () => this.handleClick(index), false)
      btn.addEventListener('mouseover', () => this.showFocus(index), false)
      btn.addEventListener('focus', () => this.showFocus(index), false)
      btn.addEventListener('mouseout', () => this.removeFocus(index), false)
      btn.addEventListener('blur', () => this.removeFocus(index), false)
  })
}

showFocus (index) {
    this.svgBtns[index]
    .select('.hoverIndicator')
    .stop()
    .animate({ transform: 's1,1' }, 225, mina.easein)
}

removeFocus (index) {
    this.svgBtns[index]
    .select('.hoverIndicator')
    .stop()
    .animate({ transform: 's0,0' }, 175, mina.easeout)
}

handleClick (index) {
    this.goToIndex(index)
}

removePx (str) {
    return parseInt(str.replace('px', ''), 10)
}

alphaFromColor (c, alpha) {
    const {r, g, b} = Snap.color(c)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
}
}

class Gallery {
  constructor ({ container, items, btns, nav }) {
    this.container = container
    this.items = items
    this.btns = btns
    this.nav = nav
    this.itemWidth = this.items[0].clientWidth
}

render () {
    this.btns.forEach((btn, index) => {
      btn.addEventListener('click', () => this.goToIndex(index), false)
  })

    const fancyNav = new FancyNav({
      btns: this.btns,
      nav: this.nav,
      highlightColor: '#e44b4c',
      backgroundColor: '#FFFFFF',
      strokeWidth: 10
  }).render()
}

goToIndex (index) {
    this.container.style.transform = `translateX(${-index * this.itemWidth}px)`
}
}

const gallery = new Gallery({
  container: document.querySelector('.js-container'),
  nav: document.querySelector('.js-nav'),
  items: Array.from(document.querySelectorAll('.js-item')),
  btns: Array.from(document.querySelectorAll('.js-button'))
}).render()


   $( document ).ready(function(){
    $('html').append('<div style="" id="loadingDiv"><h1 id="s100">SAMANTHa HO</h1><h1 id="s200">SAMANTHA HO</h1><h1 id="s300">SAMANTHA HO</h1><h1 id="s400">SAMANTHa HO</h1><h1 id="s500">SAMANTHa HO</h1><h1 id="s600">SAMANTHa HO</h1><h1 id="s700">SAMANTHa HO</h1><h1 id="s800">SAMANTHa HO</h1><h1 id="s900">SAMANTHa HO</h1></div>');
    $(window).on('load', function(){
       setTimeout(removeLoader); //wait for page load PLUS two seconds.
   });
    setTimeout(function(){ 
        $("loadingDiv").show('slow'); 
    },2000); 
    $("html").css({"background": "#F5F0FF"});
    $("body").hide();
    $("#loadingDiv").css({"z-index": "99", "opacity": "1"});
    function removeLoader(){
    // $( "#loadingDiv" ).hide('slow', function() {
      // fadeOut complete. Remove the loading div
     // $("#loadingDiv h1").css({"display": "none"});
     // $( "#loadingDiv" ).remove(); //makes page more lightweight 
 //});  
     $('body').delay(1000).show('slow');
     $("html").css({"background": "#fff"});    
 }
});




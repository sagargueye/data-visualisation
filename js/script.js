function resizeIframe(obj) {
    setTimeout(
        function (){
            obj.style.width = '100%';
            var hauteur = obj.contentWindow.document.documentElement.scrollHeight + 20;
            obj.style.height = hauteur + 'px';
        },2000);
}
$(document).ready(function (){
    // $("#carte").hide();
    $(".backtohome").hide();
    $("#scrollLent").click(function() {
        $(".backtohome").show();
        $("#carte").show();
        $('html, body').animate({
            scrollTop: $("#scroll").offset().top
        }, 2000);
        // $('html, body').animate({scrollTop: '0px'},1000);
        setTimeout(function(){
            $(".scroll__graphic").addClass('is-fixed');
            $("#home").hide();
        }, 2000);
    });

    var fixmeTop = $('.fixme').offset().top;
    $(window).scroll(function() {
        //baniere fix
        var currentScroll = $(window).scrollTop();
        if ($("#home").is(":hidden") /*&& currentScroll < fixmeTop*/) {
            $('.fixme').css({
                position: 'fixed',
                top: '0',
                left: '0'
            });
            $(".scroll__graphic").addClass('is-fixed');
        } else {
            $('.fixme').css({
                position: 'static'
            });
        }

        //button scroll to top
        if ($(this).scrollTop() > 100) {
            $('.scrollToTop').fadeIn();
        } else {
            $('.scrollToTop').fadeOut();
        }
        //carte fixe
        // if(currentScroll > $(".scroll__graphic").offset().top){
        //     $(".scroll__graphic").addClass('is-fixed');
        // }else{
        //     $(".scroll__graphic").removeClass('is-fixed');
        // }

    });

    //==================================================Click event to scroll to top
    $('.scrollToTop').click(function(){
        $('html, body').animate({scrollTop : 0},800);
        return false;
    });
    //===========================================remonter à laccueil
    $(".backtohome").click(function (){
        $("#home").show();
        $(".backtohome").hide();
        $(".scroll__graphic").removeClass('is-fixed');
        $('.fixme').css({ position: 'static'});
        $('html, body').animate({
            scrollTop: 0
        }, {
            duration: 800,
            complete: function () {
                console.log("finissss");
                $("#carte").hide();
            }
        });

    });

    //==========================================for ScrollTrigger


    // ===============================================using d3 for convenience
    var container = d3.select("#scroll");
    var graphic = container.select(".scroll__graphic");
    var chart = graphic.select(".chart");
    var text = container.select(".scroll__text");
    var step = text.selectAll(".step");

    // initialize the scrollama
    var scroller = scrollama();

    // generic window resize listener event
    function handleResize() {
        // 1. update height of step elements
        var stepHeight = Math.floor(window.innerHeight * 0.75);
        step.style("height", stepHeight + "px");

        // 2. update width/height of graphic element
        var bodyWidth = d3.select("body").node().offsetWidth;

        graphic
            .style("width", bodyWidth + "px")
            .style("height", window.innerHeight + "px");

        var chartMargin = 32;
        var textWidth = text.node().offsetWidth;
        var chartWidth = graphic.node().offsetWidth - textWidth - chartMargin;

        chart
            .style("width", chartWidth + "px")
            .style("height", Math.floor(window.innerHeight ) + "px");

        // 3. tell scrollama to update new element dimensions
        scroller.resize();
    }

    // scrollama event handlers
    function handleStepEnter(response) {
        // response = { element, direction, index }

        // add color to current step only
        step.classed("is-active", function(d, i) {
            return i === response.index;
        });

        // update graphic based on step
        chart.select("p").text(response.index + 1);//todo edit contain......



        if(response.index<4)
            $(".chart img").fadeOut('slow', function (event) {
                chart.select('img').attr('src', "plan_3D/RDC0"+(response.index+1)+'.png');
                chart.select('img').attr('useMap', "#RDC0"+(response.index+1));
                $(".chart img").fadeIn('slow');
            });
        else if(response.index>=4)
            $(".chart img").fadeOut('slow', function (event) {
                chart.select('img').attr('src', "plan_3D/niveau0"+(response.index+1)+'.png');
                chart.select('img').attr('useMap', "#niveau0"+(response.index+1));
                $(".chart img").fadeIn('slow');
            });
        else
            console.log(response.index);


        //MAPS SUR LES MATERIAUX DU PLAN
        //if(response.index==1 && $("map[name='RDC02']").length==0){

            // $test='<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>';
            // $('<map name="RDC02">' +
            //     '                <area class="ordi demo popover" id="open"  shape="rect" coords="271,213,309,234" alt="bureau 1" href="bureau1.htm" ' +
            //     '                data-toggle="popover" title="Popover title" data-content="'+$test+'">' +
            //     '                <area class="ordi" shape="rect" coords="339,138,375,155" alt="bureau 2" href="bureau2.htm">' +
            //     '                <area class="ordi" shape="rect" coords="367,207,409,225" alt="bureau 3" href="bureau3.htm">' +
            //     '                <area class="ordi" shape="rect" coords="403,293,446,313" alt="bureau 4" href="bureau4.htm">' +
            //     '                <area class="ordi" shape="rect" coords="433,197,459,241" alt="bureau 5" href="bureau5.htm">' +
            //     '                <area class="ordi" shape="rect" coords="471,240,501,260" alt="bureau 6" href="bureau6.htm">' +
            //     '                <area class="ordi" shape="rect" coords="648,428,665,443" alt="bureau 8" href="bureau8.htm">' +
            //     '                <area class="ordi" shape="rect" coords="512,290,543,311" alt="bureau 7" href="bureau7.htm">' +
            //     '</map>'
            // ).insertAfter($(".chart img") );
            // $("body").on("hover","#open",function(e) {
            //     e.preventDefault();
            //     //$( "map area.ordi").slideToggle("slow");
            //     console.log(e);
            //     $("map area.popover").tooltip({
            //         container: 'body',
            //         trigger: 'hover',
            //         title:"eeeeee",
            //         content: "And here's some amazing content. It's very engaging. Right"
            //     });
            // });

        //}
    }




    function handleContainerEnter(response) {
        //response = { direction }

        //sticky the graphic (old school)
        graphic.classed("is-fixed", true);
        graphic.classed("is-bottom", false);
    }

    function handleContainerExit(response) {
        // response = { direction }

        // un-sticky the graphic, and pin to top/bottom of container
        graphic.classed("is-fixed", false);
        graphic.classed("is-bottom", response.direction === "down");
    }

    function init() {
        // 1. force a resize on load to ensure proper dimensions are sent to scrollama
        handleResize();

        // 2. setup the scroller passing options
        // this will also initialize trigger observations
        // 3. bind scrollama event handlers (this can be chained like below)
        //console.log(scroller);
        scroller
            .setup({
                container: "#scroll",
                graphic: ".scroll__graphic",
                text: ".scroll__text",
                step: ".scroll__text .step",
                debug: false
            })
            .onStepEnter(handleStepEnter)
            .onContainerEnter(handleContainerEnter)
            .onContainerExit(handleContainerExit);

        // setup resize event
        window.addEventListener("resize", handleResize);
    }

    // kick things off
    init();

});


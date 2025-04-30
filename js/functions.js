$(function() {
    var currentValue = 0;
    var isDrag = false;
    var preco_maximo = 70000;
    var preco_atual = 0;
    var pointerWidth = 26; // Largura do ponteiro em pixels

    // Eventos para desktop
    $('.pointer-barra').mousedown(function(e) {
        e.preventDefault();
        isDrag = true;
        disableTextSelection();
    });

    // Eventos para mobile
    $('.pointer-barra').on('touchstart', function(e) {
        e.preventDefault();
        isDrag = true;
        disableTextSelection();
    });

    $(document).mouseup(function() {
        isDrag = false;
        enableTextSelection();
    });

    $(document).on('touchend', function() {
        isDrag = false;
        enableTextSelection();
    });

    $('.barra-preco').mousemove(function(e) {
        if (isDrag) {
            handleMove(e);
        }
    });

    $('.barra-preco').on('touchmove', function(e) {
        if (isDrag) {
            e.preventDefault();
            var touch = e.originalEvent.touches[0];
            var customEvent = {
                pageX: touch.pageX
            };
            handleMove(customEvent);
        }
    });

    function handleMove(e) {
        var elBase = $('.barra-preco');
        var barraOffset = elBase.offset().left;
        var barraWidth = elBase.width();
        var mouseX = e.pageX - barraOffset;

        // Ajuste preciso dos limites
        mouseX = Math.max(0, Math.min(mouseX, barraWidth));

        // Cálculo da posição centralizada
        var pointerPosition = mouseX - (pointerWidth / 2);
        
        // Atualização suave
        requestAnimationFrame(function() {
            $('.pointer-barra').css('left', pointerPosition + 'px');
            currentValue = (mouseX / barraWidth) * 100;
            $('.barra-preco-fill').css('width', currentValue + '%');

            preco_atual = currentValue/100 * preco_maximo;
            preco_atual = formatarPreco(preco_atual);
            $('.preco_pesquisa').html('R$'+preco_atual);
        });
    }

    function formatarPreco(preco_atual) {
        preco_atual = preco_atual.toFixed(2);
        preco_arr = preco_atual.split('.');

        var novo_preco = formatarTotal(preco_arr);
        return novo_preco;
    }

    function formatarTotal(preco_arr) {
        if(preco_arr[0] < 1000) {
            return preco_arr[0]+','+preco_arr[1];
        } else if(preco_arr[0] < 10000) {
            return preco_arr[0][0]+'.'+preco_arr[0].substr(1,preco_arr[0].length)+','+preco_arr[1];
        } else {
            return preco_arr[0][0]+preco_arr[0][1]+'.'+preco_arr[0].substr(2,preco_arr[0].length)+','+preco_arr[1];
        }
    }

    function disableTextSelection() {
        $("body").css({
            "-webkit-user-select": "none",
            "-moz-user-select": "none",
            "-ms-user-select": "none",
            "-o-user-select": "none",
            "user-select": "none"
        });
    }

    function enableTextSelection() {
        $("body").css({
            "-webkit-user-select": "auto",
            "-moz-user-select": "auto",
            "-ms-user-select": "auto",
            "-o-user-select": "auto",
            "user-select": "auto"
        });
    }

    // Slider de imagens
    var imgShow = 3;
    var minIndex = imgShow - 1;
    var maxIndex = Math.ceil($('.mini-img-wraper').length/3)-1;
    var curIndex = 0;

    initSlider();
    navigateSlider();
    clickSlider();

    function initSlider() {
        var amt = $('.mini-img-wraper').length * 33.3;
        var elScroll = $('.nav-galeria-wraper');
        var elSingle = $('.mini-img-wraper');
        elScroll.css('width',amt+'%');
        elSingle.css('width',33.3*(100/amt)+'%');
    }

    function navigateSlider() {
        $('.arrow-right-nav').click(function() {
            if(curIndex < maxIndex) {
                curIndex++;
                var elOff = $('.mini-img-wraper').eq(curIndex*3).offset().left - $('.nav-galeria-wraper').offset().left;
                $('.nav-galeria').animate({'scrollLeft':elOff+'px'});
            }
        });

        $('.arrow-left-nav').click(function() {
            if(curIndex > 0) {
                curIndex--;
                var elOff = $('.mini-img-wraper').eq(curIndex*3).offset().left - $('.nav-galeria-wraper').offset().left;
                $('.nav-galeria').animate({'scrollLeft':elOff+'px'});
            }
        });
    }

    function clickSlider() {
        $('.mini-img-wraper').click(function() {
            $('.mini-img-wraper').css('background-color','transparent');
            $(this).css('background-color','rgb(210,210,210)');
            var img = $(this).children().css('background-image');
            $('.foto-destaque').css('background-image',img);
        });

        $('.mini-img-wraper').eq(0).click();
    }

    // Navegação para contato
    var directory = '/Projetos/projeto_05/';

    $('[goto=contato]').click(function() {
        location.href=directory+'index.html?contato';
        return false;
    });

    checkUrl();

    function checkUrl() {
        var url = location.href.split('/');
        var curPage = url[url.length-1].split('?');

        if(curPage[1] != undefined && curPage[1] == 'contato') {
            $('header nav a').css('color','black');
            $('footer nav a').css('color','white');
            $('[goto=contato]').css('color','#EB2D2D');
            $('html,body').animate({'scrollTop':$('#contato').offset().top});
        }
    }

    // Menu responsivo
    $('.mobile').click(function() {
        $(this).find('ul').slideToggle();
    });

    // Sistema de depoimentos
    navegarDepoimentos();
    iniciarDepoimentos();

    var amtDepoimento = $('.depoimento-single p').length;
    var curIndex = 0;

    function iniciarDepoimentos() {
        $('.depoimento-single p').hide();
        $('.depoimento-single p').eq(0).show();
    }

    function navegarDepoimentos() {
        $('[next]').click(function() {
            curIndex++;
            if(curIndex >= amtDepoimento) curIndex = 0;
            $('.depoimento-single p').hide();
            $('.depoimento-single p').eq(curIndex).show();
        });
        
        $('[prev]').click(function() {
            curIndex--;
            if(curIndex < 0) curIndex = amtDepoimento-1;
            $('.depoimento-single p').hide();
            $('.depoimento-single p').eq(curIndex).show();
        });
    }
});

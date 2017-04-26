//вводим необходимые переменные
var totalAdvices = 0;
var selectedAdvice = 1;
var inputStr = '';
var lastOne;
//переменная для указания максимального количества подсказок
//(в прототипе максимум - 5, но написано, что если слишком много - можно 20)
var maxAdvices = 20;
//для списка популярных
var pop = ['Екатеринбург', 'Арамиль', 'Заречный', 'Каменск-Уральский', 'Невьянск'];

//показываем наиболее популярные города
$('#citySearch').focusin(function () {
    if ($(this).val() == 0) {
        //открываем список
        $('#searchAdvicesList').html('').show();
        //и закидываем в него пункты с названиями популярных городов
        $('#searchAdvicesList').append('<li id="popAdvices">Наиболее популярные города</li>');
        for (var i = 0; i < pop.length; i++) {
            $('#searchAdvicesList').append('<li class="searchAdvice">' + pop[i] + '</li>');
        }
    }
});

//основная часть - поиск и подключение функций
$(window).on('load', function () {
    //запускаем валидацию на потерю фокуса при неверном значении
    validation ();
    //читаем, что вводят с клавы
    $('#citySearch').keyup(function(ev) {
        //говорим скрипту, что делать при нажатии на клавишу
        switch(ev.keyCode) {
            //ставим игнор на эти клавиши (потом к ним сможем приклеить действия)
            // - enter
            case 13:
            // - escape
            case 27:

            // - left
            case 37:
            // - up
            case 38:
            // - right
            case 39:
            // - down
            case 40:
            
            break;

            default:
                //подсказки выводим только если поле ввода не пустое
                if ($(this).val().length > 0) {
                    //создаем массив, куда будем сохранять выбранные варианты для отображения
                    var result = new Array ();
                    //делаем сравнение полученной строки с элементом "City" в массиве cts[]
                    //забиваем в переменную введеные буквы
                    inputStr = $(this).val();
                    //создаем регулярное выражение для поиска введенного текста
                    var reg = new RegExp ('^' + inputStr, 'i');
                    //осуществляем поиск по всему массиву
                    for (var i = 0; i < cts.length; i++) {
                        if (cts[i].City.match(reg) != null) {
                            //записываем подходящие варианты исходного массива в наш массив вариантов
                            result.push(cts[i].City);
                        }
                    }
                    totalAdvices = result.length;
                    //показываем варианты
                    list (result);
                    //для работы функций валидации и предупреждения сохраняем вариант, который будет вверху списка
                    //соответственно если вариант останется один, то он же будет и верхним, а значит единственным и сохраненным:)
                    lastOne = result[0];
                    //скидываем счетчик для корректной работы стрелочек
                    selectedAdvice = 1;
                }
                //убираем список вариантов и скидываем счетчики, если строчка ввода пустая
                else {
                    warning(0);
                    $('#searchAdvicesList').html('').hide();
                    totalAdvices = 0;
                    selectedAdvice = 1;
                }
            break;
        }
    });
    //включаем управление мышкой
    mouse ();

    //включаем управление кнопками
    btns ();
});

//ФУНКЦИИ:

//проверка для валидации и предупреждения
function check () {
    if (totalAdvices == 0 && $('#citySearch').val().length > 0 && $('#citySearch').val() != $('.active').text() && $('#citySearch').val() != lastOne) {
        return 1;
    }
    else {
        return 0;
    }
}

//валидация
function validation () {
    //вкл
    //если фокус уходит
    $('#citySearch').focusout(function () {
        //проверяем чтобы валидация сработала только в случае ошибки
        if (check ()) {
            //отключаем предупреждение, так как уже ошибка
            warning(0);
            //небольшая задержка на исполнение
            setTimeout (function () {
                //добавляем красный цвет поля и сообщение
                $('#citySearch').addClass('error');
                $('#errorMsg').css('display', 'inline-block');
            }, 50);
        }
    });
    //выкл
    //если фокус вернулся - отменяем все действия от focusout
    $('#citySearch').focusin(function () {
        //удаляем красную рамку
        $(this).removeClass('error');
        //выделяем весь введенный текст
        $(this).select();
        //убираем текст ошибки
        $('#errorMsg').css('display', 'none');
        //и включаем предупреждение
        if (check ())
            {warning(1);}
    });
}

//предупреждение (включается если "1")
function warning (on) {
    //вкл
    if (on == 1) {
        //небольшая задержка на исполнение
        setTimeout (function () {
            //добавляем оранжевый цвет поля и сообщение-предупреждение
            $('#citySearch').addClass('warning');
            $('#warningMsg').css('display', 'block');
        }, 50);
    }
    //выкл
    else {
        //удаляем предупреждение
        $('#citySearch').removeClass('warning');
        $('#warningMsg').css('display', 'none');
    }
}

//отображение вариантов
function list (result) {
    //проверяем, что у нас есть совпадения, если нет - включаем предупреждение
    if (totalAdvices > 0) {
        //выключаем предупреждение, если оно было
        warning(0);
        //чистим дисплей подсказок и включаем отображение
        $('#searchAdvicesList').html('').show();
        //если вариантов больше 20 штук
        if (totalAdvices >= maxAdvices) {
            //создаем подсказку для 5 или 20 (значение указывается в переменной maxAdvices) первых вариантов из массива
            for (var i = 0; i < maxAdvices; i++) {
                $('#searchAdvicesList').append('<li class="searchAdvice">' + result[i] + '</li>');
            }
            $('#searchAdvicesList').append('<li id="tooManyAdvices">Показано ' + maxAdvices + ' вариантов из ' + totalAdvices + ' найденных. Пожалуйста, уточните запрос, чтобы увидеть остальные</li>');
        }
        //если вариант остался только один и введенное значение совпадает с единственным вариантом из списка
        else if (totalAdvices === 1 && lastOne != undefined && inputStr.toLowerCase() == lastOne.toLowerCase()) {
            $('#searchAdvicesList').append('<li class="searchAdvice">' + result[0] + '</li>');
            //передаем значение варианта
            $('#citySearch').val(result[0]);
            //убираем список вариантов, скидываем фокус с инпута и скидываем счетчики
            $('#searchAdvicesList').fadeOut(1000);
            $('#citySearch').blur();
            totalAdvices = 0;
            selectedAdvice = 1;
        }

        //если вариантов не больше 5 или 20 (maxAdvices)
        else {
            //создаем подсказку для каждого варианта из массива
            for (var i = 0; i < totalAdvices; i++) {
                $('#searchAdvicesList').append('<li class="searchAdvice">' + result[i] + '</li>');
            }
        }
        //выделяем первый вариант
        $('.searchAdvice:first-of-type').addClass('active');
    }
    //выводим предупреждение (в минимальной версии автокомплита выводится "Не найдено")
    else {
        //скрываем список
        $('#searchAdvicesList').html('').hide();
        //изначально выводилось "Не найдено", но в задании в опциях предупреждение выводится в том же случае
        // $('#searchAdvicesList').append('<li id="noAdvice">Не найдено</li>');
        //выводим предупреждение
        warning(1);
    }
}

//управление мышкой
function mouse () {
    //подсвечиваем вариант от курсора
    $('body').on({
        //срабатывает при наведении курсора
        mouseenter: function () {
            //убираем вначале класс, если он был на каком-то варианте
            $('#searchAdvicesList li').removeClass('active');
            $(this).addClass('active');
        }
    }, 'li.searchAdvice');

    //клик на вариант из списка
    $('body').on('click', 'li.searchAdvice', function () {
        //передаем значение из варианта, на который щелкнули в строку поиска
        $('#citySearch').val($(this).text());
        //убираем список вариантов и скидываем счетчики
        $('#searchAdvicesList').hide();
        totalAdvices = 0;
        selectedAdvice = 1;
    });

    //клик в любом месте сайта
    $('html').on('click', function () {
        //убираем список вариантов
        $('#searchAdvicesList').hide();
    });

    //если щелчок на поле ввода - показать скрытый список вариантов
    $('#citySearch').on('click', function (ev) {
        if (totalAdvices) {
            $('#searchAdvicesList').show();
        }
        ev.stopPropagation();
    });
}

//управление кнопками
function btns () {
    $('#citySearch').keydown(function(ev) {
        switch(ev.keyCode) {
            // - enter
            case 13:
                //забиваем значение выделенного варианта
                $(this).val($('.active').text());
                $('#searchAdvicesList').hide();
                //отключанием предупреждение и скидываем счетчики
                warning(0);
                totalAdvices = 0;
                selectedAdvice = 1;
                //убираем фокус с инпута и переходим к следующему полю формы (если оно есть)
                $(this).blur();
                $(this).nextAll().focus();
                ev.preventDefault();
            break;
            // - escape
            case 27:
                //убираем список вариантов
                $('#searchAdvicesList').hide();
                return false;
            break;

            // - up
            case 38:
            // - down
            case 40:
                ev.preventDefault();
                if (totalAdvices) {
                    //управление стрелочками
                    arrows (ev.keyCode-39);
                }
            break;
        }
    });
}

//управление стрелочками
function arrows (keyCode) {
    //удаляем выделение, если было
    $('#searchAdvicesList li').removeClass('active');
    //для стрелки вниз
    if (keyCode == 1 && selectedAdvice < totalAdvices) {
        selectedAdvice++;
        console.log('down!');
    }
    //для стрелки вверх
    else if (keyCode == -1 && selectedAdvice > 0) {
        selectedAdvice--;
    }

    //подсвечиваем выбранный вариант
    if (selectedAdvice > 0) {
        $('#searchAdvicesList li').eq(selectedAdvice-1).addClass('active');
        //забиваем выделенный пункт в строку ввода
        $('#citySearch').val($('#searchAdvicesList li').eq(selectedAdvice-1).text());
    }
    else {
        //оставляем введенное значение в поле ввода
        $('#citySearch').val(inputStr);
    }
    return 0;
}

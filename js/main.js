// JavaScript source code
let income = 30000
let capital = 15000

let target = 600000
let yearCost = 24000

let efficiency = 1.04
let savings = 0.35
let raise = 1.011

let yearcap = [15000]



$(function () { //shorthand document.ready function
    $('#form').on('submit', function (e) {
        e.preventDefault();  //prevent form from submitting
        var formdata = $("#form").serializeArray();
        var data = {};
        $(formdata).each(function (index, obj) {

            if (data[obj.name] === undefined)
                data[obj.name];

            data[obj.name] = obj.value;

        });

        console.log(data);
        console.log(data[0]);
        console.log(data.income); //use the console for debugging, F12 in Chrome, not alerts

        while (capital < target) {
            income = income * raise;
            capital = (capital + (income * savings)) * efficiency;

            yearcap.push(capital);
        }
        console.log(yearcap);
    });
    $('.outcome').text(yearcap.length);
});

// $.grep(data, function (x) { return x.name == 'efficiency' } )
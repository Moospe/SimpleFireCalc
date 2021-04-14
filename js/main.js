// JavaScript source code
let yearcap = [];

$(function () { 
    $('#form').on('submit', function (e) {
        e.preventDefault();

        var formdata = $("#form").serializeArray();
        var data = {};
        $(formdata).each(function (index, obj) {

            if (data[obj.name] === undefined)
                data[obj.name];

            data[obj.name] = Number(obj.value);
            
        });

        target = (data.yearCost / data.efficiency) * 100

        yearcap = [data.capital]
        data.raise = (data.raise / 100) + 1
        data.efficiency = (data.efficiency / 100) + 1
        data.savings = data.savings / 100

        while (data.capital < target) {
            data.income = data.income * data.raise;
            data.capital = (data.capital + (data.income * data.savings)) * data.efficiency;

            yearcap.push(data.capital);
        }
        console.log(yearcap);
    });
    $('.outcome').text(yearcap.length);
});

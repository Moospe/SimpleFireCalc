// JavaScript source code
let income = 30000
let capital = 15000
let target = 600000

let yearcap = [15000]







$(function () { //shorthand document.ready function
    $('#login_form').on('submit', function (e) { //use on if jQuery 1.7+
        e.preventDefault();  //prevent form from submitting
        var data = $("#login_form :input").serializeArray();
        console.log(data); //use the console for debugging, F12 in Chrome, not alerts

        while (capital < target) {
            income = income * 1.011;
            capital = (capital + (income * 0.35)) * 1.04;

            yearcap.push(capital);

        }

        console.log(yearcap);

    });

    $('.outcome').text(yearcap.length);
});
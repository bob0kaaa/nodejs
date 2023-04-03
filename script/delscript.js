let data_td = document.querySelectorAll(".data-td");

window.onload = function (){
    SelectButton();
};

function TableSearch() {
    var phrase = document.getElementById('search');
    var table = document.getElementById('info-table');
    var regPhrase = new RegExp(phrase.value, 'i');
    var flag = false;
    for (var i = 1; i < table.rows.length; i++) {
        flag = false;
        for (var j = table.rows[i].cells.length - 1; j >= 0; j--) {
            flag = regPhrase.test(table.rows[i].cells[j].innerHTML);
            if (flag) break;
        }
        if (flag) {
            table.rows[i].style.display = "";
        } else {
            table.rows[i].style.display = "none";
        }

    }
}
function SelectButton() {
    for (let i = 0; i < data_td.length; i++) {
        const elements = data_td[i];
        let del_btn = elements.querySelector('.del-btn');
        let name = elements.querySelector('#name-td').innerHTML;
        del_btn.onclick = function () {
            let confdel = confirm("Вы уверены что хотите удалить " + name + " ?");
            if (confdel) {
                let mac = elements.querySelector('.mac-td').innerHTML;
                console.log(elements.querySelector('.mac-td').innerHTML);
                let del = JSON.stringify({Mac: mac});
                let request = new XMLHttpRequest();
                request.open("POST", "/delite", true);
                request.setRequestHeader("Content-Type", "application/json");
                request.addEventListener("load", function () {
                    location.reload();
                });
                request.send(del);
            }
        };
    }
    ;
}
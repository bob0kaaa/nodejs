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
    for(let i = 0; i < data_td.length; i++) {
        const elements = data_td[i];
        let edit_btn = elements.querySelector('.edit-btn');
        let sub_btn = elements.querySelector('.submit-btn');
        let del_btn = elements.querySelector('.del-btn');
        let name = elements.querySelector('#name-td').innerHTML;
        let exit_btn = elements.querySelector('.exit-btn');
        let com_btn = elements.querySelector('.com-btn');
        let exit_btn_com = elements.querySelector('.exit-btn-com');
        let sub_com_btn = elements.querySelector('.submit-btn-com');
        edit_btn.onclick = function() {
            elements.querySelector('#sn').classList.toggle('hidden');
            elements.querySelector('#input').classList.remove('hidden');
            elements.querySelector('#edit').classList.toggle('hidden');
            elements.querySelector('#submit').classList.remove('hidden');
            elements.querySelector('#del-btn').classList.add('hidden');
            elements.querySelector('#exit-btn').classList.remove('hidden');
            elements.querySelector('#com').classList.add('hidden');
        };
        sub_btn.onclick = function () {
            let upsn = elements.querySelector('#input').value;
            let sn_old = elements.querySelector('#post').value;
            let sn_up = JSON.stringify({New: upsn, Old: sn_old});
            let request = new XMLHttpRequest();
            request.open("POST", "/update", true);
            request.setRequestHeader("Content-Type", "application/json");
            request.addEventListener("load", function () {
                location.reload();
            });
            request.send(sn_up);
        };
        del_btn.onclick = function () {
            let confdel = confirm("Вы уверены что хотите удалить "+ name +" ?");
            if(confdel){
                let mac = elements.querySelector('.mac-td').innerHTML;
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
        sub_com_btn.onclick = function () {
            let new_com = elements.querySelector('#input-com').value;
            let mac_com = elements.querySelector('.mac-td').innerHTML;
            let com_up = JSON.stringify({New_comm: new_com, Mac_com: mac_com});
            let request = new XMLHttpRequest();
            request.open("POST", "/com", true);
            request.setRequestHeader("Content-Type", "application/json");
            request.addEventListener("load", function () {
                location.reload();
            });
            request.send(com_up);
        };
        exit_btn.onclick = function () {
            elements.querySelector('#input').classList.toggle('hidden');
            elements.querySelector('#sn').classList.remove('hidden');
            elements.querySelector('#edit').classList.remove('hidden');
            elements.querySelector('#submit').classList.add('hidden');
            elements.querySelector('#exit-btn').classList.add('hidden');
            elements.querySelector('#del-btn').classList.remove('hidden');
            elements.querySelector('#com').classList.remove('hidden');
        };
        com_btn.onclick = function() {
            elements.querySelector('#input-com').classList.remove('hidden');
            elements.querySelector('#com-data').classList.add('hidden');
            elements.querySelector('#com').classList.add('hidden');
            elements.querySelector('#submit-com').classList.remove('hidden');
            elements.querySelector('#del-btn').classList.add('hidden');
            elements.querySelector('#exit-btn-com').classList.remove('hidden');
            elements.querySelector('#edit').classList.add('hidden');
        };
        exit_btn_com.onclick = function () {
            elements.querySelector('#input-com').classList.add('hidden');
            elements.querySelector('#com-data').classList.remove('hidden');
            elements.querySelector('#com').classList.remove('hidden');
            elements.querySelector('#submit-com').classList.add('hidden');
            elements.querySelector('#exit-btn-com').classList.add('hidden');
            elements.querySelector('#del-btn').classList.remove('hidden');
            elements.querySelector('#edit').classList.remove('hidden');
            elements.querySelector('.com').classList.add('hidden');
        };
    };
}
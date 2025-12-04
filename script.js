// 📌 1) SİFARİŞ GÖNDƏRMƏ
function sendOrder() {
    const masa = document.getElementById("masa").value;
    const mehsul = document.getElementById("mehsul").value;
    const qeyd = document.getElementById("qeyd").value;

    if (!masa || !mehsul) {
        alert("Masa və məhsul boş ola bilməz!");
        return;
    }

    const order = {
        masa,
        mehsul,
        qeyd,
        time: new Date().toLocaleTimeString()
    };

    let all = JSON.parse(localStorage.getItem("orders")) || [];
    all.push(order);
    localStorage.setItem("orders", JSON.stringify(all));

    document.getElementById("sound").play();

    alert("Sifariş göndərildi ✔");
}



// 📌 2) MƏTBƏX PANELİ — SİFARİŞLƏRİ GÖSTƏR
if (location.pathname.includes("kitchen.html")) {
    let all = JSON.parse(localStorage.getItem("orders")) || [];
    const list = document.getElementById("orderList");

    all.forEach((o) => {
        const li = document.createElement("li");
        li.textContent = `${o.masa} | ${o.mehsul} | ${o.qeyd} | ${o.time}`;
        list.appendChild(li);
    });
}



// 📌 3) MÜDIR GİRİŞİ
function adminLogin() {
    const code = document.getElementById("adminCode").value;

    if (code === "1986") {
        document.getElementById("panel").style.display = "block";
    } else {
        alert("Kod yanlışdır!");
    }
}



// 📌 4) CƏRİMƏ ƏLAVƏ ET
function addCerime() {
    const amount = document.getElementById("cerime").value;

    if (!amount) {
        alert("Məbləğ daxil et!");
        return;
    }

    const list = document.getElementById("cerimeList");
    const li = document.createElement("li");
    li.textContent = amount + " AZN";

    list.appendChild(li);
}



// 📌 5) MÜDIR PANELİ — SİFARİŞLƏRİ GÖSTƏR
if (location.pathname.includes("admin.html")) {
    let all = JSON.parse(localStorage.getItem("orders")) || [];
    const list = document.getElementById("orderListAdmin");

    all.forEach((o) => {
        const li = document.createElement("li");
        li.textContent = `${o.masa} | ${o.mehsul} | ${o.qeyd} | ${o.time}`;
        list.appendChild(li);
    });
}

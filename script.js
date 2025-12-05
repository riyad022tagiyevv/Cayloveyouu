// Firebase Konfiqurasiya
var firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT-default-rtdb.firebaseio.com",
    projectId: "YOUR_PROJECT",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "000000000",
    appId: "1:000000000:web:000000000"
};
firebase.initializeApp(firebaseConfig);
var db = firebase.database();

// Səs faylı
var pingSound = new Audio('ping.mp3');

// Ofisiant → Göndər
function sendOrder() {
    const masa = document.getElementById('masa').value.trim();
    const mehsul = document.getElementById('mehsul').value.trim();
    const qeyd = document.getElementById('qeyd').value.trim() || '-';
    if(!masa || !mehsul){ alert('Masa və məhsul boş ola bilməz!'); return; }

    const id = Date.now();
    db.ref('orders/' + id).set({
        masa: masa,
        mehsul: mehsul,
        qeyd: qeyd,
        time: new Date().toLocaleTimeString(),
        status: 'new'
    });

    pingSound.play().catch(()=>{});
    alert('Sifariş göndərildi ✔');
}

// Mətbəx → Yeni sifarişləri dinlə
var lastOrderIds = [];
function loadKitchen() {
    db.ref('orders').on('value', snapshot => {
        if(!snapshot.exists()) {
            document.getElementById('ordersBox').innerHTML = 'Sifariş yoxdur';
            lastOrderIds = [];
            return;
        }

        const data = snapshot.val();
        let html = '';
        let currentIds = [];

        Object.keys(data).forEach(id => {
            const o = data[id];
            currentIds.push(id);
            html += `<div class='order'>
                        <b>Masa:</b> ${o.masa} <br>
                        <b>Sifariş:</b> ${o.mehsul} <br>
                        <b>Qeyd:</b> ${o.qeyd} <br>
                        <b>Zaman:</b> ${o.time}
                    </div>`;
        });

        // Yeni sifariş gəldisə səs çal
        currentIds.forEach(id => { if(!lastOrderIds.includes(id)) pingSound.play().catch(()=>{}); });
        lastOrderIds = currentIds;

        document.getElementById('ordersBox').innerHTML = html;
    });
}

function listenNewOrders(){ loadKitchen(); }
function listenAccepted(){
    setInterval(()=>{
        db.ref('orders').once('value', snapshot=>{
            snapshot.forEach(snap=>{
                let o = snap.val();
                if(o.status === 'accepted'){
                    pingSound.play().catch(()=>{});
                    db.ref('orders/' + snap.key + '/status').set('notified');
                }
            });
        });
    }, 1000);
}

// Admin
function adminLogin(){
    if(document.getElementById('adminCode').value === '1986'){
        document.getElementById('panel').style.display = 'block';
        loadAdminOrders();
    } else alert('Kod səhvdir!');
}

function loadAdminOrders(){
    db.ref('orders').once('value', snapshot=>{
        const list = document.getElementById('adminList');
        list.innerHTML = '';
        snapshot.forEach(snap=>{
            const o = snap.val();
            const li = document.createElement('li');
            li.innerHTML = `<div><b>Masa ${o.masa}</b><br>${o.mehsul} — ${o.qeyd}<br>${o.time} — ${o.status}</div>`;
            const btn = document.createElement('button');
            btn.textContent = 'Sil';
            btn.onclick = ()=>db.ref('orders/' + snap.key).remove();
            li.appendChild(btn);
            list.appendChild(li);
        });
    });
}

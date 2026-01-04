
const firebaseConfig = {
  apiKey: "AIzaSyCtiUZwkuJun5ZA9ObCCUDTMlqp6deJiYs",
  authDomain: "gestao-banca-b7d07.firebaseapp.com",
  projectId: "gestao-banca-b7d07",
  storageBucket: "gestao-banca-b7d07.firebasestorage.app",
  messagingSenderId: "656878214148",
  appId: "1:656878214148:web:ab56b4bbe386d7a9a6e951"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

let banca = 0;

function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      document.getElementById("login").classList.add("hidden");
      document.getElementById("dashboard").classList.remove("hidden");
      carregarDados();
    })
    .catch(err => alert(err.message));
}

function calcularLucro(stake, odd, resultado) {
  if (resultado === "win") return stake * (odd - 1);
  if (resultado === "loss") return -stake;
  if (resultado === "halfwin") return (stake / 2) * (odd - 1);
  if (resultado === "halfloss") return -(stake / 2);
  return 0;
}

function salvarEntrada() {
  const stake = parseFloat(document.getElementById("stake").value);
  const odd = parseFloat(document.getElementById("odd").value);
  const resultado = document.getElementById("resultado").value;

  const lucro = calcularLucro(stake, odd, resultado);
  banca += lucro;

  db.collection("entradas").add({
    stake, odd, resultado, lucro, banca, data: new Date()
  });

  atualizarTela();
}

function carregarDados() {
  db.collection("entradas").orderBy("data").onSnapshot(snapshot => {
    banca = 0;
    const historico = document.getElementById("historico");
    historico.innerHTML = "";
    snapshot.forEach(doc => {
      const d = doc.data();
      banca = d.banca;
      const li = document.createElement("li");
      li.innerText = `${d.resultado.toUpperCase()} | Lucro: ${d.lucro}`;
      historico.appendChild(li);
    });
    atualizarTela();
  });
}

function atualizarTela() {
  document.getElementById("banca").innerText = banca.toFixed(2);
}
